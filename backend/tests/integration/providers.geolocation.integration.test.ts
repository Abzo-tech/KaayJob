import jwt from "jsonwebtoken";
import providersRoutes from "../../src/routes/providers";
import ProviderController from "../../src/controllers/providerController";
import { query } from "../../src/config/database";

jest.mock("../../src/config/database", () => ({
  query: jest.fn(),
}));

jest.mock("../../src/controllers/providerController", () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(),
    getById: jest.fn(),
    getServices: jest.fn(),
    getReviews: jest.fn(),
    getDashboard: jest.fn(),
    updateProfile: jest.fn(),
    updateAvailability: jest.fn(),
    requestVerification: jest.fn(),
    getStats: jest.fn(),
    getCategories: jest.fn((req, res) =>
      res.json({ success: true, data: ["Plomberie", "Électricité"] }),
    ),
  },
}));

type MockRequest = {
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  query?: Record<string, string>;
};

type MockResponse = {
  statusCode: number;
  body: any;
  status: (code: number) => MockResponse;
  json: (payload: any) => MockResponse;
};

const mockQuery = query as jest.MockedFunction<typeof query>;
const mockProviderController = ProviderController as jest.Mocked<
  typeof ProviderController
>;

function createMockResponse(): MockResponse {
  return {
    statusCode: 200,
    body: undefined,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: any) {
      this.body = payload;
      return this;
    },
  };
}

function getRouteHandlers(method: "get" | "put" | "post", path: string) {
  const layer = (providersRoutes as any).stack.find(
    (entry: any) => entry.route?.path === path && entry.route.methods?.[method],
  );

  if (!layer) {
    throw new Error(`Route ${method.toUpperCase()} ${path} introuvable`);
  }

  return layer.route.stack.map((entry: any) => entry.handle);
}

async function invokeRoute(
  method: "get" | "put" | "post",
  path: string,
  request: MockRequest = {},
) {
  const req: any = {
    method: method.toUpperCase(),
    url: path,
    originalUrl: path,
    body: request.body || {},
    headers: request.headers || {},
    params: request.params || {},
    query: request.query || {},
  };
  const res = createMockResponse();
  const handlers = getRouteHandlers(method, path);

  for (const handler of handlers) {
    await handler(req, res, () => undefined);
    if (res.body !== undefined || res.statusCode >= 400) {
      break;
    }
  }

  return res;
}

describe("Providers geolocation route integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /map", () => {
    it("returns providers with geolocation data", async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: "provider-1",
            first_name: "Ahmed",
            last_name: "Diallo",
            avatar: null,
            specialty: "Plomberie",
            bio: "Expert en plomberie",
            location: "Plateau, Dakar",
            latitude: "14.6937",
            longitude: "-17.4441",
            isVerified: true,
            hourlyRate: "25000",
            yearsExperience: "10",
            isAvailable: true,
            rating: "4.8",
            totalReviews: "12",
            totalBookings: "20",
            distance: null,
          },
        ],
        rowCount: 1,
      } as any);

      const response = await invokeRoute("get", "/map");

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data[0].latitude).toBe(14.6937);
      expect(response.body.data[0].user.firstName).toBe("Ahmed");
    });

    it("includes distance when coordinates are provided", async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: "provider-1",
            first_name: "Ahmed",
            last_name: "Diallo",
            avatar: null,
            specialty: "Plomberie",
            bio: "Expert en plomberie",
            location: "Plateau, Dakar",
            latitude: "14.6937",
            longitude: "-17.4441",
            isVerified: true,
            hourlyRate: "25000",
            yearsExperience: "10",
            isAvailable: true,
            rating: "4.8",
            totalReviews: "12",
            totalBookings: "20",
            distance: "0",
          },
        ],
        rowCount: 1,
      } as any);

      const response = await invokeRoute("get", "/map", {
        query: { lat: "14.6937", lng: "-17.4441", radius: "5" },
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.data[0].distance).toBe(0);
    });
  });

  describe("PUT /profile/location", () => {
    const providerToken = jwt.sign(
      { id: "provider-1", email: "provider@example.com", role: "PRESTATAIRE" },
      process.env.JWT_SECRET || "kaayjob-test-secret",
    );

    it("updates provider location successfully", async () => {
      mockQuery
        .mockResolvedValueOnce({
          rows: [{ role: "PRESTATAIRE" }],
          rowCount: 1,
        } as any)
        .mockResolvedValueOnce({ rows: [], rowCount: 0 } as any)
        .mockResolvedValueOnce({ rows: [], rowCount: 0 } as any);

      const response = await invokeRoute("put", "/profile/location", {
        headers: {
          authorization: `Bearer ${providerToken}`,
        },
        body: {
          latitude: 14.7167,
          longitude: -17.4677,
          address: "Mermoz, Dakar",
          zone: "Sud",
          specialization: "Ménage",
          bio: "Spécialiste du nettoyage",
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("mises à jour");
    });

    it("rejects unauthenticated updates", async () => {
      const response = await invokeRoute("put", "/profile/location", {
        body: {
          latitude: 14.7167,
          longitude: -17.4677,
        },
      });

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it("validates coordinate ranges", async () => {
      const response = await invokeRoute("put", "/profile/location", {
        headers: {
          authorization: `Bearer ${providerToken}`,
        },
        body: {
          latitude: 91,
          longitude: -17.4677,
        },
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toEqual(expect.any(Array));
    });
  });

  describe("GET /categories", () => {
    it("returns available categories", async () => {
      const response = await invokeRoute("get", "/categories");

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(["Plomberie", "Électricité"]);
      expect(mockProviderController.getCategories).toHaveBeenCalled();
    });
  });
});

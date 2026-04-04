import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authRoutes from "../../src/routes/auth";
import { prisma } from "../../src/config/prisma";

jest.mock("../../src/config/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    providerProfile: {
      findUnique: jest.fn(),
    },
  },
}));

type MockRequest = {
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  query?: Record<string, string>;
  user?: unknown;
};

type MockResponse = {
  statusCode: number;
  body: any;
  status: (code: number) => MockResponse;
  json: (payload: any) => MockResponse;
};

const findUniqueMock = prisma.user.findUnique as unknown as jest.Mock;
const createUserMock = prisma.user.create as unknown as jest.Mock;
const providerProfileFindUniqueMock =
  prisma.providerProfile.findUnique as unknown as jest.Mock;

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

function getRouteHandlers(method: "get" | "post" | "put" | "delete", path: string) {
  const layer = (authRoutes as any).stack.find(
    (entry: any) => entry.route?.path === path && entry.route.methods?.[method],
  );

  if (!layer) {
    throw new Error(`Route ${method.toUpperCase()} ${path} introuvable`);
  }

  return layer.route.stack.map((entry: any) => entry.handle);
}

async function invokeRoute(
  method: "get" | "post" | "put" | "delete",
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

describe("Auth route integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /register", () => {
    it("registers a client successfully", async () => {
      findUniqueMock.mockResolvedValueOnce(null);
      createUserMock.mockResolvedValueOnce({
        id: "user-1",
        email: "client@example.com",
        firstName: "John",
        lastName: "Doe",
        phone: "+221771234567",
        role: "CLIENT",
        providerProfile: null,
      });

      const response = await invokeRoute("post", "/register", {
        body: {
          email: "client@example.com",
          password: "Password123",
          firstName: "John",
          lastName: "Doe",
          phone: "+221771234567",
          role: "client",
        },
      });

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.role).toBe("client");
      expect(response.body.data.token).toEqual(expect.any(String));
    });

    it("registers a provider successfully", async () => {
      findUniqueMock.mockResolvedValueOnce(null);
      createUserMock.mockResolvedValueOnce({
        id: "provider-1",
        email: "provider@example.com",
        firstName: "Jane",
        lastName: "Smith",
        phone: "+221772345678",
        role: "PRESTATAIRE",
        providerProfile: { id: "profile-1" },
      });

      const response = await invokeRoute("post", "/register", {
        body: {
          email: "provider@example.com",
          password: "Password123",
          firstName: "Jane",
          lastName: "Smith",
          phone: "+221772345678",
          role: "prestataire",
        },
      });

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.role).toBe("prestataire");
    });

    it("rejects duplicate emails", async () => {
      findUniqueMock.mockResolvedValueOnce({ id: "existing-user" });

      const response = await invokeRoute("post", "/register", {
        body: {
          email: "duplicate@example.com",
          password: "Password123",
          firstName: "Duplicate",
          lastName: "User",
          phone: "+221771234567",
          role: "client",
        },
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("déjà utilisé");
    });

    it("validates required fields", async () => {
      const response = await invokeRoute("post", "/register", {
        body: {
          email: "invalid",
          password: "123",
          firstName: "",
          lastName: "Doe",
        },
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toEqual(expect.any(Array));
    });
  });

  describe("POST /login", () => {
    it("logs in with valid credentials", async () => {
      findUniqueMock.mockResolvedValueOnce({
        id: "user-1",
        email: "login@example.com",
        firstName: "Login",
        lastName: "Test",
        phone: "+221771234567",
        role: "CLIENT",
        avatar: null,
        password: bcrypt.hashSync("Password123", 10),
      });

      const response = await invokeRoute("post", "/login", {
        body: {
          email: "login@example.com",
          password: "Password123",
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe("login@example.com");
    });

    it("rejects a wrong password", async () => {
      findUniqueMock.mockResolvedValueOnce({
        id: "user-1",
        email: "login@example.com",
        firstName: "Login",
        lastName: "Test",
        phone: "+221771234567",
        role: "CLIENT",
        avatar: null,
        password: bcrypt.hashSync("Password123", 10),
      });

      const response = await invokeRoute("post", "/login", {
        body: {
          email: "login@example.com",
          password: "WrongPassword123",
        },
      });

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("incorrect");
    });

    it("rejects unknown users", async () => {
      findUniqueMock.mockResolvedValueOnce(null);

      const response = await invokeRoute("post", "/login", {
        body: {
          email: "missing@example.com",
          password: "Password123",
        },
      });

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /me", () => {
    it("returns the authenticated user profile", async () => {
      const token = jwt.sign(
        { id: "user-1", email: "profile@example.com", role: "CLIENT" },
        process.env.JWT_SECRET || "kaayjob-test-secret",
      );

      findUniqueMock.mockResolvedValueOnce({
        id: "user-1",
        email: "profile@example.com",
        firstName: "Profile",
        lastName: "Test",
        phone: "+221771234567",
        role: "CLIENT",
        avatar: null,
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
      });

      const response = await invokeRoute("get", "/me", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe("profile@example.com");
      expect(providerProfileFindUniqueMock).not.toHaveBeenCalled();
    });

    it("rejects missing tokens", async () => {
      const response = await invokeRoute("get", "/me");

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("Token requis");
    });

    it("rejects invalid tokens", async () => {
      const response = await invokeRoute("get", "/me", {
        headers: {
          authorization: "Bearer invalid-token",
        },
      });

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("Token invalide");
    });
  });
});

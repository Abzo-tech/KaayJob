import {
  createUser,
  getUserById,
  verifyProvider,
} from "../../../src/services/userService";
import { query } from "../../../src/config/database";
import { createFormattedNotification } from "../../../src/services/notificationService";

jest.mock("../../../src/config/database", () => ({
  query: jest.fn(),
}));

jest.mock("../../../src/services/notificationService", () => ({
  createFormattedNotification: jest.fn().mockResolvedValue(undefined),
  createNotification: jest.fn().mockResolvedValue(undefined),
}));

const mockQuery = query as jest.MockedFunction<typeof query>;
const mockCreateFormattedNotification =
  createFormattedNotification as jest.MockedFunction<
    typeof createFormattedNotification
  >;

describe("userService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    it("creates a client user with the default role", async () => {
      mockQuery
        .mockResolvedValueOnce({ rows: [], rowCount: 0 } as any)
        .mockResolvedValueOnce({
          rows: [
            {
              id: "user-1",
              email: "client@example.com",
              first_name: "John",
              last_name: "Doe",
              phone: "+221771234567",
              role: "CLIENT",
              created_at: new Date("2026-01-01T00:00:00.000Z"),
            },
          ],
          rowCount: 1,
        } as any);

      const user = await createUser({
        email: "client@example.com",
        password: "hashedpassword123",
        firstName: "John",
        lastName: "Doe",
        phone: "+221771234567",
      });

      expect(user.email).toBe("client@example.com");
      expect(user.role).toBe("CLIENT");
      expect(mockCreateFormattedNotification).toHaveBeenCalledTimes(1);
    });

    it("notifies existing clients when a provider is created", async () => {
      mockQuery
        .mockResolvedValueOnce({ rows: [], rowCount: 0 } as any)
        .mockResolvedValueOnce({
          rows: [
            {
              id: "provider-1",
              email: "provider@example.com",
              first_name: "Jane",
              last_name: "Smith",
              phone: "+221772345678",
              role: "PRESTATAIRE",
              created_at: new Date("2026-01-01T00:00:00.000Z"),
            },
          ],
          rowCount: 1,
        } as any)
        .mockResolvedValueOnce({
          rows: [{ id: "client-1" }, { id: "client-2" }],
          rowCount: 2,
        } as any);

      const user = await createUser({
        email: "provider@example.com",
        password: "hashedpassword123",
        firstName: "Jane",
        lastName: "Smith",
        phone: "+221772345678",
        role: "PRESTATAIRE",
      });

      expect(user.role).toBe("PRESTATAIRE");
      expect(mockCreateFormattedNotification).toHaveBeenCalledTimes(3);
    });

    it("throws for duplicate email", async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{ id: "existing-user" }],
        rowCount: 1,
      } as any);

      await expect(
        createUser({
          email: "duplicate@example.com",
          password: "hashedpassword123",
          firstName: "Test",
          lastName: "User",
          role: "CLIENT",
        }),
      ).rejects.toThrow("Email déjà utilisé");
    });
  });

  describe("verifyProvider", () => {
    it("creates a provider profile when none exists yet", async () => {
      mockQuery
        .mockResolvedValueOnce({
          rows: [
            {
              role: "PRESTATAIRE",
              first_name: "Jane",
              last_name: "Smith",
            },
          ],
          rowCount: 1,
        } as any)
        .mockResolvedValueOnce({ rows: [], rowCount: 0 } as any)
        .mockResolvedValueOnce({
          rows: [{ id: "profile-1", user_id: "provider-1", is_verified: true }],
          rowCount: 1,
        } as any);

      const result = await verifyProvider("provider-1", "admin-1");

      expect(result.isVerified).toBe(true);
      expect(mockCreateFormattedNotification).toHaveBeenCalledTimes(2);
    });

    it("throws for a non-provider user", async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{ role: "CLIENT", first_name: "John", last_name: "Doe" }],
        rowCount: 1,
      } as any);

      await expect(verifyProvider("client-1", "admin-1")).rejects.toThrow(
        "Cet utilisateur n'est pas un prestataire",
      );
    });

    it("throws when the user does not exist", async () => {
      mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 } as any);

      await expect(
        verifyProvider("missing-provider", "admin-1"),
      ).rejects.toThrow("Utilisateur non trouvé");
    });
  });

  describe("getUserById", () => {
    it("returns the user when found", async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: "provider-1",
            email: "provider@example.com",
            first_name: "Jane",
            last_name: "Smith",
            role: "PRESTATAIRE",
            is_verified: true,
          },
        ],
        rowCount: 1,
      } as any);

      const user = await getUserById("provider-1");

      expect(user.id).toBe("provider-1");
      expect(user.email).toBe("provider@example.com");
      expect(user.isVerified).toBe(true);
    });

    it("throws for an unknown user", async () => {
      mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 } as any);

      await expect(getUserById("missing-user")).rejects.toThrow(
        "Utilisateur non trouvé",
      );
    });
  });
});

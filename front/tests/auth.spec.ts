import { expect, test } from "@playwright/test";

test.describe("Authentication", () => {
  test("registers a new client user", async ({ page }) => {
    await page.route("**/api/auth/register", async (route) => {
      const payload = route.request().postDataJSON();

      expect(payload).toMatchObject({
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean.dupont@example.com",
        phone: "+221771234567",
        role: "client",
      });

      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            user: {
              id: "client-1",
              email: payload.email,
              firstName: payload.firstName,
              lastName: payload.lastName,
              phone: payload.phone,
              role: "client",
            },
            token: "client-token",
          },
        }),
      });
    });

    await page.goto("/");
    await page.getByRole("button", { name: "Connexion" }).click();
    await page.getByRole("tab", { name: "S'inscrire" }).click();

    await page.locator("#customer-name").fill("Jean Dupont");
    await page.locator("#customer-email-signup").fill("jean.dupont@example.com");
    await page.locator("#customer-phone").fill("+221771234567");
    await page.locator("#customer-password-signup").fill("Password123");
    await page.locator("#customer-confirmPassword").fill("Password123");
    await page.getByRole("button", { name: "S'inscrire" }).click();

    await expect(page.getByText("Connexion")).not.toBeVisible();
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("token")))
      .toBe("client-token");
    await expect
      .poll(() =>
        page.evaluate(() => JSON.parse(localStorage.getItem("user") || "{}").role),
      )
      .toBe("client");
  });

  test("logs in with an existing provider account", async ({ page }) => {
    await page.route("**/api/auth/login", async (route) => {
      const payload = route.request().postDataJSON();

      expect(payload).toEqual({
        email: "provider@example.com",
        password: "Password123",
      });

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            user: {
              id: "provider-1",
              email: payload.email,
              firstName: "Awa",
              lastName: "Ndiaye",
              phone: "+221771234567",
              role: "prestataire",
            },
            token: "provider-token",
          },
        }),
      });
    });

    await page.route("**/api/services", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: [] }),
      });
    });

    await page.route("**/api/bookings", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: [] }),
      });
    });

    await page.goto("/");
    await page.getByRole("button", { name: "Connexion" }).click();
    await page.getByRole("tab", { name: "Prestataire" }).click();

    await page.locator("#provider-email").fill("provider@example.com");
    await page.locator("#provider-password").fill("Password123");
    await page.getByRole("button", { name: "Connexion Prestataire" }).click();

    await expect(page.getByText("Espace Prestataire")).toBeVisible();
    await expect(page.getByText("Bienvenue, Awa !")).toBeVisible();
  });

  test("shows an error for invalid credentials", async ({ page }) => {
    await page.route("**/api/auth/login", async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({
          success: false,
          message: "Email ou mot de passe incorrect",
        }),
      });
    });

    await page.goto("/");
    await page.getByRole("button", { name: "Connexion" }).click();

    await page.locator("#customer-email").fill("invalid@example.com");
    await page.locator("#customer-password").fill("WrongPassword123");
    await page.getByRole("button", { name: "Connexion" }).click();

    await expect(page.getByText("Email ou mot de passe incorrect")).toBeVisible();
  });
});

import { expect, test, type Page } from "@playwright/test";

test.describe("Provider Complete Flow", () => {
  const openProviderMenuIfNeeded = async (page: Page) => {
    const viewport = page.viewportSize();

    if (viewport && viewport.width < 1024) {
      await page.getByRole("button", { name: /menu prestataire/i }).click();
    }
  };

  test("registers a provider and opens the provider workspace", async ({
    page,
  }) => {
    await page.route("**/api/auth/register", async (route) => {
      const payload = route.request().postDataJSON();

      expect(payload).toMatchObject({
        firstName: "PrestataireTest",
        lastName: "PrestataireTest",
        email: "provider.ui@example.com",
        phone: "+221781234567",
        role: "prestataire",
      });

      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            user: {
              id: "provider-1",
              email: payload.email,
              firstName: payload.firstName,
              lastName: payload.lastName,
              phone: payload.phone,
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
    await page.getByRole("tab", { name: "S'inscrire" }).click();

    await page.locator("#provider-name").fill("PrestataireTest");
    await page.locator("#provider-email-signup").fill("provider.ui@example.com");
    await page.locator("#provider-phone").fill("+221781234567");
    await page.locator("#provider-password-signup").fill("Password123");
    await page.locator("#provider-confirmPassword").fill("Password123");
    await page
      .getByRole("button", { name: "S'inscrire en tant que Prestataire" })
      .click();

    await expect(page.getByText("Espace Prestataire")).toBeVisible();
    await expect(page.getByText("Bienvenue, PrestataireTest !")).toBeVisible();
  });

  test("navigates to profile, bookings and subscription pages from the provider sidebar", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem("token", "provider-token");
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: "provider-1",
          email: "provider@example.com",
          firstName: "Awa",
          lastName: "Ndiaye",
          phone: "+221781234567",
          role: "prestataire",
        }),
      );
      localStorage.setItem("currentPage", "prestataire-dashboard");
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

    await page.route("**/api/categories", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: [] }),
      });
    });

    await page.route("**/api/services/provider/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: [] }),
      });
    });

    await page.route("**/api/providers/me", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            availability: null,
          },
        }),
      });
    });

    await page.route("**/api/providers/me/subscription", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: null }),
      });
    });

    await page.route("**/api/providers/subscription/plans", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: [] }),
      });
    });

    await page.route("**/api/providers/me/subscription/history", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: [] }),
      });
    });

    await page.route("**/api/providers/me/payments", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: [] }),
      });
    });

    await page.goto("/");

    await expect(page.getByText("Espace Prestataire")).toBeVisible();
    await openProviderMenuIfNeeded(page);
    await page.getByRole("button", { name: "Mon profil" }).click();
    await expect(page.getByText("Informations Personnelles")).toBeVisible();

    await openProviderMenuIfNeeded(page);
    await page.getByRole("button", { name: "Réservations" }).click();
    await expect(page.getByText("Mes réservations")).toBeVisible();

    await openProviderMenuIfNeeded(page);
    await page.getByRole("button", { name: "Abonnement" }).click();
    await expect(page.getByText("Mon Abonnement")).toBeVisible();
  });

  test("validates provider registration inputs before sending the form", async ({
    page,
  }) => {
    let apiCalled = false;

    await page.route("**/api/auth/register", async (route) => {
      apiCalled = true;
      await route.abort();
    });

    await page.goto("/");
    await page.getByRole("button", { name: "Connexion" }).click();
    await page.getByRole("tab", { name: "Prestataire" }).click();
    await page.getByRole("tab", { name: "S'inscrire" }).click();

    await page.locator("#provider-name").fill("PrestataireTest");
    await page.locator("#provider-email-signup").fill("invalid-email");
    await page.locator("#provider-phone").fill("123");
    await page.locator("#provider-password-signup").fill("weak");
    await page.locator("#provider-confirmPassword").fill("weak");
    await page
      .getByRole("button", { name: "S'inscrire en tant que Prestataire" })
      .click();

    await expect(page.getByText("Adresse email invalide")).toBeVisible();
    await expect(
      page.getByText("Le numéro de téléphone doit contenir au moins 8 chiffres"),
    ).toBeVisible();
    await expect(
      page.getByText("Le mot de passe doit contenir au moins 8 caractères"),
    ).toBeVisible();
    expect(apiCalled).toBe(false);
  });
});

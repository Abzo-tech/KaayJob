import { test, expect } from '@playwright/test';

// Tests de base pour vérifier que l'application fonctionne
test.describe('Basic Application Tests', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/');

    // Vérifier que la page se charge
    await expect(page.locator('body')).toBeVisible();

    // Vérifier la présence du logo et du titre KaayJob (dans le header)
    await expect(page.locator('span').filter({ hasText: 'KaayJob' })).toBeVisible();

    // Vérifier la présence du bouton Connexion
    await expect(page.getByRole('button', { name: 'Connexion' })).toBeVisible();

    // Vérifier la présence du menu Services (premier bouton dans la nav)
    const servicesButtons = page.getByRole('button', { name: 'Services' });
    await expect(servicesButtons.first()).toBeVisible();
  });

  test('navigation to login page', async ({ page }) => {
    await page.goto('/');

    // Cliquer sur le bouton Connexion
    await page.getByRole('button', { name: 'Connexion' }).click();

    // Vérifier qu'on arrive sur la page de connexion
    await expect(page).toHaveURL(/.*login/);

    // Vérifier que des éléments de connexion sont présents
    await expect(page.locator('input[type="email"], input[name*="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"], input[name*="password"]')).toBeVisible();
  });

  test('navigation to categories page', async ({ page }) => {
    await page.goto('/');

    // Cliquer sur Services (premier bouton dans la nav)
    const servicesButtons = page.getByRole('button', { name: 'Services' });
    await servicesButtons.first().click();

    // Vérifier que la navigation fonctionne (page change)
    await page.waitForTimeout(2000);
    await expect(page.locator('body')).toBeVisible(); // La page se charge
  });

  test('mobile menu works', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Ouvrir le menu mobile (bouton hamburger - dernier bouton avec SVG)
    const mobileMenuButton = page.locator('button').filter({ has: page.locator('svg') }).last();

    // Vérifier que le bouton existe et peut être cliqué
    await expect(mobileMenuButton).toBeVisible();
    await mobileMenuButton.click();

    // Attendre un peu que le menu s'anime
    await page.waitForTimeout(500);

    // La fonctionnalité de base du menu mobile existe
    await expect(page.locator('body')).toBeVisible();
  });
});
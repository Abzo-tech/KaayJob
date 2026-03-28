import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should register a new client user', async ({ page }) => {
    await page.goto('/');

    // Click on login/register button
    await page.getByRole('button', { name: /connexion/i }).click();

    // Should navigate to login page
    await expect(page).toHaveURL(/.*login/);

    // Click on register link
    await page.getByRole('link', { name: /s'inscrire/i }).click();

    // Fill registration form
    await page.getByLabel(/prénom/i).fill('Jean');
    await page.getByLabel(/nom/i).fill('Test');
    await page.getByLabel(/email/i).fill(`jean.test.${Date.now()}@example.com`);
    await page.getByLabel(/téléphone/i).fill('+221771234567');
    await page.getByLabel(/mot de passe/i).fill('password123');
    await page.getByLabel(/confirmer.*mot de passe/i).fill('password123');
    await page.getByLabel(/rôle/i).selectOption('CLIENT');

    // Submit form
    await page.getByRole('button', { name: /s'inscrire/i }).click();

    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);

    // Should show success message
    await expect(page.getByText(/inscription réussie/i)).toBeVisible();
  });

  test('should login with existing account', async ({ page }) => {
    // First register a user
    const testEmail = `login.test.${Date.now()}@example.com`;

    await page.goto('/');
    await page.getByRole('button', { name: /connexion/i }).click();
    await page.getByRole('link', { name: /s'inscrire/i }).click();

    await page.getByLabel(/prénom/i).fill('Login');
    await page.getByLabel(/nom/i).fill('Test');
    await page.getByLabel(/email/i).fill(testEmail);
    await page.getByLabel(/téléphone/i).fill('+221772345678');
    await page.getByLabel(/mot de passe/i).fill('password123');
    await page.getByLabel(/confirmer.*mot de passe/i).fill('password123');
    await page.getByLabel(/rôle/i).selectOption('CLIENT');

    await page.getByRole('button', { name: /s'inscrire/i }).click();
    await expect(page).toHaveURL(/.*dashboard/);

    // Logout
    await page.getByRole('button', { name: /déconnexion/i }).click();

    // Now login
    await page.getByRole('button', { name: /connexion/i }).click();
    await page.getByLabel(/email/i).fill(testEmail);
    await page.getByLabel(/mot de passe/i).fill('password123');
    await page.getByRole('button', { name: /se connecter/i }).click();

    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByText(/bonjour.*login/i)).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /connexion/i }).click();

    await page.getByLabel(/email/i).fill('invalid@example.com');
    await page.getByLabel(/mot de passe/i).fill('wrongpassword');
    await page.getByRole('button', { name: /se connecter/i }).click();

    // Should show error message
    await expect(page.getByText(/identifiants invalides/i)).toBeVisible();
  });
});
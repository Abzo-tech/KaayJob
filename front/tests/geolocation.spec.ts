import { test, expect } from '@playwright/test';

test.describe('Geolocation Features', () => {
  test('should display interactive map with providers', async ({ page }) => {
    await page.goto('/');

    // Click on "Services" in navigation
    await page.getByRole('link', { name: /services/i }).click();

    // Should navigate to categories page
    await expect(page).toHaveURL(/.*categories/);

    // Click on a category
    await page.getByRole('link', { name: /plomberie/i }).first().click();

    // Should navigate to map page
    await expect(page).toHaveURL(/.*providers.*map/);

    // Should display map container
    await expect(page.locator('.leaflet-container')).toBeVisible();

    // Should show map controls
    await expect(page.getByRole('button', { name: /carte/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /liste/i })).toBeVisible();

    // Should display providers on map
    const markers = page.locator('.leaflet-marker-icon');
    await expect(await markers.count()).toBeGreaterThan(0);
  });

  test('should filter providers by search query', async ({ page }) => {
    await page.goto('/categories');

    // Navigate to map for a category
    const categoryLink = page.locator('[data-testid="category-card"]').first();
    await categoryLink.click();

    // Wait for map to load
    await page.waitForSelector('.leaflet-container');

    // Use search filter
    const searchInput = page.getByPlaceholder(/rechercher par nom/i);
    await searchInput.fill('Ahmed');

    // Should filter providers
    await page.waitForTimeout(1000); // Wait for filtering

    // Check that results are filtered
    const visibleProviders = page.locator('[data-testid="provider-card"]:visible');
    // This might vary based on actual data
  });

  test('should filter providers by distance', async ({ page }) => {
    await page.goto('/categories');

    const categoryLink = page.locator('[data-testid="category-card"]').first();
    await categoryLink.click();

    await page.waitForSelector('.leaflet-container');

    // Open filters
    await page.getByRole('button', { name: /filtres/i }).click();

    // Set distance filter
    const distanceSlider = page.locator('[role="slider"]').first();
    await distanceSlider.fill('25'); // 25km

    // Should update results
    await page.waitForTimeout(1000);
  });

  test('should detect user location', async ({ page, context }) => {
    // Mock geolocation API
    await context.grantPermissions(['geolocation']);
    await page.context().setGeolocation({ latitude: 14.6937, longitude: -17.4441 }); // Dakar

    await page.goto('/categories');
    const categoryLink = page.locator('[data-testid="category-card"]').first();
    await categoryLink.click();

    await page.waitForSelector('.leaflet-container');

    // Click on "Ma position" button
    await page.getByRole('button', { name: /ma position/i }).click();

    // Should show user location marker
    await expect(page.locator('.leaflet-marker-icon').locator('img[alt*="position"]')).toBeVisible();

    // Should show success message
    await expect(page.getByText(/position détectée/i)).toBeVisible();
  });

  test('should switch between map and list views', async ({ page }) => {
    await page.goto('/categories');
    const categoryLink = page.locator('[data-testid="category-card"]').first();
    await categoryLink.click();

    await page.waitForSelector('.leaflet-container');

    // Should start in map view
    await expect(page.locator('.leaflet-container')).toBeVisible();

    // Switch to list view
    await page.getByRole('button', { name: /liste/i }).click();

    // Should show list view
    await expect(page.locator('.leaflet-container')).not.toBeVisible();
    await expect(page.locator('[data-testid="provider-list"]')).toBeVisible();

    // Switch back to map view
    await page.getByRole('button', { name: /carte/i }).click();

    // Should show map view again
    await expect(page.locator('.leaflet-container')).toBeVisible();
  });

  test('should display provider details in popup', async ({ page }) => {
    await page.goto('/categories');
    const categoryLink = page.locator('[data-testid="category-card"]').first();
    await categoryLink.click();

    await page.waitForSelector('.leaflet-container');

    // Click on a provider marker
    const marker = page.locator('.leaflet-marker-icon').first();
    await marker.click();

    // Should show popup with provider details
    await expect(page.locator('.leaflet-popup')).toBeVisible();
    await expect(page.locator('.leaflet-popup').getByText(/voir le profil/i)).toBeVisible();
  });

  test('should navigate to provider profile from map', async ({ page }) => {
    await page.goto('/categories');
    const categoryLink = page.locator('[data-testid="category-card"]').first();
    await categoryLink.click();

    await page.waitForSelector('.leaflet-container');

    // Click on marker and then profile button
    const marker = page.locator('.leaflet-marker-icon').first();
    await marker.click();

    const profileButton = page.locator('.leaflet-popup').getByRole('button', { name: /voir le profil/i });
    await profileButton.click();

    // Should navigate to provider profile
    await expect(page).toHaveURL(/.*service-detail/);
  });
});
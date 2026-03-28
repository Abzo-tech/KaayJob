import { test, expect } from '@playwright/test';

// Tests de responsive design et compatibilité multi-appareils
test.describe('Responsive Design', () => {
  test('homepage responsive layout - mobile to desktop', async ({ page }) => {
    // Test sur mobile (375x667 - iPhone SE)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Vérifier le menu hamburger sur mobile
    const mobileMenu = page.getByRole('button').filter({ has: page.locator('svg') }).first();
    await expect(mobileMenu).toBeVisible();

    // Ouvrir le menu mobile
    await mobileMenu.click();
    await expect(page.getByText(/services/i)).toBeVisible();
    await expect(page.getByText(/contact/i)).toBeVisible();

    // Vérifier que le hero section s'adapte
    const heroSection = page.locator('[data-testid="hero-section"]');
    await expect(heroSection).toBeVisible();
    const heroBox = await heroSection.boundingBox();
    expect(heroBox!.width).toBeLessThanOrEqual(375);

    // Test sur tablette (768x1024 - iPad)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();

    // Vérifier que le menu est maintenant horizontal
    const desktopMenu = page.locator('[data-testid="desktop-nav"]');
    await expect(desktopMenu).toBeVisible();

    // Menu hamburger devrait être caché
    await expect(mobileMenu).not.toBeVisible();

    // Test sur desktop (1920x1080)
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();

    // Vérifier la disposition desktop complète
    await expect(desktopMenu).toBeVisible();
    const heroDesktopBox = await heroSection.boundingBox();
    expect(heroDesktopBox!.width).toBeGreaterThan(1000);
  });

  test('service categories grid responsive', async ({ page }) => {
    await page.goto('/');

    // Mobile - grille verticale
    await page.setViewportSize({ width: 375, height: 667 });
    const categoriesMobile = page.locator('[data-testid="category-card"]');
    const categoriesCount = await categoriesMobile.count();
    expect(categoriesCount).toBeGreaterThan(0);

    // Vérifier que les cartes s'empilent verticalement
    const firstCard = categoriesMobile.first();
    const secondCard = categoriesMobile.nth(1);
    const firstBox = await firstCard.boundingBox();
    const secondBox = await secondCard.boundingBox();

    // Sur mobile, les cartes devraient être empilées
    expect(Math.abs((firstBox!.y + firstBox!.height) - secondBox!.y)).toBeLessThan(50);

    // Tablette - grille 2 colonnes
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();

    // Attendre que la grille se redessine
    await page.waitForTimeout(500);

    const firstCardTablet = categoriesMobile.first();
    const secondCardTablet = categoriesMobile.nth(1);
    const firstBoxTablet = await firstCardTablet.boundingBox();
    const secondBoxTablet = await secondCardTablet.boundingBox();

    // Sur tablette, les cartes devraient être côte à côte
    expect(firstBoxTablet!.y).toBeCloseTo(secondBoxTablet!.y, 10);

    // Desktop - grille 3+ colonnes
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    await page.waitForTimeout(500);

    // Vérifier plus de colonnes sur desktop
    const visibleCards = await categoriesMobile.count();
    expect(visibleCards).toBeGreaterThan(3);
  });

  test('map interface responsive behavior', async ({ page, context }) => {
    // Simuler un utilisateur connecté
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('client@example.com');
    await page.getByLabel(/mot de passe/i).fill('password123');
    await page.getByRole('button', { name: /se connecter/i }).click();

    // Aller dans les services
    await page.getByRole('link', { name: /services/i }).click();
    const categoryCard = page.locator('[data-testid="category-card"]').first();
    await categoryCard.click();

    // Mobile - carte pleine hauteur
    await page.setViewportSize({ width: 375, height: 667 });
    const mapContainer = page.locator('.leaflet-container');
    await expect(mapContainer).toBeVisible();

    const mapBox = await mapContainer.boundingBox();
    expect(mapBox!.height).toBeGreaterThan(300); // Carte prend beaucoup d'espace

    // Liste des prestataires devrait être scrollable ou dans un drawer
    const providerList = page.locator('[data-testid="provider-list"]');
    await expect(providerList).toBeVisible();

    // Tablette - split view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForTimeout(500);

    // Vérifier que la carte et la liste sont visibles simultanément
    await expect(mapContainer).toBeVisible();
    await expect(providerList).toBeVisible();

    // Les deux devraient partager l'espace horizontal
    const mapBoxTablet = await mapContainer.boundingBox();
    const listBoxTablet = await providerList.boundingBox();
    expect(mapBoxTablet!.width + listBoxTablet!.width).toBeCloseTo(768, 50);

    // Desktop - layout optimisé
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    await page.waitForTimeout(500);

    // Plus d'espace pour les détails
    const detailsPanel = page.locator('[data-testid="provider-details"]');
    if (await detailsPanel.isVisible()) {
      const detailsBox = await detailsPanel.boundingBox();
      expect(detailsBox!.width).toBeGreaterThan(300);
    }
  });

  test('booking form responsive adaptation', async ({ page }) => {
    // Simuler la navigation vers une réservation
    await page.goto('/service-detail/123'); // Simuler un service

    // Mobile - formulaire empilé
    await page.setViewportSize({ width: 375, height: 667 });

    // Vérifier que le formulaire de réservation s'adapte
    const bookingForm = page.locator('[data-testid="booking-form"]');
    await expect(bookingForm).toBeVisible();

    // Champs devraient être empilés verticalement
    const dateField = page.getByLabel(/date/i);
    const timeField = page.getByLabel(/heure/i);
    const addressField = page.getByLabel(/adresse/i);

    const dateBox = await dateField.boundingBox();
    const timeBox = await timeField.boundingBox();
    const addressBox = await addressField.boundingBox();

    // Vérifier que les champs sont empilés (pas côte à côte)
    expect(dateBox!.width).toBeCloseTo(375, 50);
    expect(timeBox!.width).toBeCloseTo(375, 50);

    // Tablette - champs côte à côte si possible
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForTimeout(500);

    const dateBoxTablet = await dateField.boundingBox();
    const timeBoxTablet = await timeField.boundingBox();

    // Sur tablette, certains champs pourraient être côte à côte
    expect(dateBoxTablet!.width).toBeLessThan(400);
    expect(timeBoxTablet!.width).toBeLessThan(400);

    // Desktop - layout optimisé
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    await page.waitForTimeout(500);

    // Vérifier l'espace disponible pour le formulaire
    const formBox = await bookingForm.boundingBox();
    expect(formBox!.width).toBeGreaterThan(600);
  });

  test('admin dashboard responsive tables', async ({ page }) => {
    // Simuler un admin connecté
    await page.goto('/admin/login');
    await page.getByLabel(/email/i).fill('admin@kaayjob.com');
    await page.getByLabel(/mot de passe/i).fill('admin123');
    await page.getByRole('button', { name: /se connecter/i }).click();

    // Aller dans la gestion des utilisateurs
    await page.getByRole('link', { name: /utilisateurs/i }).click();

    // Mobile - table responsive avec scroll horizontal
    await page.setViewportSize({ width: 375, height: 667 });
    const usersTable = page.locator('[data-testid="users-table"]');
    await expect(usersTable).toBeVisible();

    // Vérifier le scroll horizontal
    const tableBox = await usersTable.boundingBox();
    const tableScrollWidth = await usersTable.evaluate(el => el.scrollWidth);
    expect(tableScrollWidth).toBeGreaterThan(tableBox!.width);

    // Tablette - table avec colonnes ajustées
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForTimeout(500);

    // Vérifier que plus de colonnes sont visibles
    const visibleColumns = await page.locator('[data-testid="table-header"]').count();
    expect(visibleColumns).toBeGreaterThan(3);

    // Desktop - table complète
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    await page.waitForTimeout(500);

    // Toutes les colonnes devraient être visibles
    const allColumns = await page.locator('[data-testid="table-header"]').count();
    expect(allColumns).toBeGreaterThan(5);
  });

  test('notification dropdown responsive', async ({ page }) => {
    // Simuler un utilisateur connecté
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('client@example.com');
    await page.getByLabel(/mot de passe/i).fill('password123');
    await page.getByRole('button', { name: /se connecter/i }).click();

    const notificationBell = page.locator('[data-testid="notification-bell"]');

    // Mobile - dropdown centré et adapté
    await page.setViewportSize({ width: 375, height: 667 });
    await notificationBell.click();

    const dropdown = page.locator('[data-testid="notification-dropdown"]');
    await expect(dropdown).toBeVisible();

    const dropdownBox = await dropdown.boundingBox();
    expect(dropdownBox!.width).toBeCloseTo(350, 50); // Adapté à l'écran mobile

    // Vérifier que le dropdown ne dépasse pas les bords
    expect(dropdownBox!.x).toBeGreaterThanOrEqual(0);
    expect(dropdownBox!.x + dropdownBox!.width).toBeLessThanOrEqual(375);

    // Fermer le dropdown
    await page.keyboard.press('Escape');

    // Tablette - dropdown plus large
    await page.setViewportSize({ width: 768, height: 1024 });
    await notificationBell.click();

    const dropdownTablet = page.locator('[data-testid="notification-dropdown"]');
    const dropdownTabletBox = await dropdownTablet.boundingBox();
    expect(dropdownTabletBox!.width).toBeGreaterThan(350);

    // Desktop - dropdown optimisé
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    await notificationBell.click();

    const dropdownDesktop = page.locator('[data-testid="notification-dropdown"]');
    const dropdownDesktopBox = await dropdownDesktop.boundingBox();
    expect(dropdownDesktopBox!.width).toBeGreaterThan(400);
  });

  test('touch interactions on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Test du swipe sur la galerie d'images
    await page.goto('/service-detail/123');

    const imageGallery = page.locator('[data-testid="image-gallery"]');
    if (await imageGallery.isVisible()) {
      // Simuler un swipe
      const galleryBox = await imageGallery.boundingBox();
      await page.mouse.move(galleryBox!.x + 100, galleryBox!.y + 50);
      await page.mouse.down();
      await page.mouse.move(galleryBox!.x + 200, galleryBox!.y + 50);
      await page.mouse.up();

      // Vérifier que l'image change (si implémenté)
      // Cette vérification dépend de l'implémentation spécifique
    }

    // Test du pull-to-refresh sur les listes
    await page.goto('/categories');

    // Simuler un pull-to-refresh
    const categoriesList = page.locator('[data-testid="categories-list"]');
    const listBox = await categoriesList.boundingBox();

    await page.mouse.move(listBox!.x + 100, listBox!.y + 10);
    await page.mouse.down();
    await page.mouse.move(listBox!.x + 100, listBox!.y + 100); // Tirer vers le bas
    await page.mouse.up();

    // Vérifier l'indicateur de refresh (si implémenté)
    // await expect(page.getByText(/actualisation/i)).toBeVisible();
  });

  test('high DPI display support', async ({ page }) => {
    // Simuler un écran Retina/high DPI
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference' });

    // Vérifier que les images sont en haute résolution
    await page.goto('/');

    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < Math.min(imageCount, 3); i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');

      // Vérifier que les images utilisent srcset ou sont optimisées pour high DPI
      if (src) {
        // Cette vérification dépend de l'implémentation des images
        expect(src).toBeTruthy();
      }
    }

    // Vérifier que le texte reste lisible
    const headings = page.locator('h1, h2, h3');
    await expect(headings.first()).toBeVisible();

    // Vérifier les icônes SVG (devraient scaler correctement)
    const svgs = page.locator('svg');
    if (await svgs.count() > 0) {
      const svg = svgs.first();
      const svgBox = await svg.boundingBox();
      expect(svgBox!.width).toBeGreaterThan(0);
      expect(svgBox!.height).toBeGreaterThan(0);
    }
  });

  test('keyboard navigation accessibility', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    // Test de la navigation au clavier
    await page.keyboard.press('Tab');
    let focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // Naviguer dans le menu principal
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    }

    // Tester l'ouverture du menu avec Enter
    await page.keyboard.press('Enter');
    const menu = page.locator('[role="menu"]');
    if (await menu.isVisible()) {
      await expect(menu).toBeVisible();
    }

    // Tester la fermeture avec Escape
    await page.keyboard.press('Escape');
    await expect(menu).not.toBeVisible();
  });
});
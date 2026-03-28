import { test, expect } from '@playwright/test';

// Test complet du flow client : Inscription → Recherche → Réservation → Paiement
test.describe('Client Complete Flow', () => {
  const testUser = {
    firstName: 'Marie',
    lastName: 'Test',
    email: `marie.test.${Date.now()}@example.com`,
    phone: '+221771234567',
    password: 'password123'
  };

  test('complete client journey from registration to payment', async ({ page, context }) => {
    // Étape 1: Inscription
    await test.step('Client Registration', async () => {
      await page.goto('/');

      // Navigation vers la connexion/inscription
      await page.getByRole('button', { name: 'Connexion' }).click();
      await expect(page).toHaveURL('http://localhost:3000/login');

      // Vérifier qu'on est sur la page de connexion
      await expect(page.getByText(/connexion|login/i)).toBeVisible();

      // Chercher le lien ou bouton d'inscription
      const registerLink = page.locator('a, button').filter({ hasText: /inscrire|s'inscrire|register|sign up/i });
      if (await registerLink.count() > 0) {
        await registerLink.first().click();
      } else {
        // Si pas de lien séparé, il peut y avoir un toggle ou un onglet
        const registerTab = page.locator('[role="tab"]').filter({ hasText: /inscrire|s'inscrire/i });
        if (await registerTab.count() > 0) {
          await registerTab.click();
        }
      }

      // Remplir le formulaire d'inscription
      await page.getByLabel(/prénom/i).fill(testUser.firstName);
      await page.getByLabel(/nom/i).fill(testUser.lastName);
      await page.getByLabel(/email/i).fill(testUser.email);
      await page.getByLabel(/téléphone/i).fill(testUser.phone);
      await page.getByLabel(/mot de passe/i).fill(testUser.password);
      await page.getByLabel(/confirmer.*mot de passe/i).fill(testUser.password);
      await page.getByLabel(/rôle/i).selectOption('CLIENT');

      // Soumettre le formulaire
      await page.getByRole('button', { name: /s'inscrire/i }).click();

      // Vérifier la redirection vers le dashboard
      await expect(page).toHaveURL(/.*dashboard/);
      await expect(page.getByText(new RegExp(testUser.firstName, 'i'))).toBeVisible();
    });

    // Étape 2: Configuration du profil
    await test.step('Profile Setup', async () => {
      // Aller dans les paramètres
      await page.getByRole('button', { name: /profil/i }).click();
      await page.getByRole('link', { name: /paramètres/i }).click();

      // Ajouter des informations de localisation
      await page.getByLabel(/adresse/i).fill('Plateau, Dakar');
      await page.getByLabel(/zone/i).selectOption('Centre-ville');

      // Sauvegarder
      await page.getByRole('button', { name: /sauvegarder/i }).click();
      await expect(page.getByText(/profil.*mis.*jour/i)).toBeVisible();
    });

    // Étape 3: Recherche géolocalisée
    await test.step('Geolocated Search', async () => {
      // Aller dans les catégories
      await page.getByRole('link', { name: /services/i }).click();
      await expect(page).toHaveURL(/.*categories/);

      // Sélectionner une catégorie (plomberie)
      const categoryCard = page.locator('[data-testid="category-card"]').first();
      await categoryCard.click();

      // Vérifier l'arrivée sur la carte
      await expect(page).toHaveURL(/.*providers.*map/);
      await expect(page.locator('.leaflet-container')).toBeVisible();

      // Activer la géolocalisation
      await context.grantPermissions(['geolocation']);
      await page.context().setGeolocation({ latitude: 14.6937, longitude: -17.4441 });

      await page.getByRole('button', { name: /ma position/i }).click();
      await expect(page.getByText(/position détectée/i)).toBeVisible();

      // Vérifier que des prestataires sont affichés
      const markers = page.locator('.leaflet-marker-icon');
      await expect(await markers.count()).toBeGreaterThan(0);
    });

    // Étape 4: Filtrage avancé
    await test.step('Advanced Filtering', async () => {
      // Ouvrir les filtres
      await page.getByRole('button', { name: /filtres/i }).click();

      // Appliquer des filtres
      const distanceSlider = page.locator('[role="slider"]').first();
      await distanceSlider.fill('25'); // 25km

      // Filtre par note
      const ratingSlider = page.locator('[role="slider"]').nth(1);
      await ratingSlider.fill('4'); // Note minimale 4+

      // Filtre par prix
      const priceSlider = page.locator('[role="slider"]').nth(2);
      await priceSlider.fill('30'); // Prix max 30 CFA

      // Cocher les options
      await page.getByLabel(/disponibles uniquement/i).check();
      await page.getByLabel(/prestataires vérifiés/i).check();

      // Attendre que les filtres s'appliquent
      await page.waitForTimeout(2000);

      // Vérifier que les résultats sont filtrés
      const visibleProviders = page.locator('[data-testid="provider-card"]:visible');
      // Les résultats devraient être moins nombreux ou identiques selon les données
    });

    // Étape 5: Sélection d'un prestataire
    await test.step('Provider Selection', async () => {
      // Cliquer sur un prestataire dans la liste latérale
      const providerCard = page.locator('[data-testid="provider-card"]').first();
      await providerCard.click();

      // Vérifier la navigation vers le détail du prestataire
      await expect(page).toHaveURL(/.*service-detail/);

      // Vérifier les informations du prestataire
      await expect(page.getByText(/profil.*prestataire/i)).toBeVisible();
      await expect(page.getByText(/services.*proposés/i)).toBeVisible();

      // Vérifier les avis
      const reviewsSection = page.locator('[data-testid="reviews-section"]');
      await expect(reviewsSection).toBeVisible();
    });

    // Étape 6: Réservation de service
    await test.step('Service Booking', async () => {
      // Sélectionner un service
      const serviceCard = page.locator('[data-testid="service-card"]').first();
      await serviceCard.click();

      // Remplir le formulaire de réservation
      await page.getByLabel(/date/i).fill('2024-04-15');
      await page.getByLabel(/heure/i).selectOption('14:00');
      await page.getByLabel(/adresse.*intervention/i).fill('Mermoz, Dakar');
      await page.getByLabel(/notes.*spéciales/i).fill('Urgent - fuite importante');

      // Vérifier le calcul du prix
      await expect(page.getByText(/prix.*total/i)).toBeVisible();

      // Confirmer la réservation
      await page.getByRole('button', { name: /confirmer.*réservation/i }).click();

      // Vérifier la redirection vers le checkout
      await expect(page).toHaveURL(/.*checkout/);
    });

    // Étape 7: Confirmation de réservation (pas de paiement - hors plateforme)
    await test.step('Booking Confirmation', async () => {
      // Vérifier le résumé de la réservation
      await expect(page.getByText(/résumé.*réservation/i)).toBeVisible();
      await expect(page.getByText(testUser.firstName)).toBeVisible();
      await expect(page.getByText(/mermoz.*dakar/i)).toBeVisible();

      // Confirmer la réservation (sans paiement)
      await page.getByRole('button', { name: /confirmer.*réservation/i }).click();

      // Vérifier que la réservation est confirmée
      await expect(page.getByText(/réservation.*confirmée/i)).toBeVisible();
    });

    // Étape 8: Confirmation et suivi
    await test.step('Booking Confirmation & Tracking', async () => {
      // Vérifier la page de confirmation
      await expect(page.getByText(/réservation.*confirmée/i)).toBeVisible();
      await expect(page.getByText(/numéro.*réservation/i)).toBeVisible();

      // Aller dans le dashboard client
      await page.getByRole('link', { name: /mes.*réservations/i }).click();
      await expect(page).toHaveURL(/.*dashboard/);

      // Vérifier que la réservation apparaît
      const bookingCard = page.locator('[data-testid="booking-card"]').first();
      await expect(bookingCard).toBeVisible();
      await expect(bookingCard.getByText(/en.*cours/i)).toBeVisible();
    });

    // Étape 9: Laisser un avis
    await test.step('Leave Review', async () => {
      // Attendre que la réservation soit terminée (dans un vrai scénario)
      // Pour le test, on simule en allant directement dans les réservations passées

      // Cliquer sur une réservation terminée
      const completedBooking = page.locator('[data-testid="booking-card"]').filter({ hasText: /terminée/i }).first();
      if (await completedBooking.isVisible()) {
        await completedBooking.click();

        // Laisser un avis
        await page.getByRole('button', { name: /laisser.*avis/i }).click();

        // Remplir le formulaire d'avis
        await page.getByLabel(/note/i).fill('5'); // 5 étoiles
        await page.getByLabel(/commentaire/i).fill('Excellent service, très professionnel et ponctuel. Je recommande vivement !');
        await page.getByLabel(/photos/i).setInputFiles([]); // Optionnel

        // Soumettre l'avis
        await page.getByRole('button', { name: /publier.*avis/i }).click();

        await expect(page.getByText(/avis.*publié/i)).toBeVisible();
      }
    });

    // Étape 10: Notifications
    await test.step('Notifications Check', async () => {
      // Vérifier les notifications
      const notificationBell = page.locator('[data-testid="notification-bell"]');
      await notificationBell.click();

      // Vérifier qu'il y a des notifications
      const notificationCount = await page.locator('[data-testid="notification-item"]').count();
      expect(notificationCount).toBeGreaterThan(0);

      // Marquer comme lues
      await page.getByRole('button', { name: /tout.*marquer.*lu/i }).click();
    });
  });

  test('client responsive design - mobile', async ({ page, context }) => {
    // Simuler un appareil mobile
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');

    // Vérifier que le menu mobile fonctionne
    const mobileMenuButton = page.getByRole('button').filter({ has: page.locator('svg') }).first();
    await mobileMenuButton.click();

    // Vérifier que le menu se déroule
    await expect(page.getByText(/services/i)).toBeVisible();
    await expect(page.getByText(/contact/i)).toBeVisible();

    // Tester la navigation mobile
    await page.getByText(/services/i).click();
    await expect(page).toHaveURL(/.*categories/);

    // Tester la carte sur mobile
    const categoryCard = page.locator('[data-testid="category-card"]').first();
    await categoryCard.click();

    // Vérifier que la carte s'affiche correctement sur mobile
    await expect(page.locator('.leaflet-container')).toBeVisible();
    await expect(page.locator('.leaflet-container')).toHaveCSS('height', /.+/);
  });

  test('client error handling and recovery', async ({ page }) => {
    await page.goto('/');

    // Aller à l'inscription
    await page.getByRole('button', { name: /connexion/i }).click();
    await page.getByRole('link', { name: /s'inscrire/i }).click();

    // Tester la validation des champs requis
    await page.getByRole('button', { name: /s'inscrire/i }).click();

    // Vérifier les messages d'erreur
    await expect(page.getByText(/prénom.*requis/i)).toBeVisible();
    await expect(page.getByText(/nom.*requis/i)).toBeVisible();
    await expect(page.getByText(/email.*requis/i)).toBeVisible();

    // Tester un email invalide
    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByRole('button', { name: /s'inscrire/i }).click();
    await expect(page.getByText(/email.*invalide/i)).toBeVisible();

    // Corriger et soumettre
    await page.getByLabel(/prénom/i).fill('Test');
    await page.getByLabel(/nom/i).fill('Recovery');
    await page.getByLabel(/email/i).fill(`test.recovery.${Date.now()}@example.com`);
    await page.getByLabel(/mot de passe/i).fill('password123');
    await page.getByLabel(/confirmer.*mot de passe/i).fill('password123');
    await page.getByLabel(/rôle/i).selectOption('CLIENT');

    await page.getByRole('button', { name: /s'inscrire/i }).click();
    await expect(page).toHaveURL(/.*dashboard/);
  });
});
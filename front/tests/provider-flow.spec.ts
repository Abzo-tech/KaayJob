import { test, expect } from '@playwright/test';

// Test complet du flow prestataire : Inscription → Profil → Services → Réservations
test.describe('Provider Complete Flow', () => {
  const testProvider = {
    firstName: 'Amadou',
    lastName: 'Diallo',
    email: `amadou.diallo.${Date.now()}@example.com`,
    phone: '+221781234567',
    password: 'password123',
    businessName: 'Diallo Services',
    description: 'Services de plomberie professionnels avec plus de 10 ans d\'expérience',
    address: 'Mermoz, Dakar',
    categories: ['Plomberie', 'Électricité'],
    zones: ['Plateau', 'Mermoz', 'Yoff']
  };

  test('complete provider journey from registration to booking management', async ({ page, context }) => {
    // Étape 1: Inscription prestataire
    await test.step('Provider Registration', async () => {
      await page.goto('/');

      // Navigation vers l'inscription
      await page.getByRole('button', { name: /connexion/i }).click();
      await page.getByRole('link', { name: /s'inscrire/i }).click();

      // Remplir le formulaire d'inscription
      await page.getByLabel(/prénom/i).fill(testProvider.firstName);
      await page.getByLabel(/nom/i).fill(testProvider.lastName);
      await page.getByLabel(/email/i).fill(testProvider.email);
      await page.getByLabel(/téléphone/i).fill(testProvider.phone);
      await page.getByLabel(/mot de passe/i).fill(testProvider.password);
      await page.getByLabel(/confirmer.*mot de passe/i).fill(testProvider.password);
      await page.getByLabel(/rôle/i).selectOption('PRESTATAIRE');

      // Soumettre le formulaire
      await page.getByRole('button', { name: /s'inscrire/i }).click();

      // Vérifier la redirection vers le dashboard prestataire
      await expect(page).toHaveURL(/.*prestataire.*dashboard/);
      await expect(page.getByText(new RegExp(testProvider.firstName, 'i'))).toBeVisible();
    });

    // Étape 2: Configuration complète du profil
    await test.step('Complete Profile Setup', async () => {
      // Aller dans les paramètres
      await page.getByRole('button', { name: /profil/i }).click();
      await page.getByRole('link', { name: /paramètres/i }).click();

      // Informations générales
      await page.getByLabel(/nom.*entreprise/i).fill(testProvider.businessName);
      await page.getByLabel(/description/i).fill(testProvider.description);
      await page.getByLabel(/adresse/i).fill(testProvider.address);

      // Zones de service
      for (const zone of testProvider.zones) {
        await page.getByLabel(new RegExp(zone, 'i')).check();
      }

      // Catégories de services
      for (const category of testProvider.categories) {
        await page.getByLabel(new RegExp(category, 'i')).check();
      }

      // Documents (simulés)
      await page.getByLabel(/photo.*profil/i).setInputFiles([]); // Simuler l'upload
      await page.getByLabel(/carte.*professionnelle/i).setInputFiles([]);
      await page.getByLabel(/certificats/i).setInputFiles([]);

      // Informations bancaires
      await page.getByLabel(/numéro.*compte/i).fill('SN1234567890123456789012');
      await page.getByLabel(/banque/i).selectOption('CBAO');
      await page.getByLabel(/nom.*bénéficiaire/i).fill(`${testProvider.firstName} ${testProvider.lastName}`);

      // Sauvegarder
      await page.getByRole('button', { name: /sauvegarder/i }).click();
      await expect(page.getByText(/profil.*mis.*jour/i)).toBeVisible();
    });

    // Étape 3: Ajout de services
    await test.step('Services Management', async () => {
      // Aller dans la section services
      await page.getByRole('link', { name: /mes.*services/i }).click();
      await expect(page).toHaveURL(/.*services/);

      // Ajouter un nouveau service
      await page.getByRole('button', { name: /ajouter.*service/i }).click();

      // Remplir le formulaire de service
      await page.getByLabel(/nom.*service/i).fill('Réparation de fuite d\'eau');
      await page.getByLabel(/description/i).fill('Réparation complète de fuites d\'eau, remplacement de joints, etc.');
      await page.getByLabel(/catégorie/i).selectOption('Plomberie');
      await page.getByLabel(/prix.*base/i).fill('15000');
      await page.getByLabel(/durée.*estimée/i).selectOption('2 heures');
      await page.getByLabel(/disponible/i).check();

      // Photos du service
      await page.getByLabel(/photos.*service/i).setInputFiles([]);

      // Sauvegarder le service
      await page.getByRole('button', { name: /sauvegarder/i }).click();
      await expect(page.getByText(/service.*ajouté/i)).toBeVisible();

      // Ajouter un deuxième service
      await page.getByRole('button', { name: /ajouter.*service/i }).click();
      await page.getByLabel(/nom.*service/i).fill('Installation de chauffe-eau');
      await page.getByLabel(/description/i).fill('Installation complète de chauffe-eau électrique ou gaz');
      await page.getByLabel(/catégorie/i).selectOption('Plomberie');
      await page.getByLabel(/prix.*base/i).fill('25000');
      await page.getByLabel(/durée.*estimée/i).selectOption('4 heures');
      await page.getByLabel(/disponible/i).check();
      await page.getByRole('button', { name: /sauvegarder/i }).click();
    });

    // Étape 4: Gestion de disponibilité
    await test.step('Availability Management', async () => {
      // Aller dans la section planning
      await page.getByRole('link', { name: /planning/i }).click();

      // Configurer les horaires de travail
      await page.getByLabel(/lundi/i).check();
      await page.getByLabel(/horaire.*début.*lundi/i).selectOption('08:00');
      await page.getByLabel(/horaire.*fin.*lundi/i).selectOption('18:00');

      await page.getByLabel(/mardi/i).check();
      await page.getByLabel(/horaire.*début.*mardi/i).selectOption('08:00');
      await page.getByLabel(/horaire.*fin.*mardi/i).selectOption('18:00');

      // Configurer les jours de congé
      await page.getByRole('button', { name: /ajouter.*congé/i }).click();
      await page.getByLabel(/date.*début/i).fill('2024-04-01');
      await page.getByLabel(/date.*fin/i).fill('2024-04-05');
      await page.getByLabel(/raison/i).fill('Congé annuel');

      // Sauvegarder
      await page.getByRole('button', { name: /sauvegarder/i }).click();
      await expect(page.getByText(/disponibilité.*mise.*jour/i)).toBeVisible();
    });

    // Étape 5: Gestion des réservations
    await test.step('Booking Management', async () => {
      // Aller dans les réservations
      await page.getByRole('link', { name: /réservations/i }).click();
      await expect(page).toHaveURL(/.*bookings/);

      // Simuler une nouvelle réservation (dans un vrai test, cela viendrait d'un client)
      // Pour le test, on suppose qu'il y a déjà des réservations

      const pendingBookings = page.locator('[data-testid="booking-card"]').filter({ hasText: /en attente/i });
      if (await pendingBookings.count() > 0) {
        // Accepter une réservation
        const firstPending = pendingBookings.first();
        await firstPending.getByRole('button', { name: /accepter/i }).click();

        // Confirmer l'acceptation
        await page.getByRole('button', { name: /confirmer/i }).click();
        await expect(page.getByText(/réservation.*acceptée/i)).toBeVisible();

        // Marquer comme terminée
        await firstPending.getByRole('button', { name: /marquer.*terminée/i }).click();
        await expect(page.getByText(/réservation.*terminée/i)).toBeVisible();
      }
    });

    // Étape 6: Gestion des avis et réputation
    await test.step('Reviews and Reputation', async () => {
      // Aller dans les avis
      await page.getByRole('link', { name: /avis/i }).click();

      // Répondre à un avis
      const reviewCard = page.locator('[data-testid="review-card"]').first();
      if (await reviewCard.isVisible()) {
        await reviewCard.getByRole('button', { name: /répondre/i }).click();
        await page.getByLabel(/réponse/i).fill('Merci pour votre confiance et votre retour positif. À bientôt !');
        await page.getByRole('button', { name: /publier/i }).click();
        await expect(page.getByText(/réponse.*publiée/i)).toBeVisible();
      }

      // Vérifier les statistiques
      await expect(page.getByText(/note.*moyenne/i)).toBeVisible();
      await expect(page.getByText(/total.*avis/i)).toBeVisible();
    });

    // Étape 7: Gestion financière
    await test.step('Financial Management', async () => {
      // Aller dans les paiements
      await page.getByRole('link', { name: /paiements/i }).click();

      // Vérifier l'historique des paiements
      await expect(page.getByText(/historique.*paiements/i)).toBeVisible();
      await expect(page.getByText(/solde.*disponible/i)).toBeVisible();

      // Vérifier les réservations payées
      const paidBookings = page.locator('[data-testid="payment-item"]').filter({ hasText: /payé/i });
      if (await paidBookings.count() > 0) {
        await expect(paidBookings.first()).toBeVisible();
      }
    });

    // Étape 8: Notifications et communication
    await test.step('Notifications and Communication', async () => {
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

  test('provider profile verification process', async ({ page }) => {
    // Simuler un prestataire existant en attente de vérification
    await page.goto('/prestataire/login');

    // Se connecter (simulé)
    await page.getByLabel(/email/i).fill('verified.provider@example.com');
    await page.getByLabel(/mot de passe/i).fill('password123');
    await page.getByRole('button', { name: /se connecter/i }).click();

    // Vérifier le statut de vérification
    await expect(page.getByText(/profil.*en.*cours.*vérification/i)).toBeVisible();

    // Aller dans les paramètres pour voir le statut
    await page.getByRole('link', { name: /paramètres/i }).click();
    await expect(page.getByText(/documents.*soumis/i)).toBeVisible();

    // Vérifier que certaines fonctionnalités sont limitées
    await page.getByRole('link', { name: /réservations/i }).click();
    await expect(page.getByText(/profil.*doit.*être.*vérifié/i)).toBeVisible();
  });

  test('provider subscription management', async ({ page }) => {
    // Simuler un prestataire avec abonnement
    await page.goto('/prestataire/login');

    await page.getByLabel(/email/i).fill('subscribed.provider@example.com');
    await page.getByLabel(/mot de passe/i).fill('password123');
    await page.getByRole('button', { name: /se connecter/i }).click();

    // Aller dans l'abonnement
    await page.getByRole('link', { name: /abonnement/i }).click();

    // Vérifier l'abonnement actuel
    await expect(page.getByText(/plan.*actuel/i)).toBeVisible();
    await expect(page.getByText(/date.*expiration/i)).toBeVisible();

    // Tester le changement de plan
    await page.getByRole('button', { name: /changer.*plan/i }).click();
    await page.getByLabel(/plan.*premium/i).check();
    await page.getByRole('button', { name: /mettre.*jour/i }).click();

    // Confirmer le paiement
    await expect(page.getByText(/paiement.*requis/i)).toBeVisible();
  });

  test('provider error handling and recovery', async ({ page }) => {
    await page.goto('/prestataire/register');

    // Tester la validation des champs
    await page.getByRole('button', { name: /s'inscrire/i }).click();

    // Vérifier les erreurs
    await expect(page.getByText(/nom.*entreprise.*requis/i)).toBeVisible();
    await expect(page.getByText(/catégorie.*requise/i)).toBeVisible();

    // Tester email déjà utilisé
    await page.getByLabel(/email/i).fill('existing@example.com');
    await page.getByRole('button', { name: /s'inscrire/i }).click();
    await expect(page.getByText(/email.*déjà.*utilisé/i)).toBeVisible();

    // Corriger et soumettre
    await page.getByLabel(/nom.*entreprise/i).fill('Test Services');
    await page.getByLabel(/email/i).fill(`test.${Date.now()}@example.com`);
    await page.getByLabel(/mot de passe/i).fill('password123');
    await page.getByLabel(/catégorie/i).selectOption('Plomberie');

    await page.getByRole('button', { name: /s'inscrire/i }).click();
    await expect(page).toHaveURL(/.*dashboard/);
  });
});
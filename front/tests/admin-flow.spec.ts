import { test, expect } from '@playwright/test';

// Test complet du flow admin : Gestion utilisateurs → Modération → Analytics
test.describe('Admin Complete Flow', () => {
  const adminCredentials = {
    email: 'admin@kaayjob.com',
    password: 'admin123'
  };

  test('complete admin journey from login to system management', async ({ page }) => {
    // Étape 1: Connexion admin
    await test.step('Admin Login', async () => {
      await page.goto('/admin/login');

      // Remplir les identifiants
      await page.getByLabel(/email/i).fill(adminCredentials.email);
      await page.getByLabel(/mot de passe/i).fill(adminCredentials.password);

      // Se connecter
      await page.getByRole('button', { name: /se connecter/i }).click();

      // Vérifier l'accès au dashboard admin
      await expect(page).toHaveURL(/.*admin.*dashboard/);
      await expect(page.getByText(/tableau.*bord.*admin/i)).toBeVisible();
    });

    // Étape 2: Gestion des utilisateurs
    await test.step('User Management', async () => {
      // Aller dans la section utilisateurs
      await page.getByRole('link', { name: /utilisateurs/i }).click();
      await expect(page).toHaveURL(/.*admin.*users/);

      // Vérifier la liste des utilisateurs
      await expect(page.getByText(/liste.*utilisateurs/i)).toBeVisible();

      // Rechercher un utilisateur
      await page.getByLabel(/rechercher/i).fill('test@example.com');
      await page.getByRole('button', { name: /rechercher/i }).click();

      // Vérifier les résultats
      const userRow = page.locator('[data-testid="user-row"]').first();
      await expect(userRow).toBeVisible();

      // Voir les détails d'un utilisateur
      await userRow.getByRole('button', { name: /voir.*détails/i }).click();
      await expect(page.getByText(/profil.*utilisateur/i)).toBeVisible();

      // Modifier le statut d'un utilisateur
      await page.getByRole('button', { name: /modifier.*statut/i }).click();
      await page.getByLabel(/statut/i).selectOption('ACTIF');
      await page.getByRole('button', { name: /sauvegarder/i }).click();
      await expect(page.getByText(/statut.*mis.*jour/i)).toBeVisible();
    });

    // Étape 3: Modération des prestataires
    await test.step('Provider Moderation', async () => {
      // Aller dans la section prestataires
      await page.getByRole('link', { name: /prestataires/i }).click();
      await expect(page).toHaveURL(/.*admin.*providers/);

      // Vérifier les prestataires en attente de vérification
      const pendingProviders = page.locator('[data-testid="provider-card"]').filter({ hasText: /en attente/i });
      if (await pendingProviders.count() > 0) {
        const firstPending = pendingProviders.first();
        await firstPending.getByRole('button', { name: /vérifier/i }).click();

        // Vérifier les documents
        await expect(page.getByText(/documents.*prestataire/i)).toBeVisible();
        await expect(page.getByText(/carte.*professionnelle/i)).toBeVisible();

        // Approuver le prestataire
        await page.getByRole('button', { name: /approuver/i }).click();
        await page.getByRole('button', { name: /confirmer/i }).click();
        await expect(page.getByText(/prestataire.*approuvé/i)).toBeVisible();
      }

      // Rejeter un prestataire problématique
      const problematicProviders = page.locator('[data-testid="provider-card"]').filter({ hasText: /signalé/i });
      if (await problematicProviders.count() > 0) {
        const firstProblematic = problematicProviders.first();
        await firstProblematic.getByRole('button', { name: /rejeter/i }).click();

        await page.getByLabel(/raison/i).fill('Documents non conformes');
        await page.getByRole('button', { name: /rejeter/i }).click();
        await expect(page.getByText(/prestataire.*rejeté/i)).toBeVisible();
      }
    });

    // Étape 4: Gestion des réservations
    await test.step('Booking Supervision', async () => {
      // Aller dans les réservations
      await page.getByRole('link', { name: /réservations/i }).click();
      await expect(page).toHaveURL(/.*admin.*bookings/);

      // Vérifier les réservations récentes
      await expect(page.getByText(/réservations.*récentes/i)).toBeVisible();

      // Filtrer par statut
      await page.getByLabel(/statut/i).selectOption('CONFLIT');
      await page.getByRole('button', { name: /filtrer/i }).click();

      // Résoudre un conflit
      const conflictBookings = page.locator('[data-testid="booking-card"]').filter({ hasText: /conflit/i });
      if (await conflictBookings.count() > 0) {
        const firstConflict = conflictBookings.first();
        await firstConflict.getByRole('button', { name: /résoudre/i }).click();

        await page.getByLabel(/décision/i).selectOption('REMBoursEMENT_CLIENT');
        await page.getByLabel(/commentaire/i).fill('Service non rendu correctement');
        await page.getByRole('button', { name: /appliquer/i }).click();
        await expect(page.getByText(/conflit.*résolu/i)).toBeVisible();
      }

      // Annuler une réservation abusive
      await page.getByLabel(/statut/i).selectOption('TOUTES');
      await page.getByRole('button', { name: /filtrer/i }).click();

      const abusiveBookings = page.locator('[data-testid="booking-card"]').filter({ hasText: /signalée/i });
      if (await abusiveBookings.count() > 0) {
        const firstAbusive = abusiveBookings.first();
        await firstAbusive.getByRole('button', { name: /annuler/i }).click();

        await page.getByLabel(/motif/i).fill('Réservation abusive');
        await page.getByRole('button', { name: /confirmer.*annulation/i }).click();
        await expect(page.getByText(/réservation.*annulée/i)).toBeVisible();
      }
    });

    // Étape 5: Gestion des catégories
    await test.step('Category Management', async () => {
      // Aller dans les catégories
      await page.getByRole('link', { name: /catégories/i }).click();
      await expect(page).toHaveURL(/.*admin.*categories/);

      // Ajouter une nouvelle catégorie
      await page.getByRole('button', { name: /ajouter.*catégorie/i }).click();

      await page.getByLabel(/nom/i).fill('Jardinage');
      await page.getByLabel(/description/i).fill('Services de jardinage et entretien d\'espaces verts');
      await page.getByLabel(/icône/i).setInputFiles([]); // Upload d'icône
      await page.getByLabel(/image/i).setInputFiles([]); // Upload d'image
      await page.getByLabel(/active/i).check();

      await page.getByRole('button', { name: /sauvegarder/i }).click();
      await expect(page.getByText(/catégorie.*ajoutée/i)).toBeVisible();

      // Modifier une catégorie existante
      const categoryCard = page.locator('[data-testid="category-card"]').filter({ hasText: /plomberie/i }).first();
      await categoryCard.getByRole('button', { name: /modifier/i }).click();

      await page.getByLabel(/description/i).fill('Services de plomberie mis à jour');
      await page.getByRole('button', { name: /sauvegarder/i }).click();
      await expect(page.getByText(/catégorie.*modifiée/i)).toBeVisible();
    });

    // Étape 6: Analytics et rapports
    await test.step('Analytics and Reports', async () => {
      // Aller dans les analytics
      await page.getByRole('link', { name: /analytics/i }).click();
      await expect(page).toHaveURL(/.*admin.*analytics/);

      // Vérifier les métriques principales
      await expect(page.getByText(/utilisateurs.*total/i)).toBeVisible();
      await expect(page.getByText(/réservations.*total/i)).toBeVisible();
      await expect(page.getByText(/chiffre.*affaires/i)).toBeVisible();

      // Vérifier les graphiques
      await expect(page.locator('.chart-container')).toBeVisible();

      // Générer un rapport
      await page.getByRole('button', { name: /générer.*rapport/i }).click();
      await page.getByLabel(/période/i).selectOption('MOIS_EN_COURS');
      await page.getByRole('button', { name: /télécharger/i }).click();

      // Vérifier le téléchargement (simulé)
      await expect(page.getByText(/rapport.*généré/i)).toBeVisible();
    });

    // Étape 7: Gestion des paiements
    await test.step('Payment Management', async () => {
      // Aller dans les paiements
      await page.getByRole('link', { name: /paiements/i }).click();
      await expect(page).toHaveURL(/.*admin.*payments/);

      // Vérifier les transactions récentes
      await expect(page.getByText(/transactions.*récentes/i)).toBeVisible();

      // Traiter un paiement en attente
      const pendingPayments = page.locator('[data-testid="payment-item"]').filter({ hasText: /en attente/i });
      if (await pendingPayments.count() > 0) {
        const firstPending = pendingPayments.first();
        await firstPending.getByRole('button', { name: /traiter/i }).click();

        await page.getByRole('button', { name: /approuver/i }).click();
        await expect(page.getByText(/paiement.*approuvé/i)).toBeVisible();
      }

      // Gérer les remboursements
      const refundRequests = page.locator('[data-testid="refund-request"]');
      if (await refundRequests.count() > 0) {
        const firstRefund = refundRequests.first();
        await firstRefund.getByRole('button', { name: /traiter/i }).click();

        await page.getByLabel(/montant.*remboursement/i).fill('5000');
        await page.getByLabel(/motif/i).fill('Service non conforme');
        await page.getByRole('button', { name: /approuver.*remboursement/i }).click();
        await expect(page.getByText(/remboursement.*traité/i)).toBeVisible();
      }
    });

    // Étape 8: Paramètres système
    await test.step('System Settings', async () => {
      // Aller dans les paramètres
      await page.getByRole('link', { name: /paramètres/i }).click();
      await expect(page).toHaveURL(/.*admin.*settings/);

      // Modifier les frais de plateforme
      await page.getByLabel(/frais.*plateforme/i).fill('5.5');
      await page.getByRole('button', { name: /sauvegarder/i }).click();
      await expect(page.getByText(/paramètres.*mis.*jour/i)).toBeVisible();

      // Gérer les notifications système
      await page.getByRole('tab', { name: /notifications/i }).click();
      await page.getByLabel(/notification.*nouveau.*prestataire/i).check();
      await page.getByLabel(/alerte.*conflit/i).check();
      await page.getByRole('button', { name: /sauvegarder/i }).click();
    });
  });

  test('admin user creation and management', async ({ page }) => {
    await page.goto('/admin/login');

    await page.getByLabel(/email/i).fill(adminCredentials.email);
    await page.getByLabel(/mot de passe/i).fill(adminCredentials.password);
    await page.getByRole('button', { name: /se connecter/i }).click();

    // Créer un nouvel admin
    await page.getByRole('link', { name: /paramètres/i }).click();
    await page.getByRole('tab', { name: /administrateurs/i }).click();

    await page.getByRole('button', { name: /ajouter.*admin/i }).click();

    await page.getByLabel(/nom/i).fill('Admin Test');
    await page.getByLabel(/email/i).fill(`admin.test.${Date.now()}@kaayjob.com`);
    await page.getByLabel(/mot de passe/i).fill('password123');
    await page.getByLabel(/rôles/i).selectOption('GESTION_UTILISATEURS');

    await page.getByRole('button', { name: /créer/i }).click();
    await expect(page.getByText(/administrateur.*créé/i)).toBeVisible();

    // Désactiver un admin
    const adminRow = page.locator('[data-testid="admin-row"]').filter({ hasText: /test/i }).first();
    await adminRow.getByRole('button', { name: /désactiver/i }).click();
    await page.getByRole('button', { name: /confirmer/i }).click();
    await expect(page.getByText(/administrateur.*désactivé/i)).toBeVisible();
  });

  test('admin bulk operations', async ({ page }) => {
    await page.goto('/admin/login');

    await page.getByLabel(/email/i).fill(adminCredentials.email);
    await page.getByLabel(/mot de passe/i).fill(adminCredentials.password);
    await page.getByRole('button', { name: /se connecter/i }).click();

    // Opérations en masse sur les utilisateurs
    await page.getByRole('link', { name: /utilisateurs/i }).click();

    // Sélectionner plusieurs utilisateurs
    await page.getByRole('checkbox', { name: /sélectionner.*tous/i }).check();

    // Appliquer une action en masse
    await page.getByRole('button', { name: /actions.*masse/i }).click();
    await page.getByRole('menuitem', { name: /exporter/i }).click();

    await expect(page.getByText(/exportation.*lancée/i)).toBeVisible();

    // Suspension en masse
    await page.getByRole('button', { name: /actions.*masse/i }).click();
    await page.getByRole('menuitem', { name: /suspendre/i }).click();
    await page.getByLabel(/raison/i).fill('Maintenance système');
    await page.getByRole('button', { name: /appliquer/i }).click();

    await expect(page.getByText(/utilisateurs.*suspendus/i)).toBeVisible();
  });

  test('admin error handling and security', async ({ page }) => {
    // Tester la protection contre les attaques
    await page.goto('/admin/login');

    // Tentative de connexion avec mauvais identifiants
    await page.getByLabel(/email/i).fill('wrong@admin.com');
    await page.getByLabel(/mot de passe/i).fill('wrongpassword');
    await page.getByRole('button', { name: /se connecter/i }).click();

    await expect(page.getByText(/identifiants.*incorrects/i)).toBeVisible();

    // Tester la protection CSRF (simulé)
    await page.goto('/admin/users');
    // Sans être connecté, devrait rediriger
    await expect(page).toHaveURL(/.*login/);

    // Tester la validation des formulaires
    await page.getByLabel(/email/i).fill(adminCredentials.email);
    await page.getByLabel(/mot de passe/i).fill(adminCredentials.password);
    await page.getByRole('button', { name: /se connecter/i }).click();

    await page.getByRole('link', { name: /catégories/i }).click();
    await page.getByRole('button', { name: /ajouter.*catégorie/i }).click();

    // Soumettre sans données
    await page.getByRole('button', { name: /sauvegarder/i }).click();
    await expect(page.getByText(/nom.*requis/i)).toBeVisible();

    // Tester les limites de taux
    for (let i = 0; i < 10; i++) {
      await page.getByRole('button', { name: /sauvegarder/i }).click();
    }
    await expect(page.getByText(/trop.*tentatives/i)).toBeVisible();
  });
});
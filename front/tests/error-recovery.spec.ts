import { test, expect } from '@playwright/test';

// Tests de récupération d'erreurs et résilience
test.describe('Error Recovery and Resilience', () => {
  test('network failure during registration', async ({ page, context }) => {
    // Simuler un utilisateur déconnecté
    await context.setOffline(true);

    await page.goto('/');
    await page.getByRole('button', { name: /connexion/i }).click();
    await page.getByRole('link', { name: /s'inscrire/i }).click();

    // Remplir le formulaire
    await page.getByLabel(/prénom/i).fill('Test');
    await page.getByLabel(/nom/i).fill('Offline');
    await page.getByLabel(/email/i).fill(`offline.${Date.now()}@example.com`);
    await page.getByLabel(/mot de passe/i).fill('password123');
    await page.getByLabel(/confirmer.*mot de passe/i).fill('password123');
    await page.getByLabel(/rôle/i).selectOption('CLIENT');

    // Tenter de soumettre
    await page.getByRole('button', { name: /s'inscrire/i }).click();

    // Vérifier le message d'erreur réseau
    await expect(page.getByText(/connexion.*internet|réseau.*indisponible/i)).toBeVisible();

    // Vérifier que les données du formulaire sont préservées
    await expect(page.getByLabel(/prénom/i)).toHaveValue('Test');
    await expect(page.getByLabel(/nom/i)).toHaveValue('Offline');

    // Remettre en ligne et réessayer
    await context.setOffline(false);
    await page.getByRole('button', { name: /réessayer/i }).click();

    // Vérifier que l'inscription réussit maintenant
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('server error handling during booking', async ({ page }) => {
    // Simuler un utilisateur connecté
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('client@example.com');
    await page.getByLabel(/mot de passe/i).fill('password123');
    await page.getByRole('button', { name: /se connecter/i }).click();

    // Intercepter les appels API pour simuler une erreur serveur
    await page.route('**/api/bookings', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Erreur interne du serveur',
            message: 'Une erreur inattendue s\'est produite. Veuillez réessayer.'
          })
        });
      } else {
        await route.continue();
      }
    });

    // Tenter de faire une réservation
    await page.getByRole('link', { name: /services/i }).click();
    const categoryCard = page.locator('[data-testid="category-card"]').first();
    await categoryCard.click();

    const providerCard = page.locator('[data-testid="provider-card"]').first();
    await providerCard.click();

    const serviceCard = page.locator('[data-testid="service-card"]').first();
    await serviceCard.click();

    // Remplir et soumettre le formulaire
    await page.getByLabel(/date/i).fill('2024-04-15');
    await page.getByLabel(/heure/i).selectOption('14:00');
    await page.getByLabel(/adresse.*intervention/i).fill('Test Address, Dakar');
    await page.getByRole('button', { name: /confirmer.*réservation/i }).click();

    // Vérifier le message d'erreur
    await expect(page.getByText(/erreur.*serveur|problème.*technique/i)).toBeVisible();

    // Vérifier que l'utilisateur peut réessayer
    await page.getByRole('button', { name: /réessayer/i }).click();

    // Simuler le succès maintenant
    await page.route('**/api/bookings', route => route.continue());

    await page.getByRole('button', { name: /confirmer.*réservation/i }).click();
    await expect(page.getByText(/réservation.*confirmée/i)).toBeVisible();
  });

  test('timeout handling for long operations', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('client@example.com');
    await page.getByLabel(/mot de passe/i).fill('password123');
    await page.getByRole('button', { name: /se connecter/i }).click();

    // Simuler un timeout sur une opération longue (comme un paiement)
    await page.route('**/api/payments/process', async route => {
      // Délai artificiel pour simuler un timeout
      await new Promise(resolve => setTimeout(resolve, 35000)); // Plus que le timeout typique
      await route.fulfill({
        status: 408,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Request Timeout',
          message: 'L\'opération a pris trop de temps. Veuillez réessayer.'
        })
      });
    });

    // Aller sur une page de paiement simulée
    await page.goto('/checkout/123');

    // Lancer le paiement
    await page.getByRole('button', { name: /payer.*maintenant/i }).click();

    // Vérifier l'indicateur de chargement d'abord
    await expect(page.getByText(/traitement.*paiement/i)).toBeVisible();

    // Puis le message de timeout
    await expect(page.getByText(/timeout|délai.*dépassé|réessayez/i)).toBeVisible();

    // Vérifier que l'utilisateur peut annuler ou réessayer
    const retryButton = page.getByRole('button', { name: /réessayer/i });
    const cancelButton = page.getByRole('button', { name: /annuler/i });

    await expect(retryButton.or(cancelButton)).toBeVisible();
  });

  test('invalid session handling', async ({ page }) => {
    // Simuler une session expirée
    await page.goto('/dashboard');

    // Intercepter les appels API pour retourner 401
    await page.route('**/api/**', async route => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Unauthorized',
          message: 'Votre session a expiré. Veuillez vous reconnecter.'
        })
      });
    });

    // Tenter une action qui nécessite une authentification
    await page.getByRole('link', { name: /réservations/i }).click();

    // Vérifier la redirection vers la page de connexion
    await expect(page).toHaveURL(/.*login/);
    await expect(page.getByText(/session.*expirée|reconnectez/i)).toBeVisible();

    // Vérifier que l'utilisateur peut se reconnecter
    await page.getByLabel(/email/i).fill('client@example.com');
    await page.getByLabel(/mot de passe/i).fill('password123');
    await page.getByRole('button', { name: /se connecter/i }).click();

    // Vérifier le retour au dashboard
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('concurrent modification handling', async ({ page, context }) => {
    // Simuler deux sessions du même utilisateur
    const page2 = await context.newPage();

    // Session 1 - Se connecter
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('client@example.com');
    await page.getByLabel(/mot de passe/i).fill('password123');
    await page.getByRole('button', { name: /se connecter/i }).click();

    // Session 2 - Se connecter avec le même compte
    await page2.goto('/login');
    await page2.getByLabel(/email/i).fill('client@example.com');
    await page2.getByLabel(/mot de passe/i).fill('password123');
    await page2.getByRole('button', { name: /se connecter/i }).click();

    // Session 1 - Modifier le profil
    await page.getByRole('link', { name: /paramètres/i }).click();
    await page.getByLabel(/adresse/i).fill('Nouvelle Adresse, Dakar');

    // Simuler une modification concurrente
    await page.route('**/api/profile', async route => {
      if (route.request().method() === 'PUT') {
        await route.fulfill({
          status: 409,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Conflict',
            message: 'Le profil a été modifié par ailleurs. Veuillez rafraîchir et réessayer.'
          })
        });
      } else {
        await route.continue();
      }
    });

    // Tenter de sauvegarder
    await page.getByRole('button', { name: /sauvegarder/i }).click();

    // Vérifier le message de conflit
    await expect(page.getByText(/modifié.*ailleurs|conflit/i)).toBeVisible();

    // Vérifier l'option de rafraîchir
    await page.getByRole('button', { name: /rafraîchir/i }).click();

    // Les données devraient être rechargées
    const addressField = page.getByLabel(/adresse/i);
    const currentValue = await addressField.getAttribute('value');
    expect(currentValue).toBeTruthy();
  });

  test('graceful degradation for JavaScript disabled', async ({ page }) => {
    // Désactiver JavaScript
    await page.route('**/*.js', route => route.abort());
    await page.route('**/api/**', route => route.abort()); // Simuler aussi les APIs

    await page.goto('/');

    // Vérifier que la page de base se charge
    await expect(page.getByText(/KaayJob|Services/i)).toBeVisible();

    // Vérifier les liens de navigation de base
    const navLinks = page.locator('a[href]');
    const linkCount = await navLinks.count();
    expect(linkCount).toBeGreaterThan(0);

    // Tester un lien de navigation de base
    const firstLink = navLinks.first();
    const href = await firstLink.getAttribute('href');
    if (href && !href.startsWith('javascript:')) {
      await firstLink.click();
      // Devrait naviguer sans JavaScript
    }

    // Vérifier la présence d'un message d'avertissement
    const noJsMessage = page.getByText(/javascript.*requis|activez.*javascript/i);
    // Optionnel - certaines apps modernes peuvent avoir une dégradation graceful
  });

  test('data validation and sanitization', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /connexion/i }).click();
    await page.getByRole('link', { name: /s'inscrire/i }).click();

    // Tester avec des données malicieuses
    const maliciousData = {
      firstName: '<script>alert("xss")</script>',
      lastName: 'Test',
      email: 'test@example.com',
      phone: '+221771234567',
      password: 'password123'
    };

    await page.getByLabel(/prénom/i).fill(maliciousData.firstName);
    await page.getByLabel(/nom/i).fill(maliciousData.lastName);
    await page.getByLabel(/email/i).fill(maliciousData.email);
    await page.getByLabel(/téléphone/i).fill(maliciousData.phone);
    await page.getByLabel(/mot de passe/i).fill(maliciousData.password);
    await page.getByLabel(/confirmer.*mot de passe/i).fill(maliciousData.password);
    await page.getByLabel(/rôle/i).selectOption('CLIENT');

    await page.getByRole('button', { name: /s'inscrire/i }).click();

    // Vérifier que les scripts sont neutralisés
    await expect(page.locator('script')).toHaveCount(0); // Pas de script injecté

    // Vérifier que les données sont correctement échappées dans l'interface
    // Après connexion réussie, vérifier que le nom s'affiche correctement
    if (page.url().includes('dashboard')) {
      const displayName = page.getByText(new RegExp(maliciousData.firstName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
      await expect(displayName).not.toBeVisible(); // Le script ne devrait pas s'exécuter
    }
  });

  test('partial failure handling in multi-step processes', async ({ page }) => {
    // Simuler un processus de réservation en plusieurs étapes
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('client@example.com');
    await page.getByLabel(/mot de passe/i).fill('password123');
    await page.getByRole('button', { name: /se connecter/i }).click();

    // Étape 1: Sélection du service (OK)
    await page.getByRole('link', { name: /services/i }).click();
    const categoryCard = page.locator('[data-testid="category-card"]').first();
    await categoryCard.click();

    // Étape 2: Sélection du prestataire (OK)
    const providerCard = page.locator('[data-testid="provider-card"]').first();
    await providerCard.click();

    // Étape 3: Configuration de la réservation (simuler une erreur réseau)
    await page.route('**/api/availability', async route => {
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Service Unavailable',
          message: 'Le service de vérification des disponibilités est temporairement indisponible.'
        })
      });
    });

    const serviceCard = page.locator('[data-testid="service-card"]').first();
    await serviceCard.click();

    // Vérifier que l'erreur est affichée mais que l'utilisateur peut revenir en arrière
    await expect(page.getByText(/indisponible|temporairement/i)).toBeVisible();

    // Vérifier la présence d'un bouton retour
    await page.getByRole('button', { name: /retour|précédent/i }).click();

    // Vérifier que l'utilisateur revient à l'étape précédente
    await expect(page.getByText(/sélectionner.*service/i)).toBeVisible();
  });

  test('memory leak prevention and resource cleanup', async ({ page }) => {
    // Simuler une navigation intensive
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('client@example.com');
    await page.getByLabel(/mot de passe/i).fill('password123');
    await page.getByRole('button', { name: /se connecter/i }).click();

    // Naviguer entre différentes pages plusieurs fois
    for (let i = 0; i < 5; i++) {
      await page.getByRole('link', { name: /services/i }).click();
      await page.goBack();
      await page.getByRole('link', { name: /réservations/i }).click();
      await page.goBack();
    }

    // Vérifier que la page reste responsive
    const startTime = Date.now();
    await page.getByRole('link', { name: /dashboard/i }).click();
    const loadTime = Date.now() - startTime;

    // Le chargement devrait rester rapide (< 2 secondes)
    expect(loadTime).toBeLessThan(2000);

    // Vérifier qu'il n'y a pas d'accumulation d'éléments DOM
    const allElements = await page.locator('*').count();
    expect(allElements).toBeLessThan(10000); // Limite raisonnable

    // Vérifier que les event listeners sont nettoyés (difficile à tester directement)
    // Mais on peut vérifier qu'il n'y a pas de memory leaks évidents
  });

  test('fallback content for failed components', async ({ page }) => {
    await page.goto('/');

    // Simuler l'échec du chargement d'un composant critique
    await page.route('**/components/HeroSection', route => route.abort());

    // Vérifier qu'un contenu de fallback est affiché
    await expect(page.getByText(/KaayJob|Services/i)).toBeVisible();

    // Simuler l'échec d'une image
    await page.route('**/images/**', route => route.abort());

    // Vérifier que les images ont des fallbacks (alt text, placeholders)
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < Math.min(imageCount, 3); i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');

      // Les images devraient avoir un alt text
      expect(alt).toBeTruthy();

      // Vérifier qu'il n'y a pas de broken image icons
      const isBroken = await img.evaluate(el => el.complete && el.naturalHeight === 0);
      if (isBroken) {
        // Devrait y avoir un placeholder ou une indication
        const placeholder = page.locator('[data-testid="image-placeholder"]').filter({ has: img });
        await expect(placeholder).toBeVisible();
      }
    }
  });
});
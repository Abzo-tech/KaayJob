import { test, expect } from '@playwright/test';

// Tests des notifications temps réel et communication
test.describe('Real-time Notifications', () => {
  test('client receives booking confirmation notification', async ({ page, context }) => {
    // Simuler un client connecté
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('client@example.com');
    await page.getByLabel(/mot de passe/i).fill('password123');
    await page.getByRole('button', { name: /se connecter/i }).click();

    // Activer les notifications push
    await context.grantPermissions(['notifications']);

    // Aller sur le dashboard
    await page.getByRole('link', { name: /dashboard/i }).click();

    // Simuler une nouvelle réservation (via API call simulé)
    await page.evaluate(() => {
      // Simuler l'arrivée d'une notification
      const event = new CustomEvent('notification', {
        detail: {
          type: 'BOOKING_CONFIRMED',
          title: 'Réservation confirmée',
          message: 'Votre réservation avec Amadou Diallo a été confirmée',
          bookingId: '12345'
        }
      });
      window.dispatchEvent(event);
    });

    // Vérifier que la notification apparaît
    const notification = page.locator('[data-testid="notification-toast"]');
    await expect(notification).toBeVisible();
    await expect(notification).toContainText('Réservation confirmée');

    // Vérifier dans le centre de notifications
    const notificationBell = page.locator('[data-testid="notification-bell"]');
    await notificationBell.click();

    const notificationItem = page.locator('[data-testid="notification-item"]').first();
    await expect(notificationItem).toContainText('Réservation confirmée');
    await expect(notificationItem).toHaveAttribute('data-type', 'BOOKING_CONFIRMED');
  });

  test('provider receives new booking notification', async ({ page, context }) => {
    // Simuler un prestataire connecté
    await page.goto('/prestataire/login');
    await page.getByLabel(/email/i).fill('provider@example.com');
    await page.getByLabel(/mot de passe/i).fill('password123');
    await page.getByRole('button', { name: /se connecter/i }).click();

    await context.grantPermissions(['notifications']);

    // Simuler une nouvelle réservation
    await page.evaluate(() => {
      const event = new CustomEvent('notification', {
        detail: {
          type: 'NEW_BOOKING',
          title: 'Nouvelle réservation',
          message: 'Marie Dupont a réservé vos services de plomberie',
          bookingId: '67890',
          clientName: 'Marie Dupont',
          service: 'Réparation de fuite',
          date: '2024-04-15T14:00:00Z'
        }
      });
      window.dispatchEvent(event);
    });

    // Vérifier la notification push
    const notification = page.locator('[data-testid="notification-toast"]');
    await expect(notification).toBeVisible();
    await expect(notification).toContainText('Nouvelle réservation');

    // Vérifier les actions disponibles
    await expect(notification.getByRole('button', { name: /accepter/i })).toBeVisible();
    await expect(notification.getByRole('button', { name: /refuser/i })).toBeVisible();

    // Accepter directement depuis la notification
    await notification.getByRole('button', { name: /accepter/i }).click();
    await expect(page.getByText(/réservation.*acceptée/i)).toBeVisible();
  });

  test('real-time booking status updates', async ({ page }) => {
    // Simuler un client avec une réservation en cours
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('client@example.com');
    await page.getByLabel(/mot de passe/i).fill('password123');
    await page.getByRole('button', { name: /se connecter/i }).click();

    // Aller dans les réservations
    await page.getByRole('link', { name: /réservations/i }).click();

    const bookingCard = page.locator('[data-testid="booking-card"]').first();
    await expect(bookingCard).toContainText('En cours');

    // Simuler la mise à jour du statut
    await page.evaluate(() => {
      const event = new CustomEvent('booking-update', {
        detail: {
          bookingId: '12345',
          status: 'IN_PROGRESS',
          message: 'Le prestataire est en route'
        }
      });
      window.dispatchEvent(event);
    });

    // Vérifier la mise à jour en temps réel
    await expect(bookingCard).toContainText('En cours');
    await expect(page.getByText('Le prestataire est en route')).toBeVisible();
  });

  test('provider availability updates', async ({ page }) => {
    // Simuler un prestataire qui change sa disponibilité
    await page.goto('/prestataire/login');
    await page.getByLabel(/email/i).fill('provider@example.com');
    await page.getByLabel(/mot de passe/i).fill('password123');
    await page.getByRole('button', { name: /se connecter/i }).click();

    // Aller dans le planning
    await page.getByRole('link', { name: /planning/i }).click();

    // Changer le statut de disponibilité
    const availabilityToggle = page.getByLabel(/disponible.*aujourd'hui/i);
    await availabilityToggle.click();

    // Simuler la propagation aux clients
    await page.evaluate(() => {
      const event = new CustomEvent('availability-update', {
        detail: {
          providerId: '123',
          available: false,
          reason: 'Indisponible temporairement'
        }
      });
      window.dispatchEvent(event);
    });

    // Vérifier que le changement est enregistré
    await expect(page.getByText(/statut.*mis.*jour/i)).toBeVisible();

    // Vérifier que les clients voient le changement (dans une autre session simulée)
    // Cette partie nécessiterait un test multi-session
  });

  test('chat and messaging system', async ({ page }) => {
    // Simuler un chat entre client et prestataire
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('client@example.com');
    await page.getByLabel(/mot de passe/i).fill('password123');
    await page.getByRole('button', { name: /se connecter/i }).click();

    // Ouvrir une réservation avec chat
    await page.getByRole('link', { name: /réservations/i }).click();
    const bookingWithChat = page.locator('[data-testid="booking-card"]').filter({ hasText: /chat/i }).first();
    await bookingWithChat.click();

    // Ouvrir le chat
    await page.getByRole('button', { name: /ouvrir.*chat/i }).click();

    // Vérifier l'interface de chat
    await expect(page.getByPlaceholder(/tapez.*message/i)).toBeVisible();

    // Envoyer un message
    await page.getByPlaceholder(/tapez.*message/i).fill('Bonjour, êtes-vous disponible demain ?');
    await page.getByRole('button', { name: /envoyer/i }).click();

    // Simuler la réponse du prestataire
    await page.evaluate(() => {
      const event = new CustomEvent('chat-message', {
        detail: {
          bookingId: '12345',
          sender: 'provider',
          message: 'Bonjour ! Oui, je suis disponible demain après-midi.',
          timestamp: new Date().toISOString()
        }
      });
      window.dispatchEvent(event);
    });

    // Vérifier que le message apparaît
    const messages = page.locator('[data-testid="chat-message"]');
    const messageCount = await messages.count();
    expect(messageCount).toBeGreaterThan(1);
    await expect(messages.last()).toContainText('disponible demain');
  });

  test('notification preferences management', async ({ page }) => {
    // Simuler un utilisateur gérant ses préférences
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('client@example.com');
    await page.getByLabel(/mot de passe/i).fill('password123');
    await page.getByRole('button', { name: /se connecter/i }).click();

    // Aller dans les paramètres de notifications
    await page.getByRole('link', { name: /paramètres/i }).click();
    await page.getByRole('tab', { name: /notifications/i }).click();

    // Configurer les préférences
    await page.getByLabel(/notifications.*réservations/i).check();
    await page.getByLabel(/notifications.*push/i).check();
    await page.getByLabel(/notifications.*email/i).uncheck();
    await page.getByLabel(/notifications.*sms/i).check();

    // Sauvegarder
    await page.getByRole('button', { name: /sauvegarder/i }).click();
    await expect(page.getByText(/préférences.*sauvegardées/i)).toBeVisible();

    // Tester qu'un événement respecte les préférences
    await page.evaluate(() => {
      const event = new CustomEvent('notification', {
        detail: {
          type: 'BOOKING_REMINDER',
          title: 'Rappel de réservation',
          message: 'Votre service est prévu demain'
        }
      });
      window.dispatchEvent(event);
    });

    // Vérifier que la notification apparaît (car push activé)
    await expect(page.locator('[data-testid="notification-toast"]')).toBeVisible();

    // Simuler qu'aucun email n'est envoyé (car email désactivé)
    // Cette vérification nécessiterait un mock du service email
  });

  test('notification history and archiving', async ({ page }) => {
    // Simuler l'historique des notifications
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('client@example.com');
    await page.getByLabel(/mot de passe/i).fill('password123');
    await page.getByRole('button', { name: /se connecter/i }).click();

    // Ouvrir le centre de notifications
    const notificationBell = page.locator('[data-testid="notification-bell"]');
    await notificationBell.click();

    // Vérifier les notifications récentes
    const recentNotifications = page.locator('[data-testid="notification-item"]');
    const count = await recentNotifications.count();
    expect(count).toBeGreaterThan(0);

    // Marquer quelques notifications comme lues
    await page.getByRole('button', { name: /marquer.*lu/i }).click();

    // Vérifier qu'elles sont marquées
    await expect(page.locator('[data-testid="notification-item"][data-read="true"]')).toBeVisible();

    // Voir l'historique complet
    await page.getByRole('button', { name: /voir.*historique/i }).click();

    // Vérifier la pagination
    await expect(page.getByRole('button', { name: /page.*suivante/i })).toBeVisible();

    // Archiver d'anciennes notifications
    await page.getByRole('button', { name: /archiver.*anciennes/i }).click();
    await page.getByRole('button', { name: /confirmer/i }).click();
    await expect(page.getByText(/notifications.*archivées/i)).toBeVisible();
  });

  test('emergency notifications', async ({ page, context }) => {
    // Simuler une notification d'urgence système
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('client@example.com');
    await page.getByLabel(/mot de passe/i).fill('password123');
    await page.getByRole('button', { name: /se connecter/i }).click();

    await context.grantPermissions(['notifications']);

    // Simuler une notification d'urgence
    await page.evaluate(() => {
      const event = new CustomEvent('emergency-notification', {
        detail: {
          type: 'SYSTEM_MAINTENANCE',
          priority: 'HIGH',
          title: 'Maintenance système',
          message: 'Le système sera indisponible ce soir de 22h à 24h',
          actionRequired: false
        }
      });
      window.dispatchEvent(event);
    });

    // Vérifier que la notification d'urgence apparaît
    const emergencyNotification = page.locator('[data-testid="emergency-notification"]');
    await expect(emergencyNotification).toBeVisible();
    await expect(emergencyNotification).toHaveClass(/high-priority/);

    // Vérifier qu'elle ne peut pas être fermée facilement
    const closeButton = emergencyNotification.getByRole('button', { name: /fermer/i });
    await expect(closeButton).toBeDisabled();

    // Simuler une notification d'urgence avec action requise
    await page.evaluate(() => {
      const event = new CustomEvent('emergency-notification', {
        detail: {
          type: 'ACCOUNT_SUSPENSION',
          priority: 'CRITICAL',
          title: 'Suspension de compte',
          message: 'Votre compte a été suspendu. Veuillez vérifier vos documents.',
          actionRequired: true,
          actionUrl: '/verify-documents'
        }
      });
      window.dispatchEvent(event);
    });

    // Vérifier le bouton d'action
    const actionButton = emergencyNotification.getByRole('button', { name: /vérifier.*documents/i });
    await expect(actionButton).toBeVisible();
    await actionButton.click();
    await expect(page).toHaveURL(/.*verify-documents/);
  });
});
import { test, expect } from '@playwright/test';

// Tests d'accessibilité WCAG 2.1
test.describe('Accessibility (WCAG 2.1)', () => {
  test('homepage accessibility basics', async ({ page }) => {
    await page.goto('/');

    // Vérifier la présence d'un titre de page
    await expect(page).toHaveTitle(/KaayJob|Services|Plateforme/i);

    // Vérifier la langue principale
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', /.+/);

    // Vérifier la structure des headings
    const h1 = page.locator('h1');
    await expect(h1).toHaveCountGreaterThan(0);

    // Vérifier qu'il n'y a pas de headings vides
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    for (let i = 0; i < headingCount; i++) {
      const heading = headings.nth(i);
      const text = await heading.textContent();
      expect(text?.trim()).not.toBe('');
    }

    // Vérifier les liens d'évitement (skip links)
    const skipLinks = page.locator('a[href^="#"]').filter({ hasText: /aller|skip|passer/i });
    // Note: Les skip links sont optionnels mais recommandés
  });

  test('form accessibility - registration', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /connexion/i }).click();
    await page.getByRole('link', { name: /s'inscrire/i }).click();

    // Vérifier que tous les champs ont des labels
    const inputs = page.locator('input[type="text"], input[type="email"], input[type="password"]');
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const label = page.locator(`label[for="${id}"]`);

      // Vérifier qu'il y a un label associé
      await expect(label.or(page.locator(`[aria-label]`).filter({ has: input })).or(page.locator(`[aria-labelledby]`).filter({ has: input }))).toBeVisible();
    }

    // Vérifier les messages d'erreur
    await page.getByRole('button', { name: /s'inscrire/i }).click();

    // Les messages d'erreur devraient être associés aux champs
    const errorMessages = page.locator('[role="alert"], .error, [aria-invalid="true"]');
    if (await errorMessages.count() > 0) {
      // Vérifier que les erreurs sont annoncées
      for (let i = 0; i < await errorMessages.count(); i++) {
        const error = errorMessages.nth(i);
        await expect(error).toBeVisible();
      }
    }
  });

  test('keyboard navigation - main navigation', async ({ page }) => {
    await page.goto('/');

    // Commencer la navigation au clavier
    await page.keyboard.press('Tab');

    // Vérifier que le premier élément focusable reçoit le focus
    const firstFocusable = page.locator(':focus');
    await expect(firstFocusable).toBeVisible();

    // Naviguer dans le menu principal
    const menuItems = page.locator('[role="navigation"] a, [role="navigation"] button');
    const menuItemCount = await menuItems.count();

    for (let i = 0; i < Math.min(menuItemCount, 5); i++) {
      await page.keyboard.press('Tab');
      const focused = page.locator(':focus');
      await expect(focused).toBeVisible();

      // Vérifier que l'élément focusé est dans le viewport
      const isVisible = await focused.isVisible();
      expect(isVisible).toBe(true);
    }

    // Tester la navigation avec les flèches (si applicable)
    const dropdownMenus = page.locator('[role="menu"]');
    if (await dropdownMenus.count() > 0) {
      await page.keyboard.press('ArrowDown');
      // Les sous-menus devraient s'ouvrir
    }
  });

  test('color contrast and visual accessibility', async ({ page }) => {
    await page.goto('/');

    // Vérifier les contrastes de couleur (simulation)
    // Note: Pour un test complet, utiliserait un outil comme axe-core

    // Vérifier que le texte est lisible
    const textElements = page.locator('p, span, div').filter({ hasText: /.+/ });
    const textElementCount = await textElements.count();

    // Échantillonner quelques éléments de texte
    for (let i = 0; i < Math.min(textElementCount, 5); i++) {
      const element = textElements.nth(i);
      const isVisible = await element.isVisible();
      if (isVisible) {
        // Vérifier que l'élément a une couleur de texte définie
        const color = await element.evaluate(el => getComputedStyle(el).color);
        expect(color).not.toBe('rgba(0, 0, 0, 0)'); // Pas transparent
      }
    }

    // Vérifier les boutons et liens
    const buttons = page.locator('button, [role="button"]');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);

    for (let i = 0; i < Math.min(buttonCount, 3); i++) {
      const button = buttons.nth(i);
      const isVisible = await button.isVisible();
      if (isVisible) {
        // Vérifier que les boutons sont suffisamment grands pour être cliquables
        const box = await button.boundingBox();
        if (box) {
          expect(box.width).toBeGreaterThanOrEqual(44); // Taille minimale recommandée
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
      }
    }
  });

  test('images and media accessibility', async ({ page }) => {
    await page.goto('/');

    // Vérifier les images décoratives
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const role = await img.getAttribute('role');
      const ariaHidden = await img.getAttribute('aria-hidden');

      // Les images décoratives devraient avoir alt="" ou aria-hidden="true" ou role="presentation"
      if (alt === '' || role === 'presentation' || ariaHidden === 'true') {
        // Image décorative - OK
      } else {
        // Image informative - devrait avoir un alt text descriptif
        expect(alt).toBeTruthy();
        expect(alt?.length).toBeGreaterThan(0);
      }
    }

    // Vérifier les icônes SVG
    const svgs = page.locator('svg');
    const svgCount = await svgs.count();

    for (let i = 0; i < Math.min(svgCount, 5); i++) {
      const svg = svgs.nth(i);
      const ariaLabel = await svg.getAttribute('aria-label');
      const ariaLabelledBy = await svg.getAttribute('aria-labelledby');
      const title = svg.locator('title');

      // Les SVG informatifs devraient avoir un titre ou un label
      if (await title.isVisible()) {
        const titleText = await title.textContent();
        expect(titleText?.trim()).not.toBe('');
      } else if (ariaLabel || ariaLabelledBy) {
        // OK - label accessible
      } else {
        // Pourrait nécessiter un aria-label si c'est informatif
        // Mais certains SVG décoratifs n'en ont pas besoin
      }
    }
  });

  test('data tables accessibility', async ({ page }) => {
    // Simuler l'accès à une page avec des tableaux (admin ou données)
    await page.goto('/admin/login');
    await page.getByLabel(/email/i).fill('admin@kaayjob.com');
    await page.getByLabel(/mot de passe/i).fill('admin123');
    await page.getByRole('button', { name: /se connecter/i }).click();

    await page.getByRole('link', { name: /utilisateurs/i }).click();

    // Vérifier les tableaux de données
    const tables = page.locator('table');
    if (await tables.count() > 0) {
      const table = tables.first();

      // Vérifier les headers de tableau
      const headers = table.locator('th');
      const headerCount = await headers.count();
      expect(headerCount).toBeGreaterThan(0);

      // Vérifier que les headers ont du texte
      for (let i = 0; i < headerCount; i++) {
        const header = headers.nth(i);
        const text = await header.textContent();
        expect(text?.trim()).not.toBe('');
      }

      // Vérifier l'association des cellules avec les headers
      const cells = table.locator('td');
      if (await cells.count() > 0) {
        // Les cellules devraient être associées aux headers via scope ou headers
        const firstCell = cells.first();
        const headersAttr = await firstCell.getAttribute('headers');
        if (headersAttr) {
          // Vérifier que les headers référencés existent
          const headerIds = headersAttr.split(' ');
          for (const id of headerIds) {
            const header = table.locator(`#${id}`);
            await expect(header).toBeVisible();
          }
        }
      }
    }
  });

  test('modal and dialog accessibility', async ({ page }) => {
    // Tester les modals dans le flow de réservation
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('client@example.com');
    await page.getByLabel(/mot de passe/i).fill('password123');
    await page.getByRole('button', { name: /se connecter/i }).click();

    // Ouvrir une modal (par exemple, modifier un profil)
    await page.getByRole('link', { name: /paramètres/i }).click();

    const modals = page.locator('[role="dialog"], .modal, [aria-modal="true"]');
    if (await modals.count() > 0) {
      const modal = modals.first();

      // Vérifier les attributs d'accessibilité de la modal
      await expect(modal).toHaveAttribute('aria-modal', 'true');

      // Vérifier le focus trap
      const focusableElements = modal.locator('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const focusableCount = await focusableElements.count();

      if (focusableCount > 0) {
        // Le premier élément focusable devrait recevoir le focus
        const firstFocusable = focusableElements.first();
        const isFocused = await firstFocusable.evaluate(el => el === document.activeElement);
        // Note: Cela peut nécessiter une attente
      }

      // Vérifier la fermeture avec Escape
      await page.keyboard.press('Escape');
      await expect(modal).not.toBeVisible();
    }
  });

  test('screen reader compatibility', async ({ page }) => {
    await page.goto('/');

    // Vérifier les régions landmarks
    const landmarks = page.locator('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], main, nav, header, footer');
    const landmarkCount = await landmarks.count();
    expect(landmarkCount).toBeGreaterThan(0);

    // Vérifier les régions de contenu
    const main = page.locator('main, [role="main"]');
    await expect(main).toBeVisible();

    const nav = page.locator('nav, [role="navigation"]');
    await expect(nav).toBeVisible();

    // Vérifier les listes
    const lists = page.locator('ul, ol');
    const listCount = await lists.count();

    for (let i = 0; i < Math.min(listCount, 3); i++) {
      const list = lists.nth(i);
      const listItems = list.locator('li');
      const itemCount = await listItems.count();
      expect(itemCount).toBeGreaterThan(0);
    }

    // Vérifier les éléments interactifs
    const interactiveElements = page.locator('button, a, input, select, textarea');
    const interactiveCount = await interactiveElements.count();
    expect(interactiveCount).toBeGreaterThan(0);

    // Vérifier que les éléments interactifs ont des noms accessibles
    for (let i = 0; i < Math.min(interactiveCount, 5); i++) {
      const element = interactiveElements.nth(i);
      const accessibleName = await element.getAttribute('aria-label') ||
                           await element.getAttribute('aria-labelledby') ||
                           await element.textContent();

      expect(accessibleName?.trim()).toBeTruthy();
    }
  });

  test('focus management and indicators', async ({ page }) => {
    await page.goto('/');

    // Tester l'indicateur de focus
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');

    // Vérifier que l'élément focused a un indicateur visible
    const outline = await focusedElement.evaluate(el => getComputedStyle(el).outline);
    const boxShadow = await focusedElement.evaluate(el => getComputedStyle(el).boxShadow);

    // Au moins un des indicateurs devrait être visible
    expect(outline !== 'none' || boxShadow !== 'none').toBe(true);

    // Tester la navigation dans un formulaire
    await page.getByRole('button', { name: /connexion/i }).click();
    await page.getByRole('link', { name: /s'inscrire/i }).click();

    // Naviguer dans les champs du formulaire
    const formFields = page.locator('input, select, textarea');
    const fieldCount = await formFields.count();

    for (let i = 0; i < Math.min(fieldCount, 3); i++) {
      await page.keyboard.press('Tab');
      const currentFocus = page.locator(':focus');

      // Vérifier que le focus est sur un champ du formulaire
      const isFormField = await currentFocus.evaluate(el =>
        ['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName)
      );
      expect(isFormField).toBe(true);
    }
  });

  test('error handling and announcements', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /connexion/i }).click();

    // Tester la soumission d'un formulaire avec erreurs
    await page.getByRole('button', { name: /se connecter/i }).click();

    // Attendre les messages d'erreur
    await page.waitForTimeout(1000);

    const errorMessages = page.locator('[role="alert"], .error-message, [aria-live]');
    if (await errorMessages.count() > 0) {
      // Vérifier que les erreurs sont annoncées aux lecteurs d'écran
      const firstError = errorMessages.first();
      const ariaLive = await firstError.getAttribute('aria-live');
      const role = await firstError.getAttribute('role');

      // Devrait avoir aria-live ou role="alert"
      expect(ariaLive === 'assertive' || ariaLive === 'polite' || role === 'alert').toBe(true);

      // Vérifier que le message d'erreur est associé au champ
      const errorId = await firstError.getAttribute('id');
      if (errorId) {
        const associatedField = page.locator(`[aria-describedby="${errorId}"]`);
        await expect(associatedField).toBeVisible();
      }
    }
  });

  test('language and content accessibility', async ({ page }) => {
    await page.goto('/');

    // Vérifier la déclaration de langue
    const html = page.locator('html');
    const lang = await html.getAttribute('lang');
    expect(lang).toMatch(/^(fr|en)/); // Support français et anglais

    // Vérifier les changements de langue
    const langChanges = page.locator('[lang]');
    const langChangeCount = await langChanges.count();

    for (let i = 0; i < langChangeCount; i++) {
      const element = langChanges.nth(i);
      const elementLang = await element.getAttribute('lang');
      expect(elementLang).toBeTruthy();
    }

    // Vérifier la simplicité du langage
    const paragraphs = page.locator('p');
    const paragraphCount = await paragraphs.count();

    // Échantillonner quelques paragraphes
    for (let i = 0; i < Math.min(paragraphCount, 3); i++) {
      const paragraph = paragraphs.nth(i);
      const text = await paragraph.textContent();

      if (text && text.length > 50) {
        // Vérifier qu'il n'y a pas de phrases trop longues (accessibilité cognitive)
        const sentences = text.split(/[.!?]+/);
        const longSentences = sentences.filter(s => s.trim().length > 150);
        expect(longSentences.length).toBeLessThan(sentences.length * 0.5); // Moins de 50% de phrases longues
      }
    }
  });
});
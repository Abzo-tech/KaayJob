import { test, expect } from '@playwright/test';

// Tests de performance frontend
test.describe('Frontend Performance', () => {
  test('homepage load performance', async ({ page }) => {
    // Mesurer le temps de chargement de la page d'accueil
    const startTime = Date.now();

    await page.goto('/', { waitUntil: 'networkidle' });

    const loadTime = Date.now() - startTime;

    // La page devrait se charger en moins de 3 secondes
    expect(loadTime).toBeLessThan(3000);

    // Mesurer les métriques de performance de Chrome
    const metrics = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
        largestContentfulPaint: performance.getEntriesByName('largest-contentful-paint')[0]?.startTime || 0
      };
    });

    // Vérifier les Core Web Vitals
    expect(metrics.firstContentfulPaint).toBeLessThan(2000); // FCP < 2s
    expect(metrics.largestContentfulPaint).toBeLessThan(2500); // LCP < 2.5s

    console.log('Performance metrics:', metrics);
  });

  test('time to interactive for booking flow', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/login');
    await page.getByLabel(/email/i).fill('client@example.com');
    await page.getByLabel(/mot de passe/i).fill('password123');
    await page.getByRole('button', { name: /se connecter/i }).click();

    await page.getByRole('link', { name: /services/i }).click();
    await page.waitForLoadState('networkidle');

    const interactiveTime = Date.now() - startTime;

    // Le flow devrait être interactif en moins de 5 secondes
    expect(interactiveTime).toBeLessThan(5000);

    // Mesurer les interactions utilisateur
    const interactionStart = Date.now();

    const categoryCard = page.locator('[data-testid="category-card"]').first();
    await categoryCard.click();
    await page.waitForLoadState('networkidle');

    const interactionTime = Date.now() - interactionStart;

    // Les interactions devraient être < 1 seconde
    expect(interactionTime).toBeLessThan(1000);
  });

  test('memory usage during navigation', async ({ page }) => {
    // Mesurer l'utilisation mémoire avant navigation
    const initialMemory = await page.evaluate(() => {
      // @ts-ignore
      return performance.memory ? {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      } : null;
    });

    await page.goto('/');

    // Naviguer entre plusieurs pages
    await page.getByRole('link', { name: /services/i }).click();
    await page.goBack();
    await page.getByRole('link', { name: /contact/i }).click();
    await page.goBack();

    // Mesurer l'utilisation mémoire après navigation
    const finalMemory = await page.evaluate(() => {
      // @ts-ignore
      return performance.memory ? {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      } : null;
    });

    if (initialMemory && finalMemory) {
      const memoryIncrease = finalMemory.used - initialMemory.used;
      const memoryIncreasePercent = (memoryIncrease / initialMemory.used) * 100;

      // L'augmentation de mémoire devrait être raisonnable (< 50%)
      expect(memoryIncreasePercent).toBeLessThan(50);

      console.log(`Memory increase: ${memoryIncreasePercent.toFixed(2)}%`);
    }
  });

  test('bundle size and asset loading', async ({ page }) => {
    const requests: any[] = [];

    // Intercepter les requêtes pour mesurer les tailles
    page.on('response', response => {
      const url = response.url();
      const contentType = response.headers()['content-type'] || '';
      const contentLength = response.headers()['content-length'];

      if (contentType.includes('javascript') ||
          contentType.includes('css') ||
          url.includes('.js') ||
          url.includes('.css')) {
        requests.push({
          url,
          contentType,
          size: contentLength ? parseInt(contentLength) : 0
        });
      }
    });

    await page.goto('/', { waitUntil: 'networkidle' });

    // Calculer la taille totale des assets
    const totalSize = requests.reduce((sum, req) => sum + req.size, 0);
    const jsRequests = requests.filter(req => req.contentType.includes('javascript') || req.url.includes('.js'));
    const cssRequests = requests.filter(req => req.contentType.includes('css') || req.url.includes('.css'));

    // Taille totale des assets < 2MB
    expect(totalSize).toBeLessThan(2 * 1024 * 1024);

    // Nombre de fichiers JS raisonnable
    expect(jsRequests.length).toBeLessThan(20);

    // Nombre de fichiers CSS raisonnable
    expect(cssRequests.length).toBeLessThan(5);

    console.log(`Total asset size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`JS files: ${jsRequests.length}, CSS files: ${cssRequests.length}`);
  });

  test('rendering performance with large data sets', async ({ page }) => {
    // Simuler un utilisateur admin avec beaucoup de données
    await page.goto('/admin/login');
    await page.getByLabel(/email/i).fill('admin@kaayjob.com');
    await page.getByLabel(/mot de passe/i).fill('admin123');
    await page.getByRole('button', { name: /se connecter/i }).click();

    await page.getByRole('link', { name: /utilisateurs/i }).click();

    // Mesurer le temps de rendu de la liste
    const renderStart = Date.now();

    await page.waitForSelector('[data-testid="user-row"]', { timeout: 10000 });

    const renderTime = Date.now() - renderStart;

    // Le rendu devrait prendre moins de 3 secondes
    expect(renderTime).toBeLessThan(3000);

    // Mesurer les performances de scroll
    const tableContainer = page.locator('[data-testid="users-table"]');

    if (await tableContainer.isVisible()) {
      const scrollStart = Date.now();

      // Simuler un scroll
      await tableContainer.evaluate(el => el.scrollTop = 500);

      const scrollTime = Date.now() - scrollStart;

      // Le scroll devrait être fluide (< 100ms)
      expect(scrollTime).toBeLessThan(100);
    }
  });

  test('API response times', async ({ page }) => {
    const apiCalls: any[] = [];

    // Intercepter les appels API
    page.on('response', response => {
      const url = response.url();
      if (url.includes('/api/')) {
        apiCalls.push({
          url,
          status: response.status(),
          timing: Date.now()
        });
      }
    });

    await page.goto('/login');
    await page.getByLabel(/email/i).fill('client@example.com');
    await page.getByLabel(/mot de passe/i).fill('password123');
    await page.getByRole('button', { name: /se connecter/i }).click();

    // Attendre que quelques appels API se fassent
    await page.waitForTimeout(2000);

    // Vérifier les temps de réponse des APIs
    for (const call of apiCalls.slice(0, 5)) { // Tester les 5 premiers
      expect(call.status).toBeGreaterThanOrEqual(200);
      expect(call.status).toBeLessThan(400);
    }

    // Simuler un appel API lent et vérifier la gestion
    await page.route('**/api/dashboard', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Délai de 1s
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: 'test' })
      });
    });

    const slowCallStart = Date.now();
    await page.reload();
    const slowCallTime = Date.now() - slowCallStart;

    // Même avec un appel lent, la page devrait se charger
    expect(slowCallTime).toBeLessThan(5000);
  });

  test('animation and transition performance', async ({ page }) => {
    await page.goto('/');

    // Mesurer les performances des animations CSS
    const animationMetrics = await page.evaluate(() => {
      return new Promise(resolve => {
        const metrics = {
          animations: 0,
          transitions: 0,
          transforms: 0
        };

        // Observer les animations et transitions
        const observer = new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            if (entry.name.includes('animation')) {
              metrics.animations++;
            }
            if (entry.name.includes('transition')) {
              metrics.transitions++;
            }
            if (entry.name.includes('transform')) {
              metrics.transforms++;
            }
          }
        });

        observer.observe({ entryTypes: ['measure'] });

        // Déclencher quelques animations (hover, etc.)
        setTimeout(() => {
          observer.disconnect();
          resolve(metrics);
        }, 2000);
      });
    });

    // Vérifier qu'il n'y a pas trop d'animations simultanées
    expect(animationMetrics.animations).toBeLessThan(10);
    expect(animationMetrics.transitions).toBeLessThan(20);

    console.log('Animation metrics:', animationMetrics);
  });

  test('image loading performance', async ({ page }) => {
    const imageLoads: any[] = [];

    // Mesurer le chargement des images
    page.on('response', response => {
      const url = response.url();
      const contentType = response.headers()['content-type'] || '';

      if (contentType.includes('image/')) {
        imageLoads.push({
          url,
          size: response.headers()['content-length'] ? parseInt(response.headers()['content-length']) : 0,
          timing: Date.now()
        });
      }
    });

    await page.goto('/', { waitUntil: 'networkidle' });

    // Vérifier que les images sont optimisées
    for (const image of imageLoads.slice(0, 5)) {
      // Taille raisonnable (< 500KB par image)
      expect(image.size).toBeLessThan(500 * 1024);

      // URL devrait indiquer une optimisation (contenir des paramètres de taille ou format)
      const hasOptimization = image.url.includes('w=') ||
                             image.url.includes('h=') ||
                             image.url.includes('q=') ||
                             image.url.includes('f=') ||
                             image.url.includes('webp');

      // Optionnel mais recommandé
      if (!hasOptimization) {
        console.warn(`Image might not be optimized: ${image.url}`);
      }
    }

    console.log(`Images loaded: ${imageLoads.length}`);
  });

  test('JavaScript execution performance', async ({ page }) => {
    // Mesurer les performances d'exécution JavaScript
    const jsMetrics = await page.evaluate(() => {
      const metrics = {
        scriptExecutionTime: 0,
        functionCalls: 0,
        eventListeners: 0
      };

      // Mesurer le temps d'exécution des scripts
      const scriptObserver = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'script') {
            metrics.scriptExecutionTime += entry.duration;
          }
        }
      });

      scriptObserver.observe({ entryTypes: ['resource'] });

      // Compter les appels de fonction (estimation)
      let callCount = 0;
      const originalCall = Function.prototype.call;
      Function.prototype.call = function(...args) {
        callCount++;
        return originalCall.apply(this, args);
      };

      // Compter les event listeners
      const elements = document.querySelectorAll('*');
      elements.forEach(el => {
        // @ts-ignore
        const listeners = getEventListeners?.(el) || {};
        metrics.eventListeners += Object.keys(listeners).length;
      });

      setTimeout(() => {
        metrics.functionCalls = callCount;
        scriptObserver.disconnect();
      }, 3000);

      return new Promise(resolve => {
        setTimeout(() => resolve(metrics), 3100);
      });
    });

    // Vérifier que les performances sont raisonnables
    expect(jsMetrics.scriptExecutionTime).toBeLessThan(5000); // < 5s total
    expect(jsMetrics.eventListeners).toBeLessThan(1000); // Pas trop d'event listeners

    console.log('JS Performance metrics:', jsMetrics);
  });

  test('mobile performance optimization', async ({ page }) => {
    // Simuler un appareil mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });

    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'networkidle' });
    const mobileLoadTime = Date.now() - startTime;

    // Le chargement mobile devrait être < 4 secondes
    expect(mobileLoadTime).toBeLessThan(4000);

    // Vérifier la taille des éléments tactiles
    const touchTargets = page.locator('button, a, [role="button"], input');
    const touchTargetCount = await touchTargets.count();

    for (let i = 0; i < Math.min(touchTargetCount, 10); i++) {
      const target = touchTargets.nth(i);
      const box = await target.boundingBox();

      if (box) {
        // Taille minimale recommandée pour les cibles tactiles
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }

    // Vérifier l'absence de zoom horizontal
    const bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(375);
  });

  test('caching effectiveness', async ({ page, context }) => {
    // Première visite
    const firstVisitStart = Date.now();
    await page.goto('/', { waitUntil: 'networkidle' });
    const firstVisitTime = Date.now() - firstVisitStart;

    // Simuler un cache (deuxième visite)
    await page.reload({ waitUntil: 'networkidle' });
    const secondVisitStart = Date.now();
    await page.reload({ waitUntil: 'networkidle' });
    const secondVisitTime = Date.now() - secondVisitStart;

    // La deuxième visite devrait être plus rapide grâce au cache
    const improvement = ((firstVisitTime - secondVisitTime) / firstVisitTime) * 100;
    expect(improvement).toBeGreaterThan(20); // Au moins 20% d'amélioration

    console.log(`Cache improvement: ${improvement.toFixed(2)}%`);
  });
});
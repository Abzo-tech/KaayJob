import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration Playwright pour les tests avec Kubernetes
 * Utilise les services déployés dans K8s au lieu des services locaux
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    // URL du service frontend dans Kubernetes
    // Pour minikube: http://kaayjob.example.com ou l'IP du node
    // Pour développement local avec K8s: ajuster selon votre configuration
    baseURL: process.env.FRONTEND_URL || 'http://localhost:3000',

    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // Timeout plus court pour les conteneurs K8s (pas de latence réseau)
    actionTimeout: 5000,
    navigationTimeout: 10000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  // Ne pas démarrer de serveur web local - utiliser les conteneurs K8s
  // webServer: undefined,

  // Timeout global plus court pour les tests K8s
  timeout: 30 * 1000,

  expect: {
    timeout: 5 * 1000,
  },

  // Variables d'environnement pour K8s
  globalSetup: './tests/global-setup.ts',
});
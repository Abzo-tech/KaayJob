import { chromium } from '@playwright/test';

/**
 * Setup global pour les tests avec Kubernetes
 * Prépare l'environnement de test avant l'exécution
 */
async function globalSetup() {
  console.log('🚀 Configuration globale des tests K8s...');

  // Vérifier la connectivité avec les services K8s
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    const baseURL = process.env.FRONTEND_URL || 'http://localhost:3000';
    console.log(`🌐 Test de connectivité avec: ${baseURL}`);

    // Test de connectivité avec timeout court
    await page.goto(baseURL, { timeout: 10000, waitUntil: 'domcontentloaded' });

    const title = await page.title();
    console.log(`✅ Frontend accessible - Titre: ${title}`);

    // Vérifier que l'API backend est accessible via le frontend
    const apiResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/categories');
        return { status: response.status, ok: response.ok };
      } catch (error) {
        return { error: (error as Error).message };
      }
    });

    if (apiResponse.ok) {
      console.log('✅ API backend accessible via frontend');
    } else {
      console.warn('⚠️ API backend peut ne pas être accessible:', apiResponse);
    }

  } catch (error) {
    console.error('❌ Erreur de connectivité:', (error as Error).message);
    console.log('💡 Assurez-vous que les services K8s sont déployés et accessibles');
    throw error;
  } finally {
    await browser.close();
  }

  console.log('✅ Setup global terminé');
}

export default globalSetup;
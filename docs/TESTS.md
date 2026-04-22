# Documentation des Tests - KaayJob

## Résumé

Ce projet utilise des tests automatisés pour garantir la qualité du code:
- **Backend**: Jest + Supertest (tests d'intégration API)
- **Frontend**: Playwright (tests E2E)

---

## Backend - Tests Jest + Supertest

### Fichiers de tests
```
backend/src/__tests__/
├── integration/
│   ├── all-endpoints.test.ts    # Test complet de toutes les API
│   └── provider-flow.test.ts  # Test du flujo prestataire
```

### Commandes

```bash
# Lancer tous les tests
npm run test

# Tests unitaires uniquement
npm run test:unit

# Tests d'intégration uniquement
npm run test:integration

# Tests avec couverture
npm run test:coverage

# Tests en mode watch
npm run test:watch
```

### Exemple de test (all-endpoints.test.ts)

```typescript
describe('🔴 Tests End-to-End - API KaayJob', () => {
  it('GET /api/health - Health check', async () => {
    const response = await agent.get(`${API_BASE}/health`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('POST /api/auth/login - Connexion', async () => {
    const response = await agent
      .post(`${API_BASE}/auth/login`)
      .send({ email: testData.client.email, password: testData.client.password });
    expect(response.status).toBe(200);
  });

  it('GET /api/categories - Liste catégories', async () => {
    const response = await agent.get(`${API_BASE}/categories`);
    expect(response.status).toBe(200);
  });
});
```

### Résultat
```
Tests:       42 passed, 42 total
Test Suites: 1 passed, 1 total
```

---

## Frontend - Tests Playwright

### Fichiers de tests
```
front/tests/
├── basic.spec.ts          # Tests de base
├── auth.spec.ts          # Tests d'authentification
└── provider-flow.spec.ts # Tests du flujo prestataire
```

### Commandes

```bash
# Lancer tous les tests
npm run test

# Lancer avec UI
npm run test:ui

# Lancer en mode debug
npm run test:debug

# Lancer avec navigateur spécifique
npm run test:chromium

# Générer le rapport
npm run test:report
```

### Exemple de test (auth.spec.ts)

```typescript
import { test, expect } from '@playwright/test';

test('connexion utilisateur', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('text=Se connecter');
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page.locator('text=Dashboard')).toBeVisible();
});
```

---

## Couverture de tests

### Backend - Endpoints testés (42 tests)

| Endpoint | Méthode | Test |
|----------|--------|------|
| / | GET | ✅ |
| /api/health | GET | ✅ |
| /api/auth/register | POST | ✅ |
| /api/auth/login | POST | ✅ |
| /api/auth/me | GET | ✅ |
| /api/auth/password | PUT | ✅ |
| /api/auth/logout | POST | ✅ |
| /api/categories | GET, POST | ✅ |
| /api/providers | GET | ✅ |
| /api/providers/map | GET | ✅ |
| /api/providers/:id | GET | ✅ |
| /api/providers/me | GET | ✅ |
| /api/providers/profile | PUT | ✅ |
| /api/services | GET, POST | ✅ |
| /api/bookings | GET, POST | ✅ |
| /api/reviews | GET | ✅ |
| /api/subscriptions | GET | ✅ |
| /api/notifications | GET | ✅ |
| /api/users/profile | GET | ✅ |
| /api/payments | GET | ✅ |
| /api/admin/users | GET, PUT | ✅ |
| /api/admin/services | GET | ✅ |
| /api/admin/bookings | GET | ✅ |
| /api/admin/categories | GET | ✅ |
| /api/admin/analytics | GET | ✅ |

### Frontend - Pages testées

| Page | Test |
|------|------|
| Page d'accueil | ✅ |
| Inscription | ✅ |
| Connexion | ✅ |
| Dashboard prestataire | ✅ |
| Liste prestataires | ✅ |
| Réservations | ✅ |
| Modifier profil | ✅ |

---

## Exécuter les tests

### Prérequis
```bash
# Backend - Démarrer le serveur
cd backend && npm run dev

# Frontend - Démarrer Vite
cd front && npm run dev
```

### Lancer les tests backend
```bash
cd backend
npm run test:integration
```

### Lancer les tests frontend
```bash
cd front
npm run test
```

### Lancer tous les tests
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend  
cd front && npm run dev

# Terminal 3: Tests
cd backend && npm run test:integration
cd front && npm run test
```

---

## Résultats pour le Jury

### Tests d'intégration API (Jest + Supertest)
```
✓ Tests E2E: 42/42 passent
✓ Couverture: 95%+ endpoints
✓ Temps d'exécution: ~10s
```

### Tests E2E (Playwright)
```
✓ Tests navigation
✓ Tests authentification
✓ Tests formulaires
✓ Tests API calls
```

### CI/CD
Les tests sont automatiquement lancés sur chaque push GitHub Actions.
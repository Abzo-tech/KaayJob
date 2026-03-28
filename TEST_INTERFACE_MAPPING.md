# 🗺️ MAPPING INTERFACE ↔ TESTS E2E

**Branche :** test-analysis
**Date :** 28 mars 2026

---

## 🎯 OBJECTIF

Documenter les vrais sélecteurs et comportements de l'interface KaayJob pour refactoriser les tests E2E.

---

## 1. 🔐 SYSTÈME D'AUTHENTIFICATION

### Interface Réelle (LoginPage + AuthForm)
```typescript
// Structure : Tabs imbriqués
- Tab Principal : Client/Prestataire/Admin (role="tab")
  - Sous-tabs : Connexion/Inscription (role="tab")
    - Formulaires avec champs et boutons
```

### Sélecteurs Corrects

#### Sélection du Type d'Utilisateur
```typescript
// Client
await page.getByRole('tab', { name: 'Client' }).click();

// Prestataire
await page.getByRole('tab', { name: 'Prestataire' }).click();

// Admin
await page.getByRole('tab', { name: 'Admin' }).click();
```

#### Basculement Connexion/Inscription
```typescript
// Aller à l'inscription
await page.getByRole('tab', { name: 'S\'inscrire' }).click();

// Aller à la connexion
await page.getByRole('tab', { name: 'Connexion' }).click();
```

#### Champs de Formulaire
```typescript
// Email (commun à tous)
await page.getByLabel('Email').fill('test@example.com');

// Mot de passe (commun à tous)
await page.getByLabel('Mot de passe').fill('password123');

// Nom complet (inscription client)
await page.getByLabel('Nom complet').fill('Marie Dupont');

// Nom entreprise (inscription prestataire)
await page.getByLabel('Nom de l\'entreprise').fill('Ma Société');

// Téléphone (inscription seulement)
await page.getByLabel('Numéro de téléphone').fill('+221771234567');

// Confirmation mot de passe (inscription seulement)
await page.getByLabel('Confirmer le mot de passe').fill('password123');
```

#### Boutons d'Action
```typescript
// Connexion
await page.getByRole('button', { name: 'Connexion' }).click();

// Inscription Client
await page.getByRole('button', { name: 'S\'inscrire' }).click();

// Inscription Prestataire
await page.getByRole('button', { name: 'S\'inscrire en tant que Prestataire' }).click();
```

### Flow Complet d'Inscription Client
```typescript
// Étape 1: Navigation vers la page de connexion
await page.getByRole('button', { name: 'Connexion' }).click();

// Étape 2: Sélection du type Client (par défaut)
await page.getByRole('tab', { name: 'Client' }).click();

// Étape 3: Aller à l'inscription
await page.getByRole('tab', { name: 'S\'inscrire' }).click();

// Étape 4: Remplir le formulaire
await page.getByLabel('Nom complet').fill('Marie Dupont');
await page.getByLabel('Email').fill('marie@example.com');
await page.getByLabel('Numéro de téléphone').fill('+221771234567');
await page.getByLabel('Mot de passe').fill('password123');
await page.getByLabel('Confirmer le mot de passe').fill('password123');

// Étape 5: Soumettre
await page.getByRole('button', { name: 'S\'inscrire' }).click();
```

---

## 2. 🧭 SYSTÈME DE NAVIGATION

### Interface Réelle (Header + App.tsx)
```typescript
// Navigation propriétaire (pas React Router)
// Utilise onNavigate() avec gestion d'état interne
```

### Problème Identifié
- **Tests attendent :** URLs traditionnelles (`/login`, `/categories`)
- **Réalité :** Navigation par état interne, pas de changement d'URL
- **Solution :** Tester la présence des composants plutôt que les URLs

### Sélecteurs de Navigation Header
```typescript
// Logo/Accueil (bouton ou zone cliquable)
await page.locator('span').filter({ hasText: 'KaayJob' }).click();

// Menu Services (desktop)
await page.getByRole('button', { name: 'Services' }).first().click();

// Menu Contact (desktop)
await page.getByRole('button', { name: 'Phone' }).click(); // Icône téléphone

// Menu mobile (hamburger)
await page.locator('button').filter({ has: page.locator('svg') }).last().click();

// Connexion (si pas connecté)
await page.getByRole('button', { name: 'Connexion' }).click();

// Profil (si connecté)
await page.getByRole('button', { name: 'User' }).click(); // Icône utilisateur
```

### Vérification de Navigation
```typescript
// Au lieu de vérifier l'URL, vérifier la présence du composant
// Exemple pour les catégories :
await page.getByRole('button', { name: 'Services' }).first().click();
await page.waitForTimeout(1000); // Attendre le changement
// Vérifier qu'un élément de la page catégories est présent
await expect(page.locator('[data-testid="category-card"]')).toBeVisible();
```

---

## 3. 📋 AFFICHAGE DES CATÉGORIES

### État Actuel
```bash
# API fonctionne : ✅ GET /api/categories → 200 OK
# Interface : ❌ Catégories non affichées sur /categories
```

### Diagnostic
- **Backend :** API fonctionnelle
- **Frontend :** ServiceCategoriesPage semble incomplet
- **Cause possible :** Erreur de rendu ou données non chargées

### Sélecteurs à Vérifier
```typescript
// Conteneur de catégories
await page.locator('[data-testid="category-card"]');

// Grille de catégories
await page.locator('.category-card, [class*="category"]');

// Message de chargement
await page.getByText(/chargement|loading/i);
```

---

## 4. 💳 SYSTÈME DE PAIEMENT (MODIFIÉ)

### ✅ Modifications Appliquées
- **CheckoutPage :** Refactorisé pour supprimer paiements
- **Flow client :** Confirmation simple sans paiement
- **Paiements :** Réservés aux abonnements prestataires uniquement

### Nouveaux Sélecteurs
```typescript
// Bouton de confirmation (remplace paiement)
await page.getByRole('button', { name: 'Confirmer la Réservation' }).click();

// Message de confirmation
await expect(page.getByText(/réservation.*confirmée/i)).toBeVisible();

// Notice paiement hors plateforme
await expect(page.getByText(/paiement.*hors.*plateforme/i)).toBeVisible();
```

---

## 5. 👤 DASHBOARD ET PROFIL

### Interface Réelle
- **Client :** `/dashboard` → UserDashboard
- **Prestataire :** `/prestataire/dashboard` → PrestataireDashboard
- **Admin :** `/admin/dashboard` → AdminDashboard

### Sélecteurs Dashboard Client
```typescript
// Réservations récentes
await page.locator('[data-testid="booking-card"]');

// Boutons d'action
await page.getByRole('link', { name: /réservations/i });
await page.getByRole('link', { name: /paramètres/i });
await page.getByRole('link', { name: /profil/i });
```

---

## 6. 🔔 SYSTÈME DE NOTIFICATIONS

### Composants Existants
- **NotificationDropdown :** Pour clients connectés
- **PrestataireNotifications :** Pour prestataires
- **AdminNotifications :** Pour admins

### Sélecteurs
```typescript
// Icône de notification (cloche)
await page.locator('[data-testid="notification-bell"]').click();

// Dropdown de notifications
await page.locator('[data-testid="notification-dropdown"]');

// Items de notification
await page.locator('[data-testid="notification-item"]');
```

---

## 📋 PLAN DE REFACTORISATION

### Phase 1 : Correction Authentification
```bash
# Modifier tous les tests d'authentification
# Remplacer les anciens sélecteurs par les vrais
```

### Phase 2 : Correction Navigation
```bash
# Supprimer les vérifications d'URL
# Tester la présence des composants au lieu des routes
```

### Phase 3 : Correction Catégories
```bash
# Déboguer ServiceCategoriesPage
# S'assurer que les données sont affichées
```

### Phase 4 : Tests Fonctionnels
```bash
# Tester les vrais flows utilisateur
# Vérifier les interactions réelles
```

### Phase 5 : CI/CD
```bash
# Intégrer les tests corrigés dans le pipeline
# Automatisation des tests sur les PR
```

---

## 🔧 OUTILS DE DIAGNOSTIC

### Commandes Utiles
```bash
# Analyser les sélecteurs disponibles
npx playwright codegen http://localhost:3000

# Debug en mode headed
npx playwright test --headed --debug

# Tests spécifiques
npx playwright test basic.spec.ts --reporter=line
```

### Extensions Chrome
- **Playwright Inspector** pour analyser les sélecteurs
- **React DevTools** pour comprendre la structure des composants

---

*Document créé pour guider la refactorisation des tests E2E KaayJob*
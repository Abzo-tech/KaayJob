# Prompt pour Copilot - Reproduction des designs KaayJob

## Contexte du projet

Tu travailles sur une application web de marketplace de services au Sénégal appelée **KaayJob**. Le projet utilise :

- **Frontend** : React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend** : Express.js + Prisma + PostgreSQL

## Fichiers de design à analyser

Les designs se trouvent dans le dossier : `/home/abzo/KaayJob/imgforkaayJob/`

Les images à analyser :

1. `profile_client.png` - Design de la page profil client
2. `profile_prestataire.png` - Design de la page profil prestataire (partie 1)
3. `profile_prestataire_suite.png` - Design de la page profil prestataire (suite/continuation)
4. `contact.png` - Design de la page contact
5. `geolocalisation.png` - Design de la géolocalisation (optionnel)

## Tâche à accomplir

### 1. Analyser les images de design

Pour chaque image, identifie :

- La structure générale (layout, header, sidebar, contenu)
- Les couleurs principales et secondaires
- Les typographies
- Les composants UI (boutons, cartes, formulaires, etc.)
- La disposition des éléments (grid, flex, etc.)
- Les icônes utilisées

### 2. Reproduire les pages en code React

#### Page Profil Client (`front/src/components/client/UserDashboard.tsx` à refaire)

- Header avec logo KaayJob et menu de navigation
- Section profil avec photo, nom, email, téléphone
- Statistiques du client (nombre de réservations, services aimés, etc.)
- Historique des réservations récentes
- Paramètres du compte

#### Page Profil Prestataire (`front/src/components/prestataire/PrestataireProfile.tsx` à refaire)

- Header avec logo et navigation
- Section profil professionnel (photo, nom, spécialisation, note)
- Services proposés avec prix
- Disponibilité et zone de service
- Calendrier de disponibilité
- Portfolio/travaux réalisés
- Section "Suite" avec coordonnées bancaires, documents, etc.

#### Page Contact (`front/src/components/client/ContactPage.tsx` à refaire)

- Formulaire de contact (nom, email, téléphone, message)
- Informations de contact (adresse, téléphone, email)
- Questions fréquentes (FAQ)
- Carte/indication de localisation

## Composants UI à utiliser

Le projet utilise déjà shadcn/ui. Utilise les composants existants :

- Button, Card, Input, Textarea
- Avatar, Badge
- Form components
- Tabs pour organiser le contenu

## Instructions pour Copilot

1. **Analyse d'abord** chaque image de design en détail
2. **Décris** la structure et les éléments clés de chaque page
3. **Crée** les composants nécessaires dans `front/src/components/`
4. **Met à jour** les fichiers existants avec le nouveau design
5. **Respecte** le style visuel de l'application (couleurs KaayJob : bleu #000080, orange #FF6B35)

## Couleurs de la marque KaayJob

- Primary : Bleu foncé #000080
- Secondary : Orange #FF6B35
- Accent : Crème #FFF4EA
- Background : Blanc #FFFFFF
- Text : Noir #1A1A1A

## Fichiers existants à consulter pour comprendre la structure

- `front/src/components/client/UserDashboard.tsx`
- `front/src/components/prestataire/PrestataireProfile.tsx`
- `front/src/components/client/ContactPage.tsx`
- `front/src/App.tsx` (pour le routing)

---

**IMPORTANT** : Tu dois ANALYSER LES IMAGES pour comprendre le design avant de coder. Chaque image contient un mockup complet de la page.

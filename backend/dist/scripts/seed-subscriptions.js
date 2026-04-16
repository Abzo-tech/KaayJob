"use strict";
/**
 * Script d'initialisation des données de base
 * Crée des plans d'abonnement par défaut
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedSubscriptionPlans = seedSubscriptionPlans;
const database_1 = require("../config/database");
async function seedSubscriptionPlans() {
    try {
        console.log("🌱 Initialisation des plans d'abonnement...");
        // Vérifier si des plans existent déjà
        const existingPlans = await (0, database_1.query)("SELECT COUNT(*) as count FROM subscription_plans");
        if (parseInt(existingPlans.rows[0].count, 10) > 0) {
            console.log("📋 Plans d'abonnement déjà existants");
            return;
        }
        // Créer les plans d'abonnement par défaut
        const plans = [
            {
                name: "Basic",
                slug: "basic",
                description: "Plan de base pour débuter",
                price: 25000, // 25,000 FCFA
                duration: 30, // 30 jours
                features: JSON.stringify([
                    "Jusqu'à 5 services actifs",
                    "Support client basique",
                    "Statistiques simples"
                ]),
                display_order: 1
            },
            {
                name: "Pro",
                slug: "pro",
                description: "Plan professionnel pour les prestataires actifs",
                price: 50000, // 50,000 FCFA
                duration: 30,
                features: JSON.stringify([
                    "Jusqu'à 20 services actifs",
                    "Support client prioritaire",
                    "Statistiques avancées",
                    "Promotions spéciales",
                    "Badge premium"
                ]),
                display_order: 2
            },
            {
                name: "Premium",
                slug: "premium",
                description: "Plan premium pour les professionnels établis",
                price: 100000, // 100,000 FCFA
                duration: 30,
                features: JSON.stringify([
                    "Services illimités",
                    "Support client 24/7",
                    "Statistiques complètes",
                    "Promotions exclusives",
                    "Badge premium + vérification",
                    "API access",
                    "Marketing tools"
                ]),
                display_order: 3
            }
        ];
        for (const plan of plans) {
            await (0, database_1.query)(`
        INSERT INTO subscription_plans (
          id, name, slug, description, price, duration, features, is_active, display_order, created_at, updated_at
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, true, $7, NOW(), NOW()
        )
      `, [
                plan.name,
                plan.slug,
                plan.description,
                plan.price,
                plan.duration,
                plan.features,
                plan.display_order
            ]);
        }
        console.log("✅ Plans d'abonnement créés avec succès");
    }
    catch (error) {
        console.error("❌ Erreur lors de l'initialisation des plans:", error);
    }
}
//# sourceMappingURL=seed-subscriptions.js.map
"use strict";
/**
 * Contrôleur pour les abonnements
 * Gère les abonnements des prestataires aux plans
 * Utilise les requêtes SQL directes
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionController = void 0;
const database_1 = require("../config/database");
class SubscriptionController {
    /**
      * Obtenir tous les plans d'abonnement disponibles
      */
    static async getPlans(req, res) {
        try {
            const plansQuery = `
        SELECT
          id, name, slug, description, price, duration,
          features, is_active as "isActive", display_order as "displayOrder"
        FROM subscription_plans
        WHERE is_active = true
        ORDER BY display_order ASC, created_at DESC
      `;
            const plansResult = await (0, database_1.query)(plansQuery, []);
            const plans = plansResult.rows.map((row) => ({
                id: row.id,
                name: row.name,
                slug: row.slug,
                description: row.description,
                price: parseFloat(row.price),
                duration: row.duration,
                features: row.features,
                isActive: row.isActive,
                displayOrder: row.displayOrder,
            }));
            res.json({
                success: true,
                data: plans
            });
        }
        catch (error) {
            console.error("Erreur récupération plans:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
    /**
      * Obtenir un plan d'abonnement par ID
      */
    static async getPlanById(req, res) {
        try {
            const { id } = req.params;
            const planQuery = `
        SELECT
          id, name, slug, description, price, duration,
          features, is_active as "isActive", display_order as "displayOrder"
        FROM subscription_plans
        WHERE id = $1 AND is_active = true
      `;
            const planResult = await (0, database_1.query)(planQuery, [id]);
            if (planResult.rows.length === 0) {
                res.status(404).json({ success: false, message: "Plan non trouvé" });
                return;
            }
            const row = planResult.rows[0];
            const plan = {
                id: row.id,
                name: row.name,
                slug: row.slug,
                description: row.description,
                price: parseFloat(row.price),
                duration: row.duration,
                features: row.features,
                isActive: row.isActive,
                displayOrder: row.displayOrder,
            };
            res.json({
                success: true,
                data: plan
            });
        }
        catch (error) {
            console.error("Erreur récupération plan:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
    /**
      * Obtenir les abonnements de l'utilisateur connecté
      */
    static async getMySubscriptions(req, res) {
        try {
            const user = req.user;
            if (!user?.id) {
                res.status(401).json({ success: false, message: 'Utilisateur non authentifié' });
                return;
            }
            const subscriptionsQuery = `
        SELECT
          s.id, s.plan, s.status, s.start_date as "startDate", s.end_date as "endDate",
          s.created_at as "createdAt",
          sp.id as "planId", sp.name as "planName", sp.price as "planPrice",
          sp.duration as "planDuration", sp.features as "planFeatures"
        FROM subscriptions s
        LEFT JOIN subscription_plans sp ON s.subscription_plan_id = sp.id
        WHERE s.user_id = $1
        ORDER BY s.created_at DESC
      `;
            const subscriptionsResult = await (0, database_1.query)(subscriptionsQuery, [user.id]);
            const subscriptions = subscriptionsResult.rows.map((row) => ({
                id: row.id,
                plan: row.plan,
                status: row.status,
                startDate: row.startDate,
                endDate: row.endDate,
                createdAt: row.createdAt,
                subscriptionPlan: row.planId ? {
                    id: row.planId,
                    name: row.planName,
                    price: parseFloat(row.planPrice),
                    duration: row.planDuration,
                    features: row.planFeatures,
                } : null,
            }));
            res.json({
                success: true,
                data: subscriptions
            });
        }
        catch (error) {
            console.error("Erreur récupération abonnements:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
    /**
      * Obtenir l'abonnement actif de l'utilisateur
      */
    static async getMyActiveSubscription(req, res) {
        try {
            const user = req.user;
            if (!user?.id) {
                res.status(401).json({ success: false, message: 'Utilisateur non authentifié' });
                return;
            }
            const subscriptionQuery = `
        SELECT
          s.id, s.plan, s.status, s.start_date as "startDate", s.end_date as "endDate",
          s.created_at as "createdAt",
          sp.id as "planId", sp.name as "planName", sp.price as "planPrice",
          sp.duration as "planDuration", sp.features as "planFeatures"
        FROM subscriptions s
        LEFT JOIN subscription_plans sp ON s.subscription_plan_id = sp.id
        WHERE s.user_id = $1 AND s.status = 'active' AND s.end_date > NOW()
        ORDER BY s.created_at DESC
        LIMIT 1
      `;
            const subscriptionResult = await (0, database_1.query)(subscriptionQuery, [user.id]);
            if (subscriptionResult.rows.length === 0) {
                res.json({
                    success: true,
                    data: null,
                    message: "Aucun abonnement actif"
                });
                return;
            }
            const row = subscriptionResult.rows[0];
            const subscription = {
                id: row.id,
                plan: row.plan,
                status: row.status,
                startDate: row.startDate,
                endDate: row.endDate,
                createdAt: row.createdAt,
                subscriptionPlan: {
                    id: row.planId,
                    name: row.planName,
                    price: parseFloat(row.planPrice),
                    duration: row.planDuration,
                    features: row.planFeatures,
                },
            };
            res.json({
                success: true,
                data: subscription
            });
        }
        catch (error) {
            console.error("Erreur récupération abonnement actif:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
    /**
      * Souscrire à un plan d'abonnement
      */
    static async subscribe(req, res) {
        try {
            const user = req.user;
            const { planId } = req.body;
            if (!user?.id) {
                res.status(401).json({ success: false, message: 'Utilisateur non authentifié' });
                return;
            }
            // Vérifier que le plan existe
            const planQuery = `SELECT * FROM subscription_plans WHERE id = $1 AND is_active = true`;
            const planResult = await (0, database_1.query)(planQuery, [planId]);
            if (planResult.rows.length === 0) {
                res.status(404).json({ success: false, message: "Plan d'abonnement non trouvé" });
                return;
            }
            const plan = planResult.rows[0];
            // Vérifier s'il y a déjà un abonnement actif
            const existingSubscriptionQuery = `
        SELECT id FROM subscriptions
        WHERE user_id = $1 AND status = 'active' AND end_date > NOW()
      `;
            const existingResult = await (0, database_1.query)(existingSubscriptionQuery, [user.id]);
            if (existingResult.rows.length > 0) {
                res.status(400).json({
                    success: false,
                    message: "Vous avez déjà un abonnement actif"
                });
                return;
            }
            // Calculer les dates
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + plan.duration);
            // Créer l'abonnement
            const subscribeQuery = `
        INSERT INTO subscriptions (
          id, user_id, subscription_plan_id, plan, status, start_date, end_date, created_at
        )
        VALUES (
          gen_random_uuid(), $1, $2, $3, 'active', $4, $5, NOW()
        )
        RETURNING id, plan, status, start_date as "startDate", end_date as "endDate", created_at as "createdAt"
      `;
            const subscribeResult = await (0, database_1.query)(subscribeQuery, [
                user.id,
                planId,
                plan.name,
                startDate,
                endDate
            ]);
            const newSubscription = subscribeResult.rows[0];
            // Note: Le paiement est géré en dehors de la plateforme pour cette version
            // Les prestataires paient directement via d'autres moyens
            res.status(201).json({
                success: true,
                message: "Abonnement créé avec succès",
                data: {
                    ...newSubscription,
                    subscriptionPlan: {
                        id: plan.id,
                        name: plan.name,
                        price: parseFloat(plan.price),
                        duration: plan.duration,
                        features: plan.features,
                    }
                }
            });
        }
        catch (error) {
            console.error("Erreur création abonnement:", error);
            if (error.code === '23505') {
                res.status(400).json({
                    success: false,
                    message: "Vous avez déjà un abonnement à ce plan"
                });
            }
            else {
                res.status(500).json({ success: false, message: "Erreur serveur" });
            }
        }
    }
    /**
      * Annuler un abonnement
      */
    static async cancelSubscription(req, res) {
        try {
            const user = req.user;
            const { id } = req.params;
            if (!user?.id) {
                res.status(401).json({ success: false, message: 'Utilisateur non authentifié' });
                return;
            }
            // Vérifier que l'abonnement appartient à l'utilisateur
            const subscriptionQuery = `
        SELECT id FROM subscriptions
        WHERE id = $1 AND user_id = $2 AND status = 'active'
      `;
            const subscriptionResult = await (0, database_1.query)(subscriptionQuery, [id, user.id]);
            if (subscriptionResult.rows.length === 0) {
                res.status(404).json({ success: false, message: "Abonnement non trouvé" });
                return;
            }
            // Annuler l'abonnement
            const cancelQuery = `
        UPDATE subscriptions
        SET status = 'cancelled', end_date = NOW()
        WHERE id = $1
        RETURNING id, status, end_date as "endDate"
      `;
            const cancelResult = await (0, database_1.query)(cancelQuery, [id]);
            const cancelledSubscription = cancelResult.rows[0];
            res.json({
                success: true,
                message: "Abonnement annulé avec succès",
                data: cancelledSubscription
            });
        }
        catch (error) {
            console.error("Erreur annulation abonnement:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
}
exports.SubscriptionController = SubscriptionController;
exports.default = SubscriptionController;
//# sourceMappingURL=subscriptionController.js.map
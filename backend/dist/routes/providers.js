"use strict";
/**
 * Routes des prestataires
 * Utilise le ProviderController pour la logique métier
 * Validations centralisées dans src/validations/index.ts
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const providerController_1 = __importDefault(require("../controllers/providerController"));
const auth_1 = require("../middleware/auth");
const validations_1 = require("../validations");
const database_1 = require("../config/database");
const prisma_1 = require("../config/prisma");
const router = (0, express_1.Router)();
// GET /api/providers - Liste des prestataires (public)
router.get("/", async (req, res) => {
    await providerController_1.default.getAll(req, res);
});
// GET /api/providers/categories - Catégories disponibles
router.get("/categories", async (req, res) => {
    await providerController_1.default.getCategories(req, res);
});
// GET /api/providers/me - Profil du prestataire actuel (doit être avant /:id)
router.get("/me", auth_1.authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await (0, database_1.query)(`SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.role,
                u.bio, u.specialization, u.address, u.zone, u.avatar,
                u.is_verified, u.created_at,
                p.availability, p.response_time, p.completion_rate
         FROM users u
         LEFT JOIN provider_profiles p ON u.id = p.user_id
         WHERE u.id = $1`, [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Prestataire non trouvé" });
        }
        const provider = result.rows[0];
        res.json({
            success: true,
            data: {
                id: provider.id,
                email: provider.email,
                firstName: provider.first_name,
                lastName: provider.last_name,
                phone: provider.phone,
                role: provider.role,
                bio: provider.bio,
                specialization: provider.specialization,
                address: provider.address,
                zone: provider.zone,
                avatar: provider.avatar,
                isVerified: provider.is_verified,
                createdAt: provider.created_at,
                availability: provider.availability || null,
                responseTime: provider.response_time,
                completionRate: provider.completion_rate,
            },
        });
    }
    catch (error) {
        console.error("Erreur récupération profil:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
// GET /api/providers/me/dashboard - Tableau de bord prestataire
router.get("/me/dashboard", auth_1.authenticate, async (req, res) => {
    await providerController_1.default.getDashboard(req, res);
});
// GET /api/providers/:id - Profil d'un prestataire
router.get("/:id", async (req, res) => {
    await providerController_1.default.getById(req, res);
});
// GET /api/providers/:id/services - Services d'un prestataire
router.get("/:id/services", async (req, res) => {
    await providerController_1.default.getServices(req, res);
});
// GET /api/providers/:id/reviews - Avis d'un prestataire
router.get("/:id/reviews", async (req, res) => {
    await providerController_1.default.getReviews(req, res);
});
// PUT /api/providers/profile - Mettre à jour son profil (prestataire uniquement)
router.put("/profile", auth_1.authenticate, validations_1.updateProviderProfileValidation, async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    await providerController_1.default.updateProfile(req, res);
});
// PUT /api/providers/profile/availability - Mettre à jour la disponibilité
router.put("/profile/availability", auth_1.authenticate, [(0, express_validator_1.body)("availability").isObject().withMessage("Disponibilité invalide")], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    await providerController_1.default.updateAvailability(req, res);
});
// PUT /api/providers/profile/verification - Demander la vérification
router.post("/profile/verification", auth_1.authenticate, [(0, express_validator_1.body)("documents").isArray().withMessage("Documents requis")], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    await providerController_1.default.requestVerification(req, res);
});
// GET /api/providers/me/stats - Statistiques prestataire
router.get("/me/stats", auth_1.authenticate, async (req, res) => {
    await providerController_1.default.getStats(req, res);
});
// GET /api/providers/me/subscription - Abonnement actuel du prestataire
router.get("/me/subscription", auth_1.authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        // Récupérer l'abonnement actuel
        const result = await (0, database_1.query)(`SELECT s.*, u.email, u.first_name, u.last_name
       FROM subscriptions s
       JOIN users u ON s.user_id = u.id
       WHERE s.user_id = $1
       ORDER BY s.created_at DESC
       LIMIT 1`, [userId]);
        if (result.rows.length === 0) {
            return res.json({
                success: true,
                data: null,
                message: "Aucun abonnement actif",
            });
        }
        res.json({
            success: true,
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error("Erreur abonnement:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
// POST /api/providers/me/subscription/subscribe - Souscrire à un abonnement
router.post("/me/subscription/subscribe", auth_1.authenticate, [
    (0, express_validator_1.body)("plan").notEmpty().withMessage("Plan requis"),
    (0, express_validator_1.body)("duration")
        .optional()
        .isInt({ min: 1, max: 12 })
        .withMessage("Durée invalide (1-12 mois)"),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        const userId = req.user.id;
        const { plan: planSlug, duration = 1, paymentMethod, phoneNumber, } = req.body;
        // Vérifier si l'utilisateur est un prestataire
        const userResult = await (0, database_1.query)("SELECT id, role FROM users WHERE id = $1", [userId]);
        if (userResult.rows.length === 0) {
            return res
                .status(404)
                .json({ success: false, message: "Utilisateur non trouvé" });
        }
        if (userResult.rows[0].role !== "PRESTATAIRE") {
            return res.status(403).json({
                success: false,
                message: "Seuls les prestataires peuvent s'abonner",
            });
        }
        // Récupérer le plan depuis la base de données
        let planPrice = 0;
        let planDuration = 30;
        try {
            const planData = await prisma_1.prisma.subscriptionPlan.findUnique({
                where: { slug: planSlug },
            });
            if (planData) {
                planPrice = Number(planData.price);
                planDuration = planData.duration;
            }
        }
        catch (e) {
            // Fallback vers les plans par défaut
            const defaultPrices = {
                gratuit: 0,
                premium: 9900,
                pro: 24900,
            };
            planPrice = defaultPrices[planSlug] || 0;
        }
        // Déterminer le statut de l'abonnement
        // Pour les plans gratuits, activer directement
        // Pour les plans payants, exiger une confirmation de paiement
        let subscriptionStatus = "active";
        if (planPrice > 0) {
            // Dans un vrai système, vérifier ici le paiement auprès du provider
            // Pour l'instant, on simule que le paiement est réussi si la méthode est fournie
            if (!paymentMethod) {
                return res.status(400).json({
                    success: false,
                    message: "Méthode de paiement requise pour les abonnements payants",
                });
            }
            // Le paiement est considéré comme réussi (simulation)
            subscriptionStatus = "active";
        }
        // Calculer les dates
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + planDuration);
        // Vérifier si un abonnement existe déjà
        const existingSub = await (0, database_1.query)("SELECT id FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1", [userId]);
        let result;
        if (existingSub.rows.length > 0) {
            // Mettre à jour l'abonnement existant
            result = await (0, database_1.query)(`UPDATE subscriptions 
           SET plan = $1, status = $2, start_date = $3, end_date = $4
           WHERE id = $5 
           RETURNING *`, [
                planSlug,
                subscriptionStatus,
                startDate,
                endDate,
                existingSub.rows[0].id,
            ]);
        }
        else {
            // Créer un nouvel abonnement
            result = await (0, database_1.query)(`INSERT INTO subscriptions (id, user_id, plan, status, start_date, end_date, created_at)
           VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW())
           RETURNING *`, [userId, planSlug, subscriptionStatus, startDate, endDate]);
        }
        // Enregistrer le paiement si fourni
        if (planPrice > 0 && paymentMethod) {
            await (0, database_1.query)(`INSERT INTO payments (id, user_id, amount, payment_method, status, created_at)
           VALUES (gen_random_uuid(), $1, $2, $3, 'PAID', NOW())`, [userId, planPrice, paymentMethod]);
        }
        const message = planPrice > 0
            ? `Paiement réussi ! Abonnement ${planSlug.toUpperCase()} activé`
            : `Abonnement ${planSlug.toUpperCase()} activé avec succès`;
        res.status(201).json({
            success: true,
            message,
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error("Erreur abonnement:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
// Plans d'abonnement disponibles (fallback)
const subscriptionPlans = [
    {
        id: "1",
        slug: "gratuit",
        name: "Gratuit",
        description: "Plan gratuit avec fonctionnalités de base",
        price: 0,
        duration: 0,
        features: [
            "5 services maximum",
            "Visibilité standard",
            "Support par email",
        ],
        isActive: true,
    },
    {
        id: "2",
        slug: "premium",
        name: "Premium",
        description: "Plan premium avec plus de visibilité",
        price: 9900,
        duration: 30,
        features: [
            "Services illimités",
            "Badge VIP",
            "Visibilité prioritaire",
            "Support prioritaire",
            "Statistiques avancées",
        ],
        isActive: true,
    },
    {
        id: "3",
        slug: "pro",
        name: "Pro",
        description: "Plan professionnel avec toutes les fonctionnalités",
        price: 24900,
        duration: 30,
        features: [
            "Tout Premium",
            "Publication en premier",
            "Badge Pro",
            "Formation exclusive",
            "Gestion équipe",
        ],
        isActive: true,
    },
];
// GET /api/providers/subscription/plans - Liste des plans disponibles
router.get("/subscription/plans", async (req, res) => {
    try {
        // Essayer de récupérer les plans depuis la base de données
        const plans = await prisma_1.prisma.subscriptionPlan.findMany({
            where: { isActive: true },
            orderBy: { displayOrder: "asc" },
        });
        if (plans.length > 0) {
            // Transformer les données pour le format attendu
            const formattedPlans = plans.map((p) => ({
                id: p.id,
                slug: p.slug,
                name: p.name,
                description: p.description,
                price: Number(p.price),
                duration: p.duration,
                features: typeof p.features === 'string' ? JSON.parse(p.features) : p.features || [],
                isActive: p.isActive,
            }));
            return res.json({
                success: true,
                data: formattedPlans,
            });
        }
        // Fallback vers les plans par défaut
        res.json({
            success: true,
            data: subscriptionPlans,
        });
    }
    catch (error) {
        console.error("Erreur récupération plans:", error);
        res.json({
            success: true,
            data: subscriptionPlans,
        });
    }
});
// GET /api/providers/me/subscription/history - Historique des abonnements
router.get("/me/subscription/history", auth_1.authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const history = await (0, database_1.query)(`SELECT s.*, sp.name as plan_name, sp.slug as plan_slug
         FROM subscriptions s
         LEFT JOIN subscription_plans sp ON s.plan = sp.slug
         WHERE s.user_id = $1
         ORDER BY s.created_at DESC
         LIMIT 10`, [userId]);
        res.json({
            success: true,
            data: history.rows,
        });
    }
    catch (error) {
        console.error("Erreur historique:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
// POST /api/providers/me/subscription/cancel - Annuler l'abonnement
router.post("/me/subscription/cancel", auth_1.authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        // Mettre à jour le statut de l'abonnement
        const result = await (0, database_1.query)(`UPDATE subscriptions 
         SET status = 'cancelled', updated_at = NOW()
         WHERE user_id = $1 AND status = 'active'
         RETURNING *`, [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Aucun abonnement actif à annuler",
            });
        }
        res.json({
            success: true,
            message: "Abonnement annulé avec succès",
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error("Erreur annulation:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
// GET /api/providers/me/payments - Historique des paiements
router.get("/me/payments", auth_1.authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const payments = await (0, database_1.query)(`SELECT p.*, s.name as service_name
         FROM payments p
         LEFT JOIN bookings b ON p.booking_id = b.id
         LEFT JOIN services s ON b.service_id = s.id
         WHERE p.user_id = $1
         ORDER BY p.created_at DESC
         LIMIT 20`, [userId]);
        res.json({
            success: true,
            data: payments.rows,
        });
    }
    catch (error) {
        console.error("Erreur paiements:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
exports.default = router;
//# sourceMappingURL=providers.js.map
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
const router = (0, express_1.Router)();
// GET /api/providers - Liste des prestataires (public)
router.get("/", async (req, res) => {
    await providerController_1.default.getAll(req, res);
});
// GET /api/providers/categories - Catégories disponibles
router.get("/categories", async (req, res) => {
    await providerController_1.default.getCategories(req, res);
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
// GET /api/providers/me/dashboard - Tableau de bord prestataire
router.get("/me/dashboard", auth_1.authenticate, async (req, res) => {
    await providerController_1.default.getDashboard(req, res);
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
    (0, express_validator_1.body)("plan")
        .notEmpty()
        .withMessage("Plan requis")
        .isIn(["gratuit", "premium", "pro"])
        .withMessage("Plan invalide: gratuit, premium ou pro"),
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
        const { plan, duration = 1 } = req.body;
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
        // Calculer les dates
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + Number(duration));
        // Vérifier si un abonnement existe déjà
        const existingSub = await (0, database_1.query)("SELECT id FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1", [userId]);
        let result;
        if (existingSub.rows.length > 0) {
            // Mettre à jour l'abonnement existant
            result = await (0, database_1.query)(`UPDATE subscriptions 
           SET plan = $1, status = 'active', start_date = $2, end_date = $3
           WHERE id = $4 
           RETURNING *`, [plan, startDate, endDate, existingSub.rows[0].id]);
        }
        else {
            // Créer un nouvel abonnement
            result = await (0, database_1.query)(`INSERT INTO subscriptions (id, user_id, plan, status, start_date, end_date, created_at)
           VALUES (gen_random_uuid(), $1, $2, 'active', $3, $4, NOW())
           RETURNING *`, [userId, plan, startDate, endDate]);
        }
        res.status(201).json({
            success: true,
            message: `Abonnement ${plan.toUpperCase()} activé avec succès`,
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error("Erreur abonnement:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
// Plans d'abonnement disponibles
const subscriptionPlans = [
    {
        id: "gratuit",
        name: "Gratuit",
        price: 0,
        duration: "Indéfinie",
        features: [
            "5 services maximum",
            "Visibilité standard",
            "Support par email",
        ],
    },
    {
        id: "premium",
        name: "Premium",
        price: 9900,
        duration: "1 mois",
        features: [
            "Services illimités",
            "Badge VIP",
            "Visibilité prioritaire",
            "Support prioritaire",
            "Statistiques avancées",
        ],
    },
    {
        id: "pro",
        name: "Pro",
        price: 24900,
        duration: "1 mois",
        features: [
            "Tout Premium",
            "Publication en premier",
            "Badge Pro",
            "Formation exclusive",
            "Gestion équipe",
        ],
    },
];
// GET /api/providers/subscription/plans - Liste des plans disponibles
router.get("/subscription/plans", async (req, res) => {
    res.json({
        success: true,
        data: subscriptionPlans,
    });
});
exports.default = router;
//# sourceMappingURL=providers.js.map
"use strict";
/**
 * Routes des abonnements
 * Utilise le SubscriptionController pour la logique métier
 * Validations centralisées dans src/validations/index.ts
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subscriptionController_1 = __importDefault(require("../controllers/subscriptionController"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET /api/subscriptions/plans - Plans d'abonnement disponibles (public)
router.get("/plans", async (req, res) => {
    await subscriptionController_1.default.getPlans(req, res);
});
// GET /api/subscriptions/plans/:id - Détails d'un plan
router.get("/plans/:id", async (req, res) => {
    await subscriptionController_1.default.getPlanById(req, res);
});
// Routes nécessitant authentification
router.use(auth_1.authenticate);
// GET /api/subscriptions/me - Mes abonnements
router.get("/me", async (req, res) => {
    await subscriptionController_1.default.getMySubscriptions(req, res);
});
// GET /api/subscriptions/active - Mon abonnement actif
router.get("/active", async (req, res) => {
    await subscriptionController_1.default.getMyActiveSubscription(req, res);
});
// POST /api/subscriptions - Souscrire à un plan
router.post("/", async (req, res) => {
    const { planId } = req.body;
    if (!planId) {
        return res.status(400).json({
            success: false,
            message: "planId est requis"
        });
    }
    await subscriptionController_1.default.subscribe(req, res);
});
// DELETE /api/subscriptions/:id - Annuler un abonnement
router.delete("/:id", async (req, res) => {
    await subscriptionController_1.default.cancelSubscription(req, res);
});
exports.default = router;
//# sourceMappingURL=subscriptions.js.map
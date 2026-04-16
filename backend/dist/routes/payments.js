"use strict";
/**
 * Routes des paiements
 * Utilise le PaymentController pour la logique métier
 * Validations centralisées dans src/validations/index.ts
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = __importDefault(require("../controllers/paymentController"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Toutes les routes nécessitent authentification
router.use(auth_1.authenticate);
// GET /api/payments/me - Mes paiements
router.get("/me", async (req, res) => {
    await paymentController_1.default.getMyPayments(req, res);
});
// GET /api/payments/:id - Détails d'un paiement d'abonnement
router.get("/:id", async (req, res) => {
    await paymentController_1.default.getPaymentById(req, res);
});
// Routes admin seulement
router.use(auth_1.requireAdmin);
// GET /api/payments - Tous les paiements (Admin)
router.get("/", async (req, res) => {
    await paymentController_1.default.getAllPayments(req, res);
});
// PUT /api/payments/:id/status - Mettre à jour le statut d'un paiement (Admin)
router.put("/:id/status", async (req, res) => {
    const { status } = req.body;
    if (!status) {
        return res.status(400).json({
            success: false,
            message: "status est requis"
        });
    }
    await paymentController_1.default.updatePaymentStatus(req, res);
});
exports.default = router;
//# sourceMappingURL=payments.js.map
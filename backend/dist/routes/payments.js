"use strict";
/**
 * Routes de paiement
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const express_validator_1 = require("express-validator");
const paymentService_1 = require("../services/paymentService");
const router = (0, express_1.Router)();
// POST /api/payments/subscription - Traiter un paiement d'abonnement
router.post("/subscription", auth_1.authenticate, [
    (0, express_validator_1.body)("amount").isNumeric().withMessage("Montant invalide"),
    (0, express_validator_1.body)("paymentMethod").notEmpty().withMessage("Méthode de paiement requise"),
    (0, express_validator_1.body)("planName").notEmpty().withMessage("Nom du plan requis"),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        const user = req.user;
        const { amount, paymentMethod, planName } = req.body;
        // Traiter le paiement d'abonnement
        await (0, paymentService_1.processSubscriptionPayment)(user.id, Number(amount), paymentMethod, planName);
        res.json({
            success: true,
            message: "Paiement d'abonnement traité avec succès",
        });
    }
    catch (error) {
        console.error("Erreur traitement paiement abonnement:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
exports.default = router;
//# sourceMappingURL=payments.js.map
"use strict";
/**
 * Routes des avis
 * Utilise le ReviewController pour la logique métier
 * Validations centralisées dans src/validations/index.ts
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const reviewController_1 = __importDefault(require("../controllers/reviewController"));
const auth_1 = require("../middleware/auth");
const validations_1 = require("../validations");
const router = (0, express_1.Router)();
// GET /api/reviews - Liste des avis (admin)
router.get("/", auth_1.authenticate, async (req, res) => {
    await reviewController_1.default.getAll(req, res);
});
// GET /api/reviews/service/:serviceId - Avis d'un service
router.get("/service/:serviceId", async (req, res) => {
    await reviewController_1.default.getByService(req, res);
});
// GET /api/reviews/provider/:providerId - Avis d'un prestataire
router.get("/provider/:providerId", async (req, res) => {
    await reviewController_1.default.getByProvider(req, res);
});
// GET /api/reviews/booking/:bookingId - Avis d'une réservation
router.get("/booking/:bookingId", async (req, res) => {
    await reviewController_1.default.getByBooking(req, res);
});
// POST /api/reviews - Créer un avis
router.post("/", auth_1.authenticate, validations_1.createReviewValidation, async (req, res) => {
    console.log("📝 POST /api/reviews called with body:", req.body);
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log("❌ Validation errors:", errors.array());
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    console.log("✅ Validation passed, calling controller");
    await reviewController_1.default.create(req, res);
});
// PUT /api/reviews/:id - Modifier son avis
router.put("/:id", auth_1.authenticate, validations_1.updateReviewValidation, async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    await reviewController_1.default.update(req, res);
});
// DELETE /api/reviews/:id - Supprimer un avis
router.delete("/:id", auth_1.authenticate, async (req, res) => {
    await reviewController_1.default.delete(req, res);
});
exports.default = router;
//# sourceMappingURL=reviews.js.map
"use strict";
/**
 * Routes des réservations
 * Utilise le BookingController pour la logique métier
 * Validations centralisées dans src/validations/index.ts
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const bookingController_1 = __importDefault(require("../controllers/bookingController"));
const auth_1 = require("../middleware/auth");
const validations_1 = require("../validations");
const router = (0, express_1.Router)();
// GET /api/bookings/me - Mes réservations
router.get("/me", auth_1.authenticate, async (req, res) => {
    await bookingController_1.default.getMyBookings(req, res);
});
// GET /api/bookings - Liste des réservations (selon rôle)
router.get("/", auth_1.authenticate, async (req, res) => {
    await bookingController_1.default.getAll(req, res);
});
// POST /api/bookings - Créer une réservation
router.post("/", auth_1.authenticate, validations_1.createBookingValidation, async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    await bookingController_1.default.create(req, res);
});
// GET /api/bookings/:id
router.get("/:id", auth_1.authenticate, async (req, res) => {
    await bookingController_1.default.getById(req, res);
});
// PUT /api/bookings/:id/status - Mettre à jour le statut
router.put("/:id/status", auth_1.authenticate, validations_1.updateBookingStatusValidation, async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    await bookingController_1.default.updateStatus(req, res);
});
// DELETE /api/bookings/:id - Annuler une réservation
router.delete("/:id", auth_1.authenticate, async (req, res) => {
    await bookingController_1.default.cancel(req, res);
});
exports.default = router;
//# sourceMappingURL=bookings.js.map
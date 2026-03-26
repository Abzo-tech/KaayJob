"use strict";
/**
 * Routes d'administration - Réservations
 * Utilise le service bookingService pour la logique métier
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const bookingService_1 = require("../../services/bookingService");
const router = (0, express_1.Router)();
// GET /api/admin/bookings - Liste des réservations
router.get("/", async (req, res) => {
    try {
        const { page = 1, limit = 20, status, providerId, clientId } = req.query;
        const result = await (0, bookingService_1.listBookings)({
            page: Number(page),
            limit: Number(limit),
            status: status,
            providerId: providerId,
            clientId: clientId,
        });
        res.json({
            success: true,
            data: result.data,
            pagination: result.pagination,
        });
    }
    catch (error) {
        console.error("Erreur liste réservations:", error);
        res.status(500).json({ success: false, message: error.message || "Erreur serveur" });
    }
});
// GET /api/admin/bookings/:id - Obtenir une réservation
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await (0, bookingService_1.getBookingById)(id);
        res.json({ success: true, data: booking });
    }
    catch (error) {
        console.error("Erreur obtenir réservation:", error);
        res.status(404).json({ success: false, message: error.message || "Erreur serveur" });
    }
});
// PUT /api/admin/bookings/:id - Mettre à jour une réservation
router.put("/:id", [
    (0, express_validator_1.body)("status")
        .optional()
        .isIn([
        "PENDING",
        "CONFIRMED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
        "REJECTED",
    ])
        .withMessage("Statut invalide: PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, REJECTED"),
    (0, express_validator_1.body)("paymentStatus")
        .optional()
        .isIn(["PENDING", "PAID", "REFUNDED"])
        .withMessage("Statut paiement invalide"),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).json({ success: false, errors: errors.array() });
        const { id } = req.params;
        const { status, paymentStatus, bookingDate, bookingTime, address, city, notes, } = req.body;
        const booking = await (0, bookingService_1.updateBooking)(id, {
            status,
            paymentStatus,
            bookingDate,
            bookingTime,
            address,
            city,
            notes,
        }, req.user?.id);
        res.json({
            success: true,
            message: "Réservation mise à jour",
            data: booking,
        });
    }
    catch (error) {
        console.error("Erreur mise à jour réservation:", error);
        res.status(400).json({ success: false, message: error.message || "Erreur serveur" });
    }
});
// DELETE /api/admin/bookings/:id - Supprimer une réservation
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await (0, bookingService_1.deleteBooking)(id);
        res.json({ success: true, message: "Réservation supprimée" });
    }
    catch (error) {
        console.error("Erreur suppression réservation:", error);
        res.status(400).json({ success: false, message: error.message || "Erreur serveur" });
    }
});
exports.default = router;
//# sourceMappingURL=bookings.js.map
"use strict";
/**
 * Routes d'administration - Services
 * Utilise le service serviceService pour la logique métier
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const serviceService_1 = require("../../services/serviceService");
const router = (0, express_1.Router)();
// GET /api/admin/services - Liste des services
router.get("/", async (req, res) => {
    try {
        const { page = 1, limit = 20, category } = req.query;
        const result = await (0, serviceService_1.listServices)({
            page: Number(page),
            limit: Number(limit),
            category: category,
        });
        res.json({
            success: true,
            data: result.data,
            pagination: result.pagination,
        });
    }
    catch (error) {
        console.error("Erreur liste services:", error);
        res.status(500).json({ success: false, message: error.message || "Erreur serveur" });
    }
});
// GET /api/admin/services/:id - Obtenir un service
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const service = await (0, serviceService_1.getServiceById)(id);
        res.json({ success: true, data: service });
    }
    catch (error) {
        console.error("Erreur obtenir service:", error);
        res.status(404).json({ success: false, message: error.message || "Erreur serveur" });
    }
});
// PUT /api/admin/services/:id - Mettre à jour un service
router.put("/:id", [
    (0, express_validator_1.body)("name").optional().notEmpty().withMessage("Nom requis"),
    (0, express_validator_1.body)("description").optional(),
    (0, express_validator_1.body)("price").optional().isNumeric().withMessage("Prix invalide"),
    (0, express_validator_1.body)("duration")
        .optional()
        .isInt({ min: 15 })
        .withMessage("Durée invalide"),
    (0, express_validator_1.body)("isActive").optional().isBoolean().withMessage("Statut invalide"),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        const { id } = req.params;
        const { name, description, price, duration, isActive, priceType } = req.body;
        const service = await (0, serviceService_1.updateService)(id, { name, description, price, duration, isActive, priceType }, req.user?.id);
        res.json({
            success: true,
            message: "Service mis à jour",
            data: service,
        });
    }
    catch (error) {
        console.error("Erreur mise à jour service:", error);
        res.status(400).json({ success: false, message: error.message || "Erreur serveur" });
    }
});
// DELETE /api/admin/services/:id - Supprimer un service
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await (0, serviceService_1.deleteService)(id, req.user?.id);
        res.json({ success: true, message: "Service supprimé" });
    }
    catch (error) {
        console.error("Erreur suppression service:", error);
        res.status(400).json({ success: false, message: error.message || "Erreur serveur" });
    }
});
exports.default = router;
//# sourceMappingURL=services.js.map
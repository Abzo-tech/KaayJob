"use strict";
/**
 * Routes des services
 * Utilise le ServiceController pour la logique métier
 * Validations centralisées dans src/validations/index.ts
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const serviceController_1 = __importDefault(require("../controllers/serviceController"));
const auth_1 = require("../middleware/auth");
const validations_1 = require("../validations");
const router = (0, express_1.Router)();
// GET /api/services - Liste des services
router.get("/", async (req, res) => {
    await serviceController_1.default.getAll(req, res);
});
// GET /api/services/:id
router.get("/:id", async (req, res) => {
    await serviceController_1.default.getById(req, res);
});
// POST /api/services - Créer un service (prestataire)
router.post("/", auth_1.authenticate, validations_1.createServiceValidation, async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    await serviceController_1.default.create(req, res);
});
// PUT /api/services/:id - Mettre à jour un service
router.put("/:id", auth_1.authenticate, async (req, res) => {
    await serviceController_1.default.update(req, res);
});
// DELETE /api/services/:id
router.delete("/:id", auth_1.authenticate, async (req, res) => {
    await serviceController_1.default.delete(req, res);
});
// GET /api/services/provider/:providerId - Services d'un prestataire
router.get("/provider/:providerId", async (req, res) => {
    await serviceController_1.default.getByProvider(req, res);
});
exports.default = router;
//# sourceMappingURL=services.js.map
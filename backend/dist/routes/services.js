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
router.post("/", (req, res, next) => {
    require('fs').appendFileSync('/tmp/debug.log', `MIDDLEWARE: POST /api/services called with method: ${req.method}\n`);
    next();
}, auth_1.authenticate, validations_1.createServiceValidation, async (req, res) => {
    try {
        require('fs').appendFileSync('/tmp/debug.log', `HANDLER: Route POST /api/services called\n`);
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            require('fs').appendFileSync('/tmp/debug.log', `Validation errors: ${JSON.stringify(errors.array())}\n`);
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        require('fs').appendFileSync('/tmp/debug.log', `Calling ServiceController.create\n`);
        await serviceController_1.default.create(req, res);
    }
    catch (error) {
        require('fs').appendFileSync('/tmp/debug.log', `Route error: ${error.message}\n`);
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
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
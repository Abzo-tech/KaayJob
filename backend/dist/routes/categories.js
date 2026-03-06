"use strict";
/**
 * Routes des catégories
 * Utilise le CategoryController pour la logique métier
 * Validations centralisées dans src/validations/index.ts
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const categoryController_1 = __importDefault(require("../controllers/categoryController"));
const auth_1 = require("../middleware/auth");
const validations_1 = require("../validations");
const router = (0, express_1.Router)();
// GET /api/categories - Liste des catégories (public)
router.get("/", async (req, res) => {
    await categoryController_1.default.getAll(req, res);
});
// GET /api/categories/:id - Une catégorie
router.get("/:id", async (req, res) => {
    await categoryController_1.default.getById(req, res);
});
// GET /api/categories/:id/services - Services d'une catégorie
router.get("/:id/services", async (req, res) => {
    await categoryController_1.default.getServices(req, res);
});
// POST /api/categories - Créer une catégorie (admin)
router.post("/", auth_1.authenticate, validations_1.createCategoryValidation, async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    await categoryController_1.default.create(req, res);
});
// PUT /api/categories/:id - Modifier une catégorie (admin)
router.put("/:id", auth_1.authenticate, validations_1.updateCategoryValidation, async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    await categoryController_1.default.update(req, res);
});
// DELETE /api/categories/:id - Supprimer une catégorie (admin)
router.delete("/:id", auth_1.authenticate, async (req, res) => {
    await categoryController_1.default.delete(req, res);
});
exports.default = router;
//# sourceMappingURL=categories.js.map
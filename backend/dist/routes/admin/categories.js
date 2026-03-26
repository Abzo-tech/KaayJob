"use strict";
/**
 * Routes d'administration - Catégories
 * Utilise le service categoryService pour la logique métier
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const categoryService_1 = require("../../services/categoryService");
const router = (0, express_1.Router)();
// GET /api/admin/categories - Liste des catégories
router.get("/", async (req, res) => {
    try {
        const categories = await (0, categoryService_1.listCategories)();
        res.json({ success: true, data: categories });
    }
    catch (error) {
        console.error("Erreur liste catégories:", error);
        res.status(500).json({ success: false, message: error.message || "Erreur serveur" });
    }
});
// GET /api/admin/categories/:id - Obtenir une catégorie
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const category = await (0, categoryService_1.getCategoryById)(id);
        res.json({ success: true, data: category });
    }
    catch (error) {
        console.error("Erreur obtenir catégorie:", error);
        res.status(404).json({ success: false, message: error.message || "Erreur serveur" });
    }
});
// POST /api/admin/categories - Créer une catégorie
router.post("/", [
    (0, express_validator_1.body)("name").notEmpty().withMessage("Nom requis").isLength({ max: 50 }),
    (0, express_validator_1.body)("description").optional().isLength({ max: 200 }),
    (0, express_validator_1.body)("icon").optional().isLength({ max: 50 }),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).json({ success: false, errors: errors.array() });
        const { name, description, icon, image } = req.body;
        const category = await (0, categoryService_1.createCategory)({ name, description, icon, image }, req.user?.id);
        res.status(201).json({
            success: true,
            message: "Catégorie créée",
            data: category,
        });
    }
    catch (error) {
        console.error("Erreur création catégorie:", error);
        res.status(400).json({ success: false, message: error.message || "Erreur serveur" });
    }
});
// PUT /api/admin/categories/:id - Mettre à jour une catégorie
router.put("/:id", [
    (0, express_validator_1.body)("name")
        .optional()
        .notEmpty()
        .withMessage("Nom requis")
        .isLength({ max: 50 }),
    (0, express_validator_1.body)("description").optional().isLength({ max: 200 }),
    (0, express_validator_1.body)("icon").optional().isLength({ max: 50 }),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).json({ success: false, errors: errors.array() });
        const { id } = req.params;
        const { name, description, icon, image, isActive, displayOrder } = req.body;
        const category = await (0, categoryService_1.updateCategory)(id, { name, description, icon, image, isActive, displayOrder }, req.user?.id);
        res.json({
            success: true,
            message: "Catégorie mise à jour",
            data: category,
        });
    }
    catch (error) {
        console.error("Erreur mise à jour catégorie:", error);
        res.status(400).json({ success: false, message: error.message || "Erreur serveur" });
    }
});
// DELETE /api/admin/categories/:id - Supprimer une catégorie
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await (0, categoryService_1.deleteCategory)(id, req.user?.id);
        res.json({ success: true, message: "Catégorie supprimée" });
    }
    catch (error) {
        console.error("Erreur suppression catégorie:", error);
        res.status(400).json({ success: false, message: error.message || "Erreur serveur" });
    }
});
exports.default = router;
//# sourceMappingURL=categories.js.map
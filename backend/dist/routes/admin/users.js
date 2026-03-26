"use strict";
/**
 * Routes d'administration - Utilisateurs
 * Utilise le service userService pour la logique métier
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const userService_1 = require("../../services/userService");
const router = (0, express_1.Router)();
// GET /api/admin/users - Liste des utilisateurs
router.get("/", async (req, res) => {
    try {
        const { page = 1, limit = 20, role, search } = req.query;
        const result = await (0, userService_1.listUsers)({
            page: Number(page),
            limit: Number(limit),
            role: role,
            search: search,
        });
        res.json({
            success: true,
            data: result.data,
            pagination: result.pagination,
        });
    }
    catch (error) {
        console.error("Erreur liste utilisateurs:", error);
        res.status(500).json({ success: false, message: error.message || "Erreur serveur" });
    }
});
// POST /api/admin/users - Créer un utilisateur
router.post("/", [
    (0, express_validator_1.body)("email").isEmail().withMessage("Email invalide"),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Mot de passe requis"),
    (0, express_validator_1.body)("firstName").notEmpty().withMessage("Prénom requis"),
    (0, express_validator_1.body)("lastName").notEmpty().withMessage("Nom requis"),
    (0, express_validator_1.body)("role")
        .optional()
        .isIn(["ADMIN", "CLIENT", "PRESTATAIRE"])
        .withMessage("Rôle invalide"),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).json({ success: false, errors: errors.array() });
        const { email, password, firstName, lastName, phone, role } = req.body;
        const user = await (0, userService_1.createUser)({ email, password, firstName, lastName, phone, role }, req.user?.id);
        res.status(201).json({
            success: true,
            message: "Utilisateur créé",
            data: user,
        });
    }
    catch (error) {
        console.error("Erreur création utilisateur:", error);
        res.status(400).json({ success: false, message: error.message || "Erreur serveur" });
    }
});
// GET /api/admin/users/:id - Obtenir un utilisateur
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await (0, userService_1.getUserById)(id);
        res.json({ success: true, data: user });
    }
    catch (error) {
        console.error("Erreur obtenir utilisateur:", error);
        res.status(404).json({ success: false, message: error.message || "Erreur serveur" });
    }
});
// PUT /api/admin/users/:id - Mettre à jour un utilisateur
router.put("/:id", [
    (0, express_validator_1.body)("email").optional().isEmail().withMessage("Email invalide"),
    (0, express_validator_1.body)("firstName").optional().notEmpty().withMessage("Prénom requis"),
    (0, express_validator_1.body)("lastName").optional().notEmpty().withMessage("Nom requis"),
    (0, express_validator_1.body)("role")
        .optional()
        .isIn(["ADMIN", "CLIENT", "PRESTATAIRE"])
        .withMessage("Rôle invalide"),
    (0, express_validator_1.body)("isActive")
        .optional()
        .isBoolean()
        .withMessage("Statut actif invalide"),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).json({ success: false, errors: errors.array() });
        const { id } = req.params;
        const { email, firstName, lastName, phone, role, isActive } = req.body;
        const user = await (0, userService_1.updateUser)(id, { email, firstName, lastName, phone, role, isActive }, req.user?.id);
        res.json({
            success: true,
            message: "Utilisateur mis à jour",
            data: user,
        });
    }
    catch (error) {
        console.error("Erreur mise à jour utilisateur:", error);
        res.status(400).json({ success: false, message: error.message || "Erreur serveur" });
    }
});
// PUT /api/admin/users/:id/verify - Vérifier un prestataire
router.put("/:id/verify", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await (0, userService_1.verifyProvider)(id, req.user.id);
        res.json({
            success: true,
            message: "Prestataire vérifié",
            data: result,
        });
    }
    catch (error) {
        console.error("Erreur vérification:", error);
        res.status(400).json({ success: false, message: error.message || "Erreur serveur" });
    }
});
// DELETE /api/admin/users/:id - Supprimer un utilisateur
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await (0, userService_1.deleteUser)(id, req.user?.id);
        res.json({ success: true, message: "Utilisateur supprimé" });
    }
    catch (error) {
        console.error("Erreur suppression utilisateur:", error);
        res.status(400).json({ success: false, message: error.message || "Erreur serveur" });
    }
});
exports.default = router;
//# sourceMappingURL=users.js.map
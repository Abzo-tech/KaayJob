"use strict";
/**
 * Routes d'authentification
 * Utilise le AuthController pour la logique métier
 * Validations centralisées dans src/validations/index.ts
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authController_1 = __importDefault(require("../controllers/authController"));
const auth_1 = require("../middleware/auth");
const database_1 = require("../config/database");
const validations_1 = require("../validations");
const router = (0, express_1.Router)();
// POST /api/auth/register
router.post("/register", validations_1.registerValidation, async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    await authController_1.default.register(req, res);
});
// POST /api/auth/login
router.post("/login", validations_1.loginValidation, async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    await authController_1.default.login(req, res);
});
// GET /api/auth/me
router.get("/me", auth_1.authenticate, async (req, res) => {
    await authController_1.default.getMe(req, res);
});
// PUT /api/auth/password - Changer le mot de passe
router.put("/password", auth_1.authenticate, validations_1.changePasswordValidation, async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    await authController_1.default.changePassword(req, res);
});
// PUT /api/auth/profile - Mettre à jour le profil utilisateur
router.put("/profile", auth_1.authenticate, validations_1.updateProfileValidation, async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    await authController_1.default.updateProfile(req, res);
});
// DELETE /api/auth/account - Supprimer son compte
router.delete("/account", auth_1.authenticate, async (req, res) => {
    try {
        const authReq = req;
        const userId = authReq.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Non autorisé" });
        }
        // Vérifier le rôle - seul les clients peuvent supprimer leur compte via cette route
        const userResult = await (0, database_1.query)("SELECT role FROM users WHERE id = $1", [userId]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
        }
        const userRole = userResult.rows[0].role;
        // Si c'est un prestataire, on ne peut pas supprimer le compte via cette route
        // (cela devrait être fait via un autre processus)
        if (userRole === "PRESTATAIRE") {
            return res.status(403).json({
                success: false,
                message: "Veuillez contacter l'administrateur pour supprimer votre compte prestataire",
            });
        }
        // Supprimer les données liées selon le rôle
        if (userRole === "CLIENT") {
            // Supprimer les réservations du client
            await (0, database_1.query)("DELETE FROM bookings WHERE client_id = $1", [userId]);
            // Supprimer les avis du client
            await (0, database_1.query)("DELETE FROM reviews WHERE client_id = $1", [userId]);
        }
        // Supprimer le provider profile s'il existe
        await (0, database_1.query)("DELETE FROM provider_profiles WHERE user_id = $1", [userId]);
        // Supprimer l'utilisateur
        await (0, database_1.query)("DELETE FROM users WHERE id = $1", [userId]);
        res.json({ success: true, message: "Compte supprimé avec succès" });
    }
    catch (error) {
        console.error("Erreur suppression compte:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
// POST /api/auth/logout - Déconnexion (invalide le token côté client)
router.post("/logout", auth_1.authenticate, async (req, res) => {
    // Note: Dans une implémentation plus avancée, on pourrait invalider le token
    // dans une liste de tokens blacklistés. Pour l'instant, le logout est géré
    // côté client en supprimant le token du localStorage.
    res.json({ success: true, message: "Déconnexion réussie" });
});
exports.default = router;
//# sourceMappingURL=auth.js.map
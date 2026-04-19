"use strict";
/**
 * Routes utilisateurs
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Toutes les routes nécessitent authentification
router.use(auth_1.authenticate);
// GET /api/users/profile - Profil de l'utilisateur connecté
router.get("/profile", async (req, res) => {
    try {
        const user = req.user;
        if (!user?.id) {
            res
                .status(401)
                .json({ success: false, message: "Utilisateur non authentifié" });
            return;
        }
        // Retourner les informations de base de l'utilisateur
        res.json({
            success: true,
            data: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                phone: user.phone,
                role: user.role,
                isVerified: user.is_verified,
                avatar: user.avatar,
                createdAt: user.created_at,
            },
        });
    }
    catch (error) {
        console.error("❌ Erreur récupération profil utilisateur:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
exports.default = router;
//# sourceMappingURL=users.js.map
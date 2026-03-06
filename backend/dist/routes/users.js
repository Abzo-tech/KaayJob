"use strict";
/**
 * Routes des utilisateurs
 * GET /api/users/me - Profil actuel
 * PUT /api/users/me - Mettre à jour le profil
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require(".//config/database");
const auth_1 = require(".//middleware/auth");
const router = (0, express_1.Router)();
// GET /api/users/me - Profil actuel
router.get("/me", auth_1.authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await (0, database_1.query)(`
      SELECT 
        id, email, first_name, last_name, phone, role, avatar, is_verified, created_at
      FROM users 
      WHERE id = $1
    `, [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Utilisateur non trouvé",
            });
        }
        const user = result.rows[0];
        // Si prestataire, ajouter les infos du profil
        if (user.role === "prestataire") {
            const profileResult = await (0, database_1.query)(`
        SELECT * FROM provider_profiles WHERE user_id = $1
      `, [userId]);
            if (profileResult.rows.length > 0) {
                user.profile = profileResult.rows[0];
            }
        }
        res.json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        console.error("Erreur profil:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération du profil",
        });
    }
});
// PUT /api/users/me - Mettre à jour le profil
router.put("/me", auth_1.authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const { firstName, lastName, phone, avatar } = req.body;
        const result = await (0, database_1.query)(`
      UPDATE users 
      SET 
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        phone = COALESCE($3, phone),
        avatar = COALESCE($4, avatar),
        updated_at = NOW()
      WHERE id = $5
      RETURNING id, email, first_name, last_name, phone, avatar
    `, [firstName, lastName, phone, avatar, userId]);
        res.json({
            success: true,
            message: "Profil mis à jour",
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error("Erreur mise à jour:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la mise à jour du profil",
        });
    }
});
exports.default = router;
//# sourceMappingURL=users.js.map
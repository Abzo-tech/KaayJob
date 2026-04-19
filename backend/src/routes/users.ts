/**
 * Routes utilisateurs
 */

import { Router, Request, Response } from "express";
import { authenticate } from "../middleware/auth";

const router = Router();

// Toutes les routes nécessitent authentification
router.use(authenticate);

// GET /api/users/profile - Profil de l'utilisateur connecté
router.get("/profile", async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

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
  } catch (error) {
    console.error("❌ Erreur récupération profil utilisateur:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

export default router;

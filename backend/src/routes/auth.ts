/**
 * Routes d'authentification
 * Utilise le AuthController pour la logique métier
 * Validations centralisées dans src/validations/index.ts
 */

import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import AuthController from "../controllers/authController";
import { authenticate, AuthRequest } from "../middleware/auth";
import { query } from "../config/database";
import {
  registerValidation,
  loginValidation,
  changePasswordValidation,
  updateProfileValidation,
} from "../validations";

const router = Router();

// POST /api/auth/register
router.post(
  "/register",
  registerValidation,
  async (req: Request, res: Response) => {
    console.log('📨 Route /register atteinte');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Erreurs de validation:', errors.array());
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    console.log('✅ Validation passée, appel contrôleur');
    await AuthController.register(req, res);
  },
);

// POST /api/auth/login
router.post("/login", loginValidation, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  await AuthController.login(req, res);
});

// GET /api/auth/me
router.get("/me", authenticate, async (req: Request, res: Response) => {
  await AuthController.getMe(req, res);
});

// PUT /api/auth/password - Changer le mot de passe
router.put(
  "/password",
  authenticate,
  changePasswordValidation,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    await AuthController.changePassword(req, res);
  },
);

// PUT /api/auth/profile - Mettre à jour le profil utilisateur
router.put(
  "/profile",
  authenticate,
  updateProfileValidation,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    await AuthController.updateProfile(req, res);
  },
);

// DELETE /api/auth/account - Supprimer son compte
router.delete("/account", authenticate, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Non autorisé" });
    }

    // Vérifier le rôle - seul les clients peuvent supprimer leur compte via cette route
    const userResult = await query(
      "SELECT role FROM users WHERE id = $1",
      [userId],
    );

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
      await query("DELETE FROM bookings WHERE client_id = $1", [userId]);
      // Supprimer les avis du client
      await query("DELETE FROM reviews WHERE client_id = $1", [userId]);
    }

    // Supprimer le provider profile s'il existe
    await query("DELETE FROM provider_profiles WHERE user_id = $1", [userId]);

    // Supprimer l'utilisateur
    await query("DELETE FROM users WHERE id = $1", [userId]);

    res.json({ success: true, message: "Compte supprimé avec succès" });
  } catch (error) {
    console.error("Erreur suppression compte:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// POST /api/auth/logout - Déconnexion (invalide le token côté client)
router.post("/logout", authenticate, async (req: Request, res: Response) => {
  // Note: Dans une implémentation plus avancée, on pourrait invalider le token
  // dans une liste de tokens blacklistés. Pour l'instant, le logout est géré
  // côté client en supprimant le token du localStorage.
  res.json({ success: true, message: "Déconnexion réussie" });
});

// DEBUG: Endpoint temporaire pour vérifier/réinitialiser l'admin
// POST /api/auth/debug-admin
router.post("/debug-admin", async (req: Request, res: Response) => {
  try {

    // Vérifier si l'admin existe
    const existingAdmin = await query('SELECT id, email, password, role FROM users WHERE email = $1', ['admin@kaayjob.com']);

    if (existingAdmin.rows.length === 0) {
      return res.json({
        success: true,
        message: 'Admin non trouvé, création en cours...',
        action: 'create'
      });
    }

    const admin = existingAdmin.rows[0];
    const isValidPassword = await bcrypt.compare('Password123', admin.password);

    if (!isValidPassword) {
      // Réinitialiser le mot de passe
      const hashedPassword = await bcrypt.hash('Password123', 10);
      await query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, 'admin@kaayjob.com']);

      return res.json({
        success: true,
        message: 'Mot de passe admin réinitialisé',
        admin: { id: admin.id, email: admin.email, role: admin.role },
        action: 'reset'
      });
    }

    return res.json({
      success: true,
      message: 'Admin OK',
      admin: { id: admin.id, email: admin.email, role: admin.role },
      action: 'ok'
    });

  } catch (error) {
    console.error('Erreur debug admin:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

export default router;

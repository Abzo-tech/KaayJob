/**
 * Routes d'authentification
 * Utilise le AuthController pour la logique métier
 * Validations centralisées dans src/validations/index.ts
 */

import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import AuthController from "../controllers/authController";
import { authenticate } from "../middleware/auth";
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
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

export default router;

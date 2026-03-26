/**
 * Routes d'administration - Utilisateurs
 * Utilise le service userService pour la logique métier
 */

import { Router, Response } from "express";
import { body, validationResult } from "express-validator";
import { AuthRequest } from "../../middleware/auth";
import {
  listUsers,
  createUser,
  updateUser,
  verifyProvider,
  deleteUser,
  getUserById,
} from "../../services/userService";

const router = Router();

// GET /api/admin/users - Liste des utilisateurs
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;

    const result = await listUsers({
      page: Number(page),
      limit: Number(limit),
      role: role as string,
      search: search as string,
    });

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error("Erreur liste utilisateurs:", error);
    res.status(500).json({ success: false, message: error.message || "Erreur serveur" });
  }
});

// POST /api/admin/users - Créer un utilisateur
router.post(
  "/",
  [
    body("email").isEmail().withMessage("Email invalide"),
    body("password").notEmpty().withMessage("Mot de passe requis"),
    body("firstName").notEmpty().withMessage("Prénom requis"),
    body("lastName").notEmpty().withMessage("Nom requis"),
    body("role")
      .optional()
      .isIn(["ADMIN", "CLIENT", "PRESTATAIRE"])
      .withMessage("Rôle invalide"),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });

      const { email, password, firstName, lastName, phone, role } = req.body;

      const user = await createUser(
        { email, password, firstName, lastName, phone, role },
        req.user?.id,
      );

      res.status(201).json({
        success: true,
        message: "Utilisateur créé",
        data: user,
      });
    } catch (error: any) {
      console.error("Erreur création utilisateur:", error);
      res.status(400).json({ success: false, message: error.message || "Erreur serveur" });
    }
  },
);

// GET /api/admin/users/:id - Obtenir un utilisateur
router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);

    res.json({ success: true, data: user });
  } catch (error: any) {
    console.error("Erreur obtenir utilisateur:", error);
    res.status(404).json({ success: false, message: error.message || "Erreur serveur" });
  }
});

// PUT /api/admin/users/:id - Mettre à jour un utilisateur
router.put(
  "/:id",
  [
    body("email").optional().isEmail().withMessage("Email invalide"),
    body("firstName").optional().notEmpty().withMessage("Prénom requis"),
    body("lastName").optional().notEmpty().withMessage("Nom requis"),
    body("role")
      .optional()
      .isIn(["ADMIN", "CLIENT", "PRESTATAIRE"])
      .withMessage("Rôle invalide"),
    body("isActive")
      .optional()
      .isBoolean()
      .withMessage("Statut actif invalide"),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });

      const { id } = req.params;
      const { email, firstName, lastName, phone, role, isActive } = req.body;

      const user = await updateUser(
        id,
        { email, firstName, lastName, phone, role, isActive },
        req.user?.id,
      );

      res.json({
        success: true,
        message: "Utilisateur mis à jour",
        data: user,
      });
    } catch (error: any) {
      console.error("Erreur mise à jour utilisateur:", error);
      res.status(400).json({ success: false, message: error.message || "Erreur serveur" });
    }
  },
);

// PUT /api/admin/users/:id/verify - Vérifier un prestataire
router.put("/:id/verify", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await verifyProvider(id, req.user!.id);

    res.json({
      success: true,
      message: "Prestataire vérifié",
      data: result,
    });
  } catch (error: any) {
    console.error("Erreur vérification:", error);
    res.status(400).json({ success: false, message: error.message || "Erreur serveur" });
  }
});

// DELETE /api/admin/users/:id - Supprimer un utilisateur
router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await deleteUser(id, req.user?.id);

    res.json({ success: true, message: "Utilisateur supprimé" });
  } catch (error: any) {
    console.error("Erreur suppression utilisateur:", error);
    res.status(400).json({ success: false, message: error.message || "Erreur serveur" });
  }
});

export default router;

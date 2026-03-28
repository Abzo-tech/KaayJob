/**
 * Routes d'administration - Abonnements
 */

import { Router, Response } from "express";
import { body, validationResult } from "express-validator";
import { randomUUID } from "crypto";
import { prisma } from "../../config/prisma";
import { query } from "../../config/database";
import { AuthRequest } from "../../middleware/auth";
import { createNotification, createFormattedNotification } from "../../services/notificationService";

const router = Router();

// POST /api/admin/subscription-plans - Créer un plan (alias pour /plans)
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Nom requis").isLength({ max: 50 }),
    body("price").isNumeric().withMessage("Prix requis"),
    body("duration").isInt({ min: 0 }).withMessage("Durée invalide"),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });

      const { name, description, price, duration, features, isActive, displayOrder } = req.body;

      // Créer le slug à partir du nom
      const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

      // Compter les plans existants pour l'ordre d'affichage
      const count = await prisma.subscriptionPlan.count();

      const result = await prisma.subscriptionPlan.create({
        data: {
          name,
          slug,
          description: description || null,
          price: parseFloat(price),
          duration: parseInt(duration) || 30,
          features: features || [],
          isActive: isActive !== false,
          displayOrder: displayOrder ?? count,
        },
      });

      // Créer une notification pour l'admin
      await createNotification(
        req.user!.id,
        "Plan créé",
        `Le plan "${name}" a été créé avec succès`,
        "success",
        "/admin/subscriptions",
      );

      res.status(201).json({
        success: true,
        message: "Plan créé avec succès",
        data: result,
      });
    } catch (error: any) {
      console.error("Erreur création plan:", error);
      res.status(500).json({ success: false, message: "Erreur serveur", detail: error.message });
    }
  },
);

// GET /api/admin/subscriptions - Liste des abonnements
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, status, plan } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let whereClause = "1=1";
    const params: any[] = [];
    let paramIndex = 1;

    if (status) {
      whereClause += ` AND s.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (plan) {
      whereClause += ` AND s.plan = $${paramIndex}`;
      params.push(plan);
      paramIndex++;
    }

    const countResult = await query(
      `SELECT COUNT(*) as count FROM subscriptions s WHERE ${whereClause}`,
      params,
    );

    const limitParamIndex = paramIndex;
    const offsetParamIndex = paramIndex + 1;

    const result = await query(
      `SELECT s.*, u.email, u.first_name, u.last_name
       FROM subscriptions s
       JOIN users u ON s.user_id = u.id
       WHERE ${whereClause}
       ORDER BY s.created_at DESC
       LIMIT $${limitParamIndex} OFFSET $${offsetParamIndex}`,
      [...params, Number(limit), offset],
    );

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: parseInt(countResult.rows[0].count),
      },
    });
  } catch (error) {
    console.error("Erreur liste abonnements:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// POST /api/admin/subscriptions - Créer un abonnement
router.post(
  "/",
  [
    body("userId").notEmpty().withMessage("ID utilisateur requis"),
    body("plan")
      .notEmpty()
      .withMessage("Plan requis")
      .isIn(["gratuit", "premium", "pro"])
      .withMessage("Plan invalide"),
    body("duration")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Durée invalide"),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });

      const { userId, plan, duration } = req.body;

      // Vérifier si l'utilisateur existe
      const userExists = await query("SELECT id, role FROM users WHERE id = $1", [
        userId,
      ]);
      if (userExists.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Utilisateur non trouvé" });
      }

      // Vérifier si l'utilisateur est un prestataire
      if (userExists.rows[0].role !== "PRESTATAIRE") {
        return res.status(400).json({
          success: false,
          message: "Seuls les prestataires peuvent avoir un abonnement",
        });
      }

      // Calculer les dates
      const startDate = new Date();
      let endDate = new Date();
      
      if (plan === "gratuit") {
        endDate = new Date("2099-12-31");
      } else {
        const months = duration || 1;
        endDate.setMonth(endDate.getMonth() + months);
      }

      // Vérifier si un abonnement existe déjà
      const existingSub = await query(
        "SELECT id FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1",
        [userId],
      );

      let result;
      if (existingSub.rows.length > 0) {
        // Mettre à jour l'abonnement existant
        result = await query(
          `UPDATE subscriptions 
           SET plan = $1, status = 'active', start_date = $2, end_date = $3
           WHERE id = $4 
           RETURNING *`,
          [plan, startDate, endDate, existingSub.rows[0].id],
        );
      } else {
        // Créer un nouvel abonnement
        result = await query(
          `INSERT INTO subscriptions (id, user_id, plan, status, start_date, end_date, created_at)
           VALUES (gen_random_uuid(), $1, $2, 'active', $3, $4, NOW())
           RETURNING *`,
          [userId, plan, startDate, endDate],
        );
      }

      // Créer une notification pour le prestataire
      await createNotification(
        userId,
        "Nouvel abonnement",
        `Votre abonnement ${plan.toUpperCase()} a été activé avec succès`,
        "success",
        "/prestataire/abonnement",
      );

      // Créer une notification pour l'admin
      await createFormattedNotification(
        { id: req.user!.id, role: req.user!.role || 'admin', firstName: 'Admin', lastName: '' },
        "Abonnement créé",
        `Un abonnement ${plan.toUpperCase()} a été créé pour un prestataire`,
        "success",
        "/admin/subscriptions",
        undefined,
        {
          actor: { firstName: 'Admin', lastName: '', role: 'ADMIN' },
          action: 'subscription_created',
          entity: plan.toUpperCase()
        }
      );

      res.status(201).json({
        success: true,
        message: "Abonnement créé avec succès",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Erreur création abonnement:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  },
);

// PUT /api/admin/subscriptions/:id - Mettre à jour un abonnement
router.put(
  "/:id",
  [
    body("plan")
      .optional()
      .isIn(["gratuit", "premium", "pro"])
      .withMessage("Plan invalide"),
    body("status")
      .optional()
      .isIn(["active", "expired", "cancelled", "pending"])
      .withMessage("Statut invalide"),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });

      const { id } = req.params;
      const { plan, status } = req.body;

      // Vérifier si l'abonnement existe
      const existing = await query(
        "SELECT s.*, u.first_name, u.last_name FROM subscriptions s JOIN users u ON s.user_id = u.id WHERE s.id = $1",
        [id],
      );
      if (existing.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Abonnement non trouvé" });
      }

      const updates: string[] = [];
      const params: any[] = [];
      let paramIndex = 1;

      if (plan) {
        updates.push(`plan = $${paramIndex++}`);
        params.push(plan);
      }
      if (status) {
        updates.push(`status = $${paramIndex++}`);
        params.push(status);
      }

      if (updates.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Aucune donnée à mettre à jour" });
      }

      params.push(id);

      const result = await query(
        `UPDATE subscriptions SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING *`,
        params,
      );

      // Notifier le prestataire si le statut a changé
      if (status && status !== existing.rows[0].status) {
        const statusMessages: { [key: string]: string } = {
          active: "activé",
          expired: "expiré",
          cancelled: "annulé",
          pending: "en attente",
        };
        await createNotification(
          existing.rows[0].user_id,
          "Abonnement mis à jour",
          `Votre abonnement a été ${statusMessages[status]}`,
          status === "cancelled" ? "warning" : "info",
          "/prestataire/abonnement",
        );
      }

      res.json({
        success: true,
        message: "Abonnement mis à jour",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Erreur mise à jour abonnement:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  },
);

// PUT /api/admin/subscriptions/:id/renew - Renouveler un abonnement
router.put(
  "/:id/renew",
  [
    body("duration")
      .optional()
      .isInt({ min: 1, max: 12 })
      .withMessage("Durée invalide (1-12 mois)"),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });

      const { id } = req.params;
      const { duration = 1 } = req.body;

      // Vérifier si l'abonnement existe
      const existing = await query(
        "SELECT s.*, u.first_name, u.last_name FROM subscriptions s JOIN users u ON s.user_id = u.id WHERE s.id = $1",
        [id],
      );
      if (existing.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Abonnement non trouvé" });
      }

      const sub = existing.rows[0];
      
      // Calculer la nouvelle date de fin
      let newEndDate = new Date(sub.end_date);
      if (newEndDate < new Date()) {
        newEndDate = new Date();
      }
      newEndDate.setMonth(newEndDate.getMonth() + Number(duration));

      const result = await query(
        `UPDATE subscriptions 
         SET status = 'active', end_date = $1
         WHERE id = $2 
         RETURNING *`,
        [newEndDate, id],
      );

      // Notifier le prestataire
      await createNotification(
        sub.user_id,
        "Abonnement renouvelé",
        `Votre abonnement a été renouvelé pour ${duration} mois`,
        "success",
        "/prestataire/abonnement",
      );

      res.json({
        success: true,
        message: "Abonnement renouvelé avec succès",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Erreur renouvellement:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  },
);

// DELETE /api/admin/subscriptions/:id - Annuler un abonnement
router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Vérifier si l'abonnement existe
    const existing = await query(
      "SELECT s.*, u.first_name, u.last_name FROM subscriptions s JOIN users u ON s.user_id = u.id WHERE s.id = $1",
      [id],
    );
    if (existing.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Abonnement non trouvé" });
    }

    // Mettre à jour le statut au lieu de supprimer
    await query(
      "UPDATE subscriptions SET status = 'cancelled' WHERE id = $1",
      [id],
    );

    // Notifier le prestataire
    await createNotification(
      existing.rows[0].user_id,
      "Abonnement annulé",
      "Votre abonnement a été annulé par l'administrateur",
      "error",
      "/prestataire/abonnement",
    );

    res.json({ success: true, message: "Abonnement annulé" });
  } catch (error) {
    console.error("Erreur annulation abonnement:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// ==================== GESTION DES PLANS D'ABONNEMENT ====================

// GET /api/admin/subscription-plans - Liste des plans d'abonnement
router.get("/plans", async (req: AuthRequest, res: Response) => {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      orderBy: { displayOrder: "asc" },
    });
    
    res.json({ success: true, data: plans });
  } catch (error: any) {
    console.error("Erreur liste plans:", error);
    // Si la table n'existe pas encore, retourner les plans par défaut
    if (error.code === "42P01") {
      const defaultPlans = [
        { id: "1", name: "Gratuit", slug: "gratuit", price: 0, duration: 0, features: ["5 services maximum", "Visibilité standard", "Support par email"], isActive: true, displayOrder: 0 },
        { id: "2", name: "Premium", slug: "premium", price: 9900, duration: 30, features: ["Services illimités", "Badge VIP", "Visibilité prioritaire", "Support prioritaire", "Statistiques avancées"], isActive: true, displayOrder: 1 },
        { id: "3", name: "Pro", slug: "pro", price: 24900, duration: 30, features: ["Tout Premium", "Publication en premier", "Badge Pro", "Formation exclusive", "Gestion équipe"], isActive: true, displayOrder: 2 },
      ];
      return res.json({ success: true, data: defaultPlans });
    }
    res.status(500).json({ success: false, message: "Erreur serveur", detail: error.message });
  }
});

// POST /api/admin/subscription-plans - Créer un plan
router.post(
  "/plans",
  [
    body("name").notEmpty().withMessage("Nom requis").isLength({ max: 50 }),
    body("price").isNumeric().withMessage("Prix requis").optional(),
    body("duration").isInt({ min: 0 }).withMessage("Durée invalide").optional(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });

      const { name, description, price, duration, features, isActive, displayOrder } = req.body;

      // Utiliser un UUID complet comme slug pour garantir l'unicité
      const slug = randomUUID();

      // Compter les plans existants pour l'ordre d'affichage
      const count = await prisma.subscriptionPlan.count();

      const result = await prisma.subscriptionPlan.create({
        data: {
          name,
          slug,
          description: description || null,
          price: parseFloat(price),
          duration: parseInt(duration) || 30,
          features: features || [],
          isActive: isActive !== false,
          displayOrder: displayOrder ?? count,
        },
      });

      // Créer une notification pour l'admin
      if (req.user?.id) {
        try {
          await createNotification(
            req.user.id,
            "Plan créé",
            `Le plan "${name}" a été créé avec succès`,
            "success",
            "/admin/subscriptions",
          );
        } catch (notifError) {
          console.error("Erreur notification:", notifError);
          // Ne pas échouer pour autant
        }
      }

      res.status(201).json({
        success: true,
        message: "Plan créé avec succès",
        data: result,
      });
    } catch (error: any) {
      console.error("Erreur création plan:", error);
      console.error("Error stack:", error.stack);
      res.status(500).json({ success: false, message: "Erreur serveur", detail: error.message });
    }
  },
);

// PUT /api/admin/subscription-plans/:id - Mettre à jour un plan
router.put(
  "/plans/:id",
  [
    body("name").optional().notEmpty().withMessage("Nom requis"),
    body("price").optional().isNumeric().withMessage("Prix invalide"),
    body("duration").optional().isInt({ min: 0 }).withMessage("Durée invalide"),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });

      const { id } = req.params;
      const { name, description, price, duration, features, isActive, displayOrder } = req.body;

      // Vérifier si le plan existe
      const existing = await prisma.subscriptionPlan.findUnique({
        where: { id },
      });

      if (!existing) {
        return res
          .status(404)
          .json({ success: false, message: "Plan non trouvé" });
      }

      // Préparer les données de mise à jour (seulement si différentes des valeurs existantes)
      const updateData: any = {};

      if (name !== undefined && name !== existing.name) {
        updateData.name = name;
        updateData.slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      }
      if (description !== undefined && description !== existing.description) {
        updateData.description = description;
      }
      if (price !== undefined && parseFloat(price) !== Number(existing.price)) {
        updateData.price = parseFloat(price);
      }
      if (duration !== undefined && parseInt(duration) !== existing.duration) {
        updateData.duration = parseInt(duration);
      }
      if (features !== undefined && Array.isArray(features) && Array.isArray(existing.features) && JSON.stringify(features.sort()) !== JSON.stringify(existing.features.sort())) {
        updateData.features = features;
      }
      if (isActive !== undefined && isActive !== existing.isActive) {
        updateData.isActive = isActive;
      }
      if (displayOrder !== undefined && displayOrder !== existing.displayOrder) {
        updateData.displayOrder = displayOrder;
      }

      // Si aucune donnée n'a changé, retourner succès avec les données existantes
      if (Object.keys(updateData).length === 0) {
        return res.json({
          success: true,
          message: "Aucune modification détectée, plan inchangé",
          data: existing,
        });
      }

      const result = await prisma.subscriptionPlan.update({
        where: { id },
        data: updateData,
      });

      // Créer une notification pour l'admin
      await createNotification(
        req.user!.id,
        "Plan mis à jour",
        `Le plan "${result.name}" a été mis à jour`,
        "info",
        "/admin/subscriptions",
      );

      res.json({
        success: true,
        message: "Plan mis à jour",
        data: result,
      });
    } catch (error: any) {
      console.error("Erreur mise à jour plan:", error);
      res.status(500).json({ success: false, message: "Erreur serveur", detail: error.message });
    }
  },
);

// DELETE /api/admin/subscription-plans/:id - Supprimer un plan
router.delete("/plans/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Vérifier si le plan existe
    const existing = await prisma.subscriptionPlan.findUnique({
      where: { id },
    });

    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Plan non trouvé" });
    }

    // Vérifier si des abonnements utilisent ce plan (utilisation du champ plan)
    const subscriptionResult = await query(
      "SELECT COUNT(*) as count FROM subscriptions WHERE plan = $1",
      [existing.slug]
    );
    const subscriptionCount = parseInt(subscriptionResult.rows[0].count);

    if (subscriptionCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Impossible de supprimer ce plan car des abonnements l'utilisent",
      });
    }

    await prisma.subscriptionPlan.delete({
      where: { id },
    });

    // Créer une notification pour l'admin
    await createNotification(
      req.user!.id,
      "Plan supprimé",
      `Le plan "${existing.name}" a été supprimé`,
      "warning",
      "/admin/subscriptions",
    );

    res.json({ success: true, message: "Plan supprimé" });
  } catch (error: any) {
    console.error("Erreur suppression plan:", error);
    res.status(500).json({ success: false, message: "Erreur serveur", detail: error.message });
  }
});

export default router;

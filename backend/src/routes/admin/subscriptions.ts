/**
 * Routes d'administration - Abonnements
 */

import { Router, Response } from "express";
import { body, validationResult } from "express-validator";
import { prisma } from "../../config/prisma";
import { AuthRequest } from "../../middleware/auth";
import { createNotification } from "../../services/notificationService";

const router = Router();

const defaultPlans = [
  {
    id: "1",
    name: "Gratuit",
    slug: "gratuit",
    description: null,
    price: 0,
    duration: 0,
    features: ["5 services maximum", "Visibilite standard", "Support par email"],
    isActive: true,
    displayOrder: 0,
  },
  {
    id: "2",
    name: "Premium",
    slug: "premium",
    description: null,
    price: 9900,
    duration: 30,
    features: [
      "Services illimites",
      "Badge VIP",
      "Visibilite prioritaire",
      "Support prioritaire",
      "Statistiques avancees",
    ],
    isActive: true,
    displayOrder: 1,
  },
  {
    id: "3",
    name: "Pro",
    slug: "pro",
    description: null,
    price: 24900,
    duration: 30,
    features: [
      "Tout Premium",
      "Publication en premier",
      "Badge Pro",
      "Formation exclusive",
      "Gestion equipe",
    ],
    isActive: true,
    displayOrder: 2,
  },
];

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "plan";

const serializePlan = (plan: any) => ({
  id: plan.id,
  name: plan.name,
  slug: plan.slug,
  description: plan.description ?? null,
  price: Number(plan.price),
  duration: plan.duration,
  features: Array.isArray(plan.features) ? plan.features : [],
  isActive: plan.isActive,
  displayOrder: plan.displayOrder,
  createdAt: plan.createdAt ?? undefined,
  updatedAt: plan.updatedAt ?? undefined,
});

const getPlanKey = (subscription: any) =>
  subscription.subscriptionPlan?.slug || slugify(subscription.plan || "gratuit");

const serializeSubscription = (subscription: any) => ({
  id: subscription.id,
  user_id: subscription.userId,
  plan: getPlanKey(subscription),
  plan_name: subscription.subscriptionPlan?.name ?? subscription.plan,
  status: subscription.status,
  start_date: subscription.startDate,
  end_date: subscription.endDate,
  created_at: subscription.createdAt,
  subscription_plan_id: subscription.subscriptionPlanId ?? null,
  email: subscription.user?.email ?? null,
  first_name: subscription.user?.firstName ?? null,
  last_name: subscription.user?.lastName ?? null,
});

const attachUsersToSubscriptions = async (subscriptions: any[]) => {
  const userIds = [...new Set(subscriptions.map((subscription) => subscription.userId))];

  if (userIds.length === 0) {
    return subscriptions;
  }

  const users = await prisma.user.findMany({
    where: {
      id: {
        in: userIds,
      },
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
    },
  });

  const usersById = new Map(users.map((user) => [user.id, user]));

  return subscriptions.map((subscription) => ({
    ...subscription,
    user: usersById.get(subscription.userId) ?? null,
  }));
};

const attachUserToSubscription = async (subscription: any) => {
  const [result] = await attachUsersToSubscriptions([subscription]);
  return result;
};

const findPlanByValue = async (planValue?: string, planId?: string) => {
  if (planId) {
    return prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });
  }

  if (!planValue) {
    return null;
  }

  const normalizedPlan = slugify(planValue);
  return prisma.subscriptionPlan.findFirst({
    where: {
      OR: [
        { slug: normalizedPlan },
        { name: { equals: planValue, mode: "insensitive" } },
      ],
    },
  });
};

const buildUniquePlanSlug = async (name: string, excludeId?: string) => {
  const baseSlug = slugify(name);
  let candidate = baseSlug;
  let suffix = 2;

  while (true) {
    const existing = await prisma.subscriptionPlan.findFirst({
      where: {
        slug: candidate,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });

    if (!existing) {
      return candidate;
    }

    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
};

// GET /api/admin/subscriptions - Liste des abonnements
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, status, plan } = req.query;
    const parsedPage = Number(page) || 1;
    const parsedLimit = Number(limit) || 20;
    const skip = (parsedPage - 1) * parsedLimit;
    const normalizedStatus = status ? String(status).toLowerCase() : undefined;
    const normalizedPlan = plan ? slugify(String(plan)) : undefined;

    const where: any = {};

    if (normalizedStatus) {
      where.status = normalizedStatus;
    }

    if (normalizedPlan) {
      where.OR = [
        { plan: { equals: normalizedPlan, mode: "insensitive" } },
        { plan: { equals: String(plan), mode: "insensitive" } },
        {
          subscriptionPlan: {
            is: {
              slug: { equals: normalizedPlan, mode: "insensitive" },
            },
          },
        },
        {
          subscriptionPlan: {
            is: {
              name: { equals: String(plan), mode: "insensitive" },
            },
          },
        },
      ];
    }

    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where,
        include: {
          subscriptionPlan: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: parsedLimit,
        skip,
      }),
      prisma.subscription.count({ where }),
    ]);
    const subscriptionsWithUsers = await attachUsersToSubscriptions(subscriptions);

    res.json({
      success: true,
      data: subscriptionsWithUsers.map(serializeSubscription),
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total,
      },
    });
  } catch (error) {
    console.error("Erreur liste abonnements:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// POST /api/admin/subscriptions - Créer ou réactiver un abonnement
router.post(
  "/",
  [
    body("userId").notEmpty().withMessage("ID utilisateur requis"),
    body("plan")
      .optional()
      .isString()
      .withMessage("Plan invalide"),
    body("planId")
      .optional()
      .isString()
      .withMessage("Plan invalide"),
    body("duration")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Durée invalide"),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { userId, plan, planId, duration } = req.body;

      if (!plan && !planId) {
        return res.status(400).json({
          success: false,
          message: "plan ou planId est requis",
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, role: true },
      });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Utilisateur non trouvé" });
      }

      if (user.role !== "PRESTATAIRE") {
        return res.status(400).json({
          success: false,
          message: "Seuls les prestataires peuvent avoir un abonnement",
        });
      }

      const planRecord = await findPlanByValue(plan, planId);
      const normalizedPlan = planRecord?.slug ?? slugify(String(plan || planId));
      const startDate = new Date();
      let endDate = new Date();

      if (normalizedPlan === "gratuit") {
        endDate = new Date("2099-12-31T00:00:00.000Z");
      } else {
        const months = Number(duration) || 1;
        endDate.setMonth(endDate.getMonth() + months);
      }

      const existingSubscription = await prisma.subscription.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: { id: true },
      });

      const subscriptionData = {
        plan: normalizedPlan,
        status: "active",
        startDate,
        endDate,
        subscriptionPlanId: planRecord?.id ?? null,
      };

      const subscription = existingSubscription
        ? await prisma.subscription.update({
            where: { id: existingSubscription.id },
            data: subscriptionData,
            include: {
              subscriptionPlan: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          })
        : await prisma.subscription.create({
            data: {
              userId,
              ...subscriptionData,
            },
            include: {
              subscriptionPlan: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          });
      const subscriptionWithUser = await attachUserToSubscription(subscription);

      await createNotification(
        userId,
        "Nouvel abonnement",
        `Votre abonnement ${normalizedPlan.toUpperCase()} a ete active avec succes`,
        "success",
        "/prestataire/abonnement",
      );

      if (req.user?.id) {
        await createNotification(
          req.user.id,
          "Abonnement cree",
          `Un abonnement ${normalizedPlan.toUpperCase()} a ete active pour un prestataire`,
          "success",
          "/admin/subscriptions",
        );
      }

      res.status(201).json({
        success: true,
        message: "Abonnement créé avec succès",
        data: serializeSubscription(subscriptionWithUser),
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
      .isString()
      .withMessage("Plan invalide"),
    body("status")
      .optional()
      .isIn(["active", "expired", "cancelled", "pending"])
      .withMessage("Statut invalide"),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { id } = req.params;
      const { plan, status } = req.body;

      const existing = await prisma.subscription.findUnique({
        where: { id },
        include: {
          subscriptionPlan: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });

      if (!existing) {
        return res
          .status(404)
          .json({ success: false, message: "Abonnement non trouvé" });
      }

      const updateData: any = {};

      if (plan) {
        const planRecord = await findPlanByValue(plan);
        updateData.plan = planRecord?.slug ?? slugify(String(plan));
        updateData.subscriptionPlanId = planRecord?.id ?? null;
      }

      if (status) {
        updateData.status = String(status).toLowerCase();
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          success: false,
          message: "Aucune donnée à mettre à jour",
        });
      }

      const updated = await prisma.subscription.update({
        where: { id },
        data: updateData,
        include: {
          subscriptionPlan: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });
      const updatedWithUser = await attachUserToSubscription(updated);

      if (status && status !== existing.status) {
        const statusMessages: Record<string, string> = {
          active: "active",
          expired: "expire",
          cancelled: "annule",
          pending: "mis en attente",
        };

        await createNotification(
          existing.userId,
          "Abonnement mis a jour",
          `Votre abonnement a ete ${statusMessages[status] || status}`,
          status === "cancelled" ? "warning" : "info",
          "/prestataire/abonnement",
        );
      }

      res.json({
        success: true,
        message: "Abonnement mis à jour",
        data: serializeSubscription(updatedWithUser),
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
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { id } = req.params;
      const { duration = 1 } = req.body;

      const existing = await prisma.subscription.findUnique({
        where: { id },
        include: {
          subscriptionPlan: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });

      if (!existing) {
        return res
          .status(404)
          .json({ success: false, message: "Abonnement non trouvé" });
      }

      let newEndDate = existing.endDate ? new Date(existing.endDate) : new Date();
      if (newEndDate < new Date()) {
        newEndDate = new Date();
      }
      newEndDate.setMonth(newEndDate.getMonth() + Number(duration));

      const renewed = await prisma.subscription.update({
        where: { id },
        data: {
          status: "active",
          endDate: newEndDate,
        },
        include: {
          subscriptionPlan: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });
      const renewedWithUser = await attachUserToSubscription(renewed);

      await createNotification(
        existing.userId,
        "Abonnement renouvele",
        `Votre abonnement a ete renouvele pour ${duration} mois`,
        "success",
        "/prestataire/abonnement",
      );

      res.json({
        success: true,
        message: "Abonnement renouvelé avec succès",
        data: serializeSubscription(renewedWithUser),
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

    const existing = await prisma.subscription.findUnique({
      where: { id },
      include: {
        subscriptionPlan: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Abonnement non trouvé" });
    }

    const cancelled = await prisma.subscription.update({
      where: { id },
      data: { status: "cancelled" },
      include: {
        subscriptionPlan: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
    const cancelledWithUser = await attachUserToSubscription(cancelled);

    await createNotification(
      existing.userId,
      "Abonnement annule",
      "Votre abonnement a ete annule par l'administrateur",
      "error",
      "/prestataire/abonnement",
    );

    res.json({
      success: true,
      message: "Abonnement annulé",
      data: serializeSubscription(cancelledWithUser),
    });
  } catch (error) {
    console.error("Erreur annulation abonnement:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// GET /api/admin/subscriptions/plans - Liste des plans d'abonnement
router.get("/plans", async (req: AuthRequest, res: Response) => {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      orderBy: { displayOrder: "asc" },
    });

    res.json({ success: true, data: plans.map(serializePlan) });
  } catch (error: any) {
    console.error("Erreur liste plans:", error);

    if (error?.code === "P2021" || error?.code === "42P01") {
      return res.json({ success: true, data: defaultPlans });
    }

    res.status(500).json({ success: false, message: "Erreur serveur", detail: error.message });
  }
});

// POST /api/admin/subscriptions/plans - Créer un plan
router.post(
  "/plans",
  [
    body("name").notEmpty().withMessage("Nom requis").isLength({ max: 50 }),
    body("price").isNumeric().withMessage("Prix requis"),
    body("duration").isInt({ min: 0 }).withMessage("Durée invalide"),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { name, description, price, duration, features, isActive, displayOrder } = req.body;
      const count = await prisma.subscriptionPlan.count();
      const slug = await buildUniquePlanSlug(name);

      const plan = await prisma.subscriptionPlan.create({
        data: {
          name,
          slug,
          description: description || null,
          price: Number(price),
          duration: Number(duration),
          features: Array.isArray(features) ? features : [],
          isActive: isActive !== false,
          displayOrder: displayOrder ?? count,
        },
      });

      if (req.user?.id) {
        await createNotification(
          req.user.id,
          "Plan cree",
          `Le plan "${name}" a ete cree avec succes`,
          "success",
          "/admin/subscriptions",
        );
      }

      res.status(201).json({
        success: true,
        message: "Plan créé avec succès",
        data: serializePlan(plan),
      });
    } catch (error: any) {
      console.error("Erreur création plan:", error);
      res.status(500).json({ success: false, message: "Erreur serveur", detail: error.message });
    }
  },
);

// PUT /api/admin/subscriptions/plans/:id - Mettre à jour un plan
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
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { id } = req.params;
      const { name, description, price, duration, features, isActive, displayOrder } = req.body;

      const existing = await prisma.subscriptionPlan.findUnique({
        where: { id },
      });

      if (!existing) {
        return res
          .status(404)
          .json({ success: false, message: "Plan non trouvé" });
      }

      const updateData: any = {};

      if (name !== undefined && name !== existing.name) {
        updateData.name = name;
        updateData.slug = await buildUniquePlanSlug(name, id);
      }
      if (description !== undefined) {
        updateData.description = description;
      }
      if (price !== undefined) {
        updateData.price = Number(price);
      }
      if (duration !== undefined) {
        updateData.duration = Number(duration);
      }
      if (features !== undefined && Array.isArray(features)) {
        updateData.features = features;
      }
      if (isActive !== undefined) {
        updateData.isActive = isActive;
      }
      if (displayOrder !== undefined) {
        updateData.displayOrder = displayOrder;
      }

      if (Object.keys(updateData).length === 0) {
        return res.json({
          success: true,
          message: "Aucune modification détectée, plan inchangé",
          data: serializePlan(existing),
        });
      }

      const plan = await prisma.subscriptionPlan.update({
        where: { id },
        data: updateData,
      });

      if (req.user?.id) {
        await createNotification(
          req.user.id,
          "Plan mis a jour",
          `Le plan "${plan.name}" a ete mis a jour`,
          "info",
          "/admin/subscriptions",
        );
      }

      res.json({
        success: true,
        message: "Plan mis à jour",
        data: serializePlan(plan),
      });
    } catch (error: any) {
      console.error("Erreur mise à jour plan:", error);
      res.status(500).json({ success: false, message: "Erreur serveur", detail: error.message });
    }
  },
);

// DELETE /api/admin/subscriptions/plans/:id - Supprimer un plan
router.delete("/plans/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.subscriptionPlan.findUnique({
      where: { id },
    });

    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Plan non trouvé" });
    }

    const subscriptionCount = await prisma.subscription.count({
      where: {
        OR: [
          { subscriptionPlanId: id },
          { plan: { equals: existing.slug, mode: "insensitive" } },
          { plan: { equals: existing.name, mode: "insensitive" } },
        ],
      },
    });

    if (subscriptionCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Impossible de supprimer ce plan car des abonnements l'utilisent",
      });
    }

    await prisma.subscriptionPlan.delete({
      where: { id },
    });

    if (req.user?.id) {
      await createNotification(
        req.user.id,
        "Plan supprime",
        `Le plan "${existing.name}" a ete supprime`,
        "warning",
        "/admin/subscriptions",
      );
    }

    res.json({ success: true, message: "Plan supprimé" });
  } catch (error: any) {
    console.error("Erreur suppression plan:", error);
    res.status(500).json({ success: false, message: "Erreur serveur", detail: error.message });
  }
});

export default router;

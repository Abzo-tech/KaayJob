"use strict";
/**
 * Contrôleur pour les abonnements - VERSION PRISMA COMPLÈTE
 * Gère les abonnements des prestataires aux plans
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionController = void 0;
const prisma_1 = require("../config/prisma");
class SubscriptionController {
    /**
     * Obtenir tous les plans d'abonnement disponibles
     */
    static async getPlans(req, res) {
        try {
            const plans = await prisma_1.prisma.subscriptionPlan.findMany({
                where: { isActive: true },
                orderBy: { price: "asc" },
            });
            res.json({
                success: true,
                data: plans.map((plan) => ({
                    id: plan.id,
                    name: plan.name,
                    slug: plan.slug,
                    description: plan.description,
                    price: parseFloat(plan.price.toString()),
                    duration: plan.duration,
                    features: plan.features,
                    isActive: plan.isActive,
                    displayOrder: plan.displayOrder,
                })),
            });
        }
        catch (error) {
            console.error("Erreur récupération plans:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
    /**
     * Obtenir un plan d'abonnement par ID
     */
    static async getPlanById(req, res) {
        try {
            const { id } = req.params;
            const plan = await prisma_1.prisma.subscriptionPlan.findUnique({
                where: { id },
            });
            if (!plan || !plan.isActive) {
                res.status(404).json({ success: false, message: "Plan non trouvé" });
                return;
            }
            res.json({
                success: true,
                data: {
                    id: plan.id,
                    name: plan.name,
                    slug: plan.slug,
                    description: plan.description,
                    price: parseFloat(plan.price.toString()),
                    duration: plan.duration,
                    features: plan.features,
                    isActive: plan.isActive,
                    displayOrder: plan.displayOrder,
                },
            });
        }
        catch (error) {
            console.error("Erreur récupération plan:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
    /**
     * Obtenir les abonnements de l'utilisateur connecté
     */
    static async getMySubscriptions(req, res) {
        try {
            const user = req.user;
            if (!user?.id) {
                res
                    .status(401)
                    .json({ success: false, message: "Utilisateur non authentifié" });
                return;
            }
            const subscriptions = await prisma_1.prisma.subscription.findMany({
                where: { userId: user.id },
                include: {
                    subscriptionPlan: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            duration: true,
                            features: true,
                            isActive: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
            });
            res.json({
                success: true,
                data: subscriptions.map((sub) => ({
                    id: sub.id,
                    plan: sub.plan,
                    status: sub.status,
                    startDate: sub.startDate,
                    endDate: sub.endDate,
                    createdAt: sub.createdAt,
                    subscriptionPlan: sub.subscriptionPlan
                        ? {
                            id: sub.subscriptionPlan.id,
                            name: sub.subscriptionPlan.name,
                            price: parseFloat(sub.subscriptionPlan.price.toString()),
                            duration: sub.subscriptionPlan.duration,
                            features: sub.subscriptionPlan.features,
                            isActive: sub.subscriptionPlan.isActive,
                        }
                        : null,
                })),
            });
        }
        catch (error) {
            console.error("Erreur récupération abonnements utilisateur:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
    /**
     * Obtenir l'abonnement actif de l'utilisateur
     */
    static async getMyActiveSubscription(req, res) {
        try {
            const user = req.user;
            if (!user?.id) {
                res
                    .status(401)
                    .json({ success: false, message: "Utilisateur non authentifié" });
                return;
            }
            const subscription = await prisma_1.prisma.subscription.findFirst({
                where: {
                    userId: user.id,
                    status: "active",
                    endDate: { gt: new Date() },
                },
                orderBy: { createdAt: "desc" },
                include: {
                    subscriptionPlan: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            duration: true,
                            features: true,
                            isActive: true,
                        },
                    },
                },
            });
            if (!subscription) {
                res
                    .status(404)
                    .json({ success: false, message: "Aucun abonnement actif" });
                return;
            }
            res.json({
                success: true,
                data: {
                    id: subscription.id,
                    plan: subscription.plan,
                    status: subscription.status,
                    startDate: subscription.startDate,
                    endDate: subscription.endDate,
                    createdAt: subscription.createdAt,
                    subscriptionPlan: subscription.subscriptionPlan
                        ? {
                            id: subscription.subscriptionPlan.id,
                            name: subscription.subscriptionPlan.name,
                            price: parseFloat(subscription.subscriptionPlan.price.toString()),
                            duration: subscription.subscriptionPlan.duration,
                            features: subscription.subscriptionPlan.features,
                            isActive: subscription.subscriptionPlan.isActive,
                        }
                        : null,
                },
            });
        }
        catch (error) {
            console.error("Erreur récupération abonnement actif:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
    /**
     * Souscrire à un plan d'abonnement
     */
    static async subscribe(req, res) {
        try {
            const user = req.user;
            const { planId } = req.body;
            if (!user?.id) {
                res
                    .status(401)
                    .json({ success: false, message: "Utilisateur non authentifié" });
                return;
            }
            if (!planId) {
                res.status(400).json({ success: false, message: "planId requis" });
                return;
            }
            const plan = await prisma_1.prisma.subscriptionPlan.findUnique({
                where: { id: planId },
            });
            if (!plan || !plan.isActive) {
                res.status(404).json({ success: false, message: "Plan non trouvé" });
                return;
            }
            const existingActiveSubscription = await prisma_1.prisma.subscription.findFirst({
                where: {
                    userId: user.id,
                    status: "active",
                    endDate: { gt: new Date() },
                },
            });
            if (existingActiveSubscription) {
                res.status(400).json({
                    success: false,
                    message: "Abonnement actif existant. Annulez-le d'abord.",
                });
                return;
            }
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + plan.duration);
            const subscription = await prisma_1.prisma.subscription.create({
                data: {
                    userId: user.id,
                    subscriptionPlanId: plan.id,
                    plan: plan.name,
                    status: "active",
                    startDate,
                    endDate,
                },
            });
            res.status(201).json({
                success: true,
                message: "Abonnement créé avec succès",
                data: {
                    id: subscription.id,
                    plan: subscription.plan,
                    status: subscription.status,
                    startDate: subscription.startDate,
                    endDate: subscription.endDate,
                },
            });
        }
        catch (error) {
            console.error("Erreur création abonnement:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
    /**
     * Annuler un abonnement
     */
    static async cancelSubscription(req, res) {
        try {
            const user = req.user;
            const { id } = req.params;
            if (!user?.id) {
                res
                    .status(401)
                    .json({ success: false, message: "Utilisateur non authentifié" });
                return;
            }
            const subscription = await prisma_1.prisma.subscription.findUnique({
                where: { id },
            });
            if (!subscription || subscription.userId !== user.id) {
                res
                    .status(404)
                    .json({ success: false, message: "Abonnement non trouvé" });
                return;
            }
            const updatedSubscription = await prisma_1.prisma.subscription.update({
                where: { id },
                data: { status: "cancelled" },
            });
            res.json({
                success: true,
                message: "Abonnement annulé",
                data: {
                    id: updatedSubscription.id,
                    status: updatedSubscription.status,
                },
            });
        }
        catch (error) {
            console.error("Erreur annulation abonnement:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
}
exports.SubscriptionController = SubscriptionController;
exports.default = SubscriptionController;
//# sourceMappingURL=subscriptionController.js.map
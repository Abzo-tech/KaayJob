/**
 * Contrôleur pour les paiements d'abonnements - VERSION PRISMA COMPLÈTE
 * Gère uniquement les paiements d'abonnements pour prestataires
 */

import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export class PaymentController {
  /**
   * Obtenir les paiements d'abonnement du prestataire connecté - PRISMA
   */
  static async getMyPayments(req: Request, res: Response) {
    try {
      const user = (req as any).user;

      if (!user?.id) {
        res
          .status(401)
          .json({ success: false, message: "Utilisateur non authentifié" });
        return;
      }

      // Vérifier que c'est un prestataire
      if (user.role !== "PRESTATAIRE" && user.role !== "prestataire") {
        return res.status(403).json({
          success: false,
          message: "Accès réservé aux prestataires",
        });
      }

      const { page = 1, limit = 10 } = req.query;
      const parsedLimit = Number(limit);
      const parsedPage = Number(page);
      const skip = (parsedPage - 1) * parsedLimit;

      // Récupérer les paiements avec Prisma
      const [payments, totalCount] = await Promise.all([
        prisma.payment.findMany({
          where: {
            userId: user.id,
            paymentMethod: "subscription",
          },
          include: {
            booking: {
              select: {
                id: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: parsedLimit,
          skip: skip,
        }),
        prisma.payment.count({
          where: {
            userId: user.id,
            paymentMethod: "subscription",
          },
        }),
      ]);

      // Récupérer les abonnements actifs du prestataire
      const subscriptions = await prisma.subscription.findMany({
        where: {
          userId: user.id,
          status: "active",
        },
      });

      // Transformer les paiements
      const transformedPayments = payments.map((payment: any) => {
        const activeSubscription = subscriptions.find(
          (sub) =>
            new Date(payment.createdAt) >= new Date(sub.startDate) &&
            new Date(payment.createdAt) <= new Date(sub.endDate),
        );

        return {
          id: payment.id,
          amount: parseFloat(payment.amount.toString()),
          paymentMethod: payment.paymentMethod,
          status: payment.status,
          transactionId: payment.transactionId,
          createdAt: payment.createdAt,
          subscription: activeSubscription
            ? {
                id: activeSubscription.id,
                plan: activeSubscription.plan,
                startDate: activeSubscription.startDate,
                endDate: activeSubscription.endDate,
              }
            : null,
        };
      });

      const totalPages = Math.ceil(totalCount / parsedLimit);

      res.json({
        success: true,
        data: transformedPayments,
        pagination: {
          page: parsedPage,
          limit: parsedLimit,
          total: totalCount,
          totalPages: totalPages,
        },
      });
    } catch (error) {
      console.error("Erreur récupération paiements:", error);
      res.status(500).json({
        success: false,
        message: "Erreur serveur",
      });
    }
  }

  /**
   * Obtenir un paiement d'abonnement par ID
   */
  static async getPaymentById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = (req as any).user;

      if (!user?.id) {
        res
          .status(401)
          .json({ success: false, message: "Utilisateur non authentifié" });
        return;
      }

      // Vérifier que c'est un prestataire
      if (user.role !== "PRESTATAIRE" && user.role !== "prestataire") {
        return res.status(403).json({
          success: false,
          message: "Accès réservé aux prestataires",
        });
      }

      const payment = await prisma.payment.findUnique({
        where: { id },
        include: {
          booking: {
            select: { id: true },
          },
        },
      });

      if (!payment || payment.userId !== user.id) {
        res
          .status(404)
          .json({ success: false, message: "Paiement non trouvé" });
        return;
      }

      res.json({
        success: true,
        data: {
          id: payment.id,
          amount: parseFloat(payment.amount.toString()),
          paymentMethod: payment.paymentMethod,
          status: payment.status,
          transactionId: payment.transactionId,
          createdAt: payment.createdAt,
        },
      });
    } catch (error) {
      console.error("Erreur récupération paiement:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Obtenir tous les paiements d'abonnement (Admin seulement)
   */
  static async getAllPayments(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 20 } = req.query;
      const parsedLimit = Number(limit);
      const parsedPage = Number(page);
      const skip = (parsedPage - 1) * parsedLimit;

      const [payments, totalCount] = await Promise.all([
        prisma.payment.findMany({
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: parsedLimit,
          skip: skip,
        }),
        prisma.payment.count(),
      ]);

      const transformedPayments = payments.map((payment: any) => ({
        id: payment.id,
        amount: parseFloat(payment.amount.toString()),
        paymentMethod: payment.paymentMethod,
        status: payment.status,
        transactionId: payment.transactionId,
        createdAt: payment.createdAt,
        user: {
          firstName: payment.user?.firstName,
          lastName: payment.user?.lastName,
          email: payment.user?.email,
        },
      }));

      const totalPages = Math.ceil(totalCount / parsedLimit);

      res.json({
        success: true,
        data: transformedPayments,
        pagination: {
          page: parsedPage,
          limit: parsedLimit,
          total: totalCount,
          totalPages: totalPages,
        },
      });
    } catch (error) {
      console.error("Erreur récupération tous paiements:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Mettre à jour le statut d'un paiement (Admin seulement)
   */
  static async updatePaymentStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const normalizedStatus = String(status).toUpperCase();
      const validStatuses = ["PENDING", "PAID", "REFUNDED"];

      if (!validStatuses.includes(normalizedStatus)) {
        res.status(400).json({
          success: false,
          message:
            "Statut invalide. Valeurs possibles: pending, paid, refunded",
        });
        return;
      }

      const updatedPayment = await prisma.payment.update({
        where: { id },
        data: { status: normalizedStatus as any },
      });

      res.json({
        success: true,
        message: "Statut du paiement mis à jour",
        data: {
          id: updatedPayment.id,
          status: updatedPayment.status,
        },
      });
    } catch (error) {
      console.error("Erreur mise à jour statut paiement:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }
}

export default PaymentController;

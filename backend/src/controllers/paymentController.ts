/**
 * Contrôleur pour les paiements d'abonnements
 * Gère uniquement les paiements d'abonnements pour prestataires
 * Utilise les requêtes SQL directes
 */

import { Request, Response } from "express";
import { query } from "../config/database";

export class PaymentController {
  /**
    * Obtenir les paiements d'abonnement du prestataire connecté
    */
  static async getMyPayments(req: Request, res: Response) {
    try {
      const user = (req as any).user;

      if (!user?.id) {
        res.status(401).json({ success: false, message: 'Utilisateur non authentifié' });
        return;
      }

      // Vérifier que c'est un prestataire
      if (user.role !== "PRESTATAIRE" && user.role !== "prestataire") {
        return res.status(403).json({
          success: false,
          message: "Accès réservé aux prestataires"
        });
      }

      const { page = 1, limit = 10 } = req.query;
      const parsedLimit = Number(limit);
      const parsedPage = Number(page);
      const offset = (parsedPage - 1) * parsedLimit;

      const paymentsQuery = `
        SELECT
          p.id, p.amount, p.payment_method as "paymentMethod", p.status,
          p.transaction_id as "transactionId", p.created_at as "createdAt",
          s.id as "subscriptionId", s.plan as "subscriptionPlan",
          s.start_date as "subscriptionStart", s.end_date as "subscriptionEnd",
          s.plan as "planName", 0 as "planPrice"
        FROM payments p
        LEFT JOIN subscriptions s ON p.user_id = s.user_id
          AND s.status = 'active'
          AND p.created_at >= s.start_date
          AND p.created_at <= s.end_date
        WHERE p.user_id = $1 AND p.payment_method = 'subscription'
        ORDER BY p.created_at DESC
        LIMIT $2 OFFSET $3
      `;

      const countQuery = `
        SELECT COUNT(*) as count FROM payments
        WHERE user_id = $1 AND payment_method = 'subscription'
      `;

      const [paymentsResult, countResult] = await Promise.all([
        query(paymentsQuery, [user.id, parsedLimit, offset]),
        query(countQuery, [user.id])
      ]);

      const total = parseInt(countResult.rows[0].count, 10);
      const payments = paymentsResult.rows.map((row: any) => ({
        id: row.id,
        amount: parseFloat(row.amount),
        paymentMethod: row.paymentMethod,
        status: row.status,
        transactionId: row.transactionId,
        createdAt: row.createdAt,
        subscription: row.subscriptionId ? {
          id: row.subscriptionId,
          plan: row.subscriptionPlan,
          startDate: row.subscriptionStart,
          endDate: row.subscriptionEnd,
          planDetails: {
            name: row.planName,
            price: parseFloat(row.planPrice),
          }
        } : null,
      }));

      res.json({
        success: true,
        data: payments,
        pagination: {
          page: parsedPage,
          limit: parsedLimit,
          total: total,
          totalPages: Math.ceil(total / parsedLimit),
        }
      });
    } catch (error) {
      console.error("Erreur récupération paiements:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
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
        res.status(401).json({ success: false, message: 'Utilisateur non authentifié' });
        return;
      }

      // Vérifier que c'est un prestataire
      if (user.role !== "PRESTATAIRE" && user.role !== "prestataire") {
        return res.status(403).json({
          success: false,
          message: "Accès réservé aux prestataires"
        });
      }

      const paymentQuery = `
        SELECT
          p.id, p.amount, p.payment_method as "paymentMethod", p.status,
          p.transaction_id as "transactionId", p.created_at as "createdAt",
          s.id as "subscriptionId", s.plan as "subscriptionPlan",
          s.start_date as "subscriptionStart", s.end_date as "subscriptionEnd",
          sp.name as "planName", sp.price as "planPrice"
        FROM payments p
        LEFT JOIN subscriptions s ON p.user_id = s.user_id
          AND s.status = 'active'
          AND p.created_at >= s.start_date
          AND p.created_at <= s.end_date
        LEFT JOIN subscription_plans sp ON s.subscription_plan_id = sp.id
        WHERE p.id = $1 AND p.user_id = $2 AND p.payment_method = 'subscription'
      `;

      const paymentResult = await query(paymentQuery, [id, user.id]);

      if (paymentResult.rows.length === 0) {
        res.status(404).json({ success: false, message: "Paiement non trouvé" });
        return;
      }

      const row = paymentResult.rows[0];
      const payment = {
        id: row.id,
        amount: parseFloat(row.amount),
        paymentMethod: row.paymentMethod,
        status: row.status,
        transactionId: row.transactionId,
        createdAt: row.createdAt,
        subscription: row.subscriptionId ? {
          id: row.subscriptionId,
          plan: row.subscriptionPlan,
          startDate: row.subscriptionStart,
          endDate: row.subscriptionEnd,
          planDetails: {
            name: row.planName,
            price: parseFloat(row.planPrice),
          }
        } : null,
      };

      res.json({
        success: true,
        data: payment
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
      const offset = (parsedPage - 1) * parsedLimit;

      // Requête très simplifiée
      const paymentsQuery = `
        SELECT
          p.id, p.amount, p.payment_method as "paymentMethod", p.status,
          p.transaction_id as "transactionId", p.created_at as "createdAt",
          u.first_name as "userFirstName", u.last_name as "userLastName", u.email as "userEmail"
        FROM payments p
        LEFT JOIN users u ON p.user_id = u.id
        ORDER BY p.created_at DESC
        LIMIT $1 OFFSET $2
      `;

      const countQuery = `SELECT COUNT(*) as count FROM payments p`;

      const [paymentsResult, countResult] = await Promise.all([
        query(paymentsQuery, [parsedLimit, offset]),
        query(countQuery, [])
      ]);

      const total = parseInt(countResult.rows[0].count, 10);
      const payments = paymentsResult.rows.map((row: any) => ({
        id: row.id,
        amount: parseFloat(row.amount),
        paymentMethod: row.paymentMethod,
        status: row.status,
        transactionId: row.transactionId,
        createdAt: row.createdAt,
        user: {
          firstName: row.userFirstName,
          lastName: row.userLastName,
          email: row.userEmail,
        },
        subscription: {
          plan: "Abonnement",
          planName: "Plan d'abonnement",
        },
      }));

      res.json({
        success: true,
        data: payments,
        pagination: {
          page: parsedPage,
          limit: parsedLimit,
          total: total,
          totalPages: Math.ceil(total / parsedLimit),
        }
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

      if (!['pending', 'completed', 'failed', 'refunded'].includes(status)) {
        res.status(400).json({
          success: false,
          message: "Statut invalide. Valeurs possibles: pending, completed, failed, refunded"
        });
        return;
      }

      const updateQuery = `
        UPDATE payments
        SET status = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING id, status
      `;

      const updateResult = await query(updateQuery, [status, id]);

      if (updateResult.rows.length === 0) {
        res.status(404).json({ success: false, message: "Paiement non trouvé" });
        return;
      }

      res.json({
        success: true,
        message: "Statut du paiement mis à jour",
        data: updateResult.rows[0]
      });
    } catch (error) {
      console.error("Erreur mise à jour statut paiement:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }
}

export default PaymentController;
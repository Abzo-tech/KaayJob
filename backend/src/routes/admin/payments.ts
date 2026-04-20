/**
 * Routes d'administration - Paiements
 */

import { Router, Response } from "express";
import { prisma } from "../../config/prisma";
import { AuthRequest } from "../../middleware/auth";

const router = Router();

const serializePayment = (payment: any) => ({
  id: payment.id,
  booking_id: payment.bookingId,
  user_id: payment.userId,
  amount: Number(payment.amount.toString()),
  payment_method: payment.paymentMethod,
  status: payment.status,
  transaction_id: payment.transactionId,
  created_at: payment.createdAt,
  first_name: payment.user?.firstName ?? null,
  last_name: payment.user?.lastName ?? null,
  email: payment.user?.email ?? null,
  booking_amount: payment.booking?.totalAmount
    ? Number(payment.booking.totalAmount.toString())
    : null,
  booking_status: payment.booking?.status ?? null,
});

// GET /api/admin/payments - Historique des paiements
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const parsedPage = Number(page) || 1;
    const parsedLimit = Number(limit) || 20;
    const skip = (parsedPage - 1) * parsedLimit;
    const normalizedStatus = status
      ? String(status).toUpperCase()
      : undefined;

    const where = normalizedStatus ? { status: normalizedStatus as any } : {};

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          booking: {
            select: {
              totalAmount: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: parsedLimit,
        skip,
      }),
      prisma.payment.count({ where }),
    ]);

    res.json({
      success: true,
      data: payments.map(serializePayment),
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total,
      },
    });
  } catch (error) {
    console.error("Erreur liste paiements:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// GET /api/admin/payments/:id - Détails d'un paiement
router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        booking: {
          select: {
            totalAmount: true,
            status: true,
          },
        },
      },
    });

    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: "Paiement non trouvé" });
    }

    res.json({ success: true, data: serializePayment(payment) });
  } catch (error) {
    console.error("Erreur obtenir paiement:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

export default router;

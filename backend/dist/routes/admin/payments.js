"use strict";
/**
 * Routes d'administration - Paiements
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../../config/prisma");
const router = (0, express_1.Router)();
const serializePayment = (payment) => ({
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
router.get("/", async (req, res) => {
    try {
        const { page = 1, limit = 20, status } = req.query;
        const parsedPage = Number(page) || 1;
        const parsedLimit = Number(limit) || 20;
        const skip = (parsedPage - 1) * parsedLimit;
        const normalizedStatus = status
            ? String(status).toUpperCase()
            : undefined;
        const where = normalizedStatus ? { status: normalizedStatus } : {};
        const [payments, total] = await Promise.all([
            prisma_1.prisma.payment.findMany({
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
            prisma_1.prisma.payment.count({ where }),
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
    }
    catch (error) {
        console.error("Erreur liste paiements:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
// GET /api/admin/payments/:id - Détails d'un paiement
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await prisma_1.prisma.payment.findUnique({
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
    }
    catch (error) {
        console.error("Erreur obtenir paiement:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
exports.default = router;
//# sourceMappingURL=payments.js.map
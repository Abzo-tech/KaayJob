"use strict";
/**
 * Routes d'administration - Analytics
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../../config/prisma");
const router = (0, express_1.Router)();
// GET /api/admin/analytics - Données analytiques
router.get("/", async (req, res) => {
    try {
        // Monthly bookings - Using Prisma
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        // Get all bookings from the last 6 months
        const bookings = await prisma_1.prisma.booking.findMany({
            where: {
                createdAt: { gte: sixMonthsAgo }
            },
            select: {
                createdAt: true,
                totalAmount: true,
                status: true
            }
        });
        // Group by month
        const monthlyMap = new Map();
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
        for (let i = 0; i < 6; i++) {
            const d = new Date();
            d.setMonth(d.getMonth() - (5 - i));
            const monthKey = months[d.getMonth()];
            monthlyMap.set(monthKey, { bookings: 0, revenue: 0 });
        }
        bookings.forEach(booking => {
            const monthKey = months[booking.createdAt.getMonth()];
            const current = monthlyMap.get(monthKey);
            if (current) {
                current.bookings += 1;
                if (booking.status === 'COMPLETED') {
                    current.revenue += Number(booking.totalAmount) || 0;
                }
            }
        });
        const monthly = Array.from(monthlyMap.entries()).map(([month, data]) => ({
            month,
            bookings: data.bookings,
            revenue: data.revenue
        }));
        // Top providers - Using Prisma
        const completedBookings = await prisma_1.prisma.booking.findMany({
            where: { status: 'COMPLETED' },
            include: {
                service: {
                    include: {
                        provider: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        // Group bookings by provider
        const providerMap = new Map();
        completedBookings.forEach(booking => {
            const provider = booking.service?.provider;
            if (provider) {
                const providerId = provider.userId;
                const existing = providerMap.get(providerId);
                const revenue = Number(booking.totalAmount) || 0;
                if (existing) {
                    existing.bookings += 1;
                    existing.revenue += revenue;
                }
                else {
                    providerMap.set(providerId, {
                        firstName: provider.user.firstName,
                        lastName: provider.user.lastName,
                        bookings: 1,
                        revenue: revenue,
                        rating: Number(provider.rating) || 0
                    });
                }
            }
        });
        // Convert to array and sort by revenue
        const topProviders = Array.from(providerMap.entries())
            .map(([id, data]) => ({
            first_name: data.firstName,
            last_name: data.lastName,
            bookings: data.bookings,
            revenue: data.revenue,
            rating: data.rating
        }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);
        // Service categories - Using Prisma
        const categories = await prisma_1.prisma.category.findMany({
            include: {
                _count: {
                    select: { services: true }
                }
            },
            orderBy: {
                name: 'asc'
            }
        });
        const serviceCategories = categories.map(c => ({
            name: c.name,
            service_count: c._count.services
        }));
        // Recent activity - Get recent bookings
        const recentBookings = await prisma_1.prisma.booking.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: {
                client: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });
        const activity = recentBookings.map(b => ({
            type: 'booking',
            message: `${b.client.firstName} ${b.client.lastName}`,
            time: b.createdAt
        }));
        res.json({
            success: true,
            data: {
                monthly,
                topProviders,
                categories: serviceCategories,
                activity,
                totalUsers: (await prisma_1.prisma.user.count()),
            },
        });
    }
    catch (error) {
        console.error("Erreur analytiques:", error);
        res.status(500).json({ success: false, message: "Erreur serveur", detail: error.message });
    }
});
// GET /api/admin/stats - Statistiques globales (endpoint séparé pour compatibilité)
router.get("/stats", async (req, res) => {
    try {
        const [clientUsers, providerUsers, adminUsers, totalBookings, pendingBookings, completedBookings, cancelledBookings, completedRevenue, totalProviders, verifiedProviders,] = await Promise.all([
            prisma_1.prisma.user.count({ where: { role: "CLIENT" } }),
            prisma_1.prisma.user.count({ where: { role: "PRESTATAIRE" } }),
            prisma_1.prisma.user.count({ where: { role: "ADMIN" } }),
            prisma_1.prisma.booking.count(),
            prisma_1.prisma.booking.count({ where: { status: "PENDING" } }),
            prisma_1.prisma.booking.count({ where: { status: "COMPLETED" } }),
            prisma_1.prisma.booking.count({ where: { status: "CANCELLED" } }),
            prisma_1.prisma.booking.aggregate({
                where: { status: "COMPLETED" },
                _sum: { totalAmount: true },
            }),
            prisma_1.prisma.providerProfile.count(),
            prisma_1.prisma.providerProfile.count({ where: { isVerified: true } }),
        ]);
        res.json({
            success: true,
            data: {
                users: [
                    { role: "CLIENT", total: String(clientUsers) },
                    { role: "PRESTATAIRE", total: String(providerUsers) },
                    { role: "ADMIN", total: String(adminUsers) },
                ],
                bookings: {
                    total: String(totalBookings),
                    pending: String(pendingBookings),
                    completed: String(completedBookings),
                    cancelled: String(cancelledBookings),
                },
                revenue: Number(completedRevenue._sum.totalAmount?.toString() || 0),
                providers: {
                    total: String(totalProviders),
                    verified: String(verifiedProviders),
                },
            },
        });
    }
    catch (error) {
        console.error("Erreur statistiques:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
exports.default = router;
//# sourceMappingURL=analytics.js.map
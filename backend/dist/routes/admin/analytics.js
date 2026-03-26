"use strict";
/**
 * Routes d'administration - Analytics
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
        const { query: dbQuery } = await Promise.resolve().then(() => __importStar(require("../../config/database")));
        const usersResult = await dbQuery("SELECT COUNT(*) as total, role FROM users GROUP BY role");
        const bookingsResult = await dbQuery(`
      SELECT COUNT(*) as total,
             SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) as pending,
             SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completed,
             SUM(CASE WHEN status = 'CANCELLED' THEN 1 ELSE 0 END) as cancelled
      FROM bookings
    `);
        const revenueResult = await dbQuery(`
      SELECT COALESCE(SUM(total_amount), 0) as total_revenue
      FROM bookings
      WHERE status = 'COMPLETED'
    `);
        const providersResult = await dbQuery(`
      SELECT COUNT(*) as total,
             SUM(CASE WHEN is_verified = true THEN 1 ELSE 0 END) as verified
      FROM provider_profiles
    `);
        res.json({
            success: true,
            data: {
                users: usersResult.rows,
                bookings: bookingsResult.rows[0],
                revenue: parseFloat(revenueResult.rows[0].total_revenue),
                providers: providersResult.rows[0],
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
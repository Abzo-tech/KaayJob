"use strict";
/**
 * Contrôleur pour les fonctionnalités administrateur
 * Utilise Prisma pour les opérations de données
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const prisma_1 = require("../config/prisma");
class AdminController {
    /**
     * Statistiques générales du tableau de bord
     */
    static async getStats(req, res) {
        try {
            const [usersCount, clientsCount, providersCount, categoriesCount, categoriesActiveCount, servicesCount, servicesActiveCount, bookingsTotal, bookingsPending, bookingsConfirmed, bookingsCompleted] = await Promise.all([
                prisma_1.prisma.user.count(),
                prisma_1.prisma.user.count({ where: { role: "CLIENT" } }),
                prisma_1.prisma.user.count({ where: { role: "PRESTATAIRE" } }),
                prisma_1.prisma.category.count(),
                prisma_1.prisma.category.count({ where: { isActive: true } }),
                prisma_1.prisma.service.count(),
                prisma_1.prisma.service.count({ where: { isActive: true } }),
                prisma_1.prisma.booking.count(),
                prisma_1.prisma.booking.count({ where: { status: "PENDING" } }),
                prisma_1.prisma.booking.count({ where: { status: "CONFIRMED" } }),
                prisma_1.prisma.booking.count({ where: { status: "COMPLETED" } }),
            ]);
            const stats = {
                users: {
                    total: usersCount,
                    clients: clientsCount,
                    providers: providersCount,
                },
                categories: {
                    total: categoriesCount,
                    active: categoriesActiveCount,
                },
                services: {
                    total: servicesCount,
                    active: servicesActiveCount,
                },
                bookings: {
                    total: bookingsTotal,
                    pending: bookingsPending,
                    confirmed: bookingsConfirmed,
                    completed: bookingsCompleted,
                },
            };
            res.json({ success: true, data: stats });
        }
        catch (error) {
            console.error('❌ Erreur statistiques:', error);
            res.status(500).json({ success: false, message: 'Erreur serveur' });
        }
    }
    /**
     * Liste des utilisateurs pour l'administration
     */
    static async getUsers(req, res) {
        try {
            const { limit = 100, offset = 0 } = req.query;
            const users = await prisma_1.prisma.user.findMany({
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    phone: true,
                    role: true,
                    isVerified: true,
                    createdAt: true,
                },
                orderBy: { createdAt: "desc" },
                take: Number(limit),
                skip: Number(offset),
            });
            res.json({ success: true, data: users });
        }
        catch (error) {
            console.error('❌ Erreur utilisateurs:', error);
            res.status(500).json({ success: false, message: 'Erreur serveur' });
        }
    }
    /**
     * Liste des services pour l'administration
     */
    static async getServices(req, res) {
        try {
            const { limit = 100, offset = 0 } = req.query;
            const services = await prisma_1.prisma.service.findMany({
                where: {},
                orderBy: { createdAt: "desc" },
                take: Number(limit),
                skip: Number(offset),
                select: {
                    id: true,
                    name: true,
                    price: true,
                    duration: true,
                    isActive: true,
                    category: {
                        select: { name: true },
                    },
                    provider: {
                        select: {
                            user: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                },
                            },
                        },
                    },
                },
            });
            res.json({
                success: true,
                data: services.map((service) => ({
                    id: service.id,
                    name: service.name,
                    price: parseFloat(service.price.toString()),
                    duration: service.duration,
                    isActive: service.isActive,
                    categoryName: service.category?.name,
                    providerFirstName: service.provider?.user?.firstName,
                    providerLastName: service.provider?.user?.lastName,
                })),
            });
        }
        catch (error) {
            console.error('❌ Erreur services:', error);
            res.status(500).json({ success: false, message: 'Erreur serveur' });
        }
    }
    /**
     * Liste des réservations pour l'administration
     */
    static async getBookings(req, res) {
        try {
            const { limit = 100, offset = 0 } = req.query;
            const bookings = await prisma_1.prisma.booking.findMany({
                orderBy: { createdAt: "desc" },
                take: Number(limit),
                skip: Number(offset),
                include: {
                    client: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                    service: {
                        select: {
                            name: true,
                            provider: {
                                select: {
                                    user: {
                                        select: {
                                            firstName: true,
                                            lastName: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            res.json({
                success: true,
                data: bookings.map((booking) => ({
                    id: booking.id,
                    date: booking.bookingDate,
                    time: booking.bookingTime,
                    status: booking.status,
                    totalPrice: booking.totalAmount ? parseFloat(booking.totalAmount.toString()) : null,
                    createdAt: booking.createdAt,
                    clientFirstName: booking.client?.firstName,
                    clientLastName: booking.client?.lastName,
                    clientEmail: booking.client?.email,
                    serviceName: booking.service?.name,
                    providerFirstName: booking.service?.provider?.user?.firstName,
                    providerLastName: booking.service?.provider?.user?.lastName,
                })),
            });
        }
        catch (error) {
            console.error('❌ Erreur réservations:', error);
            res.status(500).json({ success: false, message: 'Erreur serveur' });
        }
    }
}
exports.AdminController = AdminController;
exports.default = AdminController;
//# sourceMappingURL=adminController.js.map
"use strict";
/**
 * Contrôleur pour les réservations
 * Gère les opérations CRUD sur les réservations
 * Utilise Prisma pour les queries
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const prisma_1 = require("../config/prisma");
class BookingController {
    /**
     * Mes réservations (alias de getAll pour client)
     */
    static async getMyBookings(req, res) {
        await BookingController.getAll(req, res);
    }
    /**
     * Liste des réservations (selon le rôle)
     */
    static async getAll(req, res) {
        try {
            const user = req.user;
            const { status, page = 1, limit = 20 } = req.query;
            const skip = (Number(page) - 1) * Number(limit);
            let where = {};
            // Filter by role
            if (user.role === "CLIENT") {
                where.clientId = user.id;
            }
            else if (user.role === "PRESTATAIRE") {
                where.service = {
                    provider: {
                        userId: user.id,
                    },
                };
            }
            // Admin sees all
            // Filter by status
            if (status) {
                where.status = status.toUpperCase();
            }
            const [bookings, total] = await Promise.all([
                prisma_1.prisma.booking.findMany({
                    where,
                    include: {
                        client: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                phone: true,
                            },
                        },
                        service: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
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
                    orderBy: { createdAt: "desc" },
                    skip,
                    take: Number(limit),
                }),
                prisma_1.prisma.booking.count({ where }),
            ]);
            res.json({
                success: true,
                data: bookings,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    totalPages: Math.ceil(total / Number(limit)),
                },
            });
        }
        catch (error) {
            console.error("Erreur liste réservations:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
    /**
     * Obtenir une réservation par ID
     */
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const user = req.user;
            const booking = await prisma_1.prisma.booking.findUnique({
                where: { id },
                include: {
                    client: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            phone: true,
                        },
                    },
                    service: {
                        include: {
                            provider: {
                                include: {
                                    user: {
                                        select: {
                                            firstName: true,
                                            lastName: true,
                                            phone: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            if (!booking) {
                res
                    .status(404)
                    .json({ success: false, message: "Réservation non trouvée" });
                return;
            }
            // Check access rights
            if (user.role === "CLIENT" && booking.clientId !== user.id) {
                res.status(403).json({ success: false, message: "Accès refusé" });
                return;
            }
            if (user.role === "PRESTATAIRE") {
                const provider = await prisma_1.prisma.providerProfile.findUnique({
                    where: { userId: user.id },
                });
                if (provider && booking.service?.provider?.id !== provider.id) {
                    res.status(403).json({ success: false, message: "Accès refusé" });
                    return;
                }
            }
            res.json({ success: true, data: booking });
        }
        catch (error) {
            console.error("Erreur récupération réservation:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
    /**
     * Créer une nouvelle réservation
     */
    static async create(req, res) {
        try {
            const user = req.user;
            const { serviceId, date, time, address, city, phone, notes } = req.body;
            // Check if service exists and is active
            const service = await prisma_1.prisma.service.findUnique({
                where: { id: serviceId },
            });
            if (!service) {
                res.status(404).json({ success: false, message: "Service non trouvé" });
                return;
            }
            if (!service.isActive) {
                res.status(400).json({
                    success: false,
                    message: "Ce service n'est plus disponible",
                });
                return;
            }
            // Check that user is not booking their own service
            if (service.providerId) {
                const provider = await prisma_1.prisma.providerProfile.findUnique({
                    where: { id: service.providerId },
                });
                if (provider?.userId === user.id) {
                    res.status(400).json({
                        success: false,
                        message: "Vous ne pouvez pas réserver votre propre service",
                    });
                    return;
                }
            }
            const booking = await prisma_1.prisma.booking.create({
                data: {
                    clientId: user.id,
                    serviceId,
                    bookingDate: new Date(date),
                    bookingTime: time,
                    address,
                    city,
                    phone,
                    notes,
                    status: "PENDING",
                    totalAmount: service.price,
                },
                include: {
                    service: true,
                    client: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                },
            });
            res.status(201).json({
                success: true,
                message: "Réservation créée",
                data: booking,
            });
        }
        catch (error) {
            console.error("Erreur création réservation:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
    /**
     * Mettre à jour le statut d'une réservation
     */
    static async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const user = req.user;
            const { status } = req.body;
            // Find booking
            const booking = await prisma_1.prisma.booking.findUnique({
                where: { id },
                include: {
                    service: true,
                },
            });
            if (!booking) {
                res
                    .status(404)
                    .json({ success: false, message: "Réservation non trouvée" });
                return;
            }
            // Check access
            if (user.role === "CLIENT" && booking.clientId !== user.id) {
                res.status(403).json({ success: false, message: "Accès refusé" });
                return;
            }
            if (user.role === "PRESTATAIRE") {
                const provider = await prisma_1.prisma.providerProfile.findUnique({
                    where: { userId: user.id },
                });
                if (provider && booking.service?.providerId !== provider.id) {
                    res.status(403).json({ success: false, message: "Accès refusé" });
                    return;
                }
            }
            // Valid status transitions
            const validTransitions = {
                PENDING: ["CONFIRMED", "CANCELLED", "REJECTED"],
                CONFIRMED: ["IN_PROGRESS", "CANCELLED"],
                IN_PROGRESS: ["COMPLETED", "CANCELLED"],
                COMPLETED: [],
                CANCELLED: [],
                REJECTED: [],
            };
            const upperStatus = status.toUpperCase();
            if (!validTransitions[booking.status]?.includes(upperStatus)) {
                res.status(400).json({
                    success: false,
                    message: `Transition de statut invalide: ${booking.status} -> ${upperStatus}`,
                });
                return;
            }
            const updated = await prisma_1.prisma.booking.update({
                where: { id },
                data: {
                    status: upperStatus,
                },
            });
            res.json({
                success: true,
                message: "Statut mis à jour",
                data: updated,
            });
        }
        catch (error) {
            console.error("Erreur mise à jour statut:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
    /**
     * Annuler une réservation
     */
    static async cancel(req, res) {
        try {
            const { id } = req.params;
            const user = req.user;
            const booking = await prisma_1.prisma.booking.findUnique({
                where: { id },
            });
            if (!booking) {
                res
                    .status(404)
                    .json({ success: false, message: "Réservation non trouvée" });
                return;
            }
            // Check access
            if (user.role === "CLIENT" && booking.clientId !== user.id) {
                res.status(403).json({ success: false, message: "Accès refusé" });
                return;
            }
            // Cannot cancel completed bookings
            if (["COMPLETED", "CANCELLED"].includes(booking.status)) {
                res.status(400).json({
                    success: false,
                    message: "Cette réservation ne peut pas être annulée",
                });
                return;
            }
            await prisma_1.prisma.booking.update({
                where: { id },
                data: {
                    status: "CANCELLED",
                },
            });
            res.json({ success: true, message: "Réservation annulée" });
        }
        catch (error) {
            console.error("Erreur annulation réservation:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
}
exports.BookingController = BookingController;
exports.default = BookingController;
//# sourceMappingURL=bookingController.js.map
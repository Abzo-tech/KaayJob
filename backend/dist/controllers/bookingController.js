"use strict";
/**
 * Contrôleur pour les réservations
 * Gère les opérations CRUD sur les réservations
 * Utilise Prisma pour les queries
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const prisma_1 = require("../config/prisma");
const database_1 = require("../config/database");
// Fonction utilitaire pour créer une notification (utilise query direct pour compatibilité)
async function createNotification(userId, title, message, type = "info", link) {
    try {
        await (0, database_1.query)("INSERT INTO notifications (id, user_id, title, message, type, link, created_at) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW())", [userId, title, message, type, link || null]);
    }
    catch (error) {
        console.error("Erreur création notification:", error);
    }
}
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
            if (user.role === "CLIENT" || user.role === "client") {
                where.clientId = user.id;
            }
            else if (user.role === "PRESTATAIRE" || user.role === "prestataire") {
                // Service.providerId references ProviderProfile.userId
                where.service = {
                    providerId: user.id,
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
                                        userId: true,
                                        user: {
                                            select: {
                                                id: true,
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
            if (user.role === "CLIENT" || user.role === "client") {
                if (booking.clientId !== user.id) {
                    res.status(403).json({ success: false, message: "Accès refusé" });
                    return;
                }
            }
            else if (user.role === "PRESTATAIRE" || user.role === "prestataire") {
                // Service.providerId references ProviderProfile.userId, so we need to compare with user.id
                const service = await prisma_1.prisma.service.findUnique({
                    where: { id: booking.serviceId },
                });
                if (service?.providerId !== user.id) {
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
            // Vérifier que le providerId existe dans la table provider_profiles
            let validProviderId = null;
            if (service.providerId) {
                const providerExists = await prisma_1.prisma.providerProfile.findUnique({
                    where: { id: service.providerId },
                });
                if (providerExists) {
                    validProviderId = service.providerId;
                }
            }
            // Ensure price is a number
            const price = typeof service.price === 'string' ? parseFloat(service.price) : Number(service.price);
            // Utiliser raw SQL pour insérer la réservation avec provider_id (si valide)
            const result = validProviderId
                ? await (0, database_1.query)(`INSERT INTO bookings (id, client_id, service_id, provider_id, booking_date, booking_time, address, city, phone, notes, status, total_amount, created_at, updated_at)
             VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, 'PENDING', $10::numeric, NOW(), NOW())
             RETURNING *`, [user.id, serviceId, validProviderId, new Date(date), time, address, city, phone, notes || null, price])
                : await (0, database_1.query)(`INSERT INTO bookings (id, client_id, service_id, booking_date, booking_time, address, city, phone, notes, status, total_amount, created_at, updated_at)
             VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, 'PENDING', $9::numeric, NOW(), NOW())
             RETURNING *`, [user.id, serviceId, new Date(date), time, address, city, phone, notes || null, price]);
            const booking = result.rows[0];
            // Notifier le prestataire de la nouvelle réservation (uniquement si provider valide)
            if (validProviderId) {
                const providerProfile = await prisma_1.prisma.providerProfile.findUnique({
                    where: { id: validProviderId },
                    include: { user: true },
                });
                if (providerProfile) {
                    await createNotification(providerProfile.userId, "Nouvelle réservation", `${user.firstName} ${user.lastName} a réservé "${service.name}"`, "info", "/prestataire/bookings");
                }
            }
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
            if (user.role === "CLIENT" || user.role === "client") {
                if (booking.clientId !== user.id) {
                    res.status(403).json({ success: false, message: "Accès refusé" });
                    return;
                }
            }
            else if (user.role === "PRESTATAIRE" || user.role === "prestataire") {
                // Service.providerId references ProviderProfile.userId
                const service = await prisma_1.prisma.service.findUnique({
                    where: { id: booking.serviceId },
                });
                if (service?.providerId !== user.id) {
                    res.status(403).json({ success: false, message: "Accès refusé" });
                    return;
                }
            }
            // Valid status transitions
            const validTransitions = {
                PENDING: ["CONFIRMED", "CANCELLED", "REJECTED"],
                CONFIRMED: ["IN_PROGRESS", "CANCELLED", "COMPLETED"],
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
            // Notifier le client du changement de statut
            await createNotification(booking.clientId, "Statut de réservationmis à jour", `Votre réservation pour "${booking.service.name}" est maintenant ${upperStatus.toLowerCase()}`, upperStatus === "CANCELLED" || upperStatus === "REJECTED"
                ? "error"
                : "success", "/client/bookings");
            // Notifier le prestataire du changement de statut
            if (booking.service.providerId) {
                const providerProfile = await prisma_1.prisma.providerProfile.findUnique({
                    where: { id: booking.service.providerId },
                });
                if (providerProfile) {
                    await createNotification(providerProfile.userId, "Réservation mise à jour", `La réservation pour "${booking.service.name}" est maintenant ${upperStatus.toLowerCase()}`, upperStatus === "CANCELLED" || upperStatus === "REJECTED"
                        ? "error"
                        : "success", "/prestataire/bookings");
                }
            }
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
            // Notifier le client de l'annulation
            await createNotification(booking.clientId, "Réservation annulée", "Votre réservation a été annulée", "warning", "/client/bookings");
            // Notifier le prestataire de l'annulation
            const service = await prisma_1.prisma.service.findUnique({
                where: { id: booking.serviceId },
            });
            if (service?.providerId) {
                const providerProfile = await prisma_1.prisma.providerProfile.findUnique({
                    where: { id: service.providerId },
                });
                if (providerProfile) {
                    await createNotification(providerProfile.userId, "Réservation annulée", `Une réservation a été annulée`, "warning", "/prestataire/bookings");
                }
            }
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
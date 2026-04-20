"use strict";
/**
 * Service de gestion des réservations
 * Logique métier pour les opérations sur les réservations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.listBookings = listBookings;
exports.getBookingById = getBookingById;
exports.updateBooking = updateBooking;
exports.deleteBooking = deleteBooking;
exports.getBookingStats = getBookingStats;
const prisma_1 = require("../config/prisma");
const client_1 = require("@prisma/client");
const notificationService_1 = require("./notificationService");
const normalizeBookingRecord = (booking) => ({
    id: booking.id,
    clientId: booking.clientId,
    serviceId: booking.serviceId,
    bookingDate: booking.bookingDate,
    bookingTime: booking.bookingTime,
    duration: booking.duration,
    status: booking.status,
    address: booking.address,
    city: booking.city,
    phone: booking.phone,
    notes: booking.notes,
    totalAmount: booking.totalAmount ? Number(booking.totalAmount.toString()) : null,
    paymentStatus: booking.paymentStatus,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
    clientFirstName: booking.client?.firstName ?? null,
    clientLastName: booking.client?.lastName ?? null,
    serviceName: booking.service?.name ?? null,
    providerFirstName: booking.service?.provider?.user?.firstName ?? null,
    providerLastName: booking.service?.provider?.user?.lastName ?? null,
});
async function listBookings(filters) {
    const { page = 1, limit = 20, status, providerId, clientId } = filters;
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 20;
    const skip = (pageNum - 1) * limitNum;
    const where = {};
    if (status) {
        where.status = status.toUpperCase();
    }
    if (clientId) {
        where.clientId = clientId;
    }
    if (providerId) {
        where.service = {
            providerId: providerId,
        };
    }
    const [total, bookings] = await Promise.all([
        prisma_1.prisma.booking.count({ where }),
        prisma_1.prisma.booking.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip,
            take: limitNum,
            include: {
                client: {
                    select: {
                        firstName: true,
                        lastName: true,
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
        }),
    ]);
    return {
        data: bookings.map(normalizeBookingRecord),
        pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum),
        },
    };
}
async function getBookingById(bookingId) {
    const booking = await prisma_1.prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            client: {
                select: {
                    firstName: true,
                    lastName: true,
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
    if (!booking) {
        throw new Error("Réservation non trouvée");
    }
    return normalizeBookingRecord(booking);
}
async function updateBooking(bookingId, data, adminId) {
    const existing = await prisma_1.prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            service: {
                include: {
                    provider: {
                        include: { user: true },
                    },
                },
            },
            client: true,
        },
    });
    if (!existing) {
        throw new Error("Réservation non trouvée");
    }
    const updateData = {};
    if (data.status)
        updateData.status = data.status.toUpperCase();
    if (data.paymentStatus)
        updateData.paymentStatus = data.paymentStatus.toUpperCase();
    if (data.bookingDate)
        updateData.bookingDate = new Date(data.bookingDate);
    if (data.bookingTime !== undefined)
        updateData.bookingTime = data.bookingTime;
    if (data.address !== undefined)
        updateData.address = data.address;
    if (data.city !== undefined)
        updateData.city = data.city;
    if (data.notes !== undefined)
        updateData.notes = data.notes;
    if (Object.keys(updateData).length === 0) {
        throw new Error("Aucune donnée à mettre à jour");
    }
    const updated = await prisma_1.prisma.booking.update({
        where: { id: bookingId },
        data: updateData,
        include: {
            client: { select: { firstName: true, lastName: true } },
            service: {
                select: {
                    name: true,
                    provider: {
                        select: {
                            user: { select: { firstName: true, lastName: true } },
                        },
                    },
                },
            },
        },
    });
    if (data.status) {
        const statusMessages = {
            CONFIRMED: "confirmée",
            COMPLETED: "terminée",
            CANCELLED: "annulée",
            PENDING: "en attente",
            REJECTED: "rejetée",
            IN_PROGRESS: "en cours",
        };
        const statusLabel = statusMessages[data.status.toUpperCase()] || data.status.toLowerCase();
        const serviceName = existing.service?.name ?? "un service";
        await (0, notificationService_1.createNotification)(existing.clientId, "Statut de réservation mis à jour", `Votre réservation pour "${serviceName}" a été ${statusLabel}`, data.status.toUpperCase() === "CANCELLED" || data.status.toUpperCase() === "REJECTED" ? "error" : "success", "/client/bookings");
        if (existing.service?.provider?.user) {
            await (0, notificationService_1.createNotification)(existing.service.provider.userId, "Réservation mise à jour", `La réservation pour "${serviceName}" a été ${statusLabel}`, data.status.toUpperCase() === "CANCELLED" || data.status.toUpperCase() === "REJECTED" ? "error" : "success", "/prestataire/bookings");
        }
        if (adminId) {
            await (0, notificationService_1.createNotification)(adminId, "Réservation mise à jour", `La réservation #${bookingId.slice(0, 8)} a été ${statusLabel}`, "info", "/admin/bookings");
        }
    }
    return normalizeBookingRecord(updated);
}
async function deleteBooking(bookingId) {
    const existing = await prisma_1.prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            service: true,
        },
    });
    if (!existing) {
        throw new Error("Réservation non trouvée");
    }
    if (existing.status === client_1.BookingStatus.COMPLETED) {
        throw new Error("Impossible de supprimer une réservation terminée");
    }
    await prisma_1.prisma.review.deleteMany({
        where: { bookingId },
    });
    await prisma_1.prisma.booking.delete({
        where: { id: bookingId },
    });
    return { success: true };
}
async function getBookingStats() {
    const stats = await prisma_1.prisma.booking.aggregate({
        _count: { id: true },
        _sum: {},
        where: {},
    });
    const total = stats._count.id;
    const pending = await prisma_1.prisma.booking.count({ where: { status: "PENDING" } });
    const completed = await prisma_1.prisma.booking.count({ where: { status: "COMPLETED" } });
    const cancelled = await prisma_1.prisma.booking.count({ where: { status: "CANCELLED" } });
    return { total, pending, completed, cancelled };
}
//# sourceMappingURL=bookingService.js.map
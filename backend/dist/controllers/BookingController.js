"use strict";
/**
 * Contrôleur de réservations
 * Responsabilité unique: gérer les opérations CRUD des réservations
 * Principe SOLID: Single Responsibility Principle (SRP)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelBooking = exports.updateBookingStatus = exports.getBookingById = exports.getProviderBookings = exports.getClientBookings = exports.createBooking = void 0;
const database_ts_1 = require(".//config/database.ts");
const schemas_ts_1 = require(".//validations/schemas.ts");
const validate_ts_1 = require(".//middleware/validate.ts");
const zod_1 = require("zod");
/**
 * Créer une nouvelle réservation
 * POST /api/bookings
 */
exports.createBooking = [
    (0, validate_ts_1.validateBody)(schemas_ts_1.createBookingSchema),
    async (req, res) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: "Non autorisé",
                });
                return;
            }
            const data = req.body;
            // Vérifier que le prestataire existe
            const providerCheck = await database_ts_1.pool.query("SELECT id, user_id FROM provider_profiles WHERE user_id = $1", [data.providerId]);
            if (providerCheck.rows.length === 0) {
                res.status(404).json({
                    success: false,
                    message: "Prestataire non trouvé",
                });
                return;
            }
            // Calculer le montant total
            let totalAmount = 0;
            if (data.serviceId) {
                const serviceResult = await database_ts_1.pool.query("SELECT price, duration FROM services WHERE id = $1 AND provider_id = $2", [data.serviceId, data.providerId]);
                if (serviceResult.rows.length > 0) {
                    const service = serviceResult.rows[0];
                    totalAmount =
                        (service.price * (data.duration || service.duration || 60)) / 60;
                }
            }
            // Créer la réservation
            const result = await database_ts_1.pool.query(`INSERT INTO bookings (client_id, provider_id, service_id, booking_date, booking_time, duration, status, address, city, phone, notes, total_amount, payment_status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         RETURNING *`, [
                userId,
                data.providerId,
                data.serviceId || null,
                data.bookingDate,
                data.bookingTime,
                data.duration || 60,
                "pending",
                data.address,
                data.city,
                data.phone,
                data.notes || null,
                totalAmount,
                "pending",
            ]);
            const booking = mapBookingRow(result.rows[0]);
            res.status(201).json({
                success: true,
                message: "Réservation créée avec succès",
                data: booking,
            });
        }
        catch (error) {
            console.error("Erreur lors de la création de la réservation:", error);
            res.status(500).json({
                success: false,
                message: "Erreur lors de la création de la réservation",
            });
        }
    },
];
/**
 * Obtenir les réservations du client
 * GET /api/bookings/client
 */
const getClientBookings = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Non autorisé",
            });
            return;
        }
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const result = await database_ts_1.pool.query(`SELECT * FROM bookings 
       WHERE client_id = $1 
       ORDER BY booking_date DESC, booking_time DESC 
       LIMIT $2 OFFSET $3`, [userId, limit, offset]);
        const countResult = await database_ts_1.pool.query("SELECT COUNT(*) FROM bookings WHERE client_id = $1", [userId]);
        const bookings = result.rows.map(mapBookingRow);
        const total = parseInt(countResult.rows[0].count);
        const response = {
            data: bookings,
            pagination: { limit, offset, total },
        };
        res.status(200).json({
            success: true,
            data: response,
        });
    }
    catch (error) {
        console.error("Erreur lors de la récupération des réservations:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des réservations",
        });
    }
};
exports.getClientBookings = getClientBookings;
/**
 * Obtenir les réservations du prestataire
 * GET /api/bookings/provider
 */
const getProviderBookings = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Non autorisé",
            });
            return;
        }
        // Obtenir l'ID du profil prestataire
        const profileResult = await database_ts_1.pool.query("SELECT id FROM provider_profiles WHERE user_id = $1", [userId]);
        if (profileResult.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "Profil prestataire non trouvé",
            });
            return;
        }
        const providerId = profileResult.rows[0].id;
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const result = await database_ts_1.pool.query(`SELECT * FROM bookings 
       WHERE provider_id = $1 
       ORDER BY booking_date DESC, booking_time DESC 
       LIMIT $2 OFFSET $3`, [providerId, limit, offset]);
        const countResult = await database_ts_1.pool.query("SELECT COUNT(*) FROM bookings WHERE provider_id = $1", [providerId]);
        const bookings = result.rows.map(mapBookingRow);
        const total = parseInt(countResult.rows[0].count);
        const response = {
            data: bookings,
            pagination: { limit, offset, total },
        };
        res.status(200).json({
            success: true,
            data: response,
        });
    }
    catch (error) {
        console.error("Erreur lors de la récupération des réservations:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des réservations",
        });
    }
};
exports.getProviderBookings = getProviderBookings;
/**
 * Obtenir une réservation par ID
 * GET /api/bookings/:id
 */
const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const userRole = req.user?.role;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Non autorisé",
            });
            return;
        }
        // Obtenir la réservation
        const result = await database_ts_1.pool.query("SELECT * FROM bookings WHERE id = $1", [
            id,
        ]);
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "Réservation non trouvée",
            });
            return;
        }
        const booking = result.rows[0];
        // Vérifier l'autorisation
        if (userRole !== "admin" && booking.client_id !== userId) {
            // Pour les prestataires, vérifier qu'ils sont le prestataire de la réservation
            if (userRole === "prestataire") {
                const profileResult = await database_ts_1.pool.query("SELECT id FROM provider_profiles WHERE user_id = $1", [userId]);
                if (profileResult.rows.length === 0 ||
                    profileResult.rows[0].id !== booking.provider_id) {
                    res.status(403).json({
                        success: false,
                        message: "Accès refusé",
                    });
                    return;
                }
            }
            else {
                res.status(403).json({
                    success: false,
                    message: "Accès refusé",
                });
                return;
            }
        }
        res.status(200).json({
            success: true,
            data: mapBookingRow(booking),
        });
    }
    catch (error) {
        console.error("Erreur lors de la récupération de la réservation:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération de la réservation",
        });
    }
};
exports.getBookingById = getBookingById;
/**
 * Mettre à jour le statut d'une réservation
 * PUT /api/bookings/:id/status
 */
exports.updateBookingStatus = [
    (0, validate_ts_1.validateParams)(zod_1.z.object({ id: zod_1.z.string().uuid() })),
    (0, validate_ts_1.validateBody)(schemas_ts_1.updateBookingStatusSchema),
    async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user?.id;
            const userRole = req.user?.role;
            const { status } = req.body;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: "Non autorisé",
                });
                return;
            }
            // Obtenir la réservation
            const result = await database_ts_1.pool.query("SELECT * FROM bookings WHERE id = $1", [
                id,
            ]);
            if (result.rows.length === 0) {
                res.status(404).json({
                    success: false,
                    message: "Réservation non trouvée",
                });
                return;
            }
            const booking = result.rows[0];
            // Vérifier l'autorisation
            let isAuthorized = false;
            if (userRole === "admin") {
                isAuthorized = true;
            }
            else if (userRole === "prestataire") {
                // Vérifier que le prestataire est celui de la réservation
                const profileResult = await database_ts_1.pool.query("SELECT id FROM provider_profiles WHERE user_id = $1", [userId]);
                if (profileResult.rows.length > 0 &&
                    profileResult.rows[0].id === booking.provider_id) {
                    isAuthorized = true;
                }
            }
            else if (userRole === "client" && booking.client_id === userId) {
                // Le client peut annuler sa propre réservation
                if (status === "cancelled") {
                    isAuthorized = true;
                }
            }
            if (!isAuthorized) {
                res.status(403).json({
                    success: false,
                    message: "Accès refusé",
                });
                return;
            }
            // Mettre à jour le statut
            const updateResult = await database_ts_1.pool.query("UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *", [status, id]);
            res.status(200).json({
                success: true,
                message: "Statut mis à jour avec succès",
                data: mapBookingRow(updateResult.rows[0]),
            });
        }
        catch (error) {
            console.error("Erreur lors de la mise à jour du statut:", error);
            res.status(500).json({
                success: false,
                message: "Erreur lors de la mise à jour du statut",
            });
        }
    },
];
/**
 * Annuler une réservation
 * DELETE /api/bookings/:id
 */
const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Non autorisé",
            });
            return;
        }
        // Vérifier que la réservation existe et appartient à l'utilisateur
        const result = await database_ts_1.pool.query("SELECT * FROM bookings WHERE id = $1", [
            id,
        ]);
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "Réservation non trouvée",
            });
            return;
        }
        const booking = result.rows[0];
        // Seul le client ou le prestataire peut annuler
        if (booking.client_id !== userId) {
            const profileResult = await database_ts_1.pool.query("SELECT id FROM provider_profiles WHERE user_id = $1", [userId]);
            if (profileResult.rows.length === 0 ||
                profileResult.rows[0].id !== booking.provider_id) {
                res.status(403).json({
                    success: false,
                    message: "Accès refusé",
                });
                return;
            }
        }
        // Vérifier que la réservation peut être annulée
        if (!["pending", "confirmed"].includes(booking.status)) {
            res.status(400).json({
                success: false,
                message: "Cette réservation ne peut pas être annulée",
            });
            return;
        }
        // Mettre à jour le statut
        await database_ts_1.pool.query("UPDATE bookings SET status = $1 WHERE id = $2", [
            "cancelled",
            id,
        ]);
        res.status(200).json({
            success: true,
            message: "Réservation annulée avec succès",
        });
    }
    catch (error) {
        console.error("Erreur lors de l'annulation de la réservation:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de l'annulation de la réservation",
        });
    }
};
exports.cancelBooking = cancelBooking;
/**
 * Fonction utilitaire pour transformer une ligne de réservation en objet IBooking
 */
function mapBookingRow(row) {
    return {
        id: row.id,
        clientId: row.client_id,
        providerId: row.provider_id,
        serviceId: row.service_id,
        bookingDate: row.booking_date,
        bookingTime: row.booking_time,
        duration: row.duration,
        status: row.status,
        address: row.address,
        city: row.city,
        phone: row.phone,
        notes: row.notes,
        totalAmount: parseFloat(row.total_amount),
        paymentStatus: row.payment_status,
        createdAt: row.created_at,
    };
}
//# sourceMappingURL=BookingController.js.map
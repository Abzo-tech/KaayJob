"use strict";
/**
 * Service de réservations
 * Responsabilité: toute la logique métier liée aux réservations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelBooking = exports.updateBookingStatus = exports.getBookingById = exports.getProviderBookings = exports.getClientBookings = exports.createBooking = void 0;
const database_ts_1 = require(".//config/database.ts");
/**
 * Crée une nouvelle réservation
 */
const createBooking = async (userId, data) => {
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
    return mapBookingRow(result.rows[0]);
};
exports.createBooking = createBooking;
/**
 * Obtient les réservations d'un client
 */
const getClientBookings = async (userId, limit, offset) => {
    const result = await database_ts_1.pool.query(`SELECT * FROM bookings 
     WHERE client_id = $1 
     ORDER BY booking_date DESC, booking_time DESC 
     LIMIT $2 OFFSET $3`, [userId, limit, offset]);
    const countResult = await database_ts_1.pool.query("SELECT COUNT(*) FROM bookings WHERE client_id = $1", [userId]);
    return {
        data: result.rows.map(mapBookingRow),
        pagination: {
            limit,
            offset,
            total: parseInt(countResult.rows[0].count),
        },
    };
};
exports.getClientBookings = getClientBookings;
/**
 * Obtient les réservations d'un prestataire
 */
const getProviderBookings = async (providerId, limit, offset) => {
    const result = await database_ts_1.pool.query(`SELECT * FROM bookings 
     WHERE provider_id = $1 
     ORDER BY booking_date DESC, booking_time DESC 
     LIMIT $2 OFFSET $3`, [providerId, limit, offset]);
    const countResult = await database_ts_1.pool.query("SELECT COUNT(*) FROM bookings WHERE provider_id = $1", [providerId]);
    return {
        data: result.rows.map(mapBookingRow),
        pagination: {
            limit,
            offset,
            total: parseInt(countResult.rows[0].count),
        },
    };
};
exports.getProviderBookings = getProviderBookings;
/**
 * Obtient une réservation par ID
 */
const getBookingById = async (id) => {
    const result = await database_ts_1.pool.query("SELECT * FROM bookings WHERE id = $1", [id]);
    if (result.rows.length === 0)
        return null;
    return mapBookingRow(result.rows[0]);
};
exports.getBookingById = getBookingById;
/**
 * Met à jour le statut d'une réservation
 */
const updateBookingStatus = async (id, status) => {
    const result = await database_ts_1.pool.query("UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *", [status, id]);
    return mapBookingRow(result.rows[0]);
};
exports.updateBookingStatus = updateBookingStatus;
/**
 * Annule une réservation
 */
const cancelBooking = async (id) => {
    await database_ts_1.pool.query("UPDATE bookings SET status = $1 WHERE id = $2", [
        "cancelled",
        id,
    ]);
};
exports.cancelBooking = cancelBooking;
/**
 * Mappe une ligne SQL en objet IBooking
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
//# sourceMappingURL=BookingService.js.map
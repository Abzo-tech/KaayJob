"use strict";
/**
 * Service d'avis
 * Responsabilité: logique métier liée aux avis
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProviderReviews = exports.createReview = void 0;
const database_ts_1 = require(".//config/database.ts");
/**
 * Crée un nouvel avis
 */
const createReview = async (data, clientId) => {
    // Vérifier que la réservation existe et appartient au client
    const bookingResult = await database_ts_1.pool.query("SELECT * FROM bookings WHERE id = $1 AND client_id = $2 AND status = $3", [data.bookingId, clientId, "completed"]);
    if (bookingResult.rows.length === 0) {
        throw new Error("Réservation non trouvée ou non éligible pour un avis");
    }
    const booking = bookingResult.rows[0];
    // Vérifier qu'un avis n'existe pas déjà
    const existingReview = await database_ts_1.pool.query("SELECT id FROM reviews WHERE booking_id = $1", [data.bookingId]);
    if (existingReview.rows.length > 0) {
        throw new Error("Un avis existe déjà pour cette réservation");
    }
    // Créer l'avis
    const result = await database_ts_1.pool.query(`INSERT INTO reviews (booking_id, client_id, provider_id, rating, comment, is_verified)
     VALUES ($1, $2, $3, $4, $5, true)
     RETURNING *`, [
        data.bookingId,
        clientId,
        booking.provider_id,
        data.rating,
        data.comment || null,
    ]);
    // Mettre à jour la note du prestataire
    await updateProviderRating(booking.provider_id);
    return mapReviewRow(result.rows[0]);
};
exports.createReview = createReview;
/**
 * Obtient les avis d'un prestataire
 */
const getProviderReviews = async (providerId, limit = 10, offset = 0) => {
    const result = await database_ts_1.pool.query(`SELECT * FROM reviews WHERE provider_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`, [providerId, limit, offset]);
    const countResult = await database_ts_1.pool.query("SELECT COUNT(*) FROM reviews WHERE provider_id = $1", [providerId]);
    return {
        data: result.rows.map(mapReviewRow),
        total: parseInt(countResult.rows[0].count),
    };
};
exports.getProviderReviews = getProviderReviews;
/**
 * Met à jour la note d'un prestataire
 */
const updateProviderRating = async (providerId) => {
    await database_ts_1.pool.query(`UPDATE provider_profiles 
     SET rating = (SELECT AVG(rating) FROM reviews WHERE provider_id = $1),
         total_reviews = (SELECT COUNT(*) FROM reviews WHERE provider_id = $1)
     WHERE id = $1`, [providerId]);
};
function mapReviewRow(row) {
    return {
        id: row.id,
        bookingId: row.booking_id,
        clientId: row.client_id,
        providerId: row.provider_id,
        rating: row.rating,
        comment: row.comment,
        isVerified: row.is_verified,
        createdAt: row.created_at,
    };
}
//# sourceMappingURL=ReviewService.js.map
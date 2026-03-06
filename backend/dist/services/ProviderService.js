"use strict";
/**
 * Service de prestataires
 * Responsabilité: toute la logique métier liée aux prestataires
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProviderProfile = exports.getProviderByUserId = exports.getProviderById = exports.getAllProviders = void 0;
const database_ts_1 = require(".//config/database.ts");
/**
 * Obtient tous les prestataires avec filtres
 */
const getAllProviders = async (filters, limit, offset) => {
    let query = `
    SELECT 
      pp.id, pp.user_id, pp.specialty, pp.bio, pp.hourly_rate, 
      pp.years_experience, pp.location, pp.is_available, pp.rating,
      pp.total_reviews, pp.total_bookings, pp.is_verified,
      u.first_name, u.last_name, u.avatar, u.email
    FROM provider_profiles pp
    JOIN users u ON pp.user_id = u.id
    WHERE u.is_active = true
  `;
    const params = [];
    let paramIndex = 1;
    if (filters.category) {
        query += ` AND pp.specialty ILIKE $${paramIndex++}`;
        params.push(`%${filters.category}%`);
    }
    if (filters.location) {
        query += ` AND pp.location ILIKE $${paramIndex++}`;
        params.push(`%${filters.location}%`);
    }
    if (filters.search) {
        query += ` AND (u.first_name ILIKE $${paramIndex++} OR u.last_name ILIike $${paramIndex++} OR pp.specialty ILIKE $${paramIndex++})`;
        params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }
    if (filters.minRating) {
        query += ` AND pp.rating >= $${paramIndex++}`;
        params.push(filters.minRating);
    }
    // Compter le total
    const countQuery = query.replace(/SELECT [\s\S]*?FROM/, "SELECT COUNT(*) FROM");
    const countResult = await database_ts_1.pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);
    // Ajouter ORDER, LIMIT, OFFSET
    query += ` ORDER BY pp.rating DESC, pp.total_bookings DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);
    const result = await database_ts_1.pool.query(query, params);
    return {
        data: result.rows.map(mapProviderRow),
        pagination: { limit, offset, total },
    };
};
exports.getAllProviders = getAllProviders;
/**
 * Obtient un prestataire par ID
 */
const getProviderById = async (id) => {
    const result = await database_ts_1.pool.query(`SELECT 
      pp.id, pp.user_id, pp.specialty, pp.bio, pp.hourly_rate, 
      pp.years_experience, pp.location, pp.is_available, pp.rating,
      pp.total_reviews, pp.total_bookings, pp.is_verified,
      u.first_name, u.last_name, u.avatar, u.email, u.phone
    FROM provider_profiles pp
    JOIN users u ON pp.user_id = u.id
    WHERE pp.id = $1 AND u.is_active = true`, [id]);
    if (result.rows.length === 0)
        return null;
    return mapProviderRow(result.rows[0]);
};
exports.getProviderById = getProviderById;
/**
 * Obtient le profil prestataire par userId
 */
const getProviderByUserId = async (userId) => {
    const result = await database_ts_1.pool.query(`SELECT 
      pp.id, pp.user_id, pp.specialty, pp.bio, pp.hourly_rate, 
      pp.years_experience, pp.location, pp.is_available, pp.rating,
      pp.total_reviews, pp.total_bookings, pp.is_verified,
      u.first_name, u.last_name, u.avatar, u.email, u.phone
    FROM provider_profiles pp
    JOIN users u ON pp.user_id = u.id
    WHERE pp.user_id = $1`, [userId]);
    if (result.rows.length === 0)
        return null;
    return mapProviderRow(result.rows[0]);
};
exports.getProviderByUserId = getProviderByUserId;
/**
 * Met à jour le profil prestataire
 */
const updateProviderProfile = async (userId, data) => {
    const updates = [];
    const values = [];
    let paramIndex = 1;
    if (data.specialty !== undefined) {
        updates.push(`specialty = $${paramIndex++}`);
        values.push(data.specialty);
    }
    if (data.bio !== undefined) {
        updates.push(`bio = $${paramIndex++}`);
        values.push(data.bio);
    }
    if (data.hourlyRate !== undefined) {
        updates.push(`hourly_rate = $${paramIndex++}`);
        values.push(data.hourlyRate);
    }
    if (data.yearsExperience !== undefined) {
        updates.push(`years_experience = $${paramIndex++}`);
        values.push(data.yearsExperience);
    }
    if (data.location !== undefined) {
        updates.push(`location = $${paramIndex++}`);
        values.push(data.location);
    }
    if (data.isAvailable !== undefined) {
        updates.push(`is_available = $${paramIndex++}`);
        values.push(data.isAvailable);
    }
    if (updates.length === 0) {
        throw new Error("Aucune donnée à mettre à jour");
    }
    values.push(userId);
    const result = await database_ts_1.pool.query(`UPDATE provider_profiles SET ${updates.join(", ")} 
     WHERE user_id = $${paramIndex} 
     RETURNING *`, values);
    if (result.rows.length === 0) {
        throw new Error("Profil prestataire non trouvé");
    }
    return mapProviderRow(result.rows[0]);
};
exports.updateProviderProfile = updateProviderProfile;
/**
 * Mappe une ligne SQL en objet IProviderProfile
 */
function mapProviderRow(row) {
    return {
        id: row.id,
        userId: row.user_id,
        specialty: row.specialty,
        bio: row.bio,
        hourlyRate: row.hourly_rate,
        yearsExperience: row.years_experience,
        location: row.location,
        isAvailable: row.is_available,
        rating: row.rating,
        totalReviews: row.total_reviews,
        totalBookings: row.total_bookings,
        isVerified: row.is_verified,
    };
}
//# sourceMappingURL=ProviderService.js.map
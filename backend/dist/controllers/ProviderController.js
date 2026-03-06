"use strict";
/**
 * Contrôleur des prestataires
 * Responsabilité unique: gérer les opérations des prestataires
 * Principe SOLID: Single Responsibility Principle (SRP)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMyProviderProfile = exports.getMyProviderProfile = exports.getProviderById = exports.getAllProviders = void 0;
const database_ts_1 = require(".//config/database.ts");
const schemas_ts_1 = require(".//validations/schemas.ts");
const validate_ts_1 = require(".//middleware/validate.ts");
/**
 * Obtenir tous les prestataires
 * GET /api/providers
 */
const getAllProviders = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const category = req.query.category;
        const location = req.query.location;
        const search = req.query.search;
        const minRating = req.query.minRating
            ? parseFloat(req.query.minRating)
            : undefined;
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
        if (category) {
            query += ` AND pp.specialty ILIKE $${paramIndex}`;
            params.push(`%${category}%`);
            paramIndex++;
        }
        if (location) {
            query += ` AND pp.location ILIKE $${paramIndex}`;
            params.push(`%${location}%`);
            paramIndex++;
        }
        if (search) {
            query += ` AND (u.first_name ILIKE $${paramIndex} OR u.last_name ILIKE $${paramIndex} OR pp.specialty ILIKE $${paramIndex})`;
            params.push(`%${search}%`);
            paramIndex++;
        }
        if (minRating) {
            query += ` AND pp.rating >= $${paramIndex}`;
            params.push(minRating);
            paramIndex++;
        }
        // Compter le total
        const countQuery = query.replace(/SELECT [\s\S]*?FROM/, "SELECT COUNT(*) FROM");
        const countResult = await database_ts_1.pool.query(countQuery, params);
        const total = parseInt(countResult.rows[0].count);
        // Ajouter ORDER, LIMIT, OFFSET
        query += ` ORDER BY pp.rating DESC, pp.total_bookings DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(limit, offset);
        const result = await database_ts_1.pool.query(query, params);
        const providers = result.rows.map((row) => ({
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
            firstName: row.first_name,
            lastName: row.last_name,
            avatar: row.avatar,
            email: row.email,
        }));
        res.status(200).json({
            success: true,
            data: {
                data: providers,
                pagination: { limit, offset, total },
            },
        });
    }
    catch (error) {
        console.error("Erreur lors de la récupération des prestataires:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des prestataires",
        });
    }
};
exports.getAllProviders = getAllProviders;
/**
 * Obtenir un prestataire par ID
 * GET /api/providers/:id
 */
const getProviderById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await database_ts_1.pool.query(`SELECT 
        pp.id, pp.user_id, pp.specialty, pp.bio, pp.hourly_rate, 
        pp.years_experience, pp.location, pp.is_available, pp.rating,
        pp.total_reviews, pp.total_bookings, pp.is_verified,
        u.first_name, u.last_name, u.avatar, u.email, u.phone
      FROM provider_profiles pp
      JOIN users u ON pp.user_id = u.id
      WHERE pp.id = $1 AND u.is_active = true`, [id]);
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "Prestataire non trouvé",
            });
            return;
        }
        const row = result.rows[0];
        const provider = {
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
            firstName: row.first_name,
            lastName: row.last_name,
            avatar: row.avatar,
            email: row.email,
            phone: row.phone,
        };
        // Obtenir les services du prestataire
        const servicesResult = await database_ts_1.pool.query(`SELECT id, name, description, price, price_type, duration, is_active
       FROM services WHERE provider_id = $1 AND is_active = true`, [id]);
        res.status(200).json({
            success: true,
            data: {
                ...provider,
                services: servicesResult.rows,
            },
        });
    }
    catch (error) {
        console.error("Erreur lors de la récupération du prestataire:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération du prestataire",
        });
    }
};
exports.getProviderById = getProviderById;
/**
 * Obtenir le profil du prestataire connecté
 * GET /api/providers/me
 */
const getMyProviderProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Non autorisé",
            });
            return;
        }
        const result = await database_ts_1.pool.query(`SELECT 
        pp.id, pp.user_id, pp.specialty, pp.bio, pp.hourly_rate, 
        pp.years_experience, pp.location, pp.is_available, pp.rating,
        pp.total_reviews, pp.total_bookings, pp.is_verified,
        u.first_name, u.last_name, u.avatar, u.email, u.phone
      FROM provider_profiles pp
      JOIN users u ON pp.user_id = u.id
      WHERE pp.user_id = $1`, [userId]);
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "Profil prestataire non trouvé",
            });
            return;
        }
        const row = result.rows[0];
        const provider = {
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
            firstName: row.first_name,
            lastName: row.last_name,
            avatar: row.avatar,
            email: row.email,
            phone: row.phone,
        };
        res.status(200).json({
            success: true,
            data: provider,
        });
    }
    catch (error) {
        console.error("Erreur lors de la récupération du profil:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération du profil",
        });
    }
};
exports.getMyProviderProfile = getMyProviderProfile;
/**
 * Mettre à jour le profil du prestataire
 * PUT /api/providers/me
 */
exports.updateMyProviderProfile = [
    (0, validate_ts_1.validateBody)(schemas_ts_1.updateProviderProfileSchema),
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
            // Construire la requête dynamiquement
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
                res.status(400).json({
                    success: false,
                    message: "Aucune donnée à mettre à jour",
                });
                return;
            }
            values.push(userId);
            const result = await database_ts_1.pool.query(`UPDATE provider_profiles SET ${updates.join(", ")} 
         WHERE user_id = $${paramIndex} 
         RETURNING *`, values);
            if (result.rows.length === 0) {
                res.status(404).json({
                    success: false,
                    message: "Profil prestataire non trouvé",
                });
                return;
            }
            const row = result.rows[0];
            res.status(200).json({
                success: true,
                message: "Profil mis à jour avec succès",
                data: {
                    id: row.id,
                    userId: row.user_id,
                    specialty: row.specialty,
                    bio: row.bio,
                    hourlyRate: row.hourly_rate,
                    yearsExperience: row.years_experience,
                    location: row.location,
                    isAvailable: row.is_available,
                },
            });
        }
        catch (error) {
            console.error("Erreur lors de la mise à jour du profil:", error);
            res.status(500).json({
                success: false,
                message: "Erreur lors de la mise à jour du profil",
            });
        }
    },
];
//# sourceMappingURL=ProviderController.js.map
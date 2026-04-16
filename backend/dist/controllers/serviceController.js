"use strict";
/**
 * Contrôleur pour les services
 * Gère les opérations CRUD sur les services
 * Utilise Prisma pour les opérations数据库
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceController = void 0;
const database_1 = require("../config/database");
const normalizePriceTypeInput = (priceType) => {
    return (priceType?.toUpperCase()) || "FIXED";
};
const normalizeServiceOutput = (service) => ({
    ...service,
    priceType: service.priceType ? service.priceType.toLowerCase() : service.priceType,
});
class ServiceController {
    /**
      * Liste des services avec filtres et pagination
      */
    static async getAll(req, res) {
        try {
            const { category, provider, search, page = 1, limit = 12, minPrice, maxPrice, } = req.query;
            const parsedLimit = Number(limit);
            const parsedPage = Number(page);
            const offset = (parsedPage - 1) * parsedLimit;
            // Construire la requête SQL avec JOINs
            let sqlQuery = `
        SELECT
          s.id, s.name, s.description, s.price, s.price_type as "priceType",
          s.duration, s.is_active as "isActive", s.created_at as "createdAt",
          c.id as "categoryId", c.name as "categoryName", c.slug as "categorySlug",
          pp.id as "providerId", pp.user_id as "providerUserId",
          pp.rating as "providerRating", pp.total_reviews as "providerTotalReviews",
          pp.is_verified as "providerIsVerified",
          u.first_name as "providerFirstName", u.last_name as "providerLastName"
        FROM services s
        LEFT JOIN categories c ON s.category_id = c.id
        LEFT JOIN provider_profiles pp ON s.provider_id = pp.user_id
        LEFT JOIN users u ON pp.user_id = u.id
        WHERE s.is_active = true
      `;
            const params = [];
            let paramIndex = 1;
            // Filtres
            if (category) {
                sqlQuery += ` AND s.category_id = $${paramIndex}`;
                params.push(category);
                paramIndex++;
            }
            if (provider) {
                sqlQuery += ` AND s.provider_id = $${paramIndex}`;
                params.push(provider);
                paramIndex++;
            }
            if (search) {
                sqlQuery += ` AND (s.name ILIKE $${paramIndex} OR s.description ILIKE $${paramIndex})`;
                params.push(`%${search}%`);
                paramIndex++;
            }
            if (minPrice) {
                sqlQuery += ` AND s.price >= $${paramIndex}`;
                params.push(Number(minPrice));
                paramIndex++;
            }
            if (maxPrice) {
                sqlQuery += ` AND s.price <= $${paramIndex}`;
                params.push(Number(maxPrice));
                paramIndex++;
            }
            // Compter le total
            const countQuery = `SELECT COUNT(*) as count FROM (${sqlQuery}) as filtered_services`;
            const totalResult = await (0, database_1.query)(countQuery, params);
            const total = parseInt(totalResult.rows[0].count, 10);
            // Ajouter pagination et tri
            sqlQuery += ` ORDER BY s.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
            params.push(parsedLimit, offset);
            // Exécuter la requête
            const servicesResult = await (0, database_1.query)(sqlQuery, params);
            // Transformer les données
            const services = servicesResult.rows.map((row) => ({
                id: row.id,
                name: row.name,
                description: row.description,
                price: parseFloat(row.price),
                priceType: row.priceType?.toLowerCase(),
                duration: row.duration,
                isActive: row.isActive,
                createdAt: row.createdAt,
                category: row.categoryId ? {
                    id: row.categoryId,
                    name: row.categoryName,
                    slug: row.categorySlug,
                } : null,
                provider: row.providerId ? {
                    id: row.providerId,
                    userId: row.providerUserId,
                    rating: parseFloat(row.providerRating || '0'),
                    totalReviews: row.providerTotalReviews || 0,
                    isVerified: row.providerIsVerified,
                    user: {
                        id: row.providerUserId,
                        firstName: row.providerFirstName,
                        lastName: row.providerLastName,
                    },
                } : null,
            }));
            // Pagination info
            const totalFiltered = services.length;
            res.json({
                success: true,
                data: services.map((service) => normalizeServiceOutput(service)),
                pagination: {
                    page: parsedPage,
                    limit: parsedLimit,
                    total: total,
                    totalPages: Math.ceil(total / parsedLimit),
                },
            });
        }
        catch (error) {
            console.error("Erreur liste services:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
    /**
      * Obtenir un service par ID
      */
    static async getById(req, res) {
        try {
            const { id } = req.params;
            // Récupérer le service avec ses détails
            const serviceQuery = `
        SELECT
          s.id, s.name, s.description, s.price, s.price_type as "priceType",
          s.duration, s.is_active as "isActive", s.created_at as "createdAt",
          c.id as "categoryId", c.name as "categoryName", c.slug as "categorySlug",
          pp.id as "providerId", pp.user_id as "providerUserId",
          pp.rating as "providerRating", pp.total_reviews as "providerTotalReviews",
          pp.is_verified as "providerIsVerified",
          u.first_name as "providerFirstName", u.last_name as "providerLastName",
          u.email as "providerEmail", u.avatar as "providerAvatar"
        FROM services s
        LEFT JOIN categories c ON s.category_id = c.id
        LEFT JOIN provider_profiles pp ON s.provider_id = pp.user_id
        LEFT JOIN users u ON pp.user_id = u.id
        WHERE s.id = $1 AND s.is_active = true
      `;
            const serviceResult = await (0, database_1.query)(serviceQuery, [id]);
            if (serviceResult.rows.length === 0) {
                res.status(404).json({ success: false, message: "Service non trouvé" });
                return;
            }
            const row = serviceResult.rows[0];
            const service = {
                id: row.id,
                name: row.name,
                description: row.description,
                price: parseFloat(row.price),
                priceType: row.priceType?.toLowerCase(),
                duration: row.duration,
                isActive: row.isActive,
                createdAt: row.createdAt,
                category: row.categoryId ? {
                    id: row.categoryId,
                    name: row.categoryName,
                    slug: row.categorySlug,
                } : null,
                provider: row.providerId ? {
                    id: row.providerId,
                    userId: row.providerUserId,
                    rating: parseFloat(row.providerRating || '0'),
                    totalReviews: row.providerTotalReviews || 0,
                    isVerified: row.providerIsVerified,
                    user: {
                        id: row.providerUserId,
                        firstName: row.providerFirstName,
                        lastName: row.providerLastName,
                        email: row.providerEmail,
                        avatar: row.providerAvatar,
                    },
                } : null,
            };
            // Récupérer les reviews du service
            const reviewsQuery = `
        SELECT
          r.id, r.rating, r.comment, r.created_at as "createdAt",
          u.first_name as "clientFirstName", u.last_name as "clientLastName",
          u.avatar as "clientAvatar"
        FROM reviews r
        LEFT JOIN users u ON r.client_id = u.id
        WHERE r.service_id = $1
        ORDER BY r.created_at DESC
        LIMIT 5
      `;
            const reviewsResult = await (0, database_1.query)(reviewsQuery, [id]);
            const reviews = reviewsResult.rows.map((reviewRow) => ({
                id: reviewRow.id,
                rating: reviewRow.rating,
                comment: reviewRow.comment,
                createdAt: reviewRow.createdAt,
                client: {
                    firstName: reviewRow.clientFirstName,
                    lastName: reviewRow.clientLastName,
                    avatar: reviewRow.clientAvatar,
                },
            }));
            res.json({
                success: true,
                data: {
                    ...normalizeServiceOutput(service),
                    reviews: reviews,
                },
            });
        }
        catch (error) {
            console.error("Erreur service par ID:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
    /**
      * Créer un nouveau service (prestataire)
      */
    static async create(req, res) {
        require('fs').appendFileSync('/tmp/debug.log', `ServiceController.create called\n`);
        try {
            const user = req.user;
            require('fs').appendFileSync('/tmp/debug.log', `Service create - User: ${JSON.stringify(user)}\n`);
            if (!user || (user.role?.toUpperCase() !== "PRESTATAIRE")) {
                require('fs').appendFileSync('/tmp/debug.log', `Service create - Role check failed: ${user?.role}\n`);
                res.status(403).json({ success: false, message: "Accès réservé aux prestataires" });
                return;
            }
            require('fs').appendFileSync('/tmp/debug.log', `Service create - Role check passed\n`);
            const { name, description, categoryId, price, priceType, duration } = req.body;
            // Validation des données
            require('fs').appendFileSync('/tmp/debug.log', `Service create - Validation data: ${JSON.stringify({ name, categoryId, price })}\n`);
            if (!name || !categoryId || !price) {
                require('fs').appendFileSync('/tmp/debug.log', `Service create - Validation failed\n`);
                res.status(400).json({
                    success: false,
                    message: "Nom, catégorie et prix sont requis"
                });
                return;
            }
            require('fs').appendFileSync('/tmp/debug.log', `Service create - Validation passed\n`);
            // Vérifier que le prestataire a un profil valide
            require('fs').appendFileSync('/tmp/debug.log', `Service create - Checking provider profile for user: ${user.id}\n`);
            const providerQuery = `
        SELECT pp.id, pp.user_id
        FROM provider_profiles pp
        WHERE pp.user_id = $1
      `;
            const providerResult = await (0, database_1.query)(providerQuery, [user.id]);
            require('fs').appendFileSync('/tmp/debug.log', `Service create - Provider profile result: ${providerResult.rows.length}\n`);
            if (providerResult.rows.length === 0) {
                require('fs').appendFileSync('/tmp/debug.log', `Service create - No provider profile found\n`);
                res.status(400).json({
                    success: false,
                    message: "Profil prestataire non trouvé. Veuillez compléter votre profil d'abord."
                });
                return;
            }
            require('fs').appendFileSync('/tmp/debug.log', `Service create - Provider profile found\n`);
            const provider = providerResult.rows[0];
            // Vérifier que la catégorie existe
            require('fs').appendFileSync('/tmp/debug.log', `Service create - Checking category: ${categoryId}\n`);
            const categoryQuery = `SELECT id FROM categories WHERE id = $1`;
            const categoryResult = await (0, database_1.query)(categoryQuery, [categoryId]);
            require('fs').appendFileSync('/tmp/debug.log', `Service create - Category result: ${categoryResult.rows.length}\n`);
            if (categoryResult.rows.length === 0) {
                require('fs').appendFileSync('/tmp/debug.log', `Service create - Category not found\n`);
                res.status(400).json({
                    success: false,
                    message: "Catégorie non trouvée"
                });
                return;
            }
            require('fs').appendFileSync('/tmp/debug.log', `Service create - All checks passed, creating service\n`);
            // Créer le service
            require('fs').appendFileSync('/tmp/debug.log', `Service create - Executing insert query\n`);
            const createQuery = `
        INSERT INTO services (
          id, provider_id, category_id, name, description, price, price_type, duration, is_active, created_at, updated_at
        )
        VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, true, NOW(), NOW()
        )
        RETURNING
          id, name, description, price, price_type as "priceType", duration, is_active as "isActive", created_at as "createdAt"
      `;
            const normalizedPriceType = normalizePriceTypeInput(priceType);
            require('fs').appendFileSync('/tmp/debug.log', `Service create - Params: ${JSON.stringify([provider.user_id, categoryId, name, description, price, normalizedPriceType, duration || 60])}\n`);
            const createResult = await (0, database_1.query)(createQuery, [
                provider.user_id,
                categoryId,
                name,
                description,
                price,
                normalizedPriceType,
                duration || 60
            ]);
            require('fs').appendFileSync('/tmp/debug.log', `Service create - Insert result: ${createResult.rows.length}\n`);
            const newService = createResult.rows[0];
            require('fs').appendFileSync('/tmp/debug.log', `Service create - New service created: ${JSON.stringify(newService)}\n`);
            // Récupérer les détails complets du service créé
            require('fs').appendFileSync('/tmp/debug.log', `Service create - Fetching complete service details for ID: ${newService.id}\n`);
            const serviceQuery = `
        SELECT
          s.id, s.name, s.description, s.price, s.price_type as "priceType",
          s.duration, s.is_active as "isActive", s.created_at as "createdAt",
          c.id as "categoryId", c.name as "categoryName", c.slug as "categorySlug",
          pp.id as "providerId", pp.user_id as "providerUserId",
          pp.rating as "providerRating", pp.total_reviews as "providerTotalReviews",
          pp.is_verified as "providerIsVerified",
          u.first_name as "providerFirstName", u.last_name as "providerLastName"
        FROM services s
        LEFT JOIN categories c ON s.category_id = c.id
        LEFT JOIN provider_profiles pp ON s.provider_id = pp.user_id
        LEFT JOIN users u ON pp.user_id = u.id
        WHERE s.id = $1
      `;
            const serviceResult = await (0, database_1.query)(serviceQuery, [newService.id]);
            require('fs').appendFileSync('/tmp/debug.log', `Service create - Service details query result: ${serviceResult.rows.length}\n`);
            const row = serviceResult.rows[0];
            require('fs').appendFileSync('/tmp/debug.log', `Service create - Service row: ${JSON.stringify(row)}\n`);
            const service = {
                id: row.id,
                name: row.name,
                description: row.description,
                price: parseFloat(row.price),
                priceType: row.priceType?.toLowerCase(),
                duration: row.duration,
                isActive: row.isActive,
                createdAt: row.createdAt,
                category: {
                    id: row.categoryId,
                    name: row.categoryName,
                    slug: row.categorySlug,
                },
                provider: {
                    id: row.providerId,
                    userId: row.providerUserId,
                    rating: parseFloat(row.providerRating || '0'),
                    totalReviews: row.providerTotalReviews || 0,
                    isVerified: row.providerIsVerified,
                    user: {
                        id: row.providerUserId,
                        firstName: row.providerFirstName,
                        lastName: row.providerLastName,
                    },
                },
            };
            res.status(201).json({
                success: true,
                message: "Service créé avec succès",
                data: normalizeServiceOutput(service)
            });
        }
        catch (error) {
            console.error("Erreur création service:", error);
            if (error.code === '23505') { // Violation de contrainte unique
                res.status(400).json({
                    success: false,
                    message: "Un service avec ce nom existe déjà pour ce prestataire"
                });
            }
            else {
                res.status(500).json({ success: false, message: "Erreur serveur" });
            }
        }
    }
    /**
      * Mettre à jour un service
      */
    static async update(req, res) {
        try {
            const { id } = req.params;
            const user = req.user;
            const updates = req.body;
            // Vérifier que le service existe et appartient au prestataire
            const existingQuery = `
        SELECT s.*, pp.user_id as provider_user_id
        FROM services s
        LEFT JOIN provider_profiles pp ON s.provider_id = pp.user_id
        WHERE s.id = $1
      `;
            const existingResult = await (0, database_1.query)(existingQuery, [id]);
            if (existingResult.rows.length === 0) {
                res.status(404).json({ success: false, message: "Service non trouvé" });
                return;
            }
            const existingService = existingResult.rows[0];
            // Vérifier que le service appartient au prestataire connecté
            if (existingService.provider_user_id !== user.id) {
                res.status(403).json({ success: false, message: "Accès non autorisé" });
                return;
            }
            // Construire la requête de mise à jour
            const updateFields = [];
            const updateValues = [];
            let paramIndex = 1;
            if (updates.name !== undefined) {
                updateFields.push(`name = $${paramIndex}`);
                updateValues.push(updates.name);
                paramIndex++;
            }
            if (updates.description !== undefined) {
                updateFields.push(`description = $${paramIndex}`);
                updateValues.push(updates.description);
                paramIndex++;
            }
            if (updates.categoryId !== undefined) {
                // Vérifier que la catégorie existe
                const categoryQuery = `SELECT id FROM categories WHERE id = $1`;
                const categoryResult = await (0, database_1.query)(categoryQuery, [updates.categoryId]);
                if (categoryResult.rows.length === 0) {
                    res.status(400).json({
                        success: false,
                        message: "Catégorie non trouvée"
                    });
                    return;
                }
                updateFields.push(`category_id = $${paramIndex}`);
                updateValues.push(updates.categoryId);
                paramIndex++;
            }
            if (updates.price !== undefined) {
                updateFields.push(`price = $${paramIndex}`);
                updateValues.push(updates.price);
                paramIndex++;
            }
            if (updates.priceType !== undefined) {
                const normalizedPriceType = normalizePriceTypeInput(updates.priceType);
                updateFields.push(`price_type = $${paramIndex}`);
                updateValues.push(normalizedPriceType);
                paramIndex++;
            }
            if (updates.duration !== undefined) {
                updateFields.push(`duration = $${paramIndex}`);
                updateValues.push(updates.duration);
                paramIndex++;
            }
            if (updates.isActive !== undefined) {
                updateFields.push(`is_active = $${paramIndex}`);
                updateValues.push(updates.isActive);
                paramIndex++;
            }
            if (updateFields.length === 0) {
                res.status(400).json({
                    success: false,
                    message: "Aucune donnée à mettre à jour"
                });
                return;
            }
            // Ajouter updated_at
            updateFields.push(`updated_at = NOW()`);
            // Exécuter la mise à jour
            const updateQuery = `
        UPDATE services
        SET ${updateFields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING
          id, name, description, price, price_type as "priceType",
          duration, is_active as "isActive", created_at as "createdAt", updated_at as "updatedAt"
      `;
            updateValues.push(id);
            const updateResult = await (0, database_1.query)(updateQuery, updateValues);
            const updatedService = updateResult.rows[0];
            // Récupérer les détails complets du service mis à jour
            const serviceQuery = `
        SELECT
          s.id, s.name, s.description, s.price, s.price_type as "priceType",
          s.duration, s.is_active as "isActive", s.created_at as "createdAt",
          c.id as "categoryId", c.name as "categoryName", c.slug as "categorySlug",
          pp.id as "providerId", pp.user_id as "providerUserId",
          pp.rating as "providerRating", pp.total_reviews as "providerTotalReviews",
          pp.is_verified as "providerIsVerified",
          u.first_name as "providerFirstName", u.last_name as "providerLastName"
        FROM services s
        LEFT JOIN categories c ON s.category_id = c.id
        LEFT JOIN provider_profiles pp ON s.provider_id = pp.user_id
        LEFT JOIN users u ON pp.user_id = u.id
        WHERE s.id = $1
      `;
            const serviceResult = await (0, database_1.query)(serviceQuery, [updatedService.id]);
            const row = serviceResult.rows[0];
            const service = {
                id: row.id,
                name: row.name,
                description: row.description,
                price: parseFloat(row.price),
                priceType: row.priceType?.toLowerCase(),
                duration: row.duration,
                isActive: row.isActive,
                createdAt: row.createdAt,
                category: row.categoryId ? {
                    id: row.categoryId,
                    name: row.categoryName,
                    slug: row.categorySlug,
                } : null,
                provider: {
                    id: row.providerId,
                    userId: row.providerUserId,
                    rating: parseFloat(row.providerRating || '0'),
                    totalReviews: row.providerTotalReviews || 0,
                    isVerified: row.providerIsVerified,
                    user: {
                        id: row.providerUserId,
                        firstName: row.providerFirstName,
                        lastName: row.providerLastName,
                    },
                },
            };
            require('fs').appendFileSync('/tmp/debug.log', `Service create - Final service object created\n`);
            const finalResult = normalizeServiceOutput(service);
            require('fs').appendFileSync('/tmp/debug.log', `Service create - Normalized result: ${JSON.stringify(finalResult)}\n`);
            require('fs').appendFileSync('/tmp/debug.log', `Service create - About to send response\n`);
            res.status(201).json({
                success: true,
                message: "Service créé avec succès",
                data: finalResult
            });
            require('fs').appendFileSync('/tmp/debug.log', `Service create - Response sent successfully\n`);
        }
        catch (error) {
            console.error("Erreur mise à jour service:", error);
            if (error.code === '23505') { // Violation de contrainte unique
                res.status(400).json({
                    success: false,
                    message: "Un service avec ce nom existe déjà pour ce prestataire"
                });
            }
            else {
                res.status(500).json({ success: false, message: "Erreur serveur" });
            }
        }
    }
    /**
      * Supprimer un service
      */
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const user = req.user;
            // Vérifier que le service existe et appartient au prestataire
            const existingQuery = `
        SELECT s.*, pp.user_id as provider_user_id
        FROM services s
        LEFT JOIN provider_profiles pp ON s.provider_id = pp.user_id
        WHERE s.id = $1
      `;
            const existingResult = await (0, database_1.query)(existingQuery, [id]);
            if (existingResult.rows.length === 0) {
                res.status(404).json({ success: false, message: "Service non trouvé" });
                return;
            }
            const existingService = existingResult.rows[0];
            // Vérifier que le service appartient au prestataire connecté
            if (existingService.provider_user_id !== user.id) {
                res.status(403).json({ success: false, message: "Accès non autorisé" });
                return;
            }
            // Vérifier s'il y a des réservations actives pour ce service
            const bookingsQuery = `
        SELECT COUNT(*) as count
        FROM bookings
        WHERE service_id = $1 AND status IN ('PENDING', 'CONFIRMED', 'IN_PROGRESS')
      `;
            const bookingsResult = await (0, database_1.query)(bookingsQuery, [id]);
            if (parseInt(bookingsResult.rows[0].count, 10) > 0) {
                res.status(400).json({
                    success: false,
                    message: "Impossible de supprimer ce service car il a des réservations actives"
                });
                return;
            }
            // Supprimer le service (soft delete en mettant is_active = false)
            const deleteQuery = `
        UPDATE services
        SET is_active = false, updated_at = NOW()
        WHERE id = $1
        RETURNING id
      `;
            await (0, database_1.query)(deleteQuery, [id]);
            res.json({
                success: true,
                message: "Service supprimé avec succès"
            });
        }
        catch (error) {
            console.error("Erreur suppression service:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
    /**
      * Obtenir les services d'un prestataire
      */
    static async getByProvider(req, res) {
        try {
            const { providerId } = req.params;
            const servicesQuery = `
        SELECT
          s.id, s.name, s.description, s.price, s.price_type as "priceType",
          s.duration, s.is_active as "isActive", s.created_at as "createdAt",
          c.id as "categoryId", c.name as "categoryName", c.slug as "categorySlug"
        FROM services s
        LEFT JOIN categories c ON s.category_id = c.id
        WHERE s.provider_id = $1 AND s.is_active = true
        ORDER BY s.created_at DESC
      `;
            const servicesResult = await (0, database_1.query)(servicesQuery, [providerId]);
            const services = servicesResult.rows.map((row) => ({
                id: row.id,
                name: row.name,
                description: row.description,
                price: parseFloat(row.price),
                priceType: row.priceType?.toLowerCase(),
                duration: row.duration,
                isActive: row.isActive,
                createdAt: row.createdAt,
                category: row.categoryId ? {
                    id: row.categoryId,
                    name: row.categoryName,
                    slug: row.categorySlug,
                } : null,
            }));
            res.json({
                success: true,
                data: services.map((service) => normalizeServiceOutput(service)),
            });
        }
        catch (error) {
            console.error("Erreur services par prestataire:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
}
exports.ServiceController = ServiceController;
exports.default = ServiceController;
//# sourceMappingURL=serviceController.js.map
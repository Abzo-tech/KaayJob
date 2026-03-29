"use strict";
/**
 * Routes des prestataires
 * Utilise le ProviderController pour la logique métier
 * Validations centralisées dans src/validations/index.ts
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const providerController_1 = __importDefault(require("../controllers/providerController"));
const auth_1 = require("../middleware/auth");
const validations_1 = require("../validations");
const database_1 = require("../config/database");
const prisma_1 = require("../config/prisma");
const notificationService_1 = require("../services/notificationService");
const router = (0, express_1.Router)();
// GET /api/providers - Liste des prestataires (public)
router.get("/", async (req, res) => {
    await providerController_1.default.getAll(req, res);
});
// POST /api/providers/setup-geolocation - Ajouter les colonnes de géolocalisation (migration manuelle)
router.post("/setup-geolocation", async (req, res) => {
    try {
        // Ajouter les colonnes de géolocalisation si elles n'existent pas
        await (0, database_1.query)(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS bio TEXT,
      ADD COLUMN IF NOT EXISTS specialization TEXT,
      ADD COLUMN IF NOT EXISTS address TEXT,
      ADD COLUMN IF NOT EXISTS zone TEXT,
      ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
      ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION
    `);
        // Migration : Mettre à jour les utilisateurs existants avec des valeurs par défaut
        await (0, database_1.query)(`
      UPDATE users
      SET bio = COALESCE(bio, ''),
             specialization = COALESCE(specialization, ''),
             address = COALESCE(address, ''),
             zone = COALESCE(zone, ''),
             latitude = COALESCE(latitude, NULL),
             longitude = COALESCE(longitude, NULL)
      WHERE bio IS NULL OR specialization IS NULL OR address IS NULL OR zone IS NULL
    `);
        // Insérer des données de test pour la démonstration
        const testProviders = [
            {
                id: 'test-provider-1',
                first_name: 'Ahmed',
                last_name: 'Diallo',
                email: 'ahmed@example.com',
                phone: '+22177123456',
                role: 'PRESTATAIRE',
                specialization: 'Plomberie',
                bio: 'Expert en réparation de fuites et installations sanitaires',
                address: 'Plateau, Dakar',
                zone: 'Centre-ville',
                latitude: 14.6937,
                longitude: -17.4441,
                is_verified: true
            },
            {
                id: 'test-provider-2',
                first_name: 'Fatou',
                last_name: 'Sow',
                email: 'fatou@example.com',
                phone: '+22177234567',
                role: 'PRESTATAIRE',
                specialization: 'Électricité',
                bio: 'Spécialiste en installations électriques et dépannages',
                address: 'Yoff, Dakar',
                zone: 'Nord',
                latitude: 14.7489,
                longitude: -17.4667,
                is_verified: true
            },
            {
                id: 'test-provider-3',
                first_name: 'Moussa',
                last_name: 'Ba',
                email: 'moussa@example.com',
                phone: '+22177345678',
                role: 'PRESTATAIRE',
                specialization: 'Menuiserie',
                bio: 'Artisan menuisier spécialisé dans les meubles sur mesure',
                address: 'Parcelles Assainies, Dakar',
                zone: 'Est',
                latitude: 14.7558,
                longitude: -17.4381,
                is_verified: false
            }
        ];
        // Insérer les prestataires de test
        for (const provider of testProviders) {
            // Vérifier si l'utilisateur existe déjà
            const existingUser = await (0, database_1.query)('SELECT id FROM users WHERE email = $1', [provider.email]);
            if (existingUser.rows.length === 0) {
                // Insérer l'utilisateur
                await (0, database_1.query)(`
          INSERT INTO users (
            id, email, password, first_name, last_name, phone, role,
            bio, specialization, address, zone, latitude, longitude,
            is_verified, created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW()
          )
        `, [
                    provider.id,
                    provider.email,
                    '$2b$10$hashedpassword', // mot de passe hashé fictif
                    provider.first_name,
                    provider.last_name,
                    provider.phone,
                    provider.role,
                    provider.bio,
                    provider.specialization,
                    provider.address,
                    provider.zone,
                    provider.latitude,
                    provider.longitude,
                    provider.is_verified
                ]);
                // Créer un profil prestataire
                await (0, database_1.query)(`
          INSERT INTO provider_profiles (
            id, user_id, hourly_rate, years_experience, is_available, created_at, updated_at
          ) VALUES (
            gen_random_uuid(), $1, $2, $3, true, NOW(), NOW()
          )
        `, [provider.id, Math.floor(Math.random() * 50) + 20, Math.floor(Math.random() * 15) + 2]);
            }
        }
        // Créer des profils prestataires pour les utilisateurs existants qui n'en ont pas
        const existingProviders = await (0, database_1.query)(`
      SELECT u.id, u.first_name, u.last_name, u.specialization
      FROM users u
      LEFT JOIN provider_profiles pp ON u.id = pp.user_id
      WHERE u.role = 'PRESTATAIRE' AND pp.id IS NULL
    `);
        let profilesCreated = 0;
        for (const provider of existingProviders.rows) {
            try {
                await (0, database_1.query)(`
          INSERT INTO provider_profiles (
            id, user_id, hourly_rate, years_experience, is_available, created_at, updated_at
          ) VALUES (
            gen_random_uuid(), $1, $2, $3, true, NOW(), NOW()
          )
        `, [
                    provider.id,
                    Math.floor(Math.random() * 50) + 20, // tarif horaire aléatoire
                    Math.floor(Math.random() * 15) + 2 // années d'expérience aléatoire
                ]);
                profilesCreated++;
            }
            catch (err) {
                console.error(`Erreur création profil pour ${provider.first_name}:`, err);
            }
        }
        res.json({
            success: true,
            message: "Configuration de géolocalisation terminée avec succès",
            testProviders: testProviders.length,
            profilesCreated,
            existingUsersMigrated: existingProviders.rows.length
        });
    }
    catch (error) {
        console.error("Erreur setup géolocalisation:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la configuration de la géolocalisation",
        });
    }
});
// GET /api/providers/map - Prestataires pour la carte (avec géolocalisation)
router.get("/map", async (req, res) => {
    try {
        const { category, lat, lng, radius = 50, limit = 100, availableOnly = true } = req.query;
        let queryStr = `
      SELECT
        u.id,
        u.first_name,
        u.last_name,
        u.avatar,
        u.specialization as specialty,
        u.bio,
        u.address as location,
        u.latitude,
        u.longitude,
        u.is_verified as "isVerified",
        COALESCE(pp.hourly_rate, 0) as "hourlyRate",
        COALESCE(pp.years_experience, 0) as "yearsExperience",
        u.created_at,
        CASE WHEN pp.availability->>'isAvailable' = 'true' THEN true ELSE false END as "isAvailable",
        COALESCE(rating_stats.avg_rating, 0) as rating,
        COALESCE(rating_stats.review_count, 0) as "totalReviews",
        0 as "totalBookings"
      FROM users u
      LEFT JOIN provider_profiles pp ON u.id = pp.user_id
      LEFT JOIN (
        SELECT
          p.user_id,
          AVG(r.rating) as avg_rating,
          COUNT(r.id) as review_count
        FROM provider_profiles p
        LEFT JOIN reviews r ON p.user_id = r.provider_id
        GROUP BY p.user_id
      ) rating_stats ON u.id = rating_stats.user_id
      WHERE u.role = 'PRESTATAIRE'
        AND u.latitude IS NOT NULL
        AND u.longitude IS NOT NULL
        AND EXISTS (
          SELECT 1 FROM services s
          WHERE s.provider_id = u.id AND s.is_active = true
        )
    `;
        const params = [];
        let paramIndex = 1;
        // Filtre par catégorie
        if (category && category !== 'all' && category !== '') {
            queryStr += ` AND u.specialization ILIKE $${paramIndex}`;
            params.push(`%${category}%`);
            paramIndex++;
        }
        // Filtre par disponibilité
        if (availableOnly === 'true') {
            queryStr += ` AND (pp.availability->>'isAvailable' = 'true' OR pp.availability IS NULL)`;
        }
        // Filtre par rayon si coordonnées fournies
        if (lat && lng) {
            const latitude = parseFloat(lat);
            const longitude = parseFloat(lng);
            const radiusKm = parseInt(radius) || 50;
            queryStr += `
        AND (
          6371 * acos(
            cos(radians($${paramIndex})) * cos(radians(u.latitude)) *
            cos(radians(u.longitude) - radians($${paramIndex + 1})) +
            sin(radians($${paramIndex})) * sin(radians(u.latitude))
          )
        ) <= $${paramIndex + 2}
      `;
            params.push(latitude, longitude, radiusKm);
            paramIndex += 3;
        }
        queryStr += `
      ORDER BY
        CASE WHEN pp.availability->>'isAvailable' = 'true' THEN 1 ELSE 2 END,
        COALESCE(rating_stats.avg_rating, 0) DESC
      LIMIT $${paramIndex}
    `;
        params.push(parseInt(limit) || 100);
        const result = await (0, database_1.query)(queryStr, params);
        const providers = result.rows.map((row) => ({
            id: row.id,
            userId: row.id,
            specialty: row.specialty,
            bio: row.bio,
            hourlyRate: parseFloat(row.hourlyRate) || undefined,
            yearsExperience: parseInt(row.yearsExperience) || undefined,
            location: row.location,
            latitude: parseFloat(row.latitude),
            longitude: parseFloat(row.longitude),
            isAvailable: row.isAvailable,
            rating: parseFloat(row.rating) || 0,
            totalReviews: parseInt(row.totalReviews) || 0,
            totalBookings: parseInt(row.totalBookings) || 0,
            isVerified: row.isVerified,
            user: {
                id: row.id,
                firstName: row.first_name,
                lastName: row.last_name,
                avatar: row.avatar,
            },
        }));
        res.json({
            success: true,
            data: providers,
            count: providers.length,
        });
    }
    catch (error) {
        console.error("Erreur récupération prestataires carte:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des prestataires",
        });
    }
});
// GET /api/providers/categories - Catégories disponibles
router.get("/categories", async (req, res) => {
    await providerController_1.default.getCategories(req, res);
});
// GET /api/providers/me - Profil du prestataire actuel (doit être avant /:id)
router.get("/me", auth_1.authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await (0, database_1.query)(`SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.role,
                u.bio, u.specialization, u.address, u.zone, u.avatar,
                u.is_verified, u.created_at,
                p.availability
         FROM users u
         LEFT JOIN provider_profiles p ON u.id = p.user_id
         WHERE u.id = $1`, [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Prestataire non trouvé" });
        }
        const provider = result.rows[0];
        res.json({
            success: true,
            data: {
                id: provider.id,
                email: provider.email,
                firstName: provider.first_name,
                lastName: provider.last_name,
                phone: provider.phone,
                role: provider.role,
                bio: provider.bio,
                specialization: provider.specialization,
                address: provider.address,
                zone: provider.zone,
                avatar: provider.avatar,
                isVerified: provider.is_verified,
                createdAt: provider.created_at,
                availability: provider.availability || null,
            },
        });
    }
    catch (error) {
        console.error("Erreur récupération profil:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
// GET /api/providers/me/dashboard - Tableau de bord prestataire
router.get("/me/dashboard", auth_1.authenticate, async (req, res) => {
    await providerController_1.default.getDashboard(req, res);
});
// GET /api/providers/:id - Profil d'un prestataire
router.get("/:id", async (req, res) => {
    await providerController_1.default.getById(req, res);
});
// GET /api/providers/:id/services - Services d'un prestataire
router.get("/:id/services", async (req, res) => {
    await providerController_1.default.getServices(req, res);
});
// GET /api/providers/:id/reviews - Avis d'un prestataire
router.get("/:id/reviews", async (req, res) => {
    await providerController_1.default.getReviews(req, res);
});
// PUT /api/providers/profile - Mettre à jour son profil (prestataire uniquement)
router.put("/profile", auth_1.authenticate, validations_1.updateProviderProfileValidation, async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    await providerController_1.default.updateProfile(req, res);
});
// PUT /api/providers/profile/location - Mettre à jour la localisation
router.put("/profile/location", auth_1.authenticate, [
    (0, express_validator_1.body)("latitude").optional().isFloat({ min: -90, max: 90 }).withMessage("Latitude invalide"),
    (0, express_validator_1.body)("longitude").optional().isFloat({ min: -180, max: 180 }).withMessage("Longitude invalide"),
    (0, express_validator_1.body)("address").optional().isString().withMessage("Adresse invalide"),
    (0, express_validator_1.body)("zone").optional().isString().withMessage("Zone invalide"),
    (0, express_validator_1.body)("specialization").optional().isString().withMessage("Spécialisation invalide"),
    (0, express_validator_1.body)("bio").optional().isString().withMessage("Bio invalide"),
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    const userId = req.user.id;
    const { latitude, longitude, address, zone, specialization, bio } = req.body;
    try {
        // Vérifier que l'utilisateur est un prestataire
        const userResult = await (0, database_1.query)("SELECT role FROM users WHERE id = $1", [userId]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
        }
        if (userResult.rows[0].role !== "PRESTATAIRE") {
            return res.status(403).json({ success: false, message: "Seuls les prestataires peuvent mettre à jour leur localisation" });
        }
        // Construire la requête de mise à jour dynamiquement
        const updateFields = [];
        const updateValues = [];
        let paramIndex = 1;
        if (latitude !== undefined) {
            updateFields.push(`latitude = $${paramIndex}`);
            updateValues.push(latitude);
            paramIndex++;
        }
        if (longitude !== undefined) {
            updateFields.push(`longitude = $${paramIndex}`);
            updateValues.push(longitude);
            paramIndex++;
        }
        if (address !== undefined) {
            updateFields.push(`address = $${paramIndex}`);
            updateValues.push(address);
            paramIndex++;
        }
        if (zone !== undefined) {
            updateFields.push(`zone = $${paramIndex}`);
            updateValues.push(zone);
            paramIndex++;
        }
        if (specialization !== undefined) {
            updateFields.push(`specialization = $${paramIndex}`);
            updateValues.push(specialization);
            paramIndex++;
        }
        if (bio !== undefined) {
            updateFields.push(`bio = $${paramIndex}`);
            updateValues.push(bio);
            paramIndex++;
        }
        // Toujours mettre à jour updated_at
        updateFields.push(`updated_at = NOW()`);
        if (updateFields.length > 1) { // Plus que juste updated_at
            const updateQuery = `
          UPDATE users
          SET ${updateFields.join(', ')}
          WHERE id = $${paramIndex}
        `;
            updateValues.push(userId);
            await (0, database_1.query)(updateQuery, updateValues);
        }
        // S'assurer qu'un profil prestataire existe
        const profileCheck = await (0, database_1.query)("SELECT id FROM provider_profiles WHERE user_id = $1", [userId]);
        if (profileCheck.rows.length === 0) {
            // Créer un profil prestataire si inexistant
            await (0, database_1.query)(`INSERT INTO provider_profiles (
            id, user_id, hourly_rate, years_experience, is_available, created_at, updated_at
          ) VALUES (
            gen_random_uuid(), $1, $2, $3, true, NOW(), NOW()
          )`, [userId, 25, 3] // Valeurs par défaut
            );
        }
        res.json({
            success: true,
            message: "Informations de géolocalisation mises à jour avec succès",
        });
    }
    catch (error) {
        console.error("Erreur mise à jour localisation:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
// PUT /api/providers/profile/availability - Mettre à jour la disponibilité
router.put("/profile/availability", auth_1.authenticate, [(0, express_validator_1.body)("availability").isObject().withMessage("Disponibilité invalide")], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    await providerController_1.default.updateAvailability(req, res);
});
// PUT /api/providers/profile/verification - Demander la vérification
router.post("/profile/verification", auth_1.authenticate, [(0, express_validator_1.body)("documents").isArray().withMessage("Documents requis")], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    const userId = req.user.id;
    // Obtenir les informations du prestataire
    const userResult = await (0, database_1.query)("SELECT first_name, last_name FROM users WHERE id = $1", [userId]);
    if (userResult.rows.length === 0) {
        return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }
    const user = userResult.rows[0];
    // Notifier les administrateurs de la demande de vérification (privé admin-prestataire)
    const admins = await (0, database_1.query)("SELECT id, role FROM users WHERE role = 'admin'", []);
    for (const admin of admins.rows) {
        await (0, notificationService_1.createFormattedNotification)({ id: admin.id, role: admin.role, firstName: "Admin", lastName: "" }, "Demande de vérification", `${user.first_name} ${user.last_name} a demandé la vérification de son profil.`, "info", "/admin/providers", [admin.id, userId], // Privé entre admin et prestataire
        {
            actor: { firstName: user.first_name, lastName: user.last_name, role: "PRESTATAIRE" }
        });
    }
    await providerController_1.default.requestVerification(req, res);
});
// GET /api/providers/me/stats - Statistiques prestataire
router.get("/me/stats", auth_1.authenticate, async (req, res) => {
    await providerController_1.default.getStats(req, res);
});
// GET /api/providers/me/subscription - Abonnement actuel du prestataire
router.get("/me/subscription", auth_1.authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        // Récupérer l'abonnement actuel
        const result = await (0, database_1.query)(`SELECT s.*, u.email, u.first_name, u.last_name
       FROM subscriptions s
       JOIN users u ON s.user_id = u.id
       WHERE s.user_id = $1
       ORDER BY s.created_at DESC
       LIMIT 1`, [userId]);
        if (result.rows.length === 0) {
            return res.json({
                success: true,
                data: null,
                message: "Aucun abonnement actif",
            });
        }
        res.json({
            success: true,
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error("Erreur abonnement:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
// POST /api/providers/me/subscription/subscribe - Souscrire à un abonnement
router.post("/me/subscription/subscribe", auth_1.authenticate, [
    (0, express_validator_1.body)("plan").notEmpty().withMessage("Plan requis"),
    (0, express_validator_1.body)("duration")
        .optional()
        .isInt({ min: 1, max: 12 })
        .withMessage("Durée invalide (1-12 mois)"),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        const userId = req.user.id;
        const { plan: planSlug, duration = 1, paymentMethod, phoneNumber, } = req.body;
        // Vérifier si l'utilisateur est un prestataire
        const userResult = await (0, database_1.query)("SELECT id, role FROM users WHERE id = $1", [userId]);
        if (userResult.rows.length === 0) {
            return res
                .status(404)
                .json({ success: false, message: "Utilisateur non trouvé" });
        }
        if (userResult.rows[0].role !== "PRESTATAIRE") {
            return res.status(403).json({
                success: false,
                message: "Seuls les prestataires peuvent s'abonner",
            });
        }
        // Récupérer le plan depuis la base de données
        let planPrice = 0;
        let planDuration = 30;
        try {
            const planData = await prisma_1.prisma.subscriptionPlan.findUnique({
                where: { slug: planSlug },
            });
            if (planData) {
                planPrice = Number(planData.price);
                planDuration = planData.duration;
            }
        }
        catch (e) {
            // Fallback vers les plans par défaut
            const defaultPrices = {
                gratuit: 0,
                premium: 9900,
                pro: 24900,
            };
            planPrice = defaultPrices[planSlug] || 0;
        }
        // Déterminer le statut de l'abonnement
        // Pour les plans gratuits, activer directement
        // Pour les plans payants, exiger une confirmation de paiement
        let subscriptionStatus = "active";
        if (planPrice > 0) {
            // Dans un vrai système, vérifier ici le paiement auprès du provider
            // Pour l'instant, on simule que le paiement est réussi si la méthode est fournie
            if (!paymentMethod) {
                return res.status(400).json({
                    success: false,
                    message: "Méthode de paiement requise pour les abonnements payants",
                });
            }
            // Le paiement est considéré comme réussi (simulation)
            subscriptionStatus = "active";
        }
        // Calculer les dates
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + planDuration);
        // Vérifier si un abonnement existe déjà
        const existingSub = await (0, database_1.query)("SELECT id FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1", [userId]);
        let result;
        if (existingSub.rows.length > 0) {
            // Mettre à jour l'abonnement existant
            result = await (0, database_1.query)(`UPDATE subscriptions 
           SET plan = $1, status = $2, start_date = $3, end_date = $4
           WHERE id = $5 
           RETURNING *`, [
                planSlug,
                subscriptionStatus,
                startDate,
                endDate,
                existingSub.rows[0].id,
            ]);
        }
        else {
            // Créer un nouvel abonnement
            result = await (0, database_1.query)(`INSERT INTO subscriptions (id, user_id, plan, status, start_date, end_date, created_at)
           VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW())
           RETURNING *`, [userId, planSlug, subscriptionStatus, startDate, endDate]);
        }
        // Enregistrer le paiement si fourni
        if (planPrice > 0 && paymentMethod) {
            await (0, database_1.query)(`INSERT INTO payments (id, user_id, amount, payment_method, status, created_at)
           VALUES (gen_random_uuid(), $1, $2, $3, 'PAID', NOW())`, [userId, planPrice, paymentMethod]);
            // Notifier le prestataire du paiement réussi
            await (0, notificationService_1.createNotification)(userId, "Paiement d'abonnement réussi", `Votre paiement de ${planPrice}€ pour l'abonnement ${planSlug.toUpperCase()} a été traité avec succès.`, "payment", "/prestataire/subscription");
        }
        const message = planPrice > 0
            ? `Paiement réussi ! Abonnement ${planSlug.toUpperCase()} activé`
            : `Abonnement ${planSlug.toUpperCase()} activé avec succès`;
        res.status(201).json({
            success: true,
            message,
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error("Erreur abonnement:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
// Plans d'abonnement disponibles (fallback)
const subscriptionPlans = [
    {
        id: "1",
        slug: "gratuit",
        name: "Gratuit",
        description: "Plan gratuit avec fonctionnalités de base",
        price: 0,
        duration: 0,
        features: [
            "5 services maximum",
            "Visibilité standard",
            "Support par email",
        ],
        isActive: true,
    },
    {
        id: "2",
        slug: "premium",
        name: "Premium",
        description: "Plan premium avec plus de visibilité",
        price: 9900,
        duration: 30,
        features: [
            "Services illimités",
            "Badge VIP",
            "Visibilité prioritaire",
            "Support prioritaire",
            "Statistiques avancées",
        ],
        isActive: true,
    },
    {
        id: "3",
        slug: "pro",
        name: "Pro",
        description: "Plan professionnel avec toutes les fonctionnalités",
        price: 24900,
        duration: 30,
        features: [
            "Tout Premium",
            "Publication en premier",
            "Badge Pro",
            "Formation exclusive",
            "Gestion équipe",
        ],
        isActive: true,
    },
];
// GET /api/providers/subscription/plans - Liste des plans disponibles
router.get("/subscription/plans", async (req, res) => {
    try {
        // Essayer de récupérer les plans depuis la base de données
        const plans = await prisma_1.prisma.subscriptionPlan.findMany({
            where: { isActive: true },
            orderBy: { displayOrder: "asc" },
        });
        if (plans.length > 0) {
            // Transformer les données pour le format attendu
            const formattedPlans = plans.map((p) => ({
                id: p.id,
                slug: p.slug,
                name: p.name,
                description: p.description,
                price: Number(p.price),
                duration: p.duration,
                features: typeof p.features === 'string' ? JSON.parse(p.features) : p.features || [],
                isActive: p.isActive,
            }));
            return res.json({
                success: true,
                data: formattedPlans,
            });
        }
        // Fallback vers les plans par défaut
        res.json({
            success: true,
            data: subscriptionPlans,
        });
    }
    catch (error) {
        console.error("Erreur récupération plans:", error);
        res.json({
            success: true,
            data: subscriptionPlans,
        });
    }
});
// GET /api/providers/me/subscription/history - Historique des abonnements
router.get("/me/subscription/history", auth_1.authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const history = await (0, database_1.query)(`SELECT s.*, sp.name as plan_name, sp.slug as plan_slug
         FROM subscriptions s
         LEFT JOIN subscription_plans sp ON s.plan = sp.slug
         WHERE s.user_id = $1
         ORDER BY s.created_at DESC
         LIMIT 10`, [userId]);
        res.json({
            success: true,
            data: history.rows,
        });
    }
    catch (error) {
        console.error("Erreur historique:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
// POST /api/providers/me/subscription/cancel - Annuler l'abonnement
router.post("/me/subscription/cancel", auth_1.authenticate, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Utilisateur non identifié" });
        }
        // Vérifier si l'utilisateur est un prestataire
        const userCheck = await (0, database_1.query)("SELECT role FROM users WHERE id = $1", [userId]);
        if (userCheck.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
        }
        if (userCheck.rows[0].role !== "PRESTATAIRE") {
            return res.status(403).json({ success: false, message: "Seuls les prestataires peuvent annuler leur abonnement" });
        }
        // Mettre à jour le statut de l'abonnement
        const result = await (0, database_1.query)(`UPDATE subscriptions
         SET status = 'cancelled'
         WHERE user_id = $1 AND status = 'active'
         RETURNING *`, [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Aucun abonnement actif à annuler",
            });
        }
        // Notifier les administrateurs de l'annulation d'abonnement (privé admin-prestataire)
        const admins = await (0, database_1.query)("SELECT id, role FROM users WHERE role = 'admin'", []);
        for (const admin of admins.rows) {
            await (0, notificationService_1.createFormattedNotification)({ id: admin.id, role: admin.role, firstName: "Admin", lastName: "" }, "Annulation d'abonnement", `${userCheck.rows[0].first_name} ${userCheck.rows[0].last_name} a annulé son abonnement.`, "warning", "/admin/subscriptions", [admin.id, userId], // Privé entre admin et prestataire
            {
                actor: { firstName: userCheck.rows[0].first_name, lastName: userCheck.rows[0].last_name, role: "PRESTATAIRE" }
            });
        }
        res.json({
            success: true,
            message: "Abonnement annulé avec succès",
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error("Erreur annulation:", error);
        res.status(500).json({ success: false, message: "Erreur serveur: " + error.message });
    }
});
// GET /api/providers/me/payments - Historique des paiements
router.get("/me/payments", auth_1.authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const payments = await (0, database_1.query)(`SELECT p.*, s.name as service_name
         FROM payments p
         LEFT JOIN bookings b ON p.booking_id = b.id
         LEFT JOIN services s ON b.service_id = s.id
         WHERE p.user_id = $1
         ORDER BY p.created_at DESC
         LIMIT 20`, [userId]);
        res.json({
            success: true,
            data: payments.rows,
        });
    }
    catch (error) {
        console.error("Erreur paiements:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
exports.default = router;
//# sourceMappingURL=providers.js.map
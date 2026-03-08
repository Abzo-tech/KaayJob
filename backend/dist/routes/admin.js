"use strict";
/**
 * Routes d'administration
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const prisma_1 = require("../config/prisma");
const database_1 = require("../config/database");
const auth_1 = require("../middleware/auth");
const notificationService_1 = require("../services/notificationService");
const router = (0, express_1.Router)();
// Toutes les routes admin nécessitent authentification et rôle admin
router.use(auth_1.authenticate);
router.use(auth_1.requireAdmin);
// GET /api/admin/stats - Statistiques globales
router.get("/stats", async (req, res) => {
    try {
        const usersResult = await (0, database_1.query)("SELECT COUNT(*) as total, role FROM users GROUP BY role");
        const bookingsResult = await (0, database_1.query)(`
      SELECT COUNT(*) as total,
             SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) as pending,
             SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completed,
             SUM(CASE WHEN status = 'CANCELLED' THEN 1 ELSE 0 END) as cancelled
      FROM bookings
    `);
        const revenueResult = await (0, database_1.query)(`
      SELECT COALESCE(SUM(total_amount), 0) as total_revenue
      FROM bookings
      WHERE status = 'COMPLETED'
    `);
        const providersResult = await (0, database_1.query)(`
      SELECT COUNT(*) as total,
             SUM(CASE WHEN is_verified = true THEN 1 ELSE 0 END) as verified
      FROM provider_profiles
    `);
        res.json({
            success: true,
            data: {
                users: usersResult.rows,
                bookings: bookingsResult.rows[0],
                revenue: parseFloat(revenueResult.rows[0].total_revenue),
                providers: providersResult.rows[0],
            },
        });
    }
    catch (error) {
        console.error("Erreur statistiques:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
// GET /api/admin/users - Liste des utilisateurs
router.get("/users", async (req, res) => {
    try {
        const { page = 1, limit = 20, role, search } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        let whereClause = "1=1";
        const params = [];
        let paramIndex = 1;
        if (role) {
            whereClause += ` AND role = ${paramIndex}`;
            params.push(role);
            paramIndex++;
        }
        if (search) {
            whereClause += ` AND (first_name ILIKE ${paramIndex} OR last_name ILIKE ${paramIndex} OR email ILIKE ${paramIndex})`;
            params.push(`%${search}%`);
            paramIndex++;
        }
        const countResult = await (0, database_1.query)(`SELECT COUNT(*) as count FROM users WHERE ${whereClause}`, params);
        const result = await (0, database_1.query)(`SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.role, u.created_at,
              COALESCE(pp.is_verified, false) as is_verified,
              (SELECT COUNT(*) FROM bookings WHERE client_id = u.id) as booking_count
       FROM users u
       LEFT JOIN provider_profiles pp ON u.id = pp.user_id
       WHERE ${whereClause}
       ORDER BY u.created_at DESC
       LIMIT ${Number(limit)} OFFSET ${offset}`, params);
        res.json({
            success: true,
            data: result.rows,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total: parseInt(countResult.rows[0].count),
            },
        });
    }
    catch (error) {
        console.error("Erreur liste utilisateurs:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
// PUT /api/admin/users/:id/verify - Vérifier un prestataire
router.put("/users/:id/verify", async (req, res) => {
    try {
        const { id } = req.params;
        // Vérifier si l'utilisateur est un prestataire
        const userCheck = await (0, database_1.query)("SELECT role, first_name, last_name FROM users WHERE id = $1", [id]);
        if (userCheck.rows.length === 0) {
            return res
                .status(404)
                .json({ success: false, message: "Utilisateur non trouvé" });
        }
        if (userCheck.rows[0].role !== "PRESTATAIRE") {
            return res.status(400).json({
                success: false,
                message: "Cet utilisateur n'est pas un prestataire",
            });
        }
        // Créer le provider_profile s'il n'existe pas, puis mettre à jour
        const existingProfile = await (0, database_1.query)("SELECT id FROM provider_profiles WHERE user_id = $1", [id]);
        let result;
        if (existingProfile.rows.length === 0) {
            // Créer le profil puis le vérifier
            result = await (0, database_1.query)("INSERT INTO provider_profiles (id, user_id, is_verified, created_at, updated_at) VALUES (gen_random_uuid(), $1, true, NOW(), NOW()) RETURNING *", [id]);
        }
        else {
            // Mettre à jour le profil existant
            result = await (0, database_1.query)("UPDATE provider_profiles SET is_verified = true, updated_at = NOW() WHERE user_id = $1 RETURNING *", [id]);
        }
        // Créer une notification pour le prestataire
        const userName = `${userCheck.rows[0].first_name} ${userCheck.rows[0].last_name}`;
        await (0, notificationService_1.createNotification)(id, "Compte vérifié", "Votre compte prestataire a été vérifié par l'administrateur. Vous pouvez maintenant offrir vos services sur la plateforme.", "success", "/prestataire/dashboard");
        // Créer une notification pour l'administrateur
        await (0, notificationService_1.createNotification)(req.user.id, "Prestataire vérifié", `${userName} a été vérifié avec succès`, "success", "/admin/users");
        res.json({
            success: true,
            message: "Prestataire vérifié",
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error("Erreur vérification:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
// DELETE /api/admin/users/:id
router.delete("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        // Étape 1: Trouver le profil prestataire si existant
        const profileResult = await (0, database_1.query)("SELECT id FROM provider_profiles WHERE user_id = $1", [id]);
        const profileId = profileResult.rows[0]?.id;
        // Étape 2: Supprimer les reviews où ce user est provider (contrainte NOT NULL sur provider_id)
        if (profileId) {
            await (0, database_1.query)("DELETE FROM reviews WHERE provider_id = $1", [profileId]);
        }
        // Étape 3: Supprimer les reviews où ce user est client
        await (0, database_1.query)("DELETE FROM reviews WHERE client_id = $1", [id]);
        // Étape 4: Supprimer d'abord les bookings liés aux services de ce provider
        await (0, database_1.query)("DELETE FROM bookings WHERE service_id IN (SELECT id FROM services WHERE provider_id = $1)", [id]);
        // Étape 5: Supprimer les bookings où l'utilisateur est client
        await (0, database_1.query)("DELETE FROM bookings WHERE client_id = $1", [id]);
        // Étape 6: Supprimer le profil prestataire
        await (0, database_1.query)("DELETE FROM provider_profiles WHERE user_id = $1", [id]);
        // Étape 7: Supprimer les services
        await (0, database_1.query)("DELETE FROM services WHERE provider_id = $1", [id]);
        // Finally delete the user
        await (0, database_1.query)("DELETE FROM users WHERE id = $1", [id]);
        // Créer une notification pour l'administrateur
        await (0, notificationService_1.createNotification)(req.user.id, "Utilisateur supprimé", `L'utilisateur a été supprimé avec succès`, "warning", "/admin/users");
        res.json({ success: true, message: "Utilisateur supprimé" });
    }
    catch (error) {
        console.error("Erreur suppression utilisateur:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
// POST /api/admin/users - Créer un utilisateur
router.post("/users", [
    (0, express_validator_1.body)("email").isEmail().withMessage("Email invalide"),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Mot de passe requis"),
    (0, express_validator_1.body)("firstName").notEmpty().withMessage("Prénom requis"),
    (0, express_validator_1.body)("lastName").notEmpty().withMessage("Nom requis"),
    (0, express_validator_1.body)("role")
        .optional()
        .isIn(["ADMIN", "CLIENT", "PRESTATAIRE"])
        .withMessage("Rôle invalide"),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).json({ success: false, errors: errors.array() });
        const { email, password, firstName, lastName, phone, role } = req.body;
        // Vérifier si l'email existe déjà
        const existingUser = await (0, database_1.query)("SELECT id FROM users WHERE email = $1", [email]);
        if (existingUser.rows.length > 0) {
            return res
                .status(400)
                .json({ success: false, message: "Email déjà utilisé" });
        }
        // Créer l'utilisateur avec un ID généré
        // Note: Le mot de passe est stocké en clair pour simplifier la gestion admin
        const result = await (0, database_1.query)(`INSERT INTO users (id, email, password, first_name, last_name, phone, role, is_active, is_verified, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, true, true, NOW(), NOW()) RETURNING id, email, first_name, last_name, phone, role, created_at`, [email, password, firstName, lastName, phone || null, role]);
        // Créer une notification pour le nouvel utilisateur
        await (0, notificationService_1.createNotification)(result.rows[0].id, "Bienvenue sur KaayJob", `Votre compte a été créé avec succès. Votre rôle: ${role || "CLIENT"}`, "success", role === "PRESTATAIRE" ? "/prestataire/dashboard" : "/client/dashboard");
        // Créer une notification pour l'administrateur
        await (0, notificationService_1.createNotification)(req.user.id, "Utilisateur créé", `${firstName} ${lastName} (${email}) a été créé avec succès`, "success", "/admin/users");
        res.status(201).json({
            success: true,
            message: "Utilisateur créé",
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error("Erreur création utilisateur:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
// PUT /api/admin/users/:id - Mettre à jour un utilisateur
router.put("/users/:id", [
    (0, express_validator_1.body)("email").optional().isEmail().withMessage("Email invalide"),
    (0, express_validator_1.body)("firstName").optional().notEmpty().withMessage("Prénom requis"),
    (0, express_validator_1.body)("lastName").optional().notEmpty().withMessage("Nom requis"),
    (0, express_validator_1.body)("role")
        .optional()
        .isIn(["ADMIN", "CLIENT", "PRESTATAIRE"])
        .withMessage("Rôle invalide"),
    (0, express_validator_1.body)("isActive")
        .optional()
        .isBoolean()
        .withMessage("Statut actif invalide"),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).json({ success: false, errors: errors.array() });
        const { id } = req.params;
        const { email, firstName, lastName, phone, role, isActive } = req.body;
        // Vérifier si l'utilisateur existe
        const existingUser = await (0, database_1.query)("SELECT id FROM users WHERE id = $1", [
            id,
        ]);
        if (existingUser.rows.length === 0) {
            return res
                .status(404)
                .json({ success: false, message: "Utilisateur non trouvé" });
        }
        // Vérifier si le nouvel email est déjà utilisé par un autre utilisateur
        if (email) {
            const emailExists = await (0, database_1.query)("SELECT id FROM users WHERE email = $1 AND id != $2", [email, id]);
            if (emailExists.rows.length > 0) {
                return res
                    .status(400)
                    .json({ success: false, message: "Email déjà utilisé" });
            }
        }
        const updates = [];
        const params = [];
        let paramIndex = 1;
        if (email) {
            updates.push(`email = $${paramIndex++}`);
            params.push(email);
        }
        if (firstName) {
            updates.push(`first_name = $${paramIndex++}`);
            params.push(firstName);
        }
        if (lastName) {
            updates.push(`last_name = $${paramIndex++}`);
            params.push(lastName);
        }
        if (phone !== undefined) {
            updates.push(`phone = $${paramIndex++}`);
            params.push(phone);
        }
        if (role) {
            updates.push(`role = $${paramIndex++}`);
            params.push(role);
        }
        if (isActive !== undefined) {
            updates.push(`is_active = $${paramIndex++}`);
            params.push(isActive);
        }
        if (updates.length === 0) {
            return res
                .status(400)
                .json({ success: false, message: "Aucune donnée à mettre à jour" });
        }
        updates.push(`updated_at = NOW()`);
        params.push(id);
        const result = await (0, database_1.query)(`UPDATE users SET ${updates.join(", ")} WHERE id = ${paramIndex} RETURNING id, email, first_name, last_name, phone, role, is_active, created_at`, params);
        // Créer une notification pour l'administrateur
        const userName = `${result.rows[0].first_name} ${result.rows[0].last_name}`;
        await (0, notificationService_1.createNotification)(req.user.id, "Utilisateur mis à jour", `${userName} a été mis à jour avec succès`, "info", "/admin/users");
        res.json({
            success: true,
            message: "Utilisateur mis à jour",
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error("Erreur mise à jour utilisateur:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
// GET /api/admin/services - Tous les services (using Prisma)
router.get("/services", async (req, res) => {
    try {
        const { page = 1, limit = 20, category } = req.query;
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const offset = (pageNum - 1) * limitNum;
        console.log("[AdminServices] Début de la requête - page:", pageNum, "limit:", limitNum);
        // Construction du where clause pour Prisma
        const where = {};
        if (category) {
            where.categoryId = category;
        }
        // Requête avec Prisma
        let services = [];
        let total = 0;
        try {
            [services, total] = await Promise.all([
                prisma_1.prisma.service.findMany({
                    where,
                    skip: offset,
                    take: limitNum,
                    orderBy: { createdAt: "desc" },
                    include: {
                        category: true,
                        provider: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                        email: true,
                                    },
                                },
                            },
                        },
                    },
                }),
                prisma_1.prisma.service.count({ where }),
            ]);
        }
        catch (prismaError) {
            console.error("[AdminServices] Erreur Prisma:", prismaError);
            // Si erreur avec les relations, essayer sans include
            console.log("[AdminServices] Retry sans relations...");
            services = await prisma_1.prisma.service.findMany({
                where,
                skip: offset,
                take: limitNum,
                orderBy: { createdAt: "desc" },
            });
            total = await prisma_1.prisma.service.count({ where });
        }
        // Transformation des données pour le format attendu par le frontend
        const transformedServices = services.map((s) => ({
            id: s.id,
            name: s.name,
            description: s.description,
            price: s.price,
            priceType: s.priceType,
            duration: s.duration,
            isActive: s.isActive,
            provider_id: s.providerId,
            category_id: s.categoryId,
            category_name: s.category?.name || null,
            first_name: s.provider?.user?.firstName || null,
            last_name: s.provider?.user?.lastName || null,
            provider_email: s.provider?.user?.email || null,
            created_at: s.createdAt,
            updated_at: s.updatedAt,
        }));
        console.log("[AdminServices] Services chargés:", transformedServices.length);
        res.json({
            success: true,
            data: transformedServices,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
            },
        });
    }
    catch (error) {
        console.error("[AdminServices] Erreur globale:", error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur",
            detail: error.message,
        });
    }
});
// PUT /api/admin/services/:id - Mettre à jour un service (using Prisma)
router.put("/services/:id", [
    (0, express_validator_1.body)("name").optional().notEmpty().withMessage("Nom requis"),
    (0, express_validator_1.body)("description").optional(),
    (0, express_validator_1.body)("price").optional().isNumeric().withMessage("Prix invalide"),
    (0, express_validator_1.body)("duration")
        .optional()
        .isInt({ min: 15 })
        .withMessage("Durée invalide"),
    (0, express_validator_1.body)("isActive").optional().isBoolean().withMessage("Statut invalide"),
], async (req, res) => {
    try {
        console.log("[UpdateService] Début - id:", req.params.id, "body:", req.body);
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            console.log("[UpdateService] Erreurs validation:", errors.array());
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        const { id } = req.params;
        const { name, description, price, duration, isActive, priceType } = req.body;
        // Vérifier si le service existe avec Prisma
        const existing = await prisma_1.prisma.service.findUnique({
            where: { id },
            include: { provider: true },
        });
        if (!existing) {
            console.log("[UpdateService] Service non trouvé:", id);
            return res
                .status(404)
                .json({ success: false, message: "Service non trouvé" });
        }
        // Préparer les données de mise à jour
        const updateData = {};
        if (name)
            updateData.name = name;
        if (description !== undefined)
            updateData.description = description;
        if (price !== undefined)
            updateData.price = parseFloat(price);
        if (duration !== undefined)
            updateData.duration = parseInt(duration);
        if (isActive !== undefined)
            updateData.isActive = isActive;
        if (priceType !== undefined)
            updateData.priceType = priceType;
        if (Object.keys(updateData).length === 0) {
            return res
                .status(400)
                .json({ success: false, message: "Aucune donnée à mettre à jour" });
        }
        console.log("[UpdateService] Exécution UPDATE avec Prisma:", updateData);
        // Mise à jour avec Prisma
        const result = await prisma_1.prisma.service.update({
            where: { id },
            data: updateData,
        });
        console.log("[UpdateService] Update réussi:", result);
        // Notifier le prestataire
        try {
            if (existing.providerId) {
                await (0, notificationService_1.createNotification)(existing.providerId, "Service mis à jour", `Votre service "${existing.name}" a été mis à jour par l'administrateur`, "info", "/prestataire/services");
            }
        }
        catch (notifError) {
            console.error("[UpdateService] Erreur notification prestataire:", notifError);
        }
        // Créer une notification pour l'administrateur
        try {
            await (0, notificationService_1.createNotification)(req.user.id, "Service mis à jour", `Le service a été mis à jour avec succès`, "info", "/admin/services");
        }
        catch (notifError) {
            console.error("[UpdateService] Erreur notification admin:", notifError);
        }
        res.json({
            success: true,
            message: "Service mis à jour",
            data: result,
        });
    }
    catch (error) {
        console.error("[UpdateService] Erreur globale:", error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur",
            detail: error.message,
        });
    }
});
// DELETE /api/admin/services/:id - Supprimer un service
router.delete("/services/:id", async (req, res) => {
    try {
        const { id } = req.params;
        // Vérifier si le service existe
        const existing = await (0, database_1.query)("SELECT id, name FROM services WHERE id = $1", [id]);
        if (existing.rows.length === 0) {
            return res
                .status(404)
                .json({ success: false, message: "Service non trouvé" });
        }
        // Vérifier si des réservations utilisent ce service
        const bookingsCount = await (0, database_1.query)("SELECT COUNT(*) as count FROM bookings WHERE service_id = $1", [id]);
        if (parseInt(bookingsCount.rows[0].count) > 0) {
            return res.status(400).json({
                success: false,
                message: "Impossible de supprimer ce service car il est utilisé par des réservations",
            });
        }
        await (0, database_1.query)("DELETE FROM services WHERE id = $1", [id]);
        // Récupérer le provider du service pour la notification
        const serviceResult = await (0, database_1.query)("SELECT provider_id, name FROM services WHERE id = $1", [id]);
        // Notifier le prestataire
        if (serviceResult.rows[0]?.provider_id) {
            await (0, notificationService_1.createNotification)(serviceResult.rows[0].provider_id, "Service supprimé", `Votre service "${serviceResult.rows[0].name}" a été supprimé par l'administrateur`, "warning", "/prestataire/services");
        }
        // Créer une notification pour l'administrateur
        await (0, notificationService_1.createNotification)(req.user.id, "Service supprimé", `Le service "${existing.rows[0].name}" a été supprimé avec succès`, "warning", "/admin/services");
        res.json({ success: true, message: "Service supprimé" });
    }
    catch (error) {
        console.error("Erreur suppression service:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
// GET /api/admin/bookings - Toutes les réservations
router.get("/bookings", async (req, res) => {
    try {
        const { page = 1, limit = 20, status, providerId, clientId } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        let whereClause = "1=1";
        const params = [];
        let paramIndex = 1;
        if (status) {
            whereClause += ` AND b.status = $${paramIndex}`;
            params.push(status);
            paramIndex++;
        }
        if (providerId) {
            whereClause += ` AND s.provider_id = $${paramIndex}`;
            params.push(providerId);
            paramIndex++;
        }
        if (clientId) {
            whereClause += ` AND b.client_id = $${paramIndex}`;
            params.push(clientId);
            paramIndex++;
        }
        const countResult = await (0, database_1.query)(`SELECT COUNT(*) as count FROM bookings b WHERE ${whereClause}`, params);
        // LIMIT et OFFSET utilisent des placeholders paramétrés dynamiques
        const limitParamIndex = paramIndex;
        const offsetParamIndex = paramIndex + 1;
        const result = await (0, database_1.query)(`SELECT b.*, u.first_name as client_first_name, u.last_name as client_last_name,
              s.name as service_name, p.first_name as provider_first_name, p.last_name as provider_last_name
       FROM bookings b
       JOIN users u ON b.client_id = u.id
       JOIN services s ON b.service_id = s.id
       JOIN users p ON s.provider_id = p.id
       WHERE ${whereClause}
       ORDER BY b.created_at DESC
       LIMIT $${limitParamIndex} OFFSET $${offsetParamIndex}`, [...params, Number(limit), offset]);
        res.json({
            success: true,
            data: result.rows,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total: parseInt(countResult.rows[0].count),
            },
        });
    }
    catch (error) {
        console.error("Erreur liste réservations:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
// PUT /api/admin/bookings/:id - Mettre à jour une réservation (using Prisma)
router.put("/bookings/:id", [
    (0, express_validator_1.body)("status")
        .optional()
        .isIn([
        "PENDING",
        "CONFIRMED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
        "REJECTED",
    ])
        .withMessage("Statut invalide: PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, REJECTED"),
    (0, express_validator_1.body)("paymentStatus")
        .optional()
        .isIn(["PENDING", "PAID", "REFUNDED"])
        .withMessage("Statut paiement invalide"),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).json({ success: false, errors: errors.array() });
        const { id } = req.params;
        const { status, paymentStatus, bookingDate, bookingTime, address, city, notes, } = req.body;
        // Vérifier si la réservation existe avec Prisma
        const existing = await prisma_1.prisma.booking.findUnique({
            where: { id },
            include: {
                service: {
                    include: { provider: true },
                },
                client: true,
            },
        });
        if (!existing) {
            return res
                .status(404)
                .json({ success: false, message: "Réservation non trouvée" });
        }
        // Préparer les données de mise à jour
        const updateData = {};
        if (status)
            updateData.status = status;
        if (paymentStatus)
            updateData.paymentStatus = paymentStatus;
        if (bookingDate)
            updateData.bookingDate = new Date(bookingDate);
        if (bookingTime)
            updateData.bookingTime = bookingTime;
        if (address !== undefined)
            updateData.address = address;
        if (city !== undefined)
            updateData.city = city;
        if (notes !== undefined)
            updateData.notes = notes;
        if (Object.keys(updateData).length === 0) {
            return res
                .status(400)
                .json({ success: false, message: "Aucune donnée à mettre à jour" });
        }
        // Mise à jour avec Prisma
        const result = await prisma_1.prisma.booking.update({
            where: { id },
            data: updateData,
        });
        // Créer une notification si le statut a changé
        if (status) {
            try {
                const statusMessages = {
                    CONFIRMED: "confirmée",
                    COMPLETED: "terminée",
                    CANCELLED: "annulée",
                    PENDING: "en attente",
                };
                // Notifier le client
                if (existing.clientId) {
                    await (0, notificationService_1.createNotification)(existing.clientId, "Statut de réservation mis à jour", `Votre réservation pour "${existing.service?.name || "un service"}" a été ${statusMessages[status] || "mise à jour"} par l'administrateur`, status === "CANCELLED" ? "error" : "success", "/client/bookings");
                }
                // Notifier le prestataire
                if (existing.service?.providerId) {
                    await (0, notificationService_1.createNotification)(existing.service.providerId, "Réservation mise à jour", `La réservation pour "${existing.service?.name || "un service"}" a été ${statusMessages[status] || "mise à jour"} par l'administrateur`, status === "CANCELLED" ? "error" : "success", "/prestataire/bookings");
                }
                // Notifier l'administrateur
                await (0, notificationService_1.createNotification)(req.user.id, "Réservation mise à jour", `La réservation #${id.slice(0, 8)} a été ${statusMessages[status] || "mise à jour"}`, status === "CANCELLED" ? "error" : "success", "/admin/bookings");
            }
            catch (notificationError) {
                console.error("Erreur création notifications:", notificationError);
            }
        }
        res.json({
            success: true,
            message: "Réservation mise à jour",
            data: result,
        });
    }
    catch (error) {
        console.error("Erreur mise à jour réservation:", error);
        res.status(500).json({ success: false, message: "Erreur serveur", detail: error.message });
    }
});
// DELETE /api/admin/bookings/:id - Supprimer une réservation
router.delete("/bookings/:id", async (req, res) => {
    try {
        const { id } = req.params;
        // Vérifier si la réservation existe
        const existing = await (0, database_1.query)("SELECT id FROM bookings WHERE id = $1", [id]);
        if (existing.rows.length === 0) {
            return res
                .status(404)
                .json({ success: false, message: "Réservation non trouvée" });
        }
        // Vérifier si la réservation est terminée (ne pas supprimer les réservations complétées)
        const booking = await (0, database_1.query)("SELECT status FROM bookings WHERE id = $1", [
            id,
        ]);
        if (booking.rows[0].status === "COMPLETED") {
            return res.status(400).json({
                success: false,
                message: "Impossible de supprimer une réservation terminée",
            });
        }
        // Supprimer les avis liés
        await (0, database_1.query)("DELETE FROM reviews WHERE booking_id = $1", [id]);
        await (0, database_1.query)("DELETE FROM bookings WHERE id = $1", [id]);
        res.json({ success: true, message: "Réservation supprimée" });
    }
    catch (error) {
        console.error("Erreur suppression réservation:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
// GET /api/admin/categories - Gestion des catégories (using Prisma)
router.get("/categories", async (req, res) => {
    try {
        const categories = await prisma_1.prisma.category.findMany({
            include: {
                _count: {
                    select: { services: true },
                },
            },
            orderBy: { name: "asc" },
        });
        // Transformation pour le format attendu
        const transformed = categories.map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description,
            icon: c.icon,
            image: c.image,
            isActive: c.isActive,
            displayOrder: c.displayOrder,
            service_count: c._count.services,
            created_at: c.createdAt,
        }));
        res.json({ success: true, data: transformed });
    }
    catch (error) {
        console.error("Erreur liste catégories:", error);
        res
            .status(500)
            .json({
            success: false,
            message: "Erreur serveur",
            detail: error.message,
        });
    }
});
// POST /api/admin/categories - Créer une catégorie
router.post("/categories", [
    (0, express_validator_1.body)("name").notEmpty().withMessage("Nom requis").isLength({ max: 50 }),
    (0, express_validator_1.body)("description").optional().isLength({ max: 200 }),
    (0, express_validator_1.body)("icon").optional().isLength({ max: 50 }),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).json({ success: false, errors: errors.array() });
        const { name, description, icon, image } = req.body;
        const result = await prisma_1.prisma.category.create({
            data: {
                name,
                slug: name.toLowerCase().replace(/\s+/g, "-"),
                description,
                icon,
                image,
            },
        });
        // Créer une notification pour l'administrateur
        await (0, notificationService_1.createNotification)(req.user.id, "Catégorie créée", `La catégorie "${name}" a été créée avec succès`, "success", "/admin/categories");
        res.status(201).json({
            success: true,
            message: "Catégorie créée",
            data: result,
        });
    }
    catch (error) {
        console.error("Erreur création catégorie:", error);
        res
            .status(500)
            .json({
            success: false,
            message: "Erreur serveur",
            detail: error.message,
        });
    }
});
// PUT /api/admin/categories/:id - Mettre à jour une catégorie (using Prisma)
router.put("/categories/:id", [
    (0, express_validator_1.body)("name")
        .optional()
        .notEmpty()
        .withMessage("Nom requis")
        .isLength({ max: 50 }),
    (0, express_validator_1.body)("description").optional().isLength({ max: 200 }),
    (0, express_validator_1.body)("icon").optional().isLength({ max: 50 }),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).json({ success: false, errors: errors.array() });
        const { id } = req.params;
        const { name, description, icon, image, isActive, displayOrder } = req.body;
        // Vérifier si la catégorie existe avec Prisma
        const existing = await prisma_1.prisma.category.findUnique({
            where: { id },
        });
        if (!existing) {
            return res
                .status(404)
                .json({ success: false, message: "Catégorie non trouvée" });
        }
        // Préparer les données de mise à jour
        const updateData = {};
        if (name)
            updateData.name = name;
        if (description !== undefined)
            updateData.description = description;
        if (icon !== undefined)
            updateData.icon = icon;
        if (image !== undefined)
            updateData.image = image;
        if (isActive !== undefined)
            updateData.isActive = isActive;
        if (displayOrder !== undefined)
            updateData.displayOrder = parseInt(displayOrder);
        if (Object.keys(updateData).length === 0) {
            return res
                .status(400)
                .json({ success: false, message: "Aucune donnée à mettre à jour" });
        }
        // Mise à jour avec Prisma
        const result = await prisma_1.prisma.category.update({
            where: { id },
            data: updateData,
        });
        // Créer une notification pour l'administrateur
        await (0, notificationService_1.createNotification)(req.user.id, "Catégorie mise à jour", `La catégorie a été mise à jour avec succès`, "info", "/admin/categories");
        res.json({
            success: true,
            message: "Catégorie mise à jour",
            data: result,
        });
    }
    catch (error) {
        console.error("Erreur mise à jour catégorie:", error);
        res
            .status(500)
            .json({
            success: false,
            message: "Erreur serveur",
            detail: error.message,
        });
    }
});
// DELETE /api/admin/categories/:id - Supprimer une catégorie (using Prisma)
router.delete("/categories/:id", async (req, res) => {
    try {
        const { id } = req.params;
        // Vérifier si la catégorie existe
        const existing = await prisma_1.prisma.category.findUnique({
            where: { id },
            include: {
                _count: { select: { services: true } },
            },
        });
        if (!existing) {
            return res
                .status(404)
                .json({ success: false, message: "Catégorie non trouvée" });
        }
        // Vérifier si des services utilisent cette catégorie
        if (existing._count.services > 0) {
            return res.status(400).json({
                success: false,
                message: "Impossible de supprimer cette catégorie car elle contient des services",
            });
        }
        await prisma_1.prisma.category.delete({
            where: { id },
        });
        // Créer une notification pour l'administrateur
        await (0, notificationService_1.createNotification)(req.user.id, "Catégorie supprimée", `La catégorie "${existing.name}" a été supprimée avec succès`, "warning", "/admin/categories");
        res.json({ success: true, message: "Catégorie supprimée" });
    }
    catch (error) {
        console.error("Erreur suppression catégorie:", error);
        res
            .status(500)
            .json({
            success: false,
            message: "Erreur serveur",
            detail: error.message,
        });
    }
});
// GET /api/admin/payments - Historique des paiements
router.get("/payments", async (req, res) => {
    try {
        const { page = 1, limit = 20, status } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        const result = await (0, database_1.query)(`SELECT p.*, u.first_name, u.last_name, b.total_amount as booking_amount
       FROM payments p
       JOIN users u ON p.user_id = u.id
       LEFT JOIN bookings b ON p.booking_id = b.id
       ORDER BY p.created_at DESC
       LIMIT $1 OFFSET $2`, [Number(limit), offset]);
        res.json({ success: true, data: result.rows });
    }
    catch (error) {
        console.error("Erreur liste paiements:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
// GET /api/admin/subscriptions - Liste des abonnements
router.get("/subscriptions", async (req, res) => {
    try {
        const { page = 1, limit = 20, status, plan } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        let whereClause = "1=1";
        const params = [];
        let paramIndex = 1;
        if (status) {
            whereClause += ` AND s.status = ${paramIndex}`;
            params.push(status);
            paramIndex++;
        }
        if (plan) {
            whereClause += ` AND s.plan = ${paramIndex}`;
            params.push(plan);
            paramIndex++;
        }
        const countResult = await (0, database_1.query)(`SELECT COUNT(*) as count FROM subscriptions s WHERE ${whereClause}`, params);
        const result = await (0, database_1.query)(`SELECT s.*, u.email, u.first_name, u.last_name
       FROM subscriptions s
       JOIN users u ON s.user_id = u.id
       WHERE ${whereClause}
       ORDER BY s.created_at DESC
       LIMIT ${paramIndex} OFFSET ${paramIndex + 1}`, [...params, Number(limit), offset]);
        res.json({
            success: true,
            data: result.rows,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total: parseInt(countResult.rows[0].count),
            },
        });
    }
    catch (error) {
        console.error("Erreur liste abonnements:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
// POST /api/admin/subscriptions - Créer un abonnement
router.post("/subscriptions", [
    (0, express_validator_1.body)("userId").notEmpty().withMessage("ID utilisateur requis"),
    (0, express_validator_1.body)("plan")
        .notEmpty()
        .withMessage("Plan requis")
        .isIn(["gratuit", "premium", "pro"])
        .withMessage("Plan invalide"),
    (0, express_validator_1.body)("duration")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Durée invalide"),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).json({ success: false, errors: errors.array() });
        const { userId, plan, duration } = req.body;
        // Vérifier si l'utilisateur existe
        const userExists = await (0, database_1.query)("SELECT id, role FROM users WHERE id = $1", [
            userId,
        ]);
        if (userExists.rows.length === 0) {
            return res
                .status(404)
                .json({ success: false, message: "Utilisateur non trouvé" });
        }
        // Vérifier si l'utilisateur est un prestataire
        if (userExists.rows[0].role !== "PRESTATAIRE") {
            return res.status(400).json({
                success: false,
                message: "Seuls les prestataires peuvent avoir un abonnement",
            });
        }
        // Calculer les dates
        const startDate = new Date();
        let endDate = new Date();
        if (plan === "gratuit") {
            // Pour le plan gratuit, pas de date d'expiration
            endDate = new Date("2099-12-31");
        }
        else {
            const months = duration || 1;
            endDate.setMonth(endDate.getMonth() + months);
        }
        // Vérifier si un abonnement existe déjà
        const existingSub = await (0, database_1.query)("SELECT id FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1", [userId]);
        let result;
        if (existingSub.rows.length > 0) {
            // Mettre à jour l'abonnement existant
            result = await (0, database_1.query)(`UPDATE subscriptions 
           SET plan = $1, status = 'active', start_date = $2, end_date = $3
           WHERE id = $4 
           RETURNING *`, [plan, startDate, endDate, existingSub.rows[0].id]);
        }
        else {
            // Créer un nouvel abonnement
            result = await (0, database_1.query)(`INSERT INTO subscriptions (id, user_id, plan, status, start_date, end_date, created_at)
           VALUES (gen_random_uuid(), $1, $2, 'active', $3, $4, NOW())
           RETURNING *`, [userId, plan, startDate, endDate]);
        }
        // Créer une notification pour le prestataire
        await (0, notificationService_1.createNotification)(userId, "Nouvel abonnement", `Votre abonnement ${plan.toUpperCase()} a été activé avec succès`, "success", "/prestataire/abonnement");
        // Créer une notification pour l'admin
        await (0, notificationService_1.createNotification)(req.user.id, "Abonnement créé", `Un abonnement ${plan.toUpperCase()} a été créé pour un prestataire`, "success", "/admin/subscriptions");
        res.status(201).json({
            success: true,
            message: "Abonnement créé avec succès",
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error("Erreur création abonnement:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
// PUT /api/admin/subscriptions/:id - Mettre à jour un abonnement
router.put("/subscriptions/:id", [
    (0, express_validator_1.body)("plan")
        .optional()
        .isIn(["gratuit", "premium", "pro"])
        .withMessage("Plan invalide"),
    (0, express_validator_1.body)("status")
        .optional()
        .isIn(["active", "expired", "cancelled", "pending"])
        .withMessage("Statut invalide"),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).json({ success: false, errors: errors.array() });
        const { id } = req.params;
        const { plan, status } = req.body;
        // Vérifier si l'abonnement existe
        const existing = await (0, database_1.query)("SELECT s.*, u.first_name, u.last_name FROM subscriptions s JOIN users u ON s.user_id = u.id WHERE s.id = $1", [id]);
        if (existing.rows.length === 0) {
            return res
                .status(404)
                .json({ success: false, message: "Abonnement non trouvé" });
        }
        const updates = [];
        const params = [];
        let paramIndex = 1;
        if (plan) {
            updates.push(`plan = ${paramIndex++}`);
            params.push(plan);
        }
        if (status) {
            updates.push(`status = ${paramIndex++}`);
            params.push(status);
        }
        if (updates.length === 0) {
            return res
                .status(400)
                .json({ success: false, message: "Aucune donnée à mettre à jour" });
        }
        params.push(id);
        const result = await (0, database_1.query)(`UPDATE subscriptions SET ${updates.join(", ")} WHERE id = ${paramIndex} RETURNING *`, params);
        // Notifier le prestataire si le statut a changé
        if (status && status !== existing.rows[0].status) {
            const statusMessages = {
                active: "activé",
                expired: "expiré",
                cancelled: "annulé",
                pending: "en attente",
            };
            await (0, notificationService_1.createNotification)(existing.rows[0].user_id, "Abonnement mis à jour", `Votre abonnement a été ${statusMessages[status]}`, status === "cancelled" ? "warning" : "info", "/prestataire/abonnement");
        }
        res.json({
            success: true,
            message: "Abonnement mis à jour",
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error("Erreur mise à jour abonnement:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
// PUT /api/admin/subscriptions/:id/renew - Renouveler un abonnement
router.put("/subscriptions/:id/renew", [
    (0, express_validator_1.body)("duration")
        .optional()
        .isInt({ min: 1, max: 12 })
        .withMessage("Durée invalide (1-12 mois)"),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).json({ success: false, errors: errors.array() });
        const { id } = req.params;
        const { duration = 1 } = req.body;
        // Vérifier si l'abonnement existe
        const existing = await (0, database_1.query)("SELECT s.*, u.first_name, u.last_name FROM subscriptions s JOIN users u ON s.user_id = u.id WHERE s.id = $1", [id]);
        if (existing.rows.length === 0) {
            return res
                .status(404)
                .json({ success: false, message: "Abonnement non trouvé" });
        }
        const sub = existing.rows[0];
        // Calculer la nouvelle date de fin
        let newEndDate = new Date(sub.end_date);
        if (newEndDate < new Date()) {
            // Si expiré, démarrer à partir d'aujourd'hui
            newEndDate = new Date();
        }
        newEndDate.setMonth(newEndDate.getMonth() + Number(duration));
        const result = await (0, database_1.query)(`UPDATE subscriptions 
         SET status = 'active', end_date = $1
         WHERE id = $2 
         RETURNING *`, [newEndDate, id]);
        // Notifier le prestataire
        await (0, notificationService_1.createNotification)(sub.user_id, "Abonnement renouvelé", `Votre abonnement a été renouvelé pour ${duration} mois`, "success", "/prestataire/abonnement");
        res.json({
            success: true,
            message: "Abonnement renouvelé avec succès",
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error("Erreur renouvellement:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
// DELETE /api/admin/subscriptions/:id - Annuler un abonnement
router.delete("/subscriptions/:id", async (req, res) => {
    try {
        const { id } = req.params;
        // Vérifier si l'abonnement existe
        const existing = await (0, database_1.query)("SELECT s.*, u.first_name, u.last_name FROM subscriptions s JOIN users u ON s.user_id = u.id WHERE s.id = $1", [id]);
        if (existing.rows.length === 0) {
            return res
                .status(404)
                .json({ success: false, message: "Abonnement non trouvé" });
        }
        // Mettre à jour le statut au lieu de supprimer
        await (0, database_1.query)("UPDATE subscriptions SET status = 'cancelled' WHERE id = $1", [id]);
        // Notifier le prestataire
        await (0, notificationService_1.createNotification)(existing.rows[0].user_id, "Abonnement annulé", "Votre abonnement a été annulé par l'administrateur", "error", "/prestataire/abonnement");
        res.json({ success: true, message: "Abonnement annulé" });
    }
    catch (error) {
        console.error("Erreur annulation abonnement:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
// GET /api/admin/analytics - Données analytiques
router.get("/analytics", async (req, res) => {
    try {
        // Monthly bookings - Using Prisma
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        // Get all bookings from the last 6 months
        const bookings = await prisma_1.prisma.booking.findMany({
            where: {
                createdAt: { gte: sixMonthsAgo }
            },
            select: {
                createdAt: true,
                totalAmount: true,
                status: true
            }
        });
        // Group by month
        const monthlyMap = new Map();
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
        for (let i = 0; i < 6; i++) {
            const d = new Date();
            d.setMonth(d.getMonth() - (5 - i));
            const monthKey = months[d.getMonth()];
            monthlyMap.set(monthKey, { bookings: 0, revenue: 0 });
        }
        bookings.forEach(booking => {
            const monthKey = months[booking.createdAt.getMonth()];
            const current = monthlyMap.get(monthKey);
            if (current) {
                current.bookings += 1;
                if (booking.status === 'COMPLETED') {
                    current.revenue += Number(booking.totalAmount) || 0;
                }
            }
        });
        const monthly = Array.from(monthlyMap.entries()).map(([month, data]) => ({
            month,
            bookings: data.bookings,
            revenue: data.revenue
        }));
        // Top providers - Using Prisma
        const completedBookings = await prisma_1.prisma.booking.findMany({
            where: { status: 'COMPLETED' },
            include: {
                service: {
                    include: {
                        provider: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        // Group bookings by provider
        const providerMap = new Map();
        completedBookings.forEach(booking => {
            const provider = booking.service?.provider;
            if (provider) {
                const providerId = provider.userId;
                const existing = providerMap.get(providerId);
                const revenue = Number(booking.totalAmount) || 0;
                if (existing) {
                    existing.bookings += 1;
                    existing.revenue += revenue;
                }
                else {
                    providerMap.set(providerId, {
                        firstName: provider.user.firstName,
                        lastName: provider.user.lastName,
                        bookings: 1,
                        revenue: revenue,
                        rating: Number(provider.rating) || 0
                    });
                }
            }
        });
        // Convert to array and sort by revenue
        const topProviders = Array.from(providerMap.entries())
            .map(([id, data]) => ({
            first_name: data.firstName,
            last_name: data.lastName,
            bookings: data.bookings,
            revenue: data.revenue,
            rating: data.rating
        }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);
        // Service categories - Using Prisma
        const categories = await prisma_1.prisma.category.findMany({
            include: {
                _count: {
                    select: { services: true }
                }
            },
            orderBy: {
                name: 'asc'
            }
        });
        const serviceCategories = categories.map(c => ({
            name: c.name,
            service_count: c._count.services
        }));
        // Recent activity - Get recent bookings
        const recentBookings = await prisma_1.prisma.booking.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: {
                client: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });
        const activity = recentBookings.map(b => ({
            type: 'booking',
            message: `${b.client.firstName} ${b.client.lastName}`,
            time: b.createdAt
        }));
        res.json({
            success: true,
            data: {
                monthly,
                topProviders,
                categories: serviceCategories,
                activity
            },
        });
    }
    catch (error) {
        console.error("Erreur analytiques:", error);
        res.status(500).json({ success: false, message: "Erreur serveur", detail: error.message });
    }
});
// POST /api/admin/notifications - Créer une notification pour un utilisateur
router.post("/notifications", [
    (0, express_validator_1.body)("userId").notEmpty().withMessage("ID utilisateur requis"),
    (0, express_validator_1.body)("title").notEmpty().withMessage("Titre requis"),
    (0, express_validator_1.body)("message").notEmpty().withMessage("Message requis"),
    (0, express_validator_1.body)("type")
        .optional()
        .isIn(["success", "error", "info", "warning"])
        .withMessage("Type invalide"),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).json({ success: false, errors: errors.array() });
        const { userId, title, message, type, link } = req.body;
        // Vérifier si l'utilisateur existe
        const userExists = await (0, database_1.query)("SELECT id FROM users WHERE id = $1", [
            userId,
        ]);
        if (userExists.rows.length === 0) {
            return res
                .status(404)
                .json({ success: false, message: "Utilisateur non trouvé" });
        }
        // Créer la notification
        await (0, database_1.query)("INSERT INTO notifications (id, user_id, title, message, type, link, created_at) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW())", [userId, title, message, type || "info", link || null]);
        res.status(201).json({
            success: true,
            message: "Notification créée",
        });
    }
    catch (error) {
        console.error("Erreur création notification:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
exports.default = router;
module.exports = router;
//# sourceMappingURL=admin.js.map
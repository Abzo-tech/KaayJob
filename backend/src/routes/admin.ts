/**
 * Routes d'administration
 */

import { Router, Response, Request } from "express";
import { body, validationResult } from "express-validator";
import { query } from "../config/database";
import { authenticate, requireAdmin, AuthRequest } from "../middleware/auth";

const router = Router();

// Toutes les routes admin nécessitent authentification et rôle admin
router.use(authenticate);
router.use(requireAdmin);

// GET /api/admin/stats - Statistiques globales
router.get("/stats", async (req: AuthRequest, res: Response) => {
  try {
    const usersResult = await query(
      "SELECT COUNT(*) as total, role FROM users GROUP BY role",
    );
    const bookingsResult = await query(`
      SELECT COUNT(*) as total,
             SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) as pending,
             SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completed,
             SUM(CASE WHEN status = 'CANCELLED' THEN 1 ELSE 0 END) as cancelled
      FROM bookings
    `);
    const revenueResult = await query(`
      SELECT COALESCE(SUM(total_amount), 0) as total_revenue
      FROM bookings
      WHERE status = 'COMPLETED'
    `);
    const providersResult = await query(`
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
  } catch (error) {
    console.error("Erreur statistiques:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// GET /api/admin/users - Liste des utilisateurs
router.get("/users", async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let whereClause = "1=1";
    const params: any[] = [];
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

    const countResult = await query(
      `SELECT COUNT(*) as count FROM users WHERE ${whereClause}`,
      params,
    );

    const result = await query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.role, u.created_at,
              COALESCE(pp.is_verified, false) as is_verified,
              (SELECT COUNT(*) FROM bookings WHERE client_id = u.id) as booking_count
       FROM users u
       LEFT JOIN provider_profiles pp ON u.id = pp.user_id
       WHERE ${whereClause}
       ORDER BY u.created_at DESC
       LIMIT ${Number(limit)} OFFSET ${offset}`,
      params,
    );

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: parseInt(countResult.rows[0].count),
      },
    });
  } catch (error) {
    console.error("Erreur liste utilisateurs:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// PUT /api/admin/users/:id/verify - Vérifier un prestataire
router.put("/users/:id/verify", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Vérifier si l'utilisateur est un prestataire
    const userCheck = await query("SELECT role FROM users WHERE id = $1", [id]);

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
    const existingProfile = await query(
      "SELECT id FROM provider_profiles WHERE user_id = $1",
      [id],
    );

    let result;
    if (existingProfile.rows.length === 0) {
      // Créer le profil puis le vérifier
      result = await query(
        "INSERT INTO provider_profiles (id, user_id, is_verified, created_at, updated_at) VALUES (gen_random_uuid(), $1, true, NOW(), NOW()) RETURNING *",
        [id],
      );
    } else {
      // Mettre à jour le profil existant
      result = await query(
        "UPDATE provider_profiles SET is_verified = true, updated_at = NOW() WHERE user_id = $1 RETURNING *",
        [id],
      );
    }

    res.json({
      success: true,
      message: "Prestataire vérifié",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Erreur vérification:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// DELETE /api/admin/users/:id
router.delete("/users/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Étape 1: Trouver le profil prestataire si existant
    const profileResult = await query(
      "SELECT id FROM provider_profiles WHERE user_id = $1",
      [id],
    );
    const profileId = profileResult.rows[0]?.id;

    // Étape 2: Supprimer les reviews où ce user est provider (contrainte NOT NULL sur provider_id)
    if (profileId) {
      await query("DELETE FROM reviews WHERE provider_id = $1", [profileId]);
    }

    // Étape 3: Supprimer les reviews où ce user est client
    await query("DELETE FROM reviews WHERE client_id = $1", [id]);

    // Étape 4: Supprimer d'abord les bookings liés aux services de ce provider
    await query(
      "DELETE FROM bookings WHERE service_id IN (SELECT id FROM services WHERE provider_id = $1)",
      [id],
    );

    // Étape 5: Supprimer les bookings où l'utilisateur est client
    await query("DELETE FROM bookings WHERE client_id = $1", [id]);

    // Étape 6: Supprimer le profil prestataire
    await query("DELETE FROM provider_profiles WHERE user_id = $1", [id]);

    // Étape 7: Supprimer les services
    await query("DELETE FROM services WHERE provider_id = $1", [id]);

    // Finally delete the user
    await query("DELETE FROM users WHERE id = $1", [id]);

    res.json({ success: true, message: "Utilisateur supprimé" });
  } catch (error) {
    console.error("Erreur suppression utilisateur:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// POST /api/admin/users - Créer un utilisateur
router.post(
  "/users",
  [
    body("email").isEmail().withMessage("Email invalide"),
    body("password").notEmpty().withMessage("Mot de passe requis"),
    body("firstName").notEmpty().withMessage("Prénom requis"),
    body("lastName").notEmpty().withMessage("Nom requis"),
    body("role")
      .optional()
      .isIn(["ADMIN", "CLIENT", "PRESTATAIRE"])
      .withMessage("Rôle invalide"),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });

      const { email, password, firstName, lastName, phone, role } = req.body;

      // Vérifier si l'email existe déjà
      const existingUser = await query(
        "SELECT id FROM users WHERE email = $1",
        [email],
      );
      if (existingUser.rows.length > 0) {
        return res
          .status(400)
          .json({ success: false, message: "Email déjà utilisé" });
      }

      // Créer l'utilisateur avec un ID généré
      // Note: Le mot de passe est stocké en clair pour simplifier la gestion admin
      const result = await query(
        `INSERT INTO users (id, email, password, first_name, last_name, phone, role, is_active, is_verified, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, true, true, NOW(), NOW()) RETURNING id, email, first_name, last_name, phone, role, created_at`,
        [email, password, firstName, lastName, phone || null, role],
      );

      res.status(201).json({
        success: true,
        message: "Utilisateur créé",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Erreur création utilisateur:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  },
);

// PUT /api/admin/users/:id - Mettre à jour un utilisateur
router.put(
  "/users/:id",
  [
    body("email").optional().isEmail().withMessage("Email invalide"),
    body("firstName").optional().notEmpty().withMessage("Prénom requis"),
    body("lastName").optional().notEmpty().withMessage("Nom requis"),
    body("role")
      .optional()
      .isIn(["ADMIN", "CLIENT", "PRESTATAIRE"])
      .withMessage("Rôle invalide"),
    body("isActive")
      .optional()
      .isBoolean()
      .withMessage("Statut actif invalide"),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });

      const { id } = req.params;
      const { email, firstName, lastName, phone, role, isActive } = req.body;

      // Vérifier si l'utilisateur existe
      const existingUser = await query("SELECT id FROM users WHERE id = $1", [
        id,
      ]);
      if (existingUser.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Utilisateur non trouvé" });
      }

      // Vérifier si le nouvel email est déjà utilisé par un autre utilisateur
      if (email) {
        const emailExists = await query(
          "SELECT id FROM users WHERE email = $1 AND id != $2",
          [email, id],
        );
        if (emailExists.rows.length > 0) {
          return res
            .status(400)
            .json({ success: false, message: "Email déjà utilisé" });
        }
      }

      const updates: string[] = [];
      const params: any[] = [];
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

      const result = await query(
        `UPDATE users SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING id, email, first_name, last_name, phone, role, is_active, created_at`,
        params,
      );

      res.json({
        success: true,
        message: "Utilisateur mis à jour",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Erreur mise à jour utilisateur:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  },
);

// GET /api/admin/services - Tous les services
router.get("/services", async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, category } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let whereClause = "1=1";
    const params: any[] = [];
    let paramIndex = 1;

    if (category) {
      whereClause += ` AND s.category_id = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    const countResult = await query(
      `SELECT COUNT(*) as count FROM services s WHERE ${whereClause}`,
      params,
    );

    // LIMIT et OFFSET utilisent des placeholders paramétrés dynamiques
    const limitParamIndex = paramIndex;
    const offsetParamIndex = paramIndex + 1;

    const result = await query(
      `SELECT s.*, c.name as category_name, u.first_name, u.last_name
       FROM services s
       LEFT JOIN categories c ON s.category_id = c.id
       LEFT JOIN users u ON s.provider_id = u.id
       WHERE ${whereClause}
       ORDER BY s.created_at DESC
       LIMIT ${limitParamIndex} OFFSET ${offsetParamIndex}`,
      [...params, Number(limit), offset],
    );

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: parseInt(countResult.rows[0].count),
      },
    });
  } catch (error) {
    console.error("Erreur liste services:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// PUT /api/admin/services/:id - Mettre à jour un service
router.put(
  "/services/:id",
  [
    body("name").optional().notEmpty().withMessage("Nom requis"),
    body("description").optional(),
    body("price").optional().isNumeric().withMessage("Prix invalide"),
    body("duration")
      .optional()
      .isInt({ min: 15 })
      .withMessage("Durée invalide"),
    body("isActive").optional().isBoolean().withMessage("Statut invalide"),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });

      const { id } = req.params;
      const { name, description, price, duration, isActive, priceType } =
        req.body;

      // Vérifier si le service existe
      const existing = await query("SELECT id FROM services WHERE id = $1", [
        id,
      ]);
      if (existing.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Service non trouvé" });
      }

      const updates: string[] = [];
      const params: any[] = [];
      let paramIndex = 1;

      if (name) {
        updates.push(`name = $${paramIndex++}`);
        params.push(name);
      }
      if (description !== undefined) {
        updates.push(`description = $${paramIndex++}`);
        params.push(description);
      }
      if (price !== undefined) {
        updates.push(`price = $${paramIndex++}`);
        params.push(price);
      }
      if (duration !== undefined) {
        updates.push(`duration = $${paramIndex++}`);
        params.push(duration);
      }
      if (isActive !== undefined) {
        updates.push(`is_active = $${paramIndex++}`);
        params.push(isActive);
      }
      if (priceType !== undefined) {
        updates.push(`price_type = $${paramIndex++}`);
        params.push(priceType);
      }

      if (updates.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Aucune donnée à mettre à jour" });
      }

      updates.push(`updated_at = NOW()`);
      params.push(id);

      const result = await query(
        `UPDATE services SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING *`,
        params,
      );

      res.json({
        success: true,
        message: "Service mis à jour",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Erreur mise à jour service:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  },
);

// DELETE /api/admin/services/:id - Supprimer un service
router.delete("/services/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Vérifier si le service existe
    const existing = await query("SELECT id FROM services WHERE id = $1", [id]);
    if (existing.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Service non trouvé" });
    }

    // Vérifier si des réservations utilisent ce service
    const bookingsCount = await query(
      "SELECT COUNT(*) as count FROM bookings WHERE service_id = $1",
      [id],
    );
    if (parseInt(bookingsCount.rows[0].count) > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Impossible de supprimer ce service car il est utilisé par des réservations",
      });
    }

    await query("DELETE FROM services WHERE id = $1", [id]);

    res.json({ success: true, message: "Service supprimé" });
  } catch (error) {
    console.error("Erreur suppression service:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// GET /api/admin/bookings - Toutes les réservations
router.get("/bookings", async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, status, providerId, clientId } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let whereClause = "1=1";
    const params: any[] = [];
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

    const countResult = await query(
      `SELECT COUNT(*) as count FROM bookings b WHERE ${whereClause}`,
      params,
    );

    // LIMIT et OFFSET utilisent des placeholders paramétrés dynamiques
    const limitParamIndex = paramIndex;
    const offsetParamIndex = paramIndex + 1;

    const result = await query(
      `SELECT b.*, u.first_name as client_first_name, u.last_name as client_last_name,
              s.name as service_name, p.first_name as provider_first_name, p.last_name as provider_last_name
       FROM bookings b
       JOIN users u ON b.client_id = u.id
       JOIN services s ON b.service_id = s.id
       JOIN users p ON s.provider_id = p.id
       WHERE ${whereClause}
       ORDER BY b.created_at DESC
       LIMIT $${limitParamIndex} OFFSET $${offsetParamIndex}`,
      [...params, Number(limit), offset],
    );

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: parseInt(countResult.rows[0].count),
      },
    });
  } catch (error) {
    console.error("Erreur liste réservations:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// PUT /api/admin/bookings/:id - Mettre à jour une réservation
router.put(
  "/bookings/:id",
  [
    body("status")
      .optional()
      .isIn(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"])
      .withMessage("Statut invalide"),
    body("paymentStatus")
      .optional()
      .isIn(["PENDING", "PAID", "REFUNDED"])
      .withMessage("Statut paiement invalide"),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });

      const { id } = req.params;
      const {
        status,
        paymentStatus,
        bookingDate,
        bookingTime,
        address,
        city,
        notes,
      } = req.body;

      // Vérifier si la réservation existe
      const existing = await query("SELECT id FROM bookings WHERE id = $1", [
        id,
      ]);
      if (existing.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Réservation non trouvée" });
      }

      const updates: string[] = [];
      const params: any[] = [];
      let paramIndex = 1;

      if (status) {
        updates.push(`status = $${paramIndex++}`);
        params.push(status);
      }
      if (paymentStatus) {
        updates.push(`payment_status = $${paramIndex++}`);
        params.push(paymentStatus);
      }
      if (bookingDate) {
        updates.push(`booking_date = $${paramIndex++}`);
        params.push(bookingDate);
      }
      if (bookingTime) {
        updates.push(`booking_time = $${paramIndex++}`);
        params.push(bookingTime);
      }
      if (address !== undefined) {
        updates.push(`address = $${paramIndex++}`);
        params.push(address);
      }
      if (city !== undefined) {
        updates.push(`city = $${paramIndex++}`);
        params.push(city);
      }
      if (notes !== undefined) {
        updates.push(`notes = $${paramIndex++}`);
        params.push(notes);
      }

      if (updates.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Aucune donnée à mettre à jour" });
      }

      updates.push(`updated_at = NOW()`);
      params.push(id);

      const result = await query(
        `UPDATE bookings SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING *`,
        params,
      );

      res.json({
        success: true,
        message: "Réservation mise à jour",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Erreur mise à jour réservation:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  },
);

// DELETE /api/admin/bookings/:id - Supprimer une réservation
router.delete("/bookings/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Vérifier si la réservation existe
    const existing = await query("SELECT id FROM bookings WHERE id = $1", [id]);
    if (existing.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Réservation non trouvée" });
    }

    // Vérifier si la réservation est terminée (ne pas supprimer les réservations complétées)
    const booking = await query("SELECT status FROM bookings WHERE id = $1", [
      id,
    ]);
    if (booking.rows[0].status === "COMPLETED") {
      return res.status(400).json({
        success: false,
        message: "Impossible de supprimer une réservation terminée",
      });
    }

    // Supprimer les avis liés
    await query("DELETE FROM reviews WHERE booking_id = $1", [id]);

    await query("DELETE FROM bookings WHERE id = $1", [id]);

    res.json({ success: true, message: "Réservation supprimée" });
  } catch (error) {
    console.error("Erreur suppression réservation:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// GET /api/admin/categories - Gestion des catégories
router.get("/categories", async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(`
      SELECT c.*, COUNT(s.id) as service_count
      FROM categories c
      LEFT JOIN services s ON s.category_id = c.id
      GROUP BY c.id
      ORDER BY c.name
    `);

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Erreur liste catégories:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// POST /api/admin/categories - Créer une catégorie
router.post(
  "/categories",
  [
    body("name").notEmpty().withMessage("Nom requis").isLength({ max: 50 }),
    body("description").optional().isLength({ max: 200 }),
    body("icon").optional().isLength({ max: 50 }),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });

      const { name, description, icon, image } = req.body;

      const result = await query(
        "INSERT INTO categories (name, description, icon, image) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, description, icon, image || null],
      );

      res.status(201).json({
        success: true,
        message: "Catégorie créée",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Erreur création catégorie:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  },
);

// PUT /api/admin/categories/:id - Mettre à jour une catégorie
router.put(
  "/categories/:id",
  [
    body("name")
      .optional()
      .notEmpty()
      .withMessage("Nom requis")
      .isLength({ max: 50 }),
    body("description").optional().isLength({ max: 200 }),
    body("icon").optional().isLength({ max: 50 }),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });

      const { id } = req.params;
      const { name, description, icon, image, isActive, displayOrder } =
        req.body;

      // Vérifier si la catégorie existe
      const existing = await query("SELECT id FROM categories WHERE id = $1", [
        id,
      ]);
      if (existing.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Catégorie non trouvée" });
      }

      const updates: string[] = [];
      const params: any[] = [];
      let paramIndex = 1;

      if (name) {
        updates.push(`name = $${paramIndex++}`);
        params.push(name);
      }
      if (description !== undefined) {
        updates.push(`description = $${paramIndex++}`);
        params.push(description);
      }
      if (icon !== undefined) {
        updates.push(`icon = $${paramIndex++}`);
        params.push(icon);
      }
      if (image !== undefined) {
        updates.push(`image = $${paramIndex++}`);
        params.push(image);
      }
      if (isActive !== undefined) {
        updates.push(`is_active = $${paramIndex++}`);
        params.push(isActive);
      }
      if (displayOrder !== undefined) {
        updates.push(`display_order = $${paramIndex++}`);
        params.push(displayOrder);
      }

      if (updates.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Aucune donnée à mettre à jour" });
      }

      params.push(id);

      const result = await query(
        `UPDATE categories SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING *`,
        params,
      );

      res.json({
        success: true,
        message: "Catégorie mise à jour",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Erreur mise à jour catégorie:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  },
);

// DELETE /api/admin/categories/:id - Supprimer une catégorie
router.delete("/categories/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Vérifier si la catégorie existe
    const existing = await query("SELECT id FROM categories WHERE id = $1", [
      id,
    ]);
    if (existing.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Catégorie non trouvée" });
    }

    // Vérifier si des services utilisent cette catégorie
    const servicesCount = await query(
      "SELECT COUNT(*) as count FROM services WHERE category_id = $1",
      [id],
    );
    if (parseInt(servicesCount.rows[0].count) > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Impossible de supprimer cette catégorie car elle contient des services",
      });
    }

    await query("DELETE FROM categories WHERE id = $1", [id]);

    res.json({ success: true, message: "Catégorie supprimée" });
  } catch (error) {
    console.error("Erreur suppression catégorie:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// GET /api/admin/payments - Historique des paiements
router.get("/payments", async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const result = await query(
      `SELECT p.*, u.first_name, u.last_name, b.total_amount as booking_amount
       FROM payments p
       JOIN users u ON p.user_id = u.id
       LEFT JOIN bookings b ON p.booking_id = b.id
       ORDER BY p.created_at DESC
       LIMIT $1 OFFSET $2`,
      [Number(limit), offset],
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Erreur liste paiements:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// GET /api/admin/subscriptions - Liste des abonnements
router.get("/subscriptions", async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(`
      SELECT s.*, u.email, u.first_name, u.last_name
      FROM subscriptions s
      JOIN users u ON s.user_id = u.id
      ORDER BY s.created_at DESC
    `);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Erreur liste abonnements:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// GET /api/admin/analytics - Données analytiques
router.get("/analytics", async (req: AuthRequest, res: Response) => {
  try {
    // Monthly bookings
    const monthlyResult = await query(`
      SELECT 
        TO_CHAR(created_at, 'Mon') as month,
        COUNT(*) as bookings,
        COALESCE(SUM(total_amount), 0) as revenue
      FROM bookings
      WHERE created_at >= NOW() - INTERVAL '6 months'
      GROUP BY TO_CHAR(created_at, 'MM'), TO_CHAR(created_at, 'Mon')
      ORDER BY TO_CHAR(created_at, 'MM')
    `);

    // Top providers
    const topProvidersResult = await query(`
      SELECT 
        u.first_name, u.last_name,
        COUNT(b.id) as bookings,
        COALESCE(SUM(b.total_amount), 0) as revenue,
        COALESCE(AVG(pp.rating), 0) as rating
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN users u ON s.provider_id = u.id
      LEFT JOIN provider_profiles pp ON u.id = pp.user_id
      WHERE b.status = 'COMPLETED'
      GROUP BY u.id, u.first_name, u.last_name
      ORDER BY revenue DESC
      LIMIT 5
    `);

    // Service categories
    const categoriesResult = await query(`
      SELECT 
        c.name,
        COUNT(s.id) as service_count
      FROM categories c
      LEFT JOIN services s ON s.category_id = c.id
      GROUP BY c.id, c.name
      ORDER BY service_count DESC
    `);

    // Recent activity
    const activityResult = await query(`
      SELECT 
        'booking' as type,
        CONCAT(u.first_name, ' ', u.last_name) as message,
        created_at as time
      FROM bookings
      JOIN users u ON bookings.client_id = u.id
      ORDER BY created_at DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      data: {
        monthly: monthlyResult.rows,
        topProviders: topProvidersResult.rows,
        categories: categoriesResult.rows,
        activity: activityResult.rows,
      },
    });
  } catch (error) {
    console.error("Erreur analytiques:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

export default router;
module.exports = router;

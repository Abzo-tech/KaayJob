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
      whereClause += ` AND role = $${paramIndex}`;
      params.push(role);
      paramIndex++;
    }

    if (search) {
      whereClause += ` AND (first_name ILIKE $${paramIndex} OR last_name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    const countResult = await query(
      `SELECT COUNT(*) FROM users WHERE ${whereClause}`,
    );

    const result = await query(
      `SELECT id, email, first_name, last_name, phone, role, created_at,
              (SELECT COUNT(*) FROM bookings WHERE client_id = users.id) as booking_count
       FROM users
       WHERE ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
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
    console.error("Erreur liste utilisateurs:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// PUT /api/admin/users/:id/verify - Vérifier un prestataire
router.put("/users/:id/verify", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      "UPDATE provider_profiles SET is_verified = true, updated_at = NOW() WHERE user_id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Prestataire non trouvé" });
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

    await query("DELETE FROM users WHERE id = $1", [id]);

    res.json({ success: true, message: "Utilisateur supprimé" });
  } catch (error) {
    console.error("Erreur suppression utilisateur:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

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
      `SELECT COUNT(*) FROM services s WHERE ${whereClause}`,
    );

    const result = await query(
      `SELECT s.*, c.name as category_name, u.first_name, u.last_name
       FROM services s
       JOIN categories c ON s.category_id = c.id
       JOIN users u ON s.provider_id = u.id
       WHERE ${whereClause}
       ORDER BY s.created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
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
      `SELECT COUNT(*) FROM bookings b WHERE ${whereClause}`,
    );

    const result = await query(
      `SELECT b.*, u.first_name as client_first_name, u.last_name as client_last_name,
              s.name as service_name, p.first_name as provider_first_name, p.last_name as provider_last_name
       FROM bookings b
       JOIN users u ON b.client_id = u.id
       JOIN services s ON b.service_id = s.id
       JOIN users p ON s.provider_id = p.id
       WHERE ${whereClause}
       ORDER BY b.created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
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

      const { name, description, icon } = req.body;

      const result = await query(
        "INSERT INTO categories (name, description, icon) VALUES ($1, $2, $3) RETURNING *",
        [name, description, icon],
      );

      res
        .status(201)
        .json({
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
        activity: activityResult.rows
      }
    });
  } catch (error) {
    console.error("Erreur analytiques:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

export default router;
module.exports = router;

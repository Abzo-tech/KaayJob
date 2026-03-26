/**
 * Routes d'administration - Paiements
 */

import { Router, Response } from "express";
import { query } from "../../config/database";
import { AuthRequest } from "../../middleware/auth";

const router = Router();

// GET /api/admin/payments - Historique des paiements
router.get("/", async (req: AuthRequest, res: Response) => {
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

// GET /api/admin/payments/:id - Détails d'un paiement
router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT p.*, u.first_name, u.last_name, u.email, b.total_amount as booking_amount, b.status as booking_status
       FROM payments p
       JOIN users u ON p.user_id = u.id
       LEFT JOIN bookings b ON p.booking_id = b.id
       WHERE p.id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Paiement non trouvé" });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Erreur obtenir paiement:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

export default router;

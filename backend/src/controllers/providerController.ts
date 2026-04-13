/**
 * Contrôleur simplifié pour les prestataires
 * Utilise les requêtes SQL directes
 */

import { Request, Response } from "express";

export class ProviderController {
  /**
   * Lister tous les prestataires
   */
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      console.log("👥 Requête prestataires");
      const { limit } = req.query as any;

      // Import de la fonction query
      const { query } = await import("../config/database");

      let sqlQuery = `
        SELECT
          p.id,
          p.first_name,
          p.last_name,
          p.email,
          p.phone,
          p.avatar
        FROM users p
        JOIN provider_profiles pp ON p.id = pp.user_id
        WHERE p.role = 'PRESTATAIRE' AND p.is_verified = true
        ORDER BY p.created_at DESC
      `;

      const params: any[] = [];
      if (limit) {
        sqlQuery += ` LIMIT $1`;
        params.push(Number(limit));
      }

      const providers = await query(sqlQuery, params);

      res.json({
        success: true,
        data: providers.rows
      });
    } catch (error) {
      console.error("❌ Erreur liste prestataires:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }
}

export default ProviderController;
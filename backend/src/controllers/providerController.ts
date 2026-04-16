/**
 * Contrôleur pour les prestataires
 * Utilise les requêtes SQL directes
 */

import { Request, Response } from "express";
import { query } from "../config/database";

export class ProviderController {
  /**
   * Lister tous les prestataires avec filtrage par catégorie
   */
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { limit, category } = req.query as any;
      const params: any[] = [];
      let paramIndex = 1;

      let sqlQuery;

      if (category) {
        // Filtrer par catégorie (prestataires doivent être complets et avoir au moins un service)
        sqlQuery = `
          SELECT DISTINCT
            pp.id, pp.user_id as userId, pp.specialty, pp.bio,
            pp.hourly_rate as hourlyRate, pp.years_experience as yearsExperience,
            pp.location, pp.is_available as isAvailable, pp.rating,
            pp.total_reviews as totalReviews, pp.total_bookings as totalBookings,
            pp.is_verified as isVerified, pp.created_at, p.first_name, p.last_name, p.avatar
          FROM provider_profiles pp
          JOIN users p ON pp.user_id = p.id
          JOIN services s ON pp.user_id = s.provider_id AND s.is_active = true
          JOIN categories c ON s.category_id = c.id
          WHERE p.role = 'PRESTATAIRE'
            AND p.is_verified = true
            AND pp.is_verified = true
            AND pp.specialty IS NOT NULL
            AND pp.bio IS NOT NULL
            AND pp.hourly_rate IS NOT NULL
            AND pp.location IS NOT NULL
            AND (c.slug = $${paramIndex} OR c.id = $${paramIndex})
        `;
        params.push(category);
        paramIndex++;
      } else {
        // Tous les prestataires (doivent être vérifiés, avoir un profil complet et au moins un service actif)
        sqlQuery = `
          SELECT DISTINCT
            pp.id, pp.user_id as userId, pp.specialty, pp.bio,
            pp.hourly_rate as hourlyRate, pp.years_experience as yearsExperience,
            pp.location, pp.is_available as isAvailable, pp.rating,
            pp.total_reviews as totalReviews, pp.total_bookings as totalBookings,
            pp.is_verified as isVerified, pp.created_at, p.first_name, p.last_name, p.avatar
          FROM provider_profiles pp
          JOIN users p ON pp.user_id = p.id
          JOIN services s ON pp.user_id = s.provider_id AND s.is_active = true
          WHERE p.role = 'PRESTATAIRE'
            AND p.is_verified = true
            AND pp.is_verified = true
            AND pp.specialty IS NOT NULL
            AND pp.bio IS NOT NULL
            AND pp.hourly_rate IS NOT NULL
            AND pp.location IS NOT NULL
        `;
      }

      sqlQuery += ` ORDER BY pp.created_at DESC`;

      if (limit) {
        sqlQuery += ` LIMIT $${paramIndex}`;
        params.push(Number(limit));
      }

      const providersResult = await query(sqlQuery, params);

      const transformedProviders = providersResult.rows.map((row: any) => ({
        id: row.id,
        userId: row.userid,
        specialty: row.specialty,
        bio: row.bio,
        hourlyRate: row.hourlyrate ? parseFloat(row.hourlyrate) : null,
        yearsExperience: row.yearsexperience,
        location: row.location,
        isAvailable: row.isavailable,
        rating: parseFloat(row.rating || '0'),
        totalReviews: row.totalreviews || 0,
        totalBookings: row.totalbookings || 0,
        isVerified: row.isverified,
        user: {
          id: row.userid,
          firstName: row.first_name,
          lastName: row.last_name,
          avatar: row.avatar
        }
      }));

      res.json({
        success: true,
        data: transformedProviders
      });
    } catch (error) {
      console.error("❌ Erreur liste prestataires:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Obtenir les prestataires pour la carte
   */
  static async getProvidersForMap(req: Request, res: Response): Promise<void> {
    try {
      const providersResult = await query(`
        SELECT DISTINCT
          pp.id, pp.user_id as userId, pp.latitude, pp.longitude,
          u.first_name, u.last_name
        FROM provider_profiles pp
        JOIN users u ON pp.user_id = u.id
        JOIN services s ON pp.user_id = s.provider_id AND s.is_active = true
        WHERE u.role = 'PRESTATAIRE'
          AND u.is_verified = true
          AND pp.is_verified = true
          AND pp.latitude IS NOT NULL
          AND pp.longitude IS NOT NULL
          AND pp.specialty IS NOT NULL
          AND pp.bio IS NOT NULL
          AND pp.hourly_rate IS NOT NULL
          AND pp.location IS NOT NULL
      `, []);

      const transformedProviders = providersResult.rows.map((row: any) => ({
        id: row.id,
        userId: row.userid,
        latitude: parseFloat(row.latitude),
        longitude: parseFloat(row.longitude),
        user: {
          firstName: row.first_name,
          lastName: row.last_name
        }
      }));

      res.json({
        success: true,
        data: transformedProviders
      });
    } catch (error) {
      console.error("❌ Erreur prestataires carte:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Obtenir les détails d'un prestataire par ID
   */
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const providerResult = await query(`
        SELECT
          pp.id, pp.user_id as userId, pp.specialty, pp.bio,
          pp.hourly_rate as hourlyRate, pp.years_experience as yearsExperience,
          pp.location, pp.latitude, pp.longitude, pp.is_available as isAvailable,
          pp.rating, pp.total_reviews as totalReviews, pp.is_verified as isVerified,
          u.first_name, u.last_name, u.email, u.phone, u.avatar
        FROM provider_profiles pp
        JOIN users u ON pp.user_id = u.id
        WHERE pp.id = $1 AND u.role = 'PRESTATAIRE' AND u.is_verified = true
      `, [id]);

      if (providerResult.rows.length === 0) {
        res.status(404).json({ success: false, message: "Prestataire non trouvé" });
        return;
      }

      const row = providerResult.rows[0];
      const provider: any = {
        id: row.id,
        userId: row.userid,
        specialty: row.specialty,
        bio: row.bio,
        hourlyRate: row.hourlyrate ? parseFloat(row.hourlyrate) : null,
        yearsExperience: row.yearsexperience,
        location: row.location,
        latitude: parseFloat(row.latitude),
        longitude: parseFloat(row.longitude),
        isAvailable: row.isavailable,
        rating: parseFloat(row.rating || '0'),
        totalReviews: row.totalreviews || 0,
        isVerified: row.isverified,
        user: {
          id: row.userid,
          firstName: row.first_name,
          lastName: row.last_name,
          email: row.email,
          phone: row.phone,
          avatar: row.avatar
        }
      };

      // Récupérer les services actifs du prestataire
      const servicesResult = await query(`
        SELECT s.id, s.name, s.description, s.price, s.price_type as priceType, s.duration, s.is_active as isActive
        FROM services s
        WHERE s.provider_id = $1 AND s.is_active = true
        ORDER BY s.name ASC
      `, [row.userid]);

      provider.services = servicesResult.rows.map((serviceRow: any) => ({
        id: serviceRow.id,
        name: serviceRow.name,
        description: serviceRow.description,
        price: parseFloat(serviceRow.price),
        priceType: serviceRow.pricetype,
        duration: serviceRow.duration,
        isActive: serviceRow.isactive
      }));

      res.json({
        success: true,
        data: provider
      });
    } catch (error) {
      console.error("❌ Erreur prestataire par ID:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Mettre à jour la localisation du prestataire
   */
  static async updateLocation(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;

      if (!user?.id) {
        res.status(401).json({ success: false, message: 'Utilisateur non authentifié' });
        return;
      }

      const { latitude, longitude, address } = req.body;

      if (user.role !== "PRESTATAIRE" && user.role !== "prestataire") {
        res.status(403).json({ success: false, message: "Accès réservé aux prestataires" });
        return;
      }

      await query(`
        UPDATE provider_profiles
        SET latitude = $1, longitude = $2, location = $3, updated_at = NOW()
        WHERE user_id = $4
      `, [latitude, longitude, address || null, user.id]);

      await query(`
        UPDATE users
        SET latitude = $1, longitude = $2, address = $3, updated_at = NOW()
        WHERE id = $4
      `, [latitude, longitude, address || null, user.id]);

      res.json({
        success: true,
        message: "Localisation mise à jour avec succès"
      });
    } catch (error) {
      console.error("❌ Erreur mise à jour localisation:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }
}

export default ProviderController;
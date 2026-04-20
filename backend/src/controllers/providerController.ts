/**
 * Contrôleur pour les prestataires
 * Mélange de Prisma et SQL (à migrer progressivement vers Prisma)
 */

import { Request, Response } from "express";
import { prisma } from "../config/prisma";
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
        // Filtrer par catégorie (retourner prestataires vérifiés même sans services dans cette catégorie)
        sqlQuery = `
          SELECT DISTINCT
            pp.id, pp.user_id as userId, pp.specialty, pp.bio,
            pp.hourly_rate as hourlyRate, pp.years_experience as yearsExperience,
            pp.location, pp.is_available as isAvailable, pp.rating,
            pp.total_reviews as totalReviews, pp.total_bookings as totalBookings,
            pp.is_verified as isVerified, pp.created_at, p.first_name, p.last_name, p.avatar
          FROM provider_profiles pp
          JOIN users p ON pp.user_id = p.id
          LEFT JOIN services s ON pp.user_id = s.provider_id AND s.is_active = true
          LEFT JOIN categories c ON s.category_id = c.id
          WHERE p.role = 'PRESTATAIRE'
            AND p.is_verified = true
            AND pp.is_verified = true
            AND pp.specialty IS NOT NULL
            AND pp.bio IS NOT NULL
            AND pp.hourly_rate IS NOT NULL
            AND pp.location IS NOT NULL
            AND (c.slug = $${paramIndex} OR c.id = $${paramIndex} OR $${paramIndex} IS NULL)
        `;
        params.push(category);
        paramIndex++;
      } else {
        // Tous les prestataires vérifiés (ne pas exiger de services)
        sqlQuery = `
          SELECT DISTINCT
            pp.id, pp.user_id as userId, pp.specialty, pp.bio,
            pp.hourly_rate as hourlyRate, pp.years_experience as yearsExperience,
            pp.location, pp.is_available as isAvailable, pp.rating,
            pp.total_reviews as totalReviews, pp.total_bookings as totalBookings,
            pp.is_verified as isVerified, pp.created_at, p.first_name, p.last_name, p.avatar
          FROM provider_profiles pp
          JOIN users p ON pp.user_id = p.id
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
        rating: parseFloat(row.rating || "0"),
        totalReviews: row.totalreviews || 0,
        totalBookings: row.totalbookings || 0,
        isVerified: row.isverified,
        user: {
          id: row.userid,
          firstName: row.first_name,
          lastName: row.last_name,
          avatar: row.avatar,
        },
      }));

      res.json({
        success: true,
        data: transformedProviders,
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
      const providersResult = await query(
        `
        SELECT DISTINCT
          pp.id, pp.user_id as userId, pp.latitude, pp.longitude,
          u.first_name, u.last_name
        FROM provider_profiles pp
        JOIN users u ON pp.user_id = u.id
        WHERE u.role = 'PRESTATAIRE'
          AND u.is_verified = true
          AND pp.is_verified = true
          AND pp.latitude IS NOT NULL
          AND pp.longitude IS NOT NULL
          AND pp.specialty IS NOT NULL
          AND pp.bio IS NOT NULL
          AND pp.hourly_rate IS NOT NULL
          AND pp.location IS NOT NULL
      `,
        [],
      );

      const transformedProviders = providersResult.rows.map((row: any) => ({
        id: row.id,
        userId: row.userid,
        latitude: parseFloat(row.latitude),
        longitude: parseFloat(row.longitude),
        user: {
          firstName: row.first_name,
          lastName: row.last_name,
        },
      }));

      res.json({
        success: true,
        data: transformedProviders,
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

      const providerResult = await query(
        `
        SELECT
          pp.id, pp.user_id as userId, pp.specialty, pp.bio,
          pp.hourly_rate as hourlyRate, pp.years_experience as yearsExperience,
          pp.location, pp.latitude, pp.longitude, pp.is_available as isAvailable,
          pp.rating, pp.total_reviews as totalReviews, pp.is_verified as isVerified,
          u.first_name, u.last_name, u.email, u.phone, u.avatar
        FROM provider_profiles pp
        JOIN users u ON pp.user_id = u.id
        WHERE pp.id = $1 AND u.role = 'PRESTATAIRE' AND u.is_verified = true
      `,
        [id],
      );

      if (providerResult.rows.length === 0) {
        res
          .status(404)
          .json({ success: false, message: "Prestataire non trouvé" });
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
        rating: parseFloat(row.rating || "0"),
        totalReviews: row.totalreviews || 0,
        isVerified: row.isverified,
        user: {
          id: row.userid,
          firstName: row.first_name,
          lastName: row.last_name,
          email: row.email,
          phone: row.phone,
          avatar: row.avatar,
        },
      };

      // Récupérer les services actifs du prestataire
      const servicesResult = await query(
        `
        SELECT s.id, s.name, s.description, s.price, s.price_type as priceType, s.duration, s.is_active as isActive
        FROM services s
        WHERE s.provider_id = $1 AND s.is_active = true
        ORDER BY s.name ASC
      `,
        [row.userid],
      );

      provider.services = servicesResult.rows.map((serviceRow: any) => ({
        id: serviceRow.id,
        name: serviceRow.name,
        description: serviceRow.description,
        price: parseFloat(serviceRow.price),
        priceType: serviceRow.pricetype,
        duration: serviceRow.duration,
        isActive: serviceRow.isactive,
      }));

      res.json({
        success: true,
        data: provider,
      });
    } catch (error) {
      console.error("❌ Erreur prestataire par ID:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Récupérer le profil du prestataire connecté
   */
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;

      if (!user?.id) {
        res
          .status(401)
          .json({ success: false, message: "Utilisateur non authentifié" });
        return;
      }

      if (user.role !== "PRESTATAIRE" && user.role !== "prestataire") {
        res
          .status(403)
          .json({ success: false, message: "Accès réservé aux prestataires" });
        return;
      }

      const providerResult = await query(
        `
        SELECT
          pp.id, pp.user_id as userId, pp.business_name as businessName,
          pp.specialty, pp.bio, pp.hourly_rate as hourlyRate,
          pp.years_experience as yearsExperience, pp.location,
          pp.address, pp.city, pp.region, pp.postal_code as postalCode,
          pp.latitude, pp.longitude, pp.service_radius as serviceRadius,
          pp.is_available as isAvailable, pp.availability,
          pp.rating, pp.total_reviews as totalReviews,
          pp.total_bookings as totalBookings, pp.is_verified as isVerified,
          pp.profile_image as profileImage, pp.created_at as createdAt,
          pp.updated_at as updatedAt,
          u.first_name as firstName, u.last_name as lastName,
          u.email, u.phone, u.avatar
        FROM provider_profiles pp
        JOIN users u ON pp.user_id = u.id
        WHERE pp.user_id = $1
      `,
        [user.id],
      );

      if (providerResult.rows.length === 0) {
        res
          .status(404)
          .json({ success: false, message: "Profil prestataire non trouvé" });
        return;
      }

      const row = providerResult.rows[0];
      const profile = {
        id: row.id,
        userId: row.userid,
        businessName: row.businessname,
        specialty: row.specialty,
        bio: row.bio,
        hourlyRate: row.hourlyrate ? parseFloat(row.hourlyrate) : null,
        yearsExperience: row.yearsexperience,
        location: row.location,
        address: row.address,
        city: row.city,
        region: row.region,
        postalCode: row.postalcode,
        latitude: parseFloat(row.latitude) || null,
        longitude: parseFloat(row.longitude) || null,
        serviceRadius: row.serviceradius,
        isAvailable: row.isavailable,
        availability: row.availability,
        rating: parseFloat(row.rating || "0"),
        totalReviews: row.totalreviews || 0,
        totalBookings: row.totalbookings || 0,
        isVerified: row.isverified,
        profileImage: row.profileimage,
        createdAt: row.createdat,
        updatedAt: row.updatedat,
        user: {
          id: row.userid,
          firstName: row.firstname,
          lastName: row.lastname,
          email: row.email,
          phone: row.phone,
          avatar: row.avatar,
        },
      };

      res.json({ success: true, data: profile });
    } catch (error) {
      console.error("❌ Erreur récupération profil prestataire:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Mettre à jour le profil du prestataire
   */
  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;

      if (!user?.id) {
        res
          .status(401)
          .json({ success: false, message: "Utilisateur non authentifié" });
        return;
      }

      if (user.role !== "PRESTATAIRE" && user.role !== "prestataire") {
        res
          .status(403)
          .json({ success: false, message: "Accès réservé aux prestataires" });
        return;
      }

      const {
        businessName,
        specialty,
        bio,
        hourlyRate,
        yearsExperience,
        location,
        address,
        city,
        region,
        postalCode,
        serviceRadius,
        isAvailable,
        profileImage,
        phone,
        country,
      } = req.body;

      // Mettre à jour les informations utilisateur si fourni
      if (phone) {
        await query(
          `UPDATE users SET phone = $1, updated_at = NOW() WHERE id = $2`,
          [phone, user.id],
        );
      }

      // Vérifier si le profil prestataire existe
      const checkRes = await query(
        `SELECT id FROM provider_profiles WHERE user_id = $1`,
        [user.id],
      );

      if (checkRes.rows.length === 0) {
        // Créer le profil s'il n'existe pas
        await query(
          `
          INSERT INTO provider_profiles (
            user_id, business_name, specialty, bio, hourly_rate,
            years_experience, location, address, city, region, postal_code,
            service_radius, is_available, profile_image, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW())
        `,
          [
            user.id,
            businessName,
            specialty,
            bio,
            hourlyRate,
            yearsExperience,
            location,
            address,
            city,
            region,
            postalCode,
            serviceRadius,
            isAvailable !== undefined ? isAvailable : true, // Valeur par défaut true
            profileImage,
          ],
        );
      } else {
        // Mettre à jour le profil existant
        // Déterminer la valeur de is_available
        const finalIsAvailable =
          isAvailable !== undefined && isAvailable !== null
            ? isAvailable
            : true;

        console.log(
          "DEBUG_PROVIDER_UPDATE: Final isAvailable value:",
          finalIsAvailable,
        );

        await query(
          `
          UPDATE provider_profiles SET
            business_name = $1, specialty = $2, bio = $3, hourly_rate = $4,
            years_experience = $5, location = $6, address = $7, city = $8,
            region = $9, postal_code = $10, service_radius = $11,
            is_available = COALESCE(is_available, $12), profile_image = $13, updated_at = NOW()
          WHERE user_id = $14
        `,
          [
            businessName,
            specialty,
            bio,
            hourlyRate,
            yearsExperience,
            location,
            address,
            city,
            region,
            postalCode,
            serviceRadius,
            finalIsAvailable,
            profileImage,
            user.id,
          ],
        );
      }

      res.json({ success: true, message: "Profil mis à jour avec succès" });
    } catch (error) {
      console.error("❌ Erreur mise à jour profil prestataire:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Demander la vérification du profil prestataire
   */
  static async requestVerification(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;

      if (!user?.id) {
        res
          .status(401)
          .json({ success: false, message: "Utilisateur non authentifié" });
        return;
      }

      if (user.role !== "PRESTATAIRE" && user.role !== "prestataire") {
        res
          .status(403)
          .json({ success: false, message: "Accès réservé aux prestataires" });
        return;
      }

      const { documents } = req.body;

      // Créer une demande de vérification
      await query(
        `
        INSERT INTO verification_requests (user_id, documents, status, created_at)
        VALUES ($1, $2, 'pending', NOW())
        ON CONFLICT (user_id) DO UPDATE SET
          documents = EXCLUDED.documents,
          status = 'pending',
          updated_at = NOW()
      `,
        [user.id, JSON.stringify(documents || {})],
      );

      res.json({ success: true, message: "Demande de vérification envoyée" });
    } catch (error) {
      console.error("❌ Erreur demande vérification:", error);
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
        res
          .status(401)
          .json({ success: false, message: "Utilisateur non authentifié" });
        return;
      }

      const { latitude, longitude, address, city, region } = req.body;

      if (user.role !== "PRESTATAIRE" && user.role !== "prestataire") {
        res
          .status(403)
          .json({ success: false, message: "Accès réservé aux prestataires" });
        return;
      }

      // Vérifier si le profil prestataire existe
      const checkRes = await query(
        `SELECT id FROM provider_profiles WHERE user_id = $1`,
        [user.id],
      );

      if (checkRes.rows.length === 0) {
        // Créer le profil s'il n'existe pas
        await query(
          `
          INSERT INTO provider_profiles (
            user_id, latitude, longitude, location, city, region, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        `,
          [user.id, latitude, longitude, address || null, city || null, region || null],
        );
      } else {
        // Mettre à jour le profil existant
        await query(
          `
          UPDATE provider_profiles
          SET latitude = $1, longitude = $2, location = $3, city = $4, region = $5, updated_at = NOW()
          WHERE user_id = $6
        `,
          [latitude, longitude, address || null, city || null, region || null, user.id],
        );

        // Mettre à jour aussi dans la table users
        await query(
          `
          UPDATE users
          SET latitude = $1, longitude = $2, address = $3, updated_at = NOW()
          WHERE id = $4
        `,
          [latitude, longitude, address || null, user.id],
        );
      }

      res.json({
        success: true,
        message: "Localisation mise à jour avec succès",
      });
    } catch (error) {
      console.error("❌ Erreur mise à jour localisation:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Mettre à jour la disponibilité du prestataire (utilise Prisma)
   */
  static async updateAvailability(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;

      if (!user?.id) {
        res
          .status(401)
          .json({ success: false, message: "Utilisateur non authentifié" });
        return;
      }

      const { isAvailable, availability } = req.body;

      if (user.role !== "PRESTATAIRE" && user.role !== "prestataire") {
        res
          .status(403)
          .json({ success: false, message: "Accès réservé aux prestataires" });
        return;
      }

      // Vérifier si le profil prestataire existe
      const existingProfile = await prisma.providerProfile.findUnique({
        where: { userId: user.id },
      });

      if (!existingProfile) {
        // Créer le profil s'il n'existe pas avec des valeurs par défaut
        const availValue = isAvailable !== undefined ? isAvailable : true;
        await prisma.providerProfile.create({
          data: {
            userId: user.id,
            isAvailable: availValue,
            availability: availability || undefined,
          },
        });
      } else {
        // Mettre à jour le profil existant
        const updateData: any = {};

        if (isAvailable !== undefined) {
          updateData.isAvailable = isAvailable;
        }

        if (availability) {
          updateData.availability = availability;
        }

        await prisma.providerProfile.update({
          where: { userId: user.id },
          data: updateData,
        });
      }

      res.json({
        success: true,
        message: "Disponibilité mise à jour avec succès",
      });
    } catch (error) {
      console.error("❌ Erreur mise à jour disponibilité:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Obtenir l'abonnement actif du prestataire
   */
  static async getMySubscription(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;

      if (!user?.id) {
        res
          .status(401)
          .json({ success: false, message: "Utilisateur non authentifié" });
        return;
      }

      // Pour l'instant, retourner un abonnement fictif
      // TODO: Implémenter la vraie logique d'abonnement
      res.json({
        success: true,
        data: {
          plan: "premium",
          status: "active",
          startDate: new Date().toISOString(),
          endDate: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          planName: "Plan Premium",
          planPrice: 49.99,
        },
      });
    } catch (error) {
      console.error("❌ Erreur récupération abonnement:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Obtenir l'historique des abonnements
   */
  static async getSubscriptionHistory(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const user = (req as any).user;

      if (!user?.id) {
        res
          .status(401)
          .json({ success: false, message: "Utilisateur non authentifié" });
        return;
      }

      // Pour l'instant, retourner un historique fictif
      res.json({
        success: true,
        data: [],
      });
    } catch (error) {
      console.error("❌ Erreur récupération historique abonnement:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * S'abonner à un plan
   */
  static async subscribeToPlan(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const { planId } = req.body;

      if (!user?.id) {
        res
          .status(401)
          .json({ success: false, message: "Utilisateur non authentifié" });
        return;
      }

      if (!planId) {
        res.status(400).json({ success: false, message: "planId requis" });
        return;
      }

      // Pour l'instant, simuler un abonnement réussi
      res.json({
        success: true,
        message: "Abonnement créé avec succès",
        data: {
          planId,
          status: "active",
          startDate: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("❌ Erreur abonnement:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Annuler l'abonnement
   */
  static async cancelSubscription(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;

      if (!user?.id) {
        res
          .status(401)
          .json({ success: false, message: "Utilisateur non authentifié" });
        return;
      }

      // Pour l'instant, simuler une annulation réussie
      res.json({
        success: true,
        message: "Abonnement annulé avec succès",
      });
    } catch (error) {
      console.error("❌ Erreur annulation abonnement:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Obtenir l'historique des paiements
   */
  static async getPaymentHistory(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;

      if (!user?.id) {
        res
          .status(401)
          .json({ success: false, message: "Utilisateur non authentifié" });
        return;
      }

      // Pour l'instant, retourner un historique fictif
      res.json({
        success: true,
        data: [],
      });
    } catch (error) {
      console.error("❌ Erreur récupération historique paiements:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }
}

export default ProviderController;

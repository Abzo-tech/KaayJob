/**
 * Contrôleur pour les prestataires
 * Gère les opérations sur les profils prestataires
 * Utilise Prisma pour les queries
 */

import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { Role } from "@prisma/client";

export class ProviderController {
  /**
   * Liste des prestataires avec filtres
   */
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const {
        specialty,
        location,
        minRating,
        isAvailable,
        search,
        category,
        page = 1,
        limit = 12,
      } = req.query as any;

      const skip = (Number(page) - 1) * Number(limit);

      // Build where clause
      const where: any = {
        user: {
          role: Role.PRESTATAIRE,
        },
        // Only show providers who have at least one active service
        services: {
          some: {
            isActive: true,
          },
        },
      };

      if (specialty) {
        where.specialty = { contains: specialty, mode: "insensitive" };
      }

      if (location) {
        where.location = { contains: location, mode: "insensitive" };
      }

      if (minRating) {
        where.rating = { gte: Number(minRating) };
      }

      if (isAvailable !== undefined) {
        where.isAvailable = isAvailable === "true";
      }

      if (search) {
        where.OR = [
          { user: { firstName: { contains: search, mode: "insensitive" } } },
          { user: { lastName: { contains: search, mode: "insensitive" } } },
          { businessName: { contains: search, mode: "insensitive" } },
          { specialty: { contains: search, mode: "insensitive" } },
        ];
      }

      // Filter by category - providers who have services in this category
      if (category) {
        const categoryStr = category.toString();
        where.services = {
          some: {
            category: {
              OR: [
                { slug: categoryStr.toLowerCase() },
                { id: categoryStr },
              ],
            },
            isActive: true,
          },
        };
      }

      const [providers, total] = await Promise.all([
        prisma.providerProfile.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            rating: "desc",
          },
          skip,
          take: Number(limit),
        }),
        prisma.providerProfile.count({ where }),
      ]);

      res.json({
        success: true,
        data: providers,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      console.error("Erreur liste prestataires:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
     * Obtenir un prestataire par ID
     */
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { query } = require("../config/database");

      // Chercher le prestataire par ID utilisateur (qui est passé depuis la carte)
      const result = await query(
        `SELECT
          u.id, u.email, u.first_name, u.last_name, u.phone, u.role,
          u.bio, u.specialization, u.address, u.zone, u.avatar, u.latitude, u.longitude,
          u.is_verified, u.created_at,
          pp.hourly_rate, pp.years_experience, pp.availability, pp.is_available as "isAvailable",
          COALESCE(rating_stats.avg_rating, 0) as rating,
          COALESCE(rating_stats.review_count, 0) as "totalReviews"
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
        WHERE u.id = $1 AND u.role = 'PRESTATAIRE'`,
        [id]
      );

      if (result.rows.length === 0) {
        res.status(404).json({ success: false, message: "Prestataire non trouvé" });
        return;
      }

      const provider = result.rows[0];

      // Get reviews
      const reviewsResult = await query(
        `SELECT r.*, u.first_name, u.last_name, u.avatar
        FROM reviews r
        JOIN users u ON r.client_id = u.id
        WHERE r.provider_id = $1
        ORDER BY r.created_at DESC
        LIMIT 10`,
        [id]
      );

      // Get services
      const servicesResult = await query(
        `SELECT s.*
        FROM services s
        WHERE s.provider_id = $1 AND s.is_active = true
        ORDER BY s.created_at DESC`,
        [id]
      );

      const data = {
        id: provider.id,
        user: {
          id: provider.id,
          firstName: provider.first_name,
          lastName: provider.last_name,
          email: provider.email,
          phone: provider.phone,
          avatar: provider.avatar,
          createdAt: provider.created_at,
        },
        specialty: provider.specialization,
        bio: provider.bio,
        address: provider.address,
        zone: provider.zone,
        latitude: parseFloat(provider.latitude),
        longitude: parseFloat(provider.longitude),
        isVerified: provider.is_verified,
        hourlyRate: provider.hourly_rate ? parseFloat(provider.hourly_rate) : undefined,
        yearsExperience: provider.years_experience ? parseInt(provider.years_experience) : undefined,
        availability: provider.availability,
        isAvailable: provider.isAvailable,
        rating: parseFloat(provider.rating) || 0,
        totalReviews: parseInt(provider.totalReviews) || 0,
        reviews: reviewsResult.rows.map((r: any) => ({
          id: r.id,
          rating: r.rating,
          comment: r.comment,
          createdAt: r.created_at,
          client: {
            id: r.client_id,
            firstName: r.first_name,
            lastName: r.last_name,
            avatar: r.avatar,
          },
        })),
        services: servicesResult.rows,
      };

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      console.error("Erreur récupération prestataire:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Obtenir les services d'un prestataire
   */
  static async getServices(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { page = 1, limit = 20 } = req.query as any;
      const skip = (Number(page) - 1) * Number(limit);

      const [services, total] = await Promise.all([
        prisma.service.findMany({
          where: { providerId: id, isActive: true },
          orderBy: { createdAt: "desc" },
          skip,
          take: Number(limit),
        }),
        prisma.service.count({ where: { providerId: id, isActive: true } }),
      ]);

      res.json({
        success: true,
        data: services,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      console.error("Erreur services:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Obtenir les avis d'un prestataire
   */
  static async getReviews(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { page = 1, limit = 10 } = req.query as any;
      const skip = (Number(page) - 1) * Number(limit);

      const [reviews, total] = await Promise.all([
        prisma.review.findMany({
          where: { providerId: id },
          include: {
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: Number(limit),
        }),
        prisma.review.count({ where: { providerId: id } }),
      ]);

      res.json({
        success: true,
        data: reviews,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      console.error("Erreur avis:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Obtenir les catégories de services des prestataires
   */
  static async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const specialties = await prisma.providerProfile.findMany({
        where: {
          specialty: {
            not: null,
          },
          NOT: {
            specialty: "",
          },
        },
        select: { specialty: true },
        distinct: ["specialty"],
      });

      res.json({
        success: true,
        data: specialties.map((s) => s.specialty).filter(Boolean),
      });
    } catch (error) {
      console.error("Erreur catégories:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Obtenir le profil du prestataire connecté
   */
  static async getMyProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;

      const provider = await prisma.providerProfile.findUnique({
        where: { userId: user.id },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              avatar: true,
              createdAt: true,
            },
          },
        },
      });

      if (!provider) {
        res.status(404).json({ success: false, message: "Profil non trouvé" });
        return;
      }

      // Get stats
      const stats = await prisma.booking.groupBy({
        by: ["status"],
        where: {
          service: {
            providerId: provider.id,
          },
        },
        _count: true,
      });

      res.json({
        success: true,
        data: {
          ...provider,
          stats,
        },
      });
    } catch (error) {
      console.error("Erreur récupération profil:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Mettre à jour le profil prestataire
   */
  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;

      if (user.role !== Role.PRESTATAIRE) {
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
      } = req.body;

      const updated = await prisma.providerProfile.update({
        where: { userId: user.id },
        data: {
          ...(businessName !== undefined && { businessName }),
          ...(specialty !== undefined && { specialty }),
          ...(bio !== undefined && { bio }),
          ...(hourlyRate !== undefined && { hourlyRate: Number(hourlyRate) }),
          ...(yearsExperience !== undefined && {
            yearsExperience: Number(yearsExperience),
          }),
          ...(location !== undefined && { location }),
          ...(address !== undefined && { address }),
          ...(city !== undefined && { city }),
          ...(region !== undefined && { region }),
          ...(postalCode !== undefined && { postalCode }),
          ...(serviceRadius !== undefined && {
            serviceRadius: Number(serviceRadius),
          }),
          ...(isAvailable !== undefined && { isAvailable }),
        },
      });

      res.json({
        success: true,
        message: "Profil mis à jour",
        data: updated,
      });
    } catch (error) {
      console.error("Erreur mise à jour profil:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Mettre à jour la disponibilité
   */
  static async updateAvailability(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;

      if (user.role !== Role.PRESTATAIRE) {
        res
          .status(403)
          .json({ success: false, message: "Accès réservé aux prestataires" });
        return;
      }

      const { availability } = req.body;

      const updated = await prisma.providerProfile.update({
        where: { userId: user.id },
        data: {
          availability: availability as any,
        },
      });

      res.json({
        success: true,
        message: "Disponibilité mise à jour",
        data: updated,
      });
    } catch (error) {
      console.error("Erreur mise à jour disponibilité:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Basculer la disponibilité
   */
  static async toggleAvailability(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;

      if (user.role !== Role.PRESTATAIRE) {
        res
          .status(403)
          .json({ success: false, message: "Accès réservé aux prestataires" });
        return;
      }

      const provider = await prisma.providerProfile.findUnique({
        where: { userId: user.id },
      });

      if (!provider) {
        res.status(404).json({ success: false, message: "Profil non trouvé" });
        return;
      }

      const updated = await prisma.providerProfile.update({
        where: { userId: user.id },
        data: {
          isAvailable: !provider.isAvailable,
        },
      });

      res.json({
        success: true,
        message: updated.isAvailable
          ? "Disponibilité activée"
          : "Disponibilité désactivée",
        data: updated,
      });
    } catch (error) {
      console.error("Erreur changement disponibilité:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Obtenir le tableau de bord
   */
  static async getDashboard(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;

      if (user.role !== Role.PRESTATAIRE) {
        res
          .status(403)
          .json({ success: false, message: "Accès réservé aux prestataires" });
        return;
      }

      const provider = await prisma.providerProfile.findUnique({
        where: { userId: user.id },
      });

      if (!provider) {
        res.status(404).json({ success: false, message: "Profil non trouvé" });
        return;
      }

      // Recent bookings
      const recentBookings = await prisma.booking.findMany({
        where: {
          service: {
            providerId: provider.id,
          },
        },
        include: {
          client: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          service: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      });

      // Today's stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayStats = await prisma.booking.groupBy({
        by: ["status"],
        where: {
          service: {
            providerId: provider.id,
          },
          bookingDate: {
            gte: today,
          },
        },
        _count: true,
      });

      // Month earnings
      const firstDayOfMonth = new Date();
      firstDayOfMonth.setDate(1);
      firstDayOfMonth.setHours(0, 0, 0, 0);

      const monthEarnings = await prisma.booking.aggregate({
        where: {
          service: {
            providerId: provider.id,
          },
          status: "COMPLETED",
          updatedAt: {
            gte: firstDayOfMonth,
          },
        },
        _sum: {
          totalAmount: true,
        },
      });

      res.json({
        success: true,
        data: {
          recentBookings,
          todayStats,
          monthEarnings: monthEarnings._sum.totalAmount || 0,
        },
      });
    } catch (error) {
      console.error("Erreur tableau de bord:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Obtenir les statistiques
   */
  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const { period = "month" } = req.query;

      if (user.role !== Role.PRESTATAIRE) {
        res
          .status(403)
          .json({ success: false, message: "Accès réservé aux prestataires" });
        return;
      }

      const provider = await prisma.providerProfile.findUnique({
        where: { userId: user.id },
      });

      if (!provider) {
        res.status(404).json({ success: false, message: "Profil non trouvé" });
        return;
      }

      // Date filter
      let dateFilter: Date | undefined;
      const now = new Date();

      if (period === "week") {
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (period === "month") {
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      } else if (period === "year") {
        dateFilter = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      }

      // Stats
      const stats = await prisma.booking.groupBy({
        by: ["status"],
        where: {
          service: {
            providerId: provider.id,
          },
          ...(dateFilter && {
            createdAt: { gte: dateFilter },
          }),
        },
        _count: true,
        _sum: {
          totalAmount: true,
        },
      });

      // Unique clients
      const uniqueClients = await prisma.booking.findMany({
        where: {
          service: {
            providerId: provider.id,
          },
          ...(dateFilter && {
            createdAt: { gte: dateFilter },
          }),
        },
        select: {
          clientId: true,
        },
        distinct: ["clientId"],
      });

      // Top services
      const topServices = await prisma.service.findMany({
        where: {
          providerId: provider.id,
        },
        include: {
          bookings: {
            where: {
              ...(dateFilter && {
                createdAt: { gte: dateFilter },
              }),
            },
            select: {
              id: true,
              totalAmount: true,
            },
          },
        },
      });

      const formattedTopServices = topServices
        .map((s) => ({
          id: s.id,
          name: s.name,
          bookingsCount: s.bookings.length,
          revenue: s.bookings.reduce(
            (sum, b) => sum + (b.totalAmount?.toNumber() || 0),
            0,
          ),
        }))
        .sort((a, b) => b.bookingsCount - a.bookingsCount)
        .slice(0, 5);

      res.json({
        success: true,
        data: {
          totalBookings: stats.reduce((sum, s) => sum + s._count, 0),
          completedBookings:
            stats.find((s) => s.status === "COMPLETED")?._count || 0,
          cancelledBookings:
            stats.find((s) => s.status === "CANCELLED")?._count || 0,
          totalEarnings: stats.reduce(
            (sum, s) => sum + (s._sum.totalAmount?.toNumber() || 0),
            0,
          ),
          uniqueClients: uniqueClients.length,
          topServices: formattedTopServices,
        },
      });
    } catch (error) {
      console.error("Erreur statistiques:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Demander la vérification
   */
  static async requestVerification(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const { documents } = req.body;

      if (user.role !== Role.PRESTATAIRE) {
        res
          .status(403)
          .json({ success: false, message: "Accès réservé aux prestataires" });
        return;
      }

      await prisma.verificationRequest.create({
        data: {
          userId: user.id,
          documents: documents as any,
          status: "pending",
        },
      });

      res.json({
        success: true,
        message: "Demande de vérification envoyée",
      });
    } catch (error) {
      console.error("Erreur demande vérification:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }
}

export default ProviderController;

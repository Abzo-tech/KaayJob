/**
 * Contrôleur pour les avis/notes
 * Gère les opérations sur les reviews
 * Utilise Prisma pour les queries
 */

import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export class ReviewController {
  /**
   * Liste des avis avec filtres (admin)
   */
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const {
        providerId,
        serviceId,
        minRating,
        page = 1,
        limit = 20,
      } = req.query as any;
      const skip = (Number(page) - 1) * Number(limit);

      // Only admins can see all reviews
      if (user.role !== "ADMIN") {
        res.status(403).json({
          success: false,
          message: "Accès réservé aux administrateurs",
        });
        return;
      }

      const where: any = {};

      if (providerId) {
        where.providerId = providerId;
      }

      if (serviceId) {
        where.serviceId = serviceId;
      }

      if (minRating) {
        where.rating = { gte: Number(minRating) };
      }

      const [reviews, total] = await Promise.all([
        prisma.review.findMany({
          where,
          include: {
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
            service: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: Number(limit),
        }),
        prisma.review.count({ where }),
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
      console.error("Erreur liste avis:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Obtenir les avis d'un service
   */
  static async getByService(req: Request, res: Response): Promise<void> {
    try {
      const { serviceId } = req.params;
      const { page = 1, limit = 20 } = req.query as any;
      const skip = (Number(page) - 1) * Number(limit);

      const [reviews, total] = await Promise.all([
        prisma.review.findMany({
          where: { serviceId },
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
        prisma.review.count({ where: { serviceId } }),
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
      console.error("Erreur avis par service:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Obtenir les avis d'un prestataire
   */
  static async getByProvider(req: Request, res: Response): Promise<void> {
    try {
      const { providerId } = req.params;
      const { page = 1, limit = 20 } = req.query as any;
      const skip = (Number(page) - 1) * Number(limit);

      const [reviews, total] = await Promise.all([
        prisma.review.findMany({
          where: { providerId },
          include: {
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
            service: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: Number(limit),
        }),
        prisma.review.count({ where: { providerId } }),
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
      console.error("Erreur avis par prestataire:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Obtenir l'avis d'une réservation
   */
  static async getByBooking(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId } = req.params;

      const review = await prisma.review.findUnique({
        where: { bookingId },
        include: {
          client: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      if (!review) {
        res.json({ success: true, data: null });
        return;
      }

      res.json({ success: true, data: review });
    } catch (error) {
      console.error("Erreur avis par réservation:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Créer un avis
   */
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const { bookingId, rating, comment } = req.body;

      // Check booking exists and is completed
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          service: true,
        },
      });

      if (!booking) {
        res
          .status(404)
          .json({ success: false, message: "Réservation non trouvée" });
        return;
      }

      // Check user is the client
      if (booking.clientId !== user.id) {
        res.status(403).json({ success: false, message: "Accès refusé" });
        return;
      }

      // Check booking is completed
      if (booking.status !== "COMPLETED") {
        res.status(400).json({
          success: false,
          message:
            "Vous ne pouvez laisser un avis que sur une réservation terminée",
        });
        return;
      }

      // Get provider profile ID (not user ID)
      const providerProfile = await prisma.providerProfile.findUnique({
        where: { userId: booking.service.providerId },
      });

      if (!providerProfile) {
        res.status(404).json({
          success: false,
          message: "Profil prestataire non trouvé",
        });
        return;
      }

      // Check review doesn't already exist
      console.log("Checking existing review for bookingId:", bookingId);
      const existingReview = await prisma.review.findUnique({
        where: { bookingId },
      });
      console.log("Existing review check result:", existingReview);

      if (existingReview) {
        res.status(400).json({
          success: false,
          message: "Vous avez déjà laissé un avis pour cette réservation",
        });
        return;
      }

      // Debug logging before creating review
      console.log("Creating review with data:");
      console.log("- bookingId:", bookingId);
      console.log("- clientId:", user.id);
      console.log("- providerId (profile):", providerProfile.id);
      console.log("- serviceId:", booking.serviceId);
      console.log("- rating:", rating);
      console.log("- comment:", comment);

      // Create review
      const review = await prisma.review.create({
        data: {
          bookingId,
          clientId: user.id,
          providerId: providerProfile.id, // Use provider profile ID
          serviceId: booking.serviceId,
          rating,
          comment,
        },
      });

      // Update provider stats
      const stats = await prisma.review.aggregate({
        where: { providerId: providerProfile.id },
        _avg: { rating: true },
        _count: true,
      });

      await prisma.providerProfile.update({
        where: { id: providerProfile.id },
        data: {
          rating: stats._avg.rating || 0,
          totalReviews: stats._count,
        },
      });

      res.status(201).json({
        success: true,
        message: "Avis créé",
        data: review,
      });
    } catch (error) {
      console.error("Erreur création avis:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Mettre à jour un avis
   */
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const { id } = req.params;
      const { rating, comment } = req.body;

      const review = await prisma.review.findUnique({
        where: { id },
      });

      if (!review) {
        res.status(404).json({ success: false, message: "Avis non trouvé" });
        return;
      }

      // Check rights (author or admin)
      if (review.clientId !== user.id && user.role !== "ADMIN") {
        res.status(403).json({ success: false, message: "Accès refusé" });
        return;
      }

      const updated = await prisma.review.update({
        where: { id },
        data: {
          ...(rating !== undefined && { rating }),
          ...(comment !== undefined && { comment }),
        },
      });

      // Update provider stats
      const stats = await prisma.review.aggregate({
        where: { providerId: review.providerId },
        _avg: { rating: true },
      });

      await prisma.providerProfile.update({
        where: { id: review.providerId },
        data: {
          rating: stats._avg.rating || 0,
        },
      });

      res.json({
        success: true,
        message: "Avis mis à jour",
        data: updated,
      });
    } catch (error) {
      console.error("Erreur mise à jour avis:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Supprimer un avis
   */
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const { id } = req.params;

      const review = await prisma.review.findUnique({
        where: { id },
      });

      if (!review) {
        res.status(404).json({ success: false, message: "Avis non trouvé" });
        return;
      }

      // Check rights (author or admin)
      if (review.clientId !== user.id && user.role !== "ADMIN") {
        res.status(403).json({ success: false, message: "Accès refusé" });
        return;
      }

      await prisma.review.delete({
        where: { id },
      });

      // Update provider stats
      const stats = await prisma.review.aggregate({
        where: { providerId: review.providerId },
        _avg: { rating: true },
        _count: true,
      });

      await prisma.providerProfile.update({
        where: { id: review.providerId },
        data: {
          rating: stats._avg.rating || 0,
          totalReviews: Math.max(0, stats._count - 1),
        },
      });

      res.json({ success: true, message: "Avis supprimé" });
    } catch (error) {
      console.error("Erreur suppression avis:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }
}

export default ReviewController;

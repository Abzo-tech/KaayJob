/**
 * Contrôleur pour les services
 * Gère les opérations CRUD sur les services via Prisma
 */

import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { IServiceCreate, IServiceUpdate, IServiceFilter } from "../interfaces";

const normalizePriceTypeInput = (priceType?: string): string => {
  return (priceType?.toUpperCase()) || "FIXED";
};

const normalizeServiceOutput = <T extends { priceType?: string | null }>(service: T): T => ({
  ...service,
  priceType: service.priceType ? service.priceType.toLowerCase() : service.priceType,
});

export class ServiceController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const {
        category,
        provider,
        search,
        page = 1,
        limit = 12,
        minPrice,
        maxPrice,
      } = req.query as unknown as IServiceFilter;

      const parsedLimit = Number(limit);
      const parsedPage = Number(page);
      const offset = (parsedPage - 1) * parsedLimit;

      const where: any = { isActive: true };
      if (category) {
        where.categoryId = category;
      }
      if (provider) {
        where.providerId = provider;
      }
      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }
      if (minPrice !== undefined) {
        where.price = { ...where.price, gte: Number(minPrice) };
      }
      if (maxPrice !== undefined) {
        where.price = { ...where.price, lte: Number(maxPrice) };
      }

      const total = await prisma.service.count({ where });
      const services = await prisma.service.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: parsedLimit,
        include: {
          category: true,
          provider: {
            include: {
              user: true,
            },
          },
        },
      });

      const response = services.map((service) => ({
        id: service.id,
        name: service.name,
        description: service.description,
        price: Number(service.price.toString()),
        priceType: service.priceType?.toLowerCase(),
        duration: service.duration,
        isActive: service.isActive,
        createdAt: service.createdAt,
        category: service.category
          ? {
              id: service.category.id,
              name: service.category.name,
              slug: service.category.slug,
            }
          : null,
        provider: service.provider
          ? {
              id: service.provider.id,
              userId: service.provider.userId,
              rating: Number(service.provider.rating.toString()),
              totalReviews: service.provider.totalReviews,
              isVerified: service.provider.isVerified,
              user: {
                id: service.provider.user.id,
                firstName: service.provider.user.firstName,
                lastName: service.provider.user.lastName,
              },
            }
          : null,
      }));

      res.json({
        success: true,
        data: response.map((service) => normalizeServiceOutput(service)),
        pagination: {
          page: parsedPage,
          limit: parsedLimit,
          total,
          totalPages: parsedLimit > 0 ? Math.ceil(total / parsedLimit) : 1,
        },
      });
    } catch (error) {
      console.error("Erreur liste services:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const service = await prisma.service.findUnique({
        where: { id },
        include: {
          category: true,
          provider: {
            include: {
              user: true,
            },
          },
          reviews: {
            orderBy: { createdAt: "desc" },
            take: 5,
            include: {
              client: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatar: true,
                },
              },
            },
          },
        },
      });

      if (!service || !service.isActive) {
        res.status(404).json({ success: false, message: "Service non trouvé" });
        return;
      }

      const response = {
        id: service.id,
        name: service.name,
        description: service.description,
        price: Number(service.price.toString()),
        priceType: service.priceType?.toLowerCase(),
        duration: service.duration,
        isActive: service.isActive,
        createdAt: service.createdAt,
        category: service.category
          ? {
              id: service.category.id,
              name: service.category.name,
              slug: service.category.slug,
            }
          : null,
        provider: service.provider
          ? {
              id: service.provider.id,
              userId: service.provider.userId,
              rating: Number(service.provider.rating.toString()),
              totalReviews: service.provider.totalReviews,
              isVerified: service.provider.isVerified,
              user: {
                id: service.provider.user.id,
                firstName: service.provider.user.firstName,
                lastName: service.provider.user.lastName,
                email: service.provider.user.email,
                avatar: service.provider.user.avatar,
              },
            }
          : null,
        reviews: service.reviews.map((review) => ({
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
          client: {
            firstName: review.client?.firstName,
            lastName: review.client?.lastName,
            avatar: review.client?.avatar,
          },
        })),
      };

      res.json({ success: true, data: normalizeServiceOutput(response) });
    } catch (error) {
      console.error("Erreur service par ID:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user || user.role?.toUpperCase() !== "PRESTATAIRE") {
        res.status(403).json({ success: false, message: "Accès réservé aux prestataires" });
        return;
      }

      const { name, description, categoryId, price, priceType, duration } = req.body as IServiceCreate;
      if (!name || !categoryId || price === undefined || price === null) {
        res.status(400).json({ success: false, message: "Nom, catégorie et prix sont requis" });
        return;
      }

      const provider = await prisma.providerProfile.findUnique({
        where: { userId: user.id },
      });

      if (!provider) {
        res.status(400).json({ success: false, message: "Profil prestataire non trouvé. Veuillez compléter votre profil d'abord." });
        return;
      }

      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        res.status(400).json({ success: false, message: "Catégorie non trouvée" });
        return;
      }

      const normalizedPriceType = normalizePriceTypeInput(priceType as string);
      const service = await prisma.service.create({
        data: {
          providerId: provider.userId,
          categoryId,
          name,
          description,
          price: price as any,
          priceType: normalizedPriceType as any,
          duration: duration ?? 60,
          isActive: true,
        },
        include: {
          category: true,
          provider: {
            include: { user: true },
          },
        },
      });

      const response = {
        id: service.id,
        name: service.name,
        description: service.description,
        price: Number(service.price.toString()),
        priceType: service.priceType?.toLowerCase(),
        duration: service.duration,
        isActive: service.isActive,
        createdAt: service.createdAt,
        category: service.category
          ? {
              id: service.category.id,
              name: service.category.name,
              slug: service.category.slug,
            }
          : null,
        provider: {
          id: service.provider.id,
          userId: service.provider.userId,
          rating: Number(service.provider.rating.toString()),
          totalReviews: service.provider.totalReviews,
          isVerified: service.provider.isVerified,
          user: {
            id: service.provider.user.id,
            firstName: service.provider.user.firstName,
            lastName: service.provider.user.lastName,
          },
        },
      };

      res.status(201).json({ success: true, message: "Service créé avec succès", data: normalizeServiceOutput(response) });
    } catch (error: any) {
      console.error("Erreur création service:", error);
      if (error.code === "P2002") {
        res.status(400).json({ success: false, message: "Un service avec ce nom existe déjà pour ce prestataire" });
      } else {
        res.status(500).json({ success: false, message: "Erreur serveur" });
      }
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = (req as any).user;
      const updates = req.body as IServiceUpdate;

      const service = await prisma.service.findUnique({
        where: { id },
        include: {
          provider: true,
        },
      });

      if (!service) {
        res.status(404).json({ success: false, message: "Service non trouvé" });
        return;
      }

      if (service.provider.userId !== user.id) {
        res.status(403).json({ success: false, message: "Accès non autorisé" });
        return;
      }

      if (updates.categoryId) {
        const category = await prisma.category.findUnique({ where: { id: updates.categoryId } });
        if (!category) {
          res.status(400).json({ success: false, message: "Catégorie non trouvée" });
          return;
        }
      }

      const data: any = {};
      if (updates.name !== undefined) data.name = updates.name;
      if (updates.description !== undefined) data.description = updates.description;
      if (updates.categoryId !== undefined) data.categoryId = updates.categoryId;
      if (updates.price !== undefined) data.price = updates.price as any;
      if (updates.priceType !== undefined) data.priceType = normalizePriceTypeInput(updates.priceType);
      if (updates.duration !== undefined) data.duration = updates.duration;
      if (updates.isActive !== undefined) data.isActive = updates.isActive;

      if (Object.keys(data).length === 0) {
        res.status(400).json({ success: false, message: "Aucune donnée à mettre à jour" });
        return;
      }

      const updatedService = await prisma.service.update({
        where: { id },
        data,
        include: {
          category: true,
          provider: {
            include: { user: true },
          },
        },
      });

      const response = {
        id: updatedService.id,
        name: updatedService.name,
        description: updatedService.description,
        price: Number(updatedService.price.toString()),
        priceType: updatedService.priceType?.toLowerCase(),
        duration: updatedService.duration,
        isActive: updatedService.isActive,
        createdAt: updatedService.createdAt,
        category: updatedService.category
          ? {
              id: updatedService.category.id,
              name: updatedService.category.name,
              slug: updatedService.category.slug,
            }
          : null,
        provider: {
          id: updatedService.provider.id,
          userId: updatedService.provider.userId,
          rating: Number(updatedService.provider.rating.toString()),
          totalReviews: updatedService.provider.totalReviews,
          isVerified: updatedService.provider.isVerified,
          user: {
            id: updatedService.provider.user.id,
            firstName: updatedService.provider.user.firstName,
            lastName: updatedService.provider.user.lastName,
          },
        },
      };

      res.json({ success: true, message: "Service mis à jour avec succès", data: normalizeServiceOutput(response) });
    } catch (error: any) {
      console.error("Erreur mise à jour service:", error);
      if (error.code === "P2002") {
        res.status(400).json({ success: false, message: "Un service avec ce nom existe déjà pour ce prestataire" });
      } else {
        res.status(500).json({ success: false, message: "Erreur serveur" });
      }
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = (req as any).user;

      const service = await prisma.service.findUnique({
        where: { id },
        include: { provider: true },
      });

      if (!service) {
        res.status(404).json({ success: false, message: "Service non trouvé" });
        return;
      }

      if (service.provider.userId !== user.id) {
        res.status(403).json({ success: false, message: "Accès non autorisé" });
        return;
      }

      const activeBookingCount = await prisma.booking.count({
        where: {
          serviceId: id,
          status: { in: ["PENDING", "CONFIRMED", "IN_PROGRESS"] },
        },
      });

      if (activeBookingCount > 0) {
        res.status(400).json({ success: false, message: "Impossible de supprimer ce service car il a des réservations actives" });
        return;
      }

      await prisma.service.update({
        where: { id },
        data: { isActive: false },
      });

      res.json({ success: true, message: "Service supprimé avec succès" });
    } catch (error) {
      console.error("Erreur suppression service:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  static async getByProvider(req: Request, res: Response): Promise<void> {
    try {
      const { providerId } = req.params;
      const services = await prisma.service.findMany({
        where: { providerId, isActive: true },
        orderBy: { createdAt: "desc" },
        include: { category: true },
      });

      const response = services.map((service) => ({
        id: service.id,
        name: service.name,
        description: service.description,
        price: Number(service.price.toString()),
        priceType: service.priceType?.toLowerCase(),
        duration: service.duration,
        isActive: service.isActive,
        createdAt: service.createdAt,
        category: service.category
          ? {
              id: service.category.id,
              name: service.category.name,
              slug: service.category.slug,
            }
          : null,
      }));

      res.json({ success: true, data: response.map((service) => normalizeServiceOutput(service)) });
    } catch (error) {
      console.error("Erreur services par prestataire:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }
}

export default ServiceController;

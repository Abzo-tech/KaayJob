/**
 * Contrôleur pour les services
 * Gère les opérations CRUD sur les services
 * Utilise Prisma pour les opérations数据库
 */

import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { PriceType } from "@prisma/client";
import { IServiceCreate, IServiceUpdate, IServiceFilter } from "../interfaces";

export class ServiceController {
  /**
   * Liste des services avec filtres et pagination
   */
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

      const skip = (Number(page) - 1) * Number(limit);

      // Construire les where conditions
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

      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price.gte = Number(minPrice);
        if (maxPrice) where.price.lte = Number(maxPrice);
      }

      // Compter le total
      const total = await prisma.service.count({ where });

      // Récupérer les services
      const services = await prisma.service.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
          provider: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });

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
      console.error("Erreur liste services:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Obtenir un service par ID
   */
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const service = await prisma.service.findUnique({
        where: { id },
        include: {
          category: true,
          provider: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                  avatar: true,
                },
              },
            },
          },
        },
      });

      if (!service) {
        res.status(404).json({ success: false, message: "Service non trouvé" });
        return;
      }

      // Récupérer les reviews du service
      const reviews = await prisma.review.findMany({
        where: { serviceId: id },
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          client: {
            select: {
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
      });

      res.json({
        success: true,
        data: {
          ...service,
          reviews,
        },
      });
    } catch (error) {
      console.error("Erreur récupération service:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Créer un nouveau service (prestataire)
   */
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;

      if (user.role !== "prestataire" && user.role !== "PRESTATAIRE") {
        res.status(403).json({ success: false, message: "Accès réservé aux prestataires" });
        return;
      }

      const { name, description, categoryId, price, priceType, duration } =
        req.body as IServiceCreate;

      // Get the provider profile for this user
      const providerProfile = await prisma.providerProfile.findUnique({
        where: { userId: user.id },
      });

      if (!providerProfile) {
        res.status(400).json({ success: false, message: "Profil prestataire non trouvé. Veuillez compléter votre profil d'abord." });
        return;
      }

      const service = await prisma.service.create({
        data: {
          providerId: providerProfile.id, // Use ProviderProfile.id, not user.id
          categoryId,
          name,
          description,
          price,
          priceType: (priceType?.toUpperCase() as PriceType) || "FIXED",
          duration,
          isActive: true,
        },
      });

      res.status(201).json({
        success: true,
        message: "Service créé",
        data: service,
      });
    } catch (error) {
      console.error("Erreur création service:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Mettre à jour un service
   */
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = (req as any).user;
      const updates = req.body as IServiceUpdate;

      // Vérifier la propriété
      const existing = await prisma.service.findUnique({
        where: { id },
      });

      if (!existing) {
        res.status(404).json({ success: false, message: "Service non trouvé" });
        return;
      }

      // Check ownership - need to get the provider profile for this user
      const providerProfileForUpdate = await prisma.providerProfile.findUnique({
        where: { userId: user.id },
      });

      if (!providerProfileForUpdate) {
        res.status(403).json({ success: false, message: "Accès refusé" });
        return;
      }

      if (existing.providerId !== providerProfileForUpdate.id && user.role !== "admin" && user.role !== "ADMIN") {
        res.status(403).json({ success: false, message: "Accès refusé" });
        return;
      }

      const updateData: any = {};
      if (updates.name) updateData.name = updates.name;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.categoryId) updateData.categoryId = updates.categoryId;
      if (updates.price) updateData.price = updates.price;
      if (updates.priceType) updateData.priceType = updates.priceType.toUpperCase();
      if (updates.duration !== undefined) updateData.duration = updates.duration;
      if (updates.isActive !== undefined) updateData.isActive = updates.isActive;

      const service = await prisma.service.update({
        where: { id },
        data: updateData,
      });

      res.json({
        success: true,
        message: "Service mis à jour",
        data: service,
      });
    } catch (error) {
      console.error("Erreur mise à jour service:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Supprimer un service
   */
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = (req as any).user;

      const existing = await prisma.service.findUnique({
        where: { id },
      });

      if (!existing) {
        res.status(404).json({ success: false, message: "Service non trouvé" });
        return;
      }

      // Check ownership - need to get the provider profile for this user
      const providerProfileForDelete = await prisma.providerProfile.findUnique({
        where: { userId: user.id },
      });

      if (!providerProfileForDelete) {
        res.status(403).json({ success: false, message: "Accès refusé" });
        return;
      }

      if (existing.providerId !== providerProfileForDelete.id && user.role !== "admin" && user.role !== "ADMIN") {
        res.status(403).json({ success: false, message: "Accès refusé" });
        return;
      }

      await prisma.service.delete({
        where: { id },
      });

      res.json({ success: true, message: "Service supprimé" });
    } catch (error) {
      console.error("Erreur suppression service:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Obtenir les services d'un prestataire
   */
  static async getByProvider(req: Request, res: Response): Promise<void> {
    try {
      const { providerId } = req.params;

      const services = await prisma.service.findMany({
        where: { providerId, isActive: true },
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
        },
      });

      res.json({ success: true, data: services });
    } catch (error) {
      console.error("Erreur récupération services prestataire:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }
}

export default ServiceController;

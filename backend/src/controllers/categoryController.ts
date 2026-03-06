/**
 * Contrôleur pour les catégories
 * Gère les opérations CRUD sur les catégories de services
 * Utilise Prisma pour les queries
 */

import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export class CategoryController {
  /**
   * Liste des catégories
   */
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { parentOnly, activeOnly } = req.query as any;

      const where: any = {};

      if (activeOnly === "true") {
        where.isActive = true;
      }

      if (parentOnly === "true") {
        where.parentId = null;
      }

      const categories = await prisma.category.findMany({
        where,
        orderBy: { name: "asc" },
      });

      res.json({ success: true, data: categories });
    } catch (error) {
      console.error("Erreur liste catégories:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Obtenir une catégorie par ID
   */
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          parent: {
            select: {
              id: true,
              name: true,
            },
          },
          children: true,
          _count: {
            select: {
              services: {
                where: { isActive: true },
              },
            },
          },
        },
      });

      if (!category) {
        res
          .status(404)
          .json({ success: false, message: "Catégorie non trouvée" });
        return;
      }

      res.json({ success: true, data: category });
    } catch (error) {
      console.error("Erreur récupération catégorie:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Obtenir une catégorie par slug
   */
  static async getBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;

      const category = await prisma.category.findUnique({
        where: { slug },
        include: {
          _count: {
            select: {
              services: {
                where: { isActive: true },
              },
            },
          },
        },
      });

      if (!category) {
        res
          .status(404)
          .json({ success: false, message: "Catégorie non trouvée" });
        return;
      }

      res.json({ success: true, data: category });
    } catch (error) {
      console.error("Erreur récupération catégorie:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Créer une catégorie (admin)
   */
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;

      if (user.role !== "ADMIN") {
        res
          .status(403)
          .json({
            success: false,
            message: "Accès réservé aux administrateurs",
          });
        return;
      }

      const { name, slug, description, icon, image, parentId } = req.body;

      // Check if slug exists
      const existing = await prisma.category.findUnique({
        where: { slug: slug || name.toLowerCase().replace(/\s+/g, "-") },
      });

      if (existing) {
        res
          .status(400)
          .json({ success: false, message: "Ce slug existe déjà" });
        return;
      }

      const category = await prisma.category.create({
        data: {
          name,
          slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
          description,
          icon,
          image,
          parentId: parentId || null,
        },
      });

      res.status(201).json({
        success: true,
        message: "Catégorie créée",
        data: category,
      });
    } catch (error) {
      console.error("Erreur création catégorie:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Mettre à jour une catégorie (admin)
   */
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const { id } = req.params;

      if (user.role !== "ADMIN") {
        res
          .status(403)
          .json({
            success: false,
            message: "Accès réservé aux administrateurs",
          });
        return;
      }

      const { name, slug, description, icon, image, parentId, isActive } =
        req.body;

      const category = await prisma.category.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(slug && { slug }),
          ...(description !== undefined && { description }),
          ...(icon !== undefined && { icon }),
          ...(image !== undefined && { image }),
          ...(parentId !== undefined && { parentId: parentId || null }),
          ...(isActive !== undefined && { isActive }),
        },
      });

      res.json({
        success: true,
        message: "Catégorie mise à jour",
        data: category,
      });
    } catch (error) {
      console.error("Erreur mise à jour catégorie:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Supprimer une catégorie (admin)
   */
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const { id } = req.params;

      if (user.role !== "ADMIN") {
        res
          .status(403)
          .json({
            success: false,
            message: "Accès réservé aux administrateurs",
          });
        return;
      }

      // Check if category has services
      const serviceCount = await prisma.service.count({
        where: { categoryId: id },
      });

      if (serviceCount > 0) {
        res.status(400).json({
          success: false,
          message:
            "Impossible de supprimer une catégorie qui contient des services",
        });
        return;
      }

      await prisma.category.delete({
        where: { id },
      });

      res.json({ success: true, message: "Catégorie supprimée" });
    } catch (error) {
      console.error("Erreur suppression catégorie:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Obtenir les services d'une catégorie
   */
  static async getServices(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const {
        page = 1,
        limit = 20,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query as any;
      const skip = (Number(page) - 1) * Number(limit);

      const validSortFields = ["name", "price", "createdAt"];
      const orderBy: any = {};
      orderBy[validSortFields.includes(sortBy) ? sortBy : "createdAt"] =
        sortOrder === "asc" ? "asc" : "desc";

      const [services, total] = await Promise.all([
        prisma.service.findMany({
          where: {
            categoryId: id,
            isActive: true,
          },
          include: {
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
            _count: {
              select: {
                reviews: true,
              },
            },
          },
          orderBy,
          skip,
          take: Number(limit),
        }),
        prisma.service.count({
          where: {
            categoryId: id,
            isActive: true,
          },
        }),
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
      console.error("Erreur services de catégorie:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }
}

export default CategoryController;

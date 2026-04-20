"use strict";
/**
 * Contrôleur pour les catégories
 * Gère les opérations CRUD sur les catégories de services
 * Utilise Prisma pour toutes les opérations de données
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const prisma_1 = require("../config/prisma");
class CategoryController {
    /**
     * Lister toutes les catégories
     */
    static async getAll(req, res) {
        try {
            const { parentOnly, activeOnly } = req.query;
            const categories = await prisma_1.prisma.category.findMany({
                where: {
                    parentId: parentOnly === "true" ? null : undefined,
                    isActive: activeOnly === "true" ? true : undefined,
                },
                orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
            });
            res.json({
                success: true,
                data: categories.map((category) => ({
                    id: category.id,
                    name: category.name,
                    slug: category.slug,
                    description: category.description,
                    icon: category.icon,
                    image: category.image,
                    isActive: category.isActive,
                    displayOrder: category.displayOrder,
                    parentId: category.parentId,
                    createdAt: category.createdAt,
                })),
            });
        }
        catch (error) {
            console.error("Erreur récupération catégorie:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
    /**
     * Récupérer une catégorie par son ID
     */
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const category = await prisma_1.prisma.category.findUnique({
                where: { id },
            });
            if (!category) {
                res.status(404).json({ success: false, message: "Catégorie non trouvée" });
                return;
            }
            res.json({
                success: true,
                data: {
                    id: category.id,
                    name: category.name,
                    slug: category.slug,
                    description: category.description,
                    icon: category.icon,
                    image: category.image,
                    isActive: category.isActive,
                    displayOrder: category.displayOrder,
                    parentId: category.parentId,
                    createdAt: category.createdAt,
                },
            });
        }
        catch (error) {
            console.error("Erreur récupération catégorie:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
    /**
     * Créer une catégorie (admin)
     */
    static async create(req, res) {
        try {
            const user = req.user;
            if (!user?.id || user.role?.toUpperCase() !== "ADMIN") {
                res.status(403).json({ success: false, message: "Accès refusé" });
                return;
            }
            const { name, slug, description, icon, image, isActive, displayOrder, parentId } = req.body;
            const category = await prisma_1.prisma.category.create({
                data: {
                    name,
                    slug,
                    description,
                    icon,
                    image,
                    isActive: isActive !== undefined ? isActive : true,
                    displayOrder: displayOrder ?? 0,
                    parentId: parentId || null,
                },
            });
            res.status(201).json({
                success: true,
                data: {
                    id: category.id,
                    name: category.name,
                    slug: category.slug,
                    description: category.description,
                    icon: category.icon,
                    image: category.image,
                    isActive: category.isActive,
                    displayOrder: category.displayOrder,
                    parentId: category.parentId,
                    createdAt: category.createdAt,
                },
            });
        }
        catch (error) {
            console.error("Erreur création catégorie:", error);
            if (error.code === "P2002") {
                res.status(400).json({ success: false, message: "Ce slug de catégorie existe déjà" });
            }
            else {
                res.status(500).json({ success: false, message: "Erreur serveur" });
            }
        }
    }
    /**
     * Mettre à jour une catégorie (admin)
     */
    static async update(req, res) {
        try {
            const user = req.user;
            if (!user?.id || user.role?.toUpperCase() !== "ADMIN") {
                res.status(403).json({ success: false, message: "Accès refusé" });
                return;
            }
            const { id } = req.params;
            const { name, slug, description, icon, image, isActive, displayOrder, parentId } = req.body;
            const category = await prisma_1.prisma.category.update({
                where: { id },
                data: {
                    name,
                    slug,
                    description,
                    icon,
                    image,
                    isActive,
                    displayOrder,
                    parentId: parentId ?? null,
                },
            });
            res.json({
                success: true,
                data: {
                    id: category.id,
                    name: category.name,
                    slug: category.slug,
                    description: category.description,
                    icon: category.icon,
                    image: category.image,
                    isActive: category.isActive,
                    displayOrder: category.displayOrder,
                    parentId: category.parentId,
                    createdAt: category.createdAt,
                },
            });
        }
        catch (error) {
            console.error("Erreur mise à jour catégorie:", error);
            if (error.code === "P2002") {
                res.status(400).json({ success: false, message: "Ce slug de catégorie existe déjà" });
            }
            else {
                res.status(500).json({ success: false, message: "Erreur serveur" });
            }
        }
    }
    /**
     * Supprimer une catégorie (admin)
     */
    static async delete(req, res) {
        try {
            const user = req.user;
            if (!user?.id || user.role?.toUpperCase() !== "ADMIN") {
                res.status(403).json({ success: false, message: "Accès refusé" });
                return;
            }
            const { id } = req.params;
            await prisma_1.prisma.category.delete({ where: { id } });
            res.json({ success: true, message: "Catégorie supprimée" });
        }
        catch (error) {
            console.error("Erreur suppression catégorie:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
    /**
     * Obtenir les services d'une catégorie
     */
    static async getServices(req, res) {
        try {
            const { id } = req.params;
            const services = await prisma_1.prisma.service.findMany({
                where: {
                    categoryId: id,
                    isActive: true,
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    duration: true,
                    isActive: true,
                    provider: {
                        select: {
                            user: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                    phone: true,
                                },
                            },
                        },
                    },
                },
                orderBy: { name: "asc" },
            });
            res.json({
                success: true,
                data: services.map((service) => ({
                    id: service.id,
                    name: service.name,
                    description: service.description,
                    price: parseFloat(service.price.toString()),
                    duration: service.duration,
                    isActive: service.isActive,
                    provider: {
                        firstName: service.provider?.user?.firstName,
                        lastName: service.provider?.user?.lastName,
                        phone: service.provider?.user?.phone,
                    },
                })),
            });
        }
        catch (error) {
            console.error("Erreur services catégorie:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
}
exports.CategoryController = CategoryController;
exports.default = CategoryController;
//# sourceMappingURL=categoryController.js.map
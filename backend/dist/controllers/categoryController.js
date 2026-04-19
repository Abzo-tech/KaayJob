"use strict";
/**
 * Contrôleur pour les catégories
 * Gère les opérations CRUD sur les catégories de services
 * Utilise Prisma pour les queries
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const prisma_1 = require("../config/prisma");
const database_1 = require("../config/database");
class CategoryController {
    /**
     * Lister toutes les catégories
     */
    static async getAll(req, res) {
        try {
            const { parentOnly, activeOnly } = req.query;
            console.log("📂 Requête catégories:", { parentOnly, activeOnly });
            // Utiliser Prisma au lieu de requête SQL directe
            const where = {};
            if (activeOnly === "true") {
                where.isActive = true;
            }
            if (parentOnly === "true") {
                where.parentId = null;
            }
            console.log("🔍 Filtre Prisma:", where);
            const categories = await prisma_1.prisma.category.findMany({
                where,
                orderBy: { name: 'asc' },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    description: true,
                    icon: true,
                    image: true,
                    isActive: true,
                    createdAt: true
                }
            });
            console.log("📊 Résultat:", categories.length, "catégories");
            res.json({
                success: true,
                data: categories
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
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    description: true,
                    icon: true,
                    image: true,
                    isActive: true,
                    createdAt: true
                }
            });
            if (!category) {
                res.status(404).json({ success: false, message: "Catégorie non trouvée" });
                return;
            }
            res.json({ success: true, data: category });
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
            const existing = await prisma_1.prisma.category.findUnique({
                where: { slug: slug || name.toLowerCase().replace(/\s+/g, "-") },
            });
            if (existing) {
                res
                    .status(400)
                    .json({ success: false, message: "Ce slug existe déjà" });
                return;
            }
            const category = await prisma_1.prisma.category.create({
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
        }
        catch (error) {
            console.error("Erreur création catégorie:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
    /**
     * Mettre à jour une catégorie (admin)
     */
    static async update(req, res) {
        try {
            const user = req.user;
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
            const { name, slug, description, icon, image, parentId, isActive } = req.body;
            const category = await prisma_1.prisma.category.update({
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
        }
        catch (error) {
            console.error("Erreur mise à jour catégorie:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
    /**
     * Supprimer une catégorie (admin)
     */
    static async delete(req, res) {
        try {
            const user = req.user;
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
            const serviceCount = await prisma_1.prisma.service.count({
                where: { categoryId: id },
            });
            if (serviceCount > 0) {
                res.status(400).json({
                    success: false,
                    message: "Impossible de supprimer une catégorie qui contient des services",
                });
                return;
            }
            await prisma_1.prisma.category.delete({
                where: { id },
            });
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
            const services = await (0, database_1.query)(`
        SELECT s.id, s.name, s.description, s.price, s.duration, s.is_active,
               p.first_name, p.last_name, p.phone
        FROM services s
        JOIN provider_profiles pp ON s.provider_id = pp.user_id
        JOIN users p ON pp.user_id = p.id
        WHERE s.category_id = $1 AND s.is_active = true
        ORDER BY s.name ASC
      `, [id]);
            res.json({ success: true, data: services.rows });
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
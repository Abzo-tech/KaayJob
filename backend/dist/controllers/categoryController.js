"use strict";
/**
 * Contrôleur pour les catégories
 * Gère les opérations CRUD sur les catégories de services
 * Utilise SQL direct pour éviter les problèmes Prisma en production
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const database_1 = require("../config/database");
class CategoryController {
    /**
     * Lister toutes les catégories
     */
    static async getAll(req, res) {
        try {
            const { parentOnly, activeOnly } = req.query;
            let sql = `SELECT id, name, slug, description, icon, image, is_active, display_order, parent_id, created_at 
                 FROM categories WHERE 1=1`;
            const params = [];
            if (activeOnly === "true") {
                sql += ` AND is_active = true`;
            }
            if (parentOnly === "true") {
                sql += ` AND parent_id IS NULL`;
            }
            sql += ` ORDER BY display_order ASC, name ASC`;
            const result = await (0, database_1.query)(sql, params);
            const categories = result.rows.map((row) => ({
                id: row.id,
                name: row.name,
                slug: row.slug,
                description: row.description,
                icon: row.icon,
                image: row.image,
                isActive: row.is_active,
                displayOrder: row.display_order,
                parentId: row.parent_id,
                createdAt: row.created_at,
            }));
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
            const result = await (0, database_1.query)(`SELECT id, name, slug, description, icon, image, is_active, display_order, parent_id, created_at 
         FROM categories WHERE id = $1`, [id]);
            if (result.rows.length === 0) {
                res.status(404).json({ success: false, message: "Catégorie non trouvée" });
                return;
            }
            const row = result.rows[0];
            res.json({
                success: true,
                data: {
                    id: row.id,
                    name: row.name,
                    slug: row.slug,
                    description: row.description,
                    icon: row.icon,
                    image: row.image,
                    isActive: row.is_active,
                    displayOrder: row.display_order,
                    parentId: row.parent_id,
                    createdAt: row.created_at,
                }
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
        res.status(501).json({ success: false, message: "Non implémenté" });
    }
    /**
     * Mettre à jour une catégorie (admin)
     */
    static async update(req, res) {
        res.status(501).json({ success: false, message: "Non implémenté" });
    }
    /**
     * Supprimer une catégorie (admin)
     */
    static async delete(req, res) {
        res.status(501).json({ success: false, message: "Non implémenté" });
    }
    /**
     * Obtenir les services d'une catégorie
     */
    static async getServices(req, res) {
        try {
            const { id } = req.params;
            const result = await (0, database_1.query)(`SELECT s.id, s.name, s.description, s.price, s.duration, s.is_active,
                p.first_name, p.last_name, p.phone
         FROM services s
         JOIN provider_profiles pp ON s.provider_id = pp.user_id
         JOIN users p ON pp.user_id = p.id
         WHERE s.category_id = $1 AND s.is_active = true
         ORDER BY s.name ASC`, [id]);
            res.json({ success: true, data: result.rows });
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
"use strict";
/**
 * Service de catégories
 * Responsabilité: logique métier liée aux catégories
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryBySlug = exports.getCategoryById = exports.getAllCategories = void 0;
const database_ts_1 = require(".//config/database.ts");
/**
 * Obtient toutes les catégories actives
 */
const getAllCategories = async () => {
    const result = await database_ts_1.pool.query(`SELECT * FROM categories WHERE is_active = true ORDER BY display_order, name`);
    return result.rows.map(mapCategoryRow);
};
exports.getAllCategories = getAllCategories;
/**
 * Obtient une catégorie par ID
 */
const getCategoryById = async (id) => {
    const result = await database_ts_1.pool.query("SELECT * FROM categories WHERE id = $1", [
        id,
    ]);
    if (result.rows.length === 0)
        return null;
    return mapCategoryRow(result.rows[0]);
};
exports.getCategoryById = getCategoryById;
/**
 * Obtient une catégorie par slug
 */
const getCategoryBySlug = async (slug) => {
    const result = await database_ts_1.pool.query("SELECT * FROM categories WHERE slug = $1", [
        slug,
    ]);
    if (result.rows.length === 0)
        return null;
    return mapCategoryRow(result.rows[0]);
};
exports.getCategoryBySlug = getCategoryBySlug;
function mapCategoryRow(row) {
    return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        icon: row.icon,
        image: row.image,
        isActive: row.is_active,
        displayOrder: row.display_order,
    };
}
//# sourceMappingURL=CategoryService.js.map
"use strict";
/**
 * Service de gestion des services (offres des prestataires)
 * Responsabilité: logique métier liée aux services
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteService = exports.updateService = exports.createService = exports.getServiceById = exports.getServicesByProvider = void 0;
const database_ts_1 = require(".//config/database.ts");
/**
 * Obtient les services d'un prestataire
 */
const getServicesByProvider = async (providerId) => {
    const result = await database_ts_1.pool.query("SELECT * FROM services WHERE provider_id = $1 AND is_active = true ORDER BY name", [providerId]);
    return result.rows.map(mapServiceRow);
};
exports.getServicesByProvider = getServicesByProvider;
/**
 * Obtient un service par ID
 */
const getServiceById = async (id) => {
    const result = await database_ts_1.pool.query("SELECT * FROM services WHERE id = $1", [id]);
    if (result.rows.length === 0)
        return null;
    return mapServiceRow(result.rows[0]);
};
exports.getServiceById = getServiceById;
/**
 * Crée un nouveau service
 */
const createService = async (providerId, data) => {
    const result = await database_ts_1.pool.query(`INSERT INTO services (provider_id, category_id, name, description, price, price_type, duration, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, $7, true)
     RETURNING *`, [
        providerId,
        data.categoryId || null,
        data.name,
        data.description || null,
        data.price,
        data.priceType || "fixed",
        data.duration || null,
    ]);
    return mapServiceRow(result.rows[0]);
};
exports.createService = createService;
/**
 * Met à jour un service
 */
const updateService = async (id, providerId, data) => {
    const updates = [];
    const values = [];
    let paramIndex = 1;
    if (data.name !== undefined) {
        updates.push(`name = $${paramIndex++}`);
        values.push(data.name);
    }
    if (data.description !== undefined) {
        updates.push(`description = $${paramIndex++}`);
        values.push(data.description);
    }
    if (data.price !== undefined) {
        updates.push(`price = $${paramIndex++}`);
        values.push(data.price);
    }
    if (data.priceType !== undefined) {
        updates.push(`price_type = $${paramIndex++}`);
        values.push(data.priceType);
    }
    if (data.duration !== undefined) {
        updates.push(`duration = $${paramIndex++}`);
        values.push(data.duration);
    }
    if (data.isActive !== undefined) {
        updates.push(`is_active = $${paramIndex++}`);
        values.push(data.isActive);
    }
    values.push(id, providerId);
    const result = await database_ts_1.pool.query(`UPDATE services SET ${updates.join(", ")} WHERE id = $${paramIndex++} AND provider_id = $${paramIndex} RETURNING *`, values);
    if (result.rows.length === 0) {
        throw new Error("Service non trouvé");
    }
    return mapServiceRow(result.rows[0]);
};
exports.updateService = updateService;
/**
 * Supprime un service (désactivation)
 */
const deleteService = async (id, providerId) => {
    await database_ts_1.pool.query("UPDATE services SET is_active = false WHERE id = $1 AND provider_id = $2", [id, providerId]);
};
exports.deleteService = deleteService;
function mapServiceRow(row) {
    return {
        id: row.id,
        providerId: row.provider_id,
        categoryId: row.category_id,
        name: row.name,
        description: row.description,
        price: row.price,
        priceType: row.price_type,
        duration: row.duration,
        isActive: row.is_active,
    };
}
//# sourceMappingURL=ServiceManagementService.js.map
/**
 * Script pour mettre à jour les coordonnées géographiques des prestataires existants
 */

import { query } from "../config/database";

export async function updateProviderCoordinates(): Promise<void> {
  try {
    console.log("🌍 Mise à jour des coordonnées géographiques des prestataires...");

    // Récupérer tous les prestataires qui ont des coordonnées dans users mais pas dans provider_profiles
    const providersToUpdate = await query(`
      SELECT pp.id, pp.user_id, u.latitude, u.longitude, u.address
      FROM provider_profiles pp
      JOIN users u ON pp.user_id = u.id
      WHERE u.latitude IS NOT NULL AND u.longitude IS NOT NULL
        AND (pp.latitude IS NULL OR pp.longitude IS NULL)
    `);

    console.log(`📍 ${providersToUpdate.rows.length} prestataires à mettre à jour`);

    for (const provider of providersToUpdate.rows) {
      await query(`
        UPDATE provider_profiles
        SET latitude = $1, longitude = $2, location = $3, updated_at = NOW()
        WHERE id = $4
      `, [provider.latitude, provider.longitude, provider.address, provider.id]);

      console.log(`✅ Coordonnées mises à jour pour prestataire ${provider.id}`);
    }

    console.log("✅ Mise à jour des coordonnées terminée");
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour des coordonnées:", error);
  }
}
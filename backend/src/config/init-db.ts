/**
 * Script d'initialisation de la base de données
 */

import dotenv from "dotenv";
dotenv.config();

import { pool } from "./database";
import { schema } from "./schema";

export async function initializeDatabase(): Promise<void> {
  console.log("🔄 Initialisation de la base de données...");

  try {
    await pool.query(schema);
    console.log("✅ Tables créées");

    // Catégories par défaut
    const categories = [
      { name: "Ménage", slug: "menage", icon: "🧹" },
      { name: "Jardinage", slug: "jardinage", icon: "🌱" },
      { name: "Bricolage", slug: "bricolage", icon: "🔧" },
      { name: "Électricité", slug: "electricite", icon: "💡" },
      { name: "Plomberie", slug: "plomberie", icon: "🚿" },
    ];

    for (const cat of categories) {
      await pool.query(
        "INSERT INTO categories (name, slug, icon) VALUES ($1, $2, $3) ON CONFLICT (slug) DO NOTHING",
        [cat.name, cat.slug, cat.icon],
      );
    }
    console.log("✅ Catégories ajoutées");

    // Admin par défaut
    const bcrypt = await import("bcryptjs");
    const hashedPassword = await bcrypt.hash("Admin123!", 12);
    await pool.query(
      `INSERT INTO users (email, password, first_name, last_name, phone, role, is_active, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (email) DO NOTHING`,
      [
        "admin@kaayjob.sn",
        hashedPassword,
        "Admin",
        "KaayJob",
        "+221770000000",
        "admin",
        true,
        true,
      ],
    );
    console.log("✅ Admin créé");
    console.log("📧 Email: admin@kaayjob.sn");
    console.log("🔑 Mot de passe: Admin123!");

    console.log("🎉 Base de données initialisée!");
  } catch (error) {
    console.error("❌ Erreur:", error);
    throw error;
  }
}

if (require.main === module) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

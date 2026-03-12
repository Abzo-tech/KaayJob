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

    // Plans d'abonnement
    const plans = [
      {
        name: "Gratuit",
        slug: "gratuit",
        description: "Plan gratuit avec fonctionnalités de base",
        price: 0,
        duration: 0,
        features: JSON.stringify(["5 services maximum", "Visibilité standard", "Support par email"]),
        is_active: true,
        display_order: 1
      },
      {
        name: "Premium",
        slug: "premium",
        description: "Plan premium avec plus de visibilité",
        price: 9900,
        duration: 30,
        features: JSON.stringify(["Services illimités", "Badge VIP", "Visibilité prioritaire", "Support prioritaire", "Statistiques avancées"]),
        is_active: true,
        display_order: 2
      },
      {
        name: "Pro",
        slug: "pro",
        description: "Plan professionnel avec toutes les fonctionnalités",
        price: 24900,
        duration: 30,
        features: JSON.stringify(["Tout Premium", "Publication en premier", "Badge Pro", "Formation exclusive", "Gestion équipe"]),
        is_active: true,
        display_order: 3
      }
    ];

    for (const plan of plans) {
      await pool.query(
        `INSERT INTO subscription_plans (id, name, slug, description, price, duration, features, is_active, display_order, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()) ON CONFLICT (slug) DO NOTHING`,
        [plan.name, plan.slug, plan.description, plan.price, plan.duration, plan.features, plan.is_active, plan.display_order]
      );
    }
    console.log("✅ Plans d'abonnement ajoutés");

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

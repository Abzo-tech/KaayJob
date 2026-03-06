"use strict";
/**
 * Script d'initialisation de la base de données
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = initializeDatabase;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const database_1 = require("./database");
const schema_1 = require("./schema");
async function initializeDatabase() {
    console.log("🔄 Initialisation de la base de données...");
    try {
        await database_1.pool.query(schema_1.schema);
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
            await database_1.pool.query("INSERT INTO categories (name, slug, icon) VALUES ($1, $2, $3) ON CONFLICT (slug) DO NOTHING", [cat.name, cat.slug, cat.icon]);
        }
        console.log("✅ Catégories ajoutées");
        // Admin par défaut
        const bcrypt = await Promise.resolve().then(() => __importStar(require("bcryptjs")));
        const hashedPassword = await bcrypt.hash("Admin123!", 12);
        await database_1.pool.query(`INSERT INTO users (email, password, first_name, last_name, phone, role, is_active, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (email) DO NOTHING`, [
            "admin@kaayjob.sn",
            hashedPassword,
            "Admin",
            "KaayJob",
            "+221770000000",
            "admin",
            true,
            true,
        ]);
        console.log("✅ Admin créé");
        console.log("📧 Email: admin@kaayjob.sn");
        console.log("🔑 Mot de passe: Admin123!");
        console.log("🎉 Base de données initialisée!");
    }
    catch (error) {
        console.error("❌ Erreur:", error);
        throw error;
    }
}
if (require.main === module) {
    initializeDatabase()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}
//# sourceMappingURL=init-db.js.map
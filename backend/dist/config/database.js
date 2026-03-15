"use strict";
/**
 * Configuration de la base de données PostgreSQL
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = exports.pool = void 0;
exports.testConnection = testConnection;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pg_1 = require("pg");
// Parser DATABASE_URL si présent (format: postgresql://user:password@host:port/database)
function parseDatabaseUrl(url) {
    try {
        // La bibliothèque pg peut parser directement l'URL
        // Mais on peut aussi utiliser URL pour plus de contrôle
        const urlObj = new URL(url.replace(/^postgresql/, 'postgres'));
        return {
            host: urlObj.hostname,
            port: parseInt(urlObj.port) || 5432,
            database: urlObj.pathname.slice(1), // Enlever le /
            user: urlObj.username,
            password: urlObj.password,
        };
    }
    catch (e) {
        console.error('Erreur lors du parsing de DATABASE_URL:', e);
        return null;
    }
}
// Utiliser DATABASE_URL ou les variables individuelles
const dbConfig = process.env.DATABASE_URL
    ? parseDatabaseUrl(process.env.DATABASE_URL)
    : null;
console.log('📦 Configuration de la base de données:');
console.log('  - DATABASE_URL présent:', !!process.env.DATABASE_URL);
if (dbConfig) {
    console.log('  - Host:', dbConfig.host);
    console.log('  - Port:', dbConfig.port);
    console.log('  - Database:', dbConfig.database);
    console.log('  - User:', dbConfig.user);
}
else {
    console.log('  - Utilisation des variables individuelles');
}
exports.pool = new pg_1.Pool({
    host: dbConfig?.host || process.env.DB_HOST || "localhost",
    port: dbConfig?.port || parseInt(process.env.DB_PORT || "5432"),
    database: dbConfig?.database || process.env.DB_NAME || "kaayjob",
    user: dbConfig?.user || process.env.DB_USER || "postgres",
    password: dbConfig?.password || process.env.DB_PASSWORD || "postgres",
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
exports.pool.on("error", (err) => {
    console.error("Erreur inattendue avec la base de données:", err.message);
});
async function testConnection() {
    try {
        const result = await exports.pool.query("SELECT NOW()");
        console.log("✅ Connexion à la base de données établie");
        return true;
    }
    catch (error) {
        console.error("❌ Erreur de connexion à la base de données:", error);
        return false;
    }
}
const query = async (text, params) => {
    const start = Date.now();
    const result = await exports.pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === "development") {
        console.log("Requête exécutée", {
            text: text.substring(0, 50),
            duration,
            rows: result.rowCount,
        });
    }
    return result;
};
exports.query = query;
exports.default = { pool: exports.pool, testConnection, query: exports.query };
//# sourceMappingURL=database.js.map
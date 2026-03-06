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
exports.pool = new pg_1.Pool({
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    database: process.env.DB_NAME || "kaayjob",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
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
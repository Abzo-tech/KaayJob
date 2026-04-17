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
        // Le format Prisma Accelerate: postgres://username:password@host:port/database?sslmode=require
        // where password contains special characters like @ and :
        // We need to find the @ that separates user:password from host
        // Remove protocol
        let cleanUrl = url.replace(/^postgres:/, 'postgresql:');
        // Find the @ that's between the credentials and the host
        // The pattern is: protocol://username:password@host:port/database
        const atSignIndex = cleanUrl.indexOf('@');
        if (atSignIndex === -1)
            return null;
        // Extract everything before @ (credentials) and after @ (host+db)
        const credentials = cleanUrl.substring(cleanUrl.indexOf('://') + 3, atSignIndex);
        const hostPart = cleanUrl.substring(atSignIndex + 1);
        // Split credentials into user and password
        // The password may contain : or @ so we need to find the last : before @
        const lastColonInCredentials = credentials.lastIndexOf(':');
        const user = credentials.substring(0, lastColonInCredentials);
        const password = credentials.substring(lastColonInCredentials + 1);
        // Parse host part
        const slashIndex = hostPart.indexOf('/');
        const hostPort = hostPart.substring(0, slashIndex);
        const database = hostPart.substring(slashIndex + 1).split('?')[0];
        const [host, portStr] = hostPort.split(':');
        const port = parseInt(portStr) || 5432;
        return { user, password, host, port, database };
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
// console.log('📦 Configuration de la base de données:');
// console.log('  - DATABASE_URL présent:', !!process.env.DATABASE_URL);
// if (dbConfig) {
//   console.log('  - Host:', dbConfig.host);
//   console.log('  - Port:', dbConfig.port);
//   console.log('  - Database:', dbConfig.database);
//   console.log('  - User:', dbConfig.user);
// } else {
//   console.log('  - Utilisation des variables individuelles');
// }
// Configuration du pool de connexions
let poolConfig;
if (process.env.DATABASE_URL) {
    // Utiliser DATABASE_URL complète pour production
    poolConfig = {
        connectionString: process.env.DATABASE_URL,
        max: 10, // Réduire pour éviter les limites de connexions
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
        ssl: process.env.DATABASE_URL.includes('sslmode=require') ? { rejectUnauthorized: false } : false,
    };
    console.log('🔗 Pool configuré avec DATABASE_URL');
}
else {
    // Configuration locale pour développement
    poolConfig = {
        host: process.env.DB_HOST || "127.0.0.1",
        port: parseInt(process.env.DB_PORT || "5432"),
        database: process.env.DB_NAME || "kaayjob",
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "postgres",
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
    };
    console.log('🏠 Pool configuré avec variables individuelles');
}
exports.pool = new pg_1.Pool(poolConfig);
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
    let client = null;
    try {
        // Utiliser DATABASE_URL en production, sinon les variables individuelles
        let clientConfig;
        if (process.env.DATABASE_URL) {
            // Utiliser DATABASE_URL complète pour production
            clientConfig = {
                connectionString: process.env.DATABASE_URL,
                connectionTimeoutMillis: 10000,
                query_timeout: 15000,
                ssl: process.env.DATABASE_URL.includes('sslmode=require') ? { rejectUnauthorized: false } : false,
            };
        }
        else {
            // Configuration locale pour développement
            clientConfig = {
                host: process.env.DB_HOST || '127.0.0.1',
                port: parseInt(process.env.DB_PORT || '5432'),
                database: process.env.DB_NAME || 'kaayjob',
                user: process.env.DB_USER || 'postgres',
                password: process.env.DB_PASSWORD || 'postgres',
                connectionTimeoutMillis: 5000,
                query_timeout: 5000,
            };
        }
        client = new (require('pg')).Client(clientConfig);
        await client.connect();
        const result = await client.query(text, params);
        const duration = Date.now() - start;
        if (process.env.NODE_ENV === "development") {
            console.log("✅ Requête exécutée", {
                text: text.substring(0, 50),
                duration,
                rows: result.rowCount,
            });
        }
        return result;
    }
    catch (error) {
        console.error("❌ Erreur de requête:", error.message);
        throw error;
    }
    finally {
        if (client) {
            try {
                await client.end();
            }
            catch (e) {
                // Ignorer
            }
        }
    }
};
exports.query = query;
exports.default = { pool: exports.pool, testConnection, query: exports.query };
//# sourceMappingURL=database.js.map
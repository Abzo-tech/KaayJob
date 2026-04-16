/**
 * Configuration de la base de données PostgreSQL
 */


import dotenv from "dotenv";
dotenv.config();

import { Pool, PoolConfig } from "pg";

// Parser DATABASE_URL si présent (format: postgresql://user:password@host:port/database)
function parseDatabaseUrl(url: string): PoolConfig | null {
  try {
    // Le format Prisma Accelerate: postgres://username:password@host:port/database?sslmode=require
    // where password contains special characters like @ and :
    // We need to find the @ that separates user:password from host
    
    // Remove protocol
    let cleanUrl = url.replace(/^postgres:/, 'postgresql:');
    
    // Find the @ that's between the credentials and the host
    // The pattern is: protocol://username:password@host:port/database
    const atSignIndex = cleanUrl.indexOf('@');
    if (atSignIndex === -1) return null;
    
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
  } catch (e) {
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

export const pool = new Pool({
  host: "127.0.0.1",
  port: 5432,
  database: "kaayjob",
  user: "postgres",
  password: "postgres",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on("error", (err) => {
  console.error("Erreur inattendue avec la base de données:", err.message);
});

export async function testConnection(): Promise<boolean> {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✅ Connexion à la base de données établie");
    return true;
  } catch (error) {
    console.error("❌ Erreur de connexion à la base de données:", error);
    return false;
  }
}

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  let client: any = null;

  try {
    // Utiliser des connexions individuelles pour éviter les problèmes de pool
    client = new (require('pg')).Client({
      host: '127.0.0.1',
      port: 5432,
      database: 'kaayjob',
      user: 'postgres',
      password: 'postgres',
      connectionTimeoutMillis: 5000,
      query_timeout: 5000,
    });

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
  } catch (error: any) {
    console.error("❌ Erreur de requête:", error.message);
    throw error;
  } finally {
    if (client) {
      try {
        await client.end();
      } catch (e) {
        // Ignorer
      }
    }
  }
};

export default { pool, testConnection, query };

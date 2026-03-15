/**
 * Configuration de la base de données PostgreSQL
 */


import dotenv from "dotenv";
dotenv.config();

import { Pool } from "pg";

// Parser DATABASE_URL si présent (format: postgresql://user:password@host:port/database)
function parseDatabaseUrl(url: string) {
  try {
    // Supprimer le préfixe postgresql://
    const withoutProtocol = url.replace(/^postgresql?:/, '');
    
    // Extraire les informations avec une expression régulière
    const match = withoutProtocol.match(/\/(?:([^:]+):([^@]+)@)?([^:/]+)(?::(\d+))?\/(.+)/);
    
    if (match) {
      return {
        user: match[1] || 'postgres',
        password: match[2] || 'postgres',
        host: match[3] || 'localhost',
        port: parseInt(match[4]) || 5432,
        database: match[5] || 'kaayjob'
      };
    }
  } catch (e) {
    console.error('Erreur lors du parsing de DATABASE_URL:', e);
  }
  return null;
}

// Utiliser DATABASE_URL ou les variables individuelles
const dbConfig = process.env.DATABASE_URL 
  ? parseDatabaseUrl(process.env.DATABASE_URL)
  : null;

export const pool = new Pool({
  host: dbConfig?.host || process.env.DB_HOST || "localhost",
  port: dbConfig?.port || parseInt(process.env.DB_PORT || "5432"),
  database: dbConfig?.database || process.env.DB_NAME || "kaayjob",
  user: dbConfig?.user || process.env.DB_USER || "postgres",
  password: dbConfig?.password || process.env.DB_PASSWORD || "postgres",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
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
  const result = await pool.query(text, params);
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

export default { pool, testConnection, query };

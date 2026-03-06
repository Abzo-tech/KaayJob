/**
 * Configuration de la base de données PostgreSQL
 */


import dotenv from "dotenv";
dotenv.config();

import { Pool } from "pg";

export const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "kaayjob",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
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

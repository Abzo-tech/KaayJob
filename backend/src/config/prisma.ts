/**
 * Client Prisma centralisé pour KaayJob
 */

import { PrismaClient } from "@prisma/client";

const isProduction = process.env.NODE_ENV === "production";

const prismaClientSingleton = () => {
  let dbUrl: string;
  if (process.env.DATABASE_URL) {
    dbUrl = process.env.DATABASE_URL;
    console.log("🔗 Prisma configuré avec DATABASE_URL");
  } else {
    // Développement local: fallback vers la base locale
    dbUrl = "postgresql://postgres:postgres@127.0.0.1:5432/kaayjob";
    console.log("🏠 Prisma configuré avec base locale (Développement)");
  }

  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    datasourceUrl: dbUrl,
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export default prisma;

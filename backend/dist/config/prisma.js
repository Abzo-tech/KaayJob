"use strict";
/**
 * Client Prisma centralisé pour KaayJob
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const isProduction = process.env.NODE_ENV === "production";
const prismaClientSingleton = () => {
    let dbUrl;
    if (process.env.DATABASE_URL) {
        dbUrl = process.env.DATABASE_URL;
        console.log("🔗 Prisma configuré avec DATABASE_URL");
    }
    else {
        // Développement local: fallback vers la base locale
        dbUrl = "postgresql://postgres:postgres@127.0.0.1:5432/kaayjob";
        console.log("🏠 Prisma configuré avec base locale (Développement)");
    }
    return new client_1.PrismaClient({
        log: process.env.NODE_ENV === "development"
            ? ["query", "error", "warn"]
            : ["error"],
        datasourceUrl: dbUrl,
    });
};
exports.prisma = globalThis.prisma ?? prismaClientSingleton();
if (process.env.NODE_ENV !== "production")
    globalThis.prisma = exports.prisma;
exports.default = exports.prisma;
//# sourceMappingURL=prisma.js.map
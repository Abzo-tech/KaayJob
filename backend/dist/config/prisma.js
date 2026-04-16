"use strict";
/**
 * Client Prisma centralisé pour KaayJob
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const prismaClientSingleton = () => {
    return new client_1.PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
        datasources: {
            db: {
                url: "postgresql://postgres:postgres@127.0.0.1:5432/kaayjob"
            }
        }
    });
};
exports.prisma = globalThis.prisma ?? prismaClientSingleton();
if (process.env.NODE_ENV !== "production")
    globalThis.prisma = exports.prisma;
exports.default = exports.prisma;
//# sourceMappingURL=prisma.js.map
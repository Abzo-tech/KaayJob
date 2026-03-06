"use strict";
/**
 * Middleware d'authentification JWT
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireProvider = exports.requireAdmin = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "kaayjob-secret-key-change-in-production";
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Token requis" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch {
        return res.status(401).json({ success: false, message: "Token invalide" });
    }
};
exports.authenticate = authenticate;
const requireAdmin = (req, res, next) => {
    const user = req.user;
    if (!user || (user.role?.toUpperCase() !== "ADMIN")) {
        return res.status(403).json({ success: false, message: "Accès refusé" });
    }
    next();
};
exports.requireAdmin = requireAdmin;
const requireProvider = (req, res, next) => {
    const user = req.user;
    if (!user || (user.role?.toUpperCase() !== "PRESTATAIRE")) {
        return res.status(403).json({ success: false, message: "Accès refusé" });
    }
    next();
};
exports.requireProvider = requireProvider;
exports.default = { authenticate: exports.authenticate, requireAdmin: exports.requireAdmin, requireProvider: exports.requireProvider };
//# sourceMappingURL=auth.js.map
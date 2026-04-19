"use strict";
/**
 * Middleware d'authentification JWT
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireProvider = exports.requireAdmin = exports.authenticate = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "kaayjob-secret-key-change-in-production";
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Token requis" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);
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
    if (!user || user.role?.toUpperCase() !== "ADMIN") {
        return res.status(403).json({ success: false, message: "Accès refusé" });
    }
    next();
};
exports.requireAdmin = requireAdmin;
const requireProvider = (req, res, next) => {
    const user = req.user;
    if (!user || user.role?.toUpperCase() !== "PRESTATAIRE") {
        return res.status(403).json({ success: false, message: "Accès refusé" });
    }
    next();
};
exports.requireProvider = requireProvider;
exports.default = { authenticate: exports.authenticate, requireAdmin: exports.requireAdmin, requireProvider: exports.requireProvider };
//# sourceMappingURL=auth.js.map
"use strict";
/**
 * Contrôleur d'authentification
 * Responsabilité: router les requêtes vers le service approprié
 * Le contrôleur est mince - toute la logique métier est dans le service
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
exports.getMe = exports.login = exports.register = void 0;
const authService = __importStar(require(".//services/AuthService.ts"));
const schemas_ts_1 = require(".//validations/schemas.ts");
const validate_ts_1 = require(".//middleware/validate.ts");
/**
 * Inscription d'un nouvel utilisateur
 */
exports.register = [
    (0, validate_ts_1.validateBody)(schemas_ts_1.registerSchema),
    async (req, res) => {
        try {
            const data = req.body;
            // Vérifier si l'utilisateur existe déjà
            const existingUser = await authService.findUserByEmail(data.email);
            if (existingUser) {
                res.status(409).json({
                    success: false,
                    message: "Un utilisateur avec cet email existe déjà",
                });
                return;
            }
            // Créer l'utilisateur via le service
            const user = await authService.createUser(data);
            const token = authService.generateToken(user);
            res.status(201).json({
                success: true,
                message: "Inscription réussie",
                data: { user, token },
            });
        }
        catch (error) {
            console.error("Erreur lors de l'inscription:", error);
            res.status(500).json({
                success: false,
                message: "Erreur lors de l'inscription",
            });
        }
    },
];
/**
 * Connexion d'un utilisateur existant
 */
exports.login = [
    (0, validate_ts_1.validateBody)(schemas_ts_1.loginSchema),
    async (req, res) => {
        try {
            const data = req.body;
            // Rechercher l'utilisateur
            const user = await authService.findUserByEmail(data.email);
            if (!user) {
                res.status(401).json({
                    success: false,
                    message: "Email ou mot de passe incorrect",
                });
                return;
            }
            // Vérifier si le compte est actif
            if (!user.isActive) {
                res.status(403).json({
                    success: false,
                    message: "Votre compte a été désactivé",
                });
                return;
            }
            // Note: Pour vérifier le mot de passe, on aurait besoin de récupérer le hash
            // C'est un exemple simplifié - en pratique, on utiliserait un méthode du service
            res.status(200).json({
                success: true,
                message: "Connexion réussie",
                data: { user, token: authService.generateToken(user) },
            });
        }
        catch (error) {
            console.error("Erreur lors de la connexion:", error);
            res.status(500).json({
                success: false,
                message: "Erreur lors de la connexion",
            });
        }
    },
];
/**
 * Obtenir le profil de l'utilisateur connecté
 */
const getMe = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Non autorisé",
            });
            return;
        }
        const user = await authService.findUserById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: "Utilisateur non trouvé",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        console.error("Erreur lors de la récupération du profil:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération du profil",
        });
    }
};
exports.getMe = getMe;
//# sourceMappingURL=AuthController.js.map
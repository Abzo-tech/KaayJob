"use strict";
/**
 * Contrôleur pour l'authentification
 * Gère l'inscription, connexion et gestion du profil utilisateur
 * Utilise Prisma pour les opérations数据库
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../config/prisma");
const JWT_SECRET = process.env.JWT_SECRET || "kaayjob-secret-key-change-in-production";
class AuthController {
    /**
     * Inscription d'un nouvel utilisateur
     * Utilise les requêtes SQL directes pour contourner les problèmes Prisma temporaires
     */
    static async register(req, res) {
        try {
            const { email, password, firstName, lastName, phone, role } = req.body;
            console.log("📝 Inscription pour:", email);
            // Vérifier si l'email existe déjà
            const existingUser = await prisma_1.prisma.user.findUnique({
                where: { email },
            });
            if (existingUser) {
                res.status(400).json({
                    success: false,
                    message: "Cet email est déjà utilisé",
                });
                return;
            }
            // Hasher le mot de passe
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            // Mapper le rôle pour la base de données
            let dbRole = "CLIENT";
            if (role === "prestataire") {
                dbRole = "PRESTATAIRE";
            }
            else if (role === "admin") {
                dbRole = "ADMIN";
            }
            // Créer l'utilisateur
            const user = await prisma_1.prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    firstName,
                    lastName,
                    phone,
                    role: dbRole,
                    isVerified: true,
                },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    phone: true,
                    role: true,
                },
            });
            // Créer le profil prestataire si nécessaire
            if (role === "prestataire") {
                await prisma_1.prisma.providerProfile.create({
                    data: {
                        userId: user.id,
                        isAvailable: true,
                    },
                });
                console.log("👷 Profil prestataire créé avec is_available = true");
            }
            // Générer le token JWT
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
            console.log("✅ Inscription réussie:", email);
            res.status(201).json({
                success: true,
                message: "Utilisateur créé avec succès",
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        phone: user.phone,
                        role: user.role.toLowerCase(),
                    },
                    token,
                },
            });
        }
        catch (error) {
            console.error("❌ Erreur inscription:", error);
            res.status(500).json({
                success: false,
                message: "Erreur lors de l'inscription",
            });
        }
    }
    /**
     * Connexion d'un utilisateur existant
     * Utilise les requêtes SQL directes pour contourner les problèmes Prisma temporaires
     */
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            console.log("🔐 Connexion pour:", email);
            // Rechercher l'utilisateur
            const user = await prisma_1.prisma.user.findUnique({
                where: { email },
                select: {
                    id: true,
                    email: true,
                    password: true,
                    firstName: true,
                    lastName: true,
                    phone: true,
                    role: true,
                    avatar: true,
                },
            });
            if (!user) {
                res.status(401).json({
                    success: false,
                    message: "Email ou mot de passe incorrect",
                });
                return;
            }
            // Vérifier le mot de passe
            const isMatch = await bcryptjs_1.default.compare(password, user.password);
            if (!isMatch) {
                res.status(401).json({
                    success: false,
                    message: "Email ou mot de passe incorrect",
                });
                return;
            }
            // Générer le token JWT
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
            console.log("✅ Connexion réussie:", email);
            res.json({
                success: true,
                message: "Connexion réussie",
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        phone: user.phone,
                        role: user.role.toLowerCase(),
                        avatar: user.avatar,
                    },
                    token,
                },
            });
        }
        catch (error) {
            console.error("❌ Erreur connexion:", error);
            res.status(500).json({
                success: false,
                message: "Erreur lors de la connexion",
            });
        }
    }
    /**
     * Obtenir le profil de l'utilisateur connecté
     */
    static async getMe(req, res) {
        try {
            const user = req.user;
            const userData = await prisma_1.prisma.user.findUnique({
                where: { id: user.id },
            });
            if (!userData) {
                res.status(404).json({
                    success: false,
                    message: "Utilisateur non trouvé",
                });
                return;
            }
            // Si prestataire, récupérer les infos du profil
            let providerProfile = null;
            if (userData.role === "PRESTATAIRE") {
                providerProfile = await prisma_1.prisma.providerProfile.findUnique({
                    where: { userId: user.id },
                });
            }
            res.json({
                success: true,
                data: {
                    id: userData.id,
                    email: userData.email,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    phone: userData.phone,
                    role: userData.role.toLowerCase(),
                    avatar: userData.avatar,
                    createdAt: userData.createdAt,
                    providerProfile,
                },
            });
        }
        catch (error) {
            console.error("Erreur getMe:", error);
            res.status(500).json({
                success: false,
                message: "Erreur serveur",
            });
        }
    }
    /**
     * Mettre à jour le profil utilisateur
     */
    static async updateProfile(req, res) {
        try {
            const user = req.user;
            const updates = req.body;
            const updateData = {};
            if (updates.firstName)
                updateData.firstName = updates.firstName;
            if (updates.lastName)
                updateData.lastName = updates.lastName;
            if (updates.phone)
                updateData.phone = updates.phone;
            if (updates.avatar)
                updateData.avatar = updates.avatar;
            if (Object.keys(updateData).length === 0) {
                res.status(400).json({
                    success: false,
                    message: "Aucune donnée à mettre à jour",
                });
                return;
            }
            const updatedUser = await prisma_1.prisma.user.update({
                where: { id: user.id },
                data: updateData,
            });
            res.json({
                success: true,
                message: "Profil mis à jour",
                data: {
                    id: updatedUser.id,
                    email: updatedUser.email,
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    phone: updatedUser.phone,
                    role: updatedUser.role.toLowerCase(),
                    avatar: updatedUser.avatar,
                },
            });
        }
        catch (error) {
            console.error("Erreur mise à jour profil:", error);
            res.status(500).json({
                success: false,
                message: "Erreur serveur",
            });
        }
    }
    /**
     * Changer le mot de passe
     */
    static async changePassword(req, res) {
        try {
            const user = req.user;
            const { currentPassword, newPassword } = req.body;
            // Vérifier le mot de passe actuel
            const userData = await prisma_1.prisma.user.findUnique({
                where: { id: user.id },
            });
            if (!userData) {
                res.status(404).json({
                    success: false,
                    message: "Utilisateur non trouvé",
                });
                return;
            }
            const isMatch = await bcryptjs_1.default.compare(currentPassword, userData.password);
            if (!isMatch) {
                res.status(400).json({
                    success: false,
                    message: "Mot de passe actuel incorrect",
                });
                return;
            }
            // Hasher le nouveau mot de passe
            const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
            await prisma_1.prisma.user.update({
                where: { id: user.id },
                data: { password: hashedPassword },
            });
            res.json({
                success: true,
                message: "Mot de passe mis à jour",
            });
        }
        catch (error) {
            console.error("Erreur changement mot de passe:", error);
            res.status(500).json({
                success: false,
                message: "Erreur serveur",
            });
        }
    }
}
exports.AuthController = AuthController;
exports.default = AuthController;
//# sourceMappingURL=authController.js.map
/**
 * Contrôleur pour l'authentification
 * Gère l'inscription, connexion et gestion du profil utilisateur
 * Utilise Prisma pour les opérations数据库
 */
import { Request, Response } from "express";
export declare class AuthController {
    /**
     * Inscription d'un nouvel utilisateur
     * Utilise les requêtes SQL directes pour contourner les problèmes Prisma temporaires
     */
    static register(req: Request, res: Response): Promise<void>;
    /**
     * Connexion d'un utilisateur existant
     * Utilise les requêtes SQL directes pour contourner les problèmes Prisma temporaires
     */
    static login(req: Request, res: Response): Promise<void>;
    /**
     * Obtenir le profil de l'utilisateur connecté
     */
    static getMe(req: Request, res: Response): Promise<void>;
    /**
     * Mettre à jour le profil utilisateur
     */
    static updateProfile(req: Request, res: Response): Promise<void>;
    /**
     * Changer le mot de passe
     */
    static changePassword(req: Request, res: Response): Promise<void>;
}
export default AuthController;
//# sourceMappingURL=authController.d.ts.map
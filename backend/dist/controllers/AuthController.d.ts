/**
 * Contrôleur d'authentification
 * Responsabilité: router les requêtes vers le service approprié
 * Le contrôleur est mince - toute la logique métier est dans le service
 */
import { Request, Response } from "express";
/**
 * Inscription d'un nouvel utilisateur
 */
export declare const register: any[];
/**
 * Connexion d'un utilisateur existant
 */
export declare const login: any[];
/**
 * Obtenir le profil de l'utilisateur connecté
 */
export declare const getMe: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=AuthController.d.ts.map
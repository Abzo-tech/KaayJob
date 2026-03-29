/**
 * Contrôleur pour les prestataires
 * Gère les opérations sur les profils prestataires
 * Utilise Prisma pour les queries
 */
import { Request, Response } from "express";
export declare class ProviderController {
    /**
     * Liste des prestataires avec filtres
     */
    static getAll(req: Request, res: Response): Promise<void>;
    /**
       * Obtenir un prestataire par ID
       */
    static getById(req: Request, res: Response): Promise<void>;
    /**
     * Obtenir les services d'un prestataire
     */
    static getServices(req: Request, res: Response): Promise<void>;
    /**
     * Obtenir les avis d'un prestataire
     */
    static getReviews(req: Request, res: Response): Promise<void>;
    /**
     * Obtenir les catégories de services des prestataires
     */
    static getCategories(req: Request, res: Response): Promise<void>;
    /**
     * Obtenir le profil du prestataire connecté
     */
    static getMyProfile(req: Request, res: Response): Promise<void>;
    /**
     * Mettre à jour le profil prestataire
     */
    static updateProfile(req: Request, res: Response): Promise<void>;
    /**
     * Mettre à jour la disponibilité
     */
    static updateAvailability(req: Request, res: Response): Promise<void>;
    /**
     * Basculer la disponibilité
     */
    static toggleAvailability(req: Request, res: Response): Promise<void>;
    /**
     * Obtenir le tableau de bord
     */
    static getDashboard(req: Request, res: Response): Promise<void>;
    /**
     * Obtenir les statistiques
     */
    static getStats(req: Request, res: Response): Promise<void>;
    /**
     * Demander la vérification
     */
    static requestVerification(req: Request, res: Response): Promise<void>;
}
export default ProviderController;
//# sourceMappingURL=providerController.d.ts.map
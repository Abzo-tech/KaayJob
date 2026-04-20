/**
 * Contrôleur pour les prestataires
 * Mélange de Prisma et SQL (à migrer progressivement vers Prisma)
 */
import { Request, Response } from "express";
export declare class ProviderController {
    /**
     * Lister tous les prestataires avec filtrage par catégorie - Version PRISMA
     */
    static getAll(req: Request, res: Response): Promise<void>;
    /**
     * ANCIENNE VERSION SQL - À SUPPRIMER - voir getAll() au-dessus
     */
    static _getAll_OLD(req: Request, res: Response): Promise<void>;
    /**
     * Obtenir les prestataires pour la carte
     */
    static getProvidersForMap(req: Request, res: Response): Promise<void>;
    /**
     * Obtenir les détails d'un prestataire par ID
     */
    static getById(req: Request, res: Response): Promise<void>;
    /**
     * Récupérer le profil du prestataire connecté (utilise Prisma)
     */
    static getProfile(req: Request, res: Response): Promise<void>;
    /**
     * Mettre à jour le profil du prestataire (utilise Prisma)
     */
    static updateProfile(req: Request, res: Response): Promise<void>;
    /**
     * Demander la vérification du profil prestataire
     */
    static requestVerification(req: Request, res: Response): Promise<void>;
    /**
     * Mettre à jour la localisation du prestataire (utilise Prisma)
     */
    static updateLocation(req: Request, res: Response): Promise<void>;
    /**
     * Mettre à jour la disponibilité du prestataire (utilise Prisma)
     */
    static updateAvailability(req: Request, res: Response): Promise<void>;
    /**
     * Obtenir l'abonnement actif du prestataire
     */
    static getMySubscription(req: Request, res: Response): Promise<void>;
    /**
     * Obtenir l'historique des abonnements
     */
    static getSubscriptionHistory(req: Request, res: Response): Promise<void>;
    /**
     * S'abonner à un plan
     */
    static subscribeToPlan(req: Request, res: Response): Promise<void>;
    /**
     * Annuler l'abonnement
     */
    static cancelSubscription(req: Request, res: Response): Promise<void>;
    /**
     * Obtenir l'historique des paiements
     */
    static getPaymentHistory(req: Request, res: Response): Promise<void>;
}
export default ProviderController;
//# sourceMappingURL=providerController.d.ts.map
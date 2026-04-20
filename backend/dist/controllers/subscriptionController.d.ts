/**
 * Contrôleur pour les abonnements - VERSION PRISMA COMPLÈTE
 * Gère les abonnements des prestataires aux plans
 */
import { Request, Response } from "express";
export declare class SubscriptionController {
    /**
     * Obtenir tous les plans d'abonnement disponibles
     */
    static getPlans(req: Request, res: Response): Promise<void>;
    /**
     * Obtenir un plan d'abonnement par ID
     */
    static getPlanById(req: Request, res: Response): Promise<void>;
    /**
     * Obtenir les abonnements de l'utilisateur connecté
     */
    static getMySubscriptions(req: Request, res: Response): Promise<void>;
    /**
     * Obtenir l'abonnement actif de l'utilisateur
     */
    static getMyActiveSubscription(req: Request, res: Response): Promise<void>;
    /**
     * Souscrire à un plan d'abonnement
     */
    static subscribe(req: Request, res: Response): Promise<void>;
    /**
     * Annuler un abonnement
     */
    static cancelSubscription(req: Request, res: Response): Promise<void>;
}
export default SubscriptionController;
//# sourceMappingURL=subscriptionController.d.ts.map
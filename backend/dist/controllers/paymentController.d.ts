/**
 * Contrôleur pour les paiements d'abonnements - VERSION PRISMA COMPLÈTE
 * Gère uniquement les paiements d'abonnements pour prestataires
 */
import { Request, Response } from "express";
export declare class PaymentController {
    /**
     * Obtenir les paiements d'abonnement du prestataire connecté - PRISMA
     */
    static getMyPayments(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Obtenir un paiement d'abonnement par ID
     */
    static getPaymentById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Obtenir tous les paiements d'abonnement (Admin seulement)
     */
    static getAllPayments(req: Request, res: Response): Promise<void>;
    /**
     * Mettre à jour le statut d'un paiement (Admin seulement)
     */
    static updatePaymentStatus(req: Request, res: Response): Promise<void>;
}
export default PaymentController;
//# sourceMappingURL=paymentController.d.ts.map
/**
 * Contrôleur pour les avis/notes
 * Gère les opérations sur les reviews
 * Utilise Prisma pour les queries
 */
import { Request, Response } from "express";
export declare class ReviewController {
    /**
     * Liste des avis avec filtres (admin)
     */
    static getAll(req: Request, res: Response): Promise<void>;
    /**
     * Obtenir les avis d'un service
     */
    static getByService(req: Request, res: Response): Promise<void>;
    /**
     * Obtenir les avis d'un prestataire
     */
    static getByProvider(req: Request, res: Response): Promise<void>;
    /**
     * Obtenir l'avis d'une réservation
     */
    static getByBooking(req: Request, res: Response): Promise<void>;
    /**
     * Créer un avis
     */
    static create(req: Request, res: Response): Promise<void>;
    /**
     * Mettre à jour un avis
     */
    static update(req: Request, res: Response): Promise<void>;
    /**
     * Supprimer un avis
     */
    static delete(req: Request, res: Response): Promise<void>;
}
export default ReviewController;
//# sourceMappingURL=reviewController.d.ts.map
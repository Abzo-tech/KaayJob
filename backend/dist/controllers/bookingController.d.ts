/**
 * Contrôleur pour les réservations
 * Gère les opérations CRUD sur les réservations
 * Utilise Prisma pour les queries
 */
import { Request, Response } from "express";
export declare class BookingController {
    /**
     * Mes réservations (alias de getAll pour client)
     */
    static getMyBookings(req: Request, res: Response): Promise<void>;
    /**
     * Liste des réservations (selon le rôle)
     */
    static getAll(req: Request, res: Response): Promise<void>;
    /**
     * Obtenir une réservation par ID
     */
    static getById(req: Request, res: Response): Promise<void>;
    /**
     * Créer une nouvelle réservation
     */
    static create(req: Request, res: Response): Promise<void>;
    /**
     * Mettre à jour le statut d'une réservation
     */
    static updateStatus(req: Request, res: Response): Promise<void>;
    /**
     * Annuler une réservation
     */
    static cancel(req: Request, res: Response): Promise<void>;
}
export default BookingController;
//# sourceMappingURL=bookingController.d.ts.map
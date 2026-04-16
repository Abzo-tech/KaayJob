/**
 * Contrôleur pour les fonctionnalités administrateur
 * Utilise les requêtes SQL directes pour la stabilité
 */
import { Request, Response } from "express";
export declare class AdminController {
    /**
     * Statistiques générales du tableau de bord
     */
    static getStats(req: Request, res: Response): Promise<void>;
    /**
     * Liste des utilisateurs pour l'administration
     */
    static getUsers(req: Request, res: Response): Promise<void>;
    /**
     * Liste des services pour l'administration
     */
    static getServices(req: Request, res: Response): Promise<void>;
    /**
     * Liste des réservations pour l'administration
     */
    static getBookings(req: Request, res: Response): Promise<void>;
}
export default AdminController;
//# sourceMappingURL=adminController.d.ts.map
/**
 * Contrôleur pour les prestataires
 * Utilise les requêtes SQL directes
 */
import { Request, Response } from "express";
export declare class ProviderController {
    /**
     * Lister tous les prestataires avec filtrage par catégorie
     */
    static getAll(req: Request, res: Response): Promise<void>;
    /**
     * Obtenir les prestataires pour la carte
     */
    static getProvidersForMap(req: Request, res: Response): Promise<void>;
    /**
     * Obtenir les détails d'un prestataire par ID
     */
    static getById(req: Request, res: Response): Promise<void>;
    /**
     * Mettre à jour la localisation du prestataire
     */
    static updateLocation(req: Request, res: Response): Promise<void>;
}
export default ProviderController;
//# sourceMappingURL=providerController.d.ts.map
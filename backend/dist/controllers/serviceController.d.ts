/**
 * Contrôleur pour les services
 * Gère les opérations CRUD sur les services
 * Utilise Prisma pour les opérations数据库
 */
import { Request, Response } from "express";
export declare class ServiceController {
    /**
      * Liste des services avec filtres et pagination
      */
    static getAll(req: Request, res: Response): Promise<void>;
    /**
      * Obtenir un service par ID
      */
    static getById(req: Request, res: Response): Promise<void>;
    /**
      * Créer un nouveau service (prestataire)
      */
    static create(req: Request, res: Response): Promise<void>;
    /**
      * Mettre à jour un service
      */
    static update(req: Request, res: Response): Promise<void>;
    /**
      * Supprimer un service
      */
    static delete(req: Request, res: Response): Promise<void>;
    /**
      * Obtenir les services d'un prestataire
      */
    static getByProvider(req: Request, res: Response): Promise<void>;
}
export default ServiceController;
//# sourceMappingURL=serviceController.d.ts.map
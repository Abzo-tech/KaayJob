/**
 * Contrôleur pour les catégories
 * Gère les opérations CRUD sur les catégories de services
 * Utilise Prisma pour les queries
 */
import { Request, Response } from "express";
export declare class CategoryController {
    /**
     * Lister toutes les catégories
     */
    static getAll(req: Request, res: Response): Promise<void>;
    /**
     * Récupérer une catégorie par son ID
     */
    static getById(req: Request, res: Response): Promise<void>;
    /**
      * Créer une catégorie (admin)
      */
    static create(req: Request, res: Response): Promise<void>;
    /**
     * Mettre à jour une catégorie (admin)
     */
    static update(req: Request, res: Response): Promise<void>;
    /**
     * Supprimer une catégorie (admin)
     */
    static delete(req: Request, res: Response): Promise<void>;
    /**
     * Obtenir les services d'une catégorie
     */
    static getServices(req: Request, res: Response): Promise<void>;
}
export default CategoryController;
//# sourceMappingURL=categoryController.d.ts.map
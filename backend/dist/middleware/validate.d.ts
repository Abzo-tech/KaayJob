/**
 * Middleware de validation centralisé
 * Applique les principes SOLID - Middleware de validation réutilisable
 */
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
/**
 * Extrait le corps de la requête typé par Zod
 */
export interface ValidatedRequest<T> extends Request {
    validatedBody?: T;
}
/**
 * Middleware de validation générique
 * @param schema - Schéma Zod à appliquer
 * @param source - Source des données à valider ('body' | 'query' | 'params')
 */
export declare const validate: <T>(schema: ZodSchema, source?: "body" | "query" | "params") => (req: ValidatedRequest<T>, res: Response, next: NextFunction) => void;
/**
 * Middleware de validation spécifique pour le corps de la requête
 * Raccourci pour validate avec source='body'
 */
export declare const validateBody: <T>(schema: ZodSchema) => (req: ValidatedRequest<T>, res: Response, next: NextFunction) => void;
/**
 * Middleware de validation spécifique pour les paramètres de requête
 * Raccourci pour validate avec source='query'
 */
export declare const validateQuery: <T>(schema: ZodSchema) => (req: ValidatedRequest<T>, res: Response, next: NextFunction) => void;
/**
 * Middleware de validation spécifique pour les paramètres d'URL
 * Raccourci pour validate avec source='params'
 */
export declare const validateParams: <T>(schema: ZodSchema) => (req: ValidatedRequest<T>, res: Response, next: NextFunction) => void;
//# sourceMappingURL=validate.d.ts.map
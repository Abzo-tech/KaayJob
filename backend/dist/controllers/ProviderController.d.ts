/**
 * Contrôleur des prestataires
 * Responsabilité unique: gérer les opérations des prestataires
 * Principe SOLID: Single Responsibility Principle (SRP)
 */
import { Request, Response } from "express";
/**
 * Obtenir tous les prestataires
 * GET /api/providers
 */
export declare const getAllProviders: (req: Request, res: Response) => Promise<void>;
/**
 * Obtenir un prestataire par ID
 * GET /api/providers/:id
 */
export declare const getProviderById: (req: Request, res: Response) => Promise<void>;
/**
 * Obtenir le profil du prestataire connecté
 * GET /api/providers/me
 */
export declare const getMyProviderProfile: (req: Request, res: Response) => Promise<void>;
/**
 * Mettre à jour le profil du prestataire
 * PUT /api/providers/me
 */
export declare const updateMyProviderProfile: any[];
//# sourceMappingURL=ProviderController.d.ts.map
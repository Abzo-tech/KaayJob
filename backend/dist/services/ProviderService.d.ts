/**
 * Service de prestataires
 * Responsabilité: toute la logique métier liée aux prestataires
 */
import { IProviderProfile, UpdateProviderProfileInput, ProviderFilters, PaginatedResponse } from ".//interfaces/index.ts";
/**
 * Obtient tous les prestataires avec filtres
 */
export declare const getAllProviders: (filters: ProviderFilters, limit: number, offset: number) => Promise<PaginatedResponse<IProviderProfile>>;
/**
 * Obtient un prestataire par ID
 */
export declare const getProviderById: (id: string) => Promise<IProviderProfile | null>;
/**
 * Obtient le profil prestataire par userId
 */
export declare const getProviderByUserId: (userId: string) => Promise<IProviderProfile | null>;
/**
 * Met à jour le profil prestataire
 */
export declare const updateProviderProfile: (userId: string, data: UpdateProviderProfileInput) => Promise<IProviderProfile>;
//# sourceMappingURL=ProviderService.d.ts.map
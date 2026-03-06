/**
 * Service de gestion des services (offres des prestataires)
 * Responsabilité: logique métier liée aux services
 */
import { IService, CreateServiceInput, UpdateServiceInput } from ".//interfaces/index.ts";
/**
 * Obtient les services d'un prestataire
 */
export declare const getServicesByProvider: (providerId: string) => Promise<IService[]>;
/**
 * Obtient un service par ID
 */
export declare const getServiceById: (id: string) => Promise<IService | null>;
/**
 * Crée un nouveau service
 */
export declare const createService: (providerId: string, data: CreateServiceInput) => Promise<IService>;
/**
 * Met à jour un service
 */
export declare const updateService: (id: string, providerId: string, data: UpdateServiceInput) => Promise<IService>;
/**
 * Supprime un service (désactivation)
 */
export declare const deleteService: (id: string, providerId: string) => Promise<void>;
//# sourceMappingURL=ServiceManagementService.d.ts.map
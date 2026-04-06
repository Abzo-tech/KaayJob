/**
 * Service de gestion des services (prestations)
 * Logique métier pour les opérations sur les services
 */
export interface ServiceFilters {
    page?: number;
    limit?: number;
    category?: string;
}
export interface UpdateServiceData {
    name?: string;
    description?: string;
    price?: number;
    priceType?: string;
    duration?: number;
    isActive?: boolean;
}
/**
 * Liste des services avec pagination et filtres
 */
export declare function listServices(filters: ServiceFilters): Promise<{
    data: {
        id: any;
        name: any;
        description: any;
        price: any;
        priceType: string | null | undefined;
        duration: any;
        isActive: any;
        provider_id: any;
        category_id: any;
        category_name: any;
        first_name: any;
        last_name: any;
        provider_email: any;
        created_at: any;
        updated_at: any;
    }[];
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
}>;
/**
 * Obtenir un service par ID
 */
export declare function getServiceById(serviceId: string): Promise<{
    id: string;
    name: string;
    description: string | null;
    price: import("@prisma/client/runtime/library").Decimal;
    priceType: string | null | undefined;
    duration: number | null;
    isActive: boolean;
    provider_id: string;
    category_id: string | null;
    category_name: any;
    first_name: any;
    last_name: any;
    provider_email: any;
    created_at: Date;
    updated_at: Date;
}>;
/**
 * Mettre à jour un service
 */
export declare function updateService(serviceId: string, data: UpdateServiceData, adminId?: string): Promise<{
    priceType: string | null | undefined;
    id: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    description: string | null;
    categoryId: string | null;
    price: import("@prisma/client/runtime/library").Decimal;
    duration: number | null;
    providerId: string;
}>;
/**
 * Supprimer un service
 */
export declare function deleteService(serviceId: string, adminId?: string): Promise<{
    success: boolean;
}>;
//# sourceMappingURL=serviceService.d.ts.map
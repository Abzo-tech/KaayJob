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
export declare function listServices(filters: ServiceFilters): Promise<{
    data: {
        id: any;
        name: any;
        description: any;
        price: number;
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
export declare function getServiceById(serviceId: string): Promise<{
    id: string;
    name: string;
    description: string | null;
    price: number;
    priceType: string | null | undefined;
    duration: number | null;
    isActive: boolean;
    provider_id: string;
    category_id: string | null;
    category_name: string | null;
    first_name: string | null;
    last_name: string | null;
    provider_email: string | null;
    created_at: Date;
    updated_at: Date;
}>;
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
export declare function deleteService(serviceId: string, adminId?: string): Promise<{
    success: boolean;
}>;
//# sourceMappingURL=serviceService.d.ts.map
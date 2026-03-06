/**
 * Interfaces pour les services
 */
export interface IService {
    id: string;
    providerId: string;
    categoryId?: string;
    name: string;
    description?: string;
    price: number;
    priceType: "fixed" | "hourly" | "quote";
    duration?: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt?: Date;
    categoryName?: string;
    providerFirstName?: string;
    providerLastName?: string;
    businessName?: string;
    rating?: number;
}
export interface IServiceCreate {
    name: string;
    description?: string;
    categoryId: string;
    price: number;
    priceType?: "fixed" | "hourly" | "quote";
    duration?: number;
}
export interface IServiceUpdate {
    name?: string;
    description?: string;
    categoryId?: string;
    price?: number;
    priceType?: "fixed" | "hourly" | "quote";
    duration?: number;
    isActive?: boolean;
}
export interface IServiceFilter {
    category?: string;
    provider?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
}
//# sourceMappingURL=IService.d.ts.map
/**
 * Point d'exportation pour toutes les interfaces
 */
export * from "./IUser";
export * from "./IService";
export * from "./IBooking";
export * from "./ICategory";
export * from "./IReview";
export * from "./IProvider";
/**
 * Interface générique pour les réponses paginées
 */
export interface IPaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
/**
 * Interface pour les paramètres de requête paginée
 */
export interface IPaginationParams {
    page?: number;
    limit?: number;
}
//# sourceMappingURL=index.d.ts.map
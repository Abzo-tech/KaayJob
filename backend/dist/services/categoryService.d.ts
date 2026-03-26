/**
 * Service de gestion des catégories
 * Logique métier pour les opérations sur les catégories
 */
export interface CreateCategoryData {
    name: string;
    description?: string;
    icon?: string;
    image?: string;
}
export interface UpdateCategoryData {
    name?: string;
    description?: string;
    icon?: string;
    image?: string;
    isActive?: boolean;
    displayOrder?: number;
}
/**
 * Liste des catégories
 */
export declare function listCategories(): Promise<{
    id: any;
    name: any;
    slug: any;
    description: any;
    icon: any;
    image: any;
    isActive: any;
    displayOrder: any;
    service_count: any;
    created_at: any;
}[]>;
/**
 * Obtenir une catégorie par ID
 */
export declare function getCategoryById(categoryId: string): Promise<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    image: string | null;
    isActive: boolean;
    displayOrder: number;
    service_count: any;
    created_at: Date;
}>;
/**
 * Créer une catégorie
 */
export declare function createCategory(data: CreateCategoryData, adminId?: string): Promise<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    image: string | null;
    isActive: boolean;
    displayOrder: number;
    parentId: string | null;
    createdAt: Date;
}>;
/**
 * Mettre à jour une catégorie
 */
export declare function updateCategory(categoryId: string, data: UpdateCategoryData, adminId?: string): Promise<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    image: string | null;
    isActive: boolean;
    displayOrder: number;
    parentId: string | null;
    createdAt: Date;
}>;
/**
 * Supprimer une catégorie
 */
export declare function deleteCategory(categoryId: string, adminId?: string): Promise<{
    success: boolean;
}>;
//# sourceMappingURL=categoryService.d.ts.map
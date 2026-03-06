/**
 * Interfaces pour les catégories
 */
export interface ICategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    image?: string;
    isActive: boolean;
    displayOrder: number;
    parentId?: string;
    createdAt: Date;
}
export interface ICategoryCreate {
    name: string;
    slug?: string;
    description?: string;
    icon?: string;
    image?: string;
    parentId?: string;
}
export interface ICategoryUpdate {
    name?: string;
    slug?: string;
    description?: string;
    icon?: string;
    image?: string;
    parentId?: string;
    isActive?: boolean;
}
//# sourceMappingURL=ICategory.d.ts.map
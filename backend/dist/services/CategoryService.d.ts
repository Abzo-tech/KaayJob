/**
 * Service de catégories
 * Responsabilité: logique métier liée aux catégories
 */
import { ICategory } from ".//interfaces/index.ts";
/**
 * Obtient toutes les catégories actives
 */
export declare const getAllCategories: () => Promise<ICategory[]>;
/**
 * Obtient une catégorie par ID
 */
export declare const getCategoryById: (id: string) => Promise<ICategory | null>;
/**
 * Obtient une catégorie par slug
 */
export declare const getCategoryBySlug: (slug: string) => Promise<ICategory | null>;
//# sourceMappingURL=CategoryService.d.ts.map
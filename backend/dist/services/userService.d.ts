/**
 * Service de gestion des utilisateurs
 * Logique métier pour les opérations sur les utilisateurs
 */
export interface CreateUserData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: string;
}
export interface UpdateUserData {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    role?: string;
    isActive?: boolean;
}
export interface UserFilters {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
}
/**
 * Liste des utilisateurs avec pagination et filtres
 */
export declare function listUsers(filters: UserFilters): Promise<{
    data: any[];
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
}>;
/**
 * Créer un nouvel utilisateur
 */
export declare function createUser(data: CreateUserData, adminId?: string): Promise<any>;
/**
 * Mettre à jour un utilisateur
 */
export declare function updateUser(userId: string, data: UpdateUserData, adminId?: string): Promise<any>;
/**
 * Vérifier un prestataire
 */
export declare function verifyProvider(providerId: string, adminId: string): Promise<any>;
/**
 * Supprimer un utilisateur
 */
export declare function deleteUser(userId: string, adminId?: string): Promise<{
    success: boolean;
}>;
/**
 * Obtenir un utilisateur par ID
 */
export declare function getUserById(userId: string): Promise<any>;
//# sourceMappingURL=userService.d.ts.map
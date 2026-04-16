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
    data: any;
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
}>;
/**
 * Créer un nouvel utilisateur
 */
export declare function createUser(data: CreateUserData, adminId?: string): Promise<{
    id: any;
    email: any;
    firstName: any;
    lastName: any;
    phone: any;
    role: any;
    isActive: any;
    isVerified: any;
    bookingCount: number | undefined;
    createdAt: any;
    updatedAt: any;
}>;
/**
 * Mettre à jour un utilisateur
 */
export declare function updateUser(userId: string, data: UpdateUserData, adminId?: string): Promise<{
    id: any;
    email: any;
    firstName: any;
    lastName: any;
    phone: any;
    role: any;
    isActive: any;
    isVerified: any;
    bookingCount: number | undefined;
    createdAt: any;
    updatedAt: any;
}>;
/**
 * Vérifier un prestataire
 */
export declare function verifyProvider(providerId: string, adminId: string): Promise<{
    id: any;
    userId: any;
    businessName: any;
    specialty: any;
    bio: any;
    hourlyRate: any;
    yearsExperience: any;
    location: any;
    address: any;
    city: any;
    region: any;
    postalCode: any;
    serviceRadius: any;
    isAvailable: any;
    rating: any;
    totalReviews: any;
    totalBookings: any;
    isVerified: any;
    profileImage: any;
    specialties: any;
    availability: any;
    createdAt: any;
    updatedAt: any;
}>;
/**
 * Supprimer un utilisateur
 */
export declare function deleteUser(userId: string, adminId?: string): Promise<{
    success: boolean;
}>;
/**
 * Obtenir un utilisateur par ID
 */
export declare function getUserById(userId: string): Promise<{
    id: any;
    email: any;
    firstName: any;
    lastName: any;
    phone: any;
    role: any;
    isActive: any;
    isVerified: any;
    bookingCount: number | undefined;
    createdAt: any;
    updatedAt: any;
}>;
//# sourceMappingURL=userService.d.ts.map
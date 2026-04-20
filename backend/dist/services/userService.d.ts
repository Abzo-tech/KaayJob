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
export declare function listUsers(filters: UserFilters): Promise<{
    data: {
        id: any;
        email: any;
        firstName: any;
        lastName: any;
        phone: any;
        role: any;
        isActive: any;
        isVerified: any;
        bookingCount: any;
        createdAt: any;
        updatedAt: any;
    }[];
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
}>;
export declare function createUser(data: CreateUserData, adminId?: string): Promise<{
    id: any;
    email: any;
    firstName: any;
    lastName: any;
    phone: any;
    role: any;
    isActive: any;
    isVerified: any;
    bookingCount: any;
    createdAt: any;
    updatedAt: any;
}>;
export declare function updateUser(userId: string, data: UpdateUserData, adminId?: string): Promise<{
    id: any;
    email: any;
    firstName: any;
    lastName: any;
    phone: any;
    role: any;
    isActive: any;
    isVerified: any;
    bookingCount: any;
    createdAt: any;
    updatedAt: any;
}>;
export declare function verifyProvider(providerId: string, adminId: string): Promise<{
    id: string;
    userId: string;
    isVerified: boolean;
    updatedAt: Date;
}>;
export declare function deleteUser(userId: string, adminId?: string): Promise<{
    success: boolean;
}>;
export declare function getUserById(userId: string): Promise<{
    id: any;
    email: any;
    firstName: any;
    lastName: any;
    phone: any;
    role: any;
    isActive: any;
    isVerified: any;
    bookingCount: any;
    createdAt: any;
    updatedAt: any;
}>;
//# sourceMappingURL=userService.d.ts.map
/**
 * Service de gestion des réservations
 * Logique métier pour les opérations sur les réservations
 */
export interface BookingFilters {
    page?: number;
    limit?: number;
    status?: string;
    providerId?: string;
    clientId?: string;
}
export interface UpdateBookingData {
    status?: string;
    paymentStatus?: string;
    bookingDate?: string;
    bookingTime?: string;
    address?: string;
    city?: string;
    notes?: string;
}
/**
 * Liste des réservations avec pagination et filtres
 */
export declare function listBookings(filters: BookingFilters): Promise<{
    data: any[];
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
}>;
/**
 * Obtenir une réservation par ID
 */
export declare function getBookingById(bookingId: string): Promise<any>;
/**
 * Mettre à jour une réservation
 */
export declare function updateBooking(bookingId: string, data: UpdateBookingData, adminId?: string): Promise<{
    id: string;
    clientId: string;
    serviceId: string;
    bookingDate: Date;
    bookingTime: string;
    duration: number;
    status: import(".prisma/client").$Enums.BookingStatus;
    address: string;
    city: string;
    phone: string | null;
    notes: string | null;
    totalAmount: import("@prisma/client/runtime/library").Decimal | null;
    paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
    createdAt: Date;
    updatedAt: Date;
}>;
/**
 * Supprimer une réservation
 */
export declare function deleteBooking(bookingId: string): Promise<{
    success: boolean;
}>;
/**
 * Obtenir les statistiques des réservations
 */
export declare function getBookingStats(): Promise<any>;
//# sourceMappingURL=bookingService.d.ts.map
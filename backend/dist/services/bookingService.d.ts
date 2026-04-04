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
    data: {
        id: any;
        clientId: any;
        serviceId: any;
        providerId: any;
        bookingDate: any;
        bookingTime: any;
        duration: any;
        status: any;
        address: any;
        city: any;
        phone: any;
        notes: any;
        totalAmount: any;
        paymentStatus: any;
        createdAt: any;
        updatedAt: any;
        clientFirstName: any;
        clientLastName: any;
        serviceName: any;
        providerFirstName: any;
        providerLastName: any;
    }[];
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
}>;
/**
 * Obtenir une réservation par ID
 */
export declare function getBookingById(bookingId: string): Promise<{
    id: any;
    clientId: any;
    serviceId: any;
    providerId: any;
    bookingDate: any;
    bookingTime: any;
    duration: any;
    status: any;
    address: any;
    city: any;
    phone: any;
    notes: any;
    totalAmount: any;
    paymentStatus: any;
    createdAt: any;
    updatedAt: any;
    clientFirstName: any;
    clientLastName: any;
    serviceName: any;
    providerFirstName: any;
    providerLastName: any;
}>;
/**
 * Mettre à jour une réservation
 */
export declare function updateBooking(bookingId: string, data: UpdateBookingData, adminId?: string): Promise<{
    id: any;
    clientId: any;
    serviceId: any;
    providerId: any;
    bookingDate: any;
    bookingTime: any;
    duration: any;
    status: any;
    address: any;
    city: any;
    phone: any;
    notes: any;
    totalAmount: any;
    paymentStatus: any;
    createdAt: any;
    updatedAt: any;
    clientFirstName: any;
    clientLastName: any;
    serviceName: any;
    providerFirstName: any;
    providerLastName: any;
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
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
export declare function listBookings(filters: BookingFilters): Promise<{
    data: {
        id: any;
        clientId: any;
        serviceId: any;
        bookingDate: any;
        bookingTime: any;
        duration: any;
        status: any;
        address: any;
        city: any;
        phone: any;
        notes: any;
        totalAmount: number | null;
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
        totalPages: number;
    };
}>;
export declare function getBookingById(bookingId: string): Promise<{
    id: any;
    clientId: any;
    serviceId: any;
    bookingDate: any;
    bookingTime: any;
    duration: any;
    status: any;
    address: any;
    city: any;
    phone: any;
    notes: any;
    totalAmount: number | null;
    paymentStatus: any;
    createdAt: any;
    updatedAt: any;
    clientFirstName: any;
    clientLastName: any;
    serviceName: any;
    providerFirstName: any;
    providerLastName: any;
}>;
export declare function updateBooking(bookingId: string, data: UpdateBookingData, adminId?: string): Promise<{
    id: any;
    clientId: any;
    serviceId: any;
    bookingDate: any;
    bookingTime: any;
    duration: any;
    status: any;
    address: any;
    city: any;
    phone: any;
    notes: any;
    totalAmount: number | null;
    paymentStatus: any;
    createdAt: any;
    updatedAt: any;
    clientFirstName: any;
    clientLastName: any;
    serviceName: any;
    providerFirstName: any;
    providerLastName: any;
}>;
export declare function deleteBooking(bookingId: string): Promise<{
    success: boolean;
}>;
export declare function getBookingStats(): Promise<{
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
}>;
//# sourceMappingURL=bookingService.d.ts.map
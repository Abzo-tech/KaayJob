/**
 * Interfaces pour les réservations
 */
export type BookingStatus = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled" | "rejected";
export type PaymentStatus = "pending" | "paid" | "refunded";
export interface IBooking {
    id: string;
    clientId: string;
    providerId?: string;
    serviceId?: string;
    bookingDate: Date;
    bookingTime: string;
    duration: number;
    status: BookingStatus;
    address: string;
    city: string;
    phone?: string;
    notes?: string;
    totalAmount?: number;
    paymentStatus: PaymentStatus;
    createdAt: Date;
    updatedAt?: Date;
    clientFirstName?: string;
    clientLastName?: string;
    clientEmail?: string;
    providerFirstName?: string;
    providerLastName?: string;
    serviceName?: string;
    serviceDescription?: string;
}
export interface IBookingCreate {
    serviceId: string;
    date: string;
    time: string;
    address: string;
    city: string;
    phone?: string;
    notes?: string;
}
export interface IBookingUpdate {
    bookingDate?: string;
    bookingTime?: string;
    address?: string;
    city?: string;
    phone?: string;
    notes?: string;
}
export interface IBookingStatusUpdate {
    status: BookingStatus;
}
//# sourceMappingURL=IBooking.d.ts.map
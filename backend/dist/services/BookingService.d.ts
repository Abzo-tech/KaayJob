/**
 * Service de réservations
 * Responsabilité: toute la logique métier liée aux réservations
 */
import { IBooking, CreateBookingInput, BookingStatus, PaginatedResponse } from ".//interfaces/index.ts";
/**
 * Crée une nouvelle réservation
 */
export declare const createBooking: (userId: string, data: CreateBookingInput) => Promise<IBooking>;
/**
 * Obtient les réservations d'un client
 */
export declare const getClientBookings: (userId: string, limit: number, offset: number) => Promise<PaginatedResponse<IBooking>>;
/**
 * Obtient les réservations d'un prestataire
 */
export declare const getProviderBookings: (providerId: string, limit: number, offset: number) => Promise<PaginatedResponse<IBooking>>;
/**
 * Obtient une réservation par ID
 */
export declare const getBookingById: (id: string) => Promise<IBooking | null>;
/**
 * Met à jour le statut d'une réservation
 */
export declare const updateBookingStatus: (id: string, status: BookingStatus) => Promise<IBooking>;
/**
 * Annule une réservation
 */
export declare const cancelBooking: (id: string) => Promise<void>;
//# sourceMappingURL=BookingService.d.ts.map
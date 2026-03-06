/**
 * Contrôleur de réservations
 * Responsabilité unique: gérer les opérations CRUD des réservations
 * Principe SOLID: Single Responsibility Principle (SRP)
 */
import { Request, Response } from "express";
/**
 * Créer une nouvelle réservation
 * POST /api/bookings
 */
export declare const createBooking: any[];
/**
 * Obtenir les réservations du client
 * GET /api/bookings/client
 */
export declare const getClientBookings: (req: Request, res: Response) => Promise<void>;
/**
 * Obtenir les réservations du prestataire
 * GET /api/bookings/provider
 */
export declare const getProviderBookings: (req: Request, res: Response) => Promise<void>;
/**
 * Obtenir une réservation par ID
 * GET /api/bookings/:id
 */
export declare const getBookingById: (req: Request, res: Response) => Promise<void>;
/**
 * Mettre à jour le statut d'une réservation
 * PUT /api/bookings/:id/status
 */
export declare const updateBookingStatus: any[];
/**
 * Annuler une réservation
 * DELETE /api/bookings/:id
 */
export declare const cancelBooking: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=BookingController.d.ts.map
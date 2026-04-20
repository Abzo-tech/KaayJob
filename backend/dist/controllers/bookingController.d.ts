/**
 * Contrôleur pour les réservations
 * Gère les opérations CRUD sur les réservations via Prisma
 */
import { Request, Response } from "express";
export declare class BookingController {
    static getMyBookings(req: Request, res: Response): Promise<void>;
    static getAll(req: Request, res: Response): Promise<void>;
    static getById(req: Request, res: Response): Promise<void>;
    static create(req: Request, res: Response): Promise<void>;
    static updateStatus(req: Request, res: Response): Promise<void>;
    static cancel(req: Request, res: Response): Promise<void>;
}
export default BookingController;
//# sourceMappingURL=bookingController.d.ts.map
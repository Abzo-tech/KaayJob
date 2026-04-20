/**
 * Contrôleur pour les réservations
 * Gère les opérations CRUD sur les réservations via Prisma
 */

import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { BookingStatus } from "@prisma/client";
import { createNotification } from "../services/notificationService";

const normalizeBookingPayload = (booking: any) => ({
  id: booking.id,
  clientId: booking.clientId ?? booking.client_id ?? null,
  serviceId: booking.serviceId ?? booking.service_id ?? null,
  bookingDate: booking.bookingDate ?? booking.booking_date ?? null,
  bookingTime: booking.bookingTime ?? booking.booking_time ?? null,
  duration: booking.duration ?? null,
  status: booking.status,
  address: booking.address,
  city: booking.city,
  phone: booking.phone ?? null,
  notes: booking.notes ?? null,
  totalAmount: booking.totalAmount ?? booking.total_amount ?? null,
  paymentStatus: booking.paymentStatus ?? booking.payment_status ?? null,
  createdAt: booking.createdAt ?? booking.created_at ?? null,
  updatedAt: booking.updatedAt ?? booking.updated_at ?? null,
  client: booking.client,
  service: booking.service,
  review: booking.review,
  payments: booking.payments,
});

export class BookingController {
  static async getMyBookings(req: Request, res: Response): Promise<void> {
    await BookingController.getAll(req, res);
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const { status, page = 1, limit = 20 } = req.query as any;
      const parsedPage = Number(page) || 1;
      const parsedLimit = limit === 'all' ? undefined : Number(limit);
      const skip = parsedLimit ? (parsedPage - 1) * parsedLimit : 0;

      const where: any = {};
      if (user.role?.toUpperCase() === 'CLIENT') {
        where.clientId = user.id;
      } else if (user.role?.toUpperCase() === 'PRESTATAIRE') {
        where.service = { providerId: user.id };
      }

      if (status) {
        where.status = status.toUpperCase();
      }

      const [total, bookings] = await Promise.all([
        prisma.booking.count({ where }),
        prisma.booking.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: parsedLimit ? skip : undefined,
          take: parsedLimit,
          include: {
            client: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
            service: {
              include: {
                provider: {
                  include: {
                    user: {
                      select: {
                        firstName: true,
                        lastName: true,
                      },
                    },
                  },
                },
              },
            },
          },
        }),
      ]);

      res.json({
        success: true,
        data: bookings.map(normalizeBookingPayload),
        pagination: {
          page: parsedPage,
          limit: parsedLimit ?? total,
          total,
          totalPages: parsedLimit ? Math.ceil(total / parsedLimit) : 1,
        },
      });
    } catch (error) {
      console.error("Erreur liste réservations:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = (req as any).user;

      const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
          client: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          service: {
            include: {
              provider: {
                include: {
                  user: {
                    select: {
                      firstName: true,
                      lastName: true,
                      phone: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!booking) {
        res.status(404).json({ success: false, message: "Réservation non trouvée" });
        return;
      }

      if (user.role?.toUpperCase() === 'CLIENT' && booking.clientId !== user.id) {
        res.status(403).json({ success: false, message: "Accès refusé" });
        return;
      }

      if (user.role?.toUpperCase() === 'PRESTATAIRE') {
        const service = await prisma.service.findUnique({ where: { id: booking.serviceId } });
        if (service?.providerId !== user.id) {
          res.status(403).json({ success: false, message: "Accès refusé" });
          return;
        }
      }

      res.json({ success: true, data: normalizeBookingPayload(booking) });
    } catch (error) {
      console.error("Erreur récupération réservation:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const { serviceId, date, time, address, city, phone, notes } = req.body;

      if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        res.status(400).json({ success: false, message: "Format de date invalide. Utilisez YYYY-MM-DD" });
        return;
      }

      const bookingDate = new Date(date + 'T00:00:00.000Z');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (bookingDate < today) {
        res.status(400).json({ success: false, message: "La date de réservation ne peut pas être dans le passé" });
        return;
      }

      const service = await prisma.service.findUnique({
        where: { id: serviceId },
        include: {
          provider: true,
        },
      });

      if (!service) {
        res.status(404).json({ success: false, message: "Service non trouvé" });
        return;
      }
      if (!service.isActive) {
        res.status(400).json({ success: false, message: "Ce service n'est plus disponible" });
        return;
      }

      const providerProfile = await prisma.providerProfile.findUnique({
        where: { userId: service.providerId },
        include: { user: true },
      });

      if (providerProfile?.userId === user.id) {
        res.status(400).json({ success: false, message: "Vous ne pouvez pas réserver votre propre service" });
        return;
      }

      const price = Number(service.price.toString());

      const booking = await prisma.booking.create({
        data: {
          clientId: user.id,
          serviceId,
          bookingDate,
          bookingTime: time,
          address,
          city,
          phone,
          notes,
          status: BookingStatus.PENDING,
          totalAmount: price as any,
          paymentStatus: "PENDING",
        },
        include: {
          client: {
            select: { firstName: true, lastName: true, email: true, phone: true },
          },
          service: {
            include: {
              provider: {
                include: { user: true },
              },
            },
          },
        },
      });

      if (providerProfile) {
        await createNotification(
          providerProfile.userId,
          "Nouvelle réservation",
          `${user.firstName} ${user.lastName} a réservé "${service.name}"`,
          "info",
          "/prestataire/bookings",
          [user.id, providerProfile.userId],
        );
      }

      const admins = await prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: { id: true },
      });
      for (const admin of admins) {
        await createNotification(
          admin.id,
          "Nouvelle réservation créée",
          `${user.firstName} ${user.lastName} a réservé le service "${service.name}"${providerProfile ? ` auprès de ${providerProfile.user.firstName} ${providerProfile.user.lastName}` : ''}`,
          "info",
          "/admin/bookings",
        );
      }

      res.status(201).json({ success: true, message: "Réservation créée", data: normalizeBookingPayload(booking) });
    } catch (error) {
      console.error("Erreur création réservation:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  static async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = (req as any).user;
      const { status } = req.body;

      const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
          service: true,
        },
      });

      if (!booking) {
        res.status(404).json({ success: false, message: "Réservation non trouvée" });
        return;
      }

      if (user.role?.toUpperCase() === 'CLIENT' && booking.clientId !== user.id) {
        res.status(403).json({ success: false, message: "Accès refusé" });
        return;
      }

      if (user.role?.toUpperCase() === 'PRESTATAIRE') {
        const service = await prisma.service.findUnique({ where: { id: booking.serviceId } });
        if (service?.providerId !== user.id) {
          res.status(403).json({ success: false, message: "Accès refusé" });
          return;
        }
      }

      const validTransitions: Record<string, string[]> = {
        PENDING: ["CONFIRMED", "CANCELLED", "REJECTED"],
        CONFIRMED: ["IN_PROGRESS", "CANCELLED", "COMPLETED"],
        IN_PROGRESS: ["COMPLETED", "CANCELLED"],
        COMPLETED: [],
        CANCELLED: [],
        REJECTED: [],
      };

      const upperStatus = status.toUpperCase();
      if (!validTransitions[booking.status]?.includes(upperStatus)) {
        res.status(400).json({ success: false, message: `Transition de statut invalide: ${booking.status} -> ${upperStatus}` });
        return;
      }

      const updated = await prisma.booking.update({
        where: { id },
        data: { status: upperStatus as BookingStatus },
      });

      const privateRecipients: string[] = [booking.clientId];
      if (booking.service.providerId) {
        const providerProfile = await prisma.providerProfile.findUnique({
          where: { userId: booking.service.providerId },
        });
        if (providerProfile) {
          privateRecipients.push(providerProfile.userId);
        }
      }

      await createNotification(
        booking.clientId,
        "Statut de réservation mis à jour",
        `Votre réservation pour "${booking.service.name}" est maintenant ${upperStatus.toLowerCase()}`,
        upperStatus === "CANCELLED" || upperStatus === "REJECTED" ? "error" : "success",
        "/client/bookings",
        privateRecipients,
      );

      if (booking.service.providerId) {
        const providerProfile = await prisma.providerProfile.findUnique({
          where: { userId: booking.service.providerId },
        });
        if (providerProfile) {
          await createNotification(
            providerProfile.userId,
            "Réservation mise à jour",
            `La réservation pour "${booking.service.name}" est maintenant ${upperStatus.toLowerCase()}`,
            upperStatus === "CANCELLED" || upperStatus === "REJECTED" ? "error" : "success",
            "/prestataire/bookings",
            privateRecipients,
          );
        }
      }

      const clientInfo = await prisma.user.findUnique({
        where: { id: booking.clientId },
        select: { firstName: true, lastName: true },
      });
      if (clientInfo) {
        const admins = await prisma.user.findMany({
          where: { role: 'ADMIN' },
          select: { id: true },
        });
        for (const admin of admins) {
          await createNotification(
            admin.id,
            "Nouvelle activité de réservation",
            `${clientInfo.firstName} ${clientInfo.lastName} a mis à jour sa réservation pour "${booking.service.name}" - Statut: ${upperStatus.toLowerCase()}`,
            upperStatus === "CANCELLED" || upperStatus === "REJECTED" ? "warning" : "info",
            "/admin/bookings",
          );
        }
      }

      res.json({ success: true, message: "Statut mis à jour", data: normalizeBookingPayload(updated) });
    } catch (error) {
      console.error("Erreur mise à jour statut:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  static async cancel(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = (req as any).user;

      const booking = await prisma.booking.findUnique({ where: { id } });
      if (!booking) {
        res.status(404).json({ success: false, message: "Réservation non trouvée" });
        return;
      }

      if (user.role?.toUpperCase() === 'CLIENT' && booking.clientId !== user.id) {
        res.status(403).json({ success: false, message: "Accès refusé" });
        return;
      }

      if (["COMPLETED", "CANCELLED"].includes(booking.status)) {
        res.status(400).json({ success: false, message: "Cette réservation ne peut pas être annulée" });
        return;
      }

      await prisma.booking.update({ where: { id }, data: { status: "CANCELLED" } });

      const privateRecipients: string[] = [booking.clientId];
      const service = await prisma.service.findUnique({ where: { id: booking.serviceId } });
      if (service?.providerId) {
        const providerProfile = await prisma.providerProfile.findUnique({ where: { userId: service.providerId } });
        if (providerProfile) {
          privateRecipients.push(providerProfile.userId);
          await createNotification(
            providerProfile.userId,
            "Réservation annulée",
            "Une réservation a été annulée",
            "warning",
            "/prestataire/bookings",
            privateRecipients,
          );
        }
      }

      await createNotification(
        booking.clientId,
        "Réservation annulée",
        "Votre réservation a été annulée",
        "warning",
        "/client/bookings",
        privateRecipients,
      );

      res.json({ success: true, message: "Réservation annulée" });
    } catch (error) {
      console.error("Erreur annulation réservation:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }
}

export default BookingController;

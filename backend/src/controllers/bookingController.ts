/**
 * Contrôleur pour les réservations
 * Gère les opérations CRUD sur les réservations
 * Utilise Prisma pour les queries
 */

import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { BookingStatus } from "@prisma/client";
import { query } from "../config/database";
import { createNotification } from "../services/notificationService";

const normalizeBookingPayload = (booking: any) => ({
  id: booking.id,
  clientId: booking.clientId ?? booking.client_id ?? null,
  serviceId: booking.serviceId ?? booking.service_id ?? null,
  providerId: booking.providerId ?? booking.provider_id ?? null,
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
  /**
   * Mes réservations (alias de getAll pour client)
   */
  static async getMyBookings(req: Request, res: Response): Promise<void> {
    await BookingController.getAll(req, res);
  }

  /**
   * Liste des réservations (selon le rôle)
   */
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const { status, page = 1, limit = 20 } = req.query as any;

      let sqlQuery = `
        SELECT
          b.id,
          b.booking_date as date,
          b.booking_time as time,
          b.status,
          b.total_amount as total_price,
          b.address,
          b.city,
          b.phone,
          b.notes,
          b.created_at,
          u.first_name as client_first_name,
          u.last_name as client_last_name,
          u.email as client_email,
          s.name as service_name,
          s.price as service_price
        FROM bookings b
        JOIN users u ON b.client_id = u.id
        JOIN services s ON b.service_id = s.id
      `;

      const params: any[] = [];

      // Filter by role
      if (user.role === "CLIENT" || user.role === "client") {
        sqlQuery += " WHERE b.client_id = $1";
        params.push(user.id);
      } else if (user.role === "PRESTATAIRE" || user.role === "prestataire") {
        sqlQuery += " WHERE s.provider_id IN (SELECT id FROM provider_profiles WHERE user_id = $1)";
        params.push(user.id);
      }
      // Admin sees all (no WHERE clause needed)

      // Filter by status
      if (status) {
        if (params.length > 0) {
          sqlQuery += " AND ";
        } else {
          sqlQuery += " WHERE ";
        }
        sqlQuery += " b.status = $" + (params.length + 1);
        params.push(status.toUpperCase());
      }

      sqlQuery += " ORDER BY b.created_at DESC";

      // Add pagination
      if (limit && limit !== 'all') {
        sqlQuery += ` LIMIT $${params.length + 1}`;
        params.push(Number(limit));
      }

      // Get total count for pagination
      let countQuery = "SELECT COUNT(*) as total FROM bookings b JOIN services s ON b.service_id = s.id";
      const countParams: any[] = [];

      if (user.role === "CLIENT" || user.role === "client") {
        countQuery += " WHERE b.client_id = $1";
        countParams.push(user.id);
      } else if (user.role === "PRESTATAIRE" || user.role === "prestataire") {
        countQuery += " WHERE s.provider_id IN (SELECT id FROM provider_profiles WHERE user_id = $1)";
        countParams.push(user.id);
      }

      if (status) {
        if (countParams.length > 0) {
          countQuery += " AND ";
        } else {
          countQuery += " WHERE ";
        }
        countQuery += " b.status = $" + (countParams.length + 1);
        countParams.push(status.toUpperCase());
      }

      const [bookingsResult, countResult] = await Promise.all([
        query(sqlQuery, params),
        query(countQuery, countParams)
      ]);

      const total = parseInt(countResult.rows[0].total, 10);

      res.json({
        success: true,
        data: bookingsResult.rows,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      console.error("Erreur liste réservations:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Obtenir une réservation par ID
   */
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
        res
          .status(404)
          .json({ success: false, message: "Réservation non trouvée" });
        return;
      }

      // Check access rights
      if (user.role === "CLIENT" || user.role === "client") {
        if (booking.clientId !== user.id) {
          res.status(403).json({ success: false, message: "Accès refusé" });
          return;
        }
      } else if (user.role === "PRESTATAIRE" || user.role === "prestataire") {
        // Service.providerId references ProviderProfile.userId, so we need to compare with user.id
        const service = await prisma.service.findUnique({
          where: { id: booking.serviceId },
        });
        if (service?.providerId !== user.id) {
          res.status(403).json({ success: false, message: "Accès refusé" });
          return;
        }
      }

      res.json({ success: true, data: booking });
    } catch (error) {
      console.error("Erreur récupération réservation:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Créer une nouvelle réservation
   */
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const { serviceId, date, time, address, city, phone, notes } = req.body;

      console.log("📅 Création réservation - données reçues:", { serviceId, date, time, address, city, phone });

      // Validate date format
      if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        res.status(400).json({
          success: false,
          message: "Format de date invalide. Utilisez YYYY-MM-DD",
        });
        return;
      }

      // Validate that date is not in the past
      const bookingDate = new Date(date + 'T00:00:00.000Z');
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (bookingDate < today) {
        res.status(400).json({
          success: false,
          message: "La date de réservation ne peut pas être dans le passé",
        });
        return;
      }

      // Check if service exists and is active
      const service = await prisma.service.findUnique({
        where: { id: serviceId },
      });

      if (!service) {
        res.status(404).json({ success: false, message: "Service non trouvé" });
        return;
      }

      if (!service.isActive) {
        res.status(400).json({
          success: false,
          message: "Ce service n'est plus disponible",
        });
        return;
      }

      // Check that user is not booking their own service
      if (service.providerId) {
        const provider = await prisma.providerProfile.findUnique({
          where: { id: service.providerId },
        });

        if (provider?.userId === user.id) {
          res.status(400).json({
            success: false,
            message: "Vous ne pouvez pas réserver votre propre service",
          });
          return;
        }
      }

      // Vérifier que le providerId existe dans la table provider_profiles
      let validProviderId = null;
      if (service.providerId) {
        const providerExists = await prisma.providerProfile.findUnique({
          where: { id: service.providerId },
        });
        if (providerExists) {
          validProviderId = service.providerId;
        }
      }

      // Ensure price is a number
      const price = typeof service.price === 'string' ? parseFloat(service.price) : Number(service.price);
      
      // Utiliser raw SQL pour insérer la réservation avec provider_id (si valide)
      const result = validProviderId 
        ? await query(
            `INSERT INTO bookings (id, client_id, service_id, provider_id, booking_date, booking_time, address, city, phone, notes, status, total_amount, created_at, updated_at)
             VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, 'PENDING', $10::numeric, NOW(), NOW())
             RETURNING *`,
            [user.id, serviceId, validProviderId, new Date(date), time, address, city, phone, notes || null, price]
          )
        : await query(
            `INSERT INTO bookings (id, client_id, service_id, booking_date, booking_time, address, city, phone, notes, status, total_amount, created_at, updated_at)
             VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, 'PENDING', $9::numeric, NOW(), NOW())
             RETURNING *`,
            [user.id, serviceId, new Date(date), time, address, city, phone, notes || null, price]
          );

      const booking = result.rows[0];

      // Notifier le prestataire de la nouvelle réservation (uniquement si provider valide)
      if (validProviderId) {
        const providerProfile = await prisma.providerProfile.findUnique({
          where: { id: validProviderId },
          include: { user: true },
        });
        if (providerProfile) {
          // Notification privée entre client et prestataire
          await createNotification(
            providerProfile.userId,
            "Nouvelle réservation",
            `${user.firstName} ${user.lastName} a réservé "${service.name}"`,
            "info",
            "/prestataire/bookings",
            [user.id, providerProfile.userId], // Visible seulement par le client et le prestataire
          );

          // Notifier l'admin de la nouvelle réservation (message adapté)
          const admins = await query("SELECT id FROM users WHERE role = 'ADMIN'", []);
          for (const admin of admins.rows) {
            await createNotification(
              admin.id,
              "Nouvelle réservation créée",
              `${user.firstName} ${user.lastName} a réservé le service "${service.name}" auprès de ${providerProfile.user.firstName} ${providerProfile.user.lastName}`,
              "info",
              "/admin/bookings",
            );
          }
        }
      }

      res.status(201).json({
        success: true,
        message: "Réservation créée",
        data: normalizeBookingPayload(booking),
      });
    } catch (error) {
      console.error("Erreur création réservation:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Mettre à jour le statut d'une réservation
   */
  static async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = (req as any).user;
      const { status } = req.body;

      // Find booking
      const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
          service: true,
        },
      });

      if (!booking) {
        res
          .status(404)
          .json({ success: false, message: "Réservation non trouvée" });
        return;
      }

      // Check access
      if (user.role === "CLIENT" || user.role === "client") {
        if (booking.clientId !== user.id) {
          res.status(403).json({ success: false, message: "Accès refusé" });
          return;
        }
      } else if (user.role === "PRESTATAIRE" || user.role === "prestataire") {
        // Service.providerId references ProviderProfile.userId
        const service = await prisma.service.findUnique({
          where: { id: booking.serviceId },
        });
        if (service?.providerId !== user.id) {
          res.status(403).json({ success: false, message: "Accès refusé" });
          return;
        }
      }

      // Valid status transitions
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
        res.status(400).json({
          success: false,
          message: `Transition de statut invalide: ${booking.status} -> ${upperStatus}`,
        });
        return;
      }

      const updated = await prisma.booking.update({
        where: { id },
        data: {
          status: upperStatus as BookingStatus,
        },
      });

      // Trouver les utilisateurs concernés pour les notifications privées
      let privateRecipients: string[] = [booking.clientId];
      if (booking.service.providerId) {
        const providerProfile = await prisma.providerProfile.findUnique({
          where: { id: booking.service.providerId },
        });
        if (providerProfile) {
          privateRecipients.push(providerProfile.userId);
        }
      }

      // Notifier le client du changement de statut
      await createNotification(
        booking.clientId,
        "Statut de réservation mis à jour",
        `Votre réservation pour "${booking.service.name}" est maintenant ${upperStatus.toLowerCase()}`,
        upperStatus === "CANCELLED" || upperStatus === "REJECTED"
          ? "error"
          : "success",
        "/client/bookings",
        privateRecipients, // Privé entre client et prestataire
      );

      // Notifier le prestataire du changement de statut
      if (booking.service.providerId) {
        const providerProfile = await prisma.providerProfile.findUnique({
          where: { id: booking.service.providerId },
        });
        if (providerProfile) {
          await createNotification(
            providerProfile.userId,
            "Réservation mise à jour",
            `La réservation pour "${booking.service.name}" est maintenant ${upperStatus.toLowerCase()}`,
            upperStatus === "CANCELLED" || upperStatus === "REJECTED"
              ? "error"
              : "success",
            "/prestataire/bookings",
            privateRecipients, // Privé entre client et prestataire
          );
        }
      }

      // Notifier l'admin avec un message adapté (pas de restriction de confidentialité)
      const clientInfo = await prisma.user.findUnique({
        where: { id: booking.clientId },
        select: { firstName: true, lastName: true },
      });

      if (clientInfo) {
        // Trouver tous les admins pour les notifier
        const admins = await query("SELECT id FROM users WHERE role = 'ADMIN'", []);
        for (const admin of admins.rows) {
          await createNotification(
            admin.id,
            "Nouvelle activité de réservation",
            `${clientInfo.firstName} ${clientInfo.lastName} a mis à jour sa réservation pour "${booking.service.name}" - Statut: ${upperStatus.toLowerCase()}`,
            upperStatus === "CANCELLED" || upperStatus === "REJECTED"
              ? "warning"
              : "info",
            "/admin/bookings",
          );
        }
      }


      res.json({
        success: true,
        message: "Statut mis à jour",
        data: normalizeBookingPayload(updated),
      });
    } catch (error) {
      console.error("Erreur mise à jour statut:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  /**
   * Annuler une réservation
   */
  static async cancel(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = (req as any).user;

      const booking = await prisma.booking.findUnique({
        where: { id },
      });

      if (!booking) {
        res
          .status(404)
          .json({ success: false, message: "Réservation non trouvée" });
        return;
      }

      // Check access
      if (user.role === "CLIENT" && booking.clientId !== user.id) {
        res.status(403).json({ success: false, message: "Accès refusé" });
        return;
      }

      // Cannot cancel completed bookings
      if (["COMPLETED", "CANCELLED"].includes(booking.status)) {
        res.status(400).json({
          success: false,
          message: "Cette réservation ne peut pas être annulée",
        });
        return;
      }

      await prisma.booking.update({
        where: { id },
        data: {
          status: "CANCELLED",
        },
      });

      // Trouver les utilisateurs concernés pour les notifications privées
      let privateRecipients: string[] = [booking.clientId];
      const service = await prisma.service.findUnique({
        where: { id: booking.serviceId },
      });
      if (service?.providerId) {
        const providerProfile = await prisma.providerProfile.findUnique({
          where: { id: service.providerId },
        });
        if (providerProfile) {
          privateRecipients.push(providerProfile.userId);
        }
      }

      // Notifier le client de l'annulation
      await createNotification(
        booking.clientId,
        "Réservation annulée",
        "Votre réservation a été annulée",
        "warning",
        "/client/bookings",
        privateRecipients, // Privé entre client et prestataire
      );

      // Notifier le prestataire de l'annulation
      if (service?.providerId) {
        const providerProfile = await prisma.providerProfile.findUnique({
          where: { id: service.providerId },
        });
        if (providerProfile) {
          await createNotification(
            providerProfile.userId,
            "Réservation annulée",
            `Une réservation a été annulée`,
            "warning",
            "/prestataire/bookings",
            privateRecipients, // Privé entre client et prestataire
          );
        }
      }

      res.json({ success: true, message: "Réservation annulée" });
    } catch (error) {
      console.error("Erreur annulation réservation:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }
}

export default BookingController;

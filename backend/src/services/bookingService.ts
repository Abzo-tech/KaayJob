/**
 * Service de gestion des réservations
 * Logique métier pour les opérations sur les réservations
 */

import { prisma } from "../config/prisma";
import { query } from "../config/database";
import { createNotification } from "./notificationService";

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
export async function listBookings(filters: BookingFilters) {
  const { page = 1, limit = 20, status, providerId, clientId } = filters;
  const offset = (page - 1) * limit;

  let whereClause = "1=1";
  const params: any[] = [];
  let paramIndex = 1;

  if (status) {
    whereClause += ` AND b.status = $${paramIndex}`;
    params.push(status);
    paramIndex++;
  }

  if (providerId) {
    whereClause += ` AND s.provider_id = $${paramIndex}`;
    params.push(providerId);
    paramIndex++;
  }

  if (clientId) {
    whereClause += ` AND b.client_id = $${paramIndex}`;
    params.push(clientId);
    paramIndex++;
  }

  const countResult = await query(
    `SELECT COUNT(*) as count FROM bookings b WHERE ${whereClause}`,
    params,
  );

  const limitParamIndex = paramIndex;
  const offsetParamIndex = paramIndex + 1;

  const result = await query(
    `SELECT b.*, u.first_name as client_first_name, u.last_name as client_last_name,
            s.name as service_name, p.first_name as provider_first_name, p.last_name as provider_last_name
     FROM bookings b
     JOIN users u ON b.client_id = u.id
     JOIN services s ON b.service_id = s.id
     JOIN users p ON s.provider_id = p.id
     WHERE ${whereClause}
     ORDER BY b.created_at DESC
     LIMIT $${limitParamIndex} OFFSET $${offsetParamIndex}`,
    [...params, limit, offset],
  );

  return {
    data: result.rows,
    pagination: {
      page,
      limit,
      total: parseInt(countResult.rows[0].count),
    },
  };
}

/**
 * Obtenir une réservation par ID
 */
export async function getBookingById(bookingId: string) {
  const result = await query(
    `SELECT b.*, u.first_name as client_first_name, u.last_name as client_last_name,
            s.name as service_name, p.first_name as provider_first_name, p.last_name as provider_last_name
     FROM bookings b
     JOIN users u ON b.client_id = u.id
     JOIN services s ON b.service_id = s.id
     JOIN users p ON s.provider_id = p.id
     WHERE b.id = $1`,
    [bookingId],
  );

  if (result.rows.length === 0) {
    throw new Error("Réservation non trouvée");
  }

  return result.rows[0];
}

/**
 * Mettre à jour une réservation
 */
export async function updateBooking(
  bookingId: string,
  data: UpdateBookingData,
  adminId?: string,
) {
  // Vérifier si la réservation existe
  const existing = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      service: {
        include: { provider: true },
      },
      client: true,
    },
  });

  if (!existing) {
    throw new Error("Réservation non trouvée");
  }

  // Préparer les données de mise à jour
  const updateData: any = {};
  if (data.status) updateData.status = data.status;
  if (data.paymentStatus) updateData.paymentStatus = data.paymentStatus;
  if (data.bookingDate) updateData.bookingDate = new Date(data.bookingDate);
  if (data.bookingTime) updateData.bookingTime = data.bookingTime;
  if (data.address !== undefined) updateData.address = data.address;
  if (data.city !== undefined) updateData.city = data.city;
  if (data.notes !== undefined) updateData.notes = data.notes;

  if (Object.keys(updateData).length === 0) {
    throw new Error("Aucune donnée à mettre à jour");
  }

  // Mise à jour avec Prisma
  const result = await prisma.booking.update({
    where: { id: bookingId },
    data: updateData,
  });

  // Créer des notifications si le statut a changé
  if (data.status) {
    const statusMessages: { [key: string]: string } = {
      CONFIRMED: "confirmée",
      COMPLETED: "terminée",
      CANCELLED: "annulée",
      PENDING: "en attente",
    };

    // Notifier le client
    if (existing.clientId) {
      await createNotification(
        existing.clientId,
        "Statut de réservation mis à jour",
        `Votre réservation pour "${existing.service?.name || "un service"}" a été ${statusMessages[data.status] || "mise à jour"} par l'administrateur`,
        data.status === "CANCELLED" ? "error" : "success",
        "/client/bookings",
      );
    }

    // Notifier le prestataire
    if (existing.service?.providerId) {
      await createNotification(
        existing.service.providerId,
        "Réservation mise à jour",
        `La réservation pour "${existing.service?.name || "un service"}" a été ${statusMessages[data.status] || "mise à jour"} par l'administrateur`,
        data.status === "CANCELLED" ? "error" : "success",
        "/prestataire/bookings",
      );
    }

    // Notifier l'admin
    if (adminId) {
      await createNotification(
        adminId,
        "Réservation mise à jour",
        `La réservation #${bookingId.slice(0, 8)} a été ${statusMessages[data.status] || "mise à jour"}`,
        data.status === "CANCELLED" ? "error" : "success",
        "/admin/bookings",
      );
    }
  }

  return result;
}

/**
 * Supprimer une réservation
 */
export async function deleteBooking(bookingId: string) {
  // Vérifier si la réservation existe
  const existing = await query("SELECT id, status FROM bookings WHERE id = $1", [
    bookingId,
  ]);
  if (existing.rows.length === 0) {
    throw new Error("Réservation non trouvée");
  }

  // Vérifier si la réservation est terminée
  if (existing.rows[0].status === "COMPLETED") {
    throw new Error("Impossible de supprimer une réservation terminée");
  }

  // Supprimer les avis liés
  await query("DELETE FROM reviews WHERE booking_id = $1", [bookingId]);

  await query("DELETE FROM bookings WHERE id = $1", [bookingId]);

  return { success: true };
}

/**
 * Obtenir les statistiques des réservations
 */
export async function getBookingStats() {
  const result = await query(`
    SELECT COUNT(*) as total,
           SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) as pending,
           SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completed,
           SUM(CASE WHEN status = 'CANCELLED' THEN 1 ELSE 0 END) as cancelled
    FROM bookings
  `);

  return result.rows[0];
}

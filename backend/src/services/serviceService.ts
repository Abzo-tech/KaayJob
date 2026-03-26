/**
 * Service de gestion des services (prestations)
 * Logique métier pour les opérations sur les services
 */

import { prisma } from "../config/prisma";
import { query } from "../config/database";
import { createNotification } from "./notificationService";

export interface ServiceFilters {
  page?: number;
  limit?: number;
  category?: string;
}

export interface UpdateServiceData {
  name?: string;
  description?: string;
  price?: number;
  priceType?: string;
  duration?: number;
  isActive?: boolean;
}

/**
 * Liste des services avec pagination et filtres
 */
export async function listServices(filters: ServiceFilters) {
  const { page = 1, limit = 20, category } = filters;
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const offset = (pageNum - 1) * limitNum;

  // Construction du where clause pour Prisma
  const where: any = {};
  if (category) {
    where.categoryId = category;
  }

  // Requête avec Prisma
  let services: any[] = [];
  let total = 0;

  try {
    [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        skip: offset,
        take: limitNum,
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
          provider: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
        },
      }),
      prisma.service.count({ where }),
    ]);
  } catch (prismaError: any) {
    console.error("[AdminServices] Erreur Prisma:", prismaError);
    // Retry sans include
    services = await prisma.service.findMany({
      where,
      skip: offset,
      take: limitNum,
      orderBy: { createdAt: "desc" },
    });
    total = await prisma.service.count({ where });
  }

  // Transformation des données
  const transformedServices = services.map((s: any) => ({
    id: s.id,
    name: s.name,
    description: s.description,
    price: s.price,
    priceType: s.priceType,
    duration: s.duration,
    isActive: s.isActive,
    provider_id: s.providerId,
    category_id: s.categoryId,
    category_name: s.category?.name || null,
    first_name: s.provider?.user?.firstName || null,
    last_name: s.provider?.user?.lastName || null,
    provider_email: s.provider?.user?.email || null,
    created_at: s.createdAt,
    updated_at: s.updatedAt,
  }));

  return {
    data: transformedServices,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
    },
  };
}

/**
 * Obtenir un service par ID
 */
export async function getServiceById(serviceId: string) {
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: {
      category: true,
      provider: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!service) {
    throw new Error("Service non trouvé");
  }

  return {
    id: service.id,
    name: service.name,
    description: service.description,
    price: service.price,
    priceType: service.priceType,
    duration: service.duration,
    isActive: service.isActive,
    provider_id: service.providerId,
    category_id: service.categoryId,
    category_name: (service as any).category?.name || null,
    first_name: (service as any).provider?.user?.firstName || null,
    last_name: (service as any).provider?.user?.lastName || null,
    provider_email: (service as any).provider?.user?.email || null,
    created_at: service.createdAt,
    updated_at: service.updatedAt,
  };
}

/**
 * Mettre à jour un service
 */
export async function updateService(
  serviceId: string,
  data: UpdateServiceData,
  adminId?: string,
) {
  // Vérifier si le service existe
  const existing = await prisma.service.findUnique({
    where: { id: serviceId },
    include: { provider: true },
  });

  if (!existing) {
    throw new Error("Service non trouvé");
  }

  // Préparer les données de mise à jour
  const updateData: any = {};
  if (data.name) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.price !== undefined) updateData.price = parseFloat(String(data.price));
  if (data.duration !== undefined) updateData.duration = parseInt(String(data.duration));
  if (data.isActive !== undefined) updateData.isActive = data.isActive;
  if (data.priceType !== undefined) updateData.priceType = data.priceType;

  if (Object.keys(updateData).length === 0) {
    throw new Error("Aucune donnée à mettre à jour");
  }

  // Mise à jour avec Prisma
  const result = await prisma.service.update({
    where: { id: serviceId },
    data: updateData,
  });

  // Notifier le prestataire
  if (existing.providerId) {
    await createNotification(
      existing.providerId,
      "Service mis à jour",
      `Votre service "${existing.name}" a été mis à jour par l'administrateur`,
      "info",
      "/prestataire/services",
    );
  }

  // Notification pour l'admin
  if (adminId) {
    await createNotification(
      adminId,
      "Service mis à jour",
      "Le service a été mis à jour avec succès",
      "info",
      "/admin/services",
    );
  }

  return result;
}

/**
 * Supprimer un service
 */
export async function deleteService(serviceId: string, adminId?: string) {
  // Vérifier si le service existe
  const existing = await query(
    "SELECT id, name, provider_id FROM services WHERE id = $1",
    [serviceId],
  );
  if (existing.rows.length === 0) {
    throw new Error("Service non trouvé");
  }

  // Vérifier si des réservations utilisent ce service
  const bookingsCount = await query(
    "SELECT COUNT(*) as count FROM bookings WHERE service_id = $1",
    [serviceId],
  );
  if (parseInt(bookingsCount.rows[0].count) > 0) {
    throw new Error(
      "Impossible de supprimer ce service car il est utilisé par des réservations",
    );
  }

  await query("DELETE FROM services WHERE id = $1", [serviceId]);

  // Notifier le prestataire
  if (existing.rows[0].provider_id) {
    await createNotification(
      existing.rows[0].provider_id,
      "Service supprimé",
      `Votre service "${existing.rows[0].name}" a été supprimé par l'administrateur`,
      "warning",
      "/prestataire/services",
    );
  }

  // Notification pour l'admin
  if (adminId) {
    await createNotification(
      adminId,
      "Service supprimé",
      `Le service "${existing.rows[0].name}" a été supprimé avec succès`,
      "warning",
      "/admin/services",
    );
  }

  return { success: true };
}

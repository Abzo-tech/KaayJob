/**
 * Service de gestion des services (prestations)
 * Logique métier pour les opérations sur les services
 */

import { prisma } from "../config/prisma";
import { createNotification } from "./notificationService";

const normalizePriceType = (priceType?: string | null) =>
  priceType ? priceType.toLowerCase() : priceType;

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

export async function listServices(filters: ServiceFilters) {
  const { page = 1, limit = 20, category } = filters;
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const where: any = {};
  if (category) {
    where.categoryId = category;
  }

  const [services, total] = await Promise.all([
    prisma.service.findMany({
      where,
      skip,
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

  const transformedServices = services.map((s: any) => ({
    id: s.id,
    name: s.name,
    description: s.description,
    price: Number(s.price.toString()),
    priceType: normalizePriceType(s.priceType),
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
    price: Number(service.price.toString()),
    priceType: normalizePriceType(service.priceType),
    duration: service.duration,
    isActive: service.isActive,
    provider_id: service.providerId,
    category_id: service.categoryId,
    category_name: service.category?.name || null,
    first_name: service.provider?.user?.firstName || null,
    last_name: service.provider?.user?.lastName || null,
    provider_email: service.provider?.user?.email || null,
    created_at: service.createdAt,
    updated_at: service.updatedAt,
  };
}

export async function updateService(
  serviceId: string,
  data: UpdateServiceData,
  adminId?: string,
) {
  const existing = await prisma.service.findUnique({
    where: { id: serviceId },
    include: { provider: true },
  });

  if (!existing) {
    throw new Error("Service non trouvé");
  }

  const updateData: any = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.price !== undefined) updateData.price = Number(data.price);
  if (data.duration !== undefined) updateData.duration = Number(data.duration);
  if (data.isActive !== undefined) updateData.isActive = data.isActive;
  if (data.priceType !== undefined) updateData.priceType = data.priceType.toUpperCase();

  if (Object.keys(updateData).length === 0) {
    throw new Error("Aucune donnée à mettre à jour");
  }

  const result = await prisma.service.update({
    where: { id: serviceId },
    data: updateData,
  });

  if (existing.providerId) {
    await createNotification(
      existing.providerId,
      "Service mis à jour",
      `Votre service "${existing.name}" a été mis à jour par l'administrateur`,
      "info",
      "/prestataire/services",
    );
  }

  if (adminId) {
    await createNotification(
      adminId,
      "Service mis à jour",
      "Le service a été mis à jour avec succès",
      "info",
      "/admin/services",
    );
  }

  return {
    ...result,
    priceType: normalizePriceType(result.priceType),
  };
}

export async function deleteService(serviceId: string, adminId?: string) {
  const existing = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { id: true, name: true, providerId: true },
  });

  if (!existing) {
    throw new Error("Service non trouvé");
  }

  const bookingsCount = await prisma.booking.count({
    where: { serviceId },
  });
  if (bookingsCount > 0) {
    throw new Error(
      "Impossible de supprimer ce service car il est utilisé par des réservations",
    );
  }

  await prisma.service.delete({
    where: { id: serviceId },
  });

  if (existing.providerId) {
    await createNotification(
      existing.providerId,
      "Service supprimé",
      `Votre service "${existing.name}" a été supprimé par l'administrateur`,
      "warning",
      "/prestataire/services",
    );
  }

  if (adminId) {
    await createNotification(
      adminId,
      "Service supprimé",
      `Le service "${existing.name}" a été supprimé avec succès`,
      "warning",
      "/admin/services",
    );
  }

  return { success: true };
}

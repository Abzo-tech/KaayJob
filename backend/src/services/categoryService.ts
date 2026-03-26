/**
 * Service de gestion des catégories
 * Logique métier pour les opérations sur les catégories
 */

import { prisma } from "../config/prisma";
import { createNotification } from "./notificationService";

export interface CreateCategoryData {
  name: string;
  description?: string;
  icon?: string;
  image?: string;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  icon?: string;
  image?: string;
  isActive?: boolean;
  displayOrder?: number;
}

/**
 * Liste des catégories
 */
export async function listCategories() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { services: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return categories.map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    icon: c.icon,
    image: c.image,
    isActive: c.isActive,
    displayOrder: c.displayOrder,
    service_count: c._count.services,
    created_at: c.createdAt,
  }));
}

/**
 * Obtenir une catégorie par ID
 */
export async function getCategoryById(categoryId: string) {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      _count: {
        select: { services: true },
      },
    },
  });

  if (!category) {
    throw new Error("Catégorie non trouvée");
  }

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    icon: category.icon,
    image: category.image,
    isActive: category.isActive,
    displayOrder: category.displayOrder,
    service_count: (category as any)._count.services,
    created_at: category.createdAt,
  };
}

/**
 * Créer une catégorie
 */
export async function createCategory(data: CreateCategoryData, adminId?: string) {
  const { name, description, icon, image } = data;

  const result = await prisma.category.create({
    data: {
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      description,
      icon,
      image,
    },
  });

  // Notification pour l'admin
  if (adminId) {
    await createNotification(
      adminId,
      "Catégorie créée",
      `La catégorie "${name}" a été créée avec succès`,
      "success",
      "/admin/categories",
    );
  }

  return result;
}

/**
 * Mettre à jour une catégorie
 */
export async function updateCategory(
  categoryId: string,
  data: UpdateCategoryData,
  adminId?: string,
) {
  // Vérifier si la catégorie existe
  const existing = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!existing) {
    throw new Error("Catégorie non trouvée");
  }

  // Préparer les données de mise à jour
  const updateData: any = {};
  if (data.name) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.icon !== undefined) updateData.icon = data.icon;
  if (data.image !== undefined) updateData.image = data.image;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;
  if (data.displayOrder !== undefined)
    updateData.displayOrder = parseInt(String(data.displayOrder));

  if (Object.keys(updateData).length === 0) {
    throw new Error("Aucune donnée à mettre à jour");
  }

  const result = await prisma.category.update({
    where: { id: categoryId },
    data: updateData,
  });

  // Notification pour l'admin
  if (adminId) {
    await createNotification(
      adminId,
      "Catégorie mise à jour",
      "La catégorie a été mise à jour avec succès",
      "info",
      "/admin/categories",
    );
  }

  return result;
}

/**
 * Supprimer une catégorie
 */
export async function deleteCategory(categoryId: string, adminId?: string) {
  // Vérifier si la catégorie existe
  const existing = await prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      _count: { select: { services: true } },
    },
  });

  if (!existing) {
    throw new Error("Catégorie non trouvée");
  }

  // Vérifier si des services utilisent cette catégorie
  if ((existing as any)._count.services > 0) {
    throw new Error(
      "Impossible de supprimer cette catégorie car elle contient des services",
    );
  }

  await prisma.category.delete({
    where: { id: categoryId },
  });

  // Notification pour l'admin
  if (adminId) {
    await createNotification(
      adminId,
      "Catégorie supprimée",
      `La catégorie "${existing.name}" a été supprimée avec succès`,
      "warning",
      "/admin/categories",
    );
  }

  return { success: true };
}

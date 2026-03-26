"use strict";
/**
 * Service de gestion des catégories
 * Logique métier pour les opérations sur les catégories
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCategories = listCategories;
exports.getCategoryById = getCategoryById;
exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
const prisma_1 = require("../config/prisma");
const notificationService_1 = require("./notificationService");
/**
 * Liste des catégories
 */
async function listCategories() {
    const categories = await prisma_1.prisma.category.findMany({
        include: {
            _count: {
                select: { services: true },
            },
        },
        orderBy: { name: "asc" },
    });
    return categories.map((c) => ({
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
async function getCategoryById(categoryId) {
    const category = await prisma_1.prisma.category.findUnique({
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
        service_count: category._count.services,
        created_at: category.createdAt,
    };
}
/**
 * Créer une catégorie
 */
async function createCategory(data, adminId) {
    const { name, description, icon, image } = data;
    const result = await prisma_1.prisma.category.create({
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
        await (0, notificationService_1.createNotification)(adminId, "Catégorie créée", `La catégorie "${name}" a été créée avec succès`, "success", "/admin/categories");
    }
    return result;
}
/**
 * Mettre à jour une catégorie
 */
async function updateCategory(categoryId, data, adminId) {
    // Vérifier si la catégorie existe
    const existing = await prisma_1.prisma.category.findUnique({
        where: { id: categoryId },
    });
    if (!existing) {
        throw new Error("Catégorie non trouvée");
    }
    // Préparer les données de mise à jour
    const updateData = {};
    if (data.name)
        updateData.name = data.name;
    if (data.description !== undefined)
        updateData.description = data.description;
    if (data.icon !== undefined)
        updateData.icon = data.icon;
    if (data.image !== undefined)
        updateData.image = data.image;
    if (data.isActive !== undefined)
        updateData.isActive = data.isActive;
    if (data.displayOrder !== undefined)
        updateData.displayOrder = parseInt(String(data.displayOrder));
    if (Object.keys(updateData).length === 0) {
        throw new Error("Aucune donnée à mettre à jour");
    }
    const result = await prisma_1.prisma.category.update({
        where: { id: categoryId },
        data: updateData,
    });
    // Notification pour l'admin
    if (adminId) {
        await (0, notificationService_1.createNotification)(adminId, "Catégorie mise à jour", "La catégorie a été mise à jour avec succès", "info", "/admin/categories");
    }
    return result;
}
/**
 * Supprimer une catégorie
 */
async function deleteCategory(categoryId, adminId) {
    // Vérifier si la catégorie existe
    const existing = await prisma_1.prisma.category.findUnique({
        where: { id: categoryId },
        include: {
            _count: { select: { services: true } },
        },
    });
    if (!existing) {
        throw new Error("Catégorie non trouvée");
    }
    // Vérifier si des services utilisent cette catégorie
    if (existing._count.services > 0) {
        throw new Error("Impossible de supprimer cette catégorie car elle contient des services");
    }
    await prisma_1.prisma.category.delete({
        where: { id: categoryId },
    });
    // Notification pour l'admin
    if (adminId) {
        await (0, notificationService_1.createNotification)(adminId, "Catégorie supprimée", `La catégorie "${existing.name}" a été supprimée avec succès`, "warning", "/admin/categories");
    }
    return { success: true };
}
//# sourceMappingURL=categoryService.js.map
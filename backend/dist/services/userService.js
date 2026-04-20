"use strict";
/**
 * Service de gestion des utilisateurs
 * Logique métier pour les opérations sur les utilisateurs
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsers = listUsers;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.verifyProvider = verifyProvider;
exports.deleteUser = deleteUser;
exports.getUserById = getUserById;
const prisma_1 = require("../config/prisma");
const notificationService_1 = require("./notificationService");
const normalizeUserRow = (row) => ({
    id: row.id,
    email: row.email,
    firstName: row.firstName,
    lastName: row.lastName,
    phone: row.phone ?? null,
    role: row.role,
    isActive: row.isActive,
    isVerified: row.providerProfile?.isVerified ?? false,
    bookingCount: row._count?.clientBookings ?? 0,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
});
async function listUsers(filters) {
    const { page = 1, limit = 20, role, search } = filters;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;
    const where = {};
    if (role) {
        where.role = role.toUpperCase();
    }
    if (search) {
        where.OR = [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
        ];
    }
    const [users, total] = await Promise.all([
        prisma_1.prisma.user.findMany({
            where,
            skip,
            take: limitNum,
            orderBy: { createdAt: "desc" },
            include: {
                providerProfile: {
                    select: { isVerified: true },
                },
                _count: {
                    select: { clientBookings: true },
                },
            },
        }),
        prisma_1.prisma.user.count({ where }),
    ]);
    return {
        data: users.map(normalizeUserRow),
        pagination: {
            page: pageNum,
            limit: limitNum,
            total,
        },
    };
}
async function createUser(data, adminId) {
    const { email, password, firstName, lastName, phone, role = "CLIENT" } = data;
    const existingUser = await prisma_1.prisma.user.findUnique({
        where: { email },
        select: { id: true },
    });
    if (existingUser) {
        throw new Error("Email déjà utilisé");
    }
    const user = await prisma_1.prisma.user.create({
        data: {
            email,
            password,
            firstName,
            lastName,
            phone: phone ?? "",
            role: role.toUpperCase(),
            isActive: true,
            isVerified: true,
        },
    });
    await (0, notificationService_1.createFormattedNotification)({ id: user.id, role: user.role, firstName: user.firstName, lastName: user.lastName }, "Bienvenue sur KaayJob", `Votre compte a été créé avec succès. Votre rôle: ${user.role}`, "success", user.role === "PRESTATAIRE" ? "/prestataire/dashboard" : "/client/dashboard");
    if (user.role === "PRESTATAIRE") {
        const clients = await prisma_1.prisma.user.findMany({
            where: { role: "CLIENT", isActive: true },
            select: { id: true },
        });
        for (const client of clients) {
            await (0, notificationService_1.createFormattedNotification)({ id: client.id, role: "CLIENT" }, "Nouveau prestataire disponible", `${firstName} ${lastName} propose maintenant ses services sur KaayJob`, "info", "/categories", undefined, { actor: { firstName, lastName, role: "PRESTATAIRE" } });
        }
    }
    if (adminId) {
        await (0, notificationService_1.createFormattedNotification)({ id: adminId, role: "ADMIN" }, "Utilisateur créé", `${firstName} ${lastName} (${email}) a été créé avec succès`, "success", "/admin/users", undefined, { target: { firstName, lastName, role: user.role } });
    }
    return normalizeUserRow(user);
}
async function updateUser(userId, data, adminId) {
    const existingUser = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, firstName: true, lastName: true, email: true, role: true },
    });
    if (!existingUser) {
        throw new Error("Utilisateur non trouvé");
    }
    if (data.email) {
        const emailExists = await prisma_1.prisma.user.findFirst({
            where: { email: data.email, id: { not: userId } },
            select: { id: true },
        });
        if (emailExists) {
            throw new Error("Email déjà utilisé");
        }
    }
    const updateData = {};
    if (data.email !== undefined)
        updateData.email = data.email;
    if (data.firstName !== undefined)
        updateData.firstName = data.firstName;
    if (data.lastName !== undefined)
        updateData.lastName = data.lastName;
    if (data.phone !== undefined)
        updateData.phone = data.phone;
    if (data.role !== undefined)
        updateData.role = data.role.toUpperCase();
    if (data.isActive !== undefined)
        updateData.isActive = data.isActive;
    const result = await prisma_1.prisma.user.update({
        where: { id: userId },
        data: updateData,
    });
    if (adminId) {
        const userName = `${result.firstName} ${result.lastName}`;
        await (0, notificationService_1.createFormattedNotification)({ id: adminId, role: "ADMIN" }, "Utilisateur mis à jour", `${userName} a été mis à jour avec succès`, "info", "/admin/users", undefined, { target: { firstName: result.firstName, lastName: result.lastName, role: result.role } });
    }
    return normalizeUserRow(result);
}
async function verifyProvider(providerId, adminId) {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: providerId },
        select: {
            id: true,
            role: true,
            firstName: true,
            lastName: true,
            email: true,
        },
    });
    if (!user) {
        throw new Error("Utilisateur non trouvé");
    }
    if (user.role !== "PRESTATAIRE") {
        throw new Error("Cet utilisateur n'est pas un prestataire");
    }
    const profile = await prisma_1.prisma.providerProfile.upsert({
        where: { userId: providerId },
        update: {
            isVerified: true,
            updatedAt: new Date(),
        },
        create: {
            userId: providerId,
            isVerified: true,
            isAvailable: true,
        },
    });
    await (0, notificationService_1.createFormattedNotification)(user, "Compte vérifié", "Votre compte prestataire a été vérifié par l'administrateur. Vous pouvez maintenant offrir vos services sur la plateforme.", "success", "/prestataire/dashboard");
    return {
        id: profile.id,
        userId: profile.userId,
        isVerified: profile.isVerified,
        updatedAt: profile.updatedAt,
    };
}
async function deleteUser(userId, adminId) {
    const profile = await prisma_1.prisma.providerProfile.findUnique({
        where: { userId },
        select: { id: true },
    });
    if (profile) {
        await prisma_1.prisma.review.deleteMany({ where: { providerId: profile.id } });
    }
    await prisma_1.prisma.review.deleteMany({ where: { clientId: userId } });
    await prisma_1.prisma.booking.deleteMany({ where: { clientId: userId } });
    if (profile) {
        const services = await prisma_1.prisma.service.findMany({
            where: { providerId: userId },
            select: { id: true },
        });
        const serviceIds = services.map((service) => service.id);
        if (serviceIds.length > 0) {
            await prisma_1.prisma.booking.deleteMany({ where: { serviceId: { in: serviceIds } } });
            await prisma_1.prisma.service.deleteMany({ where: { id: { in: serviceIds } } });
        }
    }
    await prisma_1.prisma.providerProfile.deleteMany({ where: { userId } });
    await prisma_1.prisma.user.delete({ where: { id: userId } });
    if (adminId) {
        await (0, notificationService_1.createFormattedNotification)({ id: adminId, role: "ADMIN" }, "Utilisateur supprimé", "L'utilisateur a été supprimé avec succès", "warning", "/admin/users");
    }
    return { success: true };
}
async function getUserById(userId) {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        include: {
            providerProfile: { select: { isVerified: true } },
            _count: { select: { clientBookings: true } },
        },
    });
    if (!user) {
        throw new Error("Utilisateur non trouvé");
    }
    return normalizeUserRow(user);
}
//# sourceMappingURL=userService.js.map
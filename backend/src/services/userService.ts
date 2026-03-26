/**
 * Service de gestion des utilisateurs
 * Logique métier pour les opérations sur les utilisateurs
 */

import { prisma } from "../config/prisma";
import { query } from "../config/database";
import { createNotification } from "./notificationService";

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: string;
}

export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: string;
  isActive?: boolean;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
}

/**
 * Liste des utilisateurs avec pagination et filtres
 */
export async function listUsers(filters: UserFilters) {
  const { page = 1, limit = 20, role, search } = filters;
  const offset = (page - 1) * limit;

  let whereClause = "1=1";
  const params: any[] = [];
  let paramIndex = 1;

  if (role) {
    whereClause += ` AND role = $${paramIndex}`;
    params.push(role);
    paramIndex++;
  }

  if (search) {
    whereClause += ` AND (first_name ILIKE $${paramIndex} OR last_name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  const countResult = await query(
    `SELECT COUNT(*) as count FROM users WHERE ${whereClause}`,
    params,
  );

  const result = await query(
    `SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.role, u.created_at,
            COALESCE(pp.is_verified, false) as is_verified,
            (SELECT COUNT(*) FROM bookings WHERE client_id = u.id) as booking_count
     FROM users u
     LEFT JOIN provider_profiles pp ON u.id = pp.user_id
     WHERE ${whereClause}
     ORDER BY u.created_at DESC
     LIMIT ${limit} OFFSET ${offset}`,
    params,
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
 * Créer un nouvel utilisateur
 */
export async function createUser(data: CreateUserData, adminId?: string) {
  const { email, password, firstName, lastName, phone, role = "CLIENT" } = data;

  // Vérifier si l'email existe déjà
  const existingUser = await query(
    "SELECT id FROM users WHERE email = $1",
    [email],
  );
  if (existingUser.rows.length > 0) {
    throw new Error("Email déjà utilisé");
  }

  const result = await query(
    `INSERT INTO users (id, email, password, first_name, last_name, phone, role, is_active, is_verified, created_at, updated_at)
     VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, true, true, NOW(), NOW()) RETURNING id, email, first_name, last_name, phone, role, created_at`,
    [email, password, firstName, lastName, phone || null, role],
  );

  const user = result.rows[0];

  // Créer une notification pour le nouvel utilisateur
  await createNotification(
    user.id,
    "Bienvenue sur KaayJob",
    `Votre compte a été créé avec succès. Votre rôle: ${role}`,
    "success",
    role === "PRESTATAIRE" ? "/prestataire/dashboard" : "/client/dashboard",
  );

  // Si c'est un prestataire qui s'inscrit, notifier tous les clients existants
  if (role === "PRESTATAIRE") {
    // Récupérer tous les clients actifs
    const clientsResult = await query(
      "SELECT id FROM users WHERE role = 'CLIENT' AND is_active = true",
      []
    );

    // Notifier chaque client du nouveau prestataire
    for (const client of clientsResult.rows) {
      await createNotification(
        client.id,
        "Nouveau prestataire disponible",
        `${firstName} ${lastName} propose maintenant ses services sur KaayJob`,
        "info",
        "/categories",
      );
    }
  }

  // Notification pour l'admin
  if (adminId) {
    await createNotification(
      adminId,
      "Utilisateur créé",
      `${firstName} ${lastName} (${email}) a été créé avec succès`,
      "success",
      "/admin/users",
    );
  }

  return user;
}

/**
 * Mettre à jour un utilisateur
 */
export async function updateUser(userId: string, data: UpdateUserData, adminId?: string) {
  // Vérifier si l'utilisateur existe
  const existingUser = await query("SELECT id FROM users WHERE id = $1", [userId]);
  if (existingUser.rows.length === 0) {
    throw new Error("Utilisateur non trouvé");
  }

  // Vérifier si le nouvel email est déjà utilisé
  if (data.email) {
    const emailExists = await query(
      "SELECT id FROM users WHERE email = $1 AND id != $2",
      [data.email, userId],
    );
    if (emailExists.rows.length > 0) {
      throw new Error("Email déjà utilisé");
    }
  }

  const updates: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  if (data.email) {
    updates.push(`email = $${paramIndex++}`);
    params.push(data.email);
  }
  if (data.firstName) {
    updates.push(`first_name = $${paramIndex++}`);
    params.push(data.firstName);
  }
  if (data.lastName) {
    updates.push(`last_name = $${paramIndex++}`);
    params.push(data.lastName);
  }
  if (data.phone !== undefined) {
    updates.push(`phone = $${paramIndex++}`);
    params.push(data.phone);
  }
  if (data.role) {
    updates.push(`role = $${paramIndex++}`);
    params.push(data.role);
  }
  if (data.isActive !== undefined) {
    updates.push(`is_active = $${paramIndex++}`);
    params.push(data.isActive);
  }

  if (updates.length === 0) {
    throw new Error("Aucune donnée à mettre à jour");
  }

  updates.push(`updated_at = NOW()`);
  params.push(userId);

  const result = await query(
    `UPDATE users SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING id, email, first_name, last_name, phone, role, is_active, created_at`,
    params,
  );

  // Notification pour l'admin
  if (adminId) {
    const userName = `${result.rows[0].first_name} ${result.rows[0].last_name}`;
    await createNotification(
      adminId,
      "Utilisateur mis à jour",
      `${userName} a été mis à jour avec succès`,
      "info",
      "/admin/users",
    );
  }

  return result.rows[0];
}

/**
 * Vérifier un prestataire
 */
export async function verifyProvider(providerId: string, adminId: string) {
  // Vérifier si l'utilisateur est un prestataire
  const userCheck = await query(
    "SELECT role, first_name, last_name FROM users WHERE id = $1",
    [providerId],
  );

  if (userCheck.rows.length === 0) {
    throw new Error("Utilisateur non trouvé");
  }

  if (userCheck.rows[0].role !== "PRESTATAIRE") {
    throw new Error("Cet utilisateur n'est pas un prestataire");
  }

  // Créer ou mettre à jour le provider_profile
  const existingProfile = await query(
    "SELECT id FROM provider_profiles WHERE user_id = $1",
    [providerId],
  );

  let result;
  if (existingProfile.rows.length === 0) {
    result = await query(
      "INSERT INTO provider_profiles (id, user_id, is_verified, created_at, updated_at) VALUES (gen_random_uuid(), $1, true, NOW(), NOW()) RETURNING *",
      [providerId],
    );
  } else {
    result = await query(
      "UPDATE provider_profiles SET is_verified = true, updated_at = NOW() WHERE user_id = $1 RETURNING *",
      [providerId],
    );
  }

  // Notifications
  const userName = `${userCheck.rows[0].first_name} ${userCheck.rows[0].last_name}`;
  await createNotification(
    providerId,
    "Compte vérifié",
    "Votre compte prestataire a été vérifié par l'administrateur. Vous pouvez maintenant offrir vos services sur la plateforme.",
    "success",
    "/prestataire/dashboard",
  );

  await createNotification(
    adminId,
    "Prestataire vérifié",
    `${userName} a été vérifié avec succès`,
    "success",
    "/admin/users",
  );

  return result.rows[0];
}

/**
 * Supprimer un utilisateur
 */
export async function deleteUser(userId: string, adminId?: string) {
  // Trouver le profil prestataire si existant
  const profileResult = await query(
    "SELECT id FROM provider_profiles WHERE user_id = $1",
    [userId],
  );
  const profileId = profileResult.rows[0]?.id;

  // Supprimer les reviews où ce user est provider
  if (profileId) {
    await query("DELETE FROM reviews WHERE provider_id = $1", [profileId]);
  }

  // Supprimer les reviews où ce user est client
  await query("DELETE FROM reviews WHERE client_id = $1", [userId]);

  // Supprimer les bookings liés aux services de ce provider
  await query(
    "DELETE FROM bookings WHERE service_id IN (SELECT id FROM services WHERE provider_id = $1)",
    [userId],
  );

  // Supprimer les bookings où l'utilisateur est client
  await query("DELETE FROM bookings WHERE client_id = $1", [userId]);

  // Supprimer le profil prestataire
  await query("DELETE FROM provider_profiles WHERE user_id = $1", [userId]);

  // Supprimer les services
  await query("DELETE FROM services WHERE provider_id = $1", [userId]);

  // Supprimer l'utilisateur
  await query("DELETE FROM users WHERE id = $1", [userId]);

  // Notification pour l'admin
  if (adminId) {
    await createNotification(
      adminId,
      "Utilisateur supprimé",
      "L'utilisateur a été supprimé avec succès",
      "warning",
      "/admin/users",
    );
  }

  return { success: true };
}

/**
 * Obtenir un utilisateur par ID
 */
export async function getUserById(userId: string) {
  const result = await query(
    `SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.role, u.is_active, u.created_at,
            COALESCE(pp.is_verified, false) as is_verified,
            (SELECT COUNT(*) FROM bookings WHERE client_id = u.id) as booking_count
     FROM users u
     LEFT JOIN provider_profiles pp ON u.id = pp.user_id
     WHERE u.id = $1`,
    [userId],
  );

  if (result.rows.length === 0) {
    throw new Error("Utilisateur non trouvé");
  }

  return result.rows[0];
}

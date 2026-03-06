"use strict";
/**
 * Schémas de validation Zod pour KaayJob
 * Centralisation des règles de validation pour le backend
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProviderProfileSchema = exports.updateUserSchema = exports.createReviewSchema = exports.updateServiceSchema = exports.createServiceSchema = exports.updateBookingStatusSchema = exports.createBookingSchema = exports.bookingTimeSchema = exports.bookingDateSchema = exports.loginSchema = exports.registerSchema = exports.citySchema = exports.addressSchema = exports.nameSchema = exports.phoneSchema = exports.passwordSchema = exports.emailSchema = void 0;
const zod_1 = require("zod");
// =====================================================
// SCHÉMAS COMMUNS (Réutilisables)
// =====================================================
/**
 * Schéma d'email
 */
exports.emailSchema = zod_1.z
    .string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide")
    .max(255, "L'email ne peut pas dépasser 255 caractères")
    .toLowerCase()
    .trim();
/**
 * Schéma de mot de passe
 * Règles: minimum 8 caractères, au moins une majuscule, une minuscule et un chiffre
 */
exports.passwordSchema = zod_1.z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(72, "Le mot de passe ne peut pas dépasser 72 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre");
/**
 * Schéma de numéro de téléphone téléphonique sénégalais
 * Format: +221XXXXXXXXX ou 221XXXXXXXXX ou 0XXXXXXXXX
 */
exports.phoneSchema = zod_1.z
    .string()
    .min(1, "Le numéro de téléphone est requis")
    .regex(/^(\+221|221|0)[7-9][0-9]{8}$/, "Format de téléphone invalide. Ex: +221771234567");
/**
 * Schéma de nom (prénom ou nom)
 */
exports.nameSchema = zod_1.z
    .string()
    .min(1, "Le champ est requis")
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s\-']+$/, "Le nom ne peut contenir que des lettres")
    .trim();
/**
 * Schéma d'adresse
 */
exports.addressSchema = zod_1.z
    .string()
    .min(1, "L'adresse est requise")
    .min(5, "L'adresse doit contenir au moins 5 caractères")
    .max(255, "L'adresse ne peut pas dépasser 255 caractères")
    .trim();
/**
 * Schéma de ville
 */
exports.citySchema = zod_1.z
    .string()
    .min(1, "La ville est requise")
    .max(100, "Le nom de la ville ne peut pas dépasser 100 caractères")
    .trim();
// =====================================================
// SCHÉMAS D'AUTHENTIFICATION
// =====================================================
/**
 * Schéma d'inscription
 */
exports.registerSchema = zod_1.z
    .object({
    email: exports.emailSchema,
    password: exports.passwordSchema,
    firstName: exports.nameSchema,
    lastName: exports.nameSchema,
    phone: exports.phoneSchema,
    role: zod_1.z.enum(["client", "prestataire"], {
        errorMap: () => ({
            message: 'Le rôle doit être "client" ou "prestataire"',
        }),
    }),
})
    .strict();
/**
 * Schéma de connexion
 */
exports.loginSchema = zod_1.z
    .object({
    email: exports.emailSchema,
    password: zod_1.z.string().min(1, "Le mot de passe est requis"),
})
    .strict();
// =====================================================
// SCHÉMAS DE RÉSERVATION
// =====================================================
/**
 * Schéma de date de réservation
 * La date doit être aujourd'hui ou dans le futur
 */
exports.bookingDateSchema = zod_1.z
    .string()
    .min(1, "La date est requise")
    .refine((date) => {
    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return bookingDate >= today;
}, "La date de réservation doit être aujourd'hui ou dans le futur");
/**
 * Schéma d'heure de réservation
 * Format: HH:mm
 */
exports.bookingTimeSchema = zod_1.z
    .string()
    .min(1, "L'heure est requise")
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format d'heure invalide (HH:mm)")
    .refine((time) => {
    const [hours] = time.split(":").map(Number);
    return hours >= 8 && hours < 19; // Heures de travail: 8h-19h
}, "Les heures de réservation sont entre 8h et 19h");
/**
 * Schéma de création de réservation
 */
exports.createBookingSchema = zod_1.z
    .object({
    providerId: zod_1.z.string().uuid("ID provider invalide"),
    serviceId: zod_1.z.string().uuid("ID service invalide").optional(),
    bookingDate: exports.bookingDateSchema,
    bookingTime: exports.bookingTimeSchema,
    duration: zod_1.z
        .number()
        .int()
        .min(30, "La durée minimum est de 30 minutes")
        .max(480, "La durée maximum est de 8 heures")
        .optional(),
    address: exports.addressSchema,
    city: exports.citySchema,
    phone: exports.phoneSchema,
    notes: zod_1.z
        .string()
        .max(1000, "Les notes ne peuvent pas dépasser 1000 caractères")
        .optional(),
})
    .strict();
/**
 * Schéma de mise à jour du statut de réservation
 */
exports.updateBookingStatusSchema = zod_1.z
    .object({
    status: zod_1.z.enum(["confirmed", "in_progress", "completed", "cancelled", "rejected"], {
        errorMap: () => ({ message: "Statut invalide" }),
    }),
})
    .strict();
// =====================================================
// SCHÉMAS DE SERVICES
// =====================================================
/**
 * Schéma de création de service
 */
exports.createServiceSchema = zod_1.z
    .object({
    name: zod_1.z
        .string()
        .min(1, "Le nom du service est requis")
        .min(3, "Le nom doit contenir au moins 3 caractères")
        .max(100, "Le nom ne peut pas dépasser 100 caractères")
        .trim(),
    description: zod_1.z
        .string()
        .max(2000, "La description ne peut pas dépasser 2000 caractères")
        .optional(),
    price: zod_1.z
        .number({ invalid_type_error: "Le prix doit être un nombre" })
        .positive("Le prix doit être positif")
        .max(1000000, "Le prix ne peut pas dépasser 1 000 000"),
    priceType: zod_1.z.enum(["fixed", "hourly", "quote"]).optional(),
    duration: zod_1.z
        .number()
        .int()
        .min(15, "La durée minimum est de 15 minutes")
        .max(480, "La durée maximum est de 8 heures")
        .optional(),
    categoryId: zod_1.z.string().uuid("ID catégorie invalide").optional(),
})
    .strict();
/**
 * Schéma de mise à jour de service
 */
exports.updateServiceSchema = exports.createServiceSchema.partial();
// =====================================================
// SCHÉMAS D'AVIS
// =====================================================
/**
 * Schéma de création d'avis
 */
exports.createReviewSchema = zod_1.z
    .object({
    bookingId: zod_1.z.string().uuid("ID réservation invalide"),
    rating: zod_1.z
        .number()
        .int()
        .min(1, "La note minimum est 1")
        .max(5, "La note maximum est 5"),
    comment: zod_1.z
        .string()
        .max(1000, "Le commentaire ne peut pas dépasser 1000 caractères")
        .optional(),
})
    .strict();
// =====================================================
// SCHÉMAS DE PROFIL
// =====================================================
/**
 * Schéma de mise à jour du profil utilisateur
 */
exports.updateUserSchema = zod_1.z
    .object({
    firstName: exports.nameSchema.optional(),
    lastName: exports.nameSchema.optional(),
    phone: exports.phoneSchema.optional(),
    avatar: zod_1.z.string().url("URL d'avatar invalide").optional(),
})
    .strict();
/**
 * Schéma de mise à jour du profil prestataire
 */
exports.updateProviderProfileSchema = zod_1.z
    .object({
    specialty: zod_1.z
        .string()
        .min(2, "La specialty doit contenir au moins 2 caractères")
        .max(100, "La specialty ne peut pas dépasser 100 caractères")
        .optional(),
    bio: zod_1.z
        .string()
        .max(2000, "La bio ne peut pas dépasser 2000 caractères")
        .optional(),
    hourlyRate: zod_1.z
        .number()
        .positive("Le tarif horaire doit être positif")
        .max(100000, "Le tarif ne peut pas dépasser 100 000")
        .optional(),
    yearsExperience: zod_1.z
        .number()
        .int()
        .min(0, "Les années d'expérience ne peuvent pas être négatives")
        .max(50, "Les années d'expérience ne peuvent pas dépasser 50")
        .optional(),
    location: zod_1.z
        .string()
        .max(255, "La localisation ne peut pas dépasser 255 caractères")
        .optional(),
    isAvailable: zod_1.z.boolean().optional(),
})
    .strict();
//# sourceMappingURL=schemas.js.map
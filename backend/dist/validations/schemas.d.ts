/**
 * Schémas de validation Zod pour KaayJob
 * Centralisation des règles de validation pour le backend
 */
import { z } from "zod";
/**
 * Schéma d'email
 */
export declare const emailSchema: z.ZodString;
/**
 * Schéma de mot de passe
 * Règles: minimum 8 caractères, au moins une majuscule, une minuscule et un chiffre
 */
export declare const passwordSchema: z.ZodString;
/**
 * Schéma de numéro de téléphone téléphonique sénégalais
 * Format: +221XXXXXXXXX ou 221XXXXXXXXX ou 0XXXXXXXXX
 */
export declare const phoneSchema: z.ZodString;
/**
 * Schéma de nom (prénom ou nom)
 */
export declare const nameSchema: z.ZodString;
/**
 * Schéma d'adresse
 */
export declare const addressSchema: z.ZodString;
/**
 * Schéma de ville
 */
export declare const citySchema: z.ZodString;
/**
 * Schéma d'inscription
 */
export declare const registerSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    phone: z.ZodString;
    role: z.ZodEnum<["client", "prestataire"]>;
}, "strict", z.ZodTypeAny, {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: "client" | "prestataire";
}, {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: "client" | "prestataire";
}>;
/**
 * Schéma de connexion
 */
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strict", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
/**
 * Schéma de date de réservation
 * La date doit être aujourd'hui ou dans le futur
 */
export declare const bookingDateSchema: z.ZodEffects<z.ZodString, string, string>;
/**
 * Schéma d'heure de réservation
 * Format: HH:mm
 */
export declare const bookingTimeSchema: z.ZodEffects<z.ZodString, string, string>;
/**
 * Schéma de création de réservation
 */
export declare const createBookingSchema: z.ZodObject<{
    providerId: z.ZodString;
    serviceId: z.ZodOptional<z.ZodString>;
    bookingDate: z.ZodEffects<z.ZodString, string, string>;
    bookingTime: z.ZodEffects<z.ZodString, string, string>;
    duration: z.ZodOptional<z.ZodNumber>;
    address: z.ZodString;
    city: z.ZodString;
    phone: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    phone: string;
    providerId: string;
    bookingDate: string;
    bookingTime: string;
    address: string;
    city: string;
    duration?: number | undefined;
    serviceId?: string | undefined;
    notes?: string | undefined;
}, {
    phone: string;
    providerId: string;
    bookingDate: string;
    bookingTime: string;
    address: string;
    city: string;
    duration?: number | undefined;
    serviceId?: string | undefined;
    notes?: string | undefined;
}>;
/**
 * Schéma de mise à jour du statut de réservation
 */
export declare const updateBookingStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["confirmed", "in_progress", "completed", "cancelled", "rejected"]>;
}, "strict", z.ZodTypeAny, {
    status: "completed" | "cancelled" | "confirmed" | "in_progress" | "rejected";
}, {
    status: "completed" | "cancelled" | "confirmed" | "in_progress" | "rejected";
}>;
/**
 * Schéma de création de service
 */
export declare const createServiceSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodNumber;
    priceType: z.ZodOptional<z.ZodEnum<["fixed", "hourly", "quote"]>>;
    duration: z.ZodOptional<z.ZodNumber>;
    categoryId: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    name: string;
    price: number;
    description?: string | undefined;
    priceType?: "fixed" | "hourly" | "quote" | undefined;
    duration?: number | undefined;
    categoryId?: string | undefined;
}, {
    name: string;
    price: number;
    description?: string | undefined;
    priceType?: "fixed" | "hourly" | "quote" | undefined;
    duration?: number | undefined;
    categoryId?: string | undefined;
}>;
/**
 * Schéma de mise à jour de service
 */
export declare const updateServiceSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    price: z.ZodOptional<z.ZodNumber>;
    priceType: z.ZodOptional<z.ZodOptional<z.ZodEnum<["fixed", "hourly", "quote"]>>>;
    duration: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    categoryId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strict", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    price?: number | undefined;
    priceType?: "fixed" | "hourly" | "quote" | undefined;
    duration?: number | undefined;
    categoryId?: string | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    price?: number | undefined;
    priceType?: "fixed" | "hourly" | "quote" | undefined;
    duration?: number | undefined;
    categoryId?: string | undefined;
}>;
/**
 * Schéma de création d'avis
 */
export declare const createReviewSchema: z.ZodObject<{
    bookingId: z.ZodString;
    rating: z.ZodNumber;
    comment: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    bookingId: string;
    rating: number;
    comment?: string | undefined;
}, {
    bookingId: string;
    rating: number;
    comment?: string | undefined;
}>;
/**
 * Schéma de mise à jour du profil utilisateur
 */
export declare const updateUserSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    avatar: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    firstName?: string | undefined;
    lastName?: string | undefined;
    phone?: string | undefined;
    avatar?: string | undefined;
}, {
    firstName?: string | undefined;
    lastName?: string | undefined;
    phone?: string | undefined;
    avatar?: string | undefined;
}>;
/**
 * Schéma de mise à jour du profil prestataire
 */
export declare const updateProviderProfileSchema: z.ZodObject<{
    specialty: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
    hourlyRate: z.ZodOptional<z.ZodNumber>;
    yearsExperience: z.ZodOptional<z.ZodNumber>;
    location: z.ZodOptional<z.ZodString>;
    isAvailable: z.ZodOptional<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    location?: string | undefined;
    specialty?: string | undefined;
    bio?: string | undefined;
    hourlyRate?: number | undefined;
    yearsExperience?: number | undefined;
    isAvailable?: boolean | undefined;
}, {
    location?: string | undefined;
    specialty?: string | undefined;
    bio?: string | undefined;
    hourlyRate?: number | undefined;
    yearsExperience?: number | undefined;
    isAvailable?: boolean | undefined;
}>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateProviderProfileInput = z.infer<typeof updateProviderProfileSchema>;
//# sourceMappingURL=schemas.d.ts.map
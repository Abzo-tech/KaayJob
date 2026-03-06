/**
 * Système de validation centralisé pour l'application KaayJob
 * Utilise les règles de validation pour les formulaires client, prestataire et admin
 */

import { z } from "zod";

// ====================
// VALIDATIONS COMMUNES
// ====================

// Validation de téléphone (format international accepté)
export const phoneSchema = z
  .string()
  .min(8, "Le numéro de téléphone doit contenir au moins 8 chiffres")
  .regex(
    /^(\+221|221)?[67]\d{8}$/,
    "Numéro de téléphone invalide. Format accepté: +221xxxxxxxxx ou 06xxxxxxxx",
  );

// Validation d'email
export const emailSchema = z
  .string()
  .email("Adresse email invalide")
  .min(5, "L'email doit contenir au moins 5 caractères")
  .max(100, "L'email ne peut pas dépasser 100 caractères");

// Validation de mot de passe
export const passwordSchema = z
  .string()
  .min(8, "Le mot de passe doit contenir au moins 8 caractères")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre",
  );

// Validation de nom
export const nameSchema = z
  .string()
  .min(2, "Le nom doit contenir au moins 2 caractères")
  .max(50, "Le nom ne peut pas dépasser 50 caractères")
  .regex(
    /^[a-zA-ZÀ-ÿ\s\-']+$/,
    "Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes",
  );

// Validation d'adresse
export const addressSchema = z
  .string()
  .min(5, "L'adresse doit contenir au moins 5 caractères")
  .max(200, "L'adresse ne peut pas dépasser 200 caractères");

// Validation de ville
export const citySchema = z
  .string()
  .min(2, "La ville doit contenir au moins 2 caractères")
  .max(50, "La ville ne peut pas dépasser 50 caractères");

// Validation de code postal (Sénégal)
export const postalCodeSchema = z
  .string()
  .regex(/^\d{5}$/, "Le code postal doit contenir 5 chiffres");

// Validation d'URL
export const urlSchema = z
  .string()
  .url("URL invalide")
  .optional()
  .or(z.literal(""));

// ====================
// VALIDATIONS CLIENT
// ====================

// Schéma de connexion client
export const clientLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Le mot de passe est requis"),
});

// Schéma d'inscription client
export const clientRegisterSchema = z
  .object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(1, "La confirmation du mot de passe est requise"),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "Vous devez accepter les conditions d'utilisation",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

// Schéma de réservation
export const bookingSchema = z.object({
  serviceType: z.string().min(1, "Le type de service est requis"),
  date: z
    .date()
    .min(new Date(), "La date doit être aujourd'hui ou dans le futur"),
  time: z.string().min(1, "L'heure est requise"),
  duration: z.string().min(1, "La durée est requise"),
  address: addressSchema,
  city: citySchema,
  phone: phoneSchema,
  notes: z
    .string()
    .max(500, "Les notes ne peuvent pas dépasser 500 caractères")
    .optional(),
});

// Schéma de checkout/paiement
export const checkoutSchema = z.object({
  cardNumber: z
    .string()
    .regex(/^\d{16}$/, "Le numéro de carte doit contenir 16 chiffres"),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format attendu: MM/YY"),
  cvv: z.string().regex(/^\d{3,4}$/, "Le CVV doit contenir 3 ou 4 chiffres"),
  cardHolder: nameSchema,
});

// Schéma de contact
export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  subject: z
    .string()
    .min(5, "Le sujet doit contenir au moins 5 caractères")
    .max(100, "Le sujet ne peut pas dépasser 100 caractères"),
  message: z
    .string()
    .min(10, "Le message doit contenir au moins 10 caractères")
    .max(1000, "Le message ne peut pas dépasser 1000 caractères"),
});

// ====================
// VALIDATIONS PRESTATAIRE
// ====================

// Schéma de connexion prestataire
export const prestataireLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Le mot de passe est requis"),
});

// Schéma de profil prestataire
export const prestataireProfileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  specialty: z.string().min(1, "La spécialité est requise"),
  experience: z
    .number()
    .min(0, "L'expérience ne peut pas être négative")
    .max(50, "L'expérience ne peut pas dépasser 50 ans"),
  bio: z
    .string()
    .max(500, "La bio ne peut pas dépasser 500 caractères")
    .optional(),
  address: addressSchema,
  city: citySchema,
  hourlyRate: z
    .number()
    .min(0, "Le tarif horaire ne peut pas être négatif")
    .max(1000, "Le tarif horaire ne peut pas dépasser 1000€"),
});

// Schéma de service prestataire
export const prestataireServiceSchema = z.object({
  name: z
    .string()
    .min(3, "Le nom du service doit contenir au moins 3 caractères")
    .max(100, "Le nom du service ne peut pas dépasser 100 caractères"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères")
    .max(500, "La description ne peut pas dépasser 500 caractères"),
  price: z
    .number()
    .min(0, "Le prix ne peut pas être négatif")
    .max(10000, "Le prix ne peut pas dépasser 10000€"),
  duration: z
    .number()
    .min(15, "La durée minimale est de 15 minutes")
    .max(480, "La durée maximale est de 480 minutes (8 heures)"),
  category: z.string().min(1, "La catégorie est requise"),
});

// ====================
// VALIDATIONS ADMIN
// ====================

// Schéma d'utilisateur admin
export const adminUserSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  role: z.enum(["client", "prestataire", "admin"], {
    message: "Rôle invalide",
  }),
  status: z.enum(["active", "inactive", "suspended"]).optional(),
});

// Schéma de service admin
export const adminServiceSchema = z.object({
  name: z
    .string()
    .min(3, "Le nom du service doit contenir au moins 3 caractères")
    .max(100, "Le nom du service ne peut pas dépasser 100 caractères"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères")
    .max(1000, "La description ne peut pas dépasser 1000 caractères"),
  category: z.string().min(1, "La catégorie est requise"),
  price: z
    .number()
    .min(0, "Le prix ne peut pas être négatif")
    .max(10000, "Le prix ne peut pas dépasser 10000€"),
  isActive: z.boolean().optional(),
});

// Schéma d'abonnement
export const subscriptionSchema = z
  .object({
    plan: z.enum(["basic", "premium", "enterprise"], {
      message: "Plan invalide",
    }),
    startDate: z.date().min(new Date(), "La date de début est requise"),
    endDate: z.date().min(new Date(), "La date de fin est requise"),
    price: z
      .number()
      .min(0, "Le prix ne peut pas être négatif")
      .max(1000, "Le prix ne peut pas dépasser 1000€"),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "La date de fin doit être après la date de début",
    path: ["endDate"],
  });

// ====================
// FONCTIONS UTILITAIRES
// ====================

// Obtenir les erreurs de validation
export function getValidationErrors<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): Record<string, string> {
  const result = schema.safeParse(data);

  if (result.success) {
    return {};
  }

  const errors: Record<string, string> = {};
  result.error.issues.forEach((error) => {
    const path = error.path.join(".");
    if (!errors[path]) {
      errors[path] = error.message;
    }
  });

  return errors;
}

// Valider un champ spécifique
export function validateField<T>(
  schema: z.ZodSchema<T>,
  fieldPath: string,
  value: unknown,
): string | null {
  const result = schema.safeParse(value);

  if (result.success) {
    return null;
  }

  const fieldError = result.error.issues.find(
    (error) => error.path.join(".") === fieldPath,
  );

  return fieldError?.message || null;
}

// Validation en temps réel pour les formulaires
export function validateFormField(
  value: string,
  fieldType: "email" | "phone" | "name" | "address" | "city" | "password",
  fieldName?: string,
): string | null {
  // Ne pas valider si le champ est vide (rendu optionnel)
  if (!value || value.trim() === "") {
    return null;
  }

  let schema: z.ZodString;

  switch (fieldType) {
    case "email":
      schema = emailSchema;
      break;
    case "phone":
      schema = phoneSchema;
      break;
    case "name":
      schema = nameSchema;
      break;
    case "address":
      schema = addressSchema;
      break;
    case "city":
      schema = citySchema;
      break;
    case "password":
      schema = passwordSchema;
      break;
    default:
      return null;
  }

  const result = schema.safeParse(value);

  if (result.success) {
    return null;
  }

  return result.error.issues[0]?.message || `${fieldName || "Champ"} invalide`;
}

// Formatage de numéro de téléphone
export function formatPhoneNumber(phone: string): string {
  // Enlever tous les caractères non numériques
  const cleaned = phone.replace(/\D/g, "");

  // Ajouter le préfixe +221 si nécessaire
  if (
    cleaned.length === 9 &&
    (cleaned.startsWith("7") || cleaned.startsWith("6"))
  ) {
    return `+221${cleaned}`;
  }

  return phone;
}

// Validation de date pour les réservations
export function isDateAvailable(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date >= today;
}

export function getMinBookingDate(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function getMaxBookingDate(): Date {
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 2); // 2 mois à l'avance
  return maxDate;
}

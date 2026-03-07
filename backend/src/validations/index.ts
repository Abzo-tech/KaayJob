/**
 * Validations centralisées pour KaayJob
 * DRY - Ne pasDupliquer les règles de validation
 */

import { body, param, query } from "express-validator";

/**
 * Valideurs réutilisables
 */

// UUID (compatible avec le schéma PostgreSQL)
export const isUUID = (fieldName: string, required = true) => {
  const validator = param(fieldName)
    .optional()
    .matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
    .withMessage(`${fieldName} doit être un UUID valide`);
  return required
    ? body(fieldName)
        .notEmpty()
        .withMessage(`${fieldName} est requis`)
        .matches(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
        )
        .withMessage(`${fieldName} doit être un UUID valide`)
    : validator;
};

// Email
export const isEmail = (fieldName: string, required = true) => {
  return required
    ? body(fieldName)
        .notEmpty()
        .withMessage(`${fieldName} est requis`)
        .isEmail()
        .withMessage(`${fieldName} invalide`)
    : body(fieldName).optional().isEmail().withMessage(`${fieldName} invalide`);
};

// Téléphone sénégalais
export const isPhoneSN = (fieldName: string, required = true) => {
  const regex = /^(\+221|221)?[67]\d{8}$/;
  return required
    ? body(fieldName)
        .notEmpty()
        .withMessage(`${fieldName} est requis`)
        .matches(regex)
        .withMessage(
          `${fieldName} invalide (format sénégalais: +2217X ou 2217X)`,
        )
    : body(fieldName)
        .optional()
        .matches(regex)
        .withMessage(
          `${fieldName} invalide (format sénégalais: +2217X ou 2217X)`,
        );
};

// Mot de passe sécurisé
export const isPassword = (fieldName: string, required = true) => {
  return required
    ? body(fieldName)
        .notEmpty()
        .withMessage(`${fieldName} est requis`)
        .isLength({ min: 8 })
        .withMessage(`${fieldName}: 8 caractères minimum`)
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage(
          `${fieldName}: au moins 1 majuscule, 1 minuscule et 1 chiffre`,
        )
    : body(fieldName)
        .optional()
        .isLength({ min: 8 })
        .withMessage(`${fieldName}: 8 caractères minimum`);
};

// Nom (prénom, nom)
export const isName = (fieldName: string, required = true) => {
  return required
    ? body(fieldName)
        .notEmpty()
        .withMessage(`${fieldName} est requis`)
        .isLength({ min: 2, max: 100 })
        .withMessage(`${fieldName}: 2-100 caractères`)
        .matches(/^[a-zA-ZÀ-ÿ\s-]+$/)
        .withMessage(`${fieldName} contient des caractères invalides`)
    : body(fieldName)
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage(`${fieldName}: 2-100 caractères`);
};

// Texte court (adresse, ville)
export const isShortText = (
  fieldName: string,
  min = 2,
  max = 255,
  required = true,
) => {
  return required
    ? body(fieldName)
        .notEmpty()
        .withMessage(`${fieldName} est requis`)
        .isLength({ min, max })
        .withMessage(`${fieldName}: ${min}-${max} caractères`)
    : body(fieldName)
        .optional()
        .isLength({ min, max })
        .withMessage(`${fieldName}: ${min}-${max} caractères`);
};

// Description (texte long)
export const isDescription = (
  fieldName: string,
  max = 1000,
  required = false,
) => {
  return required
    ? body(fieldName)
        .notEmpty()
        .withMessage(`${fieldName} est requis`)
        .isLength({ max })
        .withMessage(`${fieldName}: ${max} caractères maximum`)
    : body(fieldName)
        .optional()
        .isLength({ max })
        .withMessage(`${fieldName}: ${max} caractères maximum`);
};

// Prix
export const isPrice = (fieldName: string, required = true) => {
  return required
    ? body(fieldName)
        .notEmpty()
        .withMessage(`${fieldName} est requis`)
        .isFloat({ min: 0 })
        .withMessage(`${fieldName} doit être positif`)
    : body(fieldName)
        .optional()
        .isFloat({ min: 0 })
        .withMessage(`${fieldName} doit être positif`);
};

// Durée (en minutes)
export const isDuration = (fieldName: string, required = false, min = 15) => {
  return required
    ? body(fieldName)
        .notEmpty()
        .withMessage(`${fieldName} est requis`)
        .isInt({ min })
        .withMessage(`${fieldName}: minimum ${min} minutes`)
    : body(fieldName)
        .optional()
        .isInt({ min })
        .withMessage(`${fieldName}: minimum ${min} minutes`);
};

// Entier positif
export const isPositiveInt = (fieldName: string, required = false) => {
  return required
    ? body(fieldName)
        .notEmpty()
        .withMessage(`${fieldName} est requis`)
        .isInt({ min: 1 })
        .withMessage(`${fieldName} doit être un entier positif`)
    : body(fieldName)
        .optional()
        .isInt({ min: 1 })
        .withMessage(`${fieldName} doit être un entier positif`);
};

// Années d'expérience
export const isYearsExperience = (fieldName: string, required = false) => {
  return required
    ? body(fieldName)
        .notEmpty()
        .withMessage(`${fieldName} est requis`)
        .isInt({ min: 0, max: 50 })
        .withMessage(`${fieldName}: 0-50 ans`)
    : body(fieldName)
        .optional()
        .isInt({ min: 0, max: 50 })
        .withMessage(`${fieldName}: 0-50 ans`);
};

// Rayon de service (km)
export const isServiceRadius = (fieldName: string, required = false) => {
  return required
    ? body(fieldName)
        .notEmpty()
        .withMessage(`${fieldName} est requis`)
        .isInt({ min: 1, max: 100 })
        .withMessage(`${fieldName}: 1-100 km`)
    : body(fieldName)
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage(`${fieldName}: 1-100 km`);
};

// Date ISO 8601
export const isDate = (fieldName: string, required = true) => {
  return required
    ? body(fieldName)
        .notEmpty()
        .withMessage(`${fieldName} est requis`)
        .isISO8601()
        .withMessage(`${fieldName} invalide (format ISO 8601: YYYY-MM-DD)`)
    : body(fieldName)
        .optional()
        .isISO8601()
        .withMessage(`${fieldName} invalide (format ISO 8601: YYYY-MM-DD)`);
};

// Heure (HH:mm)
export const isTime = (fieldName: string, required = true) => {
  const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return required
    ? body(fieldName)
        .notEmpty()
        .withMessage(`${fieldName} est requis`)
        .matches(regex)
        .withMessage(`${fieldName} invalide (format HH:mm)`)
    : body(fieldName)
        .optional()
        .matches(regex)
        .withMessage(`${fieldName} invalide (format HH:mm)`);
};

// Note (1-5)
export const isRating = (fieldName: string, required = true) => {
  return required
    ? body(fieldName)
        .notEmpty()
        .withMessage(`${fieldName} est requis`)
        .isInt({ min: 1, max: 5 })
        .withMessage(`${fieldName}: 1-5`)
    : body(fieldName)
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage(`${fieldName}: 1-5`);
};

// Statut de réservation
// Accepte les deux formats: lowercase (bookings route) et uppercase (admin route)
export const isBookingStatus = (fieldName: string, required = true) => {
  const validStatusesLower = [
    "pending",
    "confirmed",
    "in_progress",
    "completed",
    "cancelled",
    "rejected",
  ];
  const validStatusesUpper = [
    "PENDING",
    "CONFIRMED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
    "REJECTED",
  ];
  const allValidStatuses = [...validStatusesLower, ...validStatusesUpper];

  return required
    ? body(fieldName)
        .notEmpty()
        .withMessage(`${fieldName} est requis`)
        .isIn(allValidStatuses)
        .withMessage(`${fieldName} invalide: ${validStatusesLower.join(", ")}`)
    : body(fieldName)
        .optional()
        .isIn(allValidStatuses)
        .withMessage(`${fieldName} invalide: ${validStatusesLower.join(", ")}`);
};

// Type de prix
export const isPriceType = (fieldName: string, required = false) => {
  const validTypes = ["fixed", "hourly", "quote"];
  return required
    ? body(fieldName)
        .notEmpty()
        .withMessage(`${fieldName} est requis`)
        .isIn(validTypes)
        .withMessage(`${fieldName} invalide: ${validTypes.join(", ")}`)
    : body(fieldName)
        .optional()
        .isIn(validTypes)
        .withMessage(`${fieldName} invalide: ${validTypes.join(", ")}`);
};

// Rôle utilisateur
export const isUserRole = (fieldName: string, required = true) => {
  const validRoles = ["client", "prestataire", "admin"];
  return required
    ? body(fieldName)
        .notEmpty()
        .withMessage(`${fieldName} est requis`)
        .isIn(validRoles)
        .withMessage(`${fieldName} invalide: ${validRoles.join(", ")}`)
    : body(fieldName)
        .optional()
        .isIn(validRoles)
        .withMessage(`${fieldName} invalide: ${validRoles.join(", ")}`);
};

// URL (avatar, image)
export const isUrl = (fieldName: string, required = false) => {
  const urlRegex = /^https?:\/\/.+/i;
  return required
    ? body(fieldName)
        .notEmpty()
        .withMessage(`${fieldName} est requis`)
        .isURL()
        .withMessage(`${fieldName} doit être une URL valide`)
    : body(fieldName)
        .optional()
        .matches(urlRegex)
        .withMessage(`${fieldName} doit être une URL valide`);
};

// Tableau
export const isArray = (fieldName: string, required = false) => {
  return required
    ? body(fieldName)
        .notEmpty()
        .withMessage(`${fieldName} est requis`)
        .isArray()
        .withMessage(`${fieldName} doit être un tableau`)
    : body(fieldName)
        .optional()
        .isArray()
        .withMessage(`${fieldName} doit être un tableau`);
};

// Objet
export const isObject = (fieldName: string, required = false) => {
  return required
    ? body(fieldName)
        .notEmpty()
        .withMessage(`${fieldName} est requis`)
        .isObject()
        .withMessage(`${fieldName} doit être un objet`)
    : body(fieldName)
        .optional()
        .isObject()
        .withMessage(`${fieldName} doit être un objet`);
};

// Boolean
export const isBoolean = (fieldName: string, required = false) => {
  return required
    ? body(fieldName)
        .notEmpty()
        .withMessage(`${fieldName} est requis`)
        .isBoolean()
        .withMessage(`${fieldName} doit être un booléen`)
    : body(fieldName)
        .optional()
        .isBoolean()
        .withMessage(`${fieldName} doit être un booléen`);
};

// Pagination
export const paginationRules = () => [
  query("page").optional().isInt({ min: 1 }).withMessage("page doit être >= 1"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit doit être entre 1 et 100"),
];

/**
 * Règles de validation composées pour les endpoints
 */

// Inscription
export const registerValidation = [
  isEmail("email"),
  isPassword("password"),
  isName("firstName"),
  isName("lastName"),
  isPhoneSN("phone"),
  isUserRole("role"),
];

// Connexion
export const loginValidation = [
  isEmail("email", true),
  body("password").notEmpty().withMessage("Mot de passe requis"),
];

// Création de réservation
export const createBookingValidation = [
  isUUID("serviceId", true),
  isDate("date"),
  isTime("time"),
  isShortText("address", 5, 500),
  isShortText("city", 2, 100),
  isPhoneSN("phone", false),
  isDescription("notes", 500, false),
];

// Mise à jour du statut de réservation
export const updateBookingStatusValidation = [isBookingStatus("status")];

// Création de service
export const createServiceValidation = [
  body("name")
    .notEmpty()
    .withMessage("Nom du service requis")
    .isLength({ max: 200 })
    .withMessage("Nom: 200 caractères max"),
  isDescription("description", 1000, false),
  isUUID("categoryId", true),
  isPrice("price"),
  isPriceType("priceType", false),
  isDuration("duration", false, 15),
];

// Mise à jour de service
export const updateServiceValidation = [
  body("name")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Nom: 200 caractères max"),
  isDescription("description", 1000, false),
  isUUID("categoryId", false),
  isPrice("price", false),
  isPriceType("priceType", false),
  isDuration("duration", false, 15),
  isBoolean("isActive", false),
];

// Mise à jour du profil utilisateur
export const updateProfileValidation = [
  isName("firstName", false),
  isName("lastName", false),
  isPhoneSN("phone", false),
  isUrl("avatar", false),
];

// Changement de mot de passe
export const changePasswordValidation = [
  body("currentPassword").notEmpty().withMessage("Mot de passe actuel requis"),
  isPassword("newPassword"),
];

// Création de catégorie (admin)
export const createCategoryValidation = [
  body("name")
    .notEmpty()
    .withMessage("Nom requis")
    .isLength({ min: 2, max: 100 })
    .withMessage("Nom: 2-100 caractères"),
  body("slug")
    .optional()
    .isLength({ min: 2, max: 100 })
    .matches(/^[a-z0-9-]+$/)
    .withMessage("Slug: minuscules, chiffres et tirets uniquement"),
  isDescription("description", 500, false),
  body("icon")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Icône: 50 caractères max"),
  isUUID("parentId", false),
];

// Mise à jour de catégorie (admin)
export const updateCategoryValidation = [
  body("name")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Nom: 2-100 caractères"),
  body("slug")
    .optional()
    .isLength({ min: 2, max: 100 })
    .matches(/^[a-z0-9-]+$/)
    .withMessage("Slug: minuscules, chiffres et tirets uniquement"),
  isDescription("description", 500, false),
  body("icon")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Icône: 50 caractères max"),
  isBoolean("isActive", false),
  isUUID("parentId", false),
];

// Mise à jour du profil prestataire
export const updateProviderProfileValidation = [
  body("businessName")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Nom commercial: 2-100 caractères"),
  isDescription("bio", 1000, false),
  isPhoneSN("phone", false),
  isShortText("address", 5, 255, false),
  isShortText("city", 2, 100, false),
  body("region")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Région: 100 caractères max"),
  body("postalCode")
    .optional()
    .isLength({ max: 20 })
    .withMessage("Code postal: 20 caractères max"),
  isServiceRadius("serviceRadius", false),
  isYearsExperience("experienceYears", false),
  isArray("specialties", false),
  isObject("availability", false),
];

// Création d'avis
export const createReviewValidation = [
  isUUID("bookingId", true),
  isRating("rating"),
  isDescription("comment", 1000, false),
];

// Mise à jour d'avis
export const updateReviewValidation = [
  isRating("rating", false),
  isDescription("comment", 1000, false),
];

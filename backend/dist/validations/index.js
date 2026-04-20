"use strict";
/**
 * Validations centralisées pour KaayJob
 * DRY - Ne pasDupliquer les règles de validation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReviewValidation = exports.createReviewValidation = exports.updateProviderProfileValidation = exports.updateCategoryValidation = exports.createCategoryValidation = exports.changePasswordValidation = exports.updateProfileValidation = exports.updateServiceValidation = exports.createServiceValidation = exports.updateBookingStatusValidation = exports.createBookingValidation = exports.loginValidation = exports.registerValidation = exports.paginationRules = exports.isBoolean = exports.isObject = exports.isArray = exports.isUrl = exports.isUserRole = exports.isPriceType = exports.isBookingStatus = exports.isRating = exports.isTime = exports.isDate = exports.isServiceRadius = exports.isYearsExperience = exports.isPositiveInt = exports.isDuration = exports.isPrice = exports.isDescription = exports.isShortText = exports.isName = exports.isPassword = exports.isPhoneSN = exports.isEmail = exports.isUUID = void 0;
const express_validator_1 = require("express-validator");
/**
 * Valideurs réutilisables
 */
// UUID (compatible avec le schéma PostgreSQL)
const isUUID = (fieldName, required = true) => {
    const validator = (0, express_validator_1.param)(fieldName)
        .optional()
        .matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
        .withMessage(`${fieldName} doit être un UUID valide`);
    return required
        ? (0, express_validator_1.body)(fieldName)
            .notEmpty()
            .withMessage(`${fieldName} est requis`)
            .matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
            .withMessage(`${fieldName} doit être un UUID valide`)
        : validator;
};
exports.isUUID = isUUID;
// Email
const isEmail = (fieldName, required = true) => {
    return required
        ? (0, express_validator_1.body)(fieldName)
            .notEmpty()
            .withMessage(`${fieldName} est requis`)
            .isEmail()
            .withMessage(`${fieldName} invalide`)
        : (0, express_validator_1.body)(fieldName).optional().isEmail().withMessage(`${fieldName} invalide`);
};
exports.isEmail = isEmail;
// Téléphone sénégalais
const isPhoneSN = (fieldName, required = true) => {
    const regex = /^(\+221|221)?[67]\d{8}$/;
    return required
        ? (0, express_validator_1.body)(fieldName)
            .notEmpty()
            .withMessage(`${fieldName} est requis`)
            .matches(regex)
            .withMessage(`${fieldName} invalide (format sénégalais: +2217X ou 2217X)`)
        : (0, express_validator_1.body)(fieldName)
            .optional()
            .matches(regex)
            .withMessage(`${fieldName} invalide (format sénégalais: +2217X ou 2217X)`);
};
exports.isPhoneSN = isPhoneSN;
// Mot de passe sécurisé
const isPassword = (fieldName, required = true) => {
    return required
        ? (0, express_validator_1.body)(fieldName)
            .notEmpty()
            .withMessage(`${fieldName} est requis`)
            .isLength({ min: 8 })
            .withMessage(`${fieldName}: 8 caractères minimum`)
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .withMessage(`${fieldName}: au moins 1 majuscule, 1 minuscule et 1 chiffre`)
        : (0, express_validator_1.body)(fieldName)
            .optional()
            .isLength({ min: 8 })
            .withMessage(`${fieldName}: 8 caractères minimum`);
};
exports.isPassword = isPassword;
// Nom (prénom, nom)
const isName = (fieldName, required = true) => {
    return required
        ? (0, express_validator_1.body)(fieldName)
            .notEmpty()
            .withMessage(`${fieldName} est requis`)
            .isLength({ min: 2, max: 100 })
            .withMessage(`${fieldName}: 2-100 caractères`)
            .matches(/^[a-zA-ZÀ-ÿ\s-]+$/)
            .withMessage(`${fieldName} contient des caractères invalides`)
        : (0, express_validator_1.body)(fieldName)
            .optional()
            .isLength({ min: 2, max: 100 })
            .withMessage(`${fieldName}: 2-100 caractères`);
};
exports.isName = isName;
// Texte court (adresse, ville)
const isShortText = (fieldName, min = 2, max = 255, required = true) => {
    return required
        ? (0, express_validator_1.body)(fieldName)
            .notEmpty()
            .withMessage(`${fieldName} est requis`)
            .isLength({ min, max })
            .withMessage(`${fieldName}: ${min}-${max} caractères`)
        : (0, express_validator_1.body)(fieldName)
            .optional()
            .isLength({ min, max })
            .withMessage(`${fieldName}: ${min}-${max} caractères`);
};
exports.isShortText = isShortText;
// Description (texte long)
const isDescription = (fieldName, max = 1000, required = false) => {
    return required
        ? (0, express_validator_1.body)(fieldName)
            .notEmpty()
            .withMessage(`${fieldName} est requis`)
            .isLength({ max })
            .withMessage(`${fieldName}: ${max} caractères maximum`)
        : (0, express_validator_1.body)(fieldName)
            .optional()
            .isLength({ max })
            .withMessage(`${fieldName}: ${max} caractères maximum`);
};
exports.isDescription = isDescription;
// Prix
const isPrice = (fieldName, required = true) => {
    return required
        ? (0, express_validator_1.body)(fieldName)
            .notEmpty()
            .withMessage(`${fieldName} est requis`)
            .isFloat({ min: 0 })
            .withMessage(`${fieldName} doit être positif`)
        : (0, express_validator_1.body)(fieldName)
            .optional()
            .isFloat({ min: 0 })
            .withMessage(`${fieldName} doit être positif`);
};
exports.isPrice = isPrice;
// Durée (en minutes)
const isDuration = (fieldName, required = false, min = 15) => {
    return required
        ? (0, express_validator_1.body)(fieldName)
            .notEmpty()
            .withMessage(`${fieldName} est requis`)
            .isInt({ min })
            .withMessage(`${fieldName}: minimum ${min} minutes`)
        : (0, express_validator_1.body)(fieldName)
            .optional()
            .isInt({ min })
            .withMessage(`${fieldName}: minimum ${min} minutes`);
};
exports.isDuration = isDuration;
// Entier positif
const isPositiveInt = (fieldName, required = false) => {
    return required
        ? (0, express_validator_1.body)(fieldName)
            .notEmpty()
            .withMessage(`${fieldName} est requis`)
            .isInt({ min: 1 })
            .withMessage(`${fieldName} doit être un entier positif`)
        : (0, express_validator_1.body)(fieldName)
            .optional()
            .isInt({ min: 1 })
            .withMessage(`${fieldName} doit être un entier positif`);
};
exports.isPositiveInt = isPositiveInt;
// Années d'expérience
const isYearsExperience = (fieldName, required = false) => {
    return required
        ? (0, express_validator_1.body)(fieldName)
            .notEmpty()
            .withMessage(`${fieldName} est requis`)
            .isInt({ min: 0, max: 50 })
            .withMessage(`${fieldName}: 0-50 ans`)
        : (0, express_validator_1.body)(fieldName)
            .optional()
            .isInt({ min: 0, max: 50 })
            .withMessage(`${fieldName}: 0-50 ans`);
};
exports.isYearsExperience = isYearsExperience;
// Rayon de service (km)
const isServiceRadius = (fieldName, required = false) => {
    return required
        ? (0, express_validator_1.body)(fieldName)
            .notEmpty()
            .withMessage(`${fieldName} est requis`)
            .isInt({ min: 1, max: 100 })
            .withMessage(`${fieldName}: 1-100 km`)
        : (0, express_validator_1.body)(fieldName)
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage(`${fieldName}: 1-100 km`);
};
exports.isServiceRadius = isServiceRadius;
// Date ISO 8601
const isDate = (fieldName, required = true) => {
    return required
        ? (0, express_validator_1.body)(fieldName)
            .notEmpty()
            .withMessage(`${fieldName} est requis`)
            .isISO8601()
            .withMessage(`${fieldName} invalide (format ISO 8601: YYYY-MM-DD)`)
        : (0, express_validator_1.body)(fieldName)
            .optional()
            .isISO8601()
            .withMessage(`${fieldName} invalide (format ISO 8601: YYYY-MM-DD)`);
};
exports.isDate = isDate;
// Heure (HH:mm)
const isTime = (fieldName, required = true) => {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return required
        ? (0, express_validator_1.body)(fieldName)
            .notEmpty()
            .withMessage(`${fieldName} est requis`)
            .matches(regex)
            .withMessage(`${fieldName} invalide (format HH:mm)`)
        : (0, express_validator_1.body)(fieldName)
            .optional()
            .matches(regex)
            .withMessage(`${fieldName} invalide (format HH:mm)`);
};
exports.isTime = isTime;
// Note (1-5)
const isRating = (fieldName, required = true) => {
    return required
        ? (0, express_validator_1.body)(fieldName)
            .notEmpty()
            .withMessage(`${fieldName} est requis`)
            .isInt({ min: 1, max: 5 })
            .withMessage(`${fieldName}: 1-5`)
        : (0, express_validator_1.body)(fieldName)
            .optional()
            .isInt({ min: 1, max: 5 })
            .withMessage(`${fieldName}: 1-5`);
};
exports.isRating = isRating;
// Statut de réservation
// Accepte les deux formats: lowercase (bookings route) et uppercase (admin route)
const isBookingStatus = (fieldName, required = true) => {
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
        ? (0, express_validator_1.body)(fieldName)
            .notEmpty()
            .withMessage(`${fieldName} est requis`)
            .isIn(allValidStatuses)
            .withMessage(`${fieldName} invalide: ${validStatusesLower.join(", ")}`)
        : (0, express_validator_1.body)(fieldName)
            .optional()
            .isIn(allValidStatuses)
            .withMessage(`${fieldName} invalide: ${validStatusesLower.join(", ")}`);
};
exports.isBookingStatus = isBookingStatus;
// Type de prix
const isPriceType = (fieldName, required = false) => {
    const validTypes = ["fixed", "hourly", "quote"];
    const validTypesUpper = validTypes.map((type) => type.toUpperCase());
    const allValidTypes = [...validTypes, ...validTypesUpper];
    const validator = (0, express_validator_1.body)(fieldName)
        .optional()
        .customSanitizer((value) => typeof value === "string" ? value.toLowerCase() : value)
        .isIn(allValidTypes)
        .withMessage(`${fieldName} invalide: ${validTypes.join(", ")}`);
    return required
        ? validator.notEmpty().withMessage(`${fieldName} est requis`)
        : validator;
};
exports.isPriceType = isPriceType;
// Rôle utilisateur
const isUserRole = (fieldName, required = true) => {
    const validRoles = ["client", "prestataire", "admin"];
    return required
        ? (0, express_validator_1.body)(fieldName)
            .notEmpty()
            .withMessage(`${fieldName} est requis`)
            .isIn(validRoles)
            .withMessage(`${fieldName} invalide: ${validRoles.join(", ")}`)
        : (0, express_validator_1.body)(fieldName)
            .optional()
            .isIn(validRoles)
            .withMessage(`${fieldName} invalide: ${validRoles.join(", ")}`);
};
exports.isUserRole = isUserRole;
// URL (avatar, image)
const isUrl = (fieldName, required = false) => {
    const urlRegex = /^https?:\/\/.+/i;
    return required
        ? (0, express_validator_1.body)(fieldName)
            .notEmpty()
            .withMessage(`${fieldName} est requis`)
            .isURL()
            .withMessage(`${fieldName} doit être une URL valide`)
        : (0, express_validator_1.body)(fieldName)
            .optional()
            .matches(urlRegex)
            .withMessage(`${fieldName} doit être une URL valide`);
};
exports.isUrl = isUrl;
// Tableau
const isArray = (fieldName, required = false) => {
    return required
        ? (0, express_validator_1.body)(fieldName)
            .notEmpty()
            .withMessage(`${fieldName} est requis`)
            .isArray()
            .withMessage(`${fieldName} doit être un tableau`)
        : (0, express_validator_1.body)(fieldName)
            .optional()
            .isArray()
            .withMessage(`${fieldName} doit être un tableau`);
};
exports.isArray = isArray;
// Objet
const isObject = (fieldName, required = false) => {
    return required
        ? (0, express_validator_1.body)(fieldName)
            .notEmpty()
            .withMessage(`${fieldName} est requis`)
            .isObject()
            .withMessage(`${fieldName} doit être un objet`)
        : (0, express_validator_1.body)(fieldName)
            .optional()
            .isObject()
            .withMessage(`${fieldName} doit être un objet`);
};
exports.isObject = isObject;
// Boolean
const isBoolean = (fieldName, required = false) => {
    return required
        ? (0, express_validator_1.body)(fieldName)
            .notEmpty()
            .withMessage(`${fieldName} est requis`)
            .isBoolean()
            .withMessage(`${fieldName} doit être un booléen`)
        : (0, express_validator_1.body)(fieldName)
            .optional()
            .isBoolean()
            .withMessage(`${fieldName} doit être un booléen`);
};
exports.isBoolean = isBoolean;
// Pagination
const paginationRules = () => [
    (0, express_validator_1.query)("page").optional().isInt({ min: 1 }).withMessage("page doit être >= 1"),
    (0, express_validator_1.query)("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("limit doit être entre 1 et 100"),
];
exports.paginationRules = paginationRules;
/**
 * Règles de validation composées pour les endpoints
 */
// Inscription
exports.registerValidation = [
    (0, exports.isEmail)("email"),
    (0, exports.isPassword)("password"),
    (0, exports.isName)("firstName"),
    (0, exports.isName)("lastName"),
    (0, exports.isPhoneSN)("phone"),
    (0, exports.isUserRole)("role"),
];
// Connexion
exports.loginValidation = [
    (0, exports.isEmail)("email", true),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Mot de passe requis"),
];
// Création de réservation
exports.createBookingValidation = [
    (0, exports.isUUID)("serviceId", true),
    (0, exports.isDate)("date"),
    (0, exports.isTime)("time"),
    (0, exports.isShortText)("address", 5, 500),
    (0, exports.isShortText)("city", 2, 100),
    (0, exports.isPhoneSN)("phone", false),
    (0, exports.isDescription)("notes", 500, false),
];
// Mise à jour du statut de réservation
exports.updateBookingStatusValidation = [(0, exports.isBookingStatus)("status")];
// Création de service
exports.createServiceValidation = [
    (0, express_validator_1.body)("name")
        .notEmpty()
        .withMessage("Nom du service requis")
        .isLength({ max: 200 })
        .withMessage("Nom: 200 caractères max"),
    (0, exports.isDescription)("description", 1000, false),
    (0, exports.isUUID)("categoryId", false), // Rendre optionnel
    (0, exports.isPrice)("price"),
    (0, exports.isPriceType)("priceType", false),
    (0, exports.isDuration)("duration", false, 15),
];
// Mise à jour de service
exports.updateServiceValidation = [
    (0, express_validator_1.body)("name")
        .optional()
        .isLength({ max: 200 })
        .withMessage("Nom: 200 caractères max"),
    (0, exports.isDescription)("description", 1000, false),
    (0, exports.isUUID)("categoryId", false),
    (0, exports.isPrice)("price", false),
    (0, exports.isPriceType)("priceType", false),
    (0, exports.isDuration)("duration", false, 15),
    (0, exports.isBoolean)("isActive", false),
];
// Mise à jour du profil utilisateur
exports.updateProfileValidation = [
    (0, exports.isName)("firstName", false),
    (0, exports.isName)("lastName", false),
    (0, exports.isPhoneSN)("phone", false),
    (0, exports.isUrl)("avatar", false),
];
// Changement de mot de passe
exports.changePasswordValidation = [
    (0, express_validator_1.body)("currentPassword").notEmpty().withMessage("Mot de passe actuel requis"),
    (0, exports.isPassword)("newPassword"),
];
// Création de catégorie (admin)
exports.createCategoryValidation = [
    (0, express_validator_1.body)("name")
        .notEmpty()
        .withMessage("Nom requis")
        .isLength({ min: 2, max: 100 })
        .withMessage("Nom: 2-100 caractères"),
    (0, express_validator_1.body)("slug")
        .optional()
        .isLength({ min: 2, max: 100 })
        .matches(/^[a-z0-9-]+$/)
        .withMessage("Slug: minuscules, chiffres et tirets uniquement"),
    (0, exports.isDescription)("description", 500, false),
    (0, express_validator_1.body)("icon")
        .optional()
        .isLength({ max: 50 })
        .withMessage("Icône: 50 caractères max"),
    (0, exports.isUUID)("parentId", false),
];
// Mise à jour de catégorie (admin)
exports.updateCategoryValidation = [
    (0, express_validator_1.body)("name")
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage("Nom: 2-100 caractères"),
    (0, express_validator_1.body)("slug")
        .optional()
        .isLength({ min: 2, max: 100 })
        .matches(/^[a-z0-9-]+$/)
        .withMessage("Slug: minuscules, chiffres et tirets uniquement"),
    (0, exports.isDescription)("description", 500, false),
    (0, express_validator_1.body)("icon")
        .optional()
        .isLength({ max: 50 })
        .withMessage("Icône: 50 caractères max"),
    (0, exports.isBoolean)("isActive", false),
    (0, exports.isUUID)("parentId", false),
];
// Mise à jour du profil prestataire
exports.updateProviderProfileValidation = [
    (0, express_validator_1.body)("businessName")
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage("Nom commercial: 2-100 caractères"),
    (0, exports.isDescription)("bio", 1000, false),
    (0, exports.isPhoneSN)("phone", false),
    (0, exports.isShortText)("address", 5, 255, false),
    (0, exports.isShortText)("city", 2, 100, false),
    (0, express_validator_1.body)("region")
        .optional()
        .isLength({ max: 100 })
        .withMessage("Région: 100 caractères max"),
    (0, express_validator_1.body)("postalCode")
        .optional()
        .isLength({ max: 20 })
        .withMessage("Code postal: 20 caractères max"),
    (0, exports.isServiceRadius)("serviceRadius", false),
    (0, exports.isYearsExperience)("experienceYears", false),
    (0, exports.isArray)("specialties", false),
    (0, exports.isObject)("availability", false),
    (0, express_validator_1.body)("isAvailable")
        .optional()
        .isBoolean()
        .withMessage("isAvailable doit être un boolean"),
];
// Création d'avis
exports.createReviewValidation = [
    (0, exports.isUUID)("bookingId", true),
    (0, exports.isRating)("rating"),
    (0, exports.isDescription)("comment", 1000, false),
];
// Mise à jour d'avis
exports.updateReviewValidation = [
    (0, exports.isRating)("rating", false),
    (0, exports.isDescription)("comment", 1000, false),
];
//# sourceMappingURL=index.js.map
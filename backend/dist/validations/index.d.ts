/**
 * Validations centralisées pour KaayJob
 * DRY - Ne pasDupliquer les règles de validation
 */
/**
 * Valideurs réutilisables
 */
export declare const isUUID: (fieldName: string, required?: boolean) => import("express-validator").ValidationChain;
export declare const isEmail: (fieldName: string, required?: boolean) => import("express-validator").ValidationChain;
export declare const isPhoneSN: (fieldName: string, required?: boolean) => import("express-validator").ValidationChain;
export declare const isPassword: (fieldName: string, required?: boolean) => import("express-validator").ValidationChain;
export declare const isName: (fieldName: string, required?: boolean) => import("express-validator").ValidationChain;
export declare const isShortText: (fieldName: string, min?: number, max?: number, required?: boolean) => import("express-validator").ValidationChain;
export declare const isDescription: (fieldName: string, max?: number, required?: boolean) => import("express-validator").ValidationChain;
export declare const isPrice: (fieldName: string, required?: boolean) => import("express-validator").ValidationChain;
export declare const isDuration: (fieldName: string, required?: boolean, min?: number) => import("express-validator").ValidationChain;
export declare const isPositiveInt: (fieldName: string, required?: boolean) => import("express-validator").ValidationChain;
export declare const isYearsExperience: (fieldName: string, required?: boolean) => import("express-validator").ValidationChain;
export declare const isServiceRadius: (fieldName: string, required?: boolean) => import("express-validator").ValidationChain;
export declare const isDate: (fieldName: string, required?: boolean) => import("express-validator").ValidationChain;
export declare const isTime: (fieldName: string, required?: boolean) => import("express-validator").ValidationChain;
export declare const isRating: (fieldName: string, required?: boolean) => import("express-validator").ValidationChain;
export declare const isBookingStatus: (fieldName: string, required?: boolean) => import("express-validator").ValidationChain;
export declare const isPriceType: (fieldName: string, required?: boolean) => import("express-validator").ValidationChain;
export declare const isUserRole: (fieldName: string, required?: boolean) => import("express-validator").ValidationChain;
export declare const isUrl: (fieldName: string, required?: boolean) => import("express-validator").ValidationChain;
export declare const isArray: (fieldName: string, required?: boolean) => import("express-validator").ValidationChain;
export declare const isObject: (fieldName: string, required?: boolean) => import("express-validator").ValidationChain;
export declare const isBoolean: (fieldName: string, required?: boolean) => import("express-validator").ValidationChain;
export declare const paginationRules: () => import("express-validator").ValidationChain[];
/**
 * Règles de validation composées pour les endpoints
 */
export declare const registerValidation: import("express-validator").ValidationChain[];
export declare const loginValidation: import("express-validator").ValidationChain[];
export declare const createBookingValidation: import("express-validator").ValidationChain[];
export declare const updateBookingStatusValidation: import("express-validator").ValidationChain[];
export declare const createServiceValidation: import("express-validator").ValidationChain[];
export declare const updateServiceValidation: import("express-validator").ValidationChain[];
export declare const updateProfileValidation: import("express-validator").ValidationChain[];
export declare const changePasswordValidation: import("express-validator").ValidationChain[];
export declare const createCategoryValidation: import("express-validator").ValidationChain[];
export declare const updateCategoryValidation: import("express-validator").ValidationChain[];
export declare const updateProviderProfileValidation: import("express-validator").ValidationChain[];
export declare const createReviewValidation: import("express-validator").ValidationChain[];
export declare const updateReviewValidation: import("express-validator").ValidationChain[];
//# sourceMappingURL=index.d.ts.map
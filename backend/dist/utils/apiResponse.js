"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginatedResponse = exports.notFoundResponse = exports.forbiddenResponse = exports.unauthorizedResponse = exports.badRequestResponse = exports.errorResponse = exports.createdResponse = exports.successResponse = void 0;
/**
 * Réponse de succès
 */
const successResponse = (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};
exports.successResponse = successResponse;
/**
 * Réponse de création (201 Created)
 */
const createdResponse = (res, data, message = 'Resource created successfully') => {
    return res.status(201).json({
        success: true,
        message,
        data,
    });
};
exports.createdResponse = createdResponse;
/**
 * Réponse d'erreur
 */
const errorResponse = (res, message = 'An error occurred', statusCode = 500, errors) => {
    return res.status(statusCode).json({
        success: false,
        message,
        errors,
    });
};
exports.errorResponse = errorResponse;
/**
 * Réponse 400 - Bad Request
 */
const badRequestResponse = (res, message = 'Bad request', errors) => {
    return (0, exports.errorResponse)(res, message, 400, errors);
};
exports.badRequestResponse = badRequestResponse;
/**
 * Réponse 401 - Unauthorized
 */
const unauthorizedResponse = (res, message = 'Unauthorized') => {
    return (0, exports.errorResponse)(res, message, 401);
};
exports.unauthorizedResponse = unauthorizedResponse;
/**
 * Réponse 403 - Forbidden
 */
const forbiddenResponse = (res, message = 'Forbidden') => {
    return (0, exports.errorResponse)(res, message, 403);
};
exports.forbiddenResponse = forbiddenResponse;
/**
 * Réponse 404 - Not Found
 */
const notFoundResponse = (res, message = 'Resource not found') => {
    return (0, exports.errorResponse)(res, message, 404);
};
exports.notFoundResponse = notFoundResponse;
/**
 * Réponse avec pagination
 */
const paginatedResponse = (res, data, page, limit, total, message = 'Success') => {
    const totalPages = Math.ceil(total / limit);
    return res.status(200).json({
        success: true,
        message,
        data,
        meta: {
            page,
            limit,
            total,
            totalPages,
        },
    });
};
exports.paginatedResponse = paginatedResponse;
//# sourceMappingURL=apiResponse.js.map
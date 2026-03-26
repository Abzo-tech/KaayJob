import { Response } from 'express';

/**
 * Types pour les réponses API standardisées
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/**
 * Réponse de succès
 */
export const successResponse = <T>(
  res: Response,
  data?: T,
  message = 'Success',
  statusCode = 200
): Response<ApiResponse<T>> => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Réponse de création (201 Created)
 */
export const createdResponse = <T>(
  res: Response,
  data: T,
  message = 'Resource created successfully'
): Response<ApiResponse<T>> => {
  return res.status(201).json({
    success: true,
    message,
    data,
  });
};

/**
 * Réponse d'erreur
 */
export const errorResponse = (
  res: Response,
  message = 'An error occurred',
  statusCode = 500,
  errors?: Array<{ field: string; message: string }>
): Response<ApiResponse> => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

/**
 * Réponse 400 - Bad Request
 */
export const badRequestResponse = (
  res: Response,
  message = 'Bad request',
  errors?: Array<{ field: string; message: string }>
): Response<ApiResponse> => {
  return errorResponse(res, message, 400, errors);
};

/**
 * Réponse 401 - Unauthorized
 */
export const unauthorizedResponse = (
  res: Response,
  message = 'Unauthorized'
): Response<ApiResponse> => {
  return errorResponse(res, message, 401);
};

/**
 * Réponse 403 - Forbidden
 */
export const forbiddenResponse = (
  res: Response,
  message = 'Forbidden'
): Response<ApiResponse> => {
  return errorResponse(res, message, 403);
};

/**
 * Réponse 404 - Not Found
 */
export const notFoundResponse = (
  res: Response,
  message = 'Resource not found'
): Response<ApiResponse> => {
  return errorResponse(res, message, 404);
};

/**
 * Réponse avec pagination
 */
export const paginatedResponse = <T>(
  res: Response,
  data: T,
  page: number,
  limit: number,
  total: number,
  message = 'Success'
): Response<ApiResponse<T>> => {
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

import { Response } from 'express';
/**
 * Types pour les réponses API standardisées
 */
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    errors?: Array<{
        field: string;
        message: string;
    }>;
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
export declare const successResponse: <T>(res: Response, data?: T, message?: string, statusCode?: number) => Response<ApiResponse<T>>;
/**
 * Réponse de création (201 Created)
 */
export declare const createdResponse: <T>(res: Response, data: T, message?: string) => Response<ApiResponse<T>>;
/**
 * Réponse d'erreur
 */
export declare const errorResponse: (res: Response, message?: string, statusCode?: number, errors?: Array<{
    field: string;
    message: string;
}>) => Response<ApiResponse>;
/**
 * Réponse 400 - Bad Request
 */
export declare const badRequestResponse: (res: Response, message?: string, errors?: Array<{
    field: string;
    message: string;
}>) => Response<ApiResponse>;
/**
 * Réponse 401 - Unauthorized
 */
export declare const unauthorizedResponse: (res: Response, message?: string) => Response<ApiResponse>;
/**
 * Réponse 403 - Forbidden
 */
export declare const forbiddenResponse: (res: Response, message?: string) => Response<ApiResponse>;
/**
 * Réponse 404 - Not Found
 */
export declare const notFoundResponse: (res: Response, message?: string) => Response<ApiResponse>;
/**
 * Réponse avec pagination
 */
export declare const paginatedResponse: <T>(res: Response, data: T, page: number, limit: number, total: number, message?: string) => Response<ApiResponse<T>>;
//# sourceMappingURL=apiResponse.d.ts.map
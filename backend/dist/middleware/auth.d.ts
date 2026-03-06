/**
 * Middleware d'authentification JWT
 */
import { Request, Response, NextFunction } from "express";
export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const requireAdmin: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const requireProvider: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
declare const _default: {
    authenticate: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    requireAdmin: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    requireProvider: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
};
export default _default;
//# sourceMappingURL=auth.d.ts.map
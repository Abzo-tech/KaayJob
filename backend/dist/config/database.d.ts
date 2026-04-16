/**
 * Configuration de la base de données PostgreSQL
 */
import { Pool } from "pg";
export declare const pool: Pool;
export declare function testConnection(): Promise<boolean>;
export declare const query: (text: string, params?: any[]) => Promise<any>;
declare const _default: {
    pool: Pool;
    testConnection: typeof testConnection;
    query: (text: string, params?: any[]) => Promise<any>;
};
export default _default;
//# sourceMappingURL=database.d.ts.map
"use strict";
/**
 * Middleware de validation centralisé
 * Applique les principes SOLID - Middleware de validation réutilisable
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParams = exports.validateQuery = exports.validateBody = exports.validate = void 0;
const zod_1 = require("zod");
/**
 * Middleware de validation générique
 * @param schema - Schéma Zod à appliquer
 * @param source - Source des données à valider ('body' | 'query' | 'params')
 */
const validate = (schema, source = "body") => {
    return (req, res, next) => {
        try {
            // Valider la source spécifiée
            const dataToValidate = req[source];
            // Parser et valider les données
            const validatedData = schema.parse(dataToValidate);
            // Stocker les données validées dans la requête
            if (source === "body") {
                req.validatedBody = validatedData;
            }
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                // Transformer les erreurs Zod en format standardisé
                const validationErrors = error.errors.map((err) => ({
                    field: err.path.join("."),
                    message: err.message,
                }));
                const response = {
                    success: false,
                    message: "Erreur de validation",
                    errors: validationErrors,
                };
                res.status(400).json(response);
                return;
            }
            // Erreur inattendue
            const response = {
                success: false,
                message: "Erreur interne du serveur",
            };
            res.status(500).json(response);
        }
    };
};
exports.validate = validate;
/**
 * Middleware de validation spécifique pour le corps de la requête
 * Raccourci pour validate avec source='body'
 */
const validateBody = (schema) => (0, exports.validate)(schema, "body");
exports.validateBody = validateBody;
/**
 * Middleware de validation spécifique pour les paramètres de requête
 * Raccourci pour validate avec source='query'
 */
const validateQuery = (schema) => (0, exports.validate)(schema, "query");
exports.validateQuery = validateQuery;
/**
 * Middleware de validation spécifique pour les paramètres d'URL
 * Raccourci pour validate avec source='params'
 */
const validateParams = (schema) => (0, exports.validate)(schema, "params");
exports.validateParams = validateParams;
//# sourceMappingURL=validate.js.map
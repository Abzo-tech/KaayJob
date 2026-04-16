"use strict";
/**
 * Configuration Swagger/OpenAPI pour la documentation de l'API KaayJob
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.specs = exports.swaggerUi = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
exports.swaggerUi = swagger_ui_express_1.default;
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'KaayJob API',
            version: '1.0.0',
            description: 'API RESTful pour la plateforme KaayJob - Connexion clients et prestataires de services',
            contact: {
                name: 'KaayJob Support',
                email: 'support@kaayjob.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3001/api',
                description: 'Serveur de développement'
            },
            {
                url: 'https://kaayjob.onrender.com/api',
                description: 'Serveur de production'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        phone: { type: 'string' },
                        role: { type: 'string', enum: ['CLIENT', 'PRESTATAIRE', 'ADMIN'] },
                        isVerified: { type: 'boolean' },
                        avatar: { type: 'string' }
                    }
                },
                Category: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        slug: { type: 'string' },
                        description: { type: 'string' },
                        icon: { type: 'string' },
                        image: { type: 'string' },
                        isActive: { type: 'boolean' },
                        links: {
                            type: 'object',
                            properties: {
                                self: { type: 'string' },
                                services: { type: 'string' }
                            }
                        }
                    }
                },
                Provider: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        specialty: { type: 'string' },
                        bio: { type: 'string' },
                        hourlyRate: { type: 'number' },
                        location: { type: 'string' },
                        rating: { type: 'number' },
                        totalReviews: { type: 'number' },
                        user: { $ref: '#/components/schemas/User' },
                        links: {
                            type: 'object',
                            properties: {
                                self: { type: 'string' },
                                services: { type: 'string' }
                            }
                        }
                    }
                },
                Service: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        description: { type: 'string' },
                        price: { type: 'number' },
                        priceType: { type: 'string', enum: ['FIXED', 'HOURLY', 'QUOTE'] },
                        duration: { type: 'number' },
                        isActive: { type: 'boolean' }
                    }
                },
                Booking: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        providerId: { type: 'string' },
                        serviceId: { type: 'string' },
                        date: { type: 'string', format: 'date' },
                        time: { type: 'string' },
                        duration: { type: 'number' },
                        address: { type: 'string' },
                        city: { type: 'string' },
                        phone: { type: 'string' },
                        notes: { type: 'string' },
                        status: { type: 'string', enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] }
                    }
                },
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string', minLength: 6 }
                    }
                },
                RegisterRequest: {
                    type: 'object',
                    required: ['email', 'password', 'firstName', 'lastName', 'role'],
                    properties: {
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string', minLength: 6 },
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        phone: { type: 'string' },
                        role: { type: 'string', enum: ['CLIENT', 'PRESTATAIRE'] }
                    }
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' },
                        data: {
                            type: 'object',
                            properties: {
                                user: { $ref: '#/components/schemas/User' },
                                token: { type: 'string' }
                            }
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string' }
                    }
                },
                Success: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string' },
                        data: { type: 'object' },
                        links: { type: 'object' }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ],
        paths: {
            '/auth/login': {
                post: {
                    summary: 'Connexion utilisateur',
                    tags: ['Authentification'],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/LoginRequest' }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Connexion réussie',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/AuthResponse' }
                                }
                            }
                        },
                        401: {
                            description: 'Identifiants invalides',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                }
            },
            '/auth/register': {
                post: {
                    summary: 'Inscription utilisateur',
                    tags: ['Authentification'],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/RegisterRequest' }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description: 'Inscription réussie',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/AuthResponse' }
                                }
                            }
                        },
                        400: {
                            description: 'Données invalides',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                }
            },
            '/categories': {
                get: {
                    summary: 'Liste des catégories',
                    tags: ['Catégories'],
                    responses: {
                        200: {
                            description: 'Liste des catégories',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean' },
                                            data: {
                                                type: 'array',
                                                items: { $ref: '#/components/schemas/Category' }
                                            },
                                            links: {
                                                type: 'object',
                                                properties: {
                                                    self: { type: 'string' }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/providers': {
                get: {
                    summary: 'Liste des prestataires',
                    tags: ['Prestataires'],
                    parameters: [
                        {
                            name: 'limit',
                            in: 'query',
                            schema: { type: 'integer', default: 12 },
                            description: 'Nombre de résultats'
                        },
                        {
                            name: 'category',
                            in: 'query',
                            schema: { type: 'string' },
                            description: 'Filtrer par catégorie'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Liste des prestataires',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean' },
                                            data: {
                                                type: 'array',
                                                items: { $ref: '#/components/schemas/Provider' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/providers/{id}': {
                get: {
                    summary: 'Détails d\'un prestataire',
                    tags: ['Prestataires'],
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'string' }
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Détails du prestataire',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean' },
                                            data: { $ref: '#/components/schemas/Provider' }
                                        }
                                    }
                                }
                            }
                        },
                        404: {
                            description: 'Prestataire non trouvé',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                }
            },
            '/bookings': {
                post: {
                    summary: 'Créer une réservation',
                    tags: ['Réservations'],
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['providerId', 'serviceId', 'date', 'time'],
                                    properties: {
                                        providerId: { type: 'string' },
                                        serviceId: { type: 'string' },
                                        date: { type: 'string', format: 'date' },
                                        time: { type: 'string' },
                                        duration: { type: 'integer' },
                                        address: { type: 'string' },
                                        city: { type: 'string' },
                                        phone: { type: 'string' },
                                        notes: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description: 'Réservation créée',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean' },
                                            message: { type: 'string' },
                                            data: { $ref: '#/components/schemas/Booking' }
                                        }
                                    }
                                }
                            }
                        },
                        401: {
                            description: 'Non authentifié',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                }
            },
            '/health': {
                get: {
                    summary: 'Vérification de santé de l\'API',
                    tags: ['Système'],
                    responses: {
                        200: {
                            description: 'API opérationnelle',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean' },
                                            message: { type: 'string' },
                                            timestamp: { type: 'string' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    apis: [] // Désactivé car tout est défini ici
};
const specs = (0, swagger_jsdoc_1.default)(options);
exports.specs = specs;
//# sourceMappingURL=swagger.js.map
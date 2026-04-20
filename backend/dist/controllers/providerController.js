"use strict";
/**
 * Contrôleur pour les prestataires
 * Mélange de Prisma et SQL (à migrer progressivement vers Prisma)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderController = void 0;
const prisma_1 = require("../config/prisma");
class ProviderController {
    /**
     * Lister tous les prestataires avec filtrage par catégorie - Version PRISMA
     */
    static async getAll(req, res) {
        try {
            const { limit = 50, category } = req.query;
            // Récupérer les prestataires vérifiés avec leurs services si une catégorie est spécifiée
            const providers = await prisma_1.prisma.providerProfile.findMany({
                where: {
                    isVerified: true,
                    user: {
                        role: "PRESTATAIRE",
                        isVerified: true,
                    },
                    specialty: { not: null },
                    bio: { not: null },
                    hourlyRate: { not: null },
                    location: { not: null },
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            avatar: true,
                        },
                    },
                    services: category
                        ? {
                            where: {
                                isActive: true,
                                category: {
                                    slug: category,
                                },
                            },
                        }
                        : false,
                },
                take: Number(limit),
                orderBy: { createdAt: "desc" },
            });
            // Si catégorie filtrée, retourner uniquement les prestataires avec services dans cette catégorie
            let filteredProviders = providers;
            if (category) {
                filteredProviders = providers.filter((p) => p.services && p.services.length > 0);
            }
            const transformedProviders = filteredProviders.map((provider) => ({
                id: provider.id,
                userId: provider.userId,
                specialty: provider.specialty,
                bio: provider.bio,
                hourlyRate: provider.hourlyRate
                    ? parseFloat(provider.hourlyRate.toString())
                    : null,
                yearsExperience: provider.yearsExperience,
                location: provider.location,
                isAvailable: provider.isAvailable,
                rating: parseFloat(provider.rating.toString() || "0"),
                totalReviews: provider.totalReviews || 0,
                totalBookings: provider.totalBookings || 0,
                isVerified: provider.isVerified,
                user: {
                    id: provider.user.id,
                    firstName: provider.user.firstName,
                    lastName: provider.user.lastName,
                    avatar: provider.user.avatar,
                },
            }));
            res.json({
                success: true,
                data: transformedProviders,
            });
        }
        catch (error) {
            console.error("Erreur getAll providers:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
    /**
     * ANCIENNE VERSION SQL - À SUPPRIMER - voir getAll() au-dessus
     */
    static async _getAll_OLD(req, res) {
        res.status(410).json({
            success: false,
            message: "Ancienne méthode obsolète. Utilisez getAll() avec Prisma.",
        });
    }
    /**
     * Obtenir les prestataires pour la carte
     */
    static async getProvidersForMap(req, res) {
        try {
            const providers = await prisma_1.prisma.providerProfile.findMany({
                where: {
                    isVerified: true,
                    latitude: { not: null },
                    longitude: { not: null },
                    specialty: { not: null },
                    bio: { not: null },
                    hourlyRate: { not: null },
                    location: { not: null },
                    user: {
                        role: "PRESTATAIRE",
                        isVerified: true,
                    },
                },
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            });
            const transformedProviders = providers.map((provider) => ({
                id: provider.id,
                userId: provider.userId,
                latitude: provider.latitude,
                longitude: provider.longitude,
                user: {
                    firstName: provider.user?.firstName,
                    lastName: provider.user?.lastName,
                },
            }));
            res.json({
                success: true,
                data: transformedProviders,
            });
        }
        catch (error) {
            console.error("❌ Erreur prestataires carte:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
    /**
     * Obtenir les détails d'un prestataire par ID
     */
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const provider = await prisma_1.prisma.providerProfile.findUnique({
                where: { id },
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            phone: true,
                            avatar: true,
                            role: true,
                            isVerified: true,
                        },
                    },
                    services: {
                        where: { isActive: true },
                        orderBy: { name: "asc" },
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            price: true,
                            priceType: true,
                            duration: true,
                            isActive: true,
                        },
                    },
                },
            });
            if (!provider || provider.user?.role !== "PRESTATAIRE" || !provider.user?.isVerified) {
                res.status(404).json({ success: false, message: "Prestataire non trouvé" });
                return;
            }
            const response = {
                id: provider.id,
                userId: provider.userId,
                specialty: provider.specialty,
                bio: provider.bio,
                hourlyRate: provider.hourlyRate !== null ? parseFloat(provider.hourlyRate.toString()) : null,
                yearsExperience: provider.yearsExperience,
                location: provider.location,
                latitude: provider.latitude,
                longitude: provider.longitude,
                isAvailable: provider.isAvailable,
                rating: parseFloat(provider.rating.toString() || "0"),
                totalReviews: provider.totalReviews,
                totalBookings: provider.totalBookings,
                isVerified: provider.isVerified,
                user: {
                    id: provider.user.id,
                    firstName: provider.user.firstName,
                    lastName: provider.user.lastName,
                    email: provider.user.email,
                    phone: provider.user.phone,
                    avatar: provider.user.avatar,
                },
                services: provider.services.map((service) => ({
                    id: service.id,
                    name: service.name,
                    description: service.description,
                    price: parseFloat(service.price.toString()),
                    priceType: service.priceType,
                    duration: service.duration,
                    isActive: service.isActive,
                })),
            };
            res.json({
                success: true,
                data: response,
            });
        }
        catch (error) {
            console.error("❌ Erreur prestataire par ID:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
    /**
     * Récupérer le profil du prestataire connecté (utilise Prisma)
     */
    static async getProfile(req, res) {
        try {
            const user = req.user;
            if (!user?.id) {
                res
                    .status(401)
                    .json({ success: false, message: "Utilisateur non authentifié" });
                return;
            }
            if (user.role !== "PRESTATAIRE" && user.role !== "prestataire") {
                res
                    .status(403)
                    .json({ success: false, message: "Accès réservé aux prestataires" });
                return;
            }
            const profile = await prisma_1.prisma.providerProfile.findUnique({
                where: { userId: user.id },
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            phone: true,
                            avatar: true,
                        },
                    },
                },
            });
            if (!profile) {
                res
                    .status(404)
                    .json({ success: false, message: "Profil prestataire non trouvé" });
                return;
            }
            res.json({ success: true, data: profile });
        }
        catch (error) {
            console.error("❌ Erreur récupération profil:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
    /**
     * Mettre à jour le profil du prestataire (utilise Prisma)
     */
    static async updateProfile(req, res) {
        try {
            const user = req.user;
            if (!user?.id) {
                res
                    .status(401)
                    .json({ success: false, message: "Utilisateur non authentifié" });
                return;
            }
            if (user.role !== "PRESTATAIRE" && user.role !== "prestataire") {
                res
                    .status(403)
                    .json({ success: false, message: "Accès réservé aux prestataires" });
                return;
            }
            const { businessName, specialty, bio, hourlyRate, yearsExperience, location, address, city, region, postalCode, serviceRadius, isAvailable, profileImage, phone, } = req.body;
            // Mettre à jour les informations utilisateur si fourni
            if (phone) {
                await prisma_1.prisma.user.update({
                    where: { id: user.id },
                    data: { phone },
                });
            }
            // Vérifier si le profil prestataire existe
            const existingProfile = await prisma_1.prisma.providerProfile.findUnique({
                where: { userId: user.id },
            });
            const profileData = {};
            if (businessName !== undefined)
                profileData.businessName = businessName;
            if (specialty !== undefined)
                profileData.specialty = specialty;
            if (bio !== undefined)
                profileData.bio = bio;
            if (hourlyRate !== undefined)
                profileData.hourlyRate = hourlyRate;
            if (yearsExperience !== undefined)
                profileData.yearsExperience = yearsExperience;
            if (location !== undefined)
                profileData.location = location;
            if (address !== undefined)
                profileData.address = address;
            if (city !== undefined)
                profileData.city = city;
            if (region !== undefined)
                profileData.region = region;
            if (postalCode !== undefined)
                profileData.postalCode = postalCode;
            if (serviceRadius !== undefined)
                profileData.serviceRadius = serviceRadius;
            if (profileImage !== undefined)
                profileData.profileImage = profileImage;
            if (isAvailable !== undefined)
                profileData.isAvailable = isAvailable;
            if (!existingProfile) {
                // Créer le profil s'il n'existe pas
                profileData.userId = user.id;
                if (profileData.isAvailable === undefined) {
                    profileData.isAvailable = true;
                }
                await prisma_1.prisma.providerProfile.create({
                    data: profileData,
                });
            }
            else {
                // Mettre à jour le profil existant
                await prisma_1.prisma.providerProfile.update({
                    where: { userId: user.id },
                    data: profileData,
                });
            }
            res.json({ success: true, message: "Profil mis à jour avec succès" });
        }
        catch (error) {
            console.error("❌ Erreur mise à jour profil prestataire:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
    /**
     * Demander la vérification du profil prestataire
     */
    static async requestVerification(req, res) {
        try {
            const user = req.user;
            if (!user?.id) {
                res
                    .status(401)
                    .json({ success: false, message: "Utilisateur non authentifié" });
                return;
            }
            if (user.role !== "PRESTATAIRE" && user.role !== "prestataire") {
                res
                    .status(403)
                    .json({ success: false, message: "Accès réservé aux prestataires" });
                return;
            }
            const { documents } = req.body;
            // Créer une demande de vérification
            const existingRequest = await prisma_1.prisma.verificationRequest.findFirst({
                where: { userId: user.id },
            });
            if (existingRequest) {
                await prisma_1.prisma.verificationRequest.update({
                    where: { id: existingRequest.id },
                    data: {
                        documents: documents || existingRequest.documents,
                        status: "pending",
                        reviewedBy: null,
                        reviewedAt: null,
                    },
                });
            }
            else {
                await prisma_1.prisma.verificationRequest.create({
                    data: {
                        userId: user.id,
                        documents: documents || {},
                        status: "pending",
                    },
                });
            }
            res.json({ success: true, message: "Demande de vérification envoyée" });
        }
        catch (error) {
            console.error("❌ Erreur demande vérification:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
    /**
     * Mettre à jour la localisation du prestataire (utilise Prisma)
     */
    static async updateLocation(req, res) {
        try {
            const user = req.user;
            if (!user?.id) {
                res
                    .status(401)
                    .json({ success: false, message: "Utilisateur non authentifié" });
                return;
            }
            const { latitude, longitude, address, city, region } = req.body;
            if (user.role !== "PRESTATAIRE" && user.role !== "prestataire") {
                res
                    .status(403)
                    .json({ success: false, message: "Accès réservé aux prestataires" });
                return;
            }
            const existingProfile = await prisma_1.prisma.providerProfile.findUnique({
                where: { userId: user.id },
            });
            const locationData = {};
            if (latitude !== undefined)
                locationData.latitude = latitude;
            if (longitude !== undefined)
                locationData.longitude = longitude;
            if (address !== undefined)
                locationData.address = address;
            if (city !== undefined)
                locationData.city = city;
            if (region !== undefined)
                locationData.region = region;
            if (!existingProfile) {
                locationData.userId = user.id;
                await prisma_1.prisma.providerProfile.create({
                    data: locationData,
                });
            }
            else {
                await prisma_1.prisma.providerProfile.update({
                    where: { userId: user.id },
                    data: locationData,
                });
            }
            await prisma_1.prisma.user.update({
                where: { id: user.id },
                data: { latitude, longitude, address },
            });
            res.json({
                success: true,
                message: "Localisation mise à jour avec succès",
            });
        }
        catch (error) {
            console.error("❌ Erreur mise à jour localisation:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
    /**
     * Mettre à jour la disponibilité du prestataire (utilise Prisma)
     */
    static async updateAvailability(req, res) {
        try {
            const user = req.user;
            if (!user?.id) {
                res
                    .status(401)
                    .json({ success: false, message: "Utilisateur non authentifié" });
                return;
            }
            const { isAvailable, availability } = req.body;
            if (user.role !== "PRESTATAIRE" && user.role !== "prestataire") {
                res
                    .status(403)
                    .json({ success: false, message: "Accès réservé aux prestataires" });
                return;
            }
            // Vérifier si le profil prestataire existe
            const existingProfile = await prisma_1.prisma.providerProfile.findUnique({
                where: { userId: user.id },
            });
            if (!existingProfile) {
                // Créer le profil s'il n'existe pas avec des valeurs par défaut
                const availValue = isAvailable !== undefined ? isAvailable : true;
                await prisma_1.prisma.providerProfile.create({
                    data: {
                        userId: user.id,
                        isAvailable: availValue,
                        availability: availability || undefined,
                    },
                });
            }
            else {
                // Mettre à jour le profil existant
                const updateData = {};
                if (isAvailable !== undefined) {
                    updateData.isAvailable = isAvailable;
                }
                if (availability) {
                    updateData.availability = availability;
                }
                await prisma_1.prisma.providerProfile.update({
                    where: { userId: user.id },
                    data: updateData,
                });
            }
            res.json({
                success: true,
                message: "Disponibilité mise à jour avec succès",
            });
        }
        catch (error) {
            console.error("❌ Erreur mise à jour disponibilité:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
    /**
     * Obtenir l'abonnement actif du prestataire
     */
    static async getMySubscription(req, res) {
        try {
            const user = req.user;
            if (!user?.id) {
                res
                    .status(401)
                    .json({ success: false, message: "Utilisateur non authentifié" });
                return;
            }
            // Pour l'instant, retourner un abonnement fictif
            // TODO: Implémenter la vraie logique d'abonnement
            res.json({
                success: true,
                data: {
                    plan: "premium",
                    status: "active",
                    startDate: new Date().toISOString(),
                    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    planName: "Plan Premium",
                    planPrice: 49.99,
                },
            });
        }
        catch (error) {
            console.error("❌ Erreur récupération abonnement:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
    /**
     * Obtenir l'historique des abonnements
     */
    static async getSubscriptionHistory(req, res) {
        try {
            const user = req.user;
            if (!user?.id) {
                res
                    .status(401)
                    .json({ success: false, message: "Utilisateur non authentifié" });
                return;
            }
            // Pour l'instant, retourner un historique fictif
            res.json({
                success: true,
                data: [],
            });
        }
        catch (error) {
            console.error("❌ Erreur récupération historique abonnement:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
    /**
     * S'abonner à un plan
     */
    static async subscribeToPlan(req, res) {
        try {
            const user = req.user;
            const { planId } = req.body;
            if (!user?.id) {
                res
                    .status(401)
                    .json({ success: false, message: "Utilisateur non authentifié" });
                return;
            }
            if (!planId) {
                res.status(400).json({ success: false, message: "planId requis" });
                return;
            }
            // Pour l'instant, simuler un abonnement réussi
            res.json({
                success: true,
                message: "Abonnement créé avec succès",
                data: {
                    planId,
                    status: "active",
                    startDate: new Date().toISOString(),
                },
            });
        }
        catch (error) {
            console.error("❌ Erreur abonnement:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
    /**
     * Annuler l'abonnement
     */
    static async cancelSubscription(req, res) {
        try {
            const user = req.user;
            if (!user?.id) {
                res
                    .status(401)
                    .json({ success: false, message: "Utilisateur non authentifié" });
                return;
            }
            // Pour l'instant, simuler une annulation réussie
            res.json({
                success: true,
                message: "Abonnement annulé avec succès",
            });
        }
        catch (error) {
            console.error("❌ Erreur annulation abonnement:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
    /**
     * Obtenir l'historique des paiements
     */
    static async getPaymentHistory(req, res) {
        try {
            const user = req.user;
            if (!user?.id) {
                res
                    .status(401)
                    .json({ success: false, message: "Utilisateur non authentifié" });
                return;
            }
            // Pour l'instant, retourner un historique fictif
            res.json({
                success: true,
                data: [],
            });
        }
        catch (error) {
            console.error("❌ Erreur récupération historique paiements:", error);
            res.status(500).json({ success: false, message: "Erreur serveur" });
        }
    }
}
exports.ProviderController = ProviderController;
exports.default = ProviderController;
//# sourceMappingURL=providerController.js.map
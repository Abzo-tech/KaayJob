"use strict";
/**
 * Routes d'authentification
 * Utilise le AuthController pour la logique métier
 * Validations centralisées dans src/validations/index.ts
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../config/prisma");
const authController_1 = __importDefault(require("../controllers/authController"));
const auth_1 = require("../middleware/auth");
const validations_1 = require("../validations");
const router = (0, express_1.Router)();
// POST /api/auth/register
router.post("/register", validations_1.registerValidation, async (req, res) => {
    console.log('📨 Route /register atteinte');
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log('❌ Erreurs de validation:', errors.array());
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    console.log('✅ Validation passée, appel contrôleur');
    await authController_1.default.register(req, res);
});
// POST /api/auth/login
router.post("/login", validations_1.loginValidation, async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    await authController_1.default.login(req, res);
});
// GET /api/auth/me
router.get("/me", auth_1.authenticate, async (req, res) => {
    await authController_1.default.getMe(req, res);
});
// PUT /api/auth/password - Changer le mot de passe
router.put("/password", auth_1.authenticate, validations_1.changePasswordValidation, async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    await authController_1.default.changePassword(req, res);
});
// PUT /api/auth/profile - Mettre à jour le profil utilisateur
router.put("/profile", auth_1.authenticate, validations_1.updateProfileValidation, async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    await authController_1.default.updateProfile(req, res);
});
// DELETE /api/auth/account - Supprimer son compte
router.delete("/account", auth_1.authenticate, async (req, res) => {
    try {
        const authReq = req;
        const userId = authReq.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Non autorisé" });
        }
        // Vérifier le rôle - seul les clients peuvent supprimer leur compte via cette route
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: { role: true },
        });
        if (!user) {
            return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
        }
        const userRole = user.role;
        // Si c'est un prestataire, on ne peut pas supprimer le compte via cette route
        // (cela devrait être fait via un autre processus)
        if (userRole === "PRESTATAIRE") {
            return res.status(403).json({
                success: false,
                message: "Veuillez contacter l'administrateur pour supprimer votre compte prestataire",
            });
        }
        // Supprimer les données liées selon le rôle
        await prisma_1.prisma.$transaction(async (tx) => {
            if (userRole === "CLIENT") {
                await tx.review.deleteMany({
                    where: { clientId: userId },
                });
                await tx.booking.deleteMany({
                    where: { clientId: userId },
                });
            }
            await tx.payment.deleteMany({
                where: { userId },
            });
            await tx.notification.deleteMany({
                where: { userId },
            });
            await tx.providerProfile.deleteMany({
                where: { userId },
            });
            await tx.user.delete({
                where: { id: userId },
            });
        });
        res.json({ success: true, message: "Compte supprimé avec succès" });
    }
    catch (error) {
        console.error("Erreur suppression compte:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
// POST /api/auth/logout - Déconnexion (invalide le token côté client)
router.post("/logout", auth_1.authenticate, async (req, res) => {
    // Note: Dans une implémentation plus avancée, on pourrait invalider le token
    // dans une liste de tokens blacklistés. Pour l'instant, le logout est géré
    // côté client en supprimant le token du localStorage.
    res.json({ success: true, message: "Déconnexion réussie" });
});
// DEBUG: Endpoint temporaire pour vérifier/réinitialiser l'admin
// POST /api/auth/debug-admin
router.post("/debug-admin", async (req, res) => {
    try {
        // Vérifier si l'admin existe
        const admin = await prisma_1.prisma.user.findUnique({
            where: { email: 'admin@kaayjob.com' },
            select: { id: true, email: true, password: true, role: true }
        });
        if (!admin) {
            // Créer l'admin
            const hashedPassword = await bcryptjs_1.default.hash('Password123', 10);
            const newAdmin = await prisma_1.prisma.user.create({
                data: {
                    email: 'admin@kaayjob.com',
                    password: hashedPassword,
                    firstName: 'Admin',
                    lastName: 'KaayJob',
                    phone: '+221000000000',
                    role: 'ADMIN',
                    isVerified: true,
                    isActive: true,
                },
                select: { id: true, email: true, role: true }
            });
            return res.json({
                success: true,
                message: 'Admin créé',
                admin: newAdmin,
                action: 'created'
            });
        }
        const isValidPassword = await bcryptjs_1.default.compare('Password123', admin.password);
        if (!isValidPassword) {
            // Réinitialiser le mot de passe
            const hashedPassword = await bcryptjs_1.default.hash('Password123', 10);
            await prisma_1.prisma.user.update({
                where: { email: 'admin@kaayjob.com' },
                data: { password: hashedPassword }
            });
            return res.json({
                success: true,
                message: 'Mot de passe admin réinitialisé',
                admin: { id: admin.id, email: admin.email, role: admin.role },
                action: 'reset'
            });
        }
        return res.json({
            success: true,
            message: 'Admin OK',
            admin: { id: admin.id, email: admin.email, role: admin.role },
            action: 'ok'
        });
    }
    catch (error) {
        console.error('Erreur debug admin:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});
// ROUTE TEMPORAIRE: Créer l'admin (à supprimer après utilisation)
// POST /api/auth/create-admin-temp
router.post("/create-admin-temp", async (req, res) => {
    try {
        console.log('🔧 Création temporaire de l\'admin...');
        const password = await bcryptjs_1.default.hash('Password123', 10);
        const admin = await prisma_1.prisma.user.upsert({
            where: { email: 'admin@kaayjob.com' },
            update: {
                password,
                firstName: 'Admin',
                lastName: 'KaayJob',
                phone: '+221000000000',
                role: 'ADMIN',
                isVerified: true,
                isActive: true,
            },
            create: {
                email: 'admin@kaayjob.com',
                password,
                firstName: 'Admin',
                lastName: 'KaayJob',
                phone: '+221000000000',
                role: 'ADMIN',
                isVerified: true,
                isActive: true,
            },
        });
        console.log('✅ Admin créé temporairement:', admin.email);
        res.json({
            success: true,
            message: 'Admin créé avec succès',
            admin: { email: admin.email, role: admin.role },
            credentials: {
                email: 'admin@kaayjob.com',
                password: 'Password123'
            }
        });
    }
    catch (error) {
        console.error('❌ Erreur création admin:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map
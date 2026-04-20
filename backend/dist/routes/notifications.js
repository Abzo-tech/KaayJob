"use strict";
/**
 * Routes pour les notifications utilisateur - VERSION ULTRA SIMPLE
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const prisma_1 = __importDefault(require("../config/prisma"));
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
// GET /api/notifications - Version avec debug
router.get("/", async (req, res) => {
    let userId;
    try {
        userId = req.user?.id;
        const requestedLimit = Number(req.query.limit);
        const limit = Number.isFinite(requestedLimit) && requestedLimit > 0
            ? Math.min(requestedLimit, 50)
            : 20;
        console.log("=== GET /notifications for user:", userId);
        console.log("Full user object:", JSON.stringify(req.user));
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Utilisateur non authentifié' });
        }
        console.log("Step 1: Before findMany, userId:", userId);
        // Selection explicite pour rester compatible avec les bases
        // qui n'ont pas encore toutes les colonnes optionnelles du modele Prisma.
        const notifications = await prisma_1.default.notification.findMany({
            where: { userId: userId },
            orderBy: { createdAt: "desc" },
            take: limit,
            select: {
                id: true,
                title: true,
                message: true,
                type: true,
                read: true,
                link: true,
                createdAt: true,
            },
        });
        console.log("Step 2: After findMany, count:", notifications.length);
        res.json({
            success: true,
            data: notifications,
            unreadCount: notifications.filter(n => !n.read).length
        });
    }
    catch (error) {
        console.error("❌ ERREUR à l'étape:", userId ? "après findMany" : "avant findMany");
        console.error("❌ Erreur notifications:", error.message);
        console.error("❌ Stack:", error.stack);
        res.status(500).json({ success: false, message: "Erreur: " + error.message });
    }
});
// POST /api/notifications/test
router.post("/test", async (req, res) => {
    try {
        const userId = req.user?.id;
        const { title, message } = req.body;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Non authentifié' });
        }
        const notification = await prisma_1.default.notification.create({
            data: {
                userId: userId,
                title: title || "Test",
                message: message || "Notification de test",
                type: "info"
            }
        });
        res.json({ success: true, message: "Notification créée", data: notification });
    }
    catch (error) {
        console.error("Erreur:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});
// PUT /api/notifications/:id/read
router.put("/:id/read", async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Non authentifié' });
        }
        const notification = await prisma_1.default.notification.findFirst({
            where: { id, userId },
            select: { id: true },
        });
        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification non trouvée" });
        }
        await prisma_1.default.notification.update({
            where: { id },
            data: { read: true }
        });
        res.json({ success: true, message: "Notification marquée comme lue" });
    }
    catch (error) {
        console.error("Erreur:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});
// PUT /api/notifications/read-all
router.put("/read-all", async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Non authentifié' });
        }
        await prisma_1.default.notification.updateMany({
            where: { userId: userId, read: false },
            data: { read: true }
        });
        res.json({ success: true, message: "Toutes les notifications marquées comme lues" });
    }
    catch (error) {
        console.error("Erreur:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});
// DELETE /api/notifications/:id
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Non authentifié' });
        }
        await prisma_1.default.notification.deleteMany({
            where: { id, userId }
        });
        res.json({ success: true, message: "Notification supprimée" });
    }
    catch (error) {
        console.error("Erreur:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});
// DELETE /api/notifications
router.delete("/", async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Non authentifié' });
        }
        await prisma_1.default.notification.deleteMany({
            where: { userId: userId, read: true }
        });
        res.json({ success: true, message: "Notifications lues supprimées" });
    }
    catch (error) {
        console.error("Erreur:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=notifications.js.map
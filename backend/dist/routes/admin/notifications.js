"use strict";
/**
 * Routes d'administration - Notifications
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const prisma_1 = require("../../config/prisma");
const router = (0, express_1.Router)();
// POST /api/admin/notifications - Créer une notification pour un utilisateur
router.post("/", [
    (0, express_validator_1.body)("userId")
        .optional()
        .notEmpty()
        .withMessage("ID utilisateur requis"),
    (0, express_validator_1.body)("userIds")
        .optional()
        .isArray({ min: 1 })
        .withMessage("Liste d'utilisateurs invalide"),
    (0, express_validator_1.body)("title").notEmpty().withMessage("Titre requis"),
    (0, express_validator_1.body)("message").notEmpty().withMessage("Message requis"),
    (0, express_validator_1.body)("type")
        .optional()
        .isIn(["success", "error", "info", "warning"])
        .withMessage("Type invalide"),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).json({ success: false, errors: errors.array() });
        const { userId, userIds, title, message, type, link } = req.body;
        const recipientIds = Array.isArray(userIds)
            ? userIds
            : userId
                ? [userId]
                : [];
        if (recipientIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "userId ou userIds est requis",
            });
        }
        const users = await prisma_1.prisma.user.findMany({
            where: {
                id: {
                    in: recipientIds,
                },
            },
            select: {
                id: true,
            },
        });
        if (users.length !== recipientIds.length) {
            return res
                .status(404)
                .json({ success: false, message: "Un ou plusieurs utilisateurs sont introuvables" });
        }
        await prisma_1.prisma.notification.createMany({
            data: recipientIds.map((recipientId) => ({
                userId: recipientId,
                title,
                message,
                type: type || "info",
                link: link || null,
            })),
        });
        res.status(201).json({
            success: true,
            message: recipientIds.length > 1 ? "Notifications créées" : "Notification créée",
        });
    }
    catch (error) {
        console.error("Erreur création notification:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
exports.default = router;
//# sourceMappingURL=notifications.js.map
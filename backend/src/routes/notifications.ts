/**
 * Routes pour les notifications utilisateur - VERSION ULTRA SIMPLE
 */

import { Router, Response } from "express";
import { authenticate, AuthRequest } from "../middleware/auth";
import prisma from "../config/prisma";

const router = Router();
router.use(authenticate);

// GET /api/notifications - Version avec debug
router.get("/", async (req: AuthRequest, res: Response) => {
  let userId: string | undefined;
  
  try {
    userId = req.user?.id;
    console.log("=== GET /notifications for user:", userId);
    console.log("Full user object:", JSON.stringify(req.user));
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Utilisateur non authentifié' });
    }

    console.log("Step 1: Before findMany, userId:", userId);
    
    // Simplement utiliser findMany sans orderBy complexe
    const notifications = await prisma.notification.findMany({
      where: { userId: userId },
      take: 20
    });

    console.log("Step 2: After findMany, count:", notifications.length);

    res.json({
      success: true,
      data: notifications,
      unreadCount: notifications.filter(n => !n.read).length
    });
  } catch (error: any) {
    console.error("❌ ERREUR à l'étape:", userId ? "après findMany" : "avant findMany");
    console.error("❌ Erreur notifications:", error.message);
    console.error("❌ Stack:", error.stack);
    res.status(500).json({ success: false, message: "Erreur: " + error.message });
  }
});

// POST /api/notifications/test
router.post("/test", async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { title, message } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Non authentifié' });
    }

    const notification = await prisma.notification.create({
      data: {
        userId: userId,
        title: title || "Test",
        message: message || "Notification de test",
        type: "info"
      }
    });

    res.json({ success: true, message: "Notification créée", data: notification });
  } catch (error: any) {
    console.error("Erreur:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/notifications/:id/read
router.put("/:id/read", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Non authentifié' });
    }

    const notification = await prisma.notification.findFirst({
      where: { id, userId }
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification non trouvée" });
    }

    await prisma.notification.update({
      where: { id },
      data: { read: true }
    });

    res.json({ success: true, message: "Notification marquée comme lue" });
  } catch (error: any) {
    console.error("Erreur:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/notifications/read-all
router.put("/read-all", async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Non authentifié' });
    }

    await prisma.notification.updateMany({
      where: { userId: userId, read: false },
      data: { read: true }
    });

    res.json({ success: true, message: "Toutes les notifications marquées comme lues" });
  } catch (error: any) {
    console.error("Erreur:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/notifications/:id
router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Non authentifié' });
    }

    await prisma.notification.deleteMany({
      where: { id, userId }
    });
    
    res.json({ success: true, message: "Notification supprimée" });
  } catch (error: any) {
    console.error("Erreur:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/notifications
router.delete("/", async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Non authentifié' });
    }

    await prisma.notification.deleteMany({
      where: { userId: userId, read: true }
    });
    
    res.json({ success: true, message: "Notifications lues supprimées" });
  } catch (error: any) {
    console.error("Erreur:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
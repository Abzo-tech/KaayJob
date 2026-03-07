import { api } from "./api";

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: "success" | "error" | "info" | "warning" = "info",
  link?: string
) {
  try {
    // Note: This would need a backend endpoint to create notifications for other users
    // For now, we'll just show a toast
    console.log("Notification:", { userId, title, message, type, link });
  } catch (error) {
    console.error("Erreur création notification:", error);
  }
}

// Helper pour déclencher une notification toast et enregistrer une notification backend
export function notifyUser(
  title: string,
  message: string,
  type: "success" | "error" | "info" | "warning" = "info"
) {
  // Les toasts sont déjà gérés par les composants
  // Cette fonction peut être utilisée pour ajouter des notifications persistantes
  console.log("Notify:", { title, message, type });
}

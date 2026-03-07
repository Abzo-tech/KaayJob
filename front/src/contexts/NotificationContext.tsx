import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import { api } from "../lib/api";
import { toast } from "sonner";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  read: boolean;
  link?: string;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearReadNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const previousUnreadRef = useRef(0);

  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found, skipping notification fetch");
      return;
    }

    try {
      setLoading(true);
      console.log("Fetching notifications...");
      const response = await api.get("/notifications?limit=50");
      console.log("Notifications response:", response);
      console.log("Response success:", response?.success);
      if (response?.success) {
        const newNotifications = response.data || [];
        const newUnreadCount = response.unreadCount || 0;

        console.log(
          "Notifications fetched:",
          newNotifications.length,
          "unread:",
          newUnreadCount,
        );

        // Afficher un toast pour les nouvelles notifications non lues
        const previousUnread = previousUnreadRef.current;
        if (newUnreadCount > previousUnread) {
          const newOnes = newNotifications
            .filter((n: Notification) => !n.read)
            .slice(0, newUnreadCount - previousUnread);
          newOnes.forEach((n: Notification) => {
            if (n.type === "success")
              toast.success(n.title, { description: n.message });
            else if (n.type === "error")
              toast.error(n.title, { description: n.message });
            else if (n.type === "warning")
              toast.warning(n.title, { description: n.message });
            else toast.info(n.title, { description: n.message });
          });
        }

        previousUnreadRef.current = newUnreadCount;
        setNotifications(newNotifications);
        setUnreadCount(newUnreadCount);
      }
    } catch (error: any) {
      // Ne pas afficher d'erreur si c'est juste unauthenticated
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        console.error("Erreur chargement notifications:", error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Polling toutes les 10 secondes pour vérifier les nouvelles notifications
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Charger les notifications au démarrage
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Erreur mise à jour notification:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Erreur mise à jour notifications:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      const notification = notifications.find((n) => n.id === id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (notification && !notification.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Erreur suppression notification:", error);
    }
  };

  const clearReadNotifications = async () => {
    try {
      await api.delete("/notifications");
      setNotifications((prev) => prev.filter((n) => !n.read));
    } catch (error) {
      console.error("Erreur suppression notifications:", error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearReadNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
}

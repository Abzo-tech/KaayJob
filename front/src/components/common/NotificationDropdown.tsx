import { useState, useRef, useEffect } from "react";
import {
  Bell,
  AlertCircle,
  CheckCircle,
  Info,
  Check,
  Trash2,
  X,
} from "lucide-react";
import {
  useNotifications,
  Notification,
} from "../../contexts/NotificationContext";

export function NotificationDropdown({
  variant = "dark",
  align = "left",
}: {
  variant?: "light" | "dark";
  align?: "left" | "right";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearReadNotifications,
  } = useNotifications();

  const iconColor = variant === "light" ? "text-gray-700" : "text-white";
  const hoverBg =
    variant === "light" ? "hover:bg-gray-100" : "hover:bg-blue-700";

  // Fermer le dropdown quand on clique à l'extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getIconBg = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-100";
      case "error":
        return "bg-red-100";
      case "warning":
        return "bg-yellow-100";
      default:
        return "bg-blue-100";
    }
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return "";

    // Handle different date formats
    let date: Date;
    if (typeof dateStr === "string") {
      // Try to parse the date string
      date = new Date(dateStr);
    } else {
      date = new Date(dateStr);
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Date récente";
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins}min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString("fr-FR");
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Marquer comme lu automatiquement au clic
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // Si there's a link, navigate to it
    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteNotification(id);
  };

  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await markAllAsRead();
  };

  const handleClearAll = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await clearReadNotifications();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton cloche */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 ${hoverBg} rounded-lg transition-colors`}
        title="Notifications"
      >
        <Bell size={20} className={iconColor} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={`absolute top-0 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden ${
            align === "right" ? "left-full ml-2" : "-left-72"
          }`}
        >
          {/* En-tête moderne */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#000080] to-blue-600">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-white" />
              <h3 className="font-semibold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                  {unreadCount} nouveau{unreadCount > 1 ? "x" : ""}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {notifications.length > 0 && (
                <>
                  <button
                    onClick={handleMarkAllRead}
                    className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Tout marquer comme lu"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Tout supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Fermer"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Liste des notifications */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell className="h-8 w-8 text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">Aucune notification</p>
                <p className="text-gray-400 text-sm mt-1">Vous êtes à jour !</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-all duration-200 group ${
                      !notification.read ? "bg-blue-50/50" : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Icon avec fond coloré */}
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getIconBg(
                          notification.type,
                        )}`}
                      >
                        {getIcon(notification.type)}
                      </div>

                      {/* Contenu */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`text-sm ${
                              !notification.read
                                ? "font-bold text-gray-900"
                                : "font-medium text-gray-700"
                            }`}
                          >
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-[#000080] rounded-full flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-1.5">
                          <p className="text-xs text-gray-400">
                            {formatTime(notification.createdAt)}
                          </p>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="p-1 text-gray-400 hover:text-[#000080] rounded transition-colors"
                              title="Marquer comme lu"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={(e) => handleDelete(e, notification.id)}
                              className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pied de page */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
              <button
                onClick={() => {
                  // Navigation vers page notifications
                  window.location.href = "/notifications";
                }}
                className="w-full text-center text-sm text-[#000080] hover:text-blue-700 font-medium transition-colors"
              >
                Voir toutes les notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

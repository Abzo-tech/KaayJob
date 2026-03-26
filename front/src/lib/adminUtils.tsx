/**
 * Utility functions pour les composants admin
 */

import { Badge } from "../components/ui/badge";

/**
 * Obtenir le badge de rôle utilisateur
 */
export function getRoleBadge(role: string) {
  switch (role?.toUpperCase()) {
    case "ADMIN":
      return (
        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
          Admin
        </Badge>
      );
    case "PRESTATAIRE":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          Prestataire
        </Badge>
      );
    case "CLIENT":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Client
        </Badge>
      );
    default:
      return <Badge>{role}</Badge>;
  }
}

/**
 * Obtenir le label du rôle
 */
export function getRoleLabel(role: string): string {
  switch (role?.toUpperCase()) {
    case "ADMIN":
      return "Administrateur";
    case "PRESTATAIRE":
      return "Prestataire";
    case "CLIENT":
      return "Client";
    default:
      return role;
  }
}

/**
 * Formater une date en français
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR");
}

/**
 * Formater une date avec l'heure
 */
export function formatDateTime(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Obtenir le badge de statut de réservation
 */
export function getBookingStatusBadge(status: string) {
  switch (status?.toUpperCase()) {
    case "PENDING":
      return (
        <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
      );
    case "CONFIRMED":
      return (
        <Badge className="bg-blue-100 text-blue-800">Confirmé</Badge>
      );
    case "IN_PROGRESS":
      return (
        <Badge className="bg-purple-100 text-purple-800">En cours</Badge>
      );
    case "COMPLETED":
      return (
        <Badge className="bg-green-100 text-green-800">Terminé</Badge>
      );
    case "CANCELLED":
      return <Badge className="bg-red-100 text-red-800">Annulé</Badge>;
    case "REJECTED":
      return <Badge className="bg-gray-100 text-gray-800">Rejeté</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}

/**
 * Obtenir le badge de statut de paiement
 */
export function getPaymentStatusBadge(status: string) {
  switch (status?.toUpperCase()) {
    case "PENDING":
      return (
        <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
      );
    case "PAID":
      return <Badge className="bg-green-100 text-green-800">Payé</Badge>;
    case "REFUNDED":
      return (
        <Badge className="bg-blue-100 text-blue-800">Remboursé</Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
}

/**
 * Obtenir le badge de plan d'abonnement
 */
export function getSubscriptionPlanBadge(plan: string) {
  switch (plan?.toLowerCase()) {
    case "gratuit":
      return <Badge className="bg-gray-100 text-gray-800">Gratuit</Badge>;
    case "premium":
      return <Badge className="bg-yellow-100 text-yellow-800">Premium</Badge>;
    case "pro":
      return <Badge className="bg-purple-100 text-purple-800">Pro</Badge>;
    default:
      return <Badge>{plan}</Badge>;
  }
}

/**
 * Obtenir le badge de statut d'abonnement
 */
export function getSubscriptionStatusBadge(status: string) {
  switch (status?.toLowerCase()) {
    case "active":
      return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
    case "expired":
      return <Badge className="bg-red-100 text-red-800">Expiré</Badge>;
    case "cancelled":
      return <Badge className="bg-gray-100 text-gray-800">Annulé</Badge>;
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}

/**
 * Calculer les statistiques utilisateur
 */
export function calculateUserStats(users: any[]) {
  return {
    total: users.length,
    providers: users.filter((u) => u.role === "PRESTATAIRE").length,
    clients: users.filter((u) => u.role === "CLIENT").length,
    admins: users.filter((u) => u.role === "ADMIN").length,
    unverifiedProviders: users.filter(
      (u) => u.role === "PRESTATAIRE" && !u.is_verified,
    ).length,
  };
}

/**
 * Calculer les statistiques de réservation
 */
export function calculateBookingStats(bookings: any[]) {
  return {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "PENDING").length,
    confirmed: bookings.filter((b) => b.status === "CONFIRMED").length,
    inProgress: bookings.filter((b) => b.status === "IN_PROGRESS").length,
    completed: bookings.filter((b) => b.status === "COMPLETED").length,
    cancelled: bookings.filter((b) => b.status === "CANCELLED").length,
  };
}

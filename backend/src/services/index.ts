/**
 * Point d'exportation pour les services
 */

// Services existants
export { default as EmailService } from "./emailService";
export { createNotification } from "./notificationService";

// Nouveaux services (business logic)
export * from "./userService";
export * from "./bookingService";
export * from "./categoryService";
export * from "./serviceService";
export * from "./paymentService";
export * from "./geolocationService";

"use strict";
/**
 * Service d'email
 * Gère l'envoi des emails transactionnels
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
class EmailService {
    /**
     * Envoyer un email de confirmation d'inscription
     */
    static async sendWelcomeEmail(email, firstName) {
        try {
            // TODO: Implémenter l'envoi d'email avec un provider comme SendGrid, Mailgun, etc.
            console.log(`[Email] Welcome email sent to ${email} (${firstName})`);
            return true;
        }
        catch (error) {
            console.error("Erreur envoi email welcome:", error);
            return false;
        }
    }
    /**
     * Envoyer un email de confirmation de réservation
     */
    static async sendBookingConfirmation(email, firstName, bookingDetails) {
        try {
            console.log(`[Email] Booking confirmation sent to ${email}`);
            console.log(`  Service: ${bookingDetails.serviceName}`);
            console.log(`  Date: ${bookingDetails.date} at ${bookingDetails.time}`);
            console.log(`  Provider: ${bookingDetails.providerName}`);
            return true;
        }
        catch (error) {
            console.error("Erreur envoi email confirmation:", error);
            return false;
        }
    }
    /**
     * Envoyer un email de mise à jour de statut de réservation
     */
    static async sendBookingStatusUpdate(email, firstName, status, bookingDetails) {
        try {
            console.log(`[Email] Booking status update sent to ${email}: ${status}`);
            return true;
        }
        catch (error) {
            console.error("Erreur envoi email status:", error);
            return false;
        }
    }
    /**
     * Envoyer un email de réinitialisation de mot de passe
     */
    static async sendPasswordReset(email, resetToken) {
        try {
            const resetLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${resetToken}`;
            console.log(`[Email] Password reset link: ${resetLink}`);
            return true;
        }
        catch (error) {
            console.error("Erreur envoi email reset:", error);
            return false;
        }
    }
}
exports.EmailService = EmailService;
EmailService.fromEmail = process.env.EMAIL_FROM || "noreply@kaayjob.com";
exports.default = EmailService;
//# sourceMappingURL=emailService.js.map
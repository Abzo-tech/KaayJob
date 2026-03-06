/**
 * Service d'email
 * Gère l'envoi des emails transactionnels
 */

export class EmailService {
  private static fromEmail = process.env.EMAIL_FROM || "noreply@kaayjob.com";

  /**
   * Envoyer un email de confirmation d'inscription
   */
  static async sendWelcomeEmail(
    email: string,
    firstName: string,
  ): Promise<boolean> {
    try {
      // TODO: Implémenter l'envoi d'email avec un provider comme SendGrid, Mailgun, etc.
      console.log(`[Email] Welcome email sent to ${email} (${firstName})`);
      return true;
    } catch (error) {
      console.error("Erreur envoi email welcome:", error);
      return false;
    }
  }

  /**
   * Envoyer un email de confirmation de réservation
   */
  static async sendBookingConfirmation(
    email: string,
    firstName: string,
    bookingDetails: {
      serviceName: string;
      date: string;
      time: string;
      providerName: string;
    },
  ): Promise<boolean> {
    try {
      console.log(`[Email] Booking confirmation sent to ${email}`);
      console.log(`  Service: ${bookingDetails.serviceName}`);
      console.log(`  Date: ${bookingDetails.date} at ${bookingDetails.time}`);
      console.log(`  Provider: ${bookingDetails.providerName}`);
      return true;
    } catch (error) {
      console.error("Erreur envoi email confirmation:", error);
      return false;
    }
  }

  /**
   * Envoyer un email de mise à jour de statut de réservation
   */
  static async sendBookingStatusUpdate(
    email: string,
    firstName: string,
    status: string,
    bookingDetails: { serviceName: string; date: string },
  ): Promise<boolean> {
    try {
      console.log(`[Email] Booking status update sent to ${email}: ${status}`);
      return true;
    } catch (error) {
      console.error("Erreur envoi email status:", error);
      return false;
    }
  }

  /**
   * Envoyer un email de réinitialisation de mot de passe
   */
  static async sendPasswordReset(
    email: string,
    resetToken: string,
  ): Promise<boolean> {
    try {
      const resetLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${resetToken}`;
      console.log(`[Email] Password reset link: ${resetLink}`);
      return true;
    } catch (error) {
      console.error("Erreur envoi email reset:", error);
      return false;
    }
  }
}

export default EmailService;

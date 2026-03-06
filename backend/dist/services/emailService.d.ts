/**
 * Service d'email
 * Gère l'envoi des emails transactionnels
 */
export declare class EmailService {
    private static fromEmail;
    /**
     * Envoyer un email de confirmation d'inscription
     */
    static sendWelcomeEmail(email: string, firstName: string): Promise<boolean>;
    /**
     * Envoyer un email de confirmation de réservation
     */
    static sendBookingConfirmation(email: string, firstName: string, bookingDetails: {
        serviceName: string;
        date: string;
        time: string;
        providerName: string;
    }): Promise<boolean>;
    /**
     * Envoyer un email de mise à jour de statut de réservation
     */
    static sendBookingStatusUpdate(email: string, firstName: string, status: string, bookingDetails: {
        serviceName: string;
        date: string;
    }): Promise<boolean>;
    /**
     * Envoyer un email de réinitialisation de mot de passe
     */
    static sendPasswordReset(email: string, resetToken: string): Promise<boolean>;
}
export default EmailService;
//# sourceMappingURL=emailService.d.ts.map
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Clock, MapPin, User, CalendarIcon } from "lucide-react";

interface BookingSummaryProps {
  providerName?: string;
  providerRole?: string;
  date?: Date;
  time?: string;
  address?: string;
  duration?: string;
  hourlyRate?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (e?: any) => void;
  onBack?: () => void;
  isSubmitting?: boolean;
  showSuccess?: boolean;
  disabled?: boolean;
}

export function BookingSummary({
  providerName = "Ahmed Khan",
  providerRole = "Plombier Expert",
  date,
  time,
  address,
  duration = "1",
  hourlyRate = 25,
  onSubmit,
  onBack,
  isSubmitting = false,
  showSuccess = false,
  disabled = false,
}: BookingSummaryProps) {
  const total = parseInt(duration) * hourlyRate;

  return (
    <Card className="bg-white border-0 shadow-md sticky top-4">
      <CardHeader>
        <CardTitle className="text-xl">
          Récapitulatif de Réservation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Provider Info */}
        <div className="flex items-center space-x-3 pb-4 border-b">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold">{providerName}</h3>
            <p className="text-sm text-gray-600">{providerRole}</p>
          </div>
        </div>

        {/* Booking Details */}
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <CalendarIcon className="w-4 h-4 mr-2 text-gray-500" />
            <span>
              {date
                ? date.toLocaleDateString("fr-FR")
                : "Date non sélectionnée"}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="w-4 h-4 mr-2 text-gray-500" />
            <span>{time || "Heure non sélectionnée"}</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="w-4 h-4 mr-2 text-gray-500" />
            <span>{address || "Adresse non fournie"}</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Tarif Horaire</span>
            <span>{hourlyRate}€/h</span>
          </div>
          <div className="flex justify-between">
            <span>Durée</span>
            <span>{duration} heure(s)</span>
          </div>
          <div className="flex justify-between font-semibold text-lg border-t pt-2">
            <span>Total</span>
            <span className="text-green-600">{total}€</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <button
            onClick={onSubmit}
            disabled={disabled || isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 text-base rounded-md flex items-center justify-center transition-colors"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Réservation en cours...
              </span>
            ) : showSuccess ? (
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Réservation envoyée !
              </span>
            ) : (
              "Confirmer la Réservation"
            )}
          </button>
          {onBack && (
            <button
              onClick={onBack}
              disabled={isSubmitting}
              className="w-full border border-gray-300 text-gray-700 py-3 text-base rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Retour au Prestataire
            </button>
          )}
        </div>

        {/* Guarantee */}
        <div className="text-xs text-gray-600 text-center pt-4 border-t">
          ✓ 100% Garantie de Satisfaction
          <br />
          ✓ Annulation jusqu'à 2 heures avant
          <br />✓ Paiement direct au prestataire
        </div>
      </CardContent>
    </Card>
  );
}

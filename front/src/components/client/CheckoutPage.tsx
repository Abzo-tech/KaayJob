import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Calendar, Clock, MapPin, User, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface CheckoutPageProps {
  onNavigate: (page: string) => void;
}

export function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  // Données de réservation (à récupérer depuis le contexte ou les paramètres)
  const bookingDetails = {
    provider: "Ahmed Khan - Plombier Expert",
    service: "Réparation de Fuites",
    date: "15 Mars 2024",
    time: "10:00",
    address: "123 Rue Principale, Dakar",
    duration: "2 heures",
    clientName: "Marie Dupont",
    clientPhone: "+221 77 123 45 67"
  };

  const handleConfirmBooking = () => {
    // Confirmer la réservation sans paiement
    toast.success("Réservation confirmée ! Le prestataire vous contactera bientôt.");
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-[#000080] mb-2">Confirmer Votre Réservation</h1>
          <p className="text-gray-600 text-lg">Vérifiez les détails et confirmez votre réservation</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Summary */}
          <div className="space-y-6">
            <Card className="bg-white border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl">Détails de la Réservation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Provider Info */}
                <div className="flex items-center space-x-3 pb-4 border-b">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{bookingDetails.provider}</h3>
                    <p className="text-sm text-gray-600">{bookingDetails.service}</p>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{bookingDetails.date}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{bookingDetails.time}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{bookingDetails.address}</span>
                  </div>
                </div>

                {/* Client Info */}
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Informations Client</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Nom:</strong> {bookingDetails.clientName}</p>
                    <p><strong>Téléphone:</strong> {bookingDetails.clientPhone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Notice */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="font-medium text-blue-900">Paiement Hors Plateforme</h3>
                    <p className="text-blue-700">
                      Le paiement s'effectuera directement entre vous et le prestataire
                      une fois le service terminé. La plateforme ne gère pas les transactions financières.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Panel */}
          <div>
            <Card className="bg-white border-0 shadow-md sticky top-4">
              <CardHeader>
                <CardTitle className="text-xl">Confirmation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Terms and Conditions */}
                <div className="space-y-3">
                  <h4 className="font-medium">Conditions d'Utilisation</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Le prestataire vous contactera pour confirmer les détails</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Annulation possible jusqu'à 2 heures avant le rendez-vous</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Paiement direct au prestataire après réalisation du service</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Support client disponible 24/7</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleConfirmBooking}
                    className="w-full bg-[#000080] hover:bg-blue-700 text-white py-3 text-base"
                  >
                    Confirmer la Réservation
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onNavigate('booking')}
                    className="w-full border-gray-300 text-gray-700 py-3 text-base"
                  >
                    Retour à la Réservation
                  </Button>
                </div>

                {/* Footer Note */}
                <div className="text-xs text-gray-600 text-center pt-4 border-t">
                  En confirmant, vous acceptez nos Conditions d'Utilisation.
                  <br />
                  La plateforme KaayJob facilite la mise en relation, le paiement s'effectue hors plateforme.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Separator } from "./ui/separator";
import { CreditCard, Wallet, Banknote, Shield, Calendar, Clock, MapPin, User } from "lucide-react";
import { toast } from "sonner";

interface CheckoutPageProps {
  onNavigate: (page: string) => void;
}

export function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: ""
  });

  const bookingDetails = {
    provider: "Ahmed Khan - Plombier Expert",
    service: "Réparation de Fuites",
    date: "15 Mars 2024",
    time: "10:00",
    address: "123 Rue Principale, Karachi",
    duration: "2 heures",
    hourlyRate: 25,
    total: 50
  };

  const handleCardInputChange = (field: string, value: string) => {
    setCardData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock payment processing
    toast.success("Paiement réussi ! Réservation confirmée.");
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-[#000080] mb-2">Finalisez Votre Réservation</h1>
          <p className="text-gray-600 text-lg">Vérifiez vos détails et effectuez le paiement</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method Selection */}
            <Card className="bg-white border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl">Mode de Paiement</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="card" id="card" />
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer text-base">
                      <div className="font-medium">Carte de Crédit/Débit</div>
                      <div className="text-sm text-gray-500">Visa, Mastercard, American Express</div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Wallet className="w-5 h-5 text-blue-600" />
                    <Label htmlFor="paypal" className="flex-1 cursor-pointer text-base">
                      <div className="font-medium">PayPal</div>
                      <div className="text-sm text-gray-500">Payez avec votre compte PayPal</div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="cash" id="cash" />
                    <Banknote className="w-5 h-5 text-green-600" />
                    <Label htmlFor="cash" className="flex-1 cursor-pointer text-base">
                      <div className="font-medium">Paiement à la Livraison</div>
                      <div className="text-sm text-gray-500">Payez lorsque le service sera terminé</div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Card Details Form */}
            {paymentMethod === "card" && (
              <Card className="bg-white border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl">Détails de la Carte</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="cardName" className="text-base">Nom du Titulaire</Label>
                      <Input
                        id="cardName"
                        placeholder="Entrez le nom sur la carte"
                        value={cardData.name}
                        onChange={(e) => handleCardInputChange('name', e.target.value)}
                        className="mt-2 text-base"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="cardNumber" className="text-base">Numéro de Carte</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardData.number}
                        onChange={(e) => handleCardInputChange('number', e.target.value)}
                        className="mt-2 text-base"
                        maxLength={19}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry" className="text-base">Date d'Expiration</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/AA"
                          value={cardData.expiry}
                          onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                          className="mt-2 text-base"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvc" className="text-base">CVC</Label>
                        <Input
                          id="cvc"
                          placeholder="123"
                          value={cardData.cvc}
                          onChange={(e) => handleCardInputChange('cvc', e.target.value)}
                          className="mt-2 text-base"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* PayPal Notice */}
            {paymentMethod === "paypal" && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <Wallet className="w-6 h-6 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-blue-900">Paiement PayPal</h3>
                      <p className="text-blue-700">Vous serez redirigé vers PayPal pour effectuer votre paiement en toute sécurité.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Cash Payment Notice */}
            {paymentMethod === "cash" && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <Banknote className="w-6 h-6 text-green-600" />
                    <div>
                      <h3 className="font-medium text-green-900">Paiement en Espèces</h3>
                      <p className="text-green-700">
                        Vous pouvez payer le prestataire directement lorsque le travail sera terminé. 
                        Assurez-vous d'avoir l'appoint.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Security Notice */}
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-gray-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">Paiement Sécurisé</h3>
                    <p className="text-gray-700">
                      Vos informations de paiement sont cryptées et sécurisées. Nous ne stockons jamais vos coordonnées de carte.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="bg-white border-0 shadow-md sticky top-4">
              <CardHeader>
                <CardTitle className="text-xl">Récapitulatif de Commande</CardTitle>
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

                <Separator />

                {/* Pricing Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Service ({bookingDetails.duration})</span>
                    <span>{bookingDetails.total}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frais de Réservation</span>
                    <span>0€</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Frais de Plateforme</span>
                    <span>0€</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-green-600">{bookingDetails.total}€</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-4 space-y-3">
                  <Button 
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base"
                  >
                    {paymentMethod === "cash" ? "Confirmer la Réservation" : "Payer Maintenant"}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => onNavigate('booking')}
                    className="w-full border-gray-300 text-gray-700 py-3 text-base"
                  >
                    Retour à la Réservation
                  </Button>
                </div>

                {/* Terms */}
                <div className="text-xs text-gray-600 text-center pt-4 border-t">
                  En procédant, vous acceptez nos Conditions d'Utilisation et notre Politique de Confidentialité.
                  <br /><br />
                  ✓ 100% Garantie de Satisfaction<br />
                  ✓ Annulation jusqu'à 2 heures avant<br />
                  ✓ Support Client 24/7
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

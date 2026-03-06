import { useState, useMemo } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon, Clock, MapPin, User } from "lucide-react";
import { validateFormField } from "../lib/validations";
import { toast } from "sonner";

interface BookingPageProps {
  onNavigate: (page: string) => void;
}

export function BookingPage({ onNavigate }: BookingPageProps) {
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    time: "",
    address: "",
    city: "",
    phone: "",
    notes: "",
    serviceType: "",
    duration: "1"
  });
  
  // États pour les erreurs de validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Calculer les dates valides pour le calendrier
  const minDate = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }, []);

  const maxDate = useMemo(() => {
    const max = new Date();
    max.setMonth(max.getMonth() + 2);
    return max;
  }, []);

  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00",
    "17:00", "18:00"
  ];

  const serviceTypes = [
    "Installation de Canalisations",
    "Réparation de Fuites", 
    "Nettoyage de Drains",
    "Réparation de Chauffe-eau",
    "Service d'Urgence",
    "Plomberie Générale"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validation en temps réel
    if (touched[field]) {
      validateFieldRealTime(field, value);
    }
  };

  // Validation en temps réel d'un champ
  const validateFieldRealTime = (field: string, value: string): boolean => {
    let error: string | null = null;
    
    switch (field) {
      case "phone":
        error = validateFormField(value, "phone", "Téléphone");
        break;
      case "address":
        error = validateFormField(value, "address", "Adresse");
        break;
      case "city":
        error = validateFormField(value, "city", "Ville");
        break;
      case "serviceType":
        if (!value || value.trim() === "") {
          error = "Le type de service est requis";
        }
        break;
      case "time":
        if (!value || value.trim() === "") {
          error = "L'heure est requise";
        }
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: error || "" }));
    return !error;
  };

  // Gestion de la perte de focus
  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateFieldRealTime(field, formData[field as keyof typeof formData]);
  };

  // Valider le formulaire complet
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Validation du type de service
    if (!formData.serviceType || formData.serviceType.trim() === "") {
      newErrors.serviceType = "Le type de service est requis";
      isValid = false;
    }

    // Validation de la date
    if (!date) {
      newErrors.date = "La date est requise";
      isValid = false;
    }

    // Validation de l'heure
    if (!formData.time || formData.time.trim() === "") {
      newErrors.time = "L'heure est requise";
      isValid = false;
    }

    // Validation de l'adresse
    const addressError = validateFormField(formData.address, "address", "Adresse");
    if (addressError) {
      newErrors.address = addressError;
      isValid = false;
    }

    // Validation de la ville
    const cityError = validateFormField(formData.city, "city", "Ville");
    if (cityError) {
      newErrors.city = cityError;
      isValid = false;
    }

    // Validation du téléphone
    const phoneError = validateFormField(formData.phone, "phone", "Téléphone");
    if (phoneError) {
      newErrors.phone = phoneError;
      isValid = false;
    }

    setErrors(newErrors);
    setTouched({
      serviceType: true,
      date: true,
      time: true,
      address: true,
      city: true,
      phone: true
    });

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation avant soumission
    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    // Confirmer la réservation (paiement hors plateforme)
    toast.success("Réservation confirmée ! Le prestataire vous contactera pour le paiement.");
    // Réinitialiser le formulaire
    setDate(undefined);
    setFormData({
      time: "",
      address: "",
      city: "",
      phone: "",
      notes: "",
      serviceType: "",
      duration: "1",
    });
    setErrors({});
    setTouched({});
  };

  const calculateTotal = () => {
    const hours = parseInt(formData.duration);
    const hourlyRate = 25;
    return hours * hourlyRate;
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-[#000080] mb-2">Réservez Votre Service</h1>
          <p className="text-gray-600 text-lg">Planifiez un rendez-vous avec Ahmed Khan - Plombier Expert</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 animate-slide-up">
            <Card className="bg-white border-2 border-[#000080]/10 shadow-lg hover:border-[#000080]/30 transition-all">
              <CardHeader className="bg-gradient-to-r from-[#FFF4EA] to-white border-b border-[#000080]/10">
                <CardTitle className="text-2xl text-[#000080]">Détails du Service</CardTitle>
              </CardHeader>
              <CardContent className="pt-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Service Type */}
                  <div>
                    <Label htmlFor="serviceType" className="text-base font-semibold text-[#000080]">Type de Service *</Label>
                    <Select 
                      onValueChange={(value) => {
                        handleInputChange('serviceType', value);
                        setTouched(prev => ({ ...prev, serviceType: true }));
                        if (value) validateFieldRealTime('serviceType', value);
                      }}
                    >
                      <SelectTrigger className={`mt-2 text-base border-[#000080]/20 focus:border-[#000080] ${errors.serviceType && touched.serviceType ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Sélectionnez le type de service dont vous avez besoin" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map((service) => (
                          <SelectItem key={service} value={service} className="text-base">
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.serviceType && touched.serviceType && (
                      <p className="text-red-500 text-sm mt-1">{errors.serviceType}</p>
                    )}
                  </div>

                  {/* Date Picker - Simple version */}
                  <div>
                    <Label className="text-base">Date Préférée *</Label>
                    <div className="mt-2">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(selectedDate: Date | undefined) => {
                          setDate(selectedDate);
                          setTouched(prev => ({ ...prev, date: true }));
                          if (selectedDate) {
                            setErrors(prev => ({ ...prev, date: "" }));
                          }
                        }}
                        fromDate={minDate}
                        toDate={maxDate}
                        className="rounded-md border"
                      />
                    </div>
                    {errors.date && touched.date && (
                      <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                    )}
                  </div>

                  {/* Time Slot */}
                  <div>
                    <Label htmlFor="time" className="text-base">Heure Préférée *</Label>
                    <Select 
                      onValueChange={(value) => {
                        handleInputChange('time', value);
                        setTouched(prev => ({ ...prev, time: true }));
                        validateFieldRealTime('time', value);
                      }}
                    >
                      <SelectTrigger className={`mt-2 text-base ${errors.time && touched.time ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Sélectionnez votre heure préférée" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time} className="text-base">
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.time && touched.time && (
                      <p className="text-red-500 text-sm mt-1">{errors.time}</p>
                    )}
                  </div>

                  {/* Duration */}
                  <div>
                    <Label htmlFor="duration" className="text-base">Durée Estimée *</Label>
                    <Select onValueChange={(value) => handleInputChange('duration', value)} defaultValue="1">
                      <SelectTrigger className="mt-2 text-base">
                        <SelectValue placeholder="Combien d'heures avez-vous besoin ?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1" className="text-base">1 heure - 25€</SelectItem>
                        <SelectItem value="2" className="text-base">2 heures - 50€</SelectItem>
                        <SelectItem value="3" className="text-base">3 heures - 75€</SelectItem>
                        <SelectItem value="4" className="text-base">4 heures - 100€</SelectItem>
                        <SelectItem value="5" className="text-base">5+ heures - Devis personnalisé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Address */}
                  <div>
                    <Label htmlFor="address" className="text-base">Adresse du Service *</Label>
                    <Input
                      id="address"
                      placeholder="Entrez votre adresse complète"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      onBlur={() => handleBlur('address')}
                      className={`mt-2 text-base ${errors.address && touched.address ? "border-red-500" : ""}`}
                    />
                    {errors.address && touched.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <Label htmlFor="city" className="text-base">Ville *</Label>
                    <Input
                      id="city"
                      placeholder="Entrez votre ville"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      onBlur={() => handleBlur('city')}
                      className={`mt-2 text-base ${errors.city && touched.city ? "border-red-500" : ""}`}
                    />
                    {errors.city && touched.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone" className="text-base">Téléphone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Entrez votre numéro (ex: +221771234567)"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      onBlur={() => handleBlur('phone')}
                      className={`mt-2 text-base ${errors.phone && touched.phone ? "border-red-500" : ""}`}
                    />
                    {errors.phone && touched.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>

                  {/* Notes */}
                  <div>
                    <Label htmlFor="notes" className="text-base">Détails Supplémentaires</Label>
                    <Textarea
                      id="notes"
                      placeholder="Entrez des détails supplémentaires sur vos besoins de service..."
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      className="mt-2 text-base min-h-[100px]"
                      rows={4}
                    />
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div>
            <Card className="bg-white border-0 shadow-md sticky top-4">
              <CardHeader>
                <CardTitle className="text-xl">Récapitulatif de Réservation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Provider Info */}
                <div className="flex items-center space-x-3 pb-4 border-b">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Ahmed Khan</h3>
                    <p className="text-sm text-gray-600">Plombier Expert</p>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <CalendarIcon className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{date ? date.toLocaleDateString("fr-FR") : "Date non sélectionnée"}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{formData.time || "Heure non sélectionnée"}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{formData.address || "Adresse non fournie"}</span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Tarif Horaire</span>
                    <span>25€/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Durée</span>
                    <span>{formData.duration} heure(s)</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total</span>
                    <span className="text-green-600">{calculateTotal()}€</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  <Button 
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base"
                    disabled={!date || !formData.time || !formData.address || !formData.serviceType}
                  >
                    Confirmer la Réservation
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => onNavigate('service-detail')}
                    className="w-full border-gray-300 text-gray-700 py-3 text-base"
                  >
                    Retour au Prestataire
                  </Button>
                </div>

                {/* Guarantee */}
                <div className="text-xs text-gray-600 text-center pt-4 border-t">
                  ✓ 100% Garantie de Satisfaction<br />
                  ✓ Annulation jusqu'à 2 heures avant<br />
                  ✓ Paiement direct au prestataire
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CalendarPicker, BookingSummary } from "../common";
import { validateFormField } from "../../lib/validations";
import { api } from "../../lib/api";
import { Loader2 } from "lucide-react";

interface BookingPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
  params?: Record<string, string>;
}

interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  priceType: "fixed" | "hourly" | "quote";
  duration?: number;
}

interface Provider {
  id: string;
  userId: string;
  specialty?: string;
  hourlyRate?: number;
  location?: string;
  user: {
    firstName: string;
    lastName: string;
  };
  services: Service[];
}

const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

const DURATION_OPTIONS = [
  { value: "1", label: "1 heure" },
  { value: "2", label: "2 heures" },
  { value: "3", label: "3 heures" },
  { value: "4", label: "4 heures" },
  { value: "5", label: "5+ heures" },
];

export function BookingPage({ onNavigate, params = {} }: BookingPageProps) {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const providerId = params.providerId;
  const serviceId = params.serviceId;

  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    time: "",
    address: "",
    city: "",
    phone: "",
    notes: "",
    serviceId: serviceId || "",
    duration: "1",
  });

  // États pour les erreurs de validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch provider data
  useEffect(() => {
    const fetchProvider = async () => {
      if (!providerId) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/providers/${providerId}`);
        if (response.success && response.data) {
          setProvider(response.data);
          // Pre-fill phone if user is logged in
          const userStr = localStorage.getItem("user");
          if (userStr) {
            const user = JSON.parse(userStr);
            if (user.phone) {
              setFormData((prev) => ({ ...prev, phone: user.phone }));
            }
          }
        } else {
          setError(response.message || "Prestataire non trouvé");
        }
      } catch (err) {
        console.error("Erreur chargement prestataire:", err);
        setError("Impossible de charger les informations du prestataire");
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [providerId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

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
      case "serviceId":
        if (!value || value.trim() === "") {
          error = "Le service est requis";
        }
        break;
      case "time":
        if (!value || value.trim() === "") {
          error = "L'heure est requise";
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error || "" }));
    return !error;
  };

  // Gestion de la perte de focus
  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const value = formData[field as keyof typeof formData];
    if (value !== undefined) {
      validateFieldRealTime(field, value);
    }
  };

  // Valider le formulaire complet
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Validation du service
    if (!formData.serviceId || formData.serviceId.trim() === "") {
      newErrors.serviceId = "Le service est requis";
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
    const addressError = validateFormField(
      formData.address,
      "address",
      "Adresse",
    );
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
      serviceId: true,
      date: true,
      time: true,
      address: true,
      city: true,
      phone: true,
    });

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation avant soumission
    if (!validateForm()) {
      return;
    }

    // Afficher l'animation de chargement
    setIsSubmitting(true);
    setShowSuccess(false);
    setSubmitError(null);

    try {
      // Prepare booking data
      const bookingData = {
        providerId: providerId,
        serviceId: formData.serviceId,
        date: date?.toISOString().split("T")[0],
        time: formData.time,
        duration: parseInt(formData.duration),
        address: formData.address,
        city: formData.city,
        phone: formData.phone,
        notes: formData.notes,
      };

      // Call API
      const response = await api.post("/bookings", bookingData);

      if (response.success) {
        // Afficher l'animation de succès
        setIsSubmitting(false);
        setShowSuccess(true);

        // Après 2 secondes, naviguer vers le dashboard
        setTimeout(() => {
          setShowSuccess(false);
          onNavigate("dashboard");
        }, 2000);
      } else {
        setSubmitError(response.message || "Erreur lors de la réservation");
        setIsSubmitting(false);
      }
    } catch (err: any) {
      console.error("Erreur soumission réservation:", err);
      setSubmitError(err.message || "Erreur lors de la réservation");
      setIsSubmitting(false);
    }
  };

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
    setTouched((prev) => ({ ...prev, date: true }));
    setErrors((prev) => ({ ...prev, date: "" }));
  };

  // Get selected service
  const selectedService = provider?.services?.find(
    (s) => s.id === formData.serviceId,
  );

  // Calculate total price
  const calculateTotal = () => {
    if (selectedService) {
      if (selectedService.priceType === "fixed") {
        return selectedService.price;
      }
      if (selectedService.priceType === "hourly") {
        return selectedService.price * parseInt(formData.duration || "1");
      }
    }
    // Default to hourly rate * duration
    return (provider?.hourlyRate || 25) * parseInt(formData.duration || "1");
  };

  // Get provider name
  const providerName = provider
    ? `${provider.user.firstName} ${provider.user.lastName}`
    : "Prestataire";
  const providerRole = provider?.specialty || "Service";

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#000080] mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            {error || "Prestataire non trouvé"}
          </p>
          <Button onClick={() => onNavigate("categories")}>
            Retour aux catégories
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-[#000080] mb-2">
            Réservez Votre Service
          </h1>
          <p className="text-gray-600 text-lg">
            Planifiez un rendez-vous avec {providerName} - {providerRole}
          </p>
        </div>

        {submitError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {submitError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 animate-slide-up">
            <Card className="bg-white border-2 border-[#000080]/10 shadow-lg hover:border-[#000080]/30 transition-all">
              <CardHeader className="bg-gradient-to-r from-[#FFF4EA] to-white border-b border-[#000080]/10">
                <CardTitle className="text-2xl text-[#000080]">
                  Détails du Service
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Service Selection */}
                  <div>
                    <Label
                      htmlFor="serviceId"
                      className="text-base font-semibold text-[#000080]"
                    >
                      Service Souhaité *
                    </Label>
                    <Select
                      value={formData.serviceId}
                      onValueChange={(value) => {
                        handleInputChange("serviceId", value);
                        setTouched((prev) => ({ ...prev, serviceId: true }));
                        if (value) validateFieldRealTime("serviceId", value);
                      }}
                    >
                      <SelectTrigger
                        className={`mt-2 text-base border-[#000080]/20 focus:border-[#000080] ${errors.serviceId && touched.serviceId ? "border-red-500" : ""}`}
                      >
                        <SelectValue placeholder="Sélectionnez un service" />
                      </SelectTrigger>
                      <SelectContent>
                        {provider.services?.map((service) => (
                          <SelectItem
                            key={service.id}
                            value={service.id}
                            className="text-base"
                          >
                            {service.name} -{" "}
                            {service.priceType === "quote"
                              ? "Sur devis"
                              : service.priceType === "fixed"
                                ? `${Number(service.price).toLocaleString("fr-SN")} CFA`
                                : `À partir de ${Number(service.price).toLocaleString("fr-SN")} CFA/h`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.serviceId && touched.serviceId && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.serviceId}
                      </p>
                    )}
                  </div>

                  {/* Date Picker - Extracted Component */}
                  <CalendarPicker
                    value={date}
                    onChange={handleDateChange}
                    error={errors.date}
                    touched={touched.date}
                  />

                  {/* Time Slot */}
                  <div>
                    <Label htmlFor="time" className="text-base">
                      Heure Préférée *
                    </Label>
                    <Select
                      value={formData.time}
                      onValueChange={(value) => {
                        handleInputChange("time", value);
                        setTouched((prev) => ({ ...prev, time: true }));
                        validateFieldRealTime("time", value);
                      }}
                    >
                      <SelectTrigger
                        className={`mt-2 text-base ${errors.time && touched.time ? "border-red-500" : ""}`}
                      >
                        <SelectValue placeholder="Sélectionnez votre heure préférée" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_SLOTS.map((time) => (
                          <SelectItem
                            key={time}
                            value={time}
                            className="text-base"
                          >
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
                    <Label htmlFor="duration" className="text-base">
                      Durée Estimée *
                    </Label>
                    <Select
                      value={formData.duration}
                      onValueChange={(value) =>
                        handleInputChange("duration", value)
                      }
                    >
                      <SelectTrigger className="mt-2 text-base">
                        <SelectValue placeholder="Combien d'heures avez-vous besoin ?" />
                      </SelectTrigger>
                      <SelectContent>
                        {DURATION_OPTIONS.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="text-base"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Address */}
                  <div>
                    <Label htmlFor="address" className="text-base">
                      Adresse du Service *
                    </Label>
                    <Input
                      id="address"
                      placeholder="Entrez votre adresse complète"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      onBlur={() => handleBlur("address")}
                      className={`mt-2 text-base ${errors.address && touched.address ? "border-red-500" : ""}`}
                    />
                    {errors.address && touched.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <Label htmlFor="city" className="text-base">
                      Ville *
                    </Label>
                    <Input
                      id="city"
                      placeholder="Entrez votre ville"
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      onBlur={() => handleBlur("city")}
                      className={`mt-2 text-base ${errors.city && touched.city ? "border-red-500" : ""}`}
                    />
                    {errors.city && touched.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone" className="text-base">
                      Téléphone *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Entrez votre numéro (ex: +221771234567)"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      onBlur={() => handleBlur("phone")}
                      className={`mt-2 text-base ${errors.phone && touched.phone ? "border-red-500" : ""}`}
                    />
                    {errors.phone && touched.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Notes */}
                  <div>
                    <Label htmlFor="notes" className="text-base">
                      Détails Supplémentaires
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Entrez des détails supplémentaires sur vos besoins de service..."
                      value={formData.notes}
                      onChange={(e) =>
                        handleInputChange("notes", e.target.value)
                      }
                      className="mt-2 text-base min-h-[100px]"
                      rows={4}
                    />
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary - Extracted Component */}
          <div>
            <BookingSummary
              providerName={providerName}
              providerRole={providerRole}
              date={date}
              time={formData.time}
              address={formData.address}
              duration={formData.duration}
              hourlyRate={
                selectedService?.priceType === "fixed"
                  ? calculateTotal()
                  : provider.hourlyRate || 25
              }
              onSubmit={handleSubmit}
              onBack={() =>
                onNavigate("service-detail", { providerId: providerId })
              }
              isSubmitting={isSubmitting}
              showSuccess={showSuccess}
              disabled={
                !date ||
                !formData.time ||
                !formData.address ||
                !formData.serviceId
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Camera, Star, Save } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { validateFormField } from "../../lib/validations";
import { toast } from "sonner";
import { api } from "../../lib/api";

export function PrestataireProfile() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
  });

  // États pour les erreurs de validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Charger les données utilisateur au montage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          setFormData({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            phone: user.phone || "",
            address: user.address || "",
            bio: user.bio || "",
          });
        }
      } catch (error) {
        console.error("Erreur chargement profil:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

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
      case "email":
        error = validateFormField(value, "email", "Email");
        break;
      case "phone":
        error = validateFormField(value, "phone", "Téléphone");
        break;
      case "firstName":
      case "lastName":
        error = validateFormField(
          value,
          "name",
          field === "firstName" ? "Prénom" : "Nom",
        );
        break;
      case "address":
        error = validateFormField(value, "address", "Adresse");
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error || "" }));
    return !error;
  };

  // Gestion de la perte de focus
  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateFieldRealTime(field, formData[field as keyof typeof formData]);
  };

  // Valider le formulaire complet
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    const firstNameError = validateFormField(
      formData.firstName,
      "name",
      "Prénom",
    );
    if (firstNameError) {
      newErrors.firstName = firstNameError;
      isValid = false;
    }

    const lastNameError = validateFormField(formData.lastName, "name", "Nom");
    if (lastNameError) {
      newErrors.lastName = lastNameError;
      isValid = false;
    }

    const emailError = validateFormField(formData.email, "email", "Email");
    if (emailError) {
      newErrors.email = emailError;
      isValid = false;
    }

    const phoneError = validateFormField(formData.phone, "phone", "Téléphone");
    if (phoneError) {
      newErrors.phone = phoneError;
      isValid = false;
    }

    const addressError = validateFormField(
      formData.address,
      "address",
      "Adresse",
    );
    if (addressError) {
      newErrors.address = addressError;
      isValid = false;
    }

    setErrors(newErrors);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      address: true,
      bio: true,
    });

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    setIsSaving(true);

    try {
      // Appel API pour mettre à jour le profil
      const response = await api.put<{ success: boolean; data: any }>(
        "/auth/profile",
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        }
      );

      if (response.success) {
        // Mettre à jour les données dans localStorage
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUser = {
          ...currentUser,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        toast.success("Profil mis à jour avec succès !");
      }
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour du profil");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 lg:ml-64">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#000080]">Mon profil</h1>
        <p className="text-gray-500 mt-1">
          Gérez vos informations personnelles
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Photo de profil */}
        <Card className="lg:row-span-2">
          <CardHeader>
            <CardTitle>Photo de profil</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="w-40 h-40 bg-[#000080] rounded-full flex items-center justify-center text-white text-5xl font-bold mb-4">
              AK
            </div>
            <Button variant="outline" className="w-full">
              <Camera size={16} className="mr-2" />
              Changer la photo
            </Button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              JPG, PNG ou GIF. Max 2MB
            </p>
          </CardContent>
        </Card>

        {/* Informations personnelles */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
            <CardDescription>
              Ces informations seront visibles par les clients
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    onBlur={() => handleBlur("firstName")}
                    className={
                      errors.firstName && touched.firstName
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {errors.firstName && touched.firstName && (
                    <p className="text-red-500 text-sm">{errors.firstName}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    onBlur={() => handleBlur("lastName")}
                    className={
                      errors.lastName && touched.lastName
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {errors.lastName && touched.lastName && (
                    <p className="text-red-500 text-sm">{errors.lastName}</p>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={
                    errors.email && touched.email ? "border-red-500" : ""
                  }
                />
                {errors.email && touched.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  onBlur={() => handleBlur("phone")}
                  className={
                    errors.phone && touched.phone ? "border-red-500" : ""
                  }
                />
                {errors.phone && touched.phone && (
                  <p className="text-red-500 text-sm">{errors.phone}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Adresse *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  onBlur={() => handleBlur("address")}
                  className={
                    errors.address && touched.address ? "border-red-500" : ""
                  }
                />
                {errors.address && touched.address && (
                  <p className="text-red-500 text-sm">{errors.address}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bio">Biographie</Label>
                <textarea
                  id="bio"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 text-right">
                  {formData.bio.length}/500
                </p>
              </div>
              <Button type="submit" className="bg-[#000080] hover:bg-blue-900" disabled={isSaving}>
                <Save size={16} className="mr-2" />
                {isSaving ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Badge et Abonnement */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Mon abonnement</CardTitle>
            <CardDescription>
              Statut de votre abonnement Premium
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Star className="text-white fill-current" size={24} />
                </div>
                <div>
                  <p className="font-bold text-lg">Plan Premium</p>
                  <p className="text-sm text-gray-600">
                    Expire le 15 Mars 2024
                  </p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Actif</Badge>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium">Vos privilèges :</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ Services illimités</li>
                <li>✓ Badge VIP sur votre profil</li>
                <li>✓ Visibilité prioritaire</li>
                <li>✓ Support prioritaire</li>
              </ul>
            </div>
            <Button variant="outline" className="w-full mt-4">
              Voir les plans disponibles
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

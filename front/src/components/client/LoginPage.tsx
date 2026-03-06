import { useState } from "react";
import { validateFormField } from "../../lib/validations";
import { toast } from "sonner";
import { api, AuthResponse } from "../../lib/api";
import { AuthForm } from "../common";

interface LoginPageProps {
  onNavigate: (page: string) => void;
  onLogin: (authData: AuthResponse) => void;
  defaultTab?: string;
}

export function LoginPage({ onNavigate, onLogin, defaultTab }: LoginPageProps) {
  const [userType, setUserType] = useState<"customer" | "provider" | "admin">(
    defaultTab === "provider"
      ? "provider"
      : defaultTab === "admin"
        ? "admin"
        : "customer",
  );
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // États pour les erreurs de validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

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
      case "password":
        error = validateFormField(value, "password", "Mot de passe");
        break;
      case "name":
        error = validateFormField(value, "name", "Nom");
        break;
      case "phone":
        error = validateFormField(value, "phone", "Téléphone");
        break;
      case "confirmPassword":
        if (value !== formData.password) {
          error = "Les mots de passe ne correspondent pas";
        }
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
  const validateForm = (isSignup: boolean): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Pour la connexion - les champs sont optionnels mais validés si remplis
    if (!isSignup) {
      // Validation de l'email seulement s'il est rempli
      if (formData.email && formData.email.trim() !== "") {
        const emailError = validateFormField(formData.email, "email", "Email");
        if (emailError) {
          newErrors.email = emailError;
          isValid = false;
        }
      }

      // Validation du mot de passe seulement s'il est rempli
      if (formData.password && formData.password.trim() !== "") {
        const passwordError = validateFormField(
          formData.password,
          "password",
          "Mot de passe",
        );
        if (passwordError) {
          newErrors.password = passwordError;
          isValid = false;
        }
      }
    } else {
      // Pour l'inscription - tous les champs sont obligatoires
      const emailError = validateFormField(formData.email, "email", "Email");
      if (emailError) {
        newErrors.email = emailError;
        isValid = false;
      }

      const passwordError = validateFormField(
        formData.password,
        "password",
        "Mot de passe",
      );
      if (passwordError) {
        newErrors.password = passwordError;
        isValid = false;
      }

      const nameError = validateFormField(formData.firstName, "name", "Nom");
      if (nameError) {
        newErrors.name = nameError;
        isValid = false;
      }

      const phoneError = validateFormField(
        formData.phone,
        "phone",
        "Téléphone",
      );
      if (phoneError) {
        newErrors.phone = phoneError;
        isValid = false;
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
        isValid = false;
      }
    }

    setErrors(newErrors);
    setTouched({
      email: true,
      password: true,
      name: true,
      phone: true,
      confirmPassword: true,
    });

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent, isSignup: boolean) => {
    e.preventDefault();

    // Validation avant soumission
    if (!validateForm(isSignup)) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    setIsLoading(true);

    try {
      if (activeTab === "login") {
        // Connexion - l'API retourne { success, message, data: { user, token } }
        const response = await api.post<{ success: boolean; data: AuthResponse }>(
          "/auth/login",
          {
            email: formData.email,
            password: formData.password,
          }
        );

        // Validate that the selected user type matches the user's actual role
        const userRole = response.data.user.role?.toLowerCase();
        
        // Map user types for comparison
        const userTypeMap: Record<string, string> = {
          'client': 'customer',
          'prestataire': 'provider',
          'admin': 'admin'
        };
        
        const expectedRole = userTypeMap[userRole] || userRole;
        
        if (expectedRole !== userType) {
          toast.error(`Ce compte n'est pas un compte ${userType}. Veuillez sélectionner le bon type de compte ou contacter le support.`);
          setIsLoading(false);
          return;
        }

        // response.data contains { user, token }
        onLogin(response.data);
        toast.success("Connexion réussie !");
      } else {
        // Inscription
        const nameParts = formData.firstName.trim().split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ") || firstName;

        // Inscription - l'API retourne { success, message, data: { user, token } }
        const response = await api.post<{ success: boolean; data: AuthResponse }>(
          "/auth/register",
          {
            email: formData.email,
            password: formData.password,
            firstName,
            lastName,
            phone: formData.phone,
            role: userType === "provider" ? "prestataire" : "client",
          }
        );

        // response.data contains { user, token }
        onLogin(response.data);
        toast.success("Compte créé avec succès !");
      }
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/videos/background.mp4" type="video/mp4" />
      </video>

      {/* Overlay for better text visibility - black with opacity */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/70" />

      <div className="min-h-screen flex items-center justify-center py-12 px-4 relative z-10">
        <div className="max-w-sm w-full">
          <div className="text-center mb-4 animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-1 drop-shadow-lg">
              KaayJob
            </h1>
            <p className="text-white/90 text-sm drop-shadow">
              Connectez-vous avec des prestataires de confiance
            </p>
          </div>

          <AuthForm
            userType={userType}
            activeTab={activeTab}
            formData={formData}
            errors={errors}
            touched={touched}
            isLoading={isLoading}
            onUserTypeChange={setUserType}
            onTabChange={setActiveTab}
            onInputChange={handleInputChange}
            onBlur={handleBlur}
            onSubmit={handleSubmit}
            onNavigate={onNavigate}
          />

          {/* Back button - below the form */}
          <div className="mt-4 text-center">
            <button
              onClick={() => onNavigate("home")}
              className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-lg backdrop-blur transition-all duration-300"
            >
              ← Retour à l'Accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

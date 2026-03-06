import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Headphones,
} from "lucide-react";
import { validateFormField } from "../../lib/validations";
import { toast } from "sonner";

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

export function ContactPage({ onNavigate }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
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
      case "name":
        error = validateFormField(value, "name", "Nom");
        break;
      case "phone":
        if (value && value.trim() !== "") {
          error = validateFormField(value, "phone", "Téléphone");
        }
        break;
      case "subject":
        if (!value || value.trim().length < 5) {
          error = "Le sujet doit contenir au moins 5 caractères";
        }
        break;
      case "message":
        if (!value || value.trim().length < 10) {
          error = "Le message doit contenir au moins 10 caractères";
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
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Validation du nom
    const nameError = validateFormField(formData.name, "name", "Nom");
    if (nameError) {
      newErrors.name = nameError;
      isValid = false;
    }

    // Validation de l'email
    const emailError = validateFormField(formData.email, "email", "Email");
    if (emailError) {
      newErrors.email = emailError;
      isValid = false;
    }

    // Validation du téléphone (optionnel mais si fourni, doit être valide)
    if (formData.phone && formData.phone.trim() !== "") {
      const phoneError = validateFormField(
        formData.phone,
        "phone",
        "Téléphone",
      );
      if (phoneError) {
        newErrors.phone = phoneError;
        isValid = false;
      }
    }

    // Validation du sujet
    if (!formData.subject || formData.subject.trim().length < 5) {
      newErrors.subject = "Le sujet doit contenir au moins 5 caractères";
      isValid = false;
    }

    // Validation du message
    if (!formData.message || formData.message.trim().length < 10) {
      newErrors.message = "Le message doit contenir au moins 10 caractères";
      isValid = false;
    }

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      phone: true,
      subject: true,
      message: true,
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

    toast.success(
      "Merci pour votre message ! Nous vous répondrons dans les 24 heures.",
    );
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setErrors({});
    setTouched({});
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Appelez-nous",
      details: "+221 77 123 45 67",
      subtitle: "Disponible 24/7 pour les urgences",
    },
    {
      icon: Mail,
      title: "Envoyez-nous un Email",
      details: "support@kaayjob.com",
      subtitle: "Nous répondrons sous 24 heures",
    },
    {
      icon: MapPin,
      title: "Venez nous voir",
      details: "Dakar, Sénégal",
      subtitle: "Lundi - Vendredi, 9h - 18h",
    },
    {
      icon: Clock,
      title: "Heures d'Ouverture",
      details: "Lun - Dim: 24/7",
      subtitle: "Services d'urgence disponibles",
    },
  ];

  const faqs = [
    {
      question: "Comment réserver un service ?",
      answer:
        "Parcourez simplement nos catégories de services, sélectionnez un prestataire, choisissez votre créneau horaire et effectuez le paiement. C'est simple comme bonjour !",
    },
    {
      question: "Tous les prestataires sont-ils vérifiés ?",
      answer:
        "Oui, tous nos prestataires passent par un processus rigoureux de vérification des antécédents pour garantir qualité et sécurité.",
    },
    {
      question: "Que faire si je dois annuler ma réservation ?",
      answer:
        "Vous pouvez annuler votre réservation jusqu'à 2 heures avant l'heure prévue. Les annulations effectuées plus tôt peuvent être éligibles à un remboursement intégral.",
    },
    {
      question: "Comment effectuer les paiements ?",
      answer:
        "Nous acceptons les cartes de crédit/débit, Orange Money, Wave et le paiement à la livraison. Tous les paiements en ligne sont sécurisés avec un cryptage de niveau industriel.",
    },
    {
      question: "Que faire si je ne suis pas satisfait du service ?",
      answer:
        "Nous offrons une garantie de satisfaction à 100%. Si vous n'êtes pas heureux du service, contactez-nous dans les 24 heures et nous résoudrons le problème.",
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="bg-[#000080] text-white py-16 animate-fade-in">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contactez-nous
          </h1>
          <p className="text-xl opacity-90">
            Besoin d'aide ? Nous sommes là pour répondre à vos questions et
            préoccupations.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2 animate-slide-up">
            <Card className="bg-white border-2 border-[#000080]/10 shadow-lg hover:border-[#000080]/30 transition-all">
              <CardHeader className="bg-[#000080]">
                <CardTitle className="text-2xl text-white flex items-center">
                  <MessageCircle className="w-6 h-6 mr-3 text-blue-600" />
                  Envoyez-nous un Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-base">
                        Nom Complet *
                      </Label>
                      <Input
                        id="name"
                        placeholder="Entrez votre nom complet"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        onBlur={() => handleBlur("name")}
                        className={`mt-2 text-base ${errors.name && touched.name ? "border-red-500" : ""}`}
                      />
                      {errors.name && touched.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-base">
                        Adresse Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="exemple@email.com"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        onBlur={() => handleBlur("email")}
                        className={`mt-2 text-base ${errors.email && touched.email ? "border-red-500" : ""}`}
                      />
                      {errors.email && touched.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="text-base">
                        Numéro de Téléphone
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+221771234567"
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
                    <div>
                      <Label htmlFor="subject" className="text-base">
                        Sujet *
                      </Label>
                      <Input
                        id="subject"
                        placeholder="Comment pouvons-nous vous aider ?"
                        value={formData.subject}
                        onChange={(e) =>
                          handleInputChange("subject", e.target.value)
                        }
                        onBlur={() => handleBlur("subject")}
                        className={`mt-2 text-base ${errors.subject && touched.subject ? "border-red-500" : ""}`}
                      />
                      {errors.subject && touched.subject && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.subject}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-base">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Veuillez décrire votre question ou préoccupation en détail..."
                      value={formData.message}
                      onChange={(e) =>
                        handleInputChange("message", e.target.value)
                      }
                      onBlur={() => handleBlur("message")}
                      className={`mt-2 text-base min-h-[120px] ${errors.message && touched.message ? "border-red-500" : ""}`}
                      rows={6}
                    />
                    {errors.message && touched.message && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg"
                  >
                    Envoyer le Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Headphones className="w-6 h-6 mr-3 text-green-600" />
                  Informations de Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {info.title}
                        </h3>
                        <p className="text-blue-600 font-medium">
                          {info.details}
                        </p>
                        <p className="text-sm text-gray-600">{info.subtitle}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Emergency Support */}
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-6 text-center">
                <Phone className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-red-900 mb-2">
                  Support d'Urgence
                </h3>
                <p className="text-red-700 mb-4">
                  Besoin d'aide immédiate ? Notre ligne d'urgence est disponible
                  24/7.
                </p>
                <Button className="bg-red-600 hover:bg-red-700 text-white w-full">
                  Appeler la Ligne d'Urgence
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Questions Fréquemment Posées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {faqs.map((faq, index) => (
                  <div key={index} className="space-y-3">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {faq.question}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-blue-600 text-white border-0">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Prêt à Commencer ?</h2>
              <p className="text-xl opacity-90 mb-8">
                Trouvez des prestataires de confiance dans votre région et
                réservez votre service aujourd'hui.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg"
                  onClick={() => onNavigate("categories")}
                >
                  Parcourir les Services
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg"
                  onClick={() => onNavigate("login")}
                >
                  S'inscrire Maintenant
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

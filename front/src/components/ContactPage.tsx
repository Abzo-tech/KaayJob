import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Phone, Mail, MapPin, Clock, MessageCircle, Headphones } from "lucide-react";
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
    message: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Merci pour votre message ! Nous vous répondrons dans les 24 heures.");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Appelez-nous",
      details: "+33 1 23 45 67 89",
      subtitle: "Disponible 24/7 pour les urgences"
    },
    {
      icon: Mail,
      title: "Envoyez-nous un Email", 
      details: "support@kamwala.com",
      subtitle: "Nous répondrons sous 24 heures"
    },
    {
      icon: MapPin,
      title: "Venez nous voir",
      details: "123 Quartier d'Affaires, Paris",
      subtitle: "Lundi - Vendredi, 9h - 18h"
    },
    {
      icon: Clock,
      title: "Heures d'Ouverture",
      details: "Lun - Dim: 24/7",
      subtitle: "Services d'urgence disponibles"
    }
  ];

  const faqs = [
    {
      question: "Comment réserver un service ?",
      answer: "Parcourez simplement nos catégories de services, sélectionnez un prestataire, choisissez votre créneau horaire et effectuez le paiement. C'est simple comme bonjour !"
    },
    {
      question: "Tous les prestataires sont-ils vérifiés ?",
      answer: "Oui, tous nos prestataires passent par un processus rigoureux de vérification des antécédents pour garantir qualité et sécurité."
    },
    {
      question: "Que faire si je dois annuler ma réservation ?",
      answer: "Vous pouvez annuler votre réservation jusqu'à 2 heures avant l'heure prévue. Les annulations effectuées plus tôt peuvent être éligibles à un remboursement intégral."
    },
    {
      question: "Comment effectuer les paiements ?",
      answer: "Nous acceptons les cartes de crédit/débit, PayPal et le paiement à la livraison. Tous les paiements en ligne sont sécurisés avec un cryptage de niveau industriel."
    },
    {
      question: "Que faire si je ne suis pas satisfait du service ?",
      answer: "Nous offrons une garantie de satisfaction à 100%. Si vous n'êtes pas heureux du service, contactez-nous dans les 24 heures et nous résoudrons le problème."
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#000080] to-[#001a99] text-white py-16 animate-fade-in">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contactez-nous</h1>
          <p className="text-xl opacity-90">
            Besoin d'aide ? Nous sommes là pour répondre à vos questions et préoccupations.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2 animate-slide-up">
            <Card className="bg-white border-2 border-[#000080]/10 shadow-lg hover:border-[#000080]/30 transition-all">
              <CardHeader className="bg-gradient-to-r from-[#000080] to-[#001a99]">
                <CardTitle className="text-2xl text-white flex items-center">
                  <MessageCircle className="w-6 h-6 mr-3 text-blue-600" />
                  Envoyez-nous un Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-base">Nom Complet *</Label>
                      <Input
                        id="name"
                        placeholder="Entrez votre nom complet"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="mt-2 text-base"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-base">Adresse Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Entrez votre email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="mt-2 text-base"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="text-base">Numéro de Téléphone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Entrez votre numéro de téléphone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="mt-2 text-base"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject" className="text-base">Sujet *</Label>
                      <Input
                        id="subject"
                        placeholder="Comment pouvons-nous vous aider ?"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        className="mt-2 text-base"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-base">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Veuillez décrire votre question ou préoccupation en détail..."
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className="mt-2 text-base min-h-[120px]"
                      rows={6}
                    />
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
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{info.title}</h3>
                        <p className="text-blue-600 font-medium">{info.details}</p>
                        <p className="text-sm text-gray-600">{info.subtitle}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Emergency Support */}
            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardContent className="p-6 text-center">
                <Phone className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-red-900 mb-2">Support d'Urgence</h3>
                <p className="text-red-700 mb-4">
                  Besoin d'aide immédiate ? Notre ligne d'urgence est disponible 24/7.
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
              <CardTitle className="text-2xl text-center">Questions Fréquemment Posées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {faqs.map((faq, index) => (
                  <div key={index} className="space-y-3">
                    <h3 className="font-semibold text-lg text-gray-900">{faq.question}</h3>
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-green-600 text-white border-0">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Prêt à Commencer ?</h2>
              <p className="text-xl opacity-90 mb-8">
                Trouvez des prestataires de confiance dans votre région et réservez votre service aujourd'hui.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg"
                  onClick={() => onNavigate('categories')}
                >
                  Parcourir les Services
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg"
                  onClick={() => onNavigate('login')}
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

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  Book,
  Users,
  CreditCard,
  MapPin,
  Star,
  AlertCircle
} from "lucide-react";

interface HelpPageProps {
  onNavigate: (page: string) => void;
}

const helpCategories = [
  {
    icon: Users,
    title: "Pour les clients",
    description: "Réservations, paiements, suivi des services",
    topics: [
      { title: "Comment réserver un service ?", link: "faq" },
      { title: "Modes de paiement acceptés", link: "faq" },
      { title: "Annuler ou modifier une réservation", link: "faq" },
      { title: "Suivre l'état de ma commande", link: "dashboard" },
      { title: "Laisser un avis sur un prestataire", link: "dashboard" }
    ]
  },
  {
    icon: Users,
    title: "Pour les prestataires",
    description: "Gestion du profil, services, revenus",
    topics: [
      { title: "Créer et gérer mon profil", link: "prestataire-profile" },
      { title: "Ajouter et modifier mes services", link: "prestataire-services" },
      { title: "Gérer mes disponibilités", link: "prestataire-profile" },
      { title: "Suivre mes revenus et paiements", link: "prestataire-dashboard" },
      { title: "Répondre aux demandes clients", link: "prestataire-bookings" }
    ]
  },
  {
    icon: CreditCard,
    title: "Paiements et Tarifs",
    description: "Informations sur les paiements et commissions",
    topics: [
      { title: "Comment sont calculés les prix ?", link: "faq" },
      { title: "Quand suis-je payé ?", link: "faq" },
      { title: "Frais et commissions de KaayJob", link: "faq" },
      { title: "Problèmes de paiement", link: "contact" }
    ]
  },
  {
    icon: AlertCircle,
    title: "Problèmes et Support",
    description: "Signaler un problème ou obtenir de l'aide",
    topics: [
      { title: "Service non conforme", link: "contact" },
      { title: "Prestataire en retard", link: "contact" },
      { title: "Problème de paiement", link: "contact" },
      { title: "Contacter le support", link: "contact" }
    ]
  }
];

const quickActions = [
  {
    icon: MessageCircle,
    title: "Chat en ligne",
    description: "Discutez avec notre support",
    action: "contact",
    available: true
  },
  {
    icon: Phone,
    title: "Appeler le support",
    description: "+221 77 123 45 67",
    action: "tel:+221771234567",
    available: true
  },
  {
    icon: Mail,
    title: "Email support",
    description: "support@kaayjob.com",
    action: "mailto:support@kaayjob.com",
    available: true
  },
  {
    icon: Book,
    title: "Consulter la FAQ",
    description: "Questions fréquentes",
    action: "faq",
    available: true
  }
];

export function HelpPage({ onNavigate }: HelpPageProps) {
  const handleAction = (action: string) => {
    if (action.startsWith('tel:') || action.startsWith('mailto:')) {
      window.open(action);
    } else {
      onNavigate(action);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="bg-[#000080] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <HelpCircle className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Centre d'Aide KaayJob
          </h1>
          <p className="text-xl opacity-90 mb-8">
            Trouvez rapidement des réponses à vos questions
          </p>

          {/* Quick Search */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher dans l'aide..."
                className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <Button
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#FFF4EA] text-[#000080] hover:bg-white"
              >
                Rechercher
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card
                key={index}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  action.available
                    ? 'hover:scale-105 border-0 shadow-md'
                    : 'opacity-50 cursor-not-allowed'
                }`}
                onClick={() => action.available && handleAction(action.action)}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-[#000080] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-[#000080] mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                  {action.available && (
                    <div className="mt-3 text-xs text-green-600 font-medium">
                      ✓ Disponible maintenant
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Help Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#000080] text-center mb-12">
            Besoin d'aide ? Parcourez nos rubriques
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {helpCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card key={index} className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-[#000080]">
                      <div className="w-10 h-10 bg-[#000080] rounded-full flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      {category.title}
                    </CardTitle>
                    <p className="text-gray-600 mt-2">{category.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {category.topics.map((topic, topicIndex) => (
                        <li key={topicIndex}>
                          <button
                            onClick={() => onNavigate(topic.link)}
                            className="text-left w-full p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-gray-700 group-hover:text-[#000080] transition-colors">
                                {topic.title}
                              </span>
                              <span className="text-gray-400 group-hover:text-[#000080] transition-colors">
                                →
                              </span>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Popular Articles */}
        <Card className="border-0 shadow-lg mb-16">
          <CardHeader>
            <CardTitle className="text-2xl text-[#000080]">Articles populaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 border border-gray-200 rounded-lg hover:border-[#000080] transition-colors cursor-pointer">
                <h4 className="font-semibold text-[#000080] mb-2">Comment choisir un prestataire ?</h4>
                <p className="text-sm text-gray-600 mb-3">Conseils pour bien sélectionner votre artisan</p>
                <Button variant="link" className="p-0 h-auto text-[#000080]" onClick={() => onNavigate('faq')}>
                  Lire l'article →
                </Button>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg hover:border-[#000080] transition-colors cursor-pointer">
                <h4 className="font-semibold text-[#000080] mb-2">Paiements sécurisés</h4>
                <p className="text-sm text-gray-600 mb-3">Comment vos paiements sont protégés</p>
                <Button variant="link" className="p-0 h-auto text-[#000080]" onClick={() => onNavigate('faq')}>
                  Lire l'article →
                </Button>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg hover:border-[#000080] transition-colors cursor-pointer">
                <h4 className="font-semibold text-[#000080] mb-2">Devenir prestataire</h4>
                <p className="text-sm text-gray-600 mb-3">Les étapes pour rejoindre KaayJob</p>
                <Button variant="link" className="p-0 h-auto text-[#000080]" onClick={() => onNavigate('partner')}>
                  Lire l'article →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-[#000080] to-blue-600 text-white">
          <CardContent className="p-8 text-center">
            <MessageCircle className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">
              Vous n'avez pas trouvé de réponse ?
            </h3>
            <p className="text-lg opacity-90 mb-6">
              Notre équipe de support est là pour vous aider 24h/24 et 7j/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => onNavigate("contact")}
                className="bg-white text-[#000080] hover:bg-gray-100 px-6 py-3"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Nous contacter
              </Button>
              <Button
                onClick={() => window.open("tel:+221771234567")}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#000080] px-6 py-3"
              >
                <Phone className="w-4 h-4 mr-2" />
                Appeler maintenant
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
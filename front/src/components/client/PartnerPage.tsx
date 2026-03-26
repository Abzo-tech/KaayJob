import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  CheckCircle,
  Star,
  Users,
  TrendingUp,
  Shield,
  Clock,
  DollarSign,
  ArrowRight,
  Award,
  Calendar,
  Smartphone,
} from "lucide-react";

interface PartnerPageProps {
  onNavigate: (page: string) => void;
}

const benefits = [
  {
    icon: DollarSign,
    title: "Revenus supplémentaires",
    description: "Augmentez vos revenus en travaillant selon vos disponibilités",
  },
  {
    icon: Users,
    title: "Plus de clients",
    description: "Accédez à une base de clients plus large et diversifiée",
  },
  {
    icon: Calendar,
    title: "Gestion simplifiée",
    description: "Outils de planification et gestion des rendez-vous automatisés",
  },
  {
    icon: Shield,
    title: "Paiements sécurisés",
    description: "Recevez vos paiements de façon sécurisée et ponctuelle",
  },
  {
    icon: TrendingUp,
    title: "Visibilité accrue",
    description: "Soyez visible auprès de milliers de clients potentiels",
  },
  {
    icon: Award,
    title: "Badge de confiance",
    description: "Obtenez un badge de prestataire vérifié pour plus de crédibilité",
  },
];

const steps = [
  {
    step: "1",
    title: "Inscription",
    description: "Créez votre compte prestataire en quelques minutes",
  },
  {
    step: "2",
    title: "Vérification",
    description: "Soumettez vos documents pour vérification (24-48h)",
  },
  {
    step: "3",
    title: "Configuration",
    description: "Renseignez vos services, tarifs et disponibilités",
  },
  {
    step: "4",
    title: "Premiers clients",
    description: "Commencez à recevoir des demandes de service",
  },
];

const testimonials = [
  {
    name: "Mamadou Ba",
    service: "Électricien",
    quote: "KaayJob m'a permis de doubler mes revenus. La plateforme est sérieuse et les clients sont exigeants, ce qui valorise mon travail.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
  },
  {
    name: "Fatou Sow",
    service: "Ménage & Repassage",
    quote: "Je gère mon planning comme je veux et les paiements arrivent toujours à temps. C'est parfait pour une mère de famille !",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face",
  },
  {
    name: "Cheikh Ndiaye",
    service: "Plombier",
    quote: "La plateforme m'a apporté une clientèle régulière. Le système de notation motive à bien travailler.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
  },
];

const pricingPlans = [
  {
    name: "Gratuit",
    price: "0",
    period: "FCFA/mois",
    description: "Parfait pour commencer",
    features: [
      "Profil prestataire gratuit",
      "Jusqu'à 5 services par mois",
      "Support par email",
      "Visibilité standard",
    ],
    popular: false,
  },
  {
    name: "Premium",
    price: "9,900",
    period: "FCFA/mois",
    description: "Pour les professionnels actifs",
    features: [
      "Services illimités",
      "Badge VIP sur le profil",
      "Visibilité prioritaire",
      "Support prioritaire",
      "Statistiques détaillées",
      "Rappels de rendez-vous",
    ],
    popular: true,
  },
  {
    name: "Pro",
    price: "24,900",
    period: "FCFA/mois",
    description: "Pour les experts reconnus",
    features: [
      "Tout Premium inclus",
      "Publication en premier",
      "Badge Pro exclusif",
      "Formation gratuite",
      "Gestion d'équipe",
      "API personnalisée",
      "Support téléphonique",
    ],
    popular: false,
  },
];

export function PartnerPage({ onNavigate }: PartnerPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#000080] to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Devenez Partenaire KaayJob
              </h1>
              <p className="text-xl md:text-2xl opacity-90 mb-8 leading-relaxed">
                Rejoignez le réseau de prestataires de confiance au Sénégal et développez votre activité.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => onNavigate("register")}
                  className="bg-[#FFF4EA] hover:bg-white text-[#000080] font-bold px-8 py-4 text-lg"
                >
                  Commencer maintenant
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onNavigate("about")}
                  className="border-white text-white hover:bg-white hover:text-[#000080] px-8 py-4 text-lg"
                >
                  En savoir plus
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&h=400&fit=crop"
                alt="Prestataire KaayJob"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-[#FFF4EA] rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="font-bold text-[#000080]">4.8/5</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Note moyenne prestataires</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#000080] mb-4">
              Pourquoi rejoindre KaayJob ?
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez tous les avantages de notre plateforme
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-[#000080] rounded-full flex items-center justify-center mb-6">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-[#000080]">{benefit.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#000080] mb-4">
              Comment devenir prestataire ?
            </h2>
            <p className="text-xl text-gray-600">
              Quatre étapes simples pour rejoindre notre communauté
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-[#000080] rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#000080]">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
                {index < steps.length - 1 && (
                  <ArrowRight className="w-6 h-6 text-gray-400 mx-auto mt-4 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#000080] mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez les témoignages de nos prestataires partenaires
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-[#000080]">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.service}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 italic leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tarifs */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#000080] mb-4">
              Choisissez votre formule
            </h2>
            <p className="text-xl text-gray-600">
              Des offres adaptées à votre activité et vos ambitions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative border-0 shadow-lg ${plan.popular ? 'ring-2 ring-[#000080] scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-[#000080] text-white px-4 py-1">Le plus populaire</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl text-[#000080]">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-[#000080]">{plan.price}</span>
                    <span className="text-gray-600 ml-1">{plan.period}</span>
                  </div>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${plan.popular ? 'bg-[#000080] hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-800'} text-white py-3`}
                    onClick={() => onNavigate("register")}
                  >
                    Commencer avec {plan.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-[#000080] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à développer votre activité ?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Rejoignez dès aujourd'hui la communauté des prestataires KaayJob et boostez vos revenus.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => onNavigate("register")}
              className="bg-[#FFF4EA] hover:bg-white text-[#000080] font-bold px-8 py-4 text-lg"
            >
              <Smartphone className="w-5 h-5 mr-2" />
              Créer mon compte prestataire
            </Button>
            <Button
              onClick={() => onNavigate("contact")}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-[#000080] px-8 py-4 text-lg"
            >
              <Users className="w-5 h-5 mr-2" />
              Nous contacter
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
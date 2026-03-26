import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Search,
  MessageCircle,
  Phone,
} from "lucide-react";
import { Input } from "../ui/input";

interface FAQPageProps {
  onNavigate: (page: string) => void;
}

const faqData = [
  {
    category: "Général",
    questions: [
      {
        question: "Qu'est-ce que KaayJob ?",
        answer: "KaayJob est une plateforme digitale qui met en relation des clients avec des prestataires de services qualifiés au Sénégal. Nous proposons une large gamme de services allant de la plomberie à l'électricité, en passant par le ménage, la réparation automobile, et bien plus encore."
      },
      {
        question: "Comment fonctionne KaayJob ?",
        answer: "C'est simple : vous recherchez le service dont vous avez besoin, vous choisissez un prestataire vérifié, vous réservez en ligne, et le prestataire se déplace à votre domicile ou lieu de travail pour effectuer le service. Tout se passe en quelques clics !"
      },
      {
        question: "KaayJob est-il disponible partout au Sénégal ?",
        answer: "Oui, KaayJob est disponible dans toutes les régions du Sénégal. Notre réseau de prestataires couvre Dakar, les autres régions, et nous nous étendons progressivement pour offrir nos services dans tout le pays."
      }
    ]
  },
  {
    category: "Pour les clients",
    questions: [
      {
        question: "Comment réserver un service ?",
        answer: "1. Recherchez le service dont vous avez besoin\n2. Comparez les prestataires selon leurs tarifs et avis\n3. Réservez en ligne en choisissant date et heure\n4. Confirmez votre réservation\n5. Recevez le prestataire à l'heure convenue"
      },
      {
        question: "Puis-je annuler ou modifier ma réservation ?",
        answer: "Oui, vous pouvez annuler ou modifier votre réservation jusqu'à 24h avant le rendez-vous prévu. Au-delà de ce délai, des frais d'annulation peuvent s'appliquer selon la politique du prestataire."
      },
      {
        question: "Comment payer pour un service ?",
        answer: "Nous acceptons plusieurs modes de paiement : carte bancaire, mobile money (Orange Money, Wave, etc.), et paiement à la livraison pour certains services. Le paiement est sécurisé et ne vous sera débité qu'après la réalisation du service."
      },
      {
        question: "Que faire si le prestataire n'arrive pas ?",
        answer: "Si le prestataire ne se présente pas à l'heure convenue, contactez immédiatement notre service client. Nous trouverons un remplaçant ou vous rembourserons intégralement."
      }
    ]
  },
  {
    category: "Pour les prestataires",
    questions: [
      {
        question: "Comment devenir prestataire sur KaayJob ?",
        answer: "Pour devenir prestataire :\n1. Créez votre compte professionnel\n2. Renseignez vos compétences et spécialités\n3. Ajoutez vos certifications et références\n4. Définissez vos tarifs et disponibilités\n5. Soumettez votre candidature pour vérification\nNotre équipe validera votre profil sous 48h."
      },
      {
        question: "Quels sont les avantages de rejoindre KaayJob ?",
        answer: "En rejoignant KaayJob, vous bénéficiez de :\n- Une visibilité accrue auprès de milliers de clients\n- Des réservations simplifiées\n- Des paiements sécurisés et rapides\n- Un support technique et commercial\n- Des outils de gestion de planning"
      },
      {
        question: "Comment fixer mes tarifs ?",
        answer: "Vous êtes libre de fixer vos propres tarifs selon votre expérience et la complexité des services. Nous vous recommandons de rester compétitif tout en valorisant votre expertise. Vous pouvez modifier vos tarifs à tout moment depuis votre tableau de bord."
      },
      {
        question: "Comment sont versés mes paiements ?",
        answer: "Vos paiements sont versés automatiquement sur votre compte bancaire ou mobile money sous 24-48h après la réalisation du service et la confirmation du client. Nous prenons en charge les frais de transaction."
      }
    ]
  },
  {
    category: "Sécurité et qualité",
    questions: [
      {
        question: "Comment KaayJob garantit-il la qualité des services ?",
        answer: "Tous nos prestataires sont vérifiés : identité, compétences, références, et assurances. Nous recueillons les avis clients après chaque service et suspendons les comptes avec de mauvaises évaluations. De plus, tous nos prestataires sont assurés."
      },
      {
        question: "Que faire en cas de problème avec un service ?",
        answer: "Si vous n'êtes pas satisfait du service :\n1. Contactez notre service client dans les 24h\n2. Expliquez le problème rencontré\n3. Nous trouverons une solution (remboursement, nouveau service, etc.)\nNotre priorité est votre satisfaction."
      },
      {
        question: "KaayJob est-il sécurisé ?",
        answer: "Oui, la sécurité est notre priorité :\n- Chiffrement SSL pour toutes les transactions\n- Vérification des identités\n- Système d'avis et notation\n- Assurance responsabilité civile pour tous les prestataires\n- Support client disponible 24/7"
      }
    ]
  }
];

export function FAQPage({ onNavigate }: FAQPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const filteredFAQs = faqData
    .filter(category =>
      selectedCategory === "all" || category.category === selectedCategory
    )
    .map(category => ({
      ...category,
      questions: category.questions.filter(q =>
        searchTerm === "" ||
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }))
    .filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="bg-[#000080] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <HelpCircle className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Questions Fréquentes
          </h1>
          <p className="text-xl opacity-90 mb-8">
            Trouvez rapidement les réponses à vos questions
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Rechercher une question..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white focus:text-gray-900"
            />
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
            className="rounded-full"
          >
            Toutes les catégories
          </Button>
          {faqData.map((category) => (
            <Button
              key={category.category}
              variant={selectedCategory === category.category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.category)}
              className="rounded-full"
            >
              {category.category}
            </Button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-6">
          {filteredFAQs.map((category) => (
            <div key={category.category}>
              <h2 className="text-2xl font-bold text-[#000080] mb-4">
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.questions.map((faq, index) => {
                  const itemId = `${category.category}-${index}`;
                  const isExpanded = expandedItems.has(itemId);

                  return (
                    <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                      <CardHeader
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => toggleExpanded(itemId)}
                      >
                        <CardTitle className="flex items-center justify-between text-left">
                          <span className="pr-4">{faq.question}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                        </CardTitle>
                      </CardHeader>
                      {isExpanded && (
                        <CardContent className="pt-0">
                          <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {faq.answer}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-16">
            <HelpCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Aucune question trouvée
            </h3>
            <p className="text-gray-500">
              Essayez de modifier vos termes de recherche ou sélectionnez une autre catégorie.
            </p>
          </div>
        )}

        {/* Contact Support */}
        <Card className="mt-16 bg-gradient-to-r from-[#000080] to-blue-600 text-white border-0">
          <CardContent className="p-8 text-center">
            <MessageCircle className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">
              Vous n'avez pas trouvé votre réponse ?
            </h3>
            <p className="text-lg opacity-90 mb-6">
              Notre équipe de support est là pour vous aider
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
                variant="outline"
                onClick={() => window.open("tel:+221771234567")}
                className="border-white text-white hover:bg-white hover:text-[#000080] px-6 py-3"
              >
                <Phone className="w-4 h-4 mr-2" />
                Appeler le support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
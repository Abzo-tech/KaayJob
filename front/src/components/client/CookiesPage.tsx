import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { Cookie, Settings, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface CookiesPageProps {
  onNavigate: (page: string) => void;
}

export function CookiesPage({ onNavigate }: CookiesPageProps) {
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true, // Toujours activé, ne peut pas être désactivé
    analytics: localStorage.getItem('cookie-analytics') === 'true',
    marketing: localStorage.getItem('cookie-marketing') === 'true',
    functional: localStorage.getItem('cookie-functional') === 'true',
  });

  const savePreferences = () => {
    localStorage.setItem('cookie-analytics', cookiePreferences.analytics.toString());
    localStorage.setItem('cookie-marketing', cookiePreferences.marketing.toString());
    localStorage.setItem('cookie-functional', cookiePreferences.functional.toString());
    toast.success("Préférences de cookies sauvegardées");
  };

  const acceptAll = () => {
    setCookiePreferences({
      essential: true,
      analytics: true,
      marketing: true,
      functional: true,
    });
    localStorage.setItem('cookie-analytics', 'true');
    localStorage.setItem('cookie-marketing', 'true');
    localStorage.setItem('cookie-functional', 'true');
    toast.success("Tous les cookies acceptés");
  };

  const rejectAll = () => {
    setCookiePreferences({
      essential: true,
      analytics: false,
      marketing: false,
      functional: false,
    });
    localStorage.setItem('cookie-analytics', 'false');
    localStorage.setItem('cookie-marketing', 'false');
    localStorage.setItem('cookie-functional', 'false');
    toast.success("Seuls les cookies essentiels conservés");
  };

  const cookieTypes = [
    {
      id: 'essential',
      title: 'Cookies Essentiels',
      description: 'Ces cookies sont nécessaires au fonctionnement de la plateforme KaayJob.',
      required: true,
      purposes: [
        'Authentification et sécurité du compte',
        'Navigation et fonctionnalités de base',
        'Prévention de la fraude',
        'Rappel de vos préférences de cookies'
      ],
      examples: ['Session cookies', 'CSRF tokens', 'Cookies de sécurité']
    },
    {
      id: 'analytics',
      title: 'Cookies Analytiques',
      description: 'Ces cookies nous aident à comprendre comment vous utilisez notre plateforme.',
      required: false,
      purposes: [
        'Analyse du trafic et des performances',
        'Amélioration de l\'expérience utilisateur',
        'Détection des erreurs et problèmes techniques',
        'Statistiques d\'utilisation anonymes'
      ],
      examples: ['Google Analytics', 'Cookies de performance']
    },
    {
      id: 'functional',
      title: 'Cookies Fonctionnels',
      description: 'Ces cookies améliorent les fonctionnalités et la personnalisation de nos services.',
      required: false,
      purposes: [
        'Mémorisation de vos préférences',
        'Personnalisation du contenu',
        'Sauvegarde de votre panier ou réservations',
        'Fonctionnalités sociales intégrées'
      ],
      examples: ['Cookies de langue', 'Cookies de thème', 'Cookies de session étendue']
    },
    {
      id: 'marketing',
      title: 'Cookies Marketing',
      description: 'Ces cookies sont utilisés pour vous proposer des publicités pertinentes.',
      required: false,
      purposes: [
        'Publicités personnalisées selon vos intérêts',
        'Suivi des conversions publicitaires',
        'Remarketing et ciblage comportemental',
        'Mesure de l\'efficacité des campagnes'
      ],
      examples: ['Facebook Pixel', 'Google Ads', 'Cookies de partenaires marketing']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="bg-[#000080] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Cookie className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Politique relative aux Cookies
          </h1>
          <p className="text-lg opacity-90">
            Comment nous utilisons les cookies pour améliorer votre expérience
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Quick Actions */}
        <Card className="mb-8 border-[#000080] bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-[#000080] mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Gérez vos préférences de cookies
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={acceptAll} className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Accepter tout
              </Button>
              <Button onClick={rejectAll} variant="outline">
                <XCircle className="w-4 h-4 mr-2" />
                Refuser les optionnels
              </Button>
              <Button onClick={savePreferences} className="bg-[#000080] hover:bg-blue-700">
                Sauvegarder mes choix
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Introduction */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-[#000080] mb-6">Qu'est-ce qu'un cookie ?</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Les cookies sont de petits fichiers texte stockés sur votre ordinateur ou appareil mobile
              lorsque vous visitez un site web. Ils permettent au site de se souvenir de vos actions et
              préférences (comme votre connexion, votre langue, la taille de police et d'autres préférences d'affichage)
              pendant un certain temps, afin que vous n'ayez pas à les saisir à nouveau à chaque visite.
            </p>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Important :</strong> Certains cookies sont essentiels au fonctionnement de KaayJob
                et ne peuvent pas être désactivés. Les autres catégories sont optionnelles et vous pouvez
                les gérer selon vos préférences.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cookie Types */}
        <div className="space-y-6 mb-8">
          {cookieTypes.map((cookieType) => (
            <Card key={cookieType.id} className="shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-xl text-[#000080]">{cookieType.title}</CardTitle>
                    {cookieType.required && (
                      <Badge className="bg-red-100 text-red-800">Requis</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {cookieType.required ? (
                      <Badge className="bg-green-100 text-green-800">Toujours actif</Badge>
                    ) : (
                      <Switch
                        checked={cookiePreferences[cookieType.id as keyof typeof cookiePreferences]}
                        onCheckedChange={(checked) =>
                          setCookiePreferences(prev => ({
                            ...prev,
                            [cookieType.id]: checked
                          }))
                        }
                      />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{cookieType.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Finalités</h4>
                    <ul className="space-y-2">
                      {cookieType.purposes.map((purpose, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {purpose}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Exemples</h4>
                    <ul className="space-y-2">
                      {cookieType.examples.map((example, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <Cookie className="w-3 h-3 text-gray-400" />
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Durée de conservation
                      </p>
                      <p className="text-sm text-gray-600">
                        {cookieType.id === 'essential' ? 'Session ou 1 an maximum' :
                         cookieType.id === 'analytics' ? '13 mois' :
                         cookieType.id === 'functional' ? '1 an' : '13 mois'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Statut
                      </p>
                      <Badge
                        className={
                          cookieType.required || cookiePreferences[cookieType.id as keyof typeof cookiePreferences]
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }
                      >
                        {cookieType.required || cookiePreferences[cookieType.id as keyof typeof cookiePreferences]
                          ? 'Activé' : 'Désactivé'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Legal Information */}
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-[#000080] mb-6">Informations Légales</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Base Légale</h3>
                <p className="text-gray-700">
                  Conformément au RGPD et à la loi sénégalaise sur les données personnelles,
                  nous utilisons les cookies sur les bases légales suivantes :
                </p>
                <ul className="mt-2 space-y-1 text-gray-600">
                  <li>• <strong>Consentement :</strong> Pour les cookies non essentiels</li>
                  <li>• <strong>Intérêt légitime :</strong> Pour les cookies analytiques anonymisés</li>
                  <li>• <strong>Exécution du contrat :</strong> Pour les cookies essentiels</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Vos Droits</h3>
                <p className="text-gray-700 mb-3">
                  Vous pouvez à tout moment modifier vos préférences de cookies ou retirer votre consentement :
                </p>
                <ul className="space-y-1 text-gray-600">
                  <li>• Via les paramètres de votre navigateur</li>
                  <li>• En utilisant notre outil de gestion des cookies ci-dessus</li>
                  <li>• En nous contactant à privacy@kaayjob.com</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Partage avec des Tiers</h3>
                <p className="text-gray-700">
                  Nous pouvons partager des informations issues des cookies avec des partenaires de confiance
                  (Google Analytics, Facebook, etc.) uniquement avec votre consentement. Ces partenaires
                  sont contractuellement tenus de respecter la confidentialité de vos données.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Mises à Jour</h3>
                <p className="text-gray-700">
                  Cette politique peut être mise à jour pour refléter les changements dans nos pratiques
                  ou la législation applicable. Nous vous informerons des modifications importantes.
                </p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-2">Contact</h4>
              <p className="text-sm text-gray-600 mb-3">
                Pour toute question concernant l'utilisation des cookies sur KaayJob :
              </p>
              <p className="text-sm text-gray-600">
                Email : <a href="mailto:privacy@kaayjob.com" className="text-[#000080] hover:underline">privacy@kaayjob.com</a><br />
                Téléphone : +221 77 123 45 67<br />
                Délégué à la Protection des Données : dpo@kaayjob.com
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Preferences Reminder */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            N'oubliez pas de sauvegarder vos préférences pour qu'elles soient prises en compte.
          </p>
          <Button onClick={savePreferences} size="lg" className="bg-[#000080] hover:bg-blue-700">
            Sauvegarder mes préférences
          </Button>
        </div>
      </div>
    </div>
  );
}
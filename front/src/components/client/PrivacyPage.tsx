import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Shield, Eye, Lock, Users } from "lucide-react";

interface PrivacyPageProps {
  onNavigate: (page: string) => void;
}

export function PrivacyPage({ onNavigate }: PrivacyPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="bg-[#000080] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Politique de Confidentialité
          </h1>
          <p className="text-lg opacity-90">
            Comment nous protégeons vos données personnelles
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <Card className="shadow-lg">
          <CardContent className="p-8 prose prose-lg max-w-none">
            <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-800 mb-2">Notre engagement</h3>
                  <p className="text-blue-700 text-sm">
                    Chez KaayJob, la protection de vos données personnelles est notre priorité absolue.
                    Cette politique explique comment nous collectons, utilisons et protégeons vos informations.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-[#000080] mb-6">1. Responsable du Traitement</h2>
            <p className="mb-6">
              KaayJob SARL<br />
              Point E, Avenue Cheikh Anta Diop<br />
              Dakar, Sénégal<br />
              Email : privacy@kaayjob.com<br />
              Téléphone : +221 77 123 45 67
            </p>

            <h2 className="text-2xl font-bold text-[#000080] mb-6">2. Données Collectées</h2>
            <h3 className="text-xl font-semibold mb-4">2.1 Données fournies directement</h3>
            <ul className="mb-6 space-y-2">
              <li>Informations d'identification (nom, prénom, email, téléphone)</li>
              <li>Adresse et informations de localisation</li>
              <li>Informations de paiement (cryptées et sécurisées)</li>
              <li>Préférences et paramètres du compte</li>
              <li>Communications avec notre service client</li>
            </ul>

            <h3 className="text-xl font-semibold mb-4">2.2 Données collectées automatiquement</h3>
            <ul className="mb-6 space-y-2">
              <li>Adresse IP et informations de connexion</li>
              <li>Type d'appareil et navigateur utilisé</li>
              <li>Pages visitées et durée de navigation</li>
              <li>Données de géolocalisation (avec votre consentement)</li>
              <li>Cookies et technologies similaires</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#000080] mb-6">3. Finalités du Traitement</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex gap-3">
                <Users className="w-6 h-6 text-[#000080] mt-1" />
                <div>
                  <h4 className="font-semibold mb-2">Fourniture du Service</h4>
                  <p className="text-sm text-gray-600">Création et gestion de votre compte, mise en relation avec les prestataires</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Eye className="w-6 h-6 text-[#000080] mt-1" />
                <div>
                  <h4 className="font-semibold mb-2">Amélioration du Service</h4>
                  <p className="text-sm text-gray-600">Analyse des usages pour optimiser notre plateforme</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Lock className="w-6 h-6 text-[#000080] mt-1" />
                <div>
                  <h4 className="font-semibold mb-2">Sécurité</h4>
                  <p className="text-sm text-gray-600">Prévention de la fraude et protection de votre compte</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Shield className="w-6 h-6 text-[#000080] mt-1" />
                <div>
                  <h4 className="font-semibold mb-2">Conformité Légale</h4>
                  <p className="text-sm text-gray-600">Respect des obligations légales et réglementaires</p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-[#000080] mb-6">4. Base Légale du Traitement</h2>
            <p className="mb-6">
              Nous traitons vos données personnelles sur les bases légales suivantes :
            </p>
            <ul className="mb-6 space-y-2">
              <li><strong>Exécution du contrat :</strong> Pour fournir les services demandés</li>
              <li><strong>Consentement :</strong> Pour les communications marketing et la géolocalisation</li>
              <li><strong>Intérêt légitime :</strong> Pour améliorer nos services et assurer la sécurité</li>
              <li><strong>Obligation légale :</strong> Pour respecter la réglementation applicable</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#000080] mb-6">5. Partage des Données</h2>
            <p className="mb-4">
              Nous ne vendons jamais vos données personnelles à des tiers. Nous les partageons uniquement dans les cas suivants :
            </p>
            <ul className="mb-6 space-y-2">
              <li><strong>Prestataires de services :</strong> Pour la réalisation des prestations commandées</li>
              <li><strong>Partenaires techniques :</strong> Prestataires de paiement, hébergement, analyse (sous contrat)</li>
              <li><strong>Autorités légales :</strong> Sur réquisition judiciaire ou pour prévenir des activités illégales</li>
              <li><strong>Votre consentement :</strong> Uniquement avec votre accord explicite</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#000080] mb-6">6. Sécurité des Données</h2>
            <p className="mb-6">
              Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées
              pour protéger vos données personnelles contre tout accès non autorisé, altération, divulgation
              ou destruction :
            </p>
            <ul className="mb-6 space-y-2">
              <li>Chiffrement SSL/TLS pour toutes les transmissions</li>
              <li>Stockage sécurisé avec chiffrement des données sensibles</li>
              <li>Contrôles d'accès stricts et authentification multi-facteurs</li>
              <li>Audits de sécurité réguliers et tests de pénétration</li>
              <li>Formation du personnel aux bonnes pratiques de sécurité</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#000080] mb-6">7. Durée de Conservation</h2>
            <p className="mb-6">
              Nous conservons vos données personnelles uniquement pendant la durée nécessaire aux finalités
              pour lesquelles elles ont été collectées :
            </p>
            <ul className="mb-6 space-y-2">
              <li><strong>Données de compte :</strong> Pendant la durée d'utilisation du service + 3 ans après suppression</li>
              <li><strong>Données de paiement :</strong> 13 mois (norme PCI DSS)</li>
              <li><strong>Données de géolocalisation :</strong> Supprimées après utilisation ou retrait du consentement</li>
              <li><strong>Données d'analyse :</strong> 25 mois maximum</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#000080] mb-6">8. Vos Droits</h2>
            <p className="mb-4">
              Conformément au RGPD et aux lois sur la protection des données, vous disposez des droits suivants :
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Droit d'accès</h4>
                <p className="text-sm text-gray-600">Connaître les données personnelles que nous détenons sur vous</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Droit de rectification</h4>
                <p className="text-sm text-gray-600">Corriger les données inexactes ou incomplètes</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Droit à l'effacement</h4>
                <p className="text-sm text-gray-600">Supprimer vos données dans certaines conditions</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Droit à la portabilité</h4>
                <p className="text-sm text-gray-600">Récupérer vos données dans un format exploitable</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Droit d'opposition</h4>
                <p className="text-sm text-gray-600">Refuser certains traitements de vos données</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Droit à la limitation</h4>
                <p className="text-sm text-gray-600">Limiter l'utilisation de vos données</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-[#000080] mb-6">9. Cookies et Technologies Similaires</h2>
            <p className="mb-6">
              Nous utilisons des cookies et technologies similaires pour améliorer votre expérience.
              Pour plus d'informations, consultez notre politique relative aux cookies.
            </p>

            <h2 className="text-2xl font-bold text-[#000080] mb-6">10. Contact et Réclamations</h2>
            <p className="mb-4">
              Pour exercer vos droits ou poser des questions sur notre politique de confidentialité :
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <p className="font-semibold mb-2">Délégué à la Protection des Données</p>
              <p className="mb-1">Email : dpo@kaayjob.com</p>
              <p className="mb-1">Téléphone : +221 77 123 45 67</p>
              <p className="mb-1">Adresse : Point E, Avenue Cheikh Anta Diop, Dakar, Sénégal</p>
            </div>
            <p className="mb-6">
              Vous avez également le droit d'introduire une réclamation auprès de la Commission
              de Protection des Données Personnelles du Sénégal (CDP) si vous estimez que vos droits
              n'ont pas été respectés.
            </p>

            <h2 className="text-2xl font-bold text-[#000080] mb-6">11. Modifications</h2>
            <p className="mb-6">
              Cette politique peut être mise à jour pour refléter les changements dans nos pratiques
              ou la législation applicable. Nous vous informerons de toute modification importante
              par email ou via une notification sur la plateforme.
            </p>

            <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 text-center mb-4">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
              </p>
              <p className="text-sm text-gray-600 text-center">
                Pour toute question, contactez notre DPO à{" "}
                <a href="mailto:dpo@kaayjob.com" className="text-[#000080] hover:underline">
                  dpo@kaayjob.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
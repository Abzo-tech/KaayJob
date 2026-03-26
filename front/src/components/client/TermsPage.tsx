import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FileText } from "lucide-react";

interface TermsPageProps {
  onNavigate: (page: string) => void;
}

export function TermsPage({ onNavigate }: TermsPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="bg-[#000080] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Conditions Générales d'Utilisation
          </h1>
          <p className="text-lg opacity-90">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <Card className="shadow-lg">
          <CardContent className="p-8 prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-[#000080] mb-6">1. Objet</h2>
            <p className="mb-6">
              Les présentes conditions générales d'utilisation (CGU) régissent l'utilisation de la plateforme KaayJob,
              accessible via le site web et les applications mobiles. En utilisant KaayJob, vous acceptez pleinement
              et sans réserve les présentes CGU.
            </p>

            <h2 className="text-2xl font-bold text-[#000080] mb-6">2. Définitions</h2>
            <ul className="mb-6 space-y-2">
              <li><strong>Plateforme :</strong> Le site web et les applications KaayJob</li>
              <li><strong>Client :</strong> Toute personne physique ou morale utilisant la plateforme pour réserver des services</li>
              <li><strong>Prestataire :</strong> Tout professionnel inscrit sur la plateforme pour proposer ses services</li>
              <li><strong>Service :</strong> Prestation proposée par un prestataire via la plateforme</li>
              <li><strong>Réservation :</strong> Demande de service effectuée par un client auprès d'un prestataire</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#000080] mb-6">3. Inscription et Compte Utilisateur</h2>
            <h3 className="text-xl font-semibold mb-4">3.1 Inscription</h3>
            <p className="mb-4">
              L'inscription sur la plateforme est gratuite. L'utilisateur doit fournir des informations exactes,
              complètes et à jour. Toute inscription avec des informations erronées peut entraîner la suspension du compte.
            </p>

            <h3 className="text-xl font-semibold mb-4">3.2 Responsabilités</h3>
            <p className="mb-4">
              L'utilisateur est responsable de la confidentialité de ses identifiants de connexion.
              Toute utilisation de son compte par un tiers est de sa responsabilité.
            </p>

            <h2 className="text-2xl font-bold text-[#000080] mb-6">4. Services Proposés</h2>
            <h3 className="text-xl font-semibold mb-4">4.1 Description des Services</h3>
            <p className="mb-4">
              KaayJob met en relation des clients et des prestataires de services. La plateforme propose
              des services dans diverses catégories : plomberie, électricité, ménage, réparation automobile, etc.
            </p>

            <h3 className="text-xl font-semibold mb-4">4.2 Vérification des Prestataires</h3>
            <p className="mb-4">
              Tous les prestataires sont soumis à un processus de vérification incluant :
              contrôle d'identité, vérification des compétences, consultation des références.
            </p>

            <h2 className="text-2xl font-bold text-[#000080] mb-6">5. Réservation et Paiement</h2>
            <h3 className="text-xl font-semibold mb-4">5.1 Réservation</h3>
            <p className="mb-4">
              Le client peut réserver un service directement via la plateforme. La réservation est confirmée
              par le prestataire sous 24 heures. Le client reçoit une confirmation par email.
            </p>

            <h3 className="text-xl font-semibold mb-4">5.2 Annulation</h3>
            <p className="mb-4">
              Le client peut annuler sa réservation gratuitement jusqu'à 24h avant le rendez-vous.
              Au-delà de ce délai, des frais d'annulation peuvent s'appliquer selon la politique du prestataire.
            </p>

            <h3 className="text-xl font-semibold mb-4">5.3 Paiement</h3>
            <p className="mb-4">
              Le paiement s'effectue via la plateforme de manière sécurisée. Le prestataire est payé
              après confirmation de la réalisation du service par le client.
            </p>

            <h2 className="text-2xl font-bold text-[#000080] mb-6">6. Obligations des Parties</h2>
            <h3 className="text-xl font-semibold mb-4">6.1 Obligations du Client</h3>
            <ul className="mb-4 space-y-2">
              <li>Fournir des informations exactes pour la réservation</li>
              <li>Être présent au rendez-vous convenu</li>
              <li>Régler le prix du service selon les conditions convenues</li>
              <li>Évaluer le service rendu de manière objective</li>
            </ul>

            <h3 className="text-xl font-semibold mb-4">6.2 Obligations du Prestataire</h3>
            <ul className="mb-4 space-y-2">
              <li>Fournir un service de qualité professionnelle</li>
              <li>Respecter les horaires convenus</li>
              <li>Disposer des compétences et équipements nécessaires</li>
              <li>Être assuré pour son activité</li>
              <li>Respecter les normes de sécurité et d'hygiène</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#000080] mb-6">7. Responsabilités et Garanties</h2>
            <h3 className="text-xl font-semibold mb-4">7.1 Responsabilité de KaayJob</h3>
            <p className="mb-4">
              KaayJob agit en tant qu'intermédiaire technique entre clients et prestataires.
              Nous nous engageons à vérifier l'identité et les compétences des prestataires,
              mais ne pouvons garantir le résultat final du service.
            </p>

            <h3 className="text-xl font-semibold mb-4">7.2 Garantie Satisfaction</h3>
            <p className="mb-4">
              En cas d'insatisfaction, le client peut contacter notre service client dans les 24h
              suivant la réalisation du service. Nous nous engageons à trouver une solution adaptée.
            </p>

            <h2 className="text-2xl font-bold text-[#000080] mb-6">8. Propriété Intellectuelle</h2>
            <p className="mb-6">
              Le contenu de la plateforme KaayJob (textes, images, logos, etc.) est protégé par
              les droits de propriété intellectuelle. Toute reproduction ou utilisation sans
              autorisation préalable est interdite.
            </p>

            <h2 className="text-2xl font-bold text-[#000080] mb-6">9. Données Personnelles</h2>
            <p className="mb-6">
              Les données personnelles sont collectées et traitées conformément à notre politique
              de confidentialité et au RGPD. Pour plus d'informations, consultez notre politique de confidentialité.
            </p>

            <h2 className="text-2xl font-bold text-[#000080] mb-6">10. Résiliation</h2>
            <p className="mb-6">
              KaayJob se réserve le droit de suspendre ou résilier un compte en cas de violation
              des présentes CGU. L'utilisateur peut également résilier son compte à tout moment
              depuis son espace personnel.
            </p>

            <h2 className="text-2xl font-bold text-[#000080] mb-6">11. Droit Applicable et Juridiction</h2>
            <p className="mb-6">
              Les présentes CGU sont soumises au droit sénégalais. Tout litige sera porté devant
              les tribunaux compétents de Dakar.
            </p>

            <h2 className="text-2xl font-bold text-[#000080] mb-6">12. Modification des CGU</h2>
            <p className="mb-6">
              KaayJob se réserve le droit de modifier les présentes CGU à tout moment.
              Les utilisateurs seront informés des modifications par email ou via la plateforme.
              L'utilisation continue de la plateforme vaut acceptation des nouvelles conditions.
            </p>

            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 text-center">
                Pour toute question concernant ces conditions générales, contactez-nous à{" "}
                <a href="mailto:legal@kaayjob.com" className="text-[#000080] hover:underline">
                  legal@kaayjob.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
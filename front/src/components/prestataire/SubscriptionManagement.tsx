import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Check, X, Crown, Loader2, Calendar, Target, BarChart3, Wrench, TrendingUp } from "lucide-react";
import { api } from "../../lib/api";
import { toast } from "sonner";

interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  duration: number;
  features: string[];
  isActive: boolean;
  displayOrder: number;
}

interface ActiveSubscription {
  id: string;
  plan: string;
  status: string;
  startDate: string;
  endDate: string;
  planDetails?: SubscriptionPlan;
}

// Styles pour les animations
const styles = `
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export function SubscriptionManagement({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [activeSubscription, setActiveSubscription] = useState<ActiveSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    loadData();

    // Surveiller l'état de la connexion
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Charger les données en parallèle avec timeout
      const [plansResponse, activeResponse] = await Promise.allSettled([
        api.get("/subscriptions/plans"),
        api.get("/subscriptions/active")
      ]);

      // Traiter les plans disponibles
      if (plansResponse.status === 'fulfilled' && plansResponse.value.success) {
        setPlans(plansResponse.value.data || []);
      } else {
        console.warn("Erreur chargement plans:", plansResponse.status === 'rejected' ? plansResponse.reason : plansResponse.value);
      }

      // Traiter l'abonnement actif
      if (activeResponse.status === 'fulfilled' && activeResponse.value.success && activeResponse.value.data) {
        setActiveSubscription(activeResponse.value.data);
      } else {
        console.warn("Erreur chargement abonnement actif:", activeResponse.status === 'rejected' ? activeResponse.reason : activeResponse.value);
        // Ne pas afficher d'erreur toast pour l'abonnement actif car c'est normal qu'il n'y en ait pas
      }

    } catch (error) {
      console.error("Erreur générale chargement abonnements:", error);
      toast.error("Erreur de connexion. Vérifiez votre connexion internet.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    try {
      setSubscribing(planId);
      const response = await api.post("/subscriptions", { planId });

      if (response.success) {
        toast.success("Abonnement créé avec succès !");
        // Petite pause avant de recharger pour laisser le temps au backend
        setTimeout(() => loadData(), 1000);
      } else {
        toast.error(response.message || "Erreur lors de l'abonnement");
      }
    } catch (error: any) {
      console.error("Erreur abonnement:", error);
      // Ne pas afficher de toast pour les erreurs réseau (elles sont gérées par le navigateur)
      if (error.name !== 'TypeError' || !error.message?.includes('fetch')) {
        toast.error(error.message || "Erreur lors de l'abonnement");
      }
    } finally {
      setSubscribing(null);
    }
  };

  const handleCancelSubscription = async () => {
    if (!activeSubscription) return;

    try {
      const response = await api.delete(`/subscriptions/${activeSubscription.id}`);

      if (response.success) {
        toast.success("Abonnement annulé avec succès");
        setActiveSubscription(null);
        // Petite pause avant de recharger
        setTimeout(() => loadData(), 500);
      } else {
        toast.error(response.message || "Erreur lors de l'annulation");
      }
    } catch (error: any) {
      console.error("Erreur annulation:", error);
      // Ne pas afficher de toast pour les erreurs réseau
      if (error.name !== 'TypeError' || !error.message?.includes('fetch')) {
        toast.error(error.message || "Erreur lors de l'annulation");
      }
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Actif</Badge>;
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">En attente</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Annulé</Badge>;
      case "expired":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Expiré</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 lg:ml-64">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
        </div>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="p-6 lg:p-8 lg:ml-64">
      <div className="max-w-6xl mx-auto">
        {/* Indicateur de connexion */}
        {!isOnline && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-amber-400"></div>
              <p className="text-amber-800 text-sm font-medium">
                Connexion perdue. Certaines fonctionnalités peuvent ne pas être disponibles.
              </p>
            </div>
          </div>
        )}

        {/* Abonnement actif */}
        {activeSubscription && (
          <Card className="mb-8 border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-200/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            <CardHeader className="pb-3 relative">
              <CardTitle className="flex items-center gap-3 text-emerald-800">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Votre abonnement actif</h2>
                  <p className="text-sm font-normal text-emerald-600">Profitez de tous vos avantages !</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-bold text-xl text-gray-900">{activeSubscription.plan}</h3>
                    {getStatusBadge(activeSubscription.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Valable jusqu'au {formatDate(activeSubscription.endDate)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    onClick={handleCancelSubscription}
                    disabled={!isOnline}
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Annuler l'abonnement
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    Résiliation possible à tout moment
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Plans disponibles
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan, index) => {
              const isRecommended = plan.slug === "premium";
              const isPopular = plan.slug === "premium";

              return (
                <Card
                  key={plan.id}
                  className={`relative transition-all duration-300 group ${
                    isRecommended
                      ? "border-2 border-slate-300 shadow-lg hover:shadow-xl hover:border-slate-400 transform hover:-translate-y-1"
                      : "border border-gray-200 hover:shadow-lg hover:border-gray-300"
                  }`}
                  style={{
                    animation: `fade-in 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  {isRecommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-slate-800 text-white px-4 py-1 text-xs font-semibold border-2 border-white shadow-md">
                        ⭐ RECOMMANDÉ
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-3 relative">
                    {isRecommended && (
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full -translate-y-8 translate-x-8 opacity-20"></div>
                    )}
                    <CardTitle className={`text-xl font-bold mb-2 ${
                      isRecommended ? "text-slate-900" : "text-gray-900"
                    }`}>
                      {plan.name}
                    </CardTitle>
                    <div className={`text-4xl font-bold mb-1 ${
                      isRecommended ? "text-slate-900" : "text-gray-900"
                    }`}>
                      {plan.price.toLocaleString("fr-SN")}
                      <span className="text-lg font-normal text-gray-500"> CFA</span>
                    </div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm font-medium mb-2">
                      <span>{plan.duration} jours</span>
                    </div>
                    {plan.description && (
                      <p className="text-gray-600 text-sm mt-1 font-medium">{plan.description}</p>
                    )}
                  </CardHeader>

                <CardContent className="pt-0">
                  {plan.features && plan.features.length > 0 && (
                    <div className="mb-6">
                      <ul className="space-y-3">
                        {plan.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-center gap-3 text-sm">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                              isRecommended
                                ? "bg-slate-200 group-hover:bg-slate-300"
                                : "bg-gray-100 group-hover:bg-gray-200"
                            }`}>
                              <Check className={`w-3 h-3 ${
                                isRecommended ? "text-slate-700" : "text-gray-600"
                              }`} />
                            </div>
                            <span className={`${
                              isRecommended ? "text-slate-800" : "text-gray-700"
                            }`}>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      {plan.features.length > 3 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-sm text-gray-500 italic text-center">
                            +{plan.features.length - 3} autres avantages inclus
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-3">
                    <Button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={subscribing === plan.id || !!activeSubscription || !isOnline}
                      className={`w-full transition-all duration-300 font-semibold py-3 ${
                        isRecommended
                          ? "bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] border-0"
                          : "bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md"
                      } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                    >
                      {subscribing === plan.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Activation en cours...
                        </>
                      ) : activeSubscription ? (
                        <span className="flex items-center justify-center gap-2">
                          <Check className="w-4 h-4" />
                          Abonnement actif
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          {isRecommended && <Crown className="w-4 h-4" />}
                          Choisir ce plan
                        </span>
                      )}
                    </Button>

                    {isRecommended && !activeSubscription && (
                      <p className="text-xs text-slate-600 text-center font-medium">
                        Le plus populaire auprès de nos prestataires
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
          </div>
        </div>

        {/* Section informative */}
        <Card className="mt-8 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-400 via-slate-500 to-slate-600"></div>
          <CardContent className="pt-8 pb-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Crown className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-xl mb-2">
                Pourquoi souscrire à un abonnement ?
              </h3>
              <p className="text-slate-600 text-sm max-w-2xl mx-auto">
                Rejoignez les milliers de prestataires qui boostent leur visibilité et leur croissance grâce à nos plans premium.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center group">
                <div className="w-12 h-12 rounded-full bg-slate-200 group-hover:bg-slate-300 flex items-center justify-center mx-auto mb-3 transition-colors duration-200">
                  <Target className="w-6 h-6 text-slate-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">Visibilité accrue</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Apparaissez en tête des résultats de recherche et attirez plus de clients qualifiés.
                </p>
              </div>

              <div className="text-center group">
                <div className="w-12 h-12 rounded-full bg-slate-200 group-hover:bg-slate-300 flex items-center justify-center mx-auto mb-3 transition-colors duration-200">
                  <BarChart3 className="w-6 h-6 text-slate-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">Outils avancés</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Accédez à des statistiques détaillées et des fonctionnalités premium pour votre business.
                </p>
              </div>

              <div className="text-center group">
                <div className="w-12 h-12 rounded-full bg-slate-200 group-hover:bg-slate-300 flex items-center justify-center mx-auto mb-3 transition-colors duration-200">
                  <Wrench className="w-6 h-6 text-slate-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">Support prioritaire</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Bénéficiez d'un support technique et commercial personnalisé 24/7.
                </p>
              </div>

              <div className="text-center group">
                <div className="w-12 h-12 rounded-full bg-slate-200 group-hover:bg-slate-300 flex items-center justify-center mx-auto mb-3 transition-colors duration-200">
                  <TrendingUp className="w-6 h-6 text-slate-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">Croissance garantie</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Développez votre activité grâce à nos outils marketing intégrés et stratégiques.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}
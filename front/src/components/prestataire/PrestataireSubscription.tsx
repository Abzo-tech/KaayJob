import { useState, useEffect } from "react";
import {
  Crown,
  Check,
  Star,
  CreditCard,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { api } from "../../lib/api";
import { toast } from "sonner";

// Plans d'abonnement
const plans = [
  {
    id: "gratuit",
    name: "Gratuit",
    price: 0,
    duration: "Indéfinie",
    features: [
      "5 services maximum",
      "Visibilité standard",
      "Support par email",
    ],
    color: "bg-gray-100",
  },
  {
    id: "premium",
    name: "Premium",
    price: 9900,
    duration: "1 mois",
    features: [
      "Services illimités",
      "Badge VIP",
      "Visibilité prioritaire",
      "Support prioritaire",
      "Statistiques avancées",
    ],
    color: "bg-yellow-100",
  },
  {
    id: "pro",
    name: "Pro",
    price: 24900,
    duration: "1 mois",
    features: [
      "Tout Premium",
      "Publication en premier",
      "Badge Pro",
      "Formation exclusive",
      "Gestion équipe",
    ],
    color: "bg-purple-100",
  },
];

export function PrestataireSubscription() {
  const [loading, setLoading] = useState(true);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [subscribing, setSubscribing] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setLoading(true);
        const response = await api.get("/providers/me/subscription");
        if (response.success) {
          setCurrentSubscription(response.data);
        }
      } catch (err) {
        console.error("Erreur chargement abonnement:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  const handleSubscribe = async (planId: string) => {
    try {
      setSubscribing(planId);
      const response = await api.post("/providers/me/subscription/subscribe", {
        plan: planId,
        duration: 1,
      });

      if (response.success) {
        toast.success(`Abonnement ${planId.toUpperCase()} activé !`);
        setCurrentSubscription(response.data);
      } else {
        toast.error(response.message || "Erreur lors de l'abonnement");
      }
    } catch (err: any) {
      toast.error(err.message || "Erreur de connexion");
    } finally {
      setSubscribing(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
      case "actif":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1">
            <CheckCircle size={12} /> Actif
          </Badge>
        );
      case "expired":
      case "expiré":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 flex items-center gap-1">
            <AlertCircle size={12} /> Expiré
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getCurrentPlan = () => {
    if (!currentSubscription) return null;
    return plans.find((p) => p.id === currentSubscription.plan);
  };

  const currentPlan = getCurrentPlan();
  const isPremium = currentSubscription?.plan === "premium" || currentSubscription?.plan === "pro";
  const isActive = currentSubscription?.status === "active" || currentSubscription?.status === "actif";

  if (loading) {
    return (
      <div className="p-6 lg:p-8 lg:ml-64 flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-[#000080]" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 lg:ml-64">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#000080]">
          Mon Abonnement
        </h1>
        <p className="text-gray-500 mt-1">
          Gérez votre plan et vos privilèges sur KaayJob
        </p>
      </div>

      {/* Statut actuel */}
      {currentSubscription && (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Plan actuel</p>
                <div className="flex items-center gap-3 mt-1">
                  <h2 className="text-2xl font-bold">
                    {currentPlan?.name || "Gratuit"}
                  </h2>
                  {getStatusBadge(currentSubscription.status)}
                </div>
                {isActive && currentSubscription.end_date && (
                  <p className="text-sm text-gray-500 mt-1">
                    Valide jusqu'au {new Date(currentSubscription.end_date).toLocaleDateString("fr-FR")}
                  </p>
                )}
              </div>
              {isPremium && (
                <div className="flex items-center gap-2">
                  <Crown className="text-yellow-500" size={24} />
                  <span className="font-medium text-yellow-600">
                    Vous êtes un membre premium !
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pas d'abonnement */}
      {!currentSubscription && (
        <Card className="mb-8 border-yellow-400 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <AlertCircle className="text-yellow-600" size={32} />
              <div>
                <h3 className="font-semibold text-yellow-800">
                  Vous n'avez pas d'abonnement actif
                </h3>
                <p className="text-sm text-yellow-700">
                  Souscrivez à un plan premium pour bénéficier de plus de visibilité et de fonctionnalités.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans disponibles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = currentSubscription?.plan === plan.id;
          const isCurrentPlanActive = isCurrentPlan && isActive;

          return (
            <Card
              key={plan.id}
              className={
                plan.id === "pro"
                  ? "border-purple-500 border-2"
                  : isCurrentPlanActive
                  ? "border-green-500 border-2"
                  : ""
              }
            >
              <CardHeader className={`${plan.color} rounded-t-lg`}>
                <CardTitle className="flex items-center gap-2">
                  {plan.id === "pro" && <Star size={20} className="text-purple-600" />}
                  {plan.id === "premium" && <Crown size={20} className="text-yellow-600" />}
                  {plan.name}
                </CardTitle>
                <CardDescription>{plan.duration}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-3xl font-bold">
                  {plan.price === 0 ? "Gratuit" : `${plan.price.toLocaleString()} CFA`}
                </p>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {isCurrentPlanActive ? (
                  <Button
                    className="w-full mt-6 bg-green-600 hover:bg-green-700"
                    disabled
                  >
                    <CheckCircle size={18} className="mr-2" />
                    Plan actif
                  </Button>
                ) : plan.id === "gratuit" ? (
                  <Button
                    className="w-full mt-6"
                    variant="outline"
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={subscribing === plan.id}
                  >
                    {subscribing === plan.id ? (
                      <Loader2 size={18} className="mr-2 animate-spin" />
                    ) : (
                      <Check size={18} className="mr-2" />
                    )}
                    {currentSubscription ? "Basculer vers Gratuit" : "S'abonner"}
                  </Button>
                ) : (
                  <Button
                    className={`w-full mt-6 ${
                      plan.id === "premium"
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-purple-600 hover:bg-purple-700"
                    }`}
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={subscribing === plan.id}
                  >
                    {subscribing === plan.id ? (
                      <Loader2 size={18} className="mr-2 animate-spin" />
                    ) : (
                      <CreditCard size={18} className="mr-2" />
                    )}
                    Souscrire
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Informations supplémentaires */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Questions fréquentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium">Comment suis-je facturé ?</h4>
            <p className="text-sm text-gray-500 mt-1">
              Les abonnements premium sont facturés mensuellement. Le paiement peut être effectué en espèces ou par mobile money.
            </p>
          </div>
          <div>
            <h4 className="font-medium">Puis-je changer de plan à tout moment ?</h4>
            <p className="text-sm text-gray-500 mt-1">
              Oui, vous pouvez passer à un plan supérieur ou inférieur à tout moment. Les changements prennent effet immédiatement.
            </p>
          </div>
          <div>
            <h4 className="font-medium">Que se passe-t-il à l'expiration ?</h4>
            <p className="text-sm text-gray-500 mt-1">
              À l'expiration de votre abonnement, vous serez automatiquement rétrogradé au plan gratuit. Vos services resteront visibles mais avec une priorité réduite.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

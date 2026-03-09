import { useState, useEffect } from "react";
import {
  Crown,
  Check,
  Star,
  CreditCard,
  Loader2,
  AlertCircle,
  CheckCircle,
  Smartphone,
  ArrowRight,
  X,
  Wallet,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { api } from "../../lib/api";
import { toast } from "sonner";

interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  duration: number;
  features: string[];
  isActive: boolean;
}

interface Subscription {
  plan: string;
  status: string;
  end_date?: string;
}

export function PrestataireSubscription() {
  const [loading, setLoading] = useState(true);
  const [currentSubscription, setCurrentSubscription] =
    useState<Subscription | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null,
  );
  const [paymentMethod, setPaymentMethod] = useState<"mobile_money" | "cash">(
    "mobile_money",
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [subResponse, plansResponse] = await Promise.all([
          api.get("/providers/me/subscription"),
          api.get("/admin/subscription-plans"),
        ]);
        if (subResponse.success) {
          setCurrentSubscription(subResponse.data);
        }
        if (plansResponse.success) {
          setPlans(plansResponse.data || []);
        }
      } catch (err) {
        console.error("Erreur chargement données:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubscribeClick = (plan: SubscriptionPlan) => {
    if (plan.price === 0) {
      // Pour le plan gratuit, confirmation directe
      setSelectedPlan(plan);
      setShowConfirmDialog(true);
    } else {
      // Pour les plans payants, ouvrir le dialogue de paiement
      setSelectedPlan(plan);
      setShowPaymentDialog(true);
    }
  };

  const handleConfirmSubscription = async () => {
    if (!selectedPlan) return;

    try {
      setSubscribing(selectedPlan.id);
      const response = await api.post("/providers/me/subscription/subscribe", {
        plan: selectedPlan.slug,
        duration: 1,
      });

      if (response.success) {
        toast.success(`Abonnement ${selectedPlan.name.toUpperCase()} activé !`);
        setCurrentSubscription({
          plan: selectedPlan.slug,
          status: "active",
        });
        setShowConfirmDialog(false);
      } else {
        toast.error(response.message || "Erreur lors de l'abonnement");
      }
    } catch (err: any) {
      toast.error(err.message || "Erreur de connexion");
    } finally {
      setSubscribing(null);
    }
  };

  const handleProcessPayment = async () => {
    if (!selectedPlan) return;

    if (paymentMethod === "mobile_money" && !phoneNumber) {
      toast.error("Veuillez entrer votre numéro de téléphone");
      return;
    }

    try {
      setProcessingPayment(true);

      // Simuler le processus de paiement (dans un vrai système, ceci appelsrait une API de paiement)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Après paiement simulé, créer l'abonnement
      const response = await api.post("/providers/me/subscription/subscribe", {
        plan: selectedPlan.slug,
        duration: 1,
        paymentMethod,
        phoneNumber: paymentMethod === "mobile_money" ? phoneNumber : null,
      });

      if (response.success) {
        toast.success(
          `Paiement réussi ! Abonnement ${selectedPlan.name.toUpperCase()} activé !`,
        );
        setCurrentSubscription({
          plan: selectedPlan.slug,
          status: "active",
        });
        setShowPaymentDialog(false);
        setPhoneNumber("");
      } else {
        toast.error(response.message || "Erreur lors de l'abonnement");
      }
    } catch (err: any) {
      toast.error(err.message || "Erreur de connexion");
    } finally {
      setProcessingPayment(false);
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
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 flex items-center gap-1">
            <Loader2 size={12} className="animate-spin" /> En attente
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getCurrentPlan = () => {
    if (!currentSubscription) return plans.find((p) => p.slug === "gratuit");
    return (
      plans.find((p) => p.slug === currentSubscription.plan) ||
      plans.find((p) => p.slug === "gratuit")
    );
  };

  const currentPlan = getCurrentPlan();
  const isPremium =
    currentSubscription?.plan === "premium" ||
    currentSubscription?.plan === "pro";
  const isActive =
    currentSubscription?.status === "active" ||
    currentSubscription?.status === "actif";

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
        <h1 className="text-3xl font-bold text-[#000080]">Mon Abonnement</h1>
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
                    Valide jusqu'au{" "}
                    {new Date(currentSubscription.end_date).toLocaleDateString(
                      "fr-FR",
                    )}
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
                  Souscrivez à un plan premium pour bénéficier de plus de
                  visibilité et de fonctionnalités.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans disponibles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans
          .filter((p) => p.isActive)
          .map((plan) => {
            const isCurrentPlan = currentSubscription?.plan === plan.slug;
            const isCurrentPlanActive = isCurrentPlan && isActive;

            return (
              <Card
                key={plan.id}
                className={
                  plan.slug === "pro"
                    ? "border-purple-500 border-2"
                    : isCurrentPlanActive
                      ? "border-green-500 border-2"
                      : ""
                }
              >
                <CardHeader
                  className={`${
                    plan.slug === "pro"
                      ? "bg-purple-100"
                      : plan.slug === "premium"
                        ? "bg-yellow-100"
                        : "bg-gray-100"
                  } rounded-t-lg`}
                >
                  <CardTitle className="flex items-center gap-2">
                    {plan.slug === "pro" && (
                      <Star size={20} className="text-purple-600" />
                    )}
                    {plan.slug === "premium" && (
                      <Crown size={20} className="text-yellow-600" />
                    )}
                    {plan.name}
                  </CardTitle>
                  <CardDescription>
                    {plan.duration > 0 ? `${plan.duration} jours` : "Indéfinie"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-3xl font-bold">
                    {plan.price === 0
                      ? "Gratuit"
                      : `${plan.price.toLocaleString()} CFA`}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {(plan.features as string[]).map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <Check
                          size={16}
                          className="text-green-500 mt-0.5 flex-shrink-0"
                        />
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
                  ) : plan.slug === "gratuit" ? (
                    <Button
                      className="w-full mt-6"
                      variant="outline"
                      onClick={() => handleSubscribeClick(plan)}
                      disabled={subscribing === plan.id}
                    >
                      {subscribing === plan.id ? (
                        <Loader2 size={18} className="mr-2 animate-spin" />
                      ) : (
                        <Check size={18} className="mr-2" />
                      )}
                      {currentSubscription
                        ? "Basculer vers Gratuit"
                        : "S'abonner"}
                    </Button>
                  ) : (
                    <Button
                      className={`w-full mt-6 ${
                        plan.slug === "premium"
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-purple-600 hover:bg-purple-700"
                      }`}
                      onClick={() => handleSubscribeClick(plan)}
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

      {/* Dialog de confirmation pour plan gratuit */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer votre abonnement</DialogTitle>
            <DialogDescription>
              Vous êtes sur le point de passer au plan {selectedPlan?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedPlan && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold">{selectedPlan.name}</h4>
                <p className="text-2xl font-bold mt-1">
                  {selectedPlan.price === 0
                    ? "Gratuit"
                    : `${selectedPlan.price.toLocaleString()} CFA`}
                </p>
                <ul className="mt-3 space-y-1">
                  {(selectedPlan.features as string[])
                    .slice(0, 3)
                    .map((feature, i) => (
                      <li key={i} className="text-sm flex items-center gap-2">
                        <Check size={14} className="text-green-500" />
                        {feature}
                      </li>
                    ))}
                </ul>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowConfirmDialog(false)}
                >
                  Annuler
                </Button>
                <Button
                  className="flex-1 bg-[#000080]"
                  onClick={handleConfirmSubscription}
                  disabled={subscribing === selectedPlan.id}
                >
                  {subscribing === selectedPlan.id ? (
                    <Loader2 size={18} className="mr-2 animate-spin" />
                  ) : null}
                  Confirmer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de paiement pour plans payants */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Paiement de votre abonnement</DialogTitle>
            <DialogDescription>
              Completez votre paiement pour activer le plan {selectedPlan?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedPlan && (
            <div className="space-y-4">
              {/* Résumé du plan */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{selectedPlan.name}</h4>
                    <p className="text-sm text-gray-500">
                      {selectedPlan.duration} jours
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-[#000080]">
                    {selectedPlan.price.toLocaleString()} CFA
                  </p>
                </div>
              </div>

              {/* Méthode de paiement */}
              <div className="space-y-3">
                <Label>Mode de paiement</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                      paymentMethod === "mobile_money"
                        ? "border-[#000080] bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setPaymentMethod("mobile_money")}
                  >
                    <div className="flex items-center gap-2">
                      <Smartphone
                        size={20}
                        className={
                          paymentMethod === "mobile_money"
                            ? "text-[#000080]"
                            : "text-gray-500"
                        }
                      />
                      <span className="font-medium">Mobile Money</span>
                    </div>
                  </div>
                  <div
                    className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                      paymentMethod === "cash"
                        ? "border-[#000080] bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setPaymentMethod("cash")}
                  >
                    <div className="flex items-center gap-2">
                      <Wallet
                        size={20}
                        className={
                          paymentMethod === "cash"
                            ? "text-[#000080]"
                            : "text-gray-500"
                        }
                      />
                      <span className="font-medium">Espèces</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Numéro de téléphone pour Mobile Money */}
              {paymentMethod === "mobile_money" && (
                <div>
                  <Label htmlFor="phone">Numéro Mobile Money</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Ex: 77 123 45 67"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Un code de confirmation sera envoyé à ce numéro
                  </p>
                </div>
              )}

              {paymentMethod === "cash" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Un agent KaayJob vous contactera pour
                    le paiement en espèces.
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowPaymentDialog(false)}
                  disabled={processingPayment}
                >
                  Annuler
                </Button>
                <Button
                  className="flex-1 bg-[#000080] hover:bg-blue-900"
                  onClick={handleProcessPayment}
                  disabled={processingPayment}
                >
                  {processingPayment ? (
                    <>
                      <Loader2 size={18} className="mr-2 animate-spin" />
                      Traitement...
                    </>
                  ) : (
                    <>
                      <ArrowRight size={18} className="mr-2" />
                      Payer maintenant
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Informations supplémentaires */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Questions fréquentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium">Comment suis-je facturé ?</h4>
            <p className="text-sm text-gray-500 mt-1">
              Les abonnements premium sont facturés mensuellement. Le paiement
              peut être effectué en espèces ou par mobile money.
            </p>
          </div>
          <div>
            <h4 className="font-medium">
              Puis-je changer de plan à tout moment ?
            </h4>
            <p className="text-sm text-gray-500 mt-1">
              Oui, vous pouvez passer à un plan supérieur ou inférieur à tout
              moment. Les changements prennent effet immédiatement.
            </p>
          </div>
          <div>
            <h4 className="font-medium">Que se passe-t-il à l'expiration ?</h4>
            <p className="text-sm text-gray-500 mt-1">
              À l'expiration de votre abonnement, vous serez automatiquement
              rétrogradé au plan gratuit. Vos services resteront visibles mais
              avec une priorité réduite.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

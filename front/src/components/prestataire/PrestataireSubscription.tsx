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
  History,
  Receipt,
  XCircle,
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
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { useConfirmDialog } from "../../hooks/useConfirmDialog";

interface SubscriptionPlan {
  id: string;
  name: string;
  slug?: string;
  description?: string | null;
  price: number;
  duration: number | string;
  features: string[];
  isActive?: boolean;
}

// Helper function to get plan slug
const getPlanSlug = (plan: SubscriptionPlan): string => {
  return plan.slug || plan.id || 'gratuit';
};

// Helper function to check if plan is active
const isPlanActive = (plan: SubscriptionPlan): boolean => {
  return plan.isActive !== false;
};

// Helper function to get duration text
const getDurationText = (duration: number | string): string => {
  if (typeof duration === 'string') return duration;
  return duration > 0 ? `${duration} jours` : 'Indéfinie';
};

interface Subscription {
  plan: string;
  status: string;
  end_date?: string;
}

export function PrestataireSubscription() {
  const { confirm, ConfirmDialog } = useConfirmDialog();
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

  // Nouveaux états pour les fonctionnalités supplémentaires
  const [subscriptionHistory, setSubscriptionHistory] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showPayments, setShowPayments] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [subResponse, plansResponse, historyResponse, paymentsResponse] = await Promise.all([
          api.get("/providers/me/subscription"),
          api.get("/providers/subscription/plans"),
          api.get("/providers/me/subscription/history"),
          api.get("/providers/me/payments"),
        ]);
        if (subResponse.success) {
          setCurrentSubscription(subResponse.data);
        }
        if (plansResponse.success) {
          setPlans(plansResponse.data || []);
        }
        if (historyResponse.success) {
          setSubscriptionHistory(historyResponse.data || []);
        }
        if (paymentsResponse.success) {
          setPayments(paymentsResponse.data || []);
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
      const planSlug = selectedPlan.slug || selectedPlan.id || 'gratuit';
      const response = await api.post("/providers/me/subscription/subscribe", {
        plan: planSlug,
        duration: 1,
      });

      if (response.success) {
        toast.success(`Abonnement ${selectedPlan.name.toUpperCase()} activé !`);
        setCurrentSubscription({
          plan: planSlug,
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
      const planSlug = selectedPlan.slug || selectedPlan.id || 'gratuit';
      const response = await api.post("/providers/me/subscription/subscribe", {
        plan: planSlug,
        duration: 1,
        paymentMethod,
        phoneNumber: paymentMethod === "mobile_money" ? phoneNumber : null,
      });

      if (response.success) {
        toast.success(
          `Paiement réussi ! Abonnement ${selectedPlan.name.toUpperCase()} activé !`,
        );
        setCurrentSubscription({
          plan: planSlug,
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
      case "cancelled":
      case "annulé":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 flex items-center gap-1">
            <XCircle size={12} /> Annulé
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

  const handleCancelSubscription = async () => {
    if (!currentSubscription) return;

    const confirmCancel = await confirm(
      "Annuler l'abonnement",
      "Êtes-vous sûr de vouloir annuler votre abonnement ? Cette action est irréversible.",
      "Annuler",
      "Conserver"
    );

    if (!confirmCancel) return;

    try {
      setCancelling(true);
      const response = await api.post("/providers/me/subscription/cancel");
      
      if (response.success) {
        toast.success("Abonnement annulé avec succès");
        setCurrentSubscription({
          ...currentSubscription,
          status: "cancelled",
        });
        // Rafraîchir les données
        const [subResponse, historyResponse] = await Promise.all([
          api.get("/providers/me/subscription"),
          api.get("/providers/me/subscription/history"),
        ]);
        if (subResponse.success) {
          setCurrentSubscription(subResponse.data);
        }
        if (historyResponse.success) {
          setSubscriptionHistory(historyResponse.data || []);
        }
      } else {
        toast.error(response.message || "Erreur lors de l'annulation");
      }
    } catch (err: any) {
      toast.error(err.message || "Erreur de connexion");
    } finally {
      setCancelling(false);
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
    (currentSubscription?.plan === "premium" ||
    currentSubscription?.plan === "pro") &&
    (currentSubscription?.status === "active" ||
    currentSubscription?.status === "actif");
  const isActive =
    currentSubscription?.status === "active" ||
    currentSubscription?.status === "actif";

  // Fonction pour obtenir le texte d'affichage selon le plan
  const getMembershipText = () => {
    if (!isPremium) return null;

    if (currentSubscription?.plan === "pro") {
      return {
        title: "Vous êtes un membre Pro !",
        description: "Profitez de tous les avantages exclusifs et maximisez votre visibilité.",
        icon: <Crown className="text-purple-500" size={24} />
      };
    } else if (currentSubscription?.plan === "premium") {
      return {
        title: "Vous êtes un membre Premium !",
        description: "Bénéficiez d'une visibilité prioritaire et de commissions réduites.",
        icon: <Crown className="text-yellow-500" size={24} />
      };
    }
    return null;
  };

  const membershipInfo = getMembershipText();

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:pl-72 lg:pr-6 flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-[#000080]" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:pl-72 lg:pr-6">
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
              <div className="flex flex-col gap-2">
                {membershipInfo && (
                  <div className="bg-gradient-to-r from-yellow-50 to-purple-50 p-3 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 mb-1">
                      {membershipInfo.icon}
                      <span className="font-semibold text-gray-800">
                        {membershipInfo.title}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 ml-8">
                      {membershipInfo.description}
                    </p>
                  </div>
                )}
                {isActive && (
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={handleCancelSubscription}
                    disabled={cancelling}
                  >
                    {cancelling ? (
                      <Loader2 size={16} className="mr-2 animate-spin" />
                    ) : (
                      <XCircle size={16} className="mr-2" />
                    )}
                    Annuler l'abonnement
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pas d'abonnement */}
      {!currentSubscription && (
        <Card className="mb-8 border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Crown className="text-yellow-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-yellow-800">
                  Débloquez votre potentiel sur KaayJob !
                </h3>
                <p className="text-sm text-yellow-700">
                  Passez au Premium ou Pro pour gagner plus de clients, réduire vos commissions
                  et bénéficier d'outils professionnels exclusifs.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans disponibles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans
          .filter((p) => isPlanActive(p))
          .map((plan) => {
            const planSlug = getPlanSlug(plan);
            const isCurrentPlan = currentSubscription?.plan === planSlug;
            const isCurrentPlanActive = isCurrentPlan && isActive;

            return (
              <Card
                key={plan.id}
                className={`relative overflow-hidden ${
                  planSlug === "pro"
                    ? "border-purple-500 border-2 shadow-lg shadow-purple-100"
                    : planSlug === "premium"
                      ? "border-yellow-500 border-2 shadow-lg shadow-yellow-100"
                      : isCurrentPlanActive
                        ? "border-green-500 border-2 shadow-lg shadow-green-100"
                        : "border-gray-200"
                }`}
              >
                {planSlug === "pro" && (
                  <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs px-2 py-1 rounded-bl-lg font-semibold">
                    Plus populaire
                  </div>
                )}
                <CardHeader
                  className={`${
                    planSlug === "pro"
                      ? "bg-gradient-to-r from-purple-100 to-purple-50"
                      : planSlug === "premium"
                        ? "bg-gradient-to-r from-yellow-100 to-yellow-50"
                        : "bg-gradient-to-r from-gray-100 to-gray-50"
                  } rounded-t-lg`}
                >
                  <CardTitle className="flex items-center gap-2">
                    {planSlug === "pro" && (
                      <Star size={20} className="text-purple-600" />
                    )}
                    {planSlug === "premium" && (
                      <Crown size={20} className="text-yellow-600" />
                    )}
                    <span className={
                      planSlug === "pro" ? "text-purple-800" :
                      planSlug === "premium" ? "text-yellow-800" :
                      "text-gray-800"
                    }>
                      {plan.name}
                    </span>
                  </CardTitle>
                  <CardDescription className={
                    planSlug === "pro" ? "text-purple-600" :
                    planSlug === "premium" ? "text-yellow-600" :
                    "text-gray-600"
                  }>
                    {planSlug === "gratuit" ? "Parfait pour démarrer" :
                     planSlug === "premium" ? "Idéal pour les professionnels" :
                     "Pour les entrepreneurs"}
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
                  ) : planSlug === "gratuit" ? (
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
                        ? "Revenir au gratuit"
                        : "Commencer gratuitement"}
                    </Button>
                  ) : (
                    <Button
                      className={`w-full mt-6 text-white font-semibold ${
                        planSlug === "premium"
                          ? "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 shadow-lg"
                          : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg"
                      }`}
                      onClick={() => handleSubscribeClick(plan)}
                      disabled={subscribing === plan.id}
                    >
                      {subscribing === plan.id ? (
                        <Loader2 size={18} className="mr-2 animate-spin" />
                      ) : (
                        <CreditCard size={18} className="mr-2" />
                      )}
                      {planSlug === "premium" ? "Devenir Premium" : "Devenir Pro"}
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
            <p className="text-sm text-muted-foreground">
              Vous êtes sur le point de passer au plan {selectedPlan?.name}
            </p>
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
            <p className="text-sm text-muted-foreground">
              Completez votre paiement pour activer le plan {selectedPlan?.name}
            </p>
          </DialogHeader>

          {selectedPlan && (
            <div className="space-y-4">
              {/* Résumé du plan */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{selectedPlan.name}</h4>
                    <p className="text-sm text-gray-500">
                      {getDurationText(selectedPlan.duration)}
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

      {/* Historique des abonnements */}
      <Card className="mt-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History size={20} />
            Historique des abonnements
          </CardTitle>
          {subscriptionHistory.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? "Masquer" : "Afficher"}
            </Button>
          )}
        </CardHeader>
        {showHistory && subscriptionHistory.length > 0 && (
          <CardContent>
            <div className="space-y-3">
              {subscriptionHistory.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{item.plan_name || item.plan}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(item.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  {getStatusBadge(item.status)}
                </div>
              ))}
            </div>
          </CardContent>
        )}
        {subscriptionHistory.length === 0 && (
          <CardContent>
            <p className="text-gray-500 text-center py-4">
              Aucun historique d'abonnement
            </p>
          </CardContent>
        )}
      </Card>

      {/* Historique des paiements */}
      <Card className="mt-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Receipt size={20} />
            Historique des paiements
          </CardTitle>
          {payments.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPayments(!showPayments)}
            >
              {showPayments ? "Masquer" : "Afficher"}
            </Button>
          )}
        </CardHeader>
        {showPayments && payments.length > 0 && (
          <CardContent>
            <div className="space-y-3">
              {payments.map((payment: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {Number(payment.amount).toLocaleString()} CFA
                    </p>
                    <p className="text-sm text-gray-500">
                      {payment.payment_method === "mobile_money" ? "Mobile Money" : 
                       payment.payment_method === "cash" ? "Espèces" : 
                       payment.payment_method || "Non spécifié"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(payment.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <Badge className={
                    payment.status === "PAID" ? "bg-green-100 text-green-800" :
                    payment.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                    "bg-gray-100 text-gray-800"
                  }>
                    {payment.status === "PAID" ? "Payé" :
                     payment.status === "PENDING" ? "En attente" :
                     payment.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        )}
        {payments.length === 0 && (
          <CardContent>
            <p className="text-gray-500 text-center py-4">
              Aucun paiement enregistré
            </p>
          </CardContent>
        )}
      </Card>
      <ConfirmDialog />
    </div>
  );
}

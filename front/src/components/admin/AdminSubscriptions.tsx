import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Crown,
  Check,
  X,
  Calendar,
  CreditCard,
  Star,
  Users,
  Loader2,
  RefreshCw,
  Trash2,
  Edit2,
  Save,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { useConfirmDialog } from "../../hooks/useConfirmDialog";

interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  duration: number;
  features: string[];
  isActive: boolean;
  displayOrder: number;
}

export function AdminSubscriptions() {
  const { confirm, ConfirmDialog } = useConfirmDialog();
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [planForm, setPlanForm] = useState({
    name: "",
    description: "",
    price: 0,
    duration: 30,
    features: "",
    isActive: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [subsResponse, plansResponse] = await Promise.all([
          api.get("/admin/subscriptions"),
          api.get("/admin/subscriptions/plans"),
        ]);
        if (subsResponse.success) {
          setSubscriptions(subsResponse.data || []);
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

  const filteredSubscriptions = subscriptions.filter((sub: any) => {
    const providerName =
      `${sub.first_name || ""} ${sub.last_name || ""}`.toLowerCase();
    const matchesSearch =
      providerName.includes(searchTerm.toLowerCase()) ||
      (sub.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = planFilter === "all" || sub.plan === planFilter;
    return matchesSearch && matchesPlan;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
      case "actif":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1">
            <Check size={12} /> Actif
          </Badge>
        );
      case "expired":
      case "expiré":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 flex items-center gap-1">
            <X size={12} /> Expiré
          </Badge>
        );
      case "pending":
      case "en_attente":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            En attente
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPlanBadge = (plan: string) => {
    const planData = plans.find((p) => p.slug === plan);
    switch (plan) {
      case "pro":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 flex items-center gap-1">
            <Star size={12} /> {planData?.name || "Pro"}
          </Badge>
        );
      case "premium":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 flex items-center gap-1">
            <Crown size={12} /> {planData?.name || "Premium"}
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            {planData?.name || "Gratuit"}
          </Badge>
        );
    }
  };

  const getTotalRevenue = () => {
    const premiumSubs = filteredSubscriptions.filter(
      (s: any) =>
        s.plan !== "gratuit" &&
        s.plan !== "free" &&
        (s.status === "active" || s.status === "actif"),
    );
    return premiumSubs.reduce((acc: number, sub: any) => {
      const plan = plans.find((p) => p.slug === sub.plan);
      return acc + (plan?.price || 0);
    }, 0);
  };

  const handleRenew = async (id: string) => {
    try {
      const response = await api.put(`/admin/subscriptions/${id}/renew`, {
        duration: 1,
      });
      if (response.success) {
        toast.success("Abonnement renouvelé avec succès");
        const subsResponse = await api.get("/admin/subscriptions");
        if (subsResponse.success) {
          setSubscriptions(subsResponse.data || []);
        }
      } else {
        toast.error(response.message || "Erreur lors du renouvellement");
      }
    } catch (err: any) {
      toast.error(err.message || "Erreur de connexion");
    }
  };

  const handleCancel = async (id: string) => {
    const confirmed = await confirm(
      "Annuler l'abonnement",
      "Êtes-vous sûr de vouloir annuler cet abonnement ? Cette action entraînera la perte des privilèges associés.",
      "Annuler l'abonnement",
      "Conserver"
    );

    if (!confirmed) return;

    try {
      const response = await api.delete(`/admin/subscriptions/${id}`);
      if (response.success) {
        toast.success("Abonnement annulé avec succès");
        const subsResponse = await api.get("/admin/subscriptions");
        if (subsResponse.success) {
          setSubscriptions(subsResponse.data || []);
        }
      } else {
        toast.error(response.message || "Erreur lors de l'annulation");
      }
    } catch (err: any) {
      toast.error(err.message || "Erreur de connexion");
    }
  };

  // Fonctions de gestion des plans
  const handleCreatePlan = () => {
    setEditingPlan(null);
    setPlanForm({
      name: "",
      description: "",
      price: 0,
      duration: 30,
      features: "",
      isActive: true,
    });
    setIsEditing(true);
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name,
      description: plan.description || "",
      price: plan.price,
      duration: plan.duration,
      features: Array.isArray(plan.features) ? plan.features.join("\n") : "",
      isActive: plan.isActive,
    });
    setIsEditing(true);
  };

  const handleSavePlan = async () => {
    try {
      const featuresArray = planForm.features
        .split("\n")
        .map((f) => f.trim())
        .filter((f) => f);

      const planData = {
        name: planForm.name,
        description: planForm.description || null,
        price: Number(planForm.price),
        duration: Number(planForm.duration),
        features: featuresArray,
        isActive: planForm.isActive,
      };

      let response;
      if (editingPlan) {
        response = await api.put(
          `/admin/subscriptions/plans/${editingPlan.id}`,
          planData,
        );
      } else {
        response = await api.post("/admin/subscriptions/plans", planData);
      }

      if (response.success) {
        toast.success(
          editingPlan ? "Plan mis à jour" : "Plan créé avec succès",
        );
        const plansResponse = await api.get("/admin/subscriptions/plans");
        if (plansResponse.success) {
          setPlans(plansResponse.data || []);
        }
        setIsEditing(false);
        setIsPlanDialogOpen(false);
      } else {
        toast.error(response.message || "Erreur lors de l'enregistrement");
      }
    } catch (err: any) {
      toast.error(err.message || "Erreur de connexion");
    }
  };

  const handleDeletePlan = async (id: string) => {
    const confirmed = await confirm(
      "Supprimer le plan",
      "Êtes-vous sûr de vouloir supprimer ce plan d'abonnement ? Cette action est irréversible et affectera tous les abonnements associés.",
      "Supprimer",
      "Annuler"
    );

    if (!confirmed) return;

    try {
      const response = await api.delete(`/admin/subscriptions/plans/${id}`);
      if (response.success) {
        toast.success("Plan supprimé");
        const plansResponse = await api.get("/admin/subscriptions/plans");
        if (plansResponse.success) {
          setPlans(plansResponse.data || []);
        }
      } else {
        toast.error(response.message || "Erreur lors de la suppression");
      }
    } catch (err: any) {
      toast.error(err.message || "Erreur de connexion");
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 lg:ml-64 flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-[#000080]" />
      </div>
    );
  }

  const premiumCount = filteredSubscriptions.filter(
    (s: any) =>
      s.plan === "premium" && (s.status === "active" || s.status === "actif"),
  ).length;
  const proCount = filteredSubscriptions.filter(
    (s: any) =>
      s.plan === "pro" && (s.status === "active" || s.status === "actif"),
  ).length;

  return (
    <div className="p-6 lg:p-8 lg:ml-64">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#000080]">
            Abonnements Premium
          </h1>
          <p className="text-gray-500 mt-1">
            Gérez les abonnements et privilèges des prestataires
          </p>
        </div>
        <Button
          className="mt-4 md:mt-0 bg-[#000080] hover:bg-blue-900"
          onClick={() => setIsPlanDialogOpen(true)}
        >
          <Plus size={20} className="mr-2" />
          Gérer les plans
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Crown className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total prestataires</p>
                <p className="text-2xl font-bold">
                  {filteredSubscriptions.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="text-yellow-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Abonnés Premium</p>
                <p className="text-2xl font-bold">{premiumCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Abonnés Pro</p>
                <p className="text-2xl font-bold">{proCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CreditCard className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Revenus mensuels</p>
                <p className="text-2xl font-bold">
                  {getTotalRevenue().toLocaleString()} CFA
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                placeholder="Rechercher par nom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={planFilter === "all" ? "default" : "outline"}
                onClick={() => setPlanFilter("all")}
                className={planFilter === "all" ? "bg-[#000080]" : ""}
              >
                Tous
              </Button>
              <Button
                variant={planFilter === "pro" ? "default" : "outline"}
                onClick={() => setPlanFilter("pro")}
                className={planFilter === "pro" ? "bg-[#000080]" : ""}
              >
                Pro
              </Button>
              <Button
                variant={planFilter === "premium" ? "default" : "outline"}
                onClick={() => setPlanFilter("premium")}
                className={planFilter === "premium" ? "bg-[#000080]" : ""}
              >
                Premium
              </Button>
              <Button
                variant={planFilter === "gratuit" ? "default" : "outline"}
                onClick={() => setPlanFilter("gratuit")}
                className={planFilter === "gratuit" ? "bg-[#000080]" : ""}
              >
                Gratuit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des abonnements */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des abonnements</CardTitle>
        </CardHeader>
        <CardContent className="max-h-96 overflow-y-auto">
          {filteredSubscriptions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Aucun abonnement trouvé
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prestataire</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Début</TableHead>
                  <TableHead>Fin</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscriptions.map((sub: any) => (
                  <TableRow key={sub.id}>
                    <TableCell>
                      <p className="font-medium">
                        {sub.first_name} {sub.last_name}
                      </p>
                      <p className="text-sm text-gray-500">{sub.email}</p>
                    </TableCell>
                    <TableCell>{getPlanBadge(sub.plan)}</TableCell>
                    <TableCell>{getStatusBadge(sub.status)}</TableCell>
                    <TableCell>
                      {sub.start_date
                        ? new Date(sub.start_date).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {sub.end_date
                        ? new Date(sub.end_date).toLocaleDateString()
                        : "Illimitée"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Ouvrir le menu</span>
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 15 15"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                            >
                              <path
                                d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleRenew(sub.id)}>
                            <RefreshCw size={14} className="mr-2" />
                            Renouveler
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleCancel(sub.id)}
                          >
                            <Trash2 size={14} className="mr-2" />
                            Annuler l'abonnement
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog pour gérer les plans */}
      <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gérer les plans d'abonnement</DialogTitle>
            <DialogDescription>
              Configurez les plans d'abonnement pour les prestataires
            </DialogDescription>
          </DialogHeader>

          {!isEditing ? (
            <>
              {/* Liste des plans avec options de modification */}
              <div className="space-y-4 mt-6 max-h-96 overflow-y-auto">
                {plans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`${
                      plan.slug === "pro"
                        ? "border-purple-500 border-2"
                        : !plan.isActive
                          ? "opacity-60"
                          : ""
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {plan.slug === "pro" && (
                              <Star size={18} className="text-purple-600" />
                            )}
                            {plan.slug === "premium" && (
                              <Crown size={18} className="text-yellow-600" />
                            )}
                            {!plan.slug?.includes("pro") && !plan.slug?.includes("premium") && (
                              <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">G</span>
                              </div>
                            )}
                            <h3 className="font-semibold text-lg">{plan.name}</h3>
                            {!plan.isActive && (
                              <Badge className="bg-red-100 text-red-800 text-xs">
                                Inactif
                              </Badge>
                            )}
                          </div>

                          <p className="text-sm text-gray-600 mb-3">{plan.description}</p>

                          <div className="flex items-center justify-between mb-3">
                            <span className="text-2xl font-bold text-[#000080]">
                              {plan.price === 0 || !plan.price
                                ? "Gratuit"
                                : `${plan.price.toLocaleString()} CFA`}
                            </span>
                            <span className="text-sm text-gray-500">
                              {plan.duration > 0 ? `${plan.duration} jours` : "Illimité"}
                            </span>
                          </div>

                          <div className="mb-3">
                            <p className="text-sm font-medium mb-1">Fonctionnalités :</p>
                            <div className="flex flex-wrap gap-1">
                              {(plan.features as string[])?.slice(0, 3).map((feature, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
                                >
                                  <Check size={12} />
                                  {feature.length > 20 ? `${feature.substring(0, 20)}...` : feature}
                                </span>
                              ))}
                              {(plan.features as string[])?.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{(plan.features as string[]).length - 3} autres
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-1 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditPlan(plan)}
                            title="Modifier"
                          >
                            <Edit2 size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                            onClick={() => handleDeletePlan(plan.id)}
                            title="Supprimer"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Bouton pour créer un nouveau plan */}
              <Button
                className="mt-4 w-full"
                variant="outline"
                onClick={handleCreatePlan}
              >
                <Plus size={18} className="mr-2" />
                Créer un nouveau plan
              </Button>
            </>
          ) : (
            <>
              {/* Formulaire de création/modification de plan */}
              <div className="space-y-5 mt-6">
                <div>
                  <Label htmlFor="planName" className="text-sm font-medium">
                    Nom du plan
                  </Label>
                  <Input
                    id="planName"
                    value={planForm.name}
                    onChange={(e) =>
                      setPlanForm({ ...planForm, name: e.target.value })
                    }
                    placeholder="Ex: Premium Plus"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="planDescription" className="text-sm font-medium">
                    Description
                  </Label>
                  <Input
                    id="planDescription"
                    value={planForm.description}
                    onChange={(e) =>
                      setPlanForm({ ...planForm, description: e.target.value })
                    }
                    placeholder="Description courte..."
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="planPrice" className="text-sm font-medium">
                      Prix (CFA)
                    </Label>
                    <Input
                      id="planPrice"
                      type="number"
                      value={planForm.price}
                      onChange={(e) =>
                        setPlanForm({
                          ...planForm,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="0"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="planDuration" className="text-sm font-medium">
                      Durée (jours)
                    </Label>
                    <Input
                      id="planDuration"
                      type="number"
                      value={planForm.duration}
                      onChange={(e) =>
                        setPlanForm({
                          ...planForm,
                          duration: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="30"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="planFeatures" className="text-sm font-medium">
                    Fonctionnalités
                  </Label>
                  <textarea
                    id="planFeatures"
                    value={planForm.features}
                    onChange={(e) =>
                      setPlanForm({ ...planForm, features: e.target.value })
                    }
                    placeholder="Une fonctionnalité par ligne"
                    className="mt-1 w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#000080] resize-none text-sm"
                    rows={4}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="planActive"
                    checked={planForm.isActive}
                    onChange={(e) =>
                      setPlanForm({
                        ...planForm,
                        isActive: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-[#000080] focus:ring-[#000080] border-gray-300 rounded"
                    aria-label="Plan actif"
                  />
                  <Label htmlFor="planActive" className="text-sm cursor-pointer">
                    Plan actif
                  </Label>
                </div>
              </div>

              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 h-12 text-base font-medium"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSavePlan}
                  className="flex-1 h-12 bg-[#000080] hover:bg-blue-900 text-base font-medium"
                >
                  <Save size={20} className="mr-2" />
                  {editingPlan ? "Mettre à jour" : "Créer le plan"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      <ConfirmDialog />
    </div>
  );
}

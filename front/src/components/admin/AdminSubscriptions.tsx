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
import { api } from "../../lib/api";

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

export function AdminSubscriptions() {
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true);
        const response = await api.get("/admin/subscriptions");
        if (response.success) {
          setSubscriptions(response.data || []);
        }
      } catch (err) {
        console.error("Erreur chargement abonnements:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const filteredSubscriptions = subscriptions.filter((sub: any) => {
    const providerName = `${sub.first_name || ''} ${sub.last_name || ''}`.toLowerCase();
    const matchesSearch = providerName.includes(searchTerm.toLowerCase()) ||
      (sub.email || '').toLowerCase().includes(searchTerm.toLowerCase());
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
    switch (plan) {
      case "pro":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 flex items-center gap-1">
            <Star size={12} /> Pro
          </Badge>
        );
      case "premium":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 flex items-center gap-1">
            <Crown size={12} /> Premium
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Gratuit
          </Badge>
        );
    }
  };

  const getTotalRevenue = () => {
    const premiumSubs = filteredSubscriptions.filter(
      (s: any) => s.plan !== "gratuit" && s.plan !== "free" && (s.status === "active" || s.status === "actif")
    );
    return premiumSubs.reduce((acc: number, sub: any) => {
      const plan = plans.find((p) => p.id === sub.plan);
      return acc + (plan?.price || 0);
    }, 0);
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 lg:ml-64 flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-[#000080]" />
      </div>
    );
  }

  const premiumCount = filteredSubscriptions.filter(
    (s: any) => s.plan === "premium" && (s.status === "active" || s.status === "actif")
  ).length;
  const proCount = filteredSubscriptions.filter(
    (s: any) => s.plan === "pro" && (s.status === "active" || s.status === "actif")
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
                <p className="text-2xl font-bold">{filteredSubscriptions.length}</p>
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
                      {sub.start_date ? new Date(sub.start_date).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>
                      {sub.end_date ? new Date(sub.end_date).toLocaleDateString() : 'Illimitée'}
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
                          <DropdownMenuItem>Voir le profil</DropdownMenuItem>
                          <DropdownMenuItem>
                            Modifier l'abonnement
                          </DropdownMenuItem>
                          <DropdownMenuItem>Envoyer un rappel</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
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
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Gérer les plans d'abonnement</DialogTitle>
            <DialogDescription>
              Configurez les plans d'abonnement pour les prestataires
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={
                  plan.id === "pro" ? "border-purple-500 border-2" : ""
                }
              >
                <CardHeader className={`${plan.color} rounded-t-lg`}>
                  <CardTitle className="flex items-center gap-2">
                    {plan.id === "pro" && (
                      <Star size={20} className="text-purple-600" />
                    )}
                    {plan.id === "premium" && (
                      <Crown size={20} className="text-yellow-600" />
                    )}
                    {plan.name}
                  </CardTitle>
                  <CardDescription>{plan.duration}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-3xl font-bold">
                    {plan.price === 0
                      ? "Gratuit"
                      : `${plan.price.toLocaleString()} CFA`}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Check size={16} className="text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

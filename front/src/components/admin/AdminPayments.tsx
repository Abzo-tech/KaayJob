import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Check,
  X,
  DollarSign,
  CreditCard,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { api } from "../../lib/api";

export function AdminPayments() {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await api.get("/admin/payments?limit=100");
        if (response.success) {
          setPayments(response.data || []);
        }
      } catch (err) {
        console.error("Erreur chargement paiements:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const filteredPayments = payments.filter((payment: any) => {
    const providerName = `${payment.firstName || payment.first_name || ''} ${payment.lastName || payment.last_name || ''}`.toLowerCase();
    const matchesSearch = providerName.includes(searchTerm.toLowerCase()) ||
      (payment.transactionId || payment.transaction_id || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
      case "validé":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1">
            <Check size={12} /> Validé
          </Badge>
        );
      case "PENDING":
      case "en_attente":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 flex items-center gap-1">
            <Clock size={12} /> En attente
          </Badge>
        );
      case "REFUNDED":
      case "rejeté":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 flex items-center gap-1">
            <X size={12} /> Rejeté
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method?.toLowerCase()) {
      case "wave":
        return <span className="text-purple-600 font-bold">W</span>;
      case "orange_money":
        return <span className="text-orange-600 font-bold">OM</span>;
      case "card":
      case "carte bancaire":
        return <CreditCard size={16} className="text-blue-600" />;
      default:
        return <DollarSign size={16} className="text-gray-600" />;
    }
  };

  const totalRevenue = filteredPayments
    .filter((p: any) => p.status === "PAID")
    .reduce((acc: number, p: any) => acc + (parseFloat(p.amount) || 0), 0);

  const pendingPayments = filteredPayments.filter(
    (p: any) => p.status === "PENDING"
  ).length;

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#000080]">
            Gestion des paiements
          </h1>
          <p className="text-gray-500 mt-1">
            Validez et suivre les paiements des prestataires
          </p>
        </div>
        <Dialog open={isAddPaymentOpen} onOpenChange={setIsAddPaymentOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 md:mt-0 bg-[#000080] hover:bg-blue-900">
              <Plus size={20} className="mr-2" />
              Enregistrer un paiement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enregistrer un paiement</DialogTitle>
              <DialogDescription>
                Entrez les détails du paiement effectué par le prestataire
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Prestataire</label>
                <Input placeholder="Nom du prestataire" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Plan</label>
                <Input placeholder="Premium / Pro" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Montant (CFA)</label>
                <Input type="number" placeholder="9900" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">
                  Méthode de paiement
                </label>
                <Input placeholder="Wave / Orange Money" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">ID de transaction</label>
                <Input placeholder="WAVE-2024-XXX" />
              </div>
              <Button className="bg-[#000080] hover:bg-blue-900 w-full">
                Enregistrer le paiement
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Revenus totaux</p>
                <p className="text-2xl font-bold">
                  {totalRevenue.toLocaleString()} CFA
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="text-yellow-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  En attente de validation
                </p>
                <p className="text-2xl font-bold">{pendingPayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Check className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Paiements validés</p>
                <p className="text-2xl font-bold">
                  {filteredPayments.filter((p: any) => p.status === "PAID").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerte si paiements en attente */}
      {pendingPayments > 0 && (
        <Card className="mb-6 border-yellow-400 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-yellow-800">
              <AlertCircle size={24} />
              <div>
                <p className="font-medium">
                  {pendingPayments} paiement(x) en attente de validation
                </p>
                <p className="text-sm">
                  Veuillez valider ou rejeter ces paiements
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
                placeholder="Rechercher par nom ou ID transaction..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => setStatusFilter("all")}
                className={statusFilter === "all" ? "bg-[#000080]" : ""}
              >
                Tous
              </Button>
              <Button
                variant={statusFilter === "PENDING" ? "default" : "outline"}
                onClick={() => setStatusFilter("PENDING")}
                className={statusFilter === "PENDING" ? "bg-[#000080]" : ""}
              >
                En attente
              </Button>
              <Button
                variant={statusFilter === "PAID" ? "default" : "outline"}
                onClick={() => setStatusFilter("PAID")}
                className={statusFilter === "PAID" ? "bg-[#000080]" : ""}
              >
                Validés
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des paiements */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des paiements</CardTitle>
        </CardHeader>
        <CardContent className="max-h-96 overflow-y-auto">
          {filteredPayments.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Aucun paiement trouvé
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prestataire</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Méthode</TableHead>
                  <TableHead>ID Transaction</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment: any) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <p className="font-medium">
                        {payment.firstName || payment.first_name} {payment.lastName || payment.last_name}
                      </p>
                    </TableCell>
                    <TableCell>{parseFloat(payment.amount).toLocaleString()} CFA</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getMethodIcon(payment.paymentMethod || payment.payment_method)}
                        <span>{payment.paymentMethod || payment.payment_method || '-'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {payment.transactionId || payment.transaction_id || '-'}
                      </code>
                    </TableCell>
                    <TableCell>
                      {payment.createdAt || payment.created_at 
                        ? new Date(payment.createdAt || payment.created_at).toLocaleDateString() 
                        : '-'}
                    </TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell className="text-right">
                      {payment.status === "PENDING" && (
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Valider
                          </Button>
                          <Button size="sm" variant="destructive">
                            Rejeter
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

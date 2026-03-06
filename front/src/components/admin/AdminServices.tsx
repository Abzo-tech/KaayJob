import { useState, useEffect } from "react";
import {
  Search,
  MoreVertical,
  Star,
  Eye,
  Edit,
  Trash2,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { api } from "../../lib/api";

export function AdminServices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/services?limit=100");
      console.log("Admin services response:", response);
      // La réponse est directement dans response.data (pas response.data.data)
      const servicesData = response?.data || [];
      console.log("Services loaded:", servicesData.length);
      setServices(servicesData);
    } catch (error) {
      console.error("Erreur chargement services:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      (service.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.category_name || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || 
      (statusFilter === "actif" && service.isActive) ||
      (statusFilter === "inactif" && !service.isActive);
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Actif
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
        Inactif
      </Badge>
    );
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return numPrice.toLocaleString();
  };

  // Statistiques
  const totalServices = services.length;
  const activeServices = services.filter((s) => s.isActive).length;

  if (loading) {
    return (
      <div className="p-6 lg:p-8 lg:ml-64">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#000080]" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 lg:ml-64">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#000080]">
            Gestion des services
          </h1>
          <p className="text-gray-500 mt-1">
            Gérez les services proposés sur la plateforme
          </p>
        </div>
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
                placeholder="Rechercher par nom ou catégorie..."
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
                variant={statusFilter === "actif" ? "default" : "outline"}
                onClick={() => setStatusFilter("actif")}
                className={statusFilter === "actif" ? "bg-[#000080]" : ""}
              >
                Actifs
              </Button>
              <Button
                variant={statusFilter === "inactif" ? "default" : "outline"}
                onClick={() => setStatusFilter("inactif")}
                className={statusFilter === "inactif" ? "bg-[#000080]" : ""}
              >
                Inactifs
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-500">Total services</p>
              <p className="text-2xl font-bold">{totalServices}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-500">Services actifs</p>
              <p className="text-2xl font-bold text-green-600">{activeServices}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-500">Catégories</p>
              <p className="text-2xl font-bold text-purple-600">
                {new Set(services.map((s) => s.category_name)).size}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-500">Prestataires</p>
              <p className="text-2xl font-bold text-blue-600">
                {new Set(services.map((s) => s.provider_id)).size}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des services */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des services</CardTitle>
        </CardHeader>
        <CardContent className="max-h-96 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Prestataire</TableHead>
                <TableHead>Prix (CFA)</TableHead>
                <TableHead>Durée (min)</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <p className="font-medium">{service.name}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{service.category_name || "-"}</Badge>
                  </TableCell>
                  <TableCell>
                    {service.first_name} {service.last_name}
                  </TableCell>
                  <TableCell>{formatPrice(service.price)}</TableCell>
                  <TableCell>{service.duration || "-"}</TableCell>
                  <TableCell>{getStatusBadge(service.isActive)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye size={14} className="mr-2" />
                          Voir
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit size={14} className="mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 size={14} className="mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

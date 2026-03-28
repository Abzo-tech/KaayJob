import { useState, useEffect } from "react";
import {
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Loader2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Textarea } from "../ui/textarea";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { validateFormField } from "../../lib/validations";
import { useConfirmDialog } from "../../hooks/useConfirmDialog";

export function PrestataireServices() {
  const { confirm, ConfirmDialog } = useConfirmDialog();
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [newService, setNewService] = useState({
    name: "",
    categoryId: "",
    price: "",
    description: "",
    priceType: "fixed",
    duration: "60",
  });

  useEffect(() => {
    loadServices();
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await api.get("/categories");
      // La réponse est directement dans response.data (pas response.data.data)
      setCategories(response?.data || []);
    } catch (error) {
      console.error("Erreur chargement catégories:", error);
    }
  };

  const loadServices = async () => {
    try {
      setLoading(true);
      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;
      
      const response = await api.get("/services");
      // La réponse est directement dans response.data (pas response.data.data)
      const allServices = response?.data || [];
      
      // Filter services by current provider - match provider.user.id to user.id
      const myServices = allServices.filter(
        (s: any) => s.provider?.user?.id === user?.id
      );
      setServices(myServices);
    } catch (error) {
      console.error("Erreur chargement services:", error);
      toast.error("Erreur lors du chargement des services");
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter((service) =>
    (service.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return numPrice.toLocaleString();
  };

  const handleAddService = async () => {
    if (!newService.name || !newService.categoryId || !newService.price) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    try {
      setActionLoading("adding");
      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;
      
      await api.post("/services", {
        name: newService.name,
        categoryId: newService.categoryId,
        price: parseFloat(newService.price),
        description: newService.description,
        priceType: newService.priceType,
        duration: parseInt(newService.duration) || 60,
      });
      
      toast.success("Service créé avec succès !");
      setIsAddDialogOpen(false);
      setNewService({ name: "", categoryId: "", price: "", description: "", priceType: "fixed", duration: "60" });
      loadServices();
    } catch (error: any) {
      console.error("Erreur création service:", error);
      toast.error(error.message || "Erreur lors de la création du service");
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditService = (service: any) => {
    setSelectedService(service);
    setNewService({
      name: service.name || "",
      categoryId: service.categoryId || "",
      price: service.price?.toString() || "",
      description: service.description || "",
      priceType: service.priceType || "fixed",
      duration: service.duration?.toString() || "60",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateService = async () => {
    if (!selectedService || !newService.name || !newService.categoryId || !newService.price) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    try {
      setActionLoading("updating");
      
      await api.put(`/services/${selectedService.id}`, {
        name: newService.name,
        categoryId: newService.categoryId,
        price: parseFloat(newService.price),
        description: newService.description,
        priceType: newService.priceType,
        duration: parseInt(newService.duration) || 60,
      });
      
      toast.success("Service mis à jour avec succès !");
      setIsEditDialogOpen(false);
      setSelectedService(null);
      loadServices();
    } catch (error: any) {
      console.error("Erreur mise à jour service:", error);
      toast.error(error.message || "Erreur lors de la mise à jour du service");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    const confirmed = await confirm(
      "Supprimer le service",
      "Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible.",
      "Supprimer",
      "Annuler"
    );

    if (!confirmed) return;

    try {
      setActionLoading(serviceId);
      await api.delete(`/services/${serviceId}`);
      toast.success("Service supprimé avec succès !");
      loadServices();
    } catch (error: any) {
      console.error("Erreur suppression service:", error);
      toast.error(error.message || "Erreur lors de la suppression du service");
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleActive = async (service: any) => {
    try {
      setActionLoading(service.id);
      await api.put(`/services/${service.id}`, {
        isActive: !service.isActive,
      });
      toast.success(service.isActive ? "Service désactivé" : "Service activé");
      loadServices();
    } catch (error: any) {
      console.error("Erreur toggle service:", error);
      toast.error(error.message || "Erreur lors du changement de statut");
    } finally {
      setActionLoading(null);
    }
  };

  const totalServices = services.length;
  const activeServices = services.filter((s: any) => s.isActive).length;

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:pl-72 lg:pr-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#000080]" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:pl-72 lg:pr-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#000080]">Mes services</h1>
          <p className="text-gray-500 mt-1">Gérez vos services proposés</p>
        </div>
        <Button 
          className="mt-4 md:mt-0 bg-[#000080] hover:bg-blue-900"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus size={20} className="mr-2" />
          Ajouter un service
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                {new Set(services.map((s: any) => s.category?.name)).size}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <Input
            placeholder="Rechercher un service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste de vos services</CardTitle>
        </CardHeader>
        <CardContent className="max-h-96 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Catégorie</TableHead>
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
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-gray-500">
                        {service.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{service.category?.name || "-"}</Badge>
                  </TableCell>
                  <TableCell>{formatPrice(service.price)}</TableCell>
                  <TableCell>{service.duration || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        service.isActive ? "default" : "secondary"
                      }
                    >
                      {service.isActive ? "Actif" : "Inactif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditService(service)}>
                          <Edit size={14} className="mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteService(service.id)}
                          disabled={actionLoading === service.id}
                        >
                          {actionLoading === service.id ? (
                            <Loader2 size={14} className="mr-2 animate-spin" />
                          ) : (
                            <Trash2 size={14} className="mr-2" />
                          )}
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

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ajouter un Nouveau Service</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer un nouveau service.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="serviceName">Nom du Service</Label>
              <Input
                id="serviceName"
                placeholder="Ex: Réparation Smartphone"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select
                value={newService.categoryId}
                onValueChange={(value) => setNewService({ ...newService, categoryId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Prix (CFA)</Label>
              <Input
                id="price"
                type="number"
                placeholder="Ex: 15000"
                value={newService.price}
                onChange={(e) => setNewService({ ...newService, price: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Décrivez votre service..."
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              className="bg-[#000080] hover:bg-blue-900"
              onClick={handleAddService}
              disabled={!newService.name || !newService.categoryId || !newService.price || actionLoading === "adding"}
            >
              {actionLoading === "adding" ? (
                <Loader2 size={16} className="mr-2 animate-spin" />
              ) : (
                <Plus size={16} className="mr-2" />
              )}
              Ajouter le Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Service Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier le Service</DialogTitle>
            <DialogDescription>
              Modifiez les informations du service.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editServiceName">Nom du Service</Label>
              <Input
                id="editServiceName"
                placeholder="Ex: Réparation Smartphone"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editCategory">Catégorie</Label>
              <Select
                value={newService.categoryId}
                onValueChange={(value) => setNewService({ ...newService, categoryId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editPrice">Prix (CFA)</Label>
              <Input
                id="editPrice"
                type="number"
                placeholder="Ex: 15000"
                value={newService.price}
                onChange={(e) => setNewService({ ...newService, price: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editDescription">Description</Label>
              <Textarea
                id="editDescription"
                placeholder="Décrivez votre service..."
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              className="bg-[#000080] hover:bg-blue-900"
              onClick={handleUpdateService}
              disabled={!newService.name || !newService.categoryId || !newService.price || actionLoading === "updating"}
            >
              {actionLoading === "updating" ? (
                <Loader2 size={16} className="mr-2 animate-spin" />
              ) : (
                <Edit size={16} className="mr-2" />
              )}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmDialog />
    </div>
  );
}

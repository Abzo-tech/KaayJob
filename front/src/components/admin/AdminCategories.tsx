import { useState, useEffect } from "react";
import {
  Search,
  MoreVertical,
  Loader2,
  Plus,
  Eye,
  Edit,
  Trash2,
  Folder,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { api } from "../../lib/api";
import { toast } from "sonner";

export function AdminCategories() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Modal states
  const [viewCategory, setViewCategory] = useState<any>(null);
  const [createCategoryOpen, setCreateCategoryOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<any>(null);
  const [deleteCategory, setDeleteCategory] = useState<any>(null);

  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    icon: "",
    image: "",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    icon: "",
    image: "",
    isActive: true,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/categories");
      const categoriesData = response?.data?.data || response?.data || [];
      setCategories(categoriesData);
    } catch (error) {
      console.error("Erreur chargement catégories:", error);
      toast.error("Erreur lors du chargement des catégories");
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      (category.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Active
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
        Inactive
      </Badge>
    );
  };

  const handleCreateCategory = async () => {
    try {
      setActionLoading("create");
      await api.post("/admin/categories", {
        name: createForm.name,
        description: createForm.description,
        icon: createForm.icon,
        image: createForm.image || null,
      });
      toast.success("Catégorie créée avec succès!");
      setCreateCategoryOpen(false);
      setCreateForm({ name: "", description: "", icon: "", image: "" });
      loadCategories();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la création");
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditClick = (category: any) => {
    setEditCategory(category);
    setEditForm({
      name: category.name || "",
      description: category.description || "",
      icon: category.icon || "",
      image: category.image || "",
      isActive: category.isActive ?? true,
    });
  };

  const handleUpdateCategory = async () => {
    if (!editCategory) return;
    try {
      setActionLoading("update");
      await api.put(`/admin/categories/${editCategory.id}`, {
        name: editForm.name,
        description: editForm.description,
        icon: editForm.icon,
        image: editForm.image || null,
        isActive: editForm.isActive,
      });
      toast.success("Catégorie mise à jour avec succès!");
      setEditCategory(null);
      loadCategories();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteClick = (category: any) => {
    setDeleteCategory(category);
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategory) return;
    try {
      setActionLoading("delete");
      await api.delete(`/admin/categories/${deleteCategory.id}`);
      toast.success("Catégorie supprimée avec succès!");
      setDeleteCategory(null);
      loadCategories();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression");
    } finally {
      setActionLoading(null);
    }
  };

  // Statistiques
  const totalCategories = categories.length;
  const activeCategories = categories.filter((c) => c.isActive).length;
  const totalServices = categories.reduce(
    (sum, c) => sum + (parseInt(c.service_count) || 0),
    0,
  );

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
            Gestion des catégories
          </h1>
          <p className="text-gray-500 mt-1">Gérez les catégories de services</p>
        </div>
        <Button
          onClick={() => setCreateCategoryOpen(true)}
          className="mt-4 md:mt-0 bg-[#000080]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle catégorie
        </Button>
      </div>

      {/* Recherche */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
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
        </CardContent>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Folder className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total catégories</p>
                <p className="text-2xl font-bold">{totalCategories}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Folder className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Catégories actives</p>
                <p className="text-2xl font-bold">{activeCategories}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Folder className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total services</p>
                <p className="text-2xl font-bold">{totalServices}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des catégories */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des catégories</CardTitle>
        </CardHeader>
        <CardContent className="max-h-96 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Icône</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <span className="text-2xl">{category.icon || "📁"}</span>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{category.name}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-gray-500 truncate max-w-xs">
                      {category.description || "-"}
                    </p>
                  </TableCell>
                  <TableCell>{category.service_count || 0}</TableCell>
                  <TableCell>{getStatusBadge(category.isActive)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setViewCategory(category)}
                        >
                          <Eye size={14} className="mr-2" />
                          Voir
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEditClick(category)}
                        >
                          <Edit size={14} className="mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteClick(category)}
                        >
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

      {/* Modal View Category */}
      <Dialog open={!!viewCategory} onOpenChange={() => setViewCategory(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Détails de la catégorie</DialogTitle>
            <DialogDescription>
              Informations détaillées sur la catégorie sélectionnée
            </DialogDescription>
          </DialogHeader>
          {viewCategory && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{viewCategory.icon || "📁"}</span>
                <div>
                  <label className="text-sm font-medium">Nom</label>
                  <p className="text-lg">{viewCategory.name}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <p className="text-gray-600">
                  {viewCategory.description || "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">
                  Nombre de services
                </label>
                <p>{viewCategory.service_count || 0}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Statut</label>
                <div className="mt-1">
                  {getStatusBadge(viewCategory.isActive)}
                </div>
              </div>
              {viewCategory.image && (
                <div>
                  <label className="text-sm font-medium">Image</label>
                  <img
                    src={viewCategory.image}
                    alt={viewCategory.name}
                    className="mt-1 max-w-full h-32 object-cover rounded"
                  />
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Create Category */}
      <Dialog open={createCategoryOpen} onOpenChange={setCreateCategoryOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Créer une nouvelle catégorie</DialogTitle>
            <DialogDescription>
              Ajoutez une nouvelle catégorie à votre plateforme
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nom</label>
              <Input
                value={createForm.name}
                onChange={(e) =>
                  setCreateForm({ ...createForm, name: e.target.value })
                }
                className="mt-1"
                placeholder="ex: Plomberie"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Input
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm({ ...createForm, description: e.target.value })
                }
                className="mt-1"
                placeholder="Description de la catégorie"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Icône (emoji)</label>
              <Input
                value={createForm.icon}
                onChange={(e) =>
                  setCreateForm({ ...createForm, icon: e.target.value })
                }
                className="mt-1"
                placeholder="ex: 🚿"
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                URL de l'image (optionnel)
              </label>
              <Input
                value={createForm.image}
                onChange={(e) =>
                  setCreateForm({ ...createForm, image: e.target.value })
                }
                className="mt-1"
                placeholder="https://..."
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setCreateCategoryOpen(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={handleCreateCategory}
              disabled={actionLoading === "create" || !createForm.name}
              className="bg-[#000080]"
            >
              {actionLoading === "create" ? (
                <Loader2 className="animate-spin mr-2" />
              ) : null}
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Edit Category */}
      <Dialog open={!!editCategory} onOpenChange={() => setEditCategory(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier la catégorie</DialogTitle>
            <DialogDescription>
              Modifiez les informations de la catégorie sélectionnée
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nom</label>
              <Input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Input
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Icône (emoji)</label>
              <Input
                value={editForm.icon}
                onChange={(e) =>
                  setEditForm({ ...editForm, icon: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">URL de l'image</label>
              <Input
                value={editForm.image}
                onChange={(e) =>
                  setEditForm({ ...editForm, image: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="editIsActive"
                checked={editForm.isActive}
                onChange={(e) =>
                  setEditForm({ ...editForm, isActive: e.target.checked })
                }
                className="w-4 h-4"
              />
              <label htmlFor="editIsActive" className="text-sm font-medium">
                Catégorie active
              </label>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setEditCategory(null)}>
              Annuler
            </Button>
            <Button
              onClick={handleUpdateCategory}
              disabled={actionLoading === "update"}
              className="bg-[#000080]"
            >
              {actionLoading === "update" ? (
                <Loader2 className="animate-spin mr-2" />
              ) : null}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Delete Confirmation */}
      <Dialog
        open={!!deleteCategory}
        onOpenChange={() => setDeleteCategory(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Cette action est irréversible. Voulez-vous vraiment supprimer cette catégorie ?
            </DialogDescription>
          </DialogHeader>
          <p>
            Êtes-vous sûr de vouloir supprimer la catégorie "
            {deleteCategory?.name}"? Cette action est irréversible.
          </p>
          {deleteCategory?.service_count > 0 && (
            <p className="text-red-500 text-sm">
              Attention: Cette catégorie contient {deleteCategory.service_count}{" "}
              service(s). Vous devez d'abord supprimer ou déplacer ces services.
            </p>
          )}
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteCategory(null)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCategory}
              disabled={
                actionLoading === "delete" || deleteCategory?.service_count > 0
              }
            >
              {actionLoading === "delete" ? (
                <Loader2 className="animate-spin mr-2" />
              ) : null}
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

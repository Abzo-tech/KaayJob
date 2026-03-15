import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { ImageUpload, ServiceImageUpload } from "../common/ImageUpload";
import {
  MapPin,
  Star,
  Settings,
  Briefcase,
  Clock,
  Image,
  CreditCard,
  FileText,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { api } from "../../lib/api";
import { toast } from "sonner";

export function PrestataireProfile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [services, setServices] = useState<any[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
  });

  const [availability, setAvailability] = useState<any>({
    monday: { enabled: true, start: "08:00", end: "18:00" },
    tuesday: { enabled: true, start: "08:00", end: "18:00" },
    wednesday: { enabled: true, start: "08:00", end: "18:00" },
    thursday: { enabled: true, start: "08:00", end: "18:00" },
    friday: { enabled: true, start: "08:00", end: "18:00" },
    saturday: { enabled: true, start: "09:00", end: "16:00" },
    sunday: { enabled: false, start: "09:00", end: "12:00" },
  });
  const [isSavingAvailability, setIsSavingAvailability] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    specialization: "",
    address: "",
    zone: "",
  });

  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    accountNumber: "",
    accountHolder: "",
  });
  const [isSavingBank, setIsSavingBank] = useState(false);

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [serviceImages, setServiceImages] = useState<string[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setProfileData({
          firstName: parsedUser.firstName || "",
          lastName: parsedUser.lastName || "",
          email: parsedUser.email || "",
          phone: parsedUser.phone || "",
          bio: parsedUser.bio || "",
          specialization: parsedUser.specialization || "",
          address: parsedUser.address || "",
          zone: parsedUser.zone || "",
        });
        fetchServices(parsedUser.id);
        fetchAvailability();
        loadBankDetails();
        const savedImage = localStorage.getItem("profileImage");
        if (savedImage) {
          setProfileImage(savedImage);
        }
        const savedServiceImages = localStorage.getItem("serviceImages");
        if (savedServiceImages) {
          try {
            setServiceImages(JSON.parse(savedServiceImages));
          } catch (e) {}
        }
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
    setIsLoading(false);
  }, []);

  const fetchServices = async (providerId: string) => {
    setIsLoadingServices(true);
    try {
      const response = await api.get(`/services/provider/${providerId}`);
      if (response.data?.success) {
        setServices(response.data.data || []);
      }
    } catch (error) {
      console.error("Erreur chargement services:", error);
    } finally {
      setIsLoadingServices(false);
    }
  };

  const fetchAvailability = async () => {
    try {
      const response = await api.get("/providers/me");
      if (response.data?.success && response.data.data?.availability) {
        setAvailability(response.data.data.availability);
      }
    } catch (error: any) {
      console.log("Disponibilité non disponible");
    }
  };

  const handleSaveAvailability = async () => {
    setIsSavingAvailability(true);
    try {
      const response = await api.put("/providers/profile/availability", { availability });
      if (response.data?.success) {
        toast.success("Disponibilité mise à jour avec succès!");
      } else {
        toast.error(response.data?.message || "Erreur lors de la mise à jour");
      }
    } catch (error: any) {
      console.error("Erreur sauvegarde disponibilité:", error);
      toast.error(error.response?.data?.message || "Erreur lors de la mise à jour");
    } finally {
      setIsSavingAvailability(false);
    }
  };

  const loadBankDetails = () => {
    const savedBank = localStorage.getItem("bankDetails");
    if (savedBank) {
      try {
        setBankDetails(JSON.parse(savedBank));
      } catch (e) {
        console.error("Error parsing bank details:", e);
      }
    }
  };

  const handleSaveBankDetails = () => {
    setIsSavingBank(true);
    try {
      localStorage.setItem("bankDetails", JSON.stringify(bankDetails));
      toast.success("Coordonnées bancaires enregistrées avec succès!");
    } catch (error) {
      console.error("Erreur sauvegarde banque:", error);
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setIsSavingBank(false);
    }
  };

  const handleImageUpload = (image: string | null) => {
    if (image) {
      setProfileImage(image);
      localStorage.setItem("profileImage", image);
      toast.success("Photo de profil mise à jour!");
    } else {
      setProfileImage(null);
      localStorage.removeItem("profileImage");
      toast.success("Photo de profil supprimée!");
    }
  };

  const handleServiceImagesChange = (images: string[]) => {
    setServiceImages(images);
    localStorage.setItem("serviceImages", JSON.stringify(images));
    toast.success("Images du portfolio mises à jour!");
  };

  const handleAddService = async () => {
    if (!newService.name || !newService.price) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    try {
      const response = await api.post("/services", {
        name: newService.name,
        description: newService.description,
        price: parseInt(newService.price),
        categoryId: newService.categoryId || null,
        providerId: user?.id,
      });
      if (response.data?.success) {
        toast.success("Service ajouté avec succès!");
        setServices([...services, response.data.data]);
        setShowAddService(false);
        setNewService({ name: "", description: "", price: "", categoryId: "" });
      } else {
        toast.error(response.data?.message || "Erreur lors de l'ajout");
      }
    } catch (error: any) {
      console.error("Erreur ajout service:", error);
      toast.error(error.response?.data?.message || "Erreur lors de l'ajout");
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce service?")) return;
    try {
      const response = await api.delete(`/services/${serviceId}`);
      if (response.data?.success) {
        toast.success("Service supprimé avec succès!");
        setServices(services.filter((s) => s.id !== serviceId));
      } else {
        toast.error(response.data?.message || "Erreur lors de la suppression");
      }
    } catch (error: any) {
      console.error("Erreur suppression service:", error);
      toast.error(error.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await api.put("/auth/profile", profileData);
      if (response.data?.success) {
        const updatedUser = { ...user, ...profileData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        toast.success("Profil mis à jour avec succès!");
      } else {
        toast.error(response.data?.message || "Erreur lors de la mise à jour");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Erreur lors de la mise à jour du profil");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 lg:ml-64 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:pl-72 lg:pr-6 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <ImageUpload
                value={profileImage}
                onChange={handleImageUpload}
                label="Photo de profil"
                size="lg"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h1>
              <p className="text-gray-600">{profileData.specialization || "Spécialisation non définie"}</p>
              <div className="flex items-center mt-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">(4.8)</span>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800">Vérifié</Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-12">
            <TabsTrigger value="profile" className="text-base">
              <Settings className="w-5 h-5 mr-2" />Profil
            </TabsTrigger>
            <TabsTrigger value="services" className="text-base">
              <Briefcase className="w-5 h-5 mr-2" />Services
            </TabsTrigger>
            <TabsTrigger value="availability" className="text-base">
              <Clock className="w-5 h-5 mr-2" />Disponibilité
            </TabsTrigger>
            <TabsTrigger value="documents" className="text-base">
              <FileText className="w-5 h-5 mr-2" />Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border-0 shadow-md">
                <CardHeader><CardTitle>Informations Personnelles</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input id="firstName" value={profileData.firstName} onChange={(e) => setProfileData({...profileData, firstName: e.target.value})} className="mt-2" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom</Label>
                      <Input id="lastName" value={profileData.lastName} onChange={(e) => setProfileData({...profileData, lastName: e.target.value})} className="mt-2" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} className="mt-2" disabled />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="specialization">Spécialisation</Label>
                    <Input id="specialization" value={profileData.specialization} onChange={(e) => setProfileData({...profileData, specialization: e.target.value})} className="mt-2" placeholder="Ex: Plombier, Électricien..." />
                  </div>
                  <div>
                    <Label htmlFor="bio">Biographie</Label>
                    <Textarea id="bio" value={profileData.bio} onChange={(e) => setProfileData({...profileData, bio: e.target.value})} className="mt-2" rows={4} placeholder="Décrivez votre expérience..." />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-md">
                <CardHeader><CardTitle>Zone de Service</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">Adresse</Label>
                    <Input id="address" value={profileData.address} onChange={(e) => setProfileData({...profileData, address: e.target.value})} className="mt-2" placeholder="Votre adresse complète" />
                  </div>
                  <div>
                    <Label htmlFor="zone">Zone de couverture</Label>
                    <Input id="zone" value={profileData.zone} onChange={(e) => setProfileData({...profileData, zone: e.target.value})} className="mt-2" placeholder="Ex: Dakar, Plateau, Yoff..." />
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-600">Rayon de service: 20km</span>
                  </div>
                  <Button className="w-full bg-gray-700 hover:bg-gray-800 text-white" onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enregistrement...</> : "Enregistrer les modifications"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services">
            <div className="space-y-6">
              <Card className="bg-white border-0 shadow-md">
                <CardHeader><CardTitle>Mes Services</CardTitle></CardHeader>
                <CardContent>
                  {isLoadingServices ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
                    </div>
                  ) : services.length === 0 ? (
                    <div className="text-center py-8">
                      <Briefcase className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-500">Aucun service pour le moment</p>
                      <Button onClick={() => setShowAddService(true)} className="mt-4 bg-gray-700 hover:bg-gray-800 text-white">
                        <Plus className="w-4 h-4 mr-2" />Ajouter un service
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {services.map((service) => (
                          <div key={service.id} className="border rounded-lg p-4 relative group">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold">{service.name}</h3>
                                <p className="text-sm text-gray-600">{service.description || "Aucune description"}</p>
                                <p className="text-lg font-bold text-green-600 mt-2">{service.price?.toLocaleString() || "0"} XOF</p>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleDeleteService(service.id)} className="p-1 text-red-500 hover:bg-red-50 rounded" title="Supprimer">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button onClick={() => setShowAddService(true)} className="w-full bg-gray-700 hover:bg-gray-800 text-white">
                        <Plus className="w-4 h-4 mr-2" />Ajouter un nouveau service
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {showAddService && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <Card className="w-full max-w-md">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Ajouter un service</CardTitle>
                      <button onClick={() => setShowAddService(false)} className="p-1 hover:bg-gray-100 rounded">
                        <X size={20} />
                      </button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="serviceName">Nom du service *</Label>
                        <Input id="serviceName" value={newService.name} onChange={(e) => setNewService({...newService, name: e.target.value})} className="mt-2" placeholder="Ex: Réparation de plomberie" />
                      </div>
                      <div>
                        <Label htmlFor="serviceDesc">Description</Label>
                        <Textarea id="serviceDesc" value={newService.description} onChange={(e) => setNewService({...newService, description: e.target.value})} className="mt-2" placeholder="Décrivez votre service..." rows={3} />
                      </div>
                      <div>
                        <Label htmlFor="servicePrice">Prix (XOF) *</Label>
                        <Input id="servicePrice" type="number" value={newService.price} onChange={(e) => setNewService({...newService, price: e.target.value})} className="mt-2" placeholder="25000" />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleAddService} className="flex-1 bg-gray-700 hover:bg-gray-800 text-white">Ajouter</Button>
                        <Button variant="outline" onClick={() => setShowAddService(false)}>Annuler</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <Card className="bg-white border-0 shadow-md">
                <CardHeader><CardTitle>Portfolio / Travaux Réalisés</CardTitle></CardHeader>
                <CardContent>
                  <ServiceImageUpload
                    images={serviceImages}
                    onChange={handleServiceImagesChange}
                    maxImages={5}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="availability">
            <Card className="bg-white border-0 shadow-md">
              <CardHeader><CardTitle>Calendrier de Disponibilité</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-7 gap-2">
                    {[
                      { key: "monday", label: "Lun" },
                      { key: "tuesday", label: "Mar" },
                      { key: "wednesday", label: "Mer" },
                      { key: "thursday", label: "Jeu" },
                      { key: "friday", label: "Ven" },
                      { key: "saturday", label: "Sam" },
                      { key: "sunday", label: "Dim" },
                    ].map(({ key, label }) => (
                      <div key={key} className={`text-center p-3 border rounded-lg ${availability[key]?.enabled ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}>
                        <p className="font-medium text-sm">{label}</p>
                        <label className="flex items-center justify-center mt-2">
                          <input type="checkbox" checked={availability[key]?.enabled || false} onChange={(e) => setAvailability({...availability, [key]: {...availability[key], enabled: e.target.checked}})} className="w-4 h-4 text-gray-600 rounded" />
                        </label>
                        {availability[key]?.enabled && (
                          <div className="mt-2 space-y-1">
                            <input type="time" value={availability[key]?.start || "08:00"} onChange={(e) => setAvailability({...availability, [key]: {...availability[key], start: e.target.value}})} className="w-full text-xs p-1 border rounded" />
                            <span className="text-xs text-gray-400">à</span>
                            <input type="time" value={availability[key]?.end || "18:00"} onChange={(e) => setAvailability({...availability, [key]: {...availability[key], end: e.target.value}})} className="w-full text-xs p-1 border rounded" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button onClick={handleSaveAvailability} disabled={isSavingAvailability} className="w-full bg-gray-700 hover:bg-gray-800 text-white">
                    {isSavingAvailability ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enregistrement...</> : "Enregistrer les disponibilités"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border-0 shadow-md">
                <CardHeader><CardTitle>Coordonnées Bancaires</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Nom de la banque</Label>
                    <Input className="mt-2" placeholder="Ex: CBAO, BICIS..." value={bankDetails.bankName} onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})} />
                  </div>
                  <div>
                    <Label>Numéro de compte</Label>
                    <Input className="mt-2" placeholder="Numéro de compte bancaire" value={bankDetails.accountNumber} onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})} />
                  </div>
                  <div>
                    <Label>Titulaire du compte</Label>
                    <Input className="mt-2" value={bankDetails.accountHolder || `${profileData.firstName} ${profileData.lastName}`} onChange={(e) => setBankDetails({...bankDetails, accountHolder: e.target.value})} placeholder="Nom du titulaire du compte" />
                  </div>
                  <Button className="w-full bg-gray-700 hover:bg-gray-800 text-white" onClick={handleSaveBankDetails} disabled={isSavingBank}>
                    <CreditCard className="w-4 h-4 mr-2" />{isSavingBank ? "Enregistrement..." : "Enregistrer"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-md">
                <CardHeader><CardTitle>Documents</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-gray-500" />
                        <span>Carte d'identité</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Validé</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-gray-500" />
                        <span>Certificat de qualification</span>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">Télécharger un document</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

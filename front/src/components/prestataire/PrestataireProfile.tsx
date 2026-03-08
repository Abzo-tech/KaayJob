import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Calendar,
  MapPin,
  Star,
  Settings,
  Briefcase,
  Clock,
  Image,
  CreditCard,
  FileText,
  Loader2,
} from "lucide-react";
import { api } from "../../lib/api";
import { toast } from "sonner";

export function PrestataireProfile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Profile form state
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
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
    setIsLoading(false);
  }, []);

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
      toast.error(
        error.response?.data?.message ||
          "Erreur lors de la mise à jour du profil",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage
                  src={
                    user?.firstName
                      ? `https://ui-avatars.com/api/?name=${user.firstName}&background=random`
                      : ""
                  }
                  alt={user?.firstName}
                />
                <AvatarFallback className="text-2xl">
                  {user?.firstName?.[0] || "P"}
                  {user?.lastName?.[0] || ""}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-gray-600">
                  {profileData.specialization || "Spécialisation non définie"}
                </p>
                <div className="flex items-center mt-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">(4.8)</span>
                </div>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800">Vérifié</Badge>
          </div>
        </div>

        {/* Profile Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 h-12">
            <TabsTrigger value="profile" className="text-base">
              <Settings className="w-5 h-5 mr-2" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="services" className="text-base">
              <Briefcase className="w-5 h-5 mr-2" />
              Services
            </TabsTrigger>
            <TabsTrigger value="availability" className="text-base">
              <Clock className="w-5 h-5 mr-2" />
              Disponibilité
            </TabsTrigger>
            <TabsTrigger value="documents" className="text-base">
              <FileText className="w-5 h-5 mr-2" />
              Documents
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Informations Personnelles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            firstName: e.target.value,
                          })
                        }
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            lastName: e.target.value,
                          })
                        }
                        className="mt-2"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                      className="mt-2"
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          phone: e.target.value,
                        })
                      }
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="specialization">Spécialisation</Label>
                    <Input
                      id="specialization"
                      value={profileData.specialization}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          specialization: e.target.value,
                        })
                      }
                      className="mt-2"
                      placeholder="Ex: Plombier, Électricien..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Biographie</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData({ ...profileData, bio: e.target.value })
                      }
                      className="mt-2"
                      rows={4}
                      placeholder="Décrivez votre expérience et vos compétences..."
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Zone de Service</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">Adresse</Label>
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          address: e.target.value,
                        })
                      }
                      className="mt-2"
                      placeholder="Votre adresse complète"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zone">Zone de couverture</Label>
                    <Input
                      id="zone"
                      value={profileData.zone}
                      onChange={(e) =>
                        setProfileData({ ...profileData, zone: e.target.value })
                      }
                      className="mt-2"
                      placeholder="Ex: Dakar, Plateau, Yoff..."
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Rayon de service: 20km
                    </span>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Modifier la zone
                  </Button>
                </CardContent>
              </Card>
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  "Enregistrer les modifications"
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <div className="space-y-6">
              <Card className="bg-white border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Mes Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <h3 className="font-semibold">
                          Réparation de plomberie
                        </h3>
                        <p className="text-sm text-gray-600">
                          Débouchage, réparation de fuite, installation
                        </p>
                        <p className="text-lg font-bold text-green-600 mt-2">
                          25,000 XOF
                        </p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h3 className="font-semibold">
                          Installation sanitaire
                        </h3>
                        <p className="text-sm text-gray-600">
                          WC, douche, évier
                        </p>
                        <p className="text-lg font-bold text-green-600 mt-2">
                          50,000 XOF
                        </p>
                      </div>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Ajouter un nouveau service
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Portfolio / Travaux Réalisés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 text-center">
                      <Image className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm font-medium">
                        Réparation salle de bain
                      </p>
                      <p className="text-xs text-gray-600">
                        Dakar, Plateau - 2024
                      </p>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <Image className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm font-medium">
                        Installation cuisine
                      </p>
                      <p className="text-xs text-gray-600">Yoff - 2024</p>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <Image className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm font-medium">Débouchage urgent</p>
                      <p className="text-xs text-gray-600">Mermoz - 2024</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    <Image className="w-4 h-4 mr-2" />
                    Ajouter une réalisation
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Availability Tab */}
          <TabsContent value="availability">
            <Card className="bg-white border-0 shadow-md">
              <CardHeader>
                <CardTitle>Calendrier de Disponibilité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-7 gap-2">
                    {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(
                      (day) => (
                        <div
                          key={day}
                          className="text-center p-2 border rounded"
                        >
                          <p className="font-medium">{day}</p>
                          <p className="text-sm text-green-600">Disponible</p>
                        </div>
                      ),
                    )}
                  </div>
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Horaires</h3>
                    <p className="text-sm text-gray-600">
                      Lundi - Vendredi: 8h00 - 18h00
                    </p>
                    <p className="text-sm text-gray-600">
                      Samedi: 9h00 - 16h00
                    </p>
                    <p className="text-sm text-gray-600">Dimanche: Fermé</p>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Modifier les horaires
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Coordonnées Bancaires</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Nom de la banque</Label>
                    <Input className="mt-2" placeholder="Ex: CBAO, BICIS..." />
                  </div>
                  <div>
                    <Label>Numéro de compte</Label>
                    <Input
                      className="mt-2"
                      placeholder="Numéro de compte bancaire"
                    />
                  </div>
                  <div>
                    <Label>Titulaire du compte</Label>
                    <Input
                      className="mt-2"
                      value={`${profileData.firstName} ${profileData.lastName}`}
                      disabled
                    />
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Enregistrer
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-gray-500" />
                        <span>Carte d'identité</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        Validé
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-gray-500" />
                        <span>Certificat de qualification</span>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        En attente
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Télécharger un document
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import {
  Settings,
  User,
  Bell,
  Shield,
  Mail,
  Save,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import { api } from "../../lib/api";
import { PasswordInput } from "../forms";

export function AdminSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    newBooking: true,
    newReview: true,
    newsletter: false,
  });

  // Charger les données utilisateur au montage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          setProfileData({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            phone: user.phone || "",
          });
        }
      } catch (error) {
        console.error("Erreur chargement profil:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Mettre à jour le profil admin
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await api.put(
        "/auth/profile",
        {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phone: profileData.phone,
        }
      );

      if (response.success) {
        // Mettre à jour localStorage
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUser = {
          ...currentUser,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phone: profileData.phone,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        toast.success("Profil mis à jour avec succès !");
      }
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 lg:ml-64">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Paramètres</h1>
        <p className="text-gray-500 mt-1">
          Gérez les paramètres de votre plateforme
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-white border border-gray-200 p-1">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings size={16} />
            Général
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User size={16} />
            Profil
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell size={16} />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield size={16} />
            Sécurité
          </TabsTrigger>
        </TabsList>

        {/* Paramètres généraux */}
        <TabsContent value="general">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations de la plateforme</CardTitle>
                <CardDescription>
                  Les informations visibles par les utilisateurs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="platformName">Nom de la plateforme</Label>
                  <Input id="platformName" defaultValue="KaayJob" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    defaultValue="Trouvez le meilleur service près de chez vous"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email de contact</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="contact@kaayjob.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" defaultValue="+221 33 123 45 67" />
                </div>
                <Button className="bg-gray-800 hover:bg-gray-900">
                  <Save size={16} className="mr-2" />
                  Enregistrer
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Préférences régionales</CardTitle>
                <CardDescription>
                  Paramètres de langue et de devise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="language">Langue par défaut</Label>
                  <Input id="language" defaultValue="Français" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="currency">Devise</Label>
                  <Input id="currency" defaultValue="FCFA (XOF)" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="timezone">Fuseau horaire</Label>
                  <Input id="timezone" defaultValue="Africa/Dakar (UTC+0)" />
                </div>
                <Button className="bg-gray-800 hover:bg-gray-900">
                  <Save size={16} className="mr-2" />
                  Enregistrer
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Profil administrateur */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Mon profil administrateur</CardTitle>
              <CardDescription>
                Gérez vos informations personnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {profileData.firstName ? profileData.firstName[0].toUpperCase() : "A"}{profileData.lastName ? profileData.lastName[0].toUpperCase() : "A"}
                </div>
                <div>
                  <Button variant="outline" className="mb-2">
                    Changer la photo
                  </Button>
                  <p className="text-sm text-gray-500">
                    JPG, PNG ou GIF. Max 2MB
                  </p>
                </div>
              </div>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input 
                      id="firstName" 
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input 
                      id="lastName" 
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="adminEmail">Email</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={profileData.email}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="adminPhone">Téléphone</Label>
                  <Input 
                    id="adminPhone" 
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  />
                </div>
                <Button type="submit" className="bg-gray-800 hover:bg-gray-900" disabled={isSaving}>
                  <Save size={16} className="mr-2" />
                  {isSaving ? "Enregistrement..." : "Mettre à jour le profil"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notifications</CardTitle>
              <CardDescription>
                Choisissez comment vous souhaitez être notifié
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-4">Canaux de notification</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail size={20} className="text-gray-500" />
                      <div>
                        <p className="font-medium">Notifications par email</p>
                        <p className="text-sm text-gray-500">
                          Recevez les notifications par email
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, email: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell size={20} className="text-gray-500" />
                      <div>
                        <p className="font-medium">Notifications SMS</p>
                        <p className="text-sm text-gray-500">
                          Recevez les notifications par SMS
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.sms}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, sms: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Types de notifications</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Nouvelle réservation</p>
                      <p className="text-sm text-gray-500">
                        Quand un client réserve un service
                      </p>
                    </div>
                    <Switch
                      checked={notifications.newBooking}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          newBooking: checked,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Nouvel avis</p>
                      <p className="text-sm text-gray-500">
                        Quand un client laisse un avis
                      </p>
                    </div>
                    <Switch
                      checked={notifications.newReview}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          newReview: checked,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Newsletter</p>
                      <p className="text-sm text-gray-500">
                        Recevez des nouvelles de la plateforme
                      </p>
                    </div>
                    <Switch
                      checked={notifications.newsletter}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          newsletter: checked,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <Button className="bg-gray-800 hover:bg-gray-900">
                <Save size={16} className="mr-2" />
                Enregistrer les préférences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sécurité */}
        <TabsContent value="security">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Changer le mot de passe</CardTitle>
                <CardDescription>
                  Mettez à jour votre mot de passe régulièrement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">
                    Confirmer le mot de passe
                  </Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button className="bg-gray-800 hover:bg-gray-900">
                  Mettre à jour le mot de passe
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Authentification à deux facteurs</CardTitle>
                <CardDescription>
                  Ajoutez une couche de sécurité supplémentaire
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield size={24} className="text-gray-600" />
                    <div>
                      <p className="font-medium">2FA désactivé</p>
                      <p className="text-sm text-gray-500">
                        Protégez votre compte avec la vérification en 2 étapes
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Activer</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sessions actives</CardTitle>
                <CardDescription>
                  Gérez vos sessions de connexion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Session actuelle</p>
                      <p className="text-sm text-gray-500">
                        Dakar, Senegal • Chrome sur Windows
                      </p>
                    </div>
                    <Badge className="bg-gray-100 text-gray-800">
                      Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

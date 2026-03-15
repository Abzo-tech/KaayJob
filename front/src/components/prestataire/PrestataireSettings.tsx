import { useState, useEffect } from "react";
import { 
  Settings, 
  Bell, 
  Shield, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Key, 
  Smartphone,
  Globe,
  Save,
  Loader2,
  Check,
  AlertTriangle
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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { api } from "../../lib/api";
import { toast } from "sonner";

export function PrestataireSettings() {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    newBooking: true,
    promotions: false,
  });

  // Profile state
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  // Location state
  const [locationData, setLocationData] = useState({
    address: "",
    city: "",
  });
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Password change state
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Preferences state
  const [preferences, setPreferences] = useState({
    language: "Français",
    timezone: "Africa/Dakar (UTC+0)",
    currency: "FCFA (XOF) - Franc CFA",
    dateFormat: "DD/MM/YYYY",
  });
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);

  // Load user data on mount
  useEffect(() => {
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
    // Charger les préférences depuis localStorage
    const savedNotifications = localStorage.getItem("notificationPreferences");
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (e) {
        console.error("Error parsing notifications:", e);
      }
    }
    const savedPreferences = localStorage.getItem("userPreferences");
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch (e) {
        console.error("Error parsing preferences:", e);
      }
    }
    // Charger la localisation depuis localStorage
    const savedLocation = localStorage.getItem("providerLocation");
    if (savedLocation) {
      try {
        setLocationData(JSON.parse(savedLocation));
      } catch (e) {
        console.error("Error parsing location:", e);
      }
    }
  }, []);

  // Handle profile update
  const handleProfileUpdate = async () => {
    setIsLoadingProfile(true);
    try {
      const response = await api.put("/auth/profile", profileData);
      if (response.data?.success) {
        toast.success("Profil mis à jour avec succès!");
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({ ...currentUser, ...profileData }));
      } else {
        toast.error(response.data?.message || "Erreur lors de la mise à jour");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de la mise à jour");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Handle location save
  const handleLocationSave = () => {
    try {
      localStorage.setItem("providerLocation", JSON.stringify(locationData));
      toast.success("Zone de service enregistrée avec succès!");
    } catch (error) {
      console.error("Error saving location:", error);
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await api.put("/auth/password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      if (response.data?.success) {
        toast.success("Mot de passe mis à jour avec succès!");
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(response.data?.message || "Erreur lors du changement de mot de passe");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors du changement de mot de passe");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Handle notifications save - also save to localStorage
  const handleNotificationsSave = () => {
    try {
      localStorage.setItem("notificationPreferences", JSON.stringify(notifications));
      toast.success("Préférences de notifications enregistrées!");
    } catch (error) {
      console.error("Error saving notifications:", error);
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  // Handle preferences save
  const handlePreferencesSave = () => {
    setIsSavingPrefs(true);
    try {
      localStorage.setItem("userPreferences", JSON.stringify(preferences));
      toast.success("Préférences enregistrées avec succès!");
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setIsSavingPrefs(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 lg:ml-64 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Settings className="w-6 h-6" />
            Paramètres
          </h1>
          <p className="text-gray-500 mt-1 ml-9">
            Gérez vos préférences et votre compte
          </p>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="bg-white border border-gray-200 p-1 rounded-lg grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger 
              value="account" 
              className="rounded data-[state=active]:bg-gray-800 data-[state=active]:text-white flex items-center gap-2"
            >
              <User size={16} />
              <span className="hidden sm:inline">Compte</span>e
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="rounded data-[state=active]:bg-gray-800 data-[state=active]:text-white flex items-center gap-2"
            >
              <Bell size={16} />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="rounded data-[state=active]:bg-gray-800 data-[state=active]:text-white flex items-center gap-2"
            >
              <Shield size={16} />
              <span className="hidden sm:inline">Sécurité</span>
            </TabsTrigger>
            <TabsTrigger 
              value="preferences" 
              className="rounded data-[state=active]:bg-gray-800 data-[state=active]:text-white flex items-center gap-2"
            >
              <Globe size={16} />
              <span className="hidden sm:inline">Préférences</span>
            </TabsTrigger>
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account">
            <div className="grid gap-6">
              {/* Profile Card */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <User className="w-5 h-5" />
                    Informations du compte
                  </CardTitle>
                  <CardDescription>
                    Gérez vos informations personnelles
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center gap-6 mb-6">
                    <Avatar className="w-20 h-20 border-2 border-gray-200">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-gray-700 text-white text-xl">
                        {profileData.firstName?.[0] || "P"}{profileData.lastName?.[0] || ""}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm" className="mb-2">
                        Changer la photo
                      </Button>
                      <p className="text-xs text-gray-500">
                        JPG, PNG. Max 2MB
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium">Prénom</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="firstName"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                          className="pl-10"
                          placeholder="Votre prénom"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium">Nom</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="lastName"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                          className="pl-10"
                          placeholder="Votre nom"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          className="pl-10 bg-gray-50"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">Téléphone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          className="pl-10"
                          placeholder="+221 77 XXX XX XX"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Button 
                      onClick={handleProfileUpdate}
                      disabled={isLoadingProfile}
                      className="bg-gray-800 hover:bg-gray-900"
                    >
                      {isLoadingProfile ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Enregistrer
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Location Card */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <MapPin className="w-5 h-5" />
                    Zone de service
                  </CardTitle>
                  <CardDescription>
                    Définissez votre zone de couverture
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Adresse</Label>
                      <Input placeholder="Votre adresse" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Ville/Zone</Label>
                      <Input placeholder="Dakar, Yoff, etc." />
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Rayon de service</p>
                      <p className="text-sm text-gray-500">20km autour de votre zone</p>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button className="bg-gray-800 hover:bg-gray-900">
                      <Save className="mr-2 h-4 w-4" />
                      Enregistrer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Choisissez comment vous souhaitez être notifié
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Email Notifications */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <Mail className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Notifications par email</p>
                          <p className="text-sm text-gray-500">Recevez les mises à jour par email</p>
                        </div>
                      </div>
                        <Switch
                          checked={notifications.email}
                          onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                        />
                    </div>
                  </div>

                  {/* SMS Notifications */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <Smartphone className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Notifications SMS</p>
                          <p className="text-sm text-gray-500">Recevez des alertes par SMS</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.sms}
                        onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                      />
                    </div>
                  </div>

                  {/* New Booking */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <Clock className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Nouvelle réservation</p>
                          <p className="text-sm text-gray-500">Alerte lors d'une nouvelle réservation</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.newBooking}
                        onCheckedChange={(checked) => setNotifications({...notifications, newBooking: checked})}
                      />
                    </div>
                  </div>

                  {/* Promotions */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <Bell className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Promotions et offres</p>
                          <p className="text-sm text-gray-500">Recevez les dernières offres</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.promotions}
                        onCheckedChange={(checked) => setNotifications({...notifications, promotions: checked})}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button 
                    onClick={handleNotificationsSave}
                    className="bg-gray-800 hover:bg-gray-900"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer les préférences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="grid gap-6">
              {/* Password Change */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Key className="w-5 h-5" />
                    Changer le mot de passe
                  </CardTitle>
                  <CardDescription>
                    Mettez à jour votre mot de passe régulièrement
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-sm font-medium">Mot de passe actuel</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwords.currentPassword}
                      onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm font-medium">Nouveau mot de passe</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirmer le mot de passe</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwords.confirmPassword}
                      onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-gray-500 mt-0.5" />
                    <p className="text-sm text-gray-600">
                      Utilisez un mot de passe fort avec au moins 6 caractères
                    </p>
                  </div>
                  <Button
                    onClick={handlePasswordChange}
                    disabled={isChangingPassword}
                    className="w-full bg-gray-800 hover:bg-gray-900"
                  >
                    {isChangingPassword ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Key className="mr-2 h-4 w-4" />
                    )}
                    Mettre à jour le mot de passe
                  </Button>
                </CardContent>
              </Card>

              {/* Two-Factor Auth */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Shield className="w-5 h-5" />
                    Authentification à deux facteurs
                  </CardTitle>
                  <CardDescription>
                    Ajoutez une couche de sécurité supplémentaire
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Shield className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">2FA désactivé</p>
                        <p className="text-sm text-gray-500">Protégez votre compte avec la vérification en 2 étapes</p>
                      </div>
                    </div>
                    <Button variant="outline">
                      <Check className="mr-2 h-4 w-4" />
                      Activer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Globe className="w-5 h-5" />
                  Préférences
                </CardTitle>
                <CardDescription>
                  Personnalisez votre expérience
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-sm font-medium">Langue</Label>
                    <select 
                      id="language"
                      className="w-full h-10 px-3 border border-gray-300 rounded-lg bg-white"
                      value={preferences.language}
                      onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                    >
                      <option>Français</option>
                      <option>English</option>
                      <option>Wolof</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-sm font-medium">Fuseau horaire</Label>
                    <select 
                      id="timezone"
                      className="w-full h-10 px-3 border border-gray-300 rounded-lg bg-white"
                      value={preferences.timezone}
                      onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
                    >
                      <option>Africa/Dakar (UTC+0)</option>
                      <option>Europe/Paris (UTC+1)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-sm font-medium">Devise</Label>
                    <select 
                      id="currency"
                      className="w-full h-10 px-3 border border-gray-300 rounded-lg bg-white"
                      value={preferences.currency}
                      onChange={(e) => setPreferences({...preferences, currency: e.target.value})}
                    >
                      <option>FCFA (XOF) - Franc CFA</option>
                      <option>EUR - Euro</option>
                      <option>USD - Dollar US</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat" className="text-sm font-medium">Format de date</Label>
                    <select 
                      id="dateFormat"
                      className="w-full h-10 px-3 border border-gray-300 rounded-lg bg-white"
                      value={preferences.dateFormat}
                      onChange={(e) => setPreferences({...preferences, dateFormat: e.target.value})}
                    >
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    className="bg-gray-800 hover:bg-gray-900"
                    onClick={handlePreferencesSave}
                    disabled={isSavingPrefs}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isSavingPrefs ? "Enregistrement..." : "Enregistrer les préférences"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

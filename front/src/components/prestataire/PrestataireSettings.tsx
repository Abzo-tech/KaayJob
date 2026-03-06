import { useState } from "react";
import { Settings, Bell, Shield, Palette, Save } from "lucide-react";
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

export function PrestataireSettings() {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    newBooking: true,
  });

  return (
    <div className="p-6 lg:p-8 lg:ml-64">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#000080]">Paramètres</h1>
        <p className="text-gray-500 mt-1">Gérez vos préférences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-white border border-gray-200 p-1">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings size={16} />
            Général
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
          <Card>
            <CardHeader>
              <CardTitle>Préférences générales</CardTitle>
              <CardDescription>Configurez vos préférences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="language">Langue</Label>
                <Input id="language" defaultValue="Français" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="timezone">Fuseau horaire</Label>
                <Input id="timezone" defaultValue="Africa/Dakar (UTC+0)" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="currency">Devise</Label>
                <Input id="currency" defaultValue="FCFA (XOF)" />
              </div>
              <Button className="bg-[#000080] hover:bg-blue-900">
                <Save size={16} className="mr-2" />
                Enregistrer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Gérez comment vous souhaitez être notifié
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notifications par email</p>
                  <p className="text-sm text-gray-500">
                    Recevez les notifications par email
                  </p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, email: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notifications SMS</p>
                  <p className="text-sm text-gray-500">
                    Recevez les notifications par SMS
                  </p>
                </div>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, sms: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Nouvelle réservation</p>
                  <p className="text-sm text-gray-500">
                    Soyez notifié quand vous recevez une nouvelle réservation
                  </p>
                </div>
                <Switch
                  checked={notifications.newBooking}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, newBooking: checked })
                  }
                />
              </div>
              <Button className="bg-[#000080] hover:bg-blue-900">
                <Save size={16} className="mr-2" />
                Enregistrer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sécurité */}
        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Changer le mot de passe</CardTitle>
                <CardDescription>
                  Mettez à jour votre mot de passe
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
                <Button className="bg-[#000080] hover:bg-blue-900">
                  Mettre à jour
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Authentification à deux facteurs</CardTitle>
                <CardDescription>Sécurisez votre compte</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">2FA désactivé</p>
                    <p className="text-sm text-gray-500">
                      Protégez votre compte avec la vérification en 2 étapes
                    </p>
                  </div>
                  <Button variant="outline">Activer</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

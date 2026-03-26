/**
 * Composant de statistiques pour les utilisateurs
 */

import { Card, CardContent } from "../ui/card";
import { UserCog, Shield, Calendar, Check } from "lucide-react";

interface UserStatsProps {
  totalUsers: number;
  totalProviders: number;
  totalClients: number;
  unverifiedProviders: number;
}

export function UserStats({
  totalUsers,
  totalProviders,
  totalClients,
  unverifiedProviders,
}: UserStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <UserCog className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total utilisateurs</p>
              <p className="text-2xl font-bold">{totalUsers}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Prestataires</p>
              <p className="text-2xl font-bold">{totalProviders}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Calendar className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Clients</p>
              <p className="text-2xl font-bold">{totalClients}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Check className="text-orange-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">En attente</p>
              <p className="text-2xl font-bold text-orange-600">
                {unverifiedProviders}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

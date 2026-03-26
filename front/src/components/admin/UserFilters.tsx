/**
 * Composant de filtres pour les utilisateurs
 */

import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";

interface UserFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  roleFilter: string;
  onRoleFilterChange: (value: string) => void;
}

export function UserFilters({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
}: UserFiltersProps) {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <Input
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={roleFilter === "all" ? "default" : "outline"}
              onClick={() => onRoleFilterChange("all")}
              className={roleFilter === "all" ? "bg-[#000080]" : ""}
            >
              Tous
            </Button>
            <Button
              variant={roleFilter === "client" ? "default" : "outline"}
              onClick={() => onRoleFilterChange("client")}
              className={roleFilter === "client" ? "bg-[#000080]" : ""}
            >
              Clients
            </Button>
            <Button
              variant={roleFilter === "prestataire" ? "default" : "outline"}
              onClick={() => onRoleFilterChange("prestataire")}
              className={roleFilter === "prestataire" ? "bg-[#000080]" : ""}
            >
              Prestataires
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

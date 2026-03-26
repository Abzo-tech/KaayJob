/**
 * Composant de formulaire pour créer un utilisateur
 */

import { useState } from "react";
import { Loader2, Plus, UserCog } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";

interface CreateUserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateUserData) => Promise<void>;
  loading?: boolean;
}

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
}

export function CreateUserForm({
  open,
  onOpenChange,
  onSubmit,
  loading = false,
}: CreateUserFormProps) {
  const [form, setForm] = useState<CreateUserData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: "CLIENT",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.email) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!form.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (form.password.length < 4) {
      newErrors.password = "Minimum 4 caractères";
    }

    if (!form.firstName) {
      newErrors.firstName = "Le prénom est requis";
    }

    if (!form.lastName) {
      newErrors.lastName = "Le nom est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      await onSubmit(form);
      setForm({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: "",
        role: "CLIENT",
      });
      setErrors({});
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setErrors({});
  };

  const updateField = (field: keyof CreateUserData, value: string) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-white dark:bg-gray-900 border-0 shadow-2xl">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-bold text-[#000080] flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Créer un nouvel utilisateur
          </DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Remplissez les informations pour créer un nouveau compte utilisateur
          </p>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={errors.email ? "border-red-500 focus:border-red-500" : ""}
              placeholder="email@exemple.com"
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Mot de passe <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              className={errors.password ? "border-red-500 focus:border-red-500" : ""}
              placeholder="Minimum 4 caractères"
            />
            <p className="text-xs text-gray-500">Le mot de passe sera visible</p>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Prénom <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                className={errors.firstName ? "border-red-500 focus:border-red-500" : ""}
                placeholder="Prénom"
              />
              {errors.firstName && (
                <p className="text-xs text-red-500">{errors.firstName}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Nom <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                className={errors.lastName ? "border-red-500 focus:border-red-500" : ""}
                placeholder="Nom"
              />
              {errors.lastName && (
                <p className="text-xs text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Téléphone
            </label>
            <Input
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="+221..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Rôle <span className="text-red-500">*</span>
            </label>
            <select
              value={form.role}
              onChange={(e) => updateField("role", e.target.value)}
              className="w-full mt-1 p-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#000080] focus:border-transparent"
            >
              <option value="CLIENT">Client</option>
              <option value="PRESTATAIRE">Prestataire</option>
              <option value="ADMIN">Administrateur</option>
            </select>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} className="flex-1">
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-[#000080] hover:bg-[#000060]"
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : <Plus className="mr-2 h-4 w-4" />}
            Créer l'utilisateur
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

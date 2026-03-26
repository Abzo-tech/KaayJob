import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  Settings,
  BarChart3,
  LogOut,
  Menu,
  X,
  Crown,
  CreditCard,
  Folder,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

interface AdminSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const menuItems = [
  { id: "admin-dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { id: "admin-users", label: "Utilisateurs", icon: Users },
  { id: "admin-services", label: "Services", icon: Briefcase },
  { id: "admin-categories", label: "Catégories", icon: Folder },
  { id: "admin-bookings", label: "Réservations", icon: Calendar },
  { id: "admin-analytics", label: "Analyses", icon: BarChart3 },
  { id: "admin-subscriptions", label: "Abonnements", icon: Crown },
  { id: "admin-payments", label: "Paiements", icon: CreditCard },
  { id: "admin-settings", label: "Paramètres", icon: Settings },
];

export function AdminSidebar({
  currentPage,
  onNavigate,
  onLogout,
}: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#000080] text-white rounded-lg shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-[#000080] text-white transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:w-64 w-64`}
      >
        {/* Logo */}
        <div className="flex items-center px-6 py-6 border-b border-blue-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-[#000080] font-bold text-xl">K</span>
            </div>
            <div>
              <span className="text-xl font-bold">KaayJob</span>
              <p className="text-xs text-blue-300">Administration</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="py-6 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg mb-1 transition-all duration-200 ${
                  currentPage === item.id
                    ? "bg-white text-[#000080] font-semibold"
                    : "text-blue-100 hover:bg-blue-800 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-800">
          <Button
            onClick={() => {
              onLogout();
              onNavigate("login");
            }}
            variant="ghost"
            className="w-full justify-start text-blue-100 hover:text-white hover:bg-blue-800"
          >
            <LogOut size={20} className="mr-3" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

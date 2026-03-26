import { Button } from "./ui/button";
import { Logo } from "./Logo";
import { Menu, X, Bell, Home, Phone, User, LogOut } from "lucide-react";
import { useState } from "react";
import { NotificationDropdown } from "./common/NotificationDropdown";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "client" | "prestataire" | "admin";
}

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  user: User | null;
  onLogout: () => void;
}

export function Header({
  currentPage,
  onNavigate,
  user,
  onLogout,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-12œxl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Left */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {
              onNavigate("home");
              setIsMenuOpen(false);
            }}
          >
            <Logo />
            <span className="text-xl font-bold text-[#000080]">KaayJob</span>
          </div>

          {/* Desktop Menu - Center */}
          <nav className="hidden md:flex items-center gap-1 flex-none bg-[#000080] rounded-lg px-3 py-1">
            {/* Home Icon */}
            <button
              onClick={() => onNavigate("home")}
              className={`p-2 transition-all duration-300 rounded-lg ${
                currentPage === "home"
                  ? "text-white bg-white/20"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
              title="Accueil"
            >
              <Home size={20} />
            </button>

            {/* Services - Text */}
            <button
              onClick={() => onNavigate("categories")}
              className={`px-4 py-2 font-semibold text-sm transition-all duration-300 rounded-lg ${
                currentPage === "categories"
                  ? "text-white bg-white/20"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              Services
            </button>

            {/* Phone Icon */}
            <button
              onClick={() => onNavigate("contact")}
              className={`p-2 transition-all duration-300 rounded-lg ${
                currentPage === "contact"
                  ? "text-white bg-white/20"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
              title="Contact"
            >
              <Phone size={20} />
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1 ml-4">
            {/* Connexion Button - Only for guests */}
            {!user && (
              <button
                onClick={() => onNavigate("login")}
                className="font-semibold text-white bg-[#000080] hover:bg-blue-700 transition-colors text-sm px-4 py-2 rounded-lg"
              >
                Connexion
              </button>
            )}

            {/* User actions - Only logged in */}
            {user && (
              <>
                {/* Profile Button */}
                <button
                  onClick={() => onNavigate("dashboard")}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Mon profil"
                >
                  <User size={20} className="text-gray-700" />
                  <span className="text-sm text-gray-700 hidden lg:inline">
                    {user.firstName}
                  </span>
                </button>

                {/* Notification Bell - Only for clients */}
                {user.role === "client" && (
                  <NotificationDropdown variant="light" align="left" />
                )}

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Déconnexion"
                >
                  <LogOut size={20} className="text-gray-700" />
                </button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? (
                <X size={24} className="text-[#000080]" />
              ) : (
                <Menu size={24} className="text-[#000080]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200">
            <button
              onClick={() => {
                onNavigate("home");
                setIsMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-3 font-semibold text-sm flex items-center gap-3 ${
                currentPage === "home"
                  ? "text-[#000080] bg-[#FFF4EA]"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Home size={20} />
              Accueil
            </button>
            <button
              onClick={() => {
                onNavigate("categories");
                setIsMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-3 font-semibold text-sm ${
                currentPage === "categories"
                  ? "text-[#000080] bg-[#FFF4EA]"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Services
            </button>
            <button
              onClick={() => {
                onNavigate("contact");
                setIsMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-3 font-semibold text-sm flex items-center gap-3 ${
                currentPage === "contact"
                  ? "text-[#000080] bg-[#FFF4EA]"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Phone size={20} />
              Contact
            </button>
            <div className="border-t border-gray-200 my-2" />

            {/* Logged in user options */}
            {user ? (
              <>
                <button
                  onClick={() => {
                    onNavigate("dashboard");
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 font-semibold text-sm flex items-center gap-3 text-gray-700 hover:bg-gray-100"
                >
                  <User size={20} />
                  Mon Profil ({user.firstName})
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 font-semibold text-sm flex items-center gap-3 text-red-600 hover:bg-gray-100"
                >
                  <LogOut size={20} />
                  Déconnexion
                </button>
              </>
            ) : (
              /* Guest options */
              <button
                onClick={() => {
                  onNavigate("login");
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-3 font-semibold text-sm text-[#000080] hover:bg-gray-100"
              >
                Connexion
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

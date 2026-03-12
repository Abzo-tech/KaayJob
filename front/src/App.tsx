import { useState } from "react";
import { Header } from "./components/Header";
import { HomePage } from "./components/client/HomePage";
import { LoginPage } from "./components/client/LoginPage";
import { ServiceCategoriesPage } from "./components/client/ServiceCategoriesPage";
import { ServiceProvidersListPage } from "./components/client/ServiceProvidersListPage";
import { ServiceDetailPage } from "./components/client/ServiceDetailPage";
import { BookingPage } from "./components/client/BookingPage";
import { CheckoutPage } from "./components/client/CheckoutPage";
import { UserDashboard } from "./components/client/UserDashboard";
import { ContactPage } from "./components/client/ContactPage";
import { api, AuthResponse, User } from "./lib/api";
import { NotificationProvider } from "./contexts/NotificationContext";
import { Toaster } from "./components/ui/sonner";

// Admin imports
import { AdminSidebar } from "./components/admin/AdminSidebar";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { AdminUsers } from "./components/admin/AdminUsers";
import { AdminServices } from "./components/admin/AdminServices";
import { AdminBookings } from "./components/admin/AdminBookings";
import { AdminAnalytics } from "./components/admin/AdminAnalytics";
import { AdminSettings } from "./components/admin/AdminSettings";
import { AdminSubscriptions } from "./components/admin/AdminSubscriptions";
import { AdminPayments } from "./components/admin/AdminPayments";
import { AdminCategories } from "./components/admin/AdminCategories";

// Prestataire imports
import { PrestataireSidebar } from "./components/prestataire/PrestataireSidebar";
import { PrestataireDashboard } from "./components/prestataire/PrestataireDashboard";
import { PrestataireServices } from "./components/prestataire/PrestataireServices";
import { PrestataireBookings } from "./components/prestataire/PrestataireBookings";
import { PrestataireProfile } from "./components/prestataire/PrestataireProfile";
import { PrestataireSettings } from "./components/prestataire/PrestataireSettings";
import { PrestataireSubscription } from "./components/prestataire/PrestataireSubscription";

export default function App() {
  // Initialiser currentPage basé sur le rôle de l'utilisateur au chargement
  const getInitialPage = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const savedPage = localStorage.getItem("currentPage");

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        // Vérifier si une page a été sauvegardée ET si elle est appropriée pour le rôle actuel
        if (savedPage) {
          const isAdminPage = savedPage.startsWith("admin-");
          const isPrestatairePage = savedPage.startsWith("prestataire-");
          
          // Ne restaurer que les pages appropriées au rôle
          if (user.role === "admin" && isAdminPage) {
            return savedPage;
          } else if (user.role === "prestataire" && isPrestatairePage) {
            return savedPage;
          }
          // Sinon, rediriger vers le dashboard par défaut selon le rôle
        }
        // Sinon, rediriger vers le dashboard approprié selon le rôle
        if (user.role === "admin") {
          return "admin-dashboard";
        } else if (user.role === "prestataire") {
          return "prestataire-dashboard";
        }
        // Pour les clients, rester sur la page d'accueil
        return "home";
      } catch {
        return "home";
      }
    }
    // Pas connecté, aller à home
    return "home";
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage);
  const [user, setUser] = useState<User | null>(() => {
    // Check localStorage on mount
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      try {
        return JSON.parse(userData);
      } catch {
        return null;
      }
    }
    return null;
  });

  const handleLogin = (authData: AuthResponse) => {
    // Save token and user data
    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", JSON.stringify(authData.user));
    setUser(authData.user);

    // Redirect based on role
    if (authData.user.role === "admin") {
      setCurrentPage("admin-dashboard");
    } else if (authData.user.role === "prestataire") {
      setCurrentPage("prestataire-dashboard");
    } else {
      // Client stays on home
      setCurrentPage("home");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("currentPage");
    setUser(null);
    setCurrentPage("home");
  };

  const handleNavigate = (page: string, params?: Record<string, string>) => {
    // Sauvegarder la page actuelle dans localStorage
    localStorage.setItem("currentPage", page);

    // Si des paramètres sont fournis, les inclure dans l'URL
    if (params && Object.keys(params).length > 0) {
      const queryString = new URLSearchParams(params).toString();
      window.history.pushState({}, "", `/${page}?${queryString}`);
      setCurrentPage(`${page}?${queryString}`);
    } else if (page.includes("?")) {
      // Si la page contient déjà des paramètres de requête
      const [pageName, queryString] = page.split("?");
      window.history.pushState({}, "", `/${page}`);
      setCurrentPage(page);
    } else if (page === "home") {
      window.history.pushState({}, "", "/");
      setCurrentPage(page);
    } else {
      window.history.pushState({}, "", `/${page}`);
      setCurrentPage(page);
    }
  };

  // Rendu des pages admin
  const renderAdminPage = () => {
    return (
      <>
        <AdminSidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
        {renderAdminContent()}
      </>
    );
  };

  const renderAdminContent = () => {
    switch (currentPage) {
      case "admin-dashboard":
        return <AdminDashboard />;
      case "admin-users":
        return <AdminUsers />;
      case "admin-services":
        return <AdminServices />;
      case "admin-bookings":
        return <AdminBookings />;
      case "admin-analytics":
        return <AdminAnalytics />;
      case "admin-settings":
        return <AdminSettings />;
      case "admin-subscriptions":
        return <AdminSubscriptions />;
      case "admin-payments":
        return <AdminPayments />;
      case "admin-categories":
        return <AdminCategories />;
      default:
        return <AdminDashboard />;
    }
  };

  // Rendu des pages prestataire
  const renderPrestatairePage = () => {
    return (
      <>
        <PrestataireSidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
        {renderPrestataireContent()}
      </>
    );
  };

  const renderPrestataireContent = () => {
    switch (currentPage) {
      case "prestataire-dashboard":
        return <PrestataireDashboard />;
      case "prestataire-services":
        return <PrestataireServices />;
      case "prestataire-bookings":
        return <PrestataireBookings />;
      case "prestataire-subscription":
        return <PrestataireSubscription />;
      case "prestataire-profile":
        return <PrestataireProfile />;
      case "prestataire-settings":
        return <PrestataireSettings />;
      default:
        return <PrestataireDashboard />;
    }
  };

  const renderCurrentPage = () => {
    // Pages admin
    if (currentPage.startsWith("admin-")) {
      return renderAdminPage();
    }

    // Pages prestataire
    if (currentPage.startsWith("prestataire-")) {
      return renderPrestatairePage();
    }

    // Pages client
    const pageName = currentPage.split("?")[0]; // Extraire le nom de la page sans les paramètres

    // Extraire les paramètres de requête
    const getPageParams = (): Record<string, string> => {
      const params: Record<string, string> = {};
      if (currentPage.includes("?")) {
        const queryString = currentPage.split("?")[1];
        const urlParams = new URLSearchParams(queryString);
        urlParams.forEach((value, key) => {
          params[key] = value;
        });
      }
      return params;
    };

    const pageParams = getPageParams();

    switch (pageName) {
      case "home":
        return <HomePage onNavigate={handleNavigate} />;
      case "login":
        return <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />;
      case "login-provider":
        return <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />;
      case "categories":
        return (
          <ServiceCategoriesPage
            onNavigate={handleNavigate}
            params={pageParams}
          />
        );
      case "service-providers":
        return (
          <ServiceProvidersListPage
            onNavigate={handleNavigate}
            params={pageParams}
          />
        );
      case "service-detail":
        return (
          <ServiceDetailPage onNavigate={handleNavigate} params={pageParams} />
        );
      case "booking":
        return <BookingPage onNavigate={handleNavigate} params={pageParams} />;
      case "checkout":
        return <CheckoutPage onNavigate={handleNavigate} />;
      case "dashboard":
        return <UserDashboard onNavigate={handleNavigate} />;
      case "contact":
        return <ContactPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  const pageName = currentPage.split("?")[0]; // Extraire le nom de la page sans les paramètres
  const isLoginPage = pageName === "login" || pageName === "login-provider";
  const isAdminPage = currentPage.startsWith("admin-");
  const isPrestatairePage = currentPage.startsWith("prestataire-");

  return (
    <NotificationProvider>
      <Toaster />
      <div className="min-h-screen bg-gray-50">
        {/* Hide Header on admin, prestataire, and login pages */}
        {!isAdminPage && !isPrestatairePage && !isLoginPage && (
          <Header
            currentPage={currentPage}
            onNavigate={handleNavigate}
            user={user}
            onLogout={handleLogout}
          />
        )}
        {renderCurrentPage()}
      </div>
    </NotificationProvider>
  );
}

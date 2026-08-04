import { useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import DashboardLayout from "./DashboardLayout";

const AdaptiveDashboardLayout = () => {
  const { user } = useAuth();

  const { navigation, title } = useMemo(() => {
    if (!user) {
      return { navigation: [], title: "Dashboard" };
    }

    // ========== CLIENT ==========
    if (user.role === "client") {
      return {
        title: "Espace Client",
        navigation: [
          {
            name: "Tableau de bord",
            href: "/client/dashboard",
            icon: "📊",
            end: true,
          },
          { name: "Rechercher", href: "/client/search", icon: "🔍" },
          { name: "Mes devis", href: "/client/quotes", icon: "📋" },
          { name: "Mes chantiers", href: "/client/projects", icon: "🏗️" },
          { name: "Messages", href: "/client/messages", icon: "💬" },
        ],
      };
    }

    // ========== TECHNICIEN ==========
    if (user.role === "technician") {
      return {
        title: "Espace Technicien",
        navigation: [
          {
            name: "Tableau de bord",
            href: "/technician/dashboard",
            icon: "📊",
            end: true,
          },
          { name: "Mon profil", href: "/technician/profile", icon: "👤" },
          { name: "Portfolio", href: "/technician/portfolio", icon: "🖼️" },
          { name: "Demandes", href: "/technician/requests", icon: "📥" },
          { name: "Devis", href: "/technician/quotes", icon: "📝" },
          { name: "Calendrier", href: "/technician/calendar", icon: "📅" },
          { name: "Statistiques", href: "/technician/statistics", icon: "📈" },
          { name: "Messages", href: "/technician/messages", icon: "💬" },
        ],
      };
    }

    // ========== ADMIN ==========
    if (user.role === "admin") {
      return {
        title: "Administration",
        navigation: [
          {
            name: "Tableau de bord",
            href: "/admin/dashboard",
            icon: "📊",
            end: true,
          },
          {
            name: "Validation techniciens",
            href: "/admin/technicians",
            icon: "✅",
          },
          { name: "Utilisateurs", href: "/admin/users", icon: "👥" },
          { name: "Métiers", href: "/admin/trades", icon: "🛠️" },
          { name: "Litiges", href: "/admin/disputes", icon: "⚖️" },
          { name: "Statistiques", href: "/admin/statistics", icon: "📈" },
        ],
      };
    }

    return { navigation: [], title: "Dashboard" };
  }, [user]);

  return <DashboardLayout navigation={navigation} title={title} />;
};

export default AdaptiveDashboardLayout;

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Layouts
import AdaptiveDashboardLayout from "../layouts/AdaptiveDashboardLayout";

// Pages publiques
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import AccessDeniedPage from "../pages/AccessDeniedPage";
import NotFoundPage from "../pages/NotFoundPage";

// Auth components (pour les pages qui les utilisent)
import ForgotPassword from "../components/Auth/ForgotPassword";
import RegisterAdmin from "../components/Auth/RegisterAdmin";

// ========== CLIENT ==========
import ClientDashboard from "../components/Client/DashboardClient";
import SearchTechnicians from "../components/Client/SearchTechnician";
import TechnicianProfile from "../components/Client/TechnicianProfile";
import QuoteRequest from "../components/Client/QuoteRequest";
import QuotesComparison from "../components/Client/QuotesComparison";
import ProjectTracking from "../components/Client/ProjectTracking";
import ClientMessages from "../components/Client/Messages";

// ========== TECHNICIAN ==========
import TechnicianDashboard from "../components/Technician/DashboardTechnician";
import ProfileManagement from "../components/Technician/ProfileManagement";
import PortfolioManager from "../components/Technician/PortfolioManager";
import RequestManager from "../components/Technician/RequestManager";
import QuoteManager from "../components/Technician/QuoteManager";
import Calendar from "../components/Technician/Calendar";
import TechnicianStatistics from "../components/Technician/Statistics";
import TechnicianMessages from "../components/Technician/Messages";

// ========== ADMIN ==========
import AdminDashboard from "../components/Admin/DashboardAdmin";
import TechnicianValidation from "../components/Admin/TechnicianValidation";
import UsersManagement from "../components/Admin/UsersManagement";
import TradesManagement from "../components/Admin/TradesManagement";
import DisputesManagement from "../components/Admin/DisputesManagement";
import AdminStatistics from "../components/Admin/Statistics";

// ========== COMPOSANTS DE PROTECTION ==========

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (user) {
    // Redirection selon le rôle
    if (user.role === "admin")
      return <Navigate to="/admin/dashboard" replace />;
    if (user.role === "technician")
      return <Navigate to="/technician/dashboard" replace />;
    return <Navigate to="/client/dashboard" replace />;
  }

  return children;
};

// ========== ROUTES ==========

const AppRoutes = () => {
  return (
    <Routes>
        {/* ========== PUBLIC ========== */}
        <Route path="/" element={<HomePage />} />

        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/register/technician"
          element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/register/client"
          element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          }
        />
        <Route path="/register/admin" element={<PublicOnlyRoute><RegisterAdmin /></PublicOnlyRoute>} />

        <Route
          path="/forgot-password"
          element={
            <PublicOnlyRoute>
              <div className="min-h-screen flex flex-col bg-gray-50">
                <div className="flex-1 flex items-center justify-center px-4 py-12">
                  <div className="w-full max-w-md">
                    <ForgotPassword />
                  </div>
                </div>
              </div>
            </PublicOnlyRoute>
          }
        />

        <Route path="/access-denied" element={<AccessDeniedPage />} />

        {/* ========== CLIENT ========== */}
        <Route
          path="/client"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <AdaptiveDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ClientDashboard />} />
          <Route path="search" element={<SearchTechnicians />} />
          <Route path="technicians/:id" element={<TechnicianProfile />} />
          <Route path="quotes/request" element={<QuoteRequest />} />
          <Route path="quotes" element={<QuotesComparison />} />
          <Route path="projects" element={<ProjectTracking />} />
          <Route path="messages" element={<ClientMessages />} />
        </Route>

        {/* ========== TECHNICIAN ========== */}
        <Route
          path="/technician"
          element={
            <ProtectedRoute allowedRoles={["technician"]}>
              <AdaptiveDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TechnicianDashboard />} />
          <Route path="profile" element={<ProfileManagement />} />
          <Route path="portfolio" element={<PortfolioManager />} />
          <Route path="projects" element={<ProjectTracking />} />
          <Route path="requests" element={<RequestManager />} />
          <Route path="quotes" element={<QuoteManager />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="statistics" element={<TechnicianStatistics />} />
          <Route path="messages" element={<TechnicianMessages />} />
        </Route>

        {/* ========== ADMIN ========== */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdaptiveDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="technicians" element={<TechnicianValidation />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="trades" element={<TradesManagement />} />
          <Route path="disputes" element={<DisputesManagement />} />
          <Route path="statistics" element={<AdminStatistics />} />
        </Route>

        {/* ========== 404 ========== */}
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;

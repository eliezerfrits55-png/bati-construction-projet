import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";

const AccessDeniedPage = () => {
  const { user, logout } = useAuth();

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "technician") return "/technician/dashboard";
    return "/client/dashboard";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          {/* Icon */}
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-5xl">🚫</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Accès refusé
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Vous n’avez pas les permissions nécessaires pour accéder à cette
            page.
            {user && (
              <span className="block mt-2 text-sm">
                Connecté en tant que <strong>{user.role}</strong>
              </span>
            )}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={getDashboardLink()}
              className="inline-flex items-center justify-center px-6 py-3 bg-linear-to-r from-orange-600 to-amber-500 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-amber-600 transition"
            >
              Retour à mon espace
            </Link>

            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition"
            >
              Accueil
            </Link>
          </div>

          {user && (
            <button
              onClick={logout}
              className="mt-6 text-sm text-gray-500 hover:text-orange-600 transition"
            >
              Se déconnecter
            </button>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AccessDeniedPage;

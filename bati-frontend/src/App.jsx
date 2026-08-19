/* eslint-disable react-refresh/only-export-components */
import {
  useState,
  useEffect,
  createContext,
  Suspense,
  StrictMode,
} from "react";
import { useLocation, BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { HelmetProvider } from "react-helmet-async";

// Providers
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { SocketProvider } from "./context/SocketContext";

import { useData } from "./hooks/useData";

// Composants partagés
import LoadingSpinner from "./components/shared/LoadingSpinner";
import Toast from "./components/shared/Toast";

// Routes
import AppRoutes from "./routes/AppRoutes";

// Styles
import "./App.css";

// ============================================================
// CONTEXTES
// ============================================================

// Thème (Dark Mode)
export const ThemeContext = createContext(null);

// Toast global
export const ToastContext = createContext(null);

// ============================================================
// COMPOSANTS INTERNES
// ============================================================

/**
 * Gestionnaire d'erreur global
 * Affiche une UI de fallback en cas d'erreur non catchée
 */
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center max-w-md p-8">
      <p className="text-4xl mb-4">😵</p>
      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        Oups ! Une erreur est survenue
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
        {error.message}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="px-6 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
      >
        Réessayer
      </button>
    </div>
  </div>
);

/**
 * Loader affiché pendant le chargement initial
 */
const AppLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-500 dark:text-gray-400">
        Chargement de Bat-Construction...
      </p>
    </div>
  </div>
);

/**
 * Fournisseur de thème (dark/light mode)
 */
const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem("theme") === "dark";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    try {
      localStorage.setItem("theme", darkMode ? "dark" : "light");
    } catch (error) {
      console.error("[Theme] Impossible d'enregistrer le thème", error);
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Fournisseur de toasts global
 * Évite d'avoir à gérer un state toast dans chaque page
 */
const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Rendu global des toasts */}
      <div className="fixed bottom-6 right-6 z-100 flex flex-col-reverse gap-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={() => removeToast(toast.id)}
            duration={toast.duration}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

/**
 * Initialise les données globales au démarrage
 * Précharge les métiers (données publiques)
 */
const AppInitializer = ({ children }) => {
  const { fetchTrades } = useData();

  useEffect(() => {
    // Charger les métiers au démarrage (données publiques)
    fetchTrades().catch((error) => {
      console.error("[AppInitializer] Impossible de charger les métiers", error);
    });
  }, [fetchTrades]);

  return children;
};

/**
 * Tracking analytique
 * S'intègre avec Google Analytics, Matomo, Plausible, etc.
 */
const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Google Analytics
    if (window.gtag) {
      window.gtag("config", import.meta.env.VITE_GA_ID || "G-XXXXXXXXXX", {
        page_path: location.pathname + location.search,
      });
    }

    // Alternative : Plausible
    if (window.plausible) {
      window.plausible("pageview", {
        u: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
};

/**
 * Affiche la version en mode développement
 */
const AppVersion = () => {
  if (import.meta.env.DEV) {
    return (
      <div className="fixed bottom-1 left-1 text-[10px] text-gray-400 bg-white/80 dark:bg-gray-800/80 px-1.5 py-0.5 rounded z-50 font-mono">
        v{import.meta.env.VITE_APP_VERSION || "0.1.0"} • {import.meta.env.MODE}
      </div>
    );
  }
  return null;
};

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

/**
 * Point d'entrée de l'application Bat-Construction
 *
 * Architecture des providers (ordre important car dépendances) :
 * 1. ErrorBoundary   - Capture les erreurs fatales
 * 2. HelmetProvider  - Gestion des métadonnées <head>
 * 3. ThemeProvider   - Dark/light mode
 * 4. AuthProvider    - Authentification (token, user, login, logout)
 * 5. DataProvider    - Données métier (techniciens, devis, projets)
 * 6. SocketProvider  - Temps réel (messages, notifications)
 * 7. ToastProvider   - Notifications toast globales
 *
 * @returns {JSX.Element}
 */
function App() {
  return (
    <StrictMode>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={(error, info) => {
          // Logger l'erreur vers un service externe en production
          if (import.meta.env.PROD) {
            console.error("[App] Erreur non catchée:", error, info);
            // Exemple : Sentry.captureException(error);
          }
        }}
      >
        <HelmetProvider>
          <ThemeProvider>
            <AuthProvider>
              <DataProvider>
                <SocketProvider>
                  <ToastProvider>
                    <BrowserRouter>
                      <Suspense fallback={<AppLoader />}>
                        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
                          <AppInitializer>
                            <AppRoutes />
                          </AppInitializer>
                        </div>
                        <AnalyticsTracker />
                        <AppVersion />
                      </Suspense>
                    </BrowserRouter>
                  </ToastProvider>
                </SocketProvider>
              </DataProvider>
            </AuthProvider>
          </ThemeProvider>
        </HelmetProvider>
      </ErrorBoundary>
    </StrictMode>
  );
}

export default App;

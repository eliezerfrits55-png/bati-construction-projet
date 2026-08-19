import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Building2, Wrench } from "lucide-react";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import Register from "../components/Auth/Register";
import RegisterTechnician from "../components/Auth/RegisterTechnician";

const RegisterPage = () => {
  const [accountType, setAccountType] = useState(null); // null | 'client' | 'technician'
  const navigate = useNavigate();
  const location = useLocation();

  const isTechnicianRegistration = location.pathname === "/register/technician";
  const isClientRegistration = location.pathname === "/register/client";

  // Si l'utilisateur arrive directement sur /register/technician
  // on peut forcer le type (optionnel)
  // useEffect(() => { ... }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* ========== CHOIX DU TYPE DE COMPTE ========== */}
          {!accountType && !isTechnicianRegistration && !isClientRegistration && (
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_70px_-35px_rgba(15,23,42,0.55)]">
              {/* Header */}
              <div className="relative overflow-hidden bg-slate-950 px-7 py-9 text-center text-white sm:px-10">
                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Créer un compte
                </h1>
                <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
                  Choisissez le type de compte qui vous correspond
                </p>
              </div>

              <div className="space-y-4 p-6 sm:p-8">
                {/* Client */}
                <button
                  onClick={() => setAccountType("client")}
                  className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 p-5 text-left transition-all hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50/60 hover:shadow-lg"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 transition group-hover:bg-orange-500 group-hover:text-white">
                    <Building2 size={27} strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-orange-700">
                      Je suis un client
                    </h3>
                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      Je cherche des techniciens fiables pour mes travaux de
                      construction ou de rénovation.
                    </p>
                  </div>
                </button>

                {/* Technicien */}
                <button
                  onClick={() => setAccountType("technician")}
                  className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 p-5 text-left transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50/60 hover:shadow-lg"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                    <Wrench size={27} strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-700">
                      Je suis un technicien
                    </h3>
                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      Je suis artisan / professionnel du bâtiment et je veux
                      recevoir des demandes de clients.
                    </p>
                  </div>
                </button>
              </div>

              {/* Lien connexion */}
              <div className="border-t border-slate-100 px-6 pb-8 pt-5 text-center sm:px-8">
                <p className="text-sm text-gray-600">
                  Déjà un compte ?{" "}
                  <Link
                    to="/login"
                    className="text-orange-600 font-semibold hover:text-orange-700"
                  >
                    Se connecter
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* ========== FORMULAIRE CLIENT ========== */}
          {(accountType === "client" || isClientRegistration) && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-600 to-amber-500 px-8 py-5 flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-white">
                    Inscription Client
                  </h1>
                  <p className="text-orange-100 text-sm">
                    Créez votre compte en quelques minutes
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (isClientRegistration) {
                      navigate("/register");
                      return;
                    }
                    setAccountType(null);
                  }}
                  className="text-white/80 hover:text-white text-sm font-medium"
                >
                  ← Changer
                </button>
              </div>

              <div className="p-8">
                <Register onSuccess={() => navigate("/client/dashboard")} />
              </div>
            </div>
          )}

          {/* ========== FORMULAIRE TECHNICIEN ========== */}
          {(accountType === "technician" || isTechnicianRegistration) && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-600 to-amber-500 px-8 py-5 flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-white">
                    Inscription Technicien
                  </h1>
                  <p className="text-orange-100 text-sm">
                    Rejoignez la communauté des artisans vérifiés
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (isTechnicianRegistration) {
                      navigate("/register");
                      return;
                    }
                    setAccountType(null);
                  }}
                  className="text-white/80 hover:text-white text-sm font-medium"
                >
                  ← Changer
                </button>
              </div>

              <div className="p-8">
                <RegisterTechnician
                  onSuccess={() => navigate("/technician/dashboard")}
                />
              </div>
            </div>
          )}

          {/* Retour accueil */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-orange-600 transition"
            >
              ← Retour à l’accueil
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RegisterPage;

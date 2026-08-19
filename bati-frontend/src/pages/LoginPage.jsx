import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import Toast from "../components/shared/Toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, adminLogin } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [adminCode, setAdminCode] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Effacer l'erreur du champ quand l'utilisateur tape
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password = "Minimum 6 caractères";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const user = await login(formData.email, formData.password);

      // Redirection selon le rôle
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "technician") {
        navigate("/technician/dashboard");
      } else {
        navigate("/client/dashboard");
      }
    } catch (error) {
      setToast({
        type: "error",
        message: error.message || "Email ou mot de passe incorrect",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdminAccess = async (e) => {
    e.preventDefault();
    if (!adminCode.trim()) return;
    setLoading(true);
    try {
      await adminLogin(adminCode);
      navigate("/admin/dashboard");
    } catch (error) {
      setToast({ type: "error", message: error.message || "Code administrateur incorrect" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-amber-500 px-8 py-6 text-center">
              <h1 className="text-2xl font-bold text-white">Connexion</h1>
              <p className="text-orange-100 mt-1 text-sm">
                Accédez à votre espace Bat-Construction
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Adresse email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ex: jean.dupont@email.com"
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.email
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-300 focus:ring-orange-500"
                  } focus:outline-none focus:ring-2 transition`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full px-4 py-2.5 rounded-lg border pr-12 ${
                      errors.password
                        ? "border-red-400 focus:ring-red-400"
                        : "border-gray-300 focus:ring-orange-500"
                    } focus:outline-none focus:ring-2 transition`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Forgot password */}
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-500 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-amber-600 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Connexion...
                  </>
                ) : (
                  "Se connecter"
                )}
              </button>
            </form>

            <div className="border-t border-gray-100 px-8 py-5">
              {!adminMode ? (
                <button
                  type="button"
                  onClick={() => navigate("/register/admin")}
                  className="w-full text-sm font-semibold text-slate-500 transition hover:text-orange-600"
                >
                  Créer un compte administrateur
                </button>
              ) : (
                <form onSubmit={handleAdminAccess} className="space-y-3">
                  <label htmlFor="admin-code" className="block text-sm font-semibold text-slate-700">
                    Code administrateur
                  </label>
                  <input
                    id="admin-code"
                    type="password"
                    inputMode="numeric"
                    maxLength={5}
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="•••••"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-center tracking-[0.45em] focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                  <button
                    type="submit"
                    disabled={loading || adminCode.length !== 5}
                    className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? "Vérification..." : "Ouvrir l’espace administrateur"}
                  </button>
                </form>
              )}
            </div>

            {/* Footer card */}
            <div className="px-8 pb-8 text-center">
              <p className="text-sm text-gray-600">
                Pas encore de compte ?{" "}
                <Link
                  to="/register"
                  className="text-orange-600 font-semibold hover:text-orange-700"
                >
                  Créer un compte
                </Link>
              </p>
            </div>
          </div>

          {/* Back to home */}
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

      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default LoginPage;

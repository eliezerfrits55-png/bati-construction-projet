import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "../Shared/LoadingSpinner";
import Toast from "../Shared/Toast";

const TRADES = [
  "Plomberie",
  "Électricité",
  "Maçonnerie",
  "Peinture",
  "Carrelage",
  "Menuiserie",
  "Soudure",
  "Climatisation",
  "Architecture",
  "Génie civil",
  "Autre",
];

const RegisterTechnician = ({ onSuccess }) => {
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    city: "",
    trade: "",
    experience_years: "",
    bio: "",
    accept_terms: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) newErrors.first_name = "Prénom requis";
    if (!formData.last_name.trim()) newErrors.last_name = "Nom requis";

    if (!formData.email.trim()) {
      newErrors.email = "Email requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Téléphone requis";
    } else if (!/^(6|2)[0-9]{8}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Numéro camerounais invalide (ex: 6XXXXXXXX)";
    }

    if (!formData.password) {
      newErrors.password = "Mot de passe requis";
    } else if (formData.password.length < 8) {
      newErrors.password = "Minimum 8 caractères";
    }

    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation =
        "Les mots de passe ne correspondent pas";
    }

    if (!formData.city.trim()) newErrors.city = "Ville requise";
    if (!formData.trade) newErrors.trade = "Métier requis";
    if (!formData.experience_years)
      newErrors.experience_years = "Années d’expérience requises";
    if (!formData.accept_terms)
      newErrors.accept_terms = "Vous devez accepter les conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await register({
        ...formData,
        role: "technician",
        experience_years: Number(formData.experience_years),
      });

      setToast({
        type: "success",
        message:
          "Compte créé ! Votre profil sera validé par un administrateur.",
      });
      setTimeout(() => {
        onSuccess?.();
      }, 1500);
    } catch (error) {
      setToast({
        type: "error",
        message:
          error.message || "Une erreur est survenue lors de l’inscription",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nom & Prénom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prénom
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.first_name ? "border-red-400" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-orange-500`}
              placeholder="Jean"
            />
            {errors.first_name && (
              <p className="text-sm text-red-500 mt-1">{errors.first_name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.last_name ? "border-red-400" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-orange-500`}
              placeholder="Mbarga"
            />
            {errors.last_name && (
              <p className="text-sm text-red-500 mt-1">{errors.last_name}</p>
            )}
          </div>
        </div>

        {/* Email & Téléphone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.email ? "border-red-400" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-orange-500`}
              placeholder="artisan@email.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.phone ? "border-red-400" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-orange-500`}
              placeholder="6XX XXX XXX"
            />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Ville & Métier */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ville
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.city ? "border-red-400" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-orange-500`}
              placeholder="Douala, Yaoundé..."
            />
            {errors.city && (
              <p className="text-sm text-red-500 mt-1">{errors.city}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Métier principal
            </label>
            <select
              name="trade"
              value={formData.trade}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.trade ? "border-red-400" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-orange-500`}
            >
              <option value="">Sélectionnez un métier</option>
              {TRADES.map((trade) => (
                <option key={trade} value={trade}>
                  {trade}
                </option>
              ))}
            </select>
            {errors.trade && (
              <p className="text-sm text-red-500 mt-1">{errors.trade}</p>
            )}
          </div>
        </div>

        {/* Années d'expérience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Années d’expérience
          </label>
          <input
            type="number"
            name="experience_years"
            min="0"
            max="50"
            value={formData.experience_years}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.experience_years ? "border-red-400" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-orange-500`}
            placeholder="Ex: 5"
          />
          {errors.experience_years && (
            <p className="text-sm text-red-500 mt-1">
              {errors.experience_years}
            </p>
          )}
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Présentation (optionnel)
          </label>
          <textarea
            name="bio"
            rows="3"
            value={formData.bio}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Parlez brièvement de votre expérience et de vos spécialités..."
          />
        </div>

        {/* Mot de passe */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg border pr-12 ${
                  errors.password ? "border-red-400" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                placeholder="Min. 8 caractères"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmer le mot de passe
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.password_confirmation
                  ? "border-red-400"
                  : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-orange-500`}
              placeholder="Retapez le mot de passe"
            />
            {errors.password_confirmation && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password_confirmation}
              </p>
            )}
          </div>
        </div>

        {/* Conditions */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            name="accept_terms"
            id="accept_terms_tech"
            checked={formData.accept_terms}
            onChange={handleChange}
            className="mt-1 h-4 w-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
          />
          <label htmlFor="accept_terms_tech" className="text-sm text-gray-600">
            J’accepte les{" "}
            <Link to="/terms" className="text-orange-600 hover:underline">
              conditions d’utilisation
            </Link>{" "}
            et je confirme que les informations fournies sont exactes. Mon
            compte sera validé par un administrateur.
          </label>
        </div>
        {errors.accept_terms && (
          <p className="text-sm text-red-500">{errors.accept_terms}</p>
        )}

        {/* Bouton */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-linear-to-r from-orange-600 to-amber-500 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-amber-600 transition disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" />
              Création en cours...
            </>
          ) : (
            "Créer mon compte technicien"
          )}
        </button>
      </form>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default RegisterTechnician;

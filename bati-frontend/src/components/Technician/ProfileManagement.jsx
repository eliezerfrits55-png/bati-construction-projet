import { useState } from "react";
import {
  BadgeCheck,
  BriefcaseBusiness,
  Camera,
  FileImage,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  UserRound,
} from "lucide-react";
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

const Field = ({ label, error, children }) => (
  <div>
    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
      {label}
    </label>
    {children}
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

const ProfileManagement = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    city: user?.city || "",
    quartier: user?.quartier || "",
    trade: user?.trade || "",
    experience_years: user?.experience_years || "",
    bio: user?.bio || "",
    cni_number: user?.cni_number || "",
    identity_photo: user?.identity_photo || "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  const completionItems = [
    formData.first_name,
    formData.last_name,
    formData.phone,
    formData.city,
    formData.trade,
    formData.experience_years,
    formData.bio,
    formData.cni_number,
    formData.identity_photo,
  ];
  const completion = Math.round(
    (completionItems.filter(Boolean).length / completionItems.length) * 100,
  );
  const initials = `${formData.first_name?.[0] || "T"}${
    formData.last_name?.[0] || ""
  }`.toUpperCase();

  const inputClass =
    "w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100";
  const errorClass =
    "w-full rounded-xl border border-red-400 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100";

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    const nextValue = name === "identity_photo" ? files?.[0]?.name || "" : value;
    setFormData((prev) => ({ ...prev, [name]: nextValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.cni_number.trim()) newErrors.cni_number = "Numéro de CNI requis";
    if (!formData.identity_photo) newErrors.identity_photo = "Photo d'identité obligatoire";
    if (!formData.first_name.trim()) newErrors.first_name = "Prénom requis";
    if (!formData.last_name.trim()) newErrors.last_name = "Nom requis";
    if (!formData.phone.trim()) newErrors.phone = "Téléphone requis";
    if (!formData.city.trim()) newErrors.city = "Ville requise";
    if (!formData.trade) newErrors.trade = "Métier requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      setToast({ type: "success", message: "Profil mis à jour avec succès !" });
    } catch {
      setToast({ type: "error", message: "Erreur lors de la mise à jour" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-950 via-blue-950 to-orange-700 p-6 text-white shadow-xl shadow-slate-900/10">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />
        <div className="absolute bottom-0 right-16 h-28 w-28 rounded-full bg-orange-300/20 blur-2xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-white/15 bg-white/15 text-3xl font-black shadow-lg backdrop-blur">
              {initials}
              <button
                type="button"
                className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg transition hover:bg-orange-600"
                aria-label="Changer la photo"
              >
                <Camera size={18} />
              </button>
            </div>
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-orange-100">
                <ShieldCheck size={15} />
                Profil technicien
              </div>
              <h1 className="text-3xl font-black tracking-tight">
                {formData.first_name || "Votre"} {formData.last_name || "profil"}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">
                Valorisez vos compétences, votre zone d’intervention et votre
                expérience pour inspirer confiance aux clients.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:min-w-90">
            {[
              ["Note", "4.8", Star],
              ["Réponse", "2h", Clock3],
              ["Profil", `${completion}%`, BadgeCheck],
            ].map(([label, value, Icon]) => (
              <div
                key={label}
                className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur"
              >
                <Icon className="mb-3 text-orange-200" size={20} />
                <p className="text-xl font-black">{value}</p>
                <p className="text-xs text-white/60">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col gap-3 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Informations professionnelles
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Ces informations seront visibles sur votre profil public.
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
              <CheckCircle2 size={15} />
              {completion}% complété
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Prénom" error={errors.first_name}>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className={errors.first_name ? errorClass : inputClass}
              />
            </Field>
            <Field label="Nom" error={errors.last_name}>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className={errors.last_name ? errorClass : inputClass}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Email">
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500"
              />
            </Field>
            <Field label="Téléphone" error={errors.phone}>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? errorClass : inputClass}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Ville" error={errors.city}>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={errors.city ? errorClass : inputClass}
              />
            </Field>
            <Field label="Quartier">
              <input
                type="text"
                name="quartier"
                value={formData.quartier}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Métier principal" error={errors.trade}>
              <select
                name="trade"
                value={formData.trade}
                onChange={handleChange}
                className={errors.trade ? errorClass : inputClass}
              >
                <option value="">Sélectionnez</option>
                {TRADES.map((trade) => (
                  <option key={trade} value={trade}>
                    {trade}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Années d’expérience">
              <input
                type="number"
                name="experience_years"
                min="0"
                value={formData.experience_years}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Présentation">
            <textarea
              name="bio"
              rows={5}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Décrivez vos spécialités, votre méthode de travail et les types de chantiers que vous prenez en charge."
              className={inputClass}
            />
          </Field>

          <div className="rounded-2xl border border-orange-100 bg-orange-50/60 p-5">
            <div className="mb-4 flex items-start gap-3">
              <ShieldCheck className="mt-0.5 text-orange-600" size={20} />
              <div>
                <h3 className="font-bold text-gray-900">Vérification d'identité</h3>
                <p className="mt-1 text-sm leading-5 text-gray-600">La CNI et la photo d'identité sont obligatoires pour valider votre profil.</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Numéro de CNI *" error={errors.cni_number}>
                <input type="text" name="cni_number" value={formData.cni_number} onChange={handleChange} placeholder="Ex. 123456789" className={errors.cni_number ? errorClass : inputClass} />
              </Field>
              <Field label="Photo d'identité *" error={errors.identity_photo}>
                <label className={`flex cursor-pointer items-center gap-3 rounded-xl border border-dashed px-4 py-3 text-sm transition hover:border-orange-400 hover:bg-white ${errors.identity_photo ? "border-red-400" : "border-gray-300"}`}>
                  <FileImage className="text-orange-600" size={20} />
                  <span className="truncate text-gray-600">{formData.identity_photo || "Choisir une photo"}</span>
                  <input type="file" name="identity_photo" accept="image/*" onChange={handleChange} className="hidden" />
                </label>
              </Field>
            </div>
          </div>

          <div className="flex justify-end border-t border-gray-100 pt-5">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-linear-to-r from-orange-600 to-amber-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-600/20 transition hover:from-orange-700 hover:to-amber-600 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" /> Enregistrement...
                </>
              ) : (
                "Enregistrer les modifications"
              )}
            </button>
          </div>
        </form>

        <aside className="space-y-5">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="bg-linear-to-br from-slate-900 to-blue-900 p-5 text-white">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-xl font-black">
                  {initials}
                </div>
                <div>
                  <p className="text-lg font-black">
                    {formData.first_name || "Prénom"}{" "}
                    {formData.last_name || "Nom"}
                  </p>
                  <p className="text-sm text-white/65">
                    {formData.trade || "Métier principal"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-5">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <BriefcaseBusiness className="text-orange-600" size={18} />
                <span>
                  {formData.experience_years || "0"} année(s) d’expérience
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <MapPin className="text-orange-600" size={18} />
                <span>
                  {[formData.quartier, formData.city]
                    .filter(Boolean)
                    .join(", ") || "Zone d’intervention"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone className="text-orange-600" size={18} />
                <span>{formData.phone || "Téléphone non renseigné"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="text-orange-600" size={18} />
                <span className="truncate">{formData.email || "Email"}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Qualité du profil</h3>
              <span className="text-sm font-bold text-orange-600">
                {completion}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-linear-to-r from-orange-500 to-amber-400"
                style={{ width: `${completion}%` }}
              />
            </div>
            <p className="mt-4 text-sm leading-6 text-gray-500">
              Un profil complet augmente vos chances d’être contacté et facilite
              la comparaison par les clients.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">
            <div className="flex gap-3">
              <UserRound className="mt-0.5 text-orange-600" size={20} />
              <div>
                <h3 className="font-bold text-gray-900">Conseil pro</h3>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Ajoutez une présentation courte et précise: spécialités,
                  délais habituels et types de chantiers traités.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>

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

export default ProfileManagement;

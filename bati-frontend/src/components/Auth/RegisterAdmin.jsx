import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const RegisterAdmin = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", password: "", password_confirmation: "", admin_code: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault(); setError("");
    if (form.password !== form.password_confirmation) return setError("Les mots de passe ne correspondent pas.");
    if (form.admin_code !== "22052") return setError("Le code de validation administrateur est incorrect.");
    setLoading(true);
    try { await register({ ...form, role: "admin", phone: "000000000", city: "Administration" }); navigate("/admin/dashboard"); }
    catch (requestError) { setError(requestError.message || "Impossible de créer le compte administrateur."); }
    finally { setLoading(false); }
  };
  return <div className="min-h-screen bg-slate-950 px-4 py-12"><div className="mx-auto max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"><div className="bg-linear-to-br from-slate-950 to-blue-900 px-7 py-8 text-white"><div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500"><ShieldCheck size={24} /></div><h1 className="text-2xl font-black">Créer un compte administrateur</h1><p className="mt-2 text-sm text-slate-300">Le code de validation est obligatoire pour activer ce compte.</p></div><form onSubmit={submit} className="space-y-4 p-7"><div className="grid gap-4 sm:grid-cols-2">{[["first_name", "Prénom"], ["last_name", "Nom"]].map(([name, label]) => <input key={name} required name={name} value={form[name]} onChange={update} placeholder={label} className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100" />)}</div><input required type="email" name="email" value={form.email} onChange={update} placeholder="Adresse email" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100" /><input required minLength={8} type="password" name="password" value={form.password} onChange={update} placeholder="Mot de passe" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100" /><input required minLength={8} type="password" name="password_confirmation" value={form.password_confirmation} onChange={update} placeholder="Confirmer le mot de passe" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100" /><input required maxLength={5} inputMode="numeric" name="admin_code" value={form.admin_code} onChange={update} placeholder="Code de validation" className="w-full rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-center tracking-[0.4em] outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100" />{error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}<button disabled={loading} className="w-full rounded-xl bg-orange-500 py-3 font-bold text-white transition hover:bg-orange-600 disabled:opacity-60">{loading ? "Création..." : "Valider et créer le compte"}</button><Link to="/login" className="block text-center text-sm font-semibold text-slate-500 hover:text-orange-600">Retour à la connexion</Link></form></div></div>;
};
export default RegisterAdmin;

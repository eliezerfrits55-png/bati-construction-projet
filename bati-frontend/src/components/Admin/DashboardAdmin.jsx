import { Link } from "react-router-dom";
import { Activity, AlertTriangle, CheckCircle2, ClipboardCheck, Building2, Users } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import StatCard from "../Shared/StatCard";

const AdminDashboard = () => {
  const { user } = useAuth();
  const statIcons = {
    "Techniciens en attente": <Activity size={21} />,
    "Utilisateurs totaux": <Users size={21} />,
    "Chantiers ce mois": <Building2 size={21} />,
    "Litiges ouverts": <AlertTriangle size={21} />,
  };

  const stats = [
    { title: "Techniciens en attente", value: 7, icon: "⏳", color: "orange" },
    { title: "Utilisateurs totaux", value: 1284, icon: "👥", color: "blue" },
    { title: "Chantiers ce mois", value: 86, icon: "🏗️", color: "green" },
    { title: "Litiges ouverts", value: 3, icon: "⚖️", color: "red" },
  ];

  const pendingTechnicians = [
    {
      id: 1,
      name: "Alain Tchoumi",
      trade: "Maçonnerie",
      city: "Douala",
      date: "03 août 2026",
    },
    {
      id: 2,
      name: "Grace Ngo",
      trade: "Peinture",
      city: "Yaoundé",
      date: "02 août 2026",
    },
    {
      id: 3,
      name: "Boris Essomba",
      trade: "Électricité",
      city: "Bafoussam",
      date: "01 août 2026",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Nouveau technicien inscrit",
      detail: "Alain Tchoumi (Maçonnerie)",
      time: "Il y a 1h",
    },
    {
      id: 2,
      action: "Litige ouvert",
      detail: "Chantier #452 – Client vs Technicien",
      time: "Il y a 3h",
    },
    {
      id: 3,
      action: "Nouveau métier ajouté",
      detail: "Climatisation",
      time: "Hier",
    },
    {
      id: 4,
      action: "Technicien validé",
      detail: "Paul Nguema (Électricité)",
      time: "Hier",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-7 text-white shadow-xl shadow-slate-900/10 sm:px-8">
        <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-orange-200">
              <Activity size={14} /> Centre de contrôle
            </div>
        <h1 className="text-2xl font-bold text-gray-900">Administration 🛡️</h1>
        <p className="mt-2 text-sm text-slate-300">
          Bienvenue, {user?.first_name || "Admin"}. Voici l’état de la
          plateforme.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-200">
            <CheckCircle2 size={16} /> Système opérationnel
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={statIcons[stat.title] || stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/admin/technicians"
          className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-lg"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 transition group-hover:bg-orange-500 group-hover:text-white">
            <ClipboardCheck size={20} />
            ✅
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">
              Valider techniciens
            </p>
            <p className="text-xs text-gray-500">7 en attente</p>
          </div>
        </Link>

        <Link
          to="/admin/users"
          className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
            <Users size={20} />
            👥
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">Utilisateurs</p>
            <p className="text-xs text-gray-500">Gérer les comptes</p>
          </div>
        </Link>

        <Link
          to="/admin/trades"
          className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-green-300 hover:shadow-lg"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600 transition group-hover:bg-green-600 group-hover:text-white">
            <Building2 size={20} />
            🛠️
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">Métiers</p>
            <p className="text-xs text-gray-500">Gérer les catégories</p>
          </div>
        </Link>

        <Link
          to="/admin/disputes"
          className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-red-300 hover:shadow-lg"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600 transition group-hover:bg-red-600 group-hover:text-white">
            <AlertTriangle size={20} />
            ⚖️
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">Litiges</p>
            <p className="text-xs text-gray-500">3 ouverts</p>
          </div>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Techniciens en attente */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">
              Techniciens à valider
            </h2>
            <Link
              to="/admin/technicians"
              className="text-sm text-orange-600 hover:text-orange-700"
            >
              Voir tout →
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {pendingTechnicians.map((tech) => (
              <div
                key={tech.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium text-gray-900">{tech.name}</p>
                  <p className="text-sm text-gray-500">
                    {tech.trade} • {tech.city}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-2">{tech.date}</p>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
                      Valider
                    </button>
                    <button className="px-3 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
                      Refuser
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activité récente */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Activité récente</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivity.map((item) => (
              <div key={item.id} className="px-6 py-4 flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-orange-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {item.action}
                  </p>
                  <p className="text-sm text-gray-500">{item.detail}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import StatCard from "../Shared/StatCard";
import LocationMap from "../Shared/LocationMap";

const ClientDashboard = () => {
  const { user } = useAuth();

  // Données fictives (à remplacer par de vraies données API)
  const stats = [
    { title: "Devis en cours", value: 3, icon: "📋", color: "orange" },
    { title: "Chantiers actifs", value: 1, icon: "🏗️", color: "blue" },
    { title: "Messages non lus", value: 5, icon: "💬", color: "green" },
    { title: "Techniciens favoris", value: 2, icon: "⭐", color: "purple" },
  ];

  const recentQuotes = [
    {
      id: 1,
      technician: "Jean Mbarga",
      trade: "Plomberie",
      amount: "85 000 FCFA",
      status: "pending",
      date: "02 août 2026",
    },
    {
      id: 2,
      technician: "Paul Nguema",
      trade: "Électricité",
      amount: "120 000 FCFA",
      status: "accepted",
      date: "01 août 2026",
    },
    {
      id: 3,
      technician: "Marie Atangana",
      trade: "Peinture",
      amount: "65 000 FCFA",
      status: "rejected",
      date: "30 juil. 2026",
    },
  ];

  const activeProjects = [
    {
      id: 1,
      title: "Rénovation salle de bain",
      technician: "Jean Mbarga",
      progress: 65,
      status: "in_progress",
    },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      in_progress: "bg-blue-100 text-blue-800",
    };
    const labels = {
      pending: "En attente",
      accepted: "Accepté",
      rejected: "Refusé",
      in_progress: "En cours",
    };
    return (
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="relative isolate min-h-full space-y-8 overflow-hidden rounded-[2rem] p-1">
      <img
        src="/page cllient.jpg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-30 h-full w-full scale-110 object-cover opacity-25 blur-[7px]"
      />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-slate-950/55" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(249,115,22,0.18),transparent_30%),linear-gradient(180deg,rgba(15,23,42,0.2),rgba(15,23,42,0.72))]" />
      {/* Header */}
      <div className="dashboard-reveal relative isolate overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 px-6 py-8 text-white shadow-xl shadow-slate-950/20 backdrop-blur-sm sm:px-8">
        <div className="absolute -right-20 -top-24 -z-10 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="relative">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Bonjour, {user?.first_name || "Client"} 👋
        </h1>
        <p className="text-slate-300 mt-1">
          Voici un aperçu de vos activités sur Bat-Construction
        </p>
        </div>
      </div>

      {/* Stats */}
      <div className="dashboard-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Actions rapides */}
      <div className="dashboard-stagger grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/client/search"
          className="dashboard-card group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/95 p-5 hover:border-orange-300"
        >
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-2xl">
            🔍
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              Rechercher un technicien
            </p>
            <p className="text-sm text-gray-500">
              Trouvez le bon professionnel
            </p>
          </div>
        </Link>

        <Link
          to="/client/quotes/request"
          className="dashboard-card group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/95 p-5 hover:border-blue-300"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
            📝
          </div>
          <div>
            <p className="font-semibold text-gray-900">Demander un devis</p>
            <p className="text-sm text-gray-500">
              Obtenez plusieurs propositions
            </p>
          </div>
        </Link>

        <Link
          to="/client/messages"
          className="dashboard-card group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/95 p-5 hover:border-emerald-300"
        >
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
            💬
          </div>
          <div>
            <p className="font-semibold text-gray-900">Messages</p>
            <p className="text-sm text-gray-500">5 messages non lus</p>
          </div>
        </Link>
      </div>

      <LocationMap role="client" />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Devis récents */}
        <div className="dashboard-card bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Devis récents</h2>
            <Link
              to="/client/quotes"
              className="text-sm text-orange-600 hover:text-orange-700"
            >
              Voir tout →
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentQuotes.map((quote) => (
              <div
                key={quote.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {quote.technician}
                  </p>
                  <p className="text-sm text-gray-500">
                    {quote.trade} • {quote.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{quote.amount}</p>
                  <div className="mt-1">{getStatusBadge(quote.status)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chantiers actifs */}
        <div className="dashboard-card bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Chantiers en cours</h2>
            <Link
              to="/client/projects"
              className="text-sm text-orange-600 hover:text-orange-700"
            >
              Voir tout →
            </Link>
          </div>
          <div className="p-6 space-y-5">
            {activeProjects.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">
                Aucun chantier en cours pour le moment
              </p>
            ) : (
              activeProjects.map((project) => (
                <div key={project.id}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900">
                        {project.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {project.technician}
                      </p>
                    </div>
                    {getStatusBadge(project.status)}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="dashboard-progress bg-orange-500 h-2.5 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    {project.progress}%
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;

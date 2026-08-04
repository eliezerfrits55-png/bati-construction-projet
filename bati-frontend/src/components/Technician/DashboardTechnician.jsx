import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import StatCard from "../Shared/StatCard";

const TechnicianDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { title: "Nouvelles demandes", value: 4, icon: "📥", color: "orange" },
    { title: "Devis envoyés", value: 12, icon: "📝", color: "blue" },
    { title: "Chantiers en cours", value: 3, icon: "🏗️", color: "green" },
    { title: "Note moyenne", value: "4.8", icon: "⭐", color: "purple" },
  ];

  const pendingRequests = [
    {
      id: 1,
      client: "Sophie Kamga",
      trade: "Plomberie",
      city: "Douala",
      date: "Il y a 2h",
      description: "Fuite sous l’évier de la cuisine",
    },
    {
      id: 2,
      client: "Eric Fotso",
      trade: "Électricité",
      city: "Yaoundé",
      date: "Il y a 5h",
      description: "Installation de 3 prises + tableau électrique",
    },
    {
      id: 3,
      client: "Amina Bello",
      trade: "Peinture",
      city: "Douala",
      date: "Hier",
      description: "Peinture intérieure 3 pièces",
    },
  ];

  const upcomingJobs = [
    {
      id: 1,
      title: "Rénovation salle de bain",
      client: "Paul Nguema",
      date: "05 août 2026",
      time: "09:00",
    },
    {
      id: 2,
      title: "Installation électrique",
      client: "Marie Atangana",
      date: "07 août 2026",
      time: "14:00",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bonjour, {user?.first_name || "Technicien"} 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez vos demandes et suivez vos performances
          </p>
        </div>
        <Link
          to="/technician/profile"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          👤 Mon profil
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/technician/requests"
          className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition"
        >
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-2xl">
            📥
          </div>
          <div>
            <p className="font-semibold text-gray-900">Nouvelles demandes</p>
            <p className="text-sm text-gray-500">4 en attente de réponse</p>
          </div>
        </Link>

        <Link
          to="/technician/quotes"
          className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
            📝
          </div>
          <div>
            <p className="font-semibold text-gray-900">Gérer mes devis</p>
            <p className="text-sm text-gray-500">Voir et répondre</p>
          </div>
        </Link>

        <Link
          to="/technician/portfolio"
          className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">
            🖼️
          </div>
          <div>
            <p className="font-semibold text-gray-900">Mon portfolio</p>
            <p className="text-sm text-gray-500">Ajouter des réalisations</p>
          </div>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Demandes en attente */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Demandes en attente</h2>
            <Link
              to="/technician/requests"
              className="text-sm text-orange-600 hover:text-orange-700"
            >
              Voir tout →
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {pendingRequests.map((req) => (
              <div key={req.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{req.client}</p>
                    <p className="text-sm text-gray-500">
                      {req.trade} • {req.city}
                    </p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                      {req.description}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-3">
                    {req.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prochains chantiers */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Prochains chantiers</h2>
            <Link
              to="/technician/calendar"
              className="text-sm text-orange-600 hover:text-orange-700"
            >
              Calendrier →
            </Link>
          </div>
          <div className="p-6 space-y-4">
            {upcomingJobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex flex-col items-center justify-center text-orange-700">
                  <span className="text-xs font-medium">
                    {job.date.split(" ")[0]}
                  </span>
                  <span className="text-sm font-bold">
                    {job.date.split(" ")[1]}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{job.title}</p>
                  <p className="text-sm text-gray-500">
                    {job.client} • {job.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianDashboard;

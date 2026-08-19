import { Link } from "react-router-dom";
import { BriefcaseBusiness, ClipboardList, FileText, Image, Star } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import StatCard from "../shared/StatCard";
import LocationMap from "../shared/LocationMap";

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

  const statIcons = {
    "Nouvelles demandes": <ClipboardList size={21} />,
    "Devis envoyÃ©s": <FileText size={21} />,
    "Chantiers en cours": <BriefcaseBusiness size={21} />,
    "Note moyenne": <Star size={21} fill="currentColor" />,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-7 text-white shadow-xl shadow-slate-900/10 sm:px-8">
        <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-orange-200">Espace professionnel</p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Bonjour, {user?.first_name || "Technicien"} 👋
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Gérez vos demandes et suivez vos performances
          </p>
        </div>
        <Link
          to="/technician/profile"
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
        >
          👤 Mon profil
        </Link>
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

      <LocationMap role="technician" />

      {/* Actions rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/technician/requests"
          className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-lg"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-transparent transition group-hover:bg-orange-500">
            <ClipboardList className="text-orange-600 group-hover:text-white" size={22} />
            📥
          </div>
          <div>
            <p className="font-semibold text-gray-900">Nouvelles demandes</p>
            <p className="text-sm text-gray-500">4 en attente de réponse</p>
          </div>
        </Link>

        <Link
          to="/technician/quotes"
          className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-transparent transition group-hover:bg-blue-600">
            <FileText className="text-blue-600 group-hover:text-white" size={22} />
            📝
          </div>
          <div>
            <p className="font-semibold text-gray-900">Gérer mes devis</p>
            <p className="text-sm text-gray-500">Voir et répondre</p>
          </div>
        </Link>

        <Link
          to="/technician/portfolio"
          className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-lg"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-transparent transition group-hover:bg-purple-600">
            <Image className="text-purple-600 group-hover:text-white" size={22} />
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
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
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
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
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

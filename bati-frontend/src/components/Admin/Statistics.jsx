import StatCard from "../Shared/StatCard";

const AdminStatistics = () => {
  const stats = [
    {
      title: "Utilisateurs totaux",
      value: "1 284",
      icon: "👥",
      color: "blue",
      trend: "+8%",
    },
    {
      title: "Techniciens actifs",
      value: 312,
      icon: "🔧",
      color: "orange",
      trend: "+15",
    },
    {
      title: "Chantiers ce mois",
      value: 86,
      icon: "🏗️",
      color: "green",
      trend: "+12%",
    },
    {
      title: "Volume transactions",
      value: "42M",
      icon: "💰",
      color: "purple",
      trend: "+22%",
    },
  ];

  const roleDistribution = [
    { role: "Clients", count: 945, percent: 74 },
    { role: "Techniciens", count: 312, percent: 24 },
    { role: "Admins", count: 27, percent: 2 },
  ];

  const topTrades = [
    { name: "Maçonnerie", count: 52 },
    { name: "Plomberie", count: 45 },
    { name: "Électricité", count: 38 },
    { name: "Peinture", count: 29 },
    { name: "Carrelage", count: 21 },
  ];

  const monthlyGrowth = [
    { month: "Mar", users: 980, projects: 52 },
    { month: "Avr", users: 1050, projects: 61 },
    { month: "Mai", users: 1120, projects: 70 },
    { month: "Juin", users: 1180, projects: 75 },
    { month: "Juil", users: 1240, projects: 82 },
    { month: "Août", users: 1284, projects: 86 },
  ];

  const maxUsers = Math.max(...monthlyGrowth.map((d) => d.users));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Statistiques plateforme
        </h1>
        <p className="text-gray-600 mt-1">
          Vue d’ensemble de l’activité Bat-Construction
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Répartition des rôles */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-5">
            Répartition des utilisateurs
          </h2>
          <div className="space-y-4">
            {roleDistribution.map((item) => (
              <div key={item.role}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.role}</span>
                  <span className="font-medium">
                    {item.count} ({item.percent}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-orange-500 h-2.5 rounded-full"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top métiers */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-5">
            Top métiers (techniciens)
          </h2>
          <div className="space-y-3">
            {topTrades.map((trade, idx) => (
              <div key={trade.name} className="flex items-center gap-3">
                <span className="w-6 text-sm font-medium text-gray-400">
                  {idx + 1}.
                </span>
                <span className="flex-1 text-gray-900">{trade.name}</span>
                <span className="font-semibold text-orange-600">
                  {trade.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Croissance */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-6">
          Croissance des utilisateurs
        </h2>
        <div className="flex items-end gap-3 h-48">
          {monthlyGrowth.map((d) => (
            <div
              key={d.month}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <div
                className="w-full bg-linear-to-t from-orange-500 to-amber-400 rounded-t-md"
                style={{ height: `${(d.users / maxUsers) * 100}%` }}
                title={`${d.users} utilisateurs`}
              />
              <span className="text-xs text-gray-500">{d.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminStatistics;

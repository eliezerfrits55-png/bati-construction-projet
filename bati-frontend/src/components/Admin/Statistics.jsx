import { useMemo } from "react";
import { TrendingUp } from "lucide-react";
import StatCard from "../shared/StatCard";

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

  const monthlyGrowth = useMemo(() => [
    { month: "Mar", users: 980, projects: 52 },
    { month: "Avr", users: 1050, projects: 61 },
    { month: "Mai", users: 1120, projects: 70 },
    { month: "Juin", users: 1180, projects: 75 },
    { month: "Juil", users: 1240, projects: 82 },
    { month: "Août", users: 1284, projects: 86 },
  ], []);

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
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div><h2 className="font-black tracking-tight text-slate-900">Croissance des utilisateurs</h2><p className="mt-1 text-sm text-slate-500">Évolution mensuelle de l’activité de la plateforme</p></div>
          <div className="hidden items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 sm:flex"><TrendingUp size={15} /> Tendance positive</div>
        </div>
        <div className="relative h-56">
          <svg viewBox="0 0 600 220" className="h-full w-full overflow-visible" role="img" aria-label="Courbe de croissance des utilisateurs">
            <defs><linearGradient id="growthFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#f97316" stopOpacity=".28" /><stop offset="100%" stopColor="#f97316" stopOpacity="0" /></linearGradient></defs>
            {[0, 1, 2, 3].map((line) => <line key={line} x1="0" x2="600" y1={25 + line * 48} y2={25 + line * 48} stroke="#e2e8f0" strokeDasharray="4 6" />)}
            <polyline fill="url(#growthFill)" stroke="none" points={`0,220 ${monthlyGrowth.map((d, index) => `${index * 120},${220 - (d.users / maxUsers) * 180}`).join(" ")} 600,220`} />
            <polyline fill="none" stroke="#f97316" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" points={monthlyGrowth.map((d, index) => `${index * 120},${220 - (d.users / maxUsers) * 180}`).join(" ")} />
            {monthlyGrowth.map((d, index) => <circle key={d.month} cx={index * 120} cy={220 - (d.users / maxUsers) * 180} r="6" fill="white" stroke="#f97316" strokeWidth="3"><title>{`${d.users} utilisateurs`}</title></circle>)}
          </svg>
          <div className="absolute inset-x-0 bottom-0 flex justify-between text-xs font-semibold text-slate-400">
            {monthlyGrowth.map((d) => <span key={d.month}>{d.month}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatistics;

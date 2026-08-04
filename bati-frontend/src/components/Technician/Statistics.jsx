import { useMemo, useState } from "react";
import StatCard from "../Shared/StatCard";

const MONTHLY_DATA = [
  { month: "Mar", quotes: 8, accepted: 5, revenue: 420 },
  { month: "Avr", quotes: 12, accepted: 7, revenue: 680 },
  { month: "Mai", quotes: 10, accepted: 6, revenue: 550 },
  { month: "Juin", quotes: 15, accepted: 10, revenue: 890 },
  { month: "Juil", quotes: 14, accepted: 9, revenue: 970 },
  { month: "Août", quotes: 18, accepted: 12, revenue: 1200 },
];

const TOP_PROJECTS = [
  { id: 1, name: "Rénovation salle de bain", revenue: 420000 },
  { id: 2, name: "Installation électrique villa", revenue: 315000 },
  { id: 3, name: "Pose carrelage cuisine", revenue: 250000 },
];

const TechnicianStatistics = () => {
  const [period, setPeriod] = useState("6m");
  const [loading] = useState(false);

  const periodOptions = [
    { key: "1m", label: "1 mois" },
    { key: "3m", label: "3 mois" },
    { key: "6m", label: "6 mois" },
    { key: "1y", label: "1 an" },
  ];

  const filteredData = useMemo(() => {
    const countMap = { "1m": 1, "3m": 3, "6m": 6, "1y": MONTHLY_DATA.length };
    return MONTHLY_DATA.slice(-countMap[period]);
  }, [period]);

  const maxRevenue = Math.max(...filteredData.map((entry) => entry.revenue));
  const avgRevenue =
    filteredData.reduce((sum, entry) => sum + entry.revenue, 0) / filteredData.length;

  const currentRevenue = filteredData[filteredData.length - 1]?.revenue ?? 0;
  const previousRevenue = filteredData[filteredData.length - 2]?.revenue ?? currentRevenue;

  const getTrend = (current, previous) => {
    if (!previous) return { value: 0, isPositive: true };
    const diff = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(Math.round(diff)),
      isPositive: diff >= 0,
    };
  };

  const revenueTrend = getTrend(currentRevenue, previousRevenue);
  const acceptanceRate = Math.round(
    (filteredData.reduce((sum, entry) => sum + entry.accepted, 0) /
      filteredData.reduce((sum, entry) => sum + entry.quotes, 0)) *
      100
  );

  const stats = [
    {
      title: "Devis envoyés",
      value: filteredData.reduce((sum, entry) => sum + entry.quotes, 0),
      icon: "📝",
      color: "orange",
      trend: "+12%",
    },
    {
      title: "Taux d’acceptation",
      value: `${acceptanceRate}%`,
      icon: "✅",
      color: "green",
      trend: "+5%",
    },
    {
      title: "Chantiers terminés",
      value: 11,
      icon: "🏗️",
      color: "blue",
      trend: "+3",
    },
    {
      title: "Revenu du mois",
      value: `${currentRevenue}k`,
      icon: "💰",
      color: "purple",
      trend: `${revenueTrend.isPositive ? "+" : "-"}${revenueTrend.value}% vs période précédente`,
    },
  ];

  const getRateColor = (rate) => {
    if (rate >= 70) return "text-green-600";
    if (rate >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const handleExport = () => {
    const csv = [
      "Mois,Devis,Acceptés,Taux,Revenu",
      ...filteredData.map(
        (entry) =>
          `${entry.month},${entry.quotes},${entry.accepted},${Math.round((entry.accepted / entry.quotes) * 100)}%,${entry.revenue * 1000}`
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "statistiques.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-24 bg-gray-200 rounded-xl" />
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded-xl" />
        <div className="h-48 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statistiques</h1>
          <p className="text-gray-600 mt-1">Suivez vos performances</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {periodOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => setPeriod(option.key)}
              className={`px-3 py-1.5 rounded-lg text-sm ${
                period === option.key
                  ? "bg-orange-100 text-orange-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {option.label}
            </button>
          ))}
          <button
            onClick={handleExport}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            📥 Exporter CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="font-semibold text-gray-900">Revenus mensuels</h2>
            <div className="text-right text-xs text-gray-500">
              <p>Moyenne: {Math.round(avgRevenue)}k FCFA</p>
            </div>
          </div>

          <div className="relative">
            <div
              className="absolute left-0 right-0 border-t-2 border-dashed border-gray-300"
              style={{ bottom: `${(avgRevenue / maxRevenue) * 100}%` }}
            >
              <span className="absolute -top-5 right-0 text-xs text-gray-400">
                Moy: {Math.round(avgRevenue)}k
              </span>
            </div>

            <div className="flex items-end gap-1 sm:gap-3 h-32 sm:h-48">
              {filteredData.map((entry) => {
                const height = `${(entry.revenue / maxRevenue) * 100}%`;
                return (
                  <div key={entry.month} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs font-medium text-gray-600">
                      {entry.revenue}k
                    </span>
                    <div className="flex items-end h-full w-full">
                      <div
                        className="w-full bg-linear-to-t from-orange-500 to-amber-400 rounded-t-md transition-all hover:from-orange-600"
                        style={{ height }}
                        role="img"
                        aria-label={`${entry.month}: ${entry.revenue}k FCFA`}
                        title={`${entry.month}: ${entry.revenue}k FCFA`}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{entry.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-6">Taux d’acceptation (%)</h2>
          <div className="flex items-end gap-1 sm:gap-3 h-32 sm:h-48">
            {filteredData.map((entry) => {
              const rate = Math.round((entry.accepted / entry.quotes) * 100);
              return (
                <div key={entry.month} className="flex-1 flex flex-col items-center gap-2">
                  <span className={`text-xs font-medium ${getRateColor(rate)}`}>
                    {rate}%
                  </span>
                  <div className="flex items-end h-full w-full">
                    <div
                      className="w-full bg-linear-to-t from-green-500 to-green-400 rounded-t-md transition-all"
                      style={{ height: `${rate}%` }}
                      role="img"
                      aria-label={`${entry.month}: ${rate}% d'acceptation`}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{entry.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="font-semibold text-gray-900">Détail mensuel</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-600">Mois</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-600">Devis envoyés</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-600">Acceptés</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-600">Taux</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-600">Revenu</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredData.map((entry) => {
                  const rate = Math.round((entry.accepted / entry.quotes) * 100);
                  return (
                    <tr key={entry.month} className="hover:bg-gray-50">
                      <td className="px-6 py-3 font-medium">{entry.month}</td>
                      <td className="px-6 py-3">{entry.quotes}</td>
                      <td className="px-6 py-3">{entry.accepted}</td>
                      <td className={`px-6 py-3 font-medium ${getRateColor(rate)}`}>
                        {rate}%
                      </td>
                      <td className="px-6 py-3 font-semibold">
                        {(entry.revenue * 1000).toLocaleString()} FCFA
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Top chantiers du mois</h2>
          <div className="space-y-3">
            {TOP_PROJECTS.map((project) => (
              <div key={project.id} className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">{project.name}</span>
                <span className="font-semibold text-gray-900">
                  {project.revenue.toLocaleString()} FCFA
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianStatistics;

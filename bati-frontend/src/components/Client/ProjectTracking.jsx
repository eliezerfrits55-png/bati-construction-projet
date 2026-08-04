import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const MOCK_PROJECTS = [
  {
    id: 1,
    title: "Rénovation salle de bain",
    technician: "Jean Mbarga",
    trade: "Plomberie",
    status: "in_progress",
    progress: 65,
    startDate: "20 juil. 2026",
    estimatedEnd: "10 août 2026",
    photos: [],
    updates: [
      { date: "02 août", action: "Matériel livré", by: "Jean Mbarga" },
      { date: "28 juil.", action: "Travaux démarrés", by: "Jean Mbarga" },
      { date: "25 juil.", action: "Devis accepté", by: "Vous" },
    ],
    steps: [
      { name: "Devis accepté", done: true },
      { name: "Matériel livré", done: true },
      { name: "Travaux en cours", done: true },
      { name: "Finitions", done: false },
      { name: "Réception", done: false },
    ],
  },
  {
    id: 2,
    title: "Installation électrique",
    technician: "Paul Nguema",
    trade: "Électricité",
    status: "completed",
    progress: 100,
    startDate: "01 juil. 2026",
    estimatedEnd: "15 juil. 2026",
    photos: [],
    updates: [
      { date: "15 juil.", action: "Projet livré", by: "Paul Nguema" },
      { date: "14 juil.", action: "Contrôle qualité", by: "Paul Nguema" },
      { date: "01 juil.", action: "Travaux démarrés", by: "Paul Nguema" },
    ],
    steps: [
      { name: "Devis accepté", done: true },
      { name: "Matériel livré", done: true },
      { name: "Travaux en cours", done: true },
      { name: "Finitions", done: true },
      { name: "Réception", done: true },
    ],
  },
];

const ProjectTracking = () => {
  const [projects] = useState(MOCK_PROJECTS);
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredProjects = useMemo(() => {
    return projects.filter(
      (project) => filterStatus === "all" || project.status === filterStatus
    );
  }, [filterStatus, projects]);

  const getStatusBadge = (status) => {
    const map = {
      in_progress: { label: "En cours", className: "bg-blue-100 text-blue-800" },
      completed: { label: "Terminé", className: "bg-green-100 text-green-800" },
      pending: { label: "En attente", className: "bg-gray-100 text-gray-800" },
    };
    const current = map[status] || map.pending;

    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${current.className}`}>
        {current.label}
      </span>
    );
  };

  const getRemainingDays = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const remaining = Math.ceil((end - now) / (1000 * 60 * 60 * 24));

    if (remaining < 0) return "Délai dépassé";
    if (remaining === 0) return "Aujourd’hui";
    return `${remaining} jour${remaining > 1 ? "s" : ""} restant${remaining > 1 ? "s" : ""}`;
  };

  const isDelayed = (project) =>
    new Date(project.estimatedEnd) < new Date() && project.status !== "completed";

  if (projects.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-3">🏗️</p>
        <p className="text-gray-600 mb-4">Aucun chantier en cours</p>
        <Link to="/client/quotes/request" className="text-orange-600 hover:underline">
          Demander un devis
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mes chantiers</h1>
        <p className="text-gray-600 mt-1">Suivez l’avancement de vos travaux</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterStatus("all")}
          className={`px-3 py-1.5 rounded-full text-sm ${
            filterStatus === "all"
              ? "bg-orange-100 text-orange-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          Tous ({projects.length})
        </button>
        <button
          onClick={() => setFilterStatus("in_progress")}
          className={`px-3 py-1.5 rounded-full text-sm ${
            filterStatus === "in_progress"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          En cours ({projects.filter((project) => project.status === "in_progress").length})
        </button>
        <button
          onClick={() => setFilterStatus("completed")}
          className={`px-3 py-1.5 rounded-full text-sm ${
            filterStatus === "completed"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          Terminés ({projects.filter((project) => project.status === "completed").length})
        </button>
      </div>

      <div className="space-y-5">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
          >
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{project.title}</h2>
                  <p className="text-sm text-gray-500">
                    {project.technician} • {project.trade}
                  </p>
                </div>
                {getStatusBadge(project.status)}
              </div>

              <div className="mb-5">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600">Avancement</span>
                  <span className="font-medium text-gray-900">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5" role="progressbar" aria-valuenow={project.progress} aria-valuemin="0" aria-valuemax="100" aria-label={`Avancement : ${project.progress}%`}>
                  <div
                    className="bg-linear-to-r from-orange-600 to-amber-500 h-2.5 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="relative mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{project.startDate}</span>
                  <span>{project.estimatedEnd}</span>
                </div>
                <div className="relative h-2 bg-gray-100 rounded-full mt-2">
                  <div
                    className="absolute h-2 bg-orange-200 rounded-full"
                    style={{ left: "0%", width: "100%" }}
                  />
                  <div
                    className="absolute h-2 bg-orange-500 rounded-full"
                    style={{ left: "0%", width: `${project.progress}%` }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-orange-500 rounded-full"
                    style={{ left: `${project.progress}%`, marginLeft: "-8px" }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4 mt-5">
                {project.steps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                      step.done
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {step.done ? "✓" : "○"} {step.name}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span>Démarré : {project.startDate}</span>
                <span>Fin estimée : {project.estimatedEnd}</span>
                <span className={isDelayed(project) ? "text-red-600" : "text-gray-500"}>
                  {getRemainingDays(project.estimatedEnd)}
                </span>
              </div>

              {isDelayed(project) && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700 flex items-center gap-2">
                    ⚠️ Ce chantier a dépassé la date de fin estimée
                  </p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-2">Dernières mises à jour</p>
                <div className="space-y-2">
                  {project.updates.map((update, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      <span className="text-gray-500">{update.date}</span>
                      <span className="text-gray-700">{update.action}</span>
                      <span className="text-gray-400">par {update.by}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Photos du chantier</p>
                <div className="flex gap-2 flex-wrap">
                  {(project.photos || []).length === 0 ? (
                    <div className="aspect-video w-full max-w-xs bg-linear-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <p className="text-2xl">📷</p>
                        <p className="text-xs">Photo à venir</p>
                      </div>
                    </div>
                  ) : (
                    project.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Avancement ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80"
                      />
                    ))
                  )}
                </div>
              </div>

              {project.status === "in_progress" && (
                <div className="mt-4 flex gap-2">
                  <button className="px-4 py-2 text-sm bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100">
                    Signaler un problème
                  </button>
                  <Link
                    to={`/client/messages?project=${project.id}`}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Contacter le technicien
                  </Link>
                </div>
              )}

              {project.status === "completed" && (
                <div className="mt-4 flex gap-2">
                  <button className="px-4 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100">
                    Laisser un avis
                  </button>
                  <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                    Signaler un problème
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectTracking;

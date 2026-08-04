import { useState } from "react";
import { Link } from "react-router-dom";
import Toast from "../Shared/Toast";

const MOCK_REQUESTS = [
  {
    id: 1,
    client: "Sophie Kamga",
    title: "Fuite sous l’évier",
    description: "Fuite importante sous l’évier de la cuisine, besoin urgent.",
    city: "Douala",
    trade: "Plomberie",
    budget: "50 000 - 80 000 FCFA",
    urgency: "high",
    date: "Il y a 2h",
    status: "pending",
  },
  {
    id: 2,
    client: "Eric Fotso",
    title: "Installation prises + tableau",
    description:
      "Installation de 3 prises et remplacement du tableau électrique.",
    city: "Yaoundé",
    trade: "Électricité",
    budget: "100 000 - 150 000 FCFA",
    urgency: "normal",
    date: "Il y a 5h",
    status: "pending",
  },
  {
    id: 3,
    client: "Amina Bello",
    title: "Peinture intérieure 3 pièces",
    description: "Peinture complète de salon, chambre et couloir.",
    city: "Douala",
    trade: "Peinture",
    budget: "80 000 FCFA",
    urgency: "low",
    date: "Hier",
    status: "pending",
  },
];

const RequestManager = () => {
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("all");

  const handleRespond = (id, action) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action } : r)),
    );
    setToast({
      type: "success",
      message: action === "accepted" ? "Demande acceptée !" : "Demande refusée",
    });
  };

  const filtered = requests.filter((r) => {
    if (filter === "all") return true;
    return r.status === filter;
  });

  const urgencyBadge = (urgency) => {
    const map = {
      high: "bg-red-100 text-red-700",
      normal: "bg-yellow-100 text-yellow-700",
      low: "bg-gray-100 text-gray-600",
    };
    const labels = { high: "Urgent", normal: "Normal", low: "Pas urgent" };
    return (
      <span
        className={`px-2 py-0.5 rounded text-xs font-medium ${map[urgency]}`}
      >
        {labels[urgency]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Demandes reçues</h1>
        <p className="text-gray-600 mt-1">
          Gérez les demandes de devis des clients
        </p>
      </div>

      {/* Filtres */}
      <div className="flex gap-2">
        {[
          { key: "all", label: "Toutes" },
          { key: "pending", label: "En attente" },
          { key: "accepted", label: "Acceptées" },
          { key: "rejected", label: "Refusées" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === f.key
                ? "bg-orange-100 text-orange-700"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((req) => (
          <div
            key={req.id}
            className="bg-white rounded-xl border border-gray-200 p-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{req.title}</h3>
                  {urgencyBadge(req.urgency)}
                </div>
                <p className="text-sm text-gray-500">
                  {req.client} • {req.city} • {req.trade}
                </p>
                <p className="text-sm text-gray-600 mt-2">{req.description}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                  <span>Budget : {req.budget}</span>
                  <span>{req.date}</span>
                </div>
              </div>

              {req.status === "pending" && (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleRespond(req.id, "accepted")}
                    className="px-4 py-2 text-sm font-medium bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                  >
                    Accepter
                  </button>
                  <Link
                    to={`/technician/quotes?request=${req.id}`}
                    className="px-4 py-2 text-sm font-medium bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200"
                  >
                    Faire un devis
                  </Link>
                  <button
                    onClick={() => handleRespond(req.id, "rejected")}
                    className="px-4 py-2 text-sm font-medium bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                  >
                    Refuser
                  </button>
                </div>
              )}

              {req.status !== "pending" && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    req.status === "accepted"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {req.status === "accepted" ? "Acceptée" : "Refusée"}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-3">📥</p>
          <p>Aucune demande pour le moment</p>
        </div>
      )}

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

export default RequestManager;

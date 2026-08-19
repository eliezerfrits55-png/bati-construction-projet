import { useState } from "react";
import Toast from "../shared/Toast";

const MOCK_DISPUTES = [
  {
    id: 1,
    project: "Rénovation salle de bain",
    client: "Sophie Kamga",
    technician: "Jean Mbarga",
    reason: "Retard important sur le planning",
    description:
      "Le chantier devait être terminé le 25 juillet, toujours pas fini au 3 août.",
    status: "open",
    date: "03 août 2026",
    amount: 85000,
  },
  {
    id: 2,
    project: "Installation électrique",
    client: "Eric Fotso",
    technician: "Paul Nguema",
    reason: "Qualité des travaux insatisfaisante",
    description: "Plusieurs prises mal fixées, tableau non conforme.",
    status: "open",
    date: "01 août 2026",
    amount: 120000,
  },
  {
    id: 3,
    project: "Peinture intérieure",
    client: "Amina Bello",
    technician: "Marie Atangana",
    reason: "Litige sur le montant final",
    description: "Supplément non annoncé de 25 000 FCFA.",
    status: "resolved",
    date: "20 juil. 2026",
    amount: 75000,
  },
];

const DisputesManagement = () => {
  const [disputes, setDisputes] = useState(MOCK_DISPUTES);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("all");

  const filtered = disputes.filter((d) => {
    if (filter === "all") return true;
    return d.status === filter;
  });

  const resolve = (id, resolution) => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "resolved" } : d)),
    );
    setSelected(null);
    setToast({ type: "success", message: `Litige résolu : ${resolution}` });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Gestion des litiges
        </h1>
        <p className="text-gray-600 mt-1">
          {disputes.filter((d) => d.status === "open").length} litige(s)
          ouvert(s)
        </p>
      </div>

      <div className="flex gap-2">
        {[
          { key: "all", label: "Tous" },
          { key: "open", label: "Ouverts" },
          { key: "resolved", label: "Résolus" },
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

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3">
          {filtered.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelected(d)}
              className={`w-full text-left p-4 rounded-xl border transition ${
                selected?.id === d.id
                  ? "border-orange-400 bg-orange-50"
                  : "border-gray-200 bg-white hover:border-orange-200"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-gray-900 truncate">
                  {d.project}
                </p>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    d.status === "open"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {d.status === "open" ? "Ouvert" : "Résolu"}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {d.client} vs {d.technician}
              </p>
              <p className="text-xs text-gray-400 mt-1">{d.date}</p>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selected.project}
                </h2>
                <p className="text-gray-500 mt-1">{selected.reason}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Client</p>
                  <p className="font-medium">{selected.client}</p>
                </div>
                <div>
                  <p className="text-gray-500">Technicien</p>
                  <p className="font-medium">{selected.technician}</p>
                </div>
                <div>
                  <p className="text-gray-500">Montant concerné</p>
                  <p className="font-medium">
                    {selected.amount.toLocaleString()} FCFA
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Date</p>
                  <p className="font-medium">{selected.date}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Description</p>
                <p className="text-gray-700 bg-gray-50 rounded-lg p-4">
                  {selected.description}
                </p>
              </div>

              {selected.status === "open" && (
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => resolve(selected.id, "En faveur du client")}
                    className="px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition text-sm"
                  >
                    Trancher pour le client
                  </button>
                  <button
                    onClick={() =>
                      resolve(selected.id, "En faveur du technicien")
                    }
                    className="px-4 py-2.5 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition text-sm"
                  >
                    Trancher pour le technicien
                  </button>
                  <button
                    onClick={() => resolve(selected.id, "Accord amiable")}
                    className="px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition text-sm"
                  >
                    Accord amiable
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
              Sélectionnez un litige pour voir les détails
            </div>
          )}
        </div>
      </div>

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

export default DisputesManagement;

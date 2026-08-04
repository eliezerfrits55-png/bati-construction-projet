import { useState } from "react";
import Toast from "../Shared/Toast";

const MOCK_PENDING = [
  {
    id: 1,
    name: "Alain Tchoumi",
    email: "alain.tchoumi@email.com",
    phone: "677123456",
    trade: "Maçonnerie",
    city: "Douala",
    experience: 10,
    bio: "Maçon expérimenté, spécialisé en fondations et élévation.",
    documents: ["CNI", "Attestation de formation"],
    date: "03 août 2026",
  },
  {
    id: 2,
    name: "Grace Ngo",
    email: "grace.ngo@email.com",
    phone: "699887766",
    trade: "Peinture",
    city: "Yaoundé",
    experience: 6,
    bio: "Peintre professionnelle, intérieur et extérieur.",
    documents: ["CNI", "Portfolio"],
    date: "02 août 2026",
  },
  {
    id: 3,
    name: "Boris Essomba",
    email: "boris.essomba@email.com",
    phone: "655443322",
    trade: "Électricité",
    city: "Bafoussam",
    experience: 4,
    bio: "Électricien certifié, installations domestiques et industrielles.",
    documents: ["CNI"],
    date: "01 août 2026",
  },
];

const TechnicianValidation = () => {
  const [technicians, setTechnicians] = useState(MOCK_PENDING);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);

  const handleAction = (id, action) => {
    setTechnicians((prev) => prev.filter((t) => t.id !== id));
    setSelected(null);
    setToast({
      type: "success",
      message:
        action === "approve"
          ? "Technicien validé avec succès !"
          : "Technicien refusé",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Validation des techniciens
        </h1>
        <p className="text-gray-600 mt-1">
          {technicians.length} technicien{technicians.length > 1 ? "s" : ""} en
          attente de validation
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Liste */}
        <div className="lg:col-span-1 space-y-3">
          {technicians.map((tech) => (
            <button
              key={tech.id}
              onClick={() => setSelected(tech)}
              className={`w-full text-left p-4 rounded-xl border transition ${
                selected?.id === tech.id
                  ? "border-orange-400 bg-orange-50"
                  : "border-gray-200 bg-white hover:border-orange-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-semibold">
                  {tech.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {tech.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {tech.trade} • {tech.city}
                  </p>
                </div>
              </div>
            </button>
          ))}

          {technicians.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-3xl mb-2">✅</p>
              <p>Aucune validation en attente</p>
            </div>
          )}
        </div>

        {/* Détail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-2xl">
                    {selected.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selected.name}
                    </h2>
                    <p className="text-gray-500">
                      {selected.trade} • {selected.city}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{selected.date}</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{selected.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">Téléphone</p>
                  <p className="font-medium text-gray-900">{selected.phone}</p>
                </div>
                <div>
                  <p className="text-gray-500">Expérience</p>
                  <p className="font-medium text-gray-900">
                    {selected.experience} ans
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Documents fournis</p>
                  <p className="font-medium text-gray-900">
                    {selected.documents.join(", ")}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Présentation</p>
                <p className="text-gray-700">{selected.bio}</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleAction(selected.id, "approve")}
                  className="flex-1 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                >
                  ✓ Valider
                </button>
                <button
                  onClick={() => handleAction(selected.id, "reject")}
                  className="flex-1 py-2.5 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition"
                >
                  ✕ Refuser
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
              Sélectionnez un technicien pour voir les détails
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

export default TechnicianValidation;

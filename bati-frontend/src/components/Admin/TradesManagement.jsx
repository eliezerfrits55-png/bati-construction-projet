import { useState } from "react";
import Toast from "../Shared/Toast";

const MOCK_TRADES = [
  { id: 1, name: "Plomberie", technicians: 45, icon: "🔧", active: true },
  { id: 2, name: "Électricité", technicians: 38, icon: "⚡", active: true },
  { id: 3, name: "Maçonnerie", technicians: 52, icon: "🧱", active: true },
  { id: 4, name: "Peinture", technicians: 29, icon: "🎨", active: true },
  { id: 5, name: "Carrelage", technicians: 21, icon: "⬜", active: true },
  { id: 6, name: "Menuiserie", technicians: 17, icon: "🪚", active: true },
  { id: 7, name: "Soudure", technicians: 12, icon: "🔥", active: true },
  { id: 8, name: "Climatisation", technicians: 15, icon: "❄️", active: true },
  { id: 9, name: "Architecture", technicians: 8, icon: "📐", active: true },
];

const TradesManagement = () => {
  const [trades, setTrades] = useState(MOCK_TRADES);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", icon: "" });
  const [toast, setToast] = useState(null);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const newTrade = {
      id: Date.now(),
      name: formData.name,
      icon: formData.icon || "🛠️",
      technicians: 0,
      active: true,
    };
    setTrades([...trades, newTrade]);
    setFormData({ name: "", icon: "" });
    setShowForm(false);
    setToast({ type: "success", message: "Métier ajouté !" });
  };

  const toggleActive = (id) => {
    setTrades((prev) =>
      prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t)),
    );
  };

  const handleDelete = (id) => {
    setTrades((prev) => prev.filter((t) => t.id !== id));
    setToast({ type: "success", message: "Métier supprimé" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestion des métiers
          </h1>
          <p className="text-gray-600 mt-1">
            {trades.length} métiers configurés
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 bg-linear-to-r from-orange-600 to-amber-500 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-amber-600 transition"
        >
          {showForm ? "Annuler" : "+ Ajouter un métier"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col sm:flex-row gap-3"
        >
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nom du métier"
            required
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="text"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            placeholder="Icône (emoji)"
            className="w-32 px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition"
          >
            Ajouter
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {trades.map((trade) => (
          <div
            key={trade.id}
            className={`bg-white rounded-xl border p-5 flex items-center gap-4 ${
              trade.active ? "border-gray-200" : "border-gray-100 opacity-60"
            }`}
          >
            <div className="text-3xl">{trade.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900">{trade.name}</p>
              <p className="text-sm text-gray-500">
                {trade.technicians} techniciens
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => toggleActive(trade.id)}
                className={`text-xs px-2 py-1 rounded ${
                  trade.active
                    ? "bg-green-50 text-green-600"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {trade.active ? "Actif" : "Inactif"}
              </button>
              <button
                onClick={() => handleDelete(trade.id)}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Suppr.
              </button>
            </div>
          </div>
        ))}
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

export default TradesManagement;

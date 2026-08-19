import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrickWall, Flame, Hammer, Palette, Ruler, Snowflake, Square, Wrench, Zap } from "lucide-react";
import Toast from "../shared/Toast";

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
  const navigate = useNavigate();
  const [trades, setTrades] = useState(MOCK_TRADES);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", icon: "" });
  const [toast, setToast] = useState(null);
  const tradeIcons = [Wrench, Zap, BrickWall, Palette, Square, Hammer, Flame, Snowflake, Ruler];

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
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-7 text-white shadow-xl shadow-slate-900/10 sm:px-8">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-orange-200">Catalogue de services</p>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Gestion des métiers
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            {trades.length} métiers configurés
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-xl bg-orange-500 px-4 py-2.5 font-bold text-white shadow-lg shadow-orange-950/20 transition hover:bg-orange-600"
        >
          {showForm ? "Annuler" : "+ Ajouter un métier"}
        </button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row"
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
            onClick={() => navigate(`/admin/users?trade=${encodeURIComponent(trade.name)}`)}
            role="button"
            tabIndex={0}
            className={`group flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
              trade.active ? "border-slate-200" : "border-slate-100 opacity-60"
            }`}
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 transition group-hover:bg-orange-500 group-hover:text-white">
              {(() => { const Icon = tradeIcons[(trade.id - 1) % tradeIcons.length] || Wrench; return <Icon size={25} strokeWidth={1.8} />; })()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900">{trade.name}</p>
              <p className="text-sm text-gray-500">
                {trade.technicians} techniciens
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <button
                onClick={(event) => { event.stopPropagation(); toggleActive(trade.id); }}
                className={`text-xs px-2 py-1 rounded ${
                  trade.active
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {trade.active ? "Actif" : "Inactif"}
              </button>
              <button
                onClick={(event) => { event.stopPropagation(); handleDelete(trade.id); }}
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

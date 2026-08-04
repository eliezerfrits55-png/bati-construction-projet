import { useState } from "react";
import Toast from "../Shared/Toast";

const MOCK_PORTFOLIO = [
  {
    id: 1,
    title: "Rénovation salle de bain complète",
    description: "Installation complète + carrelage",
    date: "Juin 2026",
  },
  {
    id: 2,
    title: "Réparation fuite majeure",
    description: "Détection et réparation canalisation",
    date: "Mai 2026",
  },
  {
    id: 3,
    title: "Installation cuisine moderne",
    description: "Plomberie cuisine neuve",
    date: "Avril 2026",
  },
];

const PortfolioManager = () => {
  const [items, setItems] = useState(MOCK_PORTFOLIO);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [toast, setToast] = useState(null);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newItem = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      date: new Date().toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
      }),
    };
    setItems([newItem, ...items]);
    setFormData({ title: "", description: "" });
    setShowForm(false);
    setToast({ type: "success", message: "Réalisation ajoutée !" });
  };

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
    setToast({ type: "success", message: "Réalisation supprimée" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mon portfolio</h1>
          <p className="text-gray-600 mt-1">
            Montrez vos meilleures réalisations
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 bg-linear-to-r from-orange-600 to-amber-500 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-amber-600 transition"
        >
          {showForm ? "Annuler" : "+ Ajouter une réalisation"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-xl border border-gray-200 p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Ex: Rénovation salle de bain"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Décrivez brièvement le projet..."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photos
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition cursor-pointer">
              <p className="text-3xl mb-2">📷</p>
              <p className="text-sm text-gray-500">
                Cliquez ou glissez vos photos ici
              </p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG • max 5 Mo</p>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition"
            >
              Ajouter
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden group"
          >
            <div className="aspect-video bg-gray-100 flex items-center justify-center text-gray-400">
              <span className="text-4xl">🖼️</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {item.description}
              </p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-400">{item.date}</span>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-xs text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-3">🖼️</p>
          <p>Aucune réalisation pour le moment</p>
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

export default PortfolioManager;

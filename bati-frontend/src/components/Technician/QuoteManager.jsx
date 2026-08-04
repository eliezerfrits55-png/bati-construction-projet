import { useMemo, useState } from "react";
import Toast from "../Shared/Toast";

const MOCK_QUOTES = [
  { id: 1, client: "Sophie Kamga", project: "Fuite sous l’évier", amount: 65000, delay: "2 jours", status: "sent", date: "03 août 2026" },
  { id: 2, client: "Eric Fotso", project: "Installation prises", amount: 135000, delay: "5 jours", status: "accepted", date: "01 août 2026" },
  { id: 3, client: "Amina Bello", project: "Peinture 3 pièces", amount: 75000, delay: "4 jours", status: "rejected", date: "28 juil. 2026" },
];

const PENDING_REQUESTS = [
  { id: 1, client: "Sophie Kamga", title: "Fuite sous l’évier" },
  { id: 2, client: "Eric Fotso", title: "Installation prises + tableau" },
];

const QuoteManager = () => {
  const [quotes] = useState(MOCK_QUOTES);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [selectedRequest, setSelectedRequest] = useState("");
  const [lineItems, setLineItems] = useState([{ description: "", quantity: 1, unitPrice: 0 }]);
  const [formData, setFormData] = useState({ amount: "", delay: "", description: "" });
  const [toast, setToast] = useState(null);

  const filteredQuotes = useMemo(
    () =>
      quotes
        .filter((quote) => filter === "all" || quote.status === filter)
        .sort((a, b) => {
          if (sortBy === "amount") return b.amount - a.amount;
          if (sortBy === "date") return new Date(b.date) - new Date(a.date);
          return 0;
        }),
    [filter, quotes, sortBy]
  );

  const totalAmount = lineItems.reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.unitPrice || 0),
    0
  );

  const getStatusBadge = (status) => {
    const map = {
      sent: { label: "Envoyé", className: "bg-blue-100 text-blue-700" },
      accepted: { label: "Accepté", className: "bg-green-100 text-green-700" },
      rejected: { label: "Refusé", className: "bg-red-100 text-red-700" },
    };
    const current = map[status] || map.sent;
    return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${current.className}`}>{current.label}</span>;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedRequest) {
      setToast({ type: "error", message: "Sélectionnez une demande associée." });
      return;
    }
    setShowForm(false);
    setSelectedRequest("");
    setLineItems([{ description: "", quantity: 1, unitPrice: 0 }]);
    setFormData({ amount: "", delay: "", description: "" });
    setToast({ type: "success", message: "Devis envoyé avec succès !" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes devis</h1>
          <p className="text-gray-600 mt-1">Créez et suivez vos propositions</p>
        </div>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="px-4 py-2.5 bg-linear-to-r from-orange-600 to-amber-500 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-amber-600 transition"
        >
          {showForm ? "Annuler" : "+ Nouveau devis"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h3 className="font-semibold text-gray-900">Créer un devis</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Demande associée *</label>
            <select
              value={selectedRequest}
              onChange={(e) => setSelectedRequest(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Sélectionnez une demande</option>
              {PENDING_REQUESTS.map((request) => (
                <option key={request.id} value={request.id}>{request.client} - {request.title}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} placeholder="Montant (FCFA)" className="w-full px-4 py-2.5 rounded-lg border border-gray-300" />
            <input type="text" value={formData.delay} onChange={(e) => setFormData({ ...formData, delay: e.target.value })} placeholder="Délai estimé" className="w-full px-4 py-2.5 rounded-lg border border-gray-300" />
          </div>
          <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Détails / Conditions" className="w-full px-4 py-2.5 rounded-lg border border-gray-300" />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Postes du devis</h4>
              <button type="button" onClick={() => setLineItems((prev) => [...prev, { description: "", quantity: 1, unitPrice: 0 }])} className="text-sm text-orange-600">+ Ajouter une ligne</button>
            </div>
            {lineItems.map((item, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-6 gap-2">
                <input className="sm:col-span-3 w-full px-4 py-2.5 rounded-lg border border-gray-300" value={item.description} onChange={(e) => setLineItems((prev) => prev.map((line, lineIndex) => lineIndex === index ? { ...line, description: e.target.value } : line))} placeholder="Description" />
                <input className="w-full px-4 py-2.5 rounded-lg border border-gray-300" type="number" value={item.quantity} onChange={(e) => setLineItems((prev) => prev.map((line, lineIndex) => lineIndex === index ? { ...line, quantity: e.target.value } : line))} placeholder="Qté" />
                <input className="w-full px-4 py-2.5 rounded-lg border border-gray-300" type="number" value={item.unitPrice} onChange={(e) => setLineItems((prev) => prev.map((line, lineIndex) => lineIndex === index ? { ...line, unitPrice: e.target.value } : line))} placeholder="Prix unit." />
                <div className="sm:col-span-1 flex items-center justify-end font-semibold">{(Number(item.quantity || 0) * Number(item.unitPrice || 0)).toLocaleString()} FCFA</div>
              </div>
            ))}
            <p className="text-right font-bold">Total : {totalAmount.toLocaleString()} FCFA</p>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="px-5 py-2.5 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition">Envoyer le devis</button>
          </div>
        </form>
      )}

      <div className="flex flex-wrap gap-2 items-center">
        {["all", "sent", "accepted", "rejected"].map((value) => (
          <button key={value} onClick={() => setFilter(value)} className={`px-3 py-1.5 rounded-lg text-sm ${filter === value ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-600"}`}>{value === "all" ? "Tous" : value === "sent" ? "Envoyés" : value === "accepted" ? "Acceptés" : "Refusés"}</button>
        ))}
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="ml-auto px-3 py-1.5 rounded-lg border border-gray-300 text-sm">
          <option value="date">Plus récent</option>
          <option value="amount">Montant</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Client / Projet</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Montant</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Délai</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Statut</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredQuotes.map((q) => (
                <tr key={q.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4"><p className="font-medium text-gray-900">{q.client}</p><p className="text-xs text-gray-500">{q.project}</p></td>
                  <td className="px-6 py-4 font-semibold">{q.amount.toLocaleString()} FCFA</td>
                  <td className="px-6 py-4 text-gray-600">{q.delay}</td>
                  <td className="px-6 py-4">{getStatusBadge(q.status)}</td>
                  <td className="px-6 py-4 text-gray-500">{q.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export default QuoteManager;

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const MOCK_QUOTES = [
  {
    id: 1,
    requestTitle: "Rénovation salle de bain",
    technician: "Jean Mbarga",
    trade: "Plomberie",
    amount: 85000,
    delay: "5 jours",
    status: "pending",
    date: "02 août 2026",
    details: "Remplacement des sanitaires, robinetterie et finitions.",
    conditions: "Garantie 6 mois, matériaux standards inclus.",
  },
  {
    id: 2,
    requestTitle: "Rénovation salle de bain",
    technician: "Paul Nguema",
    trade: "Plomberie",
    amount: 92000,
    delay: "4 jours",
    status: "pending",
    date: "02 août 2026",
    details: "Installation complète avec optimisation des évacuations.",
    conditions: "Déplacement inclus, travaux sous réserve de validation du chantier.",
  },
  {
    id: 3,
    requestTitle: "Installation électrique",
    technician: "Boris Essomba",
    trade: "Électricité",
    amount: 120000,
    delay: "7 jours",
    status: "accepted",
    date: "28 juil. 2026",
    details: "Mise aux normes, pose prises et éclairage intérieur.",
    conditions: "Démarrage sous 72h après validation du devis.",
  },
];

const QuotesComparison = () => {
  const [quotes] = useState(MOCK_QUOTES);
  const [sortBy, setSortBy] = useState("date");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const bestQuote = useMemo(() => {
    return quotes.filter((quote) => quote.status === "pending").sort((a, b) => a.amount - b.amount)[0];
  }, [quotes]);

  const groupedQuotes = useMemo(() => {
    return quotes.reduce((accumulator, quote) => {
      const key = quote.requestTitle;
      if (!accumulator[key]) accumulator[key] = [];
      accumulator[key].push(quote);
      return accumulator;
    }, {});
  }, [quotes]);

  const getStatusBadge = (status) => {
    const map = {
      pending: { label: "En attente", className: "bg-yellow-100 text-yellow-800" },
      accepted: { label: "Accepté", className: "bg-green-100 text-green-800" },
      rejected: { label: "Refusé", className: "bg-red-100 text-red-800" },
    };
    const current = map[status] || map.pending;

    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${current.className}`}>
        {current.label}
      </span>
    );
  };

  const formatDelay = (delay) => {
    const days = parseInt(delay, 10);
    if (!Number.isNaN(days)) {
      const estimatedDate = new Date();
      estimatedDate.setDate(estimatedDate.getDate() + days);
      return `${delay} (≈ ${estimatedDate.toLocaleDateString("fr-FR")})`;
    }
    return delay;
  };

  const handleExportPDF = () => {};

  if (quotes.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-3">📋</p>
        <p className="text-gray-600 mb-4">Aucun devis pour le moment</p>
        <Link to="/client/quotes/request" className="text-orange-600 hover:underline">
          Faire une demande de devis
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes devis</h1>
          <p className="text-gray-600 mt-1">Comparez et gérez vos devis reçus</p>
        </div>
        <Link
          to="/client/quotes/request"
          className="inline-flex items-center px-4 py-2.5 bg-linear-to-r from-orange-600 to-amber-500 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-amber-600 transition"
        >
          + Nouvelle demande
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterStatus("all")}
          className={`px-3 py-1.5 rounded-full text-sm ${
            filterStatus === "all" ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-600"
          }`}
        >
          Tous ({quotes.length})
        </button>
        <button
          onClick={() => setFilterStatus("pending")}
          className={`px-3 py-1.5 rounded-full text-sm ${
            filterStatus === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"
          }`}
        >
          En attente ({quotes.filter((quote) => quote.status === "pending").length})
        </button>
        <button
          onClick={() => setFilterStatus("accepted")}
          className={`px-3 py-1.5 rounded-full text-sm ${
            filterStatus === "accepted" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
          }`}
        >
          Acceptés ({quotes.filter((quote) => quote.status === "accepted").length})
        </button>
      </div>

      <div className="flex flex-wrap gap-2 items-center text-sm">
        <span className="text-gray-500">Trier par :</span>
        <button
          onClick={() => setSortBy("date")}
          className={`px-3 py-1.5 rounded-full ${sortBy === "date" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"}`}
        >
          Date
        </button>
        <button
          onClick={() => setSortBy("amount")}
          className={`px-3 py-1.5 rounded-full ${sortBy === "amount" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"}`}
        >
          Montant
        </button>
      </div>

      <div className="space-y-5">
        {Object.entries(groupedQuotes).map(([title, group]) => (
          <div key={title} className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

            <div className="block lg:hidden space-y-4">
              {group
                .filter((quote) => filterStatus === "all" || quote.status === filterStatus)
                .map((quote) => (
                  <div key={quote.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{quote.technician}</p>
                        <p className="text-xs text-gray-500">{quote.trade}</p>
                      </div>
                      {getStatusBadge(quote.status)}
                    </div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-500">Montant</span>
                      <span className="font-semibold text-gray-900">{quote.amount.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-3">
                      <span className="text-gray-500">Délai</span>
                      <span className="text-gray-700">{formatDelay(quote.delay)}</span>
                    </div>
                    {quote.id === bestQuote?.id && (
                      <span className="inline-flex mb-3 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                        Meilleur prix
                      </span>
                    )}
                    <div className="flex gap-2">
                      {quote.status === "pending" && (
                        <>
                          <button className="px-3 py-1.5 text-xs font-medium bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
                            Accepter
                          </button>
                          <button className="px-3 py-1.5 text-xs font-medium bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
                            Refuser
                          </button>
                        </>
                      )}
                      {quote.status === "accepted" && (
                        <Link to="/client/projects" className="text-orange-600 hover:text-orange-700 text-xs font-medium">
                          Voir le chantier →
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => handleExportPDF(quote.id)}
                        className="ml-auto text-gray-400 hover:text-gray-600"
                      >
                        📥
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            <div className="hidden lg:block bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-6 py-3 font-medium text-gray-600">Technicien</th>
                      <th className="text-left px-6 py-3 font-medium text-gray-600">Montant</th>
                      <th className="text-left px-6 py-3 font-medium text-gray-600">Délai</th>
                      <th className="text-left px-6 py-3 font-medium text-gray-600">Statut</th>
                      <th className="text-left px-6 py-3 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {group
                      .filter((quote) => filterStatus === "all" || quote.status === filterStatus)
                      .map((quote) => (
                        <>
                          <tr
                            key={quote.id}
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => setExpandedId(expandedId === quote.id ? null : quote.id)}
                          >
                            <td className="px-6 py-4">
                              <p className="font-medium text-gray-900">
                                {quote.technician}
                                {quote.id === bestQuote?.id && (
                                  <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                    Meilleur prix
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-gray-500">{quote.trade}</p>
                              <p className="text-xs text-gray-400 mt-1">{quote.date}</p>
                            </td>
                            <td className="px-6 py-4 font-semibold text-gray-900">
                              {quote.amount.toLocaleString()} FCFA
                            </td>
                            <td className="px-6 py-4 text-gray-600">{formatDelay(quote.delay)}</td>
                            <td className="px-6 py-4">{getStatusBadge(quote.status)}</td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2 items-center">
                                {quote.status === "pending" && (
                                  <>
                                    <button
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        setConfirmAction({ type: "accept", quoteId: quote.id });
                                      }}
                                      className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                                    >
                                      Accepter
                                    </button>
                                    <button
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        setConfirmAction({ type: "reject", quoteId: quote.id });
                                      }}
                                      className="px-3 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                                    >
                                      Refuser
                                    </button>
                                  </>
                                )}
                                {quote.status === "accepted" && (
                                  <Link
                                    to="/client/projects"
                                    className="text-orange-600 hover:text-orange-700 text-xs font-medium"
                                  >
                                    Voir le chantier →
                                  </Link>
                                )}
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    handleExportPDF(quote.id);
                                  }}
                                  className="text-gray-400 hover:text-gray-600 ml-auto"
                                >
                                  📥
                                </button>
                              </div>
                            </td>
                          </tr>
                          {expandedId === quote.id && (
                            <tr>
                              <td colSpan={5} className="px-6 py-4 bg-gray-50">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="font-medium">Détails du devis</p>
                                    <p className="text-gray-600 mt-1">{quote.details}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Conditions</p>
                                    <p className="text-gray-600 mt-1">{quote.conditions}</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {confirmAction.type === "accept" ? "Accepter ce devis ?" : "Refuser ce devis ?"}
            </h3>
            <p className="text-gray-600 text-sm">
              {confirmAction.type === "accept"
                ? "Le technicien sera notifié et le chantier pourra démarrer."
                : "Cette action est définitive."}
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 rounded-lg bg-linear-to-r from-orange-600 to-amber-500 text-white hover:from-orange-700 hover:to-amber-600"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotesComparison;

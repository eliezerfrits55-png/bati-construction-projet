import { useState } from "react";
import { Link } from "react-router-dom";

const TRADES = [
  "Tous",
  "Plomberie",
  "Électricité",
  "Maçonnerie",
  "Peinture",
  "Carrelage",
  "Menuiserie",
  "Soudure",
  "Climatisation",
  "Architecture",
];

const CITIES = [
  "Toutes",
  "Douala",
  "Yaoundé",
  "Bafoussam",
  "Garoua",
  "Bamenda",
];

// Données fictives
const MOCK_TECHNICIANS = [
  {
    id: 1,
    name: "Jean Mbarga",
    trade: "Plomberie",
    city: "Douala",
    rating: 4.9,
    reviews: 47,
    experience: 8,
    avatar: null,
    verified: true,
    priceFrom: "15 000",
  },
  {
    id: 2,
    name: "Paul Nguema",
    trade: "Électricité",
    city: "Yaoundé",
    rating: 4.7,
    reviews: 32,
    experience: 5,
    avatar: null,
    verified: true,
    priceFrom: "12 000",
  },
  {
    id: 3,
    name: "Marie Atangana",
    trade: "Peinture",
    city: "Douala",
    rating: 4.8,
    reviews: 28,
    experience: 6,
    avatar: null,
    verified: true,
    priceFrom: "10 000",
  },
  {
    id: 4,
    name: "Eric Fotso",
    trade: "Maçonnerie",
    city: "Bafoussam",
    rating: 4.6,
    reviews: 19,
    experience: 12,
    avatar: null,
    verified: false,
    priceFrom: "20 000",
  },
  {
    id: 5,
    name: "Amina Bello",
    trade: "Carrelage",
    city: "Douala",
    rating: 4.9,
    reviews: 41,
    experience: 7,
    avatar: null,
    verified: true,
    priceFrom: "18 000",
  },
  {
    id: 6,
    name: "Boris Essomba",
    trade: "Électricité",
    city: "Yaoundé",
    rating: 4.5,
    reviews: 15,
    experience: 3,
    avatar: null,
    verified: true,
    priceFrom: "11 000",
  },
];

const SearchTechnicians = () => {
  const [search, setSearch] = useState("");
  const [selectedTrade, setSelectedTrade] = useState("Tous");
  const [selectedCity, setSelectedCity] = useState("Toutes");
  const [sortBy, setSortBy] = useState("rating");

  const filtered = MOCK_TECHNICIANS.filter((tech) => {
    const matchSearch =
      tech.name.toLowerCase().includes(search.toLowerCase()) ||
      tech.trade.toLowerCase().includes(search.toLowerCase());
    const matchTrade = selectedTrade === "Tous" || tech.trade === selectedTrade;
    const matchCity = selectedCity === "Toutes" || tech.city === selectedCity;
    return matchSearch && matchTrade && matchCity;
  }).sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "experience") return b.experience - a.experience;
    if (sortBy === "price")
      return parseInt(a.priceFrom) - parseInt(b.priceFrom);
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Rechercher un technicien
        </h1>
        <p className="text-gray-600 mt-1">
          Trouvez le professionnel idéal pour vos travaux
        </p>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        {/* Barre de recherche */}
        <div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nom, métier..."
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Métier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Métier
            </label>
            <select
              value={selectedTrade}
              onChange={(e) => setSelectedTrade(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {TRADES.map((trade) => (
                <option key={trade} value={trade}>
                  {trade}
                </option>
              ))}
            </select>
          </div>

          {/* Ville */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ville
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Tri */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trier par
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="rating">Meilleure note</option>
              <option value="experience">Expérience</option>
              <option value="price">Prix croissant</option>
            </select>
          </div>
        </div>
      </div>

      {/* Résultats */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          <strong>{filtered.length}</strong> technicien
          {filtered.length > 1 ? "s" : ""} trouvé
          {filtered.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((tech) => (
          <div
            key={tech.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition"
          >
            <div className="p-5">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-xl shrink-0">
                  {tech.name.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {tech.name}
                    </h3>
                    {tech.verified && (
                      <span className="text-blue-500 text-sm" title="Vérifié">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {tech.trade} • {tech.city}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-sm">
                    <span className="flex items-center gap-1 text-amber-500">
                      ⭐ {tech.rating}
                    </span>
                    <span className="text-gray-400">({tech.reviews} avis)</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  {tech.experience} ans d’expérience
                </span>
                <span className="font-medium text-gray-900">
                  dès {tech.priceFrom} FCFA
                </span>
              </div>

              <div className="mt-4 flex gap-2">
                <Link
                  to={`/client/technicians/${tech.id}`}
                  className="flex-1 text-center py-2 px-3 bg-orange-50 text-orange-700 font-medium rounded-lg hover:bg-orange-100 transition text-sm"
                >
                  Voir le profil
                </Link>
                <Link
                  to={`/client/quotes/request?technician=${tech.id}`}
                  className="flex-1 text-center py-2 px-3 bg-linear-to-r from-orange-600 to-amber-500 text-white font-medium rounded-lg hover:from-orange-700 hover:to-amber-600 transition text-sm"
                >
                  Demander un devis
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-gray-600">
            Aucun technicien ne correspond à vos critères
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchTechnicians;

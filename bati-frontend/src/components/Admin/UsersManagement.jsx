import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Toast from "../shared/Toast";

const MOCK_USERS = [
  {
    id: 1,
    name: "Sophie Kamga",
    email: "sophie.k@email.com",
    role: "client",
    city: "Douala",
    status: "active",
    joined: "15 juin 2026",
  },
  {
    id: 2,
    name: "Jean Mbarga",
    email: "jean.mbarga@email.com",
    role: "technician",
    trade: "Plomberie",
    city: "Douala",
    status: "active",
    joined: "02 mai 2026",
  },
  {
    id: 3,
    name: "Paul Nguema",
    email: "paul.n@email.com",
    role: "technician",
    trade: "Électricité",
    city: "Yaoundé",
    status: "active",
    joined: "20 avr. 2026",
  },
  {
    id: 4,
    name: "Eric Fotso",
    email: "eric.f@email.com",
    role: "client",
    city: "Yaoundé",
    status: "active",
    joined: "10 juil. 2026",
  },
  {
    id: 5,
    name: "Marie Atangana",
    email: "marie.a@email.com",
    role: "technician",
    trade: "Plomberie",
    city: "Douala",
    status: "suspended",
    joined: "05 mars 2026",
  },
  {
    id: 6,
    name: "Admin Principal",
    email: "admin@batconstruction.cm",
    role: "admin",
    city: "Yaoundé",
    status: "active",
    joined: "01 jan. 2026",
  },
];

const UsersManagement = () => {
  const [searchParams] = useSearchParams();
  const tradeFilter = searchParams.get("trade") || "";
  const [users, setUsers] = useState(MOCK_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [toast, setToast] = useState(null);

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchTrade = !tradeFilter || (u.role === "technician" && u.trade === tradeFilter && u.status === "active");
    return matchSearch && matchRole && matchTrade;
  });

  const toggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "active" ? "suspended" : "active" }
          : u,
      ),
    );
    setToast({ type: "success", message: "Statut mis à jour" });
  };

  const roleBadge = (role) => {
    const map = {
      client: "bg-blue-100 text-blue-700",
      technician: "bg-orange-100 text-orange-700",
      admin: "bg-purple-100 text-purple-700",
    };
    const labels = {
      client: "Client",
      technician: "Technicien",
      admin: "Admin",
    };
    return (
      <span
        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${map[role]}`}
      >
        {labels[role]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Gestion des utilisateurs
        </h1>
        <p className="text-gray-600 mt-1">
          {tradeFilter ? `Techniciens actifs — ${tradeFilter}` : `${users.length} utilisateurs au total`}
        </p>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom ou email..."
          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">Tous les rôles</option>
          <option value="client">Clients</option>
          <option value="technician">Techniciens</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-600">
                  Utilisateur
                </th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">
                  Rôle
                </th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">
                  Ville
                </th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">
                  Statut
                </th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">
                  Inscrit le
                </th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </td>
                  <td className="px-6 py-4">{roleBadge(user.role)}</td>
                  <td className="px-6 py-4 text-gray-600">{user.city}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status === "active" ? "Actif" : "Suspendu"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{user.joined}</td>
                  <td className="px-6 py-4">
                    {user.role !== "admin" && (
                      <button
                        onClick={() => toggleStatus(user.id)}
                        className={`text-xs font-medium px-3 py-1 rounded-lg ${
                          user.status === "active"
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-green-50 text-green-600 hover:bg-green-100"
                        }`}
                      >
                        {user.status === "active" ? "Suspendre" : "Réactiver"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default UsersManagement;

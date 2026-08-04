/**
 * Fonctions utilitaires générales
 */

/**
 * Formate un montant en FCFA
 * @param {number} amount
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return "—";
  return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
};

/**
 * Formate une date relative (Il y a 2h, Hier, etc.)
 * @param {string|Date} date
 * @returns {string}
 */
export const formatRelativeDate = (date) => {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "À l’instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;

  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/**
 * Formate une date classique
 * @param {string|Date} date
 * @param {Object} options
 * @returns {string}
 */
export const formatDate = (date, options = {}) => {
  if (!date) return "—";
  const d = new Date(date);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  });
};

/**
 * Tronque un texte
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncate = (text, maxLength = 100) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
};

/**
 * Retourne les initiales d'un nom
 * @param {string} firstName
 * @param {string} lastName
 * @returns {string}
 */
export const getInitials = (firstName = "", lastName = "") => {
  const first = firstName?.charAt(0)?.toUpperCase() || "";
  const last = lastName?.charAt(0)?.toUpperCase() || "";
  return first + last || "?";
};

/**
 * Capitalise la première lettre
 * @param {string} str
 * @returns {string}
 */
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Génère un badge de statut (classes Tailwind)
 * @param {string} status
 * @returns {{ label: string, className: string }}
 */
export const getStatusBadge = (status) => {
  const map = {
    pending: {
      label: "En attente",
      className: "bg-yellow-100 text-yellow-800",
    },
    accepted: { label: "Accepté", className: "bg-green-100 text-green-800" },
    rejected: { label: "Refusé", className: "bg-red-100 text-red-800" },
    sent: { label: "Envoyé", className: "bg-blue-100 text-blue-800" },
    draft: { label: "Brouillon", className: "bg-gray-100 text-gray-600" },
    in_progress: { label: "En cours", className: "bg-blue-100 text-blue-800" },
    completed: { label: "Terminé", className: "bg-green-100 text-green-800" },
    cancelled: { label: "Annulé", className: "bg-gray-100 text-gray-600" },
    open: { label: "Ouvert", className: "bg-red-100 text-red-800" },
    resolved: { label: "Résolu", className: "bg-green-100 text-green-800" },
    active: { label: "Actif", className: "bg-green-100 text-green-800" },
    suspended: { label: "Suspendu", className: "bg-red-100 text-red-800" },
  };

  return (
    map[status] || { label: status, className: "bg-gray-100 text-gray-600" }
  );
};

/**
 * Debounce une fonction
 * @param {Function} fn
 * @param {number} delay
 * @returns {Function}
 */
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Vérifie si une valeur est vide
 * @param {*} value
 * @returns {boolean}
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
};

/**
 * Construit une query string à partir d'un objet
 * @param {Object} params
 * @returns {string}
 */
export const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      searchParams.append(key, value);
    }
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
};

/**
 * Rôle lisible
 * @param {string} role
 * @returns {string}
 */
export const getRoleLabel = (role) => {
  const map = {
    client: "Client",
    technician: "Technicien",
    admin: "Administrateur",
  };
  return map[role] || role;
};

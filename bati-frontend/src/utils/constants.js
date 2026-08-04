// ======================
// RÔLES
// ======================
export const ROLES = {
  CLIENT: "client",
  TECHNICIAN: "technician",
  ADMIN: "admin",
};

// ======================
// STATUTS
// ======================
export const QUOTE_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  SENT: "sent",
  DRAFT: "draft",
};

export const PROJECT_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const REQUEST_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
};

export const DISPUTE_STATUS = {
  OPEN: "open",
  RESOLVED: "resolved",
  CLOSED: "closed",
};

export const USER_STATUS = {
  ACTIVE: "active",
  SUSPENDED: "suspended",
  PENDING: "pending",
};

// ======================
// MÉTIERS
// ======================
export const TRADES = [
  "Plomberie",
  "Électricité",
  "Maçonnerie",
  "Peinture",
  "Carrelage",
  "Menuiserie",
  "Soudure",
  "Climatisation",
  "Architecture",
  "Génie civil",
  "Autre",
];

// ======================
// VILLES PRINCIPALES
// ======================
export const CITIES = [
  "Douala",
  "Yaoundé",
  "Bafoussam",
  "Garoua",
  "Bamenda",
  "Maroua",
  "Ngaoundéré",
  "Bertoua",
  "Ebolowa",
  "Kribi",
  "Limbe",
  "Buea",
];

// ======================
// URGENCE
// ======================
export const URGENCY_LEVELS = {
  LOW: "low",
  NORMAL: "normal",
  HIGH: "high",
};

export const URGENCY_LABELS = {
  low: "Pas urgent",
  normal: "Normal",
  high: "Urgent",
};

// ======================
// PAGINATION
// ======================
export const DEFAULT_PAGE_SIZE = 12;

// ======================
// MESSAGES D'ERREUR / SUCCÈS
// ======================
export const MESSAGES = {
  LOGIN_SUCCESS: "Connexion réussie",
  LOGIN_ERROR: "Email ou mot de passe incorrect",
  REGISTER_SUCCESS: "Compte créé avec succès",
  REGISTER_PENDING:
    "Compte créé ! Votre profil sera validé par un administrateur.",
  LOGOUT_SUCCESS: "Déconnexion réussie",
  UPDATE_SUCCESS: "Modifications enregistrées",
  DELETE_SUCCESS: "Élément supprimé",
  NETWORK_ERROR: "Impossible de contacter le serveur",
  UNAUTHORIZED: "Vous devez être connecté",
  FORBIDDEN: "Accès non autorisé",
};

// ======================
// ROUTES
// ======================
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  ACCESS_DENIED: "/access-denied",

  CLIENT: {
    DASHBOARD: "/client/dashboard",
    SEARCH: "/client/search",
    TECHNICIAN_PROFILE: "/client/technicians/:id",
    QUOTE_REQUEST: "/client/quotes/request",
    QUOTES: "/client/quotes",
    PROJECTS: "/client/projects",
    MESSAGES: "/client/messages",
  },

  TECHNICIAN: {
    DASHBOARD: "/technician/dashboard",
    PROFILE: "/technician/profile",
    PORTFOLIO: "/technician/portfolio",
    REQUESTS: "/technician/requests",
    QUOTES: "/technician/quotes",
    CALENDAR: "/technician/calendar",
    STATISTICS: "/technician/statistics",
    MESSAGES: "/technician/messages",
  },

  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    TECHNICIANS: "/admin/technicians",
    USERS: "/admin/users",
    TRADES: "/admin/trades",
    DISPUTES: "/admin/disputes",
    STATISTICS: "/admin/statistics",
  },
};

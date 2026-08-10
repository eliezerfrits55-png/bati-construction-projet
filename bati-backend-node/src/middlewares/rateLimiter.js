const rateLimit = require("express-rate-limit");

// Limiteur général pour toutes les routes API
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes par fenêtre
  message: {
    success: false,
    message: "Trop de requêtes, veuillez réessayer plus tard.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiteur strict pour l'authentification (login, register)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 tentatives par fenêtre
  message: {
    success: false,
    message:
      "Trop de tentatives de connexion, veuillez réessayer dans 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Ne pas compter les requêtes réussies
});

// Limiteur pour l'envoi de messages
const messageLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 messages par minute
  message: {
    success: false,
    message: "Trop de messages envoyés, veuillez ralentir.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiteur pour les uploads de fichiers
const uploadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 uploads par minute
  message: {
    success: false,
    message: "Trop de fichiers uploadés, veuillez ralentir.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiteur pour les routes admin
const adminLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requêtes par minute
  message: {
    success: false,
    message: "Trop de requêtes admin, veuillez ralentir.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiteur pour les routes de devis
const quoteLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requêtes par minute
  message: {
    success: false,
    message: "Trop de requêtes de devis, veuillez ralentir.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiteur pour les avis
const reviewLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 15, // 15 requêtes par minute
  message: {
    success: false,
    message: "Trop de requêtes d'avis, veuillez ralentir.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiteur pour les recherches
const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 50, // 50 recherches par minute
  message: {
    success: false,
    message: "Trop de recherches, veuillez ralentir.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Export des limiteurs
module.exports = {
  generalLimiter,
  authLimiter,
  messageLimiter,
  uploadLimiter,
  adminLimiter,
  quoteLimiter,
  reviewLimiter,
  searchLimiter,
};

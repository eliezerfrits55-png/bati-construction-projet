import axios from "axios";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const productionApiUrl = "https://bat-construction-api.onrender.com/api";
const apiBaseUrl =
  configuredApiUrl || (import.meta.env.DEV ? "http://localhost:5000/api" : productionApiUrl);

if (import.meta.env.PROD && !configuredApiUrl) {
  console.error(
    `VITE_API_URL est absent. Utilisation de l’URL Render par défaut : ${productionApiUrl}`,
  );
}

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Intercepteur : ajouter le token JWT automatiquement
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Intercepteur : gérer les erreurs globales (401, 403, etc.)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Token expiré ou invalide
      if (status === 401) {
        localStorage.removeItem("token");
        // On peut rediriger vers /login si on veut
        // window.location.href = '/login';
      }

      // Formater un message d'erreur propre
      const validationMessage = data?.errors
        ? Object.values(data.errors).flat().filter(Boolean).join(" ")
        : null;
      const message =
        validationMessage ||
        data?.error ||
        data?.message ||
        "Une erreur est survenue";

      return Promise.reject(new Error(message));
    }

    // Erreur réseau : l'API est inaccessible ou VITE_API_URL est incorrect.
    const target = error.config?.baseURL || apiBaseUrl;
    return Promise.reject(
      new Error(
        target
          ? `Impossible de contacter le serveur (${target}). Vérifiez que le backend Render est actif et que VITE_API_URL est correcte.`
          : "Impossible de contacter le serveur. Configurez VITE_API_URL avec l’URL Render du backend.",
      ),
    );
  },
);

export default api;

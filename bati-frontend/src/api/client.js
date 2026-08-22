import axios from "axios";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const localApiUrl = "http://localhost:5000/api";
const apiBaseUrl =
  configuredApiUrl || localApiUrl;

if (!configuredApiUrl) {
  console.error(
    `VITE_API_URL est absent. Utilisation de l’API locale : ${localApiUrl}`,
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
          ? `Impossible de contacter le serveur (${target}). Vérifiez que le backend local est démarré.`
          : "Impossible de contacter le serveur. Démarrez le backend local sur le port 5000.",
      ),
    );
  },
);

export default api;

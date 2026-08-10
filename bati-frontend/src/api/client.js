import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
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

    // Erreur réseau
    return Promise.reject(new Error("Impossible de contacter le serveur"));
  },
);

export default api;

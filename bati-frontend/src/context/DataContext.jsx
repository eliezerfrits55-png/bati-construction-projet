import { createContext, useState, useCallback } from "react";
import api from "../api/client";

// eslint-disable-next-line react-refresh/only-export-components
export const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [technicians, setTechnicians] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [requests, setRequests] = useState([]);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ========== TECHNICIANS ==========
  const fetchTechnicians = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/technicians?${params}`);
      setTechnicians(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || "Erreur lors du chargement des techniciens");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTechnicianById = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/technicians/${id}`);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ========== QUOTES ==========
  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/quotes");
      setQuotes(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createQuoteRequest = useCallback(async (data) => {
    const response = await api.post("/quotes", data);
    return response.data;
  }, []);

  const respondToQuote = useCallback(async (quoteId, action) => {
    const response = await api.patch(`/quotes/${quoteId}`, { status: action });
    setQuotes((prev) =>
      prev.map((q) => (q.id === quoteId ? { ...q, status: action } : q)),
    );
    return response.data;
  }, []);

  // ========== PROJECTS ==========
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/projects");
      setProjects(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ========== REQUESTS (pour techniciens) ==========
  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/requests");
      setRequests(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ========== TRADES ==========
  const fetchTrades = useCallback(async () => {
    try {
      const response = await api.get("/trades");
      setTrades(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // ========== ADMIN ==========
  const validateTechnician = useCallback(async (id, action) => {
    const endpoint = action === "validated" ? "validate" : "block";
    const response = await api.post(`/admin/technicians/${id}/${endpoint}`);
    return response.data;
  }, []);

  const value = {
    // State
    technicians,
    quotes,
    projects,
    requests,
    trades,
    loading,
    error,

    // Actions
    fetchTechnicians,
    fetchTechnicianById,
    fetchQuotes,
    createQuoteRequest,
    respondToQuote,
    fetchProjects,
    fetchRequests,
    fetchTrades,
    validateTechnician,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

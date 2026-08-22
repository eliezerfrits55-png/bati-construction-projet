import { createContext, useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "../hooks/useAuth";

// eslint-disable-next-line react-refresh/only-export-components
export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socketRef = useRef(null);

  // Connexion WebSocket
  useEffect(() => {
    if (!token || !user) {
      // Déconnecter si pas d'auth
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
        setConnected(false);
      }
      return;
    }

    try {
      // Exemple avec une connexion WebSocket native
      // En production, tu utiliseras Laravel Echo + Reverb/Pusher
      const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:5000";
      const socket = new WebSocket(`${wsUrl}?token=${token}`);

      socket.onopen = () => {
        setConnected(true);
        console.log("[Socket] Connecté");
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          switch (data.type) {
            case "message":
              setMessages((prev) => [...prev, data.payload]);
              break;
            case "notification":
              setNotifications((prev) => [data.payload, ...prev]);
              break;
            case "online_users":
              setOnlineUsers(data.payload);
              break;
            default:
              console.log("[Socket] Event non géré:", data.type);
          }
        } catch (error) {
          console.error("[Socket] Erreur parsing message", error);
        }
      };

      socket.onclose = () => {
        setConnected(false);
        console.log("[Socket] Déconnecté");
      };

      socket.onerror = (error) => {
        console.error("[Socket] Erreur", error);
        setConnected(false);
      };

      socketRef.current = socket;
    } catch (error) {
      console.error("[Socket] Impossible de se connecter", error);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [token, user]);

  // Envoyer un message
  const sendMessage = useCallback((recipientId, content) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.warn("[Socket] Non connecté");
      return false;
    }

    socketRef.current.send(
      JSON.stringify({
        type: "message",
        payload: {
          recipient_id: recipientId,
          content,
        },
      }),
    );
    return true;
  }, []);

  // Marquer une notification comme lue
  const markNotificationRead = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
    );
  }, []);

  // Vider les notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = {
    connected,
    messages,
    notifications,
    onlineUsers,
    sendMessage,
    markNotificationRead,
    clearNotifications,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

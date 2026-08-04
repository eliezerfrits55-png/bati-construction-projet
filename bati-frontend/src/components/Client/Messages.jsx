import { useEffect, useMemo, useRef, useState } from "react";

const MOCK_CONVERSATIONS = [
  {
    id: 1,
    name: "Jean Mbarga",
    lastMessage: "Je peux passer demain matin pour le devis.",
    time: "10:32",
    unread: 2,
    trade: "Plomberie",
  },
  {
    id: 2,
    name: "Paul Nguema",
    lastMessage: "Le matériel est arrivé, on commence lundi.",
    time: "Hier",
    unread: 0,
    trade: "Électricité",
  },
  {
    id: 3,
    name: "Marie Atangana",
    lastMessage: "Merci pour votre confiance !",
    time: "28 juil.",
    unread: 0,
    trade: "Peinture",
  },
];

const MOCK_MESSAGES = [
  {
    id: 1,
    sender: "them",
    text: "Bonjour, j’ai bien reçu votre demande.",
    time: "10:15",
    date: "Aujourd’hui",
  },
  {
    id: 2,
    sender: "me",
    text: "Bonjour ! Quand pourriez-vous passer ?",
    time: "10:20",
    date: "Aujourd’hui",
  },
  {
    id: 3,
    sender: "them",
    text: "Je peux passer demain matin pour le devis.",
    time: "10:32",
    date: "Aujourd’hui",
  },
];

const ClientMessages = () => {
  const [conversations] = useState(MOCK_CONVERSATIONS);
  const [activeId, setActiveId] = useState(1);
  const [allMessages, setAllMessages] = useState({
    1: MOCK_MESSAGES,
    2: [],
    3: [],
  });
  const [newMessage, setNewMessage] = useState("");
  const [searchConv, setSearchConv] = useState("");
  const [loading] = useState(false);
  const [onlineUsers] = useState([1]);
  const [typing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const messagesEndRef = useRef(null);

  const filteredConversations = useMemo(() => {
    return conversations.filter(
      (conv) =>
        conv.name.toLowerCase().includes(searchConv.toLowerCase()) ||
        conv.trade.toLowerCase().includes(searchConv.toLowerCase())
    );
  }, [conversations, searchConv]);

  const activeConv = filteredConversations.find((c) => c.id === activeId);
  const messages = useMemo(() => allMessages[activeId] || [], [allMessages, activeId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (event) => {
    event.preventDefault();
    if (!newMessage.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: "me",
      text: newMessage,
      time: new Date().toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: "Aujourd’hui",
    };

    setAllMessages((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), newMsg],
    }));
    setNewMessage("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend(event);
    }
  };

  const shouldShowDate = (message, previousMessage) => {
    if (!previousMessage) return true;
    return message.date !== previousMessage.date;
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-10rem)] flex bg-white rounded-xl border overflow-hidden animate-pulse">
        <div className="w-80 border-r p-4 space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex-1" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-10rem)] flex bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="w-full sm:w-80 border-r border-gray-200 flex flex-col bg-gray-50/50">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Messages</h2>
          <p className="text-sm text-gray-500">Échanges avec vos techniciens</p>
        </div>
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            value={searchConv}
            onChange={(event) => setSearchConv(event.target.value)}
            placeholder="Rechercher..."
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-gray-400 px-4 py-10">
              <div className="text-center">
                <p className="text-4xl mb-3">💬</p>
                <p>Aucune conversation</p>
                <p className="text-sm mt-1">
                  Les messages avec les techniciens apparaîtront ici
                </p>
              </div>
            </div>
          )}

          {filteredConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveId(conv.id)}
              className={`w-full flex items-start gap-3 p-4 text-left hover:bg-white transition relative ${
                activeId === conv.id ? "bg-orange-50" : ""
              }`}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-semibold shrink-0">
                  {conv.name.charAt(0)}
                </div>
                {onlineUsers.includes(conv.id) && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-gray-900 truncate">
                    {conv.name}
                  </p>
                  <span className="text-xs text-gray-400">{conv.time}</span>
                </div>
                <p className="text-xs text-gray-500 mb-1">{conv.trade}</p>
                <p className="text-sm text-gray-500 truncate">
                  {conv.lastMessage}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {conv.unread > 0 && (
                  <span className="w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center shrink-0">
                    {conv.unread}
                  </span>
                )}
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setMenuOpen(menuOpen === conv.id ? null : conv.id);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ⋮
                </button>
              </div>

              {menuOpen === conv.id && (
                <div className="absolute right-4 top-12 bg-white shadow-lg rounded-lg border py-1 z-10 min-w-40">
                  <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                    Marquer comme lu
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    Bloquer
                  </button>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="hidden sm:flex flex-1 flex-col bg-white">
        {activeConv ? (
          <>
            <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-semibold">
                    {activeConv.name.charAt(0)}
                  </div>
                  {onlineUsers.includes(activeConv.id) && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{activeConv.name}</p>
                  <p className="text-xs text-gray-500">{activeConv.trade}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end text-sm text-gray-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  En ligne
                </div>
                {typing && (
                  <p className="text-xs text-gray-400 italic">
                    {activeConv.name} est en train d’écrire...
                  </p>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-linear-to-b from-white to-gray-50/60">
              {messages.map((message, index) => (
                <div key={message.id}>
                  {shouldShowDate(message, messages[index - 1]) && (
                    <div className="flex justify-center my-4">
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-500">
                        {message.date}
                      </span>
                    </div>
                  )}
                  <div
                    className={`flex ${
                      message.sender === "me" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                        message.sender === "me"
                          ? "bg-linear-to-r from-orange-600 to-amber-500 text-white rounded-br-md"
                          : "bg-white text-gray-900 rounded-bl-md border border-gray-200"
                      }`}
                    >
                      <p>{message.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === "me"
                            ? "text-orange-100"
                            : "text-gray-400"
                        }`}
                      >
                        {message.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200 bg-white">
              <form onSubmit={handleSend} className="flex gap-2">
                <label
                  htmlFor="file-upload"
                  className="px-3 py-2.5 text-gray-400 hover:text-orange-500 cursor-pointer"
                >
                  📎
                </label>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={() => {}}
                />
                <textarea
                  value={newMessage}
                  onChange={(event) => setNewMessage(event.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  placeholder="Écrire un message... (Entrée pour envoyer)"
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-linear-to-r from-orange-600 to-amber-500 text-white font-medium rounded-lg hover:from-orange-700 hover:to-amber-600 transition"
                >
                  Envoyer
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Sélectionnez une conversation
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientMessages;

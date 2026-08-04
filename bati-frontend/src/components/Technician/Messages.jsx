import { useState } from "react";

const MOCK_CONVERSATIONS = [
  {
    id: 1,
    name: "Sophie Kamga",
    lastMessage: "Parfait, à demain alors !",
    time: "11:05",
    unread: 1,
    project: "Fuite sous l’évier",
  },
  {
    id: 2,
    name: "Eric Fotso",
    lastMessage: "Le devis me convient, on signe.",
    time: "Hier",
    unread: 0,
    project: "Installation prises",
  },
  {
    id: 3,
    name: "Paul Nguema",
    lastMessage: "Merci pour le travail soigné.",
    time: "30 juil.",
    unread: 0,
    project: "Rénovation SDB",
  },
];

const MOCK_MESSAGES = [
  {
    id: 1,
    sender: "them",
    text: "Bonjour, avez-vous pu regarder ma demande ?",
    time: "10:40",
  },
  {
    id: 2,
    sender: "me",
    text: "Oui, je peux passer demain matin vers 9h.",
    time: "10:55",
  },
  { id: 3, sender: "them", text: "Parfait, à demain alors !", time: "11:05" },
];

const TechnicianMessages = () => {
  const [conversations] = useState(MOCK_CONVERSATIONS);
  const [activeId, setActiveId] = useState(1);
  const [messages] = useState(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState("");

  const activeConv = conversations.find((c) => c.id === activeId);

  return (
    <div className="h-[calc(100vh-10rem)] flex bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Liste */}
      <div className="w-full sm:w-80 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-gray-900">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveId(conv.id)}
              className={`w-full flex items-start gap-3 p-4 text-left hover:bg-gray-50 transition ${
                activeId === conv.id ? "bg-orange-50" : ""
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-semibold shrink-0">
                {conv.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900 truncate">
                    {conv.name}
                  </p>
                  <span className="text-xs text-gray-400">{conv.time}</span>
                </div>
                <p className="text-xs text-gray-400 truncate">{conv.project}</p>
                <p className="text-sm text-gray-500 truncate">
                  {conv.lastMessage}
                </p>
              </div>
              {conv.unread > 0 && (
                <span className="w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                  {conv.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="hidden sm:flex flex-1 flex-col">
        {activeConv ? (
          <>
            <div className="p-4 border-b flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-semibold">
                {activeConv.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-gray-900">{activeConv.name}</p>
                <p className="text-xs text-gray-500">{activeConv.project}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                      msg.sender === "me"
                        ? "bg-orange-500 text-white rounded-br-md"
                        : "bg-gray-100 text-gray-900 rounded-bl-md"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p
                      className={`text-xs mt-1 ${msg.sender === "me" ? "text-orange-100" : "text-gray-400"}`}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setNewMessage("");
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Écrire un message..."
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition"
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

export default TechnicianMessages;

import { useState } from "react";
import { MessageCircle, Send, ShieldCheck } from "lucide-react";

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
    <div className="flex h-[calc(100vh-10rem)] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
      {/* Liste */}
      <div className="flex w-full flex-col border-r border-slate-200 sm:w-80">
        <div className="border-b border-slate-100 bg-slate-50/70 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100 text-orange-600"><MessageCircle size={20} /></div>
            <div><h2 className="font-black text-slate-900">Messages</h2><p className="text-xs text-slate-500">Échanges avec vos clients</p></div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveId(conv.id)}
              className={`w-full flex items-start gap-3 p-4 text-left hover:bg-gray-50 transition ${
                activeId === conv.id ? "bg-orange-50 ring-1 ring-inset ring-orange-100" : "hover:bg-slate-50"
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500 to-purple-700 font-bold text-white shadow-sm">
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
      <div className="hidden flex-1 flex-col bg-slate-50/40 sm:flex">
        {activeConv ? (
          <>
            <div className="flex items-center gap-3 border-b border-slate-100 bg-white px-6 py-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500 to-purple-700 font-bold text-white shadow-sm">
                {activeConv.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-gray-900">{activeConv.name}</p>
                <p className="flex items-center gap-1 text-xs text-gray-500"><ShieldCheck size={13} className="text-emerald-500" /> {activeConv.project}</p>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                      msg.sender === "me"
                        ? "rounded-br-md bg-orange-500 text-white shadow-md shadow-orange-500/10"
                        : "rounded-bl-md border border-slate-200 bg-white text-slate-900 shadow-sm"
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

            <div className="border-t border-slate-100 bg-white p-4">
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
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 font-bold text-white transition hover:bg-orange-600"
                >
                  <Send size={16} /> Envoyer
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

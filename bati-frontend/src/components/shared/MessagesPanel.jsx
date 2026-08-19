import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, CheckCheck, LoaderCircle, MessageCircle, MoreHorizontal, Search, Send, ShieldCheck } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api/client";

const getId = (value) => value?._id || value?.id || value;

const formatTime = (value) => value ? new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(new Date(value)) : "";
const formatDate = (value) => value ? new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value)) : "";

export default function MessagesPanel({ role }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [mobileChat, setMobileChat] = useState(false);
  const endRef = useRef(null);

  const loadConversations = useCallback(async () => {
    try {
      const response = await api.get("/messages/conversations");
      const data = response.data.data || [];
      setConversations(data);
      setActiveId((current) => current || data[0]?._id || null);
      setError("");
    } catch (requestError) {
      setError(requestError.message || "Impossible de charger les conversations");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async (conversationId, quiet = false) => {
    if (!conversationId) return;
    if (!quiet) setMessagesLoading(true);
    try {
      const response = await api.get(`/messages/conversations/${conversationId}`);
      setMessages(response.data.data || []);
      setError("");
    } catch (requestError) {
      setError(requestError.message || "Impossible de charger les messages");
    } finally {
      if (!quiet) setMessagesLoading(false);
    }
  }, []);

  useEffect(() => { loadConversations(); }, [loadConversations]);
  useEffect(() => {
    if (!activeId) return undefined;
    setMobileChat(true);
    loadMessages(activeId);
    const interval = window.setInterval(() => loadMessages(activeId, true), 6000);
    return () => window.clearInterval(interval);
  }, [activeId, loadMessages]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const filteredConversations = useMemo(() => conversations.filter((conversation) => {
    const other = conversation.participants?.find((participant) => getId(participant) !== getId(user));
    const label = `${other?.first_name || ""} ${other?.last_name || ""}`.toLowerCase();
    return label.includes(search.toLowerCase()) || (conversation.lastMessage || "").toLowerCase().includes(search.toLowerCase());
  }), [conversations, search, user]);

  const activeConversation = conversations.find((conversation) => conversation._id === activeId);
  const otherParticipant = activeConversation?.participants?.find((participant) => getId(participant) !== getId(user));
  const displayName = otherParticipant ? `${otherParticipant.first_name || "Utilisateur"} ${otherParticipant.last_name || ""}`.trim() : "Conversation";

  const sendMessage = async (event) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content || !activeConversation || !otherParticipant || sending) return;
    setSending(true);
    try {
      const response = await api.post("/messages", { conversationId: activeId, receiverId: getId(otherParticipant), content });
      setMessages((current) => [...current, response.data.data]);
      setDraft("");
      await loadConversations();
    } catch (requestError) {
      setError(requestError.message || "Le message n’a pas pu être envoyé");
    } finally {
      setSending(false);
    }
  };

  const initials = displayName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "?";

  return (
    <div className="flex h-[calc(100vh-10rem)] min-h-[620px] overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl shadow-slate-950/10">
      <aside className={`${mobileChat ? "hidden" : "flex"} w-full flex-col border-r border-slate-200 bg-slate-50/80 sm:flex sm:w-[340px]`}>
        <div className="border-b border-slate-200 bg-white px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-600"><MessageCircle size={21} /></div>
            <div><h1 className="font-black tracking-tight text-slate-900">Messages</h1><p className="text-xs text-slate-500">Échanges avec vos {role === "technician" ? "clients" : "techniciens"}</p></div>
          </div>
          <div className="relative mt-5"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher une conversation" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" /></div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {loading && <div className="flex items-center justify-center gap-2 py-12 text-sm text-slate-400"><LoaderCircle className="animate-spin" size={18} /> Chargement…</div>}
          {!loading && !filteredConversations.length && <div className="px-5 py-14 text-center"><MessageCircle className="mx-auto text-slate-300" size={36} /><p className="mt-3 font-semibold text-slate-600">Aucune conversation</p><p className="mt-1 text-xs leading-5 text-slate-400">Vos échanges apparaîtront ici dès qu’une conversation sera créée.</p></div>}
          {filteredConversations.map((conversation) => {
            const participant = conversation.participants?.find((item) => getId(item) !== getId(user));
            const name = `${participant?.first_name || "Utilisateur"} ${participant?.last_name || ""}`.trim();
            return <button key={conversation._id} type="button" onClick={() => setActiveId(conversation._id)} className={`flex w-full items-start gap-3 rounded-2xl p-3 text-left transition ${conversation._id === activeId ? "bg-orange-100/80 shadow-sm" : "hover:bg-white"}`}>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500 to-purple-700 text-sm font-black text-white">{name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</div>
              <div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><p className="truncate text-sm font-bold text-slate-800">{name}</p><span className="shrink-0 text-[11px] text-slate-400">{formatTime(conversation.lastMessageAt)}</span></div><p className="mt-1 truncate text-xs text-slate-500">{conversation.lastMessage || "Nouvelle conversation"}</p></div>
            </button>;
          })}
        </div>
      </aside>

      <main className={`${mobileChat ? "flex" : "hidden"} min-w-0 flex-1 flex-col bg-slate-50/50 sm:flex`}>
        {activeConversation ? <>
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3"><button type="button" onClick={() => setMobileChat(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 sm:hidden"><ArrowLeft size={19} /></button><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500 to-purple-700 font-black text-white">{initials}</div><div><h2 className="font-black text-slate-900">{displayName}</h2><p className="flex items-center gap-1 text-xs text-emerald-600"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Conversation sécurisée</p></div></div><button type="button" className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"><MoreHorizontal size={20} /></button>
          </header>
          <div className="flex items-center justify-center gap-2 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400"><ShieldCheck size={14} className="text-emerald-500" /> Échanges privés liés à votre projet</div>
          <div className="flex-1 overflow-y-auto px-4 pb-5 sm:px-8">
            {messagesLoading ? <div className="flex h-full items-center justify-center gap-2 text-sm text-slate-400"><LoaderCircle className="animate-spin" size={18} /> Chargement des messages…</div> : messages.length ? messages.map((message, index) => { const mine = getId(message.senderId) === getId(user); const showDate = index === 0 || formatDate(message.createdAt) !== formatDate(messages[index - 1].createdAt); return <div key={message._id || `${message.createdAt}-${index}`}>{showDate && <div className="my-5 text-center text-xs font-semibold text-slate-400">{formatDate(message.createdAt)}</div>}<div className={`mb-2 flex ${mine ? "justify-end" : "justify-start"}`}><div className={`max-w-[min(76%,520px)] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${mine ? "rounded-br-md bg-orange-500 text-white" : "rounded-bl-md border border-slate-200 bg-white text-slate-800"}`}><p>{message.content}</p><div className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${mine ? "text-orange-100" : "text-slate-400"}`}>{formatTime(message.createdAt)} {mine && <CheckCheck size={13} />}</div></div></div></div>; }) : <div className="flex h-full flex-col items-center justify-center text-center"><MessageCircle className="text-slate-300" size={42} /><p className="mt-3 font-semibold text-slate-600">Commencez la conversation</p><p className="mt-1 text-sm text-slate-400">Écrivez un premier message professionnel.</p></div>}
            <div ref={endRef} />
          </div>
          <form onSubmit={sendMessage} className="border-t border-slate-200 bg-white p-4 sm:p-5"><div className="flex items-end gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-2 transition focus-within:border-orange-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-100"><textarea value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMessage(event); } }} rows={1} maxLength={5000} placeholder="Écrire un message…" className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none" /><button type="submit" disabled={!draft.trim() || sending} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"><Send size={17} /></button></div><p className="mt-2 text-right text-[11px] text-slate-400">Entrée pour envoyer • Maj + Entrée pour une nouvelle ligne</p></form>
        </> : <div className="flex flex-1 items-center justify-center text-center"><div><MessageCircle className="mx-auto text-slate-300" size={45} /><p className="mt-3 font-semibold text-slate-600">Sélectionnez une conversation</p><p className="mt-1 text-sm text-slate-400">Choisissez un échange dans la liste.</p></div></div>}
        {error && <p className="mx-4 mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}
      </main>
    </div>
  );
}

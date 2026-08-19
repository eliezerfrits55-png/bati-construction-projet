import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, LocateFixed, MapPin, RefreshCw, ShieldCheck } from "lucide-react";
import api from "../../api/client";
import MapTilerMap from "../MapTilerMap/MapTilerMap";

const DEFAULT_CENTER = [11.52, 3.87];

export default function LocationMap({ role }) {
  const [position, setPosition] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [permissionState, setPermissionState] = useState("prompt");
  const [message, setMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const loadPlaces = useCallback(async (coords = position) => {
    try {
      const params = coords ? { latitude: coords.latitude, longitude: coords.longitude, radius: 100 } : {};
      const endpoint = role === "technician" ? "/location/clients" : "/location/technicians";
      const response = await api.get(endpoint, { params });
      setPlaces((response.data.data || []).filter((place) => Number.isFinite(place.latitude) && Number.isFinite(place.longitude)));
      setMessage("");
    } catch (error) {
      setMessage(error.message || "Impossible de charger les positions");
    } finally {
      setLoading(false);
    }
  }, [position, role]);

  const requestLocation = useCallback(() => {
    setShowConfirmation(true);
  }, []);

  const activateLocation = useCallback(() => {
    setShowConfirmation(false);
    if (!navigator.geolocation) {
      setMessage("La géolocalisation n’est pas disponible sur cet appareil.");
      return;
    }

    setLocating(true);
    setMessage("");
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      const next = { latitude: coords.latitude, longitude: coords.longitude };
      setPosition(next);
      setLocationEnabled(true);
      try {
        await api.put("/location/me", next);
        await loadPlaces(next);
      } catch (error) {
        setMessage(error.message || "La position n’a pas pu être enregistrée.");
      } finally {
        setLocating(false);
      }
    }, (error) => {
      setLocating(false);
      const errors = {
        1: "La localisation est bloquée pour ce site. Clique sur le cadenas à gauche de l’adresse, ouvre les paramètres du site, règle Localisation sur Autoriser, puis recharge la page.",
        2: "Ta position est momentanément indisponible.",
        3: "La demande de localisation a expiré. Réessaie.",
      };
      setMessage(errors[error.code] || "Impossible d’obtenir ta position.");
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });
  }, [loadPlaces]);

  useEffect(() => {
    loadPlaces();
    if (navigator.permissions?.query) {
      navigator.permissions.query({ name: "geolocation" }).then((permission) => {
        setPermissionState(permission.state);
        permission.onchange = () => setPermissionState(permission.state);
      }).catch(() => {});
    }
  }, [loadPlaces]);

  const markers = useMemo(() => places.map((place) => ({
    lat: place.latitude,
    lng: place.longitude,
    title: place.name,
    description: [place.trade, place.city, place.approximate ? "Zone approximative" : "Position GPS"].filter(Boolean).join(" • "),
    color: role === "technician" ? "#2563eb" : place.approximate ? "#f97316" : "#a855f7",
    scale: place.approximate ? 1 : 1.2,
  })), [places, role]);

  const title = role === "technician" ? "Localiser vos clients" : "Techniciens disponibles";
  const countLabel = role === "technician" ? "client(s) lié(s)" : "technicien(s) visible(s)";

  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 text-white shadow-xl shadow-slate-950/20 backdrop-blur-sm">
      <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-200">
            <MapPin size={16} /> Localisation
          </div>
          <h2 className="mt-2 text-xl font-black tracking-tight">{title}</h2>
          <p className="mt-1 text-sm text-slate-400">{places.length} {countLabel} • visibilité contrôlée</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={requestLocation} disabled={locating} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-3 py-2 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-wait disabled:opacity-60">
            <LocateFixed size={16} /> {locating ? "Localisation…" : locationEnabled ? "Position activée" : "Activer ma position"}
          </button>
          <button type="button" onClick={() => loadPlaces()} className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10">
            <RefreshCw size={16} /> Actualiser
          </button>
        </div>
      </div>

      <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[1fr_230px]">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
          {loading ? <div className="flex h-[300px] items-center justify-center text-sm text-slate-400">Chargement de la carte…</div> : <MapTilerMap center={position ? [position.longitude, position.latitude] : DEFAULT_CENTER} zoom={position ? 12 : 6} markers={markers} showUserLocation={locationEnabled} height="300px" />}
        </div>
        <aside className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white"><ShieldCheck size={17} className="text-emerald-300" /> Vie privée</div>
          <p className="mt-2 text-xs leading-5 text-slate-400">Ta position exacte est partagée uniquement après activation et sert au suivi des utilisateurs autorisés.</p>
          {permissionState === "denied" && <p className="mt-3 rounded-xl border border-red-300/20 bg-red-500/10 p-3 text-xs leading-5 text-red-200">La permission est actuellement bloquée par le navigateur. Clique sur le cadenas près de l’adresse du site → <strong>Paramètres du site</strong> → <strong>Localisation : Autoriser</strong>, puis recharge la page.</p>}
          <div className="mt-5 space-y-3 text-xs text-slate-300">
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-purple-500" /> GPS technicien</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-orange-500" /> Zone connue</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-blue-500" /> Ta position</div>
          </div>
          {locationEnabled && <p className="mt-5 flex items-center gap-2 text-xs font-semibold text-emerald-300"><CheckCircle2 size={15} /> Position active</p>}
        </aside>
      </div>
      {showConfirmation && (
        <div className="mx-4 mb-4 rounded-2xl border border-orange-300/25 bg-orange-500/10 p-4 sm:mx-5">
          <p className="text-sm font-bold text-white">Autoriser le partage de votre position ?</p>
          <p className="mt-1 text-xs leading-5 text-orange-100/80">Votre position sera enregistrée pour afficher les techniciens ou clients autorisés autour de vous. Vous pourrez refuser la demande du navigateur.</p>
          <div className="mt-3 flex justify-end gap-2">
            <button type="button" onClick={() => setShowConfirmation(false)} className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10">Annuler</button>
            <button type="button" onClick={activateLocation} className="rounded-lg bg-orange-500 px-3 py-2 text-xs font-bold text-white hover:bg-orange-600">Continuer</button>
          </div>
        </div>
      )}
      {message && <p className="mx-4 mb-4 rounded-xl border border-amber-300/20 bg-amber-500/10 p-3 text-sm text-amber-200 sm:mx-5">{message}</p>}
      {!loading && !places.length && <p className="px-5 pb-5 text-center text-sm text-slate-400">Aucune position disponible pour le moment.</p>}
    </section>
  );
}

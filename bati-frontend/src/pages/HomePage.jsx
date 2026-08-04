import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Bolt,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Droplets,
  Hammer,
  HardHat,
  Headphones,
  MapPin,
  Quote,
  Ruler,
  Search,
  ShieldCheck,
  Snowflake,
  Star,
  Users,
  WalletCards,
  Wind,
} from "lucide-react";
import Navbar from "../components/Shared/Navbar";
import Footer from "../components/Shared/Footer";

const trades = [
  { name: "Plomberie", description: "Fuites, sanitaires et installations", icon: Droplets },
  { name: "Électricité", description: "Câblage, pannes et maintenance", icon: Bolt },
  { name: "Maçonnerie", description: "Gros œuvre, reprises et finitions", icon: Hammer },
  { name: "Topographie", description: "Relevés, foncier et études terrain", icon: Ruler },
  { name: "Climatisation", description: "Pose, entretien et dépannage split", icon: Wind },
  { name: "Froid", description: "Réfrigérateurs et chambres froides", icon: Snowflake },
];

const features = [
  {
    title: "Prix transparents",
    description: "Des devis lisibles, comparables et validés avant le démarrage.",
    icon: WalletCards,
  },
  {
    title: "Techniciens vérifiés",
    description: "Documents, compétences, références et avis sont contrôlés.",
    icon: ShieldCheck,
  },
  {
    title: "Suivi accompagné",
    description: "Messages, devis, interventions et validations restent centralisés.",
    icon: Headphones,
  },
];

const steps = [
  [
    "01",
    "Cadrez votre besoin",
    "Précisez le métier, la ville, le niveau d’urgence et les contraintes du chantier.",
    ClipboardCheck,
  ],
  [
    "02",
    "Sélectionnez le bon profil",
    "Comparez avis, réalisations, disponibilités et devis pour décider sereinement.",
    Users,
  ],
  [
    "03",
    "Pilotez l’intervention",
    "Centralisez les échanges, les validations et le suivi jusqu’à la clôture des travaux.",
    CheckCircle2,
  ],
];

const testimonials = [
  {
    name: "Marcelle T.",
    city: "Yaoundé",
    quote: "J’ai trouvé un électricien sérieux en moins de 30 minutes. Le prix annoncé a été respecté.",
  },
  {
    name: "Jean-Paul N.",
    city: "Douala",
    quote: "Les profils vérifiés et les devis comparables m’ont aidé à choisir sans perdre de temps.",
  },
  {
    name: "Awa B.",
    city: "Garoua",
    quote: "Le suivi était clair, le plombier ponctuel, et toute la discussion est restée dans l’application.",
  },
];

const cities = ["Yaoundé", "Douala", "Bafoussam", "Garoua"];

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedTrade, setSelectedTrade] = useState("");
  const [selectedCity, setSelectedCity] = useState("Yaoundé");

  const onlineCount = useMemo(() => {
    const cityCounts = { Yaoundé: 86, Douala: 74, Bafoussam: 31, Garoua: 22 };
    return cityCounts[selectedCity] || 0;
  }, [selectedCity]);

  const handleSearch = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (selectedTrade) params.set("trade", selectedTrade);
    if (selectedCity) params.set("city", selectedCity);
    navigate(`/client/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />

      <main>
        <section className="relative overflow-hidden bg-[linear-gradient(135deg,#09090b_0%,#181026_46%,#3b0764_100%)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(168,85,247,0.32),transparent_30%),radial-gradient(circle_at_82%_8%,rgba(244,63,94,0.22),transparent_28%)]" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-zinc-950 to-transparent" />

          <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
            <div className="flex flex-col justify-center">
              <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-purple-50 shadow-sm backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.85)]" />
                {onlineCount} techniciens disponibles à {selectedCity}
              </div>

              <h1 className="max-w-4xl text-4xl font-black leading-[1.05] text-white md:text-6xl">
                Les meilleurs techniciens du bâtiment, au même endroit
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-300 md:text-lg">
                Trouvez un professionnel qualifié près de chez vous, comparez
                les devis et suivez vos travaux dans un espace clair, vérifié et
                sécurisé.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-purple-700 shadow-xl shadow-purple-950/25 transition hover:bg-purple-50"
                >
                  Trouver un technicien
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/register/technician"
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 px-6 py-3.5 font-bold text-white backdrop-blur transition hover:bg-white/15"
                >
                  Je suis technicien
                </Link>
              </div>

              <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
                <div>
                  <p className="text-2xl font-black text-white">300+</p>
                  <p className="text-xs text-zinc-400">pros vérifiés</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-white">500+</p>
                  <p className="text-xs text-zinc-400">chantiers suivis</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-white">4.8/5</p>
                  <p className="text-xs text-zinc-400">note moyenne</p>
                </div>
              </div>
            </div>

            <div className="relative min-h-110">
              <div className="absolute inset-0 rotate-3 rounded-4xl bg-purple-500/20 blur-sm" />
              <div className="relative h-full rounded-4xl border border-white/10 bg-zinc-950/65 p-5 shadow-2xl shadow-black/40 backdrop-blur">
                <div className="flex h-full flex-col justify-between rounded-3xl bg-[linear-gradient(160deg,rgba(126,34,206,0.72),rgba(24,24,27,0.92)),repeating-linear-gradient(90deg,rgba(255,255,255,0.07)_0_1px,transparent_1px_36px)] p-6">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm font-semibold text-emerald-200">
                      4.8/5 moyenne
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm text-zinc-200">
                      Yaoundé
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      [HardHat, "Équipe vérifiée", "CNI + références"],
                      [ClipboardCheck, "Devis clair", "Prix détaillé"],
                      [Building2, "Chantier suivi", "Étapes validées"],
                    ].map(([Icon, title, text], index) => (
                      <div
                        key={title}
                        className={`rounded-2xl border border-white/10 bg-white/10 p-4 ${index === 1 ? "mt-10" : ""}`}
                      >
                        <Icon className="mb-8 text-purple-100" size={30} />
                        <p className="text-sm font-semibold text-white">{title}</p>
                        <p className="mt-1 text-xs text-zinc-300">{text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-zinc-950/85 p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">Mission active</p>
                        <p className="text-sm text-zinc-400">Installation électrique</p>
                      </div>
                      <CheckCircle2 className="text-emerald-300" size={24} />
                    </div>
                    <div className="h-2 rounded-full bg-zinc-800">
                      <div className="h-2 w-3/4 rounded-full bg-purple-400" />
                    </div>
                    <p className="mt-3 text-sm text-zinc-400">
                      Technicien sélectionné, devis validé, intervention planifiée.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 mx-auto -mt-10 max-w-6xl px-4 sm:px-6 lg:px-8">
          <form
            onSubmit={handleSearch}
            className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-3 text-zinc-950 shadow-2xl shadow-black/25 md:grid-cols-[1fr_1fr_auto]"
          >
            <label className="flex items-center gap-3 rounded-xl bg-zinc-50 px-4 py-4 ring-1 ring-zinc-100">
              <Search className="text-purple-700" size={22} />
              <span className="flex-1">
                <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-zinc-500">
                  Quel métier ?
                </span>
                <input
                  value={selectedTrade}
                  onChange={(event) => setSelectedTrade(event.target.value)}
                  placeholder="Plombier, électricien, topographe..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
                />
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-xl bg-zinc-50 px-4 py-4 ring-1 ring-zinc-100">
              <MapPin className="text-purple-700" size={22} />
              <span className="flex-1">
                <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-zinc-500">
                  Quelle ville ?
                </span>
                <select
                  value={selectedCity}
                  onChange={(event) => setSelectedCity(event.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                >
                  {cities.map((city) => (
                    <option key={city}>{city}</option>
                  ))}
                </select>
                <span className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  {onlineCount} techniciens disponibles en ligne
                </span>
              </span>
            </label>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-purple-700 px-8 py-4 font-bold text-white transition hover:bg-purple-800"
            >
              Rechercher
            </button>
          </form>
        </section>

        <section id="services" className="bg-zinc-950 px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-purple-300">
                  Nos spécialités
                </p>
                <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
                  Trouvez le bon expert
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-zinc-400">
                Des métiers essentiels du bâtiment, organisés pour une recherche
                rapide et un choix plus fiable.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {trades.map((trade) => {
                const Icon = trade.icon;
                return (
                  <button
                    key={trade.name}
                    type="button"
                    onClick={() => setSelectedTrade(trade.name)}
                    className="group rounded-2xl border border-white/10 bg-white/4 p-6 text-left transition hover:-translate-y-1 hover:border-purple-300/60 hover:bg-white/8 hover:shadow-xl hover:shadow-purple-950/20"
                  >
                    <span className="mb-6 flex h-13 w-13 items-center justify-center rounded-xl bg-purple-500/15 text-purple-200 transition group-hover:bg-purple-500 group-hover:text-white">
                      <Icon size={25} />
                    </span>
                    <h3 className="text-lg font-bold text-white">{trade.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      {trade.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section id="comment-ca-marche" className="relative overflow-hidden bg-white px-4 py-24 text-zinc-950 sm:px-6 lg:px-8">
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-purple-200 to-transparent" />
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-3 rounded-full border border-purple-100 bg-purple-50 px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-purple-700 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-purple-600 shadow-[0_0_14px_rgba(126,34,206,0.55)]" />
                Comment ça marche
              </div>
              <h2 className="mt-5 text-3xl font-black leading-tight text-zinc-950 md:text-5xl">
                Un processus clair, maîtrisé du premier besoin à la réception
              </h2>
              <p className="mt-6 border-l-4 border-purple-600 pl-5 text-base leading-8 text-zinc-600">
                BatiConnect structure chaque étape pour vous aider à choisir un
                technicien fiable, comparer les propositions avec clarté et
                suivre l’avancement sans perdre le contrôle.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-3 border-y border-zinc-200 py-5">
                {["Brief", "Devis", "Suivi"].map((item) => (
                  <div key={item}>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
                      Étape
                    </p>
                    <p className="mt-1 font-black text-zinc-900">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="grid gap-5 sm:grid-cols-3 lg:gap-6">
                {steps.map(([number, title, text, Icon]) => (
                  <div
                    key={number}
                    className="group relative overflow-hidden rounded-4xl border border-zinc-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-purple-200 hover:shadow-2xl hover:shadow-purple-950/10"
                  >
                    <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-purple-50 transition group-hover:bg-purple-100" />
                    <div className="relative mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-zinc-950 p-3 shadow-xl shadow-zinc-950/15 transition group-hover:bg-purple-700 sm:h-36 sm:w-36">
                      <span className="absolute -top-1 -right-1 flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-purple-600 text-sm font-black text-white">
                        {number}
                      </span>
                      <div className="flex h-full w-full items-center justify-center rounded-full border border-white/15 bg-white/10 text-white">
                        <Icon size={38} strokeWidth={1.8} />
                      </div>
                    </div>
                    <h3 className="relative mt-6 text-lg font-black leading-snug text-zinc-950">
                      {title}
                    </h3>
                    <p className="relative mt-3 text-sm leading-7 text-zinc-600">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-zinc-100 px-4 py-24 text-zinc-950 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-purple-700">
                Avis clients
              </p>
              <h2 className="mt-3 text-3xl font-black md:text-4xl">
                Ce qu’ils disent de BatiConnect
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <article
                  key={testimonial.name}
                  className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
                >
                  <Quote className="mb-5 text-purple-200" size={30} />
                  <div className="mb-4 flex gap-1 text-amber-500">
                    {[...Array(5)].map((_, index) => (
                      <Star key={index} size={18} fill="currentColor" />
                    ))}
                  </div>
                  <p className="min-h-24 text-sm leading-7 text-zinc-700">
                    “{testimonial.quote}”
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-100 font-black text-purple-700">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold">{testimonial.name}</p>
                      <p className="text-sm text-zinc-500">{testimonial.city}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-zinc-950 px-4 py-24 text-zinc-100 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-purple-300">
                Sécurité et sérénité
              </p>
              <h2 className="mt-3 text-3xl font-black md:text-4xl">
                Nous bâtissons la confiance entre pros et clients
              </h2>
              <p className="mt-5 max-w-xl leading-7 text-zinc-400">
                BatiConnect simplifie la rénovation au Cameroun en connectant
                les meilleurs talents du bâtiment avec des clients qui veulent
                des délais, des prix et une qualité maîtrisés.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-sm text-zinc-300">
                {cities.map((city) => (
                  <span key={city} className="rounded-full border border-white/10 px-4 py-2">
                    {city}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/4 p-5">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/15 text-purple-200">
                      <Icon size={24} />
                    </span>
                    <div>
                      <h3 className="font-bold text-white">{feature.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-zinc-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-16 text-zinc-950 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
            {[
              [Users, "300+", "Techniciens vérifiés"],
              [Hammer, "500+", "Chantiers accompagnés"],
              [BadgeCheck, "4.8/5", "Satisfaction moyenne"],
            ].map(([Icon, value, label]) => (
              <div key={label} className="rounded-2xl border border-zinc-200 p-6">
                <Icon className="mb-4 text-purple-700" size={28} />
                <p className="text-4xl font-black">{value}</p>
                <p className="mt-1 text-sm text-zinc-600">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-purple-700 px-4 py-18 text-white sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div>
              <h2 className="text-3xl font-black">Prêt à démarrer votre projet ?</h2>
              <p className="mt-2 text-purple-100">
                Créez votre demande et comparez les meilleurs techniciens près de chez vous.
              </p>
            </div>
            <Link
              to="/register"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-purple-700 transition hover:bg-purple-50"
            >
              Démarrer
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;

import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

const MOCK_TECHNICIAN = {
  id: 1,
  name: "Jean Mbarga",
  trade: "Plomberie",
  city: "Douala",
  quartier: "Akwa",
  rating: 4.9,
  reviewsCount: 47,
  experience: 8,
  verified: true,
  phone: "6XX XXX XXX",
  availability: "Disponible cette semaine",
  bio: "Plombier professionnel avec plus de 8 ans d’expérience. Spécialisé dans les installations sanitaires, la détection de fuites et les rénovations de salles de bain. Travail soigné et respect des délais.",
  skills: [
    "Installation sanitaire",
    "Détection de fuites",
    "Chauffe-eau",
    "Canalisation",
    "Robinetterie",
  ],
  portfolio: [
    { id: 1, title: "Rénovation salle de bain complète", image: null },
    { id: 2, title: "Installation cuisine moderne", image: null },
    { id: 3, title: "Réparation fuite majeure", image: null },
  ],
  reviews: [
    {
      id: 1,
      client: "Sophie K.",
      rating: 5,
      comment: "Travail impeccable et très professionnel. Je recommande !",
      date: "15 juil. 2026",
    },
    {
      id: 2,
      client: "Paul N.",
      rating: 5,
      comment: "Rapide et efficace. Prix correct.",
      date: "02 juil. 2026",
    },
    {
      id: 3,
      client: "Amina B.",
      rating: 4,
      comment:
        "Bon travail, un peu de retard sur le planning mais résultat parfait.",
      date: "20 juin 2026",
    },
    {
      id: 4,
      client: "David M.",
      rating: 5,
      comment: "Très bon suivi et communication claire.",
      date: "11 juin 2026",
    },
  ],
};

const RatingStars = ({ rating }) => (
  <div className="flex items-center gap-0.5 text-amber-500">
    {[...Array(5)].map((_, index) => (
      <span
        key={index}
        className={
          index < Math.floor(rating) ? "text-amber-500" : "text-gray-300"
        }
      >
        ★
      </span>
    ))}
  </div>
);

const Lightbox = ({ image, onClose }) => (
  <button
    type="button"
    onClick={onClose}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
    aria-label="Fermer la galerie"
  >
    <div
      className="max-w-4xl w-full"
      onClick={(event) => event.stopPropagation()}
    >
      {image?.image ? (
        <img
          src={image.image}
          alt={image.title}
          className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl bg-black"
        />
      ) : (
        <div className="w-full min-h-[50vh] rounded-2xl bg-white flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p className="text-4xl mb-2">🖼️</p>
            <p>{image?.title}</p>
          </div>
        </div>
      )}
    </div>
  </button>
);

const TechnicianProfile = () => {
  const { id } = useParams();
  const [tech, setTech] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [visibleReviews, setVisibleReviews] = useState(3);

  useEffect(() => {
    const controller = new AbortController();

    const fetchTechnician = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/technicians/${id}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          const apiError = new Error("Technicien introuvable");
          apiError.status = response.status;
          throw apiError;
        }

        const data = await response.json();
        setTech(data);
      } catch (fetchError) {
        if (fetchError.name === "AbortError") return;

        if (fetchError.status === 404) {
          setError(fetchError);
          setTech(null);
          return;
        }

        setTech({
          ...MOCK_TECHNICIAN,
          id: Number(id) || MOCK_TECHNICIAN.id,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTechnician();

    return () => controller.abort();
  }, [id]);

  const handleShare = async () => {
    if (!tech) return;

    if (navigator.share) {
      await navigator.share({
        title: `${tech.name} - ${tech.trade}`,
        text: tech.bio,
        url: window.location.href,
      });
    }
  };

  const structuredData = useMemo(() => {
    if (!tech) return null;

    return {
      "@context": "https://schema.org",
      "@type": "Person",
      name: tech.name,
      description: tech.bio,
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: tech.rating,
        reviewCount: tech.reviewsCount,
      },
    };
  }, [tech]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-32" />
        <div className="h-48 bg-gray-200 rounded-xl" />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-32 bg-gray-200 rounded-xl" />
            <div className="h-24 bg-gray-200 rounded-xl" />
          </div>
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error?.status === 404) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-3">🔧</p>
        <p className="text-gray-600">Technicien introuvable</p>
        <Link to="/client/search" className="text-orange-600 mt-4 inline-block">
          Retour à la recherche
        </Link>
      </div>
    );
  }

  if (!tech) {
    return null;
  }

  return (
    <div className="space-y-6">
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      <Link
        to="/client/search"
        className="inline-flex items-center text-sm text-gray-500 hover:text-orange-600"
      >
        ← Retour à la recherche
      </Link>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-3xl shrink-0">
            {tech.name.charAt(0)}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{tech.name}</h1>
              {tech.verified && (
                <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  ✓ Vérifié
                </span>
              )}
            </div>

            <p className="text-gray-600 mt-1">
              {tech.trade} • {tech.city}, {tech.quartier}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
              <span className="flex items-center gap-2 text-amber-500 font-medium">
                <RatingStars rating={tech.rating} />
                <span className="text-gray-400 font-normal">
                  ({tech.reviewsCount} avis)
                </span>
              </span>
              <span className="text-gray-500">
                {tech.experience} ans d’expérience
              </span>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                {tech.availability || "Disponible cette semaine"}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to={`/client/quotes/request?technician=${tech.id}`}
                className="px-5 py-2.5 bg-linear-to-r from-orange-600 to-amber-500 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-amber-600 transition"
              >
                Demander un devis
              </Link>
              <Link
                to={`/client/messages?to=${tech.id}`}
                className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                Envoyer un message
              </Link>
              <button
                type="button"
                onClick={handleShare}
                className="px-3 py-2 text-gray-500 hover:text-orange-600"
              >
                📤 Partager
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-3">À propos</h2>
            <p className="text-gray-600 leading-relaxed">{tech.bio}</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-3">Compétences</h2>
            <div className="flex flex-wrap gap-2">
              {tech.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 bg-orange-50 text-orange-700 text-sm font-medium rounded-lg"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">Portfolio</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {tech.portfolio.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedImage(item)}
                  className="group aspect-video bg-gray-100 rounded-lg overflow-hidden hover:opacity-90 transition"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="aspect-video bg-linear-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <div className="text-3xl mx-auto mb-1">🖼️</div>
                        <p className="text-xs px-2">{item.title}</p>
                        <p className="text-[11px] mt-1 opacity-70">
                          Photo à venir
                        </p>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
            <h2 className="font-black tracking-tight text-slate-900">
              Avis clients ({tech.reviewsCount})
            </h2>
                <p className="mt-1 text-sm text-slate-500">Retours vérifiés après intervention</p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-amber-50 px-4 py-3">
                <span className="text-2xl font-black text-slate-900">{tech.rating}</span>
                <div><RatingStars rating={tech.rating} /><p className="mt-1 text-xs text-slate-500">Note moyenne</p></div>
              </div>
            </div>
            <div className="space-y-4">
              {tech.reviews.slice(0, visibleReviews).map((review) => (
                <div
                  key={review.id}
                  className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900">{review.client}</p>
                    <span className="text-xs text-gray-400">{review.date}</span>
                  </div>
                  <div className="mb-2">
                    <RatingStars rating={review.rating} />
                  </div>
                  <p className="text-gray-600 text-sm">{review.comment}</p>
                </div>
              ))}
            </div>

            {visibleReviews < tech.reviews.length && (
              <button
                type="button"
                onClick={() => setVisibleReviews((prev) => prev + 5)}
                className="mt-5 text-sm font-semibold text-orange-600 hover:text-orange-700"
              >
                Voir plus d'avis
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Informations</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Métier</span>
                <span className="font-medium text-gray-900">{tech.trade}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Ville</span>
                <span className="font-medium text-gray-900">{tech.city}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Quartier</span>
                <span className="font-medium text-gray-900">
                  {tech.quartier}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Expérience</span>
                <span className="font-medium text-gray-900">
                  {tech.experience} ans
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Téléphone</span>
                <span className="font-medium text-gray-900">{tech.phone}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Note</span>
                <span className="font-medium text-amber-500">
                  <RatingStars rating={tech.rating} />
                </span>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-orange-600 to-amber-500 rounded-2xl p-6 text-white text-center shadow-sm">
            <p className="font-semibold text-lg mb-2">
              Besoin de ses services ?
            </p>
            <p className="text-orange-100 text-sm mb-4">
              Demandez un devis gratuit et sans engagement
            </p>
            <Link
              to={`/client/quotes/request?technician=${tech.id}`}
              className="inline-block w-full py-2.5 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition"
            >
              Demander un devis
            </Link>
          </div>
        </div>
      </div>

      {selectedImage && (
        <Lightbox
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

export default TechnicianProfile;

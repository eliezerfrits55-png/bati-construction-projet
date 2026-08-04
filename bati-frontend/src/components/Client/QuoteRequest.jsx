import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ClipboardCheck } from 'lucide-react';
import LoadingSpinner from '../Shared/LoadingSpinner';
import Toast from '../Shared/Toast';

const QuoteRequest = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const technicianId = searchParams.get('technician');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    trade: '',
    city: '',
    budget: '',
    urgency: 'normal',
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  const TRADES = [
    'Plomberie',
    'Électricité',
    'Maçonnerie',
    'Peinture',
    'Carrelage',
    'Menuiserie',
    'Soudure',
    'Climatisation',
    'Architecture',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Titre requis';
    if (!formData.description.trim()) newErrors.description = 'Description requise';
    if (!formData.trade) newErrors.trade = 'Métier requis';
    if (!formData.city.trim()) newErrors.city = 'Ville requise';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const requestPayload = {
        ...formData,
        technician_id: technicianId || null,
      };
      void requestPayload;
      // await api.createQuoteRequest(requestPayload);
      setToast({ type: 'success', message: 'Demande de devis envoyée avec succès !' });
      setTimeout(() => navigate('/client/quotes'), 1500);
    } catch {
      setToast({ type: 'error', message: 'Erreur lors de l’envoi de la demande' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <Link to="/client/search" className="text-sm text-gray-500 hover:text-orange-600">
          ← Retour
        </Link>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Décrivez vos travaux</h1>
        <p className="text-gray-600 mt-1">
          Décrivez votre besoin pour recevoir des propositions
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start gap-3 border-b border-slate-100 pb-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-600"><ClipboardCheck size={22} /></div>
          <div><h2 className="font-bold text-slate-900">Les détails de votre projet</h2><p className="mt-1 text-sm text-slate-500">Plus votre demande est précise, plus les devis seront pertinents.</p></div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Titre du projet *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ex: Rénovation salle de bain"
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.title ? 'border-red-400' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-orange-500`}
          />
          {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Description *</label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Décrivez précisément les travaux à réaliser..."
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.description ? 'border-red-400' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-orange-500`}
          />
          {errors.description && (
            <p className="text-sm text-red-500 mt-1">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Métier *</label>
            <select
              name="trade"
              value={formData.trade}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.trade ? 'border-red-400' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-orange-500`}
            >
              <option value="">Sélectionnez</option>
              {TRADES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {errors.trade && <p className="text-sm text-red-500 mt-1">{errors.trade}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ville *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Douala, Yaoundé..."
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.city ? 'border-red-400' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-orange-500`}
            />
            {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget estimé (FCFA)
            </label>
            <input
              type="text"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="Ex: 100 000"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Urgence</label>
            <select
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="low">Pas urgent</option>
              <option value="normal">Normal</option>
              <option value="high">Urgent</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-linear-to-r from-orange-600 to-amber-500 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-amber-600 transition disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" />
              Envoi en cours...
            </>
          ) : (
            'Envoyer la demande'
          )}
        </button>
      </form>

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
    </div>
  );
};

export default QuoteRequest;

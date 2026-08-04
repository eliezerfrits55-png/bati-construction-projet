import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
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
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link to="/client/search" className="text-sm text-gray-500 hover:text-orange-600">
          ← Retour
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Demander un devis</h1>
        <p className="text-gray-600 mt-1">
          Décrivez votre besoin pour recevoir des propositions
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titre du projet *</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
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

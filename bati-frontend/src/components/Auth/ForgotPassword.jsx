import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../Shared/LoadingSpinner';
import Toast from '../Shared/Toast';

const ForgotPassword = () => {
  const { forgotPassword } = useAuth(); // À implémenter dans ton AuthContext

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState(null);

  const validate = () => {
    if (!email.trim()) {
      setError('L\'email est requis');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email invalide');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await forgotPassword(email);
      setSuccess(true);
      setToast({
        type: 'success',
        message: 'Un lien de réinitialisation a été envoyé à votre adresse email.',
      });
    } catch (err) {
      setToast({
        type: 'error',
        message: err.message || 'Une erreur est survenue. Vérifiez votre email.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-orange-600 to-amber-500 px-8 py-6 text-center">
          <h1 className="text-2xl font-bold text-white">Mot de passe oublié</h1>
          <p className="text-orange-100 mt-1 text-sm">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>

        <div className="px-8 py-8">
          {success ? (
            /* ========== SUCCÈS ========== */
            <div className="text-center space-y-5">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">✉️</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Email envoyé !
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Si un compte existe avec l’adresse <strong>{email}</strong>, vous recevrez
                  un lien pour réinitialiser votre mot de passe.
                </p>
                <p className="text-gray-500 text-xs mt-3">
                  Pensez à vérifier vos spams.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center w-full py-3 bg-linear-to-r from-orange-600 to-amber-500 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-amber-600 transition"
                >
                  Retour à la connexion
                </Link>
              </div>
            </div>
          ) : (
            /* ========== FORMULAIRE ========== */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Adresse email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="ex: jean.dupont@email.com"
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    error
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-gray-300 focus:ring-orange-500'
                  } focus:outline-none focus:ring-2 transition`}
                />
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-linear-to-r from-orange-600 to-amber-500 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-amber-600 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Envoi en cours...
                  </>
                ) : (
                  'Envoyer le lien'
                )}
              </button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  ← Retour à la connexion
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default ForgotPassword;

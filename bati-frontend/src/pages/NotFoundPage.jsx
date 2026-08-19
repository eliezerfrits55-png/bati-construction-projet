import { Link } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          {/* Big 404 */}
          <h1 className="text-8xl md:text-9xl font-bold text-orange-500/20 select-none">
            404
          </h1>

          <div className="-mt-8 mb-6">
            <div className="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">🔍</span>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Page introuvable
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Désolé, la page que vous recherchez n’existe pas ou a été déplacée.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-linear-to-r from-orange-600 to-amber-500 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-amber-600 transition"
            >
              Retour à l’accueil
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotFoundPage;

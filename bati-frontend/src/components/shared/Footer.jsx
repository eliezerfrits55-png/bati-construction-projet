import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-orange-500 to-blue-700 text-lg font-black text-white shadow-lg shadow-orange-950/20">
                B
              </div>
              <span className="font-extrabold tracking-tight text-white">
                Bat<span className="text-orange-400">-</span>Construction
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              La plateforme de mise en relation entre clients et techniciens du
              bâtiment au Cameroun.
            </p>
          </div>

          {/* Liens */}
          <div>
            <h3 className="text-white font-semibold mb-4">Plateforme</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-orange-400 transition">
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="hover:text-orange-400 transition"
                >
                  Créer un compte
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-orange-400 transition">
                  Connexion
                </Link>
              </li>
            </ul>
          </div>

          {/* Métiers */}
          <div>
            <h3 className="text-white font-semibold mb-4">Métiers</h3>
            <ul className="space-y-2 text-sm">
              <li>Plomberie</li>
              <li>Électricité</li>
              <li>Maçonnerie</li>
              <li>Peinture</li>
              <li>Carrelage</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>support@batconstruction.cm</li>
              <li>+237 6XX XXX XXX</li>
              <li>Douala, Cameroun</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Bat-Construction. Tous droits réservés.
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <Link to="/terms" className="hover:text-orange-400 transition">
              Conditions
            </Link>
            <Link to="/privacy" className="hover:text-orange-400 transition">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

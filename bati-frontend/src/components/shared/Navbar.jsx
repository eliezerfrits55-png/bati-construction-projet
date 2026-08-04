import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "technician") return "/technician/dashboard";
    return "/client/dashboard";
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-transparent text-white backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between">
          <Link to="/" className="group flex items-center gap-3">
            <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-orange-400 via-orange-500 to-blue-700 text-lg font-black text-white shadow-lg shadow-orange-950/30 transition duration-300 group-hover:scale-105">
              B
              <span className="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-white/90" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-[1.05rem] font-extrabold tracking-tight text-white">
                Bat<span className="text-orange-400">-</span>Construction
              </span>
              <span className="mt-1 text-[0.58rem] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                Bâtir en confiance
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            <Link
              to="/"
              className="text-sm font-medium text-zinc-300 transition hover:text-white"
            >
              Accueil
            </Link>
            <a
              href="/#services"
              className="text-sm font-medium text-zinc-300 transition hover:text-white"
            >
              Services
            </a>
            <a
              href="/#comment-ca-marche"
              className="text-sm font-medium text-zinc-300 transition hover:text-white"
            >
              Comment ça marche
            </a>

            {user ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="text-sm font-medium text-zinc-300 transition hover:text-white"
                >
                  Mon espace
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-lg border border-red-400/30 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/10"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-zinc-300 transition hover:text-white"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-purple-700 shadow-lg shadow-purple-950/20 transition hover:bg-purple-50"
                >
                  S’inscrire
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="rounded-lg border border-white/10 p-2 text-zinc-200 md:hidden"
            aria-label="Ouvrir le menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-zinc-950 md:hidden">
          <div className="space-y-1 px-4 py-4">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2 text-zinc-200 hover:bg-white/5"
            >
              Accueil
            </Link>
            <a
              href="/#services"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2 text-zinc-200 hover:bg-white/5"
            >
              Services
            </a>
            <a
              href="/#comment-ca-marche"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2 text-zinc-200 hover:bg-white/5"
            >
              Comment ça marche
            </a>
            {user ? (
              <>
                <Link
                  to={getDashboardLink()}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2 text-zinc-200 hover:bg-white/5"
                >
                  Mon espace
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full rounded-lg px-3 py-2 text-left text-red-200 hover:bg-red-500/10"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2 text-zinc-200 hover:bg-white/5"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 block rounded-lg bg-white px-3 py-2 font-semibold text-purple-700"
                >
                  S’inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

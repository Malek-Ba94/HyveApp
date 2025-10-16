import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const auth = useAuth() || { isAuthenticated: false, logout: () => {} };
  const { isAuthenticated, logout } = auth;
  const navigate = useNavigate();

  const [open, setOpen] = useState(false); // l'état du menu services
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Ferme le menu si clic en dehors
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between relative">
          {/* Logo */}
          <a href="/#top" className="flex items-center gap-3">
            <img
              src="/images.png"
              alt="HYVE"
              className="h-11 w-11"
              onError={(e) => e.currentTarget.remove()}
            />
            <span className="text-xl font-extrabold tracking-tight text-[#025244]">
              HYVE
            </span>
          </a>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6 font-medium">
            {/* Dropdown Services */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="hover:text-[#025244] flex items-center gap-1"
              >
                Services
                <svg
                  className={`h-4 w-4 transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Menu déroulant */}
              {open && (
                <div className="absolute mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 z-50">
                  <Link
                    to="/etranger"
                    className="block px-4 py-2 hover:bg-slate-50"
                    onClick={() => setOpen(false)}
                  >
                    Voyages à l’étranger
                  </Link>
                  <Link
                    to="/sejours"
                    className="block px-4 py-2 hover:bg-slate-50"
                    onClick={() => setOpen(false)}
                  >
                    Séjour détente à l’hôtel
                  </Link>
                  <Link
                    to="/excursions"
                    className="block px-4 py-2 hover:bg-slate-50"
                    onClick={() => setOpen(false)}
                  >
                    Excursions guidées
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/contactinfo"
              className="hover:text-[#025244]"
              onClick={() => setOpen(false)}
            >
              Informations de contact
            </Link>

            <Link
              to="/contact"
              className="hover:text-[#025244]"
              onClick={() => setOpen(false)}
            >
              Écrivez-nous
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <>
                <a
                  href="/compte"
                  className="text-slate-700 hover:text-[#025244]"
                >
                  Mon compte
                </a>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <a
                  href="/auth/login"
                  className="text-slate-600 hover:text-[#025244]"
                >
                  Se connecter
                </a>
                <a
                  href="/auth/register"
                  className="px-4 py-2 rounded-xl border border-[#025244] bg-[#025244] text-white hover:opacity-90"
                >
                  Créer un compte
                </a>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center text-center">
      {/* Fond image */}
      <img
        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80"
        alt="Lost in desert"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Contenu */}
      <div className="relative z-10 px-4">
        <h1 className="text-9xl font-extrabold text-white tracking-widest drop-shadow-lg">404</h1>
        <p className="text-2xl mt-4 text-white drop-shadow">Oups ! Page introuvable</p>
        <p className="text-gray-200 mt-2 drop-shadow">
          Vous semblez avoir pris le mauvais chemin... ✈️
        </p>

        {/* Boutons */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <Link
            to="/"
            className="px-5 py-3 rounded-xl bg-[#b0ce58] text-black font-semibold hover:opacity-90 transition"
          >
            Retour à l’accueil
          </Link>
          <Link
            to="/contact"
            className="px-5 py-3 rounded-xl border border-white text-white hover:bg-white/10 transition"
          >
            Contactez-nous
          </Link>
        </div>
      </div>
    </div>
  );
}

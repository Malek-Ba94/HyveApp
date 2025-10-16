import React from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";
import WeatherWidget from "../Weather/weatherwidget.jsx";


export default function Home() {
  const navigate = useNavigate();

  const goRegister = async (e) => {
    e.preventDefault();
    const res = await Swal.fire({
      title: "Créer un compte",
      text: "Vous serez redirigé(e) vers la page d’inscription. Une fois connecté(e), vous pourrez réserver en ligne.",
      icon: "info",
      confirmButtonText: "Continuer",
      showCancelButton: true,
      cancelButtonText: "Annuler",
    });
    if (res.isConfirmed) navigate("/auth/register");
  };

  const handleAnchor = (e, selector) => {
    e.preventDefault();
    document.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section id="top" className="relative">
        <div
          className="h-[70vh] min-h-[420px] bg-center bg-cover flex items-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1635187691595-050e82105708?q=80&w=1280&auto=format&fit=crop")',
          }}
        >
          <div className="w-full h-full bg-gradient-to-r from-black/50 to-black/20 absolute inset-0" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-white max-w-2xl">
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
                Explorez le monde avec <span className="text-[#b0ce58]">HYVE</span>
              </h1>
              <p className="mt-4 text-lg text-slate-100">
                Voyages à l’étranger, séjours 5★ en Tunisie et excursions guidées — un service pro, des prix clairs, des souvenirs mémorables.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                
                <a
                  href="#services"
                  className="px-5 py-3 rounded-xl bg-white/10 backdrop-blur border border-white/40 hover:bg-white/20"
                  onClick={(e) => handleAnchor(e, "#services")}
                >
                  Découvrir nos services
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description générale */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-[#025244]">HYVE, votre agence de voyage</h2>
          <p className="mt-3 text-slate-600">
            De la <strong>méditerranée</strong> aux <strong>capitales asiatiques</strong>, nous concevons des itinéraires simples,
            confortables et bien organisés : circuits clés en main à l’étranger, <strong>séjours 5★</strong> à Hammamet, Sousse, Djerba,
            et <strong>excursions guidées</strong> d’une journée vers les sites majeurs (Dougga, El Jem, Carthage, Sbeitla).
          </p>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-[#025244]">À propos de nos services</h2>
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            {/* Voyages à l'étranger */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <img
                className="h-44 w-full object-cover"
                src="https://plus.unsplash.com/premium_photo-1663054911397-c7fe60ec3849?q=80&w=1024&auto=format&fit=crop"
                alt="Voyages à l'étranger - Méditerranée"
                loading="lazy"
              />
              <div className="p-5">
                <h3 className="text-lg font-semibold">Voyages à l'étranger</h3>
                <p className="mt-1 text-slate-600">
                  Maroc, France, Grèce, Italie, Japon, Corée du Sud : découvrez nos circuits internationaux tout compris.
                </p>
                <Link
                  to="/etranger"
                  className="mt-3 inline-flex items-center px-4 py-2 rounded-xl bg-[#025244] text-white hover:opacity-90"
                >
                  Voir les voyages
                </Link>
              </div>
            </div>

            {/* Séjours détente */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <img
                className="h-44 w-full object-cover"
                src="https://plus.unsplash.com/premium_photo-1675745329954-9639d3b74bbf?q=80&w=1024&auto=format&fit=crop"
                alt="Séjours 5 étoiles Tunisie"
                loading="lazy"
              />
              <div className="p-5">
                <h3 className="text-lg font-semibold">Séjour détente à l'hôtel</h3>
                <p className="mt-1 text-slate-600">
                  Hammamet, Sousse, Djerba — hôtels 5★ sélectionnés pour leur confort et leurs services.
                </p>
                <Link
                  to="/sejours"
                  className="mt-3 inline-flex items-center px-4 py-2 rounded-xl bg-[#025244] text-white hover:opacity-90"
                >
                  Voir les hôtels
                </Link>
              </div>
            </div>

            {/* Excursions guidées */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <img
                className="h-44 w-full object-cover"
                src="https://plus.unsplash.com/premium_photo-1694475198799-87d8a531b855?q=80&w=1024&auto=format&fit=crop"
                alt="Excursions en Tunisie"
                loading="lazy"
              />
              <div className="p-5">
                <h3 className="text-lg font-semibold">Excursions guidées</h3>
                <p className="mt-1 text-slate-600">Dougga, El Jem, Carthage, Sbeitla — culture, histoire et paysages en une journée.</p>
                <Link
                  to="/excursions"
                  className="mt-3 inline-flex items-center px-4 py-2 rounded-xl bg-[#025244] text-white hover:opacity-90"
                >
                  Voir les excursions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Météo */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-[#025244]">Météo</h2>
       <p className="text-slate-600 mt-2">
      🌤️ Checkez la météo de votre destination pour des vacances agréables.
       </p>
    <WeatherWidget defaultCity="Tunis" />
        </div>
     </section>


      {/* Témoignages */}
      <section id="temoignages" className="py-12 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-[#025244]">Témoignages</h2>
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            <figure className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="text-[#b0ce58]">★★★★★</div>
              <blockquote className="mt-2 text-slate-700">
                “Organisation parfaite pour notre séjour à Djerba. Zéro stress, que du soleil !”
              </blockquote>
              <figcaption className="mt-2 text-sm text-slate-500">— Amel B.</figcaption>
            </figure>
            <figure className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="text-[#b0ce58]">★★★★★</div>
              <blockquote className="mt-2 text-slate-700">
                “Circuit au Japon incroyable, guides pros et planning bien pensé.”
              </blockquote>
              <figcaption className="mt-2 text-sm text-slate-500">— Sami K.</figcaption>
            </figure>
            <figure className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="text-[#b0ce58]">★★★★★</div>
              <blockquote className="mt-2 text-slate-700">
                “Excursion à Dougga : culturel et fun, on recommande HYVE sans hésiter.”
              </blockquote>
              <figcaption className="mt-2 text-sm text-slate-500">— Inès &amp; Mehdi</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

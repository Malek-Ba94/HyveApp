import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toggleFav as saveFav } from "../../API/auth";
import axios from "axios";

const API_URL = "https://hyve-server-zsp9.onrender.com"; 

function programHTML(serviceName, dates = []) {
  const formattedDates =
    dates.length > 0
      ? dates.map((d) => `<li>${d}</li>`).join("")
      : "<li>Dates à venir</li>";

  return `
    <div style="text-align:left">
      <p><strong>Programme 7 jours — ${serviceName}</strong></p>
      <ol style="margin-left:1rem; line-height:1.6">
        <li>Jour 1 : Arrivée, transfert et installation.</li>
        <li>Jour 2 : City tour guidé, sites incontournables.</li>
        <li>Jour 3 : Excursion culturelle & dégustation locale.</li>
        <li>Jour 4 : Journée libre (shopping, activités).</li>
        <li>Jour 5 : Visite nature / patrimoine UNESCO.</li>
        <li>Jour 6 : Temps libre & soirée d’adieu.</li>
        <li>Jour 7 : Transfert aéroport & retour.</li>
      </ol>
      <hr style="margin:10px 0" />
      <p><strong>Prochaines dates :</strong></p>
      <ul style="margin-left:1rem">${formattedDates}</ul>
    </div>
  `;
}

export default function Etranger() {
  const { user, isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);

  //charger les service
useEffect(() => {
  axios
    .get(API_URL)
    .then((res) => {
      const etrangers = res.data.filter((s) => s.category === "etranger");
      setServices(etrangers);
    })
    .catch(() => {});
}, []);

  const isFav = (id) => (user?.favs || []).some((f) => f.id === id);

  const toggleFav = async (s) => {
    if (!isAuthenticated) {
      Swal.fire({
        icon: "info",
        title: "Connexion requise",
        text: "Connectez-vous pour ajouter aux favoris.",
      });
      return;
    }

    const favData = {
      id: s._id,
      title: s.name,
      img: s.photo,
      tag: "Voyage organisé",
      href: "/etranger#" + s._id,
      priceTnd: s.priceTnd,
      discountPct: s.discountPct,
      finalTnd: s.priceTnd * (1 - s.discountPct / 100),
    };

    try {
      const res = await saveFav(user._id, favData);
      if (res.data?.favs) login({ ...user, favs: res.data.favs });

      const exists = res.data?.favs?.some((f) => f.id === s._id);
      Swal.fire({
        toast: true,
        position: "top-end",
        timer: 1200,
        showConfirmButton: false,
        icon: exists ? "success" : "info",
        title: exists ? "Ajouté aux favoris" : "Retiré des favoris",
      });
    } catch (err) {}
  };

  const interested = async (s) => {
    if (!isAuthenticated) {
      Swal.fire({
        icon: "info",
        title: "Connexion requise",
        text: "Veuillez vous connecter ou créer un compte pour continuer.",
        confirmButtonText: "Aller à la connexion",
      }).then(() => navigate("/auth/login"));
      return;
    }

    const res = await Swal.fire({
      title: `Programme — ${s.name}`,
      html: programHTML(s.name, s.dates),
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Réserver et payer",
      cancelButtonText: "Annuler",
      width: 700,
    });

    if (!res.isConfirmed) return;

    navigate("/paiement", {
      state: {
        item: {
          id: s._id,
          title: `Voyage — ${s.name}`,
          img: s.photo,
          date: s.dates?.[0] || "2026-02-03",
          kind: s.category,
          priceTnd: s.priceTnd,
          discountPct: s.discountPct,
          finalTnd: s.priceTnd * (1 - s.discountPct / 100),
        },
      },
    });
  };

  return (
    <>
      <Navbar />
      <section className="bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#025244]">
            Voyages à l’étranger
          </h1>
          <p className="text-slate-600 mt-2">
            Découvrez nos circuits internationaux.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div
                key={s._id}
                id={s._id}
                className="relative bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="relative h-44">
                  <img
                    src={s.photo}
                    alt={s.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />

                  {/* Favori */}
                  <button
                    onClick={() => toggleFav(s)}
                    className={`absolute top-3 right-3 inline-flex items-center justify-center h-9 w-9 rounded-full ${
                      isFav(s._id)
                        ? "bg-[#b0ce58] text-white"
                        : "bg-white/90 border border-slate-200 text-[#025244]"
                    } hover:opacity-90`}
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12.1 21.35 10 19.28C5.4 15.36 2 12.28 2 8.5A4.5 4.5 0 0 1 6.5 4c1.74 0 3.41.81 4.5 2.09A6 6 0 0 1 22 8.5c0 3.78-3.4 6.86-8 10.78l-1.9 2.07Z" />
                    </svg>
                  </button>

                  {/* Badge remise */}
                  {s.discountPct > 0 && (
                    <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full bg-[#b0ce58] text-[#025244] font-semibold">
                      -{s.discountPct}%
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold">{s.name}</h3>
                  <p className="mt-1 text-slate-600 text-sm">
                    {s.description || "Circuit 7 jours — hôtels 4–5★, transferts & guide local."}
                  </p>

                  <div className="mt-3 flex items-end gap-3">
                    {s.discountPct > 0 && (
                      <span className="text-sm line-through text-slate-400">
                        {s.priceTnd.toLocaleString()} TND
                      </span>
                    )}
                    <span className="text-xl font-extrabold text-[#025244]">
                      {(s.priceTnd * (1 - s.discountPct / 100)).toLocaleString()} TND
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-[#025244]">
                    {s.discountPct > 0
                      ? `Places limitées, remise de ${s.discountPct}% disponible durant les dates indiquées.`
                      : "Places limitées, disponibles durant les dates indiquées."}
                  </p>

                  <div className="mt-4">
                    <button
                      onClick={() => interested(s)}
                      className="px-4 py-2 rounded-xl bg-[#025244] text-white hover:opacity-90"
                    >
                      Intéressé(e)
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

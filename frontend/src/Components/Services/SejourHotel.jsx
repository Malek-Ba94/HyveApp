import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toggleFav as saveFav } from "../../API/auth";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API_URL = "https://hyve-server-zsp9.onrender.com";

function programHTML(name) {
  return `
    <div style="text-align:left">
      <p><strong>Séjour 3 nuits — ${name}</strong></p>
      <ul style="margin-left:1rem; line-height:1.6">
        <li>Hébergement 5★ avec petit-déjeuner.</li>
        <li>Transferts aéroport (arrivée/départ).</li>
        <li>Accès piscine & spa (selon hôtel).</li>
        <li>Assistance 24/7 HYVE.</li>
      </ul>
    </div>
  `;
}

export default function SejourHotel() {
  const { user, isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        const filtered = res.data.filter((s) => s.category === "hotel");
        setHotels(filtered);
      })
      .catch(() => {});
  }, []);

  const isFav = (id) => (user?.favs || []).some((f) => f.id === id);

  const toggleFav = async (h) => {
    if (!isAuthenticated) {
      Swal.fire({
        icon: "info",
        title: "Connexion requise",
        text: "Connectez-vous pour ajouter aux favoris.",
      });
      return;
    }

    const favData = {
      id: h._id,
      title: h.name,
      img: h.photo,
      tag: "Séjour détente",
      href: "/sejours#" + h._id,
      priceTnd: h.priceTnd,
      discountPct: h.discountPct,
      finalTnd: h.priceTnd * (1 - h.discountPct / 100),
    };

    try {
      const res = await saveFav(user._id, favData);
      if (res.data?.favs) login({ ...user, favs: res.data.favs });
      const exists = res.data?.favs?.some((f) => f.id === h._id);
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

  const interested = async (h) => {
    if (!isAuthenticated) {
      Swal.fire({
        icon: "info",
        title: "Connexion requise",
        text: "Veuillez vous connecter ou créer un compte pour continuer.",
        confirmButtonText: "Aller à la connexion",
      }).then(() => navigate("/auth/login"));
      return;
    }

    // date calendrier
    const { value: selectedDate } = await Swal.fire({
      title: "Choisissez votre date de départ 📅",
      html: `
        <input type="date" id="datePicker" class="swal2-input" style="width: 60%;"/>
      `,
      confirmButtonText: "Continuer",
      showCancelButton: true,
      cancelButtonText: "Annuler",
      focusConfirm: false,
      preConfirm: () => {
        const date = document.getElementById("datePicker").value;
        if (!date) {
          Swal.showValidationMessage("Veuillez choisir une date !");
        }
        return date;
      },
    });

    if (!selectedDate) return;

    // alerte programme
    const res = await Swal.fire({
      title: `Programme — ${h.name}`,
      html: programHTML(h.name) + `<p><strong>Date choisie :</strong> ${new Date(selectedDate).toLocaleDateString("fr-FR")}</p>`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Réserver et payer",
      cancelButtonText: "Annuler",
      width: 700,
    });

    if (!res.isConfirmed) return;

    // reddirection lel page paiement
    navigate("/paiement", {
      state: {
        item: {
          id: h._id,
          title: `Séjour — ${h.name}`,
          img: h.photo,
          date: selectedDate,
          kind: h.category,
          priceTnd: h.priceTnd,
          discountPct: h.discountPct,
          finalTnd: h.priceTnd * (1 - h.discountPct / 100),
        },
      },
    });
  };

  return (
    <>
      <Navbar />
      <section className="bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#025244]">Séjours à l’hôtel (5★)</h1>
          <p className="text-slate-600 mt-2">Hammamet, Sousse, Djerba — confort & services premium.</p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {hotels.map((h) => (
              <div key={h._id} className="relative bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="relative h-44">
                  <img src={h.photo} alt={h.name} loading="lazy" className="h-full w-full object-cover" />

                  <button
                    onClick={() => toggleFav(h)}
                    className={`absolute top-3 right-3 inline-flex items-center justify-center h-9 w-9 rounded-full ${
                      isFav(h._id)
                        ? "bg-[#b0ce58] text-white"
                        : "bg-white/90 border border-slate-200 text-[#025244]"
                    } hover:opacity-90`}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.1 21.35 10 19.28C5.4 15.36 2 12.28 2 8.5A4.5 4.5 0 0 1 6.5 4c1.74 0 3.41.81 4.5 2.09A6 6 0 0 1 22 8.5c0 3.78-3.4 6.86-8 10.78l-1.9 2.07Z" />
                    </svg>
                  </button>

                  {h.discountPct > 0 && (
                    <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full bg-[#b0ce58] text-[#025244] font-semibold">
                      -{h.discountPct}%
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold">{h.name}</h3>
                  <p className="mt-1 text-slate-600 text-sm">{h.description || "Package 3 nuits — transferts inclus."}</p>

                  <div className="mt-3 flex items-end gap-3">
                    {h.discountPct > 0 && (
                      <span className="text-sm line-through text-slate-400">{h.priceTnd.toLocaleString()} TND</span>
                    )}
                    <span className="text-xl font-extrabold text-[#025244]">
                      {(h.priceTnd * (1 - h.discountPct / 100)).toLocaleString()} TND
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-[#025244]">
                    {h.discountPct > 0
                      ? `Envie de vous détendre ? Réservez vite, la remise de ${h.discountPct}% disponible jusqu'au 31/12/2025.`
                      : "Envie de vous détendre ? Réservez vite, les places sont limitées !"}
                  </p>

                  <div className="mt-4">
                    <button
                      onClick={() => interested(h)}
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

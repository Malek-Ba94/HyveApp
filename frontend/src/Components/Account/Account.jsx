import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserOrders, cancelOrder } from "../../API/orders"; 
import { toggleFav } from "../../API/auth"; 

export default function Account() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const favoris = user?.favs ?? [];
  const trips = user?.trips ?? [];

  useEffect(() => {
    if (user?._id) {
      getUserOrders(user._id).then((res) => setOrders(res.data));
    }
  }, [user]);

  // Favoris
  const removeFavorite = async (fav) => {
    try {
      const res = await toggleFav(user._id, fav);
      const newFavs = res.data.favs;
      login({ ...user, favs: newFavs });

      Swal.fire({
        toast: true,
        position: "top-end",
        timer: 1200,
        showConfirmButton: false,
        icon: "info",
        title: "Retiré des favoris",
      });
    } catch (err) {
      console.error("Erreur suppression favoris :", err);
      Swal.fire("Erreur", "Impossible de retirer ce favori", "error");
    }
  };

  const bookFavorite = async (fav) => {
    const priceTnd = fav.priceTnd;
    const discountPct = fav.discountPct || 0;
    const finalTnd = fav.finalTnd || priceTnd;

    navigate("/paiement", {
      state: {
        from: "favorite",
        item: {
          id: fav.id,
          title: fav.title || "Réservation HYVE",
          img: fav.img || "",
          date: new Date().toISOString().slice(0, 10),
          kind: fav.kind || "voyage",
          priceTnd,
          discountPct,
          finalTnd,
        },
      },
    });
  };

  // Annuler
  const handleCancel = async (orderId) => {
    const res = await Swal.fire({
      icon: "warning",
      title: "Êtes-vous sûr ?",
      text: "Vous recevrez votre remboursement sous 5 jours ouvrés.",
      showCancelButton: true,
      confirmButtonText: "Oui, annuler",
      cancelButtonText: "Non",
    });

    if (res.isConfirmed) {
      await cancelOrder(orderId);
      Swal.fire("Annulé", "Votre réservation a été annulée.", "success");

      const refreshed = await getUserOrders(user._id);
      setOrders(refreshed.data);
    }
  };

  const confirmedOrders = orders.filter((o) => o.status === "Confirmé");
  const cancelledOrders = orders.filter((o) => o.status === "Annulé");

  return (
    <>
      <Navbar />
      <section className="bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#025244]">
            Bonjour {user?.prenom}
          </h1>
          <p className="text-slate-600 mt-2">
            Retrouvez vos favoris et vos voyages confirmés.
          </p>

          {/* Favoris */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-[#025244]">Mes favoris</h2>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              {favoris.length === 0 ? (
                <p className="text-slate-500">Aucun favori pour l’instant.</p>
              ) : (
                favoris.map((f) => {
                  const priceTnd = f.priceTnd;
                  const discountPct = f.discountPct || 0;
                  const finalTnd = f.finalTnd || priceTnd;

                  return (
                    <div
                      key={f.id}
                      className="relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
                    >
                      <div className="relative h-36 w-full">
                        {f.img && (
                          <img
                            src={f.img}
                            alt={f.title}
                            className="h-full w-full object-cover"
                          />
                        )}
                        <button
                          onClick={() => removeFavorite(f)}
                          className="absolute top-3 right-3 inline-flex items-center justify-center h-9 w-9 rounded-full bg-white/90 border border-slate-200 hover:bg-white"
                          title="Retirer des favoris"
                        >
                          <svg
                            className="h-5 w-5 text-[#025244]"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12.1 21.35 10 19.28C5.4 15.36 2 12.28 2 8.5A4.5 4.5 0 0 1 6.5 4c1.74 0 3.41.81 4.5 2.09A6 6 0 0 1 22 8.5c0 3.78-3.4 6.86-8 10.78l-1.9 2.07Z" />
                          </svg>
                        </button>

                        {discountPct > 0 && (
                          <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full bg-[#b0ce58] text-[#025244] font-semibold">
                            -{discountPct}%
                          </span>
                        )}
                      </div>

                      <div className="p-5">
                        <div className="text-sm text-slate-500">
                          {f.tag || "Produit"}
                        </div>
                        <div className="mt-1 font-semibold">{f.title}</div>

                        <div className="mt-2 flex items-end gap-2">
                          {discountPct > 0 && (
                            <span className="text-sm line-through text-slate-400">
                              {priceTnd.toLocaleString()} TND
                            </span>
                          )}
                          <span className="text-lg font-extrabold text-[#025244]">
                            {finalTnd.toLocaleString()} TND
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-[#025244]">
                          <strong>Places limitées :</strong>{" "}
                          {discountPct > 0
                            ? `Remise de ${discountPct}% disponible durant les dates indiquées.`
                            : "Disponibles durant les dates indiquées."}
                        </p>

                        <div className="mt-3">
                          <button
                            onClick={() => bookFavorite(f)}
                            className="px-3 py-2 rounded-xl bg-[#025244] text-white text-sm hover:opacity-90"
                          >
                            Réserver & payer
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Confirmer */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-[#025244]">
              Mes voyages confirmés
            </h2>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              {confirmedOrders.length === 0 ? (
                <p className="text-slate-500">Aucune réservation confirmée.</p>
              ) : (
                confirmedOrders.map((o) => (
                  <div
                    key={o._id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
                  >
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">{o.titre}</div>
                        <span className="text-xs px-2 py-1 rounded-full border text-[#025244] border-[#025244]">
                          {o.status}
                        </span>
                      </div>
                      <div className="text-slate-600 mt-1 text-sm">
                        Départ : {o.date}
                      </div>
                      <div className="mt-1 text-sm">
                        Prix payé :{" "}
                        <span className="font-semibold">
                          {o.montant.toLocaleString()} TND
                        </span>
                      </div>
                      <div className="mt-3">
                        <button
                          onClick={() => handleCancel(o._id)}
                          className="px-3 py-2 rounded-xl bg-[#025244] text-white text-sm hover:opacity-90"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Annuler */}
          {cancelledOrders.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold text-[#025244]">
                Voyages annulés
              </h2>
              <div className="mt-4 grid md:grid-cols-2 gap-4">
                {cancelledOrders.map((o) => (
                  <div
                    key={o._id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden opacity-80"
                  >
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">{o.titre}</div>
                        <span className="text-xs px-2 py-1 rounded-full border border-red-500 text-red-500">
                          Annulé
                        </span>
                      </div>
                      <div className="text-slate-600 mt-1 text-sm">
                        Départ : {o.date}
                      </div>
                      <div className="mt-1 text-sm">
                        Prix payé :{" "}
                        <span className="font-semibold">
                          {o.montant.toLocaleString()} TND
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}

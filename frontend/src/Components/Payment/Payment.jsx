import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";
import { useAuth } from "../../context/AuthContext";
import { createOrder } from "../../API/orders";
import { toggleFav } from "../../API/auth";

function VisaLogo() {
  return (
    <svg viewBox="0 0 64 24" className="h-6">
      <rect width="64" height="24" rx="4" fill="#1a1f71" />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="#fff"
        fontWeight="800"
        fontSize="12"
      >
        VISA
      </text>
    </svg>
  );
}

function MasterLogo() {
  return (
    <svg viewBox="0 0 64 24" className="h-6">
      <rect width="64" height="24" rx="4" fill="#000" />
      <circle cx="26" cy="12" r="7" fill="#ea001b" />
      <circle cx="38" cy="12" r="7" fill="#ff5f00" />
    </svg>
  );
}

function PaypalLogo() {
  return (
    <svg viewBox="0 0 64 24" className="h-6">
      <rect width="64" height="24" rx="4" fill="#003087" />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="#fff"
        fontWeight="700"
        fontSize="10"
      >
        PayPal
      </text>
    </svg>
  );
}

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, login } = useAuth();
  const item = state?.item;

  if (!item) {
    return (
      <>
        <Navbar />
        <section className="py-20 text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Erreur : Aucun produit à payer
          </h1>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-5 py-3 rounded-xl bg-[#025244] text-white hover:opacity-90"
          >
            Retour à l’accueil
          </button>
        </section>
        <Footer />
      </>
    );
  }

  const [method, setMethod] = useState("card");
  const [form, setForm] = useState({
    name: "",
    number: "",
    expiry: "",
    cvc: "",
    paypalEmail: "",
  });

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handlePay = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      await Swal.fire({
        icon: "info",
        title: "Connexion requise",
        text: "Veuillez vous connecter pour finaliser le paiement.",
      });
      navigate("/auth/login");
      return;
    }

    Swal.fire({
      title: "Traitement du paiement…",
      text: "Veuillez patienter.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
    });
    await new Promise((r) => setTimeout(r, 2000));
    Swal.close();

    try {
      // enregistrer backend+envoi mail
      const res = await createOrder({
        userId: user._id,
        email: user.email,
        voyageId: item.id,
        montant: item.finalTnd || item.priceTnd,
        methode: method,
        titre: item.title,
        date: item.date || new Date().toISOString().slice(0, 10),
      });

      // supprime le voyage des favoris si le paiement vient du favori
      const existingFav = (user.favs || []).find((f) => f.id === item.id);
      let updatedFavs = user.favs;
      if (existingFav) {
        try {
          const favRes = await toggleFav(user._id, existingFav);
          updatedFavs = favRes.data.favs;
        } catch (favErr) {}
      }

      // mise à jour locale du contexte utilisateur
      const updatedUser = {
        ...user,
        trips: res.data.user?.trips || user.trips || [],
        favs: updatedFavs,
      };
      login(updatedUser);

      // alerte confirmation
      await Swal.fire({
        icon: "success",
        title: "Paiement confirmé ✅",
        html: `
          <p>Votre réservation a été confirmée avec succès.</p>
          <p>Un email de confirmation vous a été envoyé à <strong>${user.email}</strong>.</p>
        `,
        confirmButtonText: "Voir mon compte",
      });

      navigate("/compte");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Erreur serveur",
        text: "Impossible d’enregistrer la commande.",
      });
    }
  };

  return (
    <>
      <Navbar />
      <section className="bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <h1 className="text-3xl font-extrabold text-[#025244]">Paiement</h1>
          <p className="text-slate-600 mt-2">
            Finalisez le paiement pour{" "}
            <span className="font-semibold">{item.title}</span>.
          </p>

          {/*prixx */}
          <div className="mt-6 bg-white rounded-2xl border p-5 shadow-sm">
            {item.img && (
              <img
                src={item.img}
                alt={item.title}
                className="h-40 w-full object-cover rounded-xl"
              />
            )}
            <div className="mt-4">
              <div className="text-sm text-slate-500">
                {item.kind ? `Type : ${item.kind}` : "Réservation"}
              </div>
              <div className="font-semibold">{item.title}</div>
              {item.date && (
                <div className="text-slate-600 text-sm mt-1">
                  Date : {item.date}
                </div>
              )}
              <div className="mt-3 flex items-end gap-3">
                {item.discountPct > 0 && (
                  <span className="text-sm line-through text-slate-400">
                    {item.priceTnd.toLocaleString()} TND
                  </span>
                )}
                <span className="text-xl font-extrabold text-[#025244]">
                  {(item.finalTnd || item.priceTnd).toLocaleString()} TND
                </span>
                {item.discountPct > 0 && (
                  <span className="text-xs px-2 py-1 rounded-full bg-[#b0ce58]/20 text-[#025244] font-semibold">
                    -{item.discountPct}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* mode depaiement */}
          <form
            onSubmit={handlePay}
            className="mt-6 bg-white rounded-2xl border p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-[#025244]">
              Méthode de paiement
            </h2>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              <label
                className={`border rounded-xl p-3 cursor-pointer flex items-center gap-2 ${
                  method === "card"
                    ? "border-[#025244] bg-[#025244]/5"
                    : "border-slate-200"
                }`}
              >
                <input
                  type="radio"
                  value="card"
                  checked={method === "card"}
                  onChange={() => setMethod("card")}
                  className="accent-[#025244]"
                />
                <span className="flex items-center gap-2">
                  <VisaLogo />
                  <MasterLogo />
                </span>
              </label>
              <label
                className={`border rounded-xl p-3 cursor-pointer flex items-center gap-2 ${
                  method === "paypal"
                    ? "border-[#025244] bg-[#025244]/5"
                    : "border-slate-200"
                }`}
              >
                <input
                  type="radio"
                  value="paypal"
                  checked={method === "paypal"}
                  onChange={() => setMethod("paypal")}
                  className="accent-[#025244]"
                />
                <PaypalLogo />
              </label>
            </div>

            {method === "card" && (
              <div className="mt-6 grid gap-4">
                <input
                  name="name"
                  value={form.name}
                  onChange={update}
                  placeholder="Nom sur la carte"
                  className="w-full rounded-xl border px-3 py-2"
                />
                <input
                  name="number"
                  value={form.number}
                  onChange={update}
                  placeholder="•••• •••• •••• ••••"
                  className="w-full rounded-xl border px-3 py-2"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    name="expiry"
                    value={form.expiry}
                    onChange={update}
                    placeholder="12/28"
                    className="w-full rounded-xl border px-3 py-2"
                  />
                  <input
                    name="cvc"
                    value={form.cvc}
                    onChange={update}
                    placeholder="123"
                    className="w-full rounded-xl border px-3 py-2"
                  />
                </div>
              </div>
            )}

            {method === "paypal" && (
              <div className="mt-6">
                <input
                  name="paypalEmail"
                  value={form.paypalEmail}
                  onChange={update}
                  placeholder="vous@paypal.com"
                  className="w-full rounded-xl border px-3 py-2"
                />
              </div>
            )}

            <div className="mt-8 flex gap-3">
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-[#025244] text-white hover:opacity-90"
              >
                Payer maintenant
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-50"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
}

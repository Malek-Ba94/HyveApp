import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../API/auth";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { login } = useAuth();

  // Effet image
  const tiltRef = useRef(null);

  const handleTilt = (e) => {
    const c = tiltRef.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    const x = e.clientX - r.left,
      y = e.clientY - r.top;
    const rx = -((y - r.height / 2) / (r.height / 2)) * 10;
    const ry = ((x - r.width / 2) / (r.width / 2)) * 10;
    c.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
  };

  const resetTilt = () => {
    if (tiltRef.current)
      tiltRef.current.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
  };

  const update = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Connexion
  const submit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      Swal.fire({
        icon: "warning",
        title: "Champs manquants",
        text: "Email et mot de passe sont requis.",
      });
      return;
    }


    // backend
    try {
      const res = await loginUser(form);

      if (!res.data || !res.data.email) {
        throw new Error("Réponse inattendue du serveur");
      }

      const user = res.data;

      // enregistrement mta3 l contexte utilisateur
      login(user);

      await Swal.fire({
        icon: "success",
        title: "Connexion réussie",
        text: `Bienvenue ${user.prenom} ${user.nom} 👋`,
        timer: 1500,
        showConfirmButton: false,
      });

      // pause avant redirection
      navigate("/compte", { replace: true });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Erreur de connexion",
        text:
          err.response?.data?.error ||
          err.message ||
          "Impossible de se connecter. Vérifiez vos identifiants.",
      });
    }
  };

  //mot de passe oublié
  const forgotPassword = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "info",
      title: "Réinitialisation du mot de passe",
      text: "Un email de réinitialisation vous sera envoyé sous peu.",
      confirmButtonText: "OK",
    });
  };

  return (
    <>
      <Navbar />
      <section className="bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <p className="text-sm uppercase tracking-widest text-[#025244] font-semibold">
                Ravis de vous revoir
              </p>
              <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold leading-tight">
                Connectez-vous et{" "}
                <span className="text-[#b0ce58]">reprenez</span> vos voyages
              </h1>
              <p className="mt-3 text-slate-600">
                Accédez à vos réservations, vos préférences et nos offres
                privées.
              </p>
            </div>
            <div
              ref={tiltRef}
              onMouseMove={handleTilt}
              onMouseLeave={resetTilt}
              className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 h-64 sm:h-80 lg:h-96 bg-center bg-cover"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=60")',
                transition: "transform .12s ease-out",
              }}
              aria-label="Inspiration voyage"
            />
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <form
            onSubmit={submit}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8"
          >
            <h2 className="text-2xl font-bold text-[#025244]">Se connecter</h2>
            <p className="text-slate-600 mt-1 text-sm">
              Renseignez vos identifiants pour accéder à votre espace.
            </p>

            <div className="mt-6">
              <label className="block">
                <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  Adresse email *
                </span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={update}
                  className="mt-1 w-full rounded-xl border-slate-300 focus:border-[#025244] focus:ring-[#025244]"
                  placeholder="vous@exemple.com"
                  required
                />
              </label>
            </div>

            <div className="mt-4">
              <label className="block">
                <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  Mot de passe *
                </span>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={update}
                  className="mt-1 w-full rounded-xl border-slate-300 focus:border-[#025244] focus:ring-[#025244]"
                  placeholder="Votre mot de passe"
                  required
                />
              </label>
              <div className="mt-2 text-right">
                <a
                  href="#"
                  onClick={forgotPassword}
                  className="text-sm text-[#025244] underline"
                >
                  Mot de passe oublié ?
                </a>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-[#025244] text-white hover:opacity-90"
              >
                Se connecter
              </button>
              <p className="text-sm text-slate-600">
                Pas de compte ?{" "}
                <a href="/auth/register" className="text-[#025244] underline">
                  Créer un compte
                </a>
              </p>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
}

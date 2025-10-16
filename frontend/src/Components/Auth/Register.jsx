import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";
import { registerUser } from "../../API/auth";

export default function Register() {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [naissance, setNaissance] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [pref, setPref] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const navigate = useNavigate();

  // effet image
  const tiltRef = useRef(null);
  const handleTilt = (e) => {
    const card = tiltRef.current;
    if (!card) return;
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left,
      y = e.clientY - r.top;
    const rx = -((y - r.height / 2) / (r.height / 2)) * 10;
    const ry = ((x - r.width / 2) / (r.width / 2)) * 10;
    card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
  };
  const resetTilt = () => {
    if (tiltRef.current)
      tiltRef.current.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
  };

  // vider inputs
  const resetForm = () => {
    setPrenom("");
    setNom("");
    setNaissance("");
    setEmail("");
    setTel("");
    setPref("");
    setPassword("");
    setConfirm("");
  };

  // Enregistrer compass
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!prenom || !nom || !naissance || !email || !tel || !password || !confirm) {
      Swal.fire({
        icon: "warning",
        title: "Champs manquants",
        text: "Merci de remplir tous les champs obligatoires.",
      });
      return;
    }
    if (password.length < 9) {
      Swal.fire({
        icon: "warning",
        title: "Mot de passe trop court",
        text: "Au moins 9 caractères.",
      });
      return;
    }
    if (password !== confirm) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Les mots de passe ne correspondent pas.",
      });
      return;
    }

    // envoyer lel backend Express
    try { 
      const res = await registerUser({
        prenom,
        nom,
        naissance,
        email,
        tel,
        pref,
        password,
      });

      await Swal.fire({
        icon: "success",
        title: "Compte créé ✅",
        html: `<b>${prenom} ${nom}</b>, votre compte HYVE est enregistré.`,
        confirmButtonText: "Se connecter",
      });

      resetForm();
      navigate("/auth/login");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Erreur d'inscription",
        text:
          err.response?.data?.error ||
          "Impossible de créer le compte. Vérifiez les champs.",
      });
    }
  };

  return (
    <>
      <Navbar />

      {/* hero */}
      <section className="bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <p className="text-sm uppercase tracking-widest text-[#025244] font-semibold">
                Bienvenue chez HYVE
              </p>
              <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold leading-tight">
                Rejoignez la tribu des{" "}
                <span className="text-[#b0ce58]">voyageurs</span>
              </h1>
              <p className="mt-3 text-slate-600">
                Dites-nous qui vous êtes et comment vous aimez voyager. Ensuite,
                on s’occupe du reste : idées, offres et réservations.
              </p>
            </div>

            <div
              ref={tiltRef}
              onMouseMove={handleTilt}
              onMouseLeave={resetTilt}
              className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 h-64 sm:h-80 lg:h-96 bg-center bg-cover"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1400&q=60")',
                transition: "transform .12s ease-out",
              }}
              aria-label="Photo d’inspiration voyage"
            />
          </div>
        </div>
      </section>

      {/* formulaire */}
      <section className="py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <form
            onSubmit={handleRegister}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8"
          >
            <h2 className="text-2xl font-bold text-[#025244]">Créer mon compte</h2>
            <p className="text-slate-600 mt-1 text-sm">
              Quelques infos pour personnaliser votre expérience HYVE.
            </p>

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <input
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Prénom *"
                className="rounded-xl border px-3 py-2"
                required
              />
              <input
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Nom *"
                className="rounded-xl border px-3 py-2"
                required
              />
            </div>

            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <input
                type="date"
                value={naissance}
                onChange={(e) => setNaissance(e.target.value)}
                className="rounded-xl border px-3 py-2"
                required
              />
              <input
                type="tel"
                value={tel}
                onChange={(e) => setTel(e.target.value)}
                placeholder="+216 xx xxx xxx"
                className="rounded-xl border px-3 py-2"
                required
              />
            </div>

            <div className="mt-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email *"
                className="rounded-xl border px-3 py-2 w-full"
                required
              />
            </div>

            <div className="mt-4">
              <select
                value={pref}
                onChange={(e) => setPref(e.target.value)}
                className="w-full rounded-xl border px-3 py-2"
              >
                <option value="">Préférence de voyage (optionnel)</option>
                <option value="solo">En solo</option>
                <option value="couple">En couple</option>
                <option value="groupe">En groupe</option>
              </select>
            </div>

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe *"
                className="rounded-xl border px-3 py-2"
                required
              />
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirmer *"
                className="rounded-xl border px-3 py-2"
                required
              />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-[#025244] text-white hover:opacity-90"
              >
                Créer mon compte
              </button>
              <a href="/auth/login" className="text-[#025244] underline">
                J’ai déjà un compte
              </a>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
}

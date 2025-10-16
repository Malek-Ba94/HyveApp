import { useState } from "react";
import Swal from "sweetalert2";
import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";
import { sendMessage } from "../../API/contact"; // ✅ IMPORT

export default function ContactSection() {
  const [form, setForm] = useState({
    nom: "",
    email: "",
    message: "",
  });

  const update = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.nom || !form.email || !form.message) {
      Swal.fire({
        icon: "warning",
        title: "Champs manquants",
        text: "Merci de remplir tous les champs.",
      });
      return;
    }

    try {
      await sendMessage(form); // hedhi lel appel mta3 l backend
      Swal.fire({
        icon: "success",
        title: "Message envoyé",
        text: "Nous vous répondrons par email sous peu.",
      });
      
      setForm({ nom: "", email: "", message: "" }); // reset form
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Impossible d’envoyer le message. Réessayez plus tard.",
      });
    }
  };

  return (
    <>
      <Navbar />

      {/* Formulaire de contact */}
      <div className="mt-10 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <h3 className="text-xl font-semibold text-[#025244]">Envoyer un message</h3>
        <form onSubmit={submit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Nom *</label>
            <input
              type="text"
              name="nom"
              value={form.nom}
              onChange={update}
              className="mt-1 w-full rounded-xl border border-slate-300 focus:border-[#025244] focus:ring-[#025244] px-3 py-2"
              placeholder="Votre nom complet"
              required:true
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Email *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={update}
              className="mt-1 w-full rounded-xl border border-slate-300 focus:border-[#025244] focus:ring-[#025244] px-3 py-2"
              placeholder="vous@exemple.com"
              required:true
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Message *</label>
            <textarea
              name="message"
              value={form.message}
              onChange={update}
              className="mt-1 w-full rounded-xl border border-slate-300 focus:border-[#025244] focus:ring-[#025244] px-3 py-2"
              placeholder="Votre message"
              rows="4"
              required:true
            ></textarea>
          </div>

          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-[#025244] text-white hover:opacity-90"
          >
            Envoyer
          </button>
        </form>
      </div>

      <Footer />
    </>
  );
}

import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";

export default function Contactinfo() {
  return (
    <>
      <Navbar />

      <section id="contact" className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-[#025244]">
            Informations de contact
          </h2>

          <div className="mt-4 grid md:grid-cols-3 gap-6">
            {/* Email */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-start gap-3">
              <svg
                className="h-6 w-6 text-[#025244] flex-shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11A2.5 2.5 0 0 1 19.5 20h-15A2.5 2.5 0 0 1 2 17.5v-11Zm2 .3V8l8 5 8-5V6.8l-8 5-8-5Z" />
              </svg>
              <div>
                <h3 className="font-semibold">Email</h3>
                <a
                  href="mailto:contact@hyve.tn"
                  className="text-slate-600 mt-1 inline-block"
                >
                  travelhyve@gmail.com
                </a>
              </div>
            </div>

            {/* Téléphone */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-start gap-3">
              <svg
                className="h-6 w-6 text-[#025244] flex-shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.25c1.11.37 2.31.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.07 21 3 13.93 3 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.27.2 2.47.57 3.58a1 1 0 0 1-.25 1.01l-2.2 2.2Z" />
              </svg>
              <div>
                <h3 className="font-semibold">Téléphone</h3>
                <a
                  href="tel:+21670000000"
                  className="text-slate-600 mt-1 inline-block"
                >
                  +216 70 000 000
                </a>
              </div>
            </div>

            {/* Adresse */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-start gap-3">
              <svg
                className="h-6 w-6 text-[#025244] flex-shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2C8.69 2 6 4.69 6 8c0 4.33 5.02 10.11 5.24 10.36.2.23.55.23.76 0C12.98 18.11 18 12.33 18 8c0-3.31-2.69-6-6-6Zm0 8.5A2.5 2.5 0 1 1 12 5.5a2.5 2.5 0 0 1 0 5Z" />
              </svg>
              <div>
                <h3 className="font-semibold">Adresse</h3>
                <p className="text-slate-600 mt-1">Bab Bhar, Tunis, Tunisie</p>
              </div>
            </div>
          </div>

          {/* Google Maps */}
          <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-3">
            <div className="relative w-full h-64 rounded-xl overflow-hidden">
              <iframe
                className="absolute inset-0 w-full h-full border-0"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6389.8044312991215!2d10.172237612832044!3d36.796894829821206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd3473354e8a2d%3A0xe29ef57c422fbb3c!2sBab%20Bhar%2C%20Tunis%2C%20Tunisie!5e0!3m2!1sfr!2sgr!4v1758476524855!5m2!1sfr!2sgr"
                title="HYVE localisation"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

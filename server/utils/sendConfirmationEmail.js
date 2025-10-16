import { SendEmail } from "../mailsender.js";

export async function sendConfirmationEmail(to, trip) {
  if (!to || !trip) return;

  try {
    const { title, finalTnd, date } = trip;

    const defaultImg =
      "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870";

    const htmlContent = `
      <div style="font-family:'Segoe UI',Arial,sans-serif;background-color:#f0f5f2;padding:30px;">
        <div style="max-width:680px;margin:auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);">
          
          
          <div style="background:linear-gradient(135deg,#025244,#b0ce58);color:white;text-align:center;padding:28px 20px;">
            <h1 style="margin:0;font-size:26px;letter-spacing:0.5px;">Votre réservation est confirmée 🎉</h1>
            <p style="margin-top:8px;font-size:16px;opacity:0.9;">Merci d’avoir choisi <strong>HYVE Voyages</strong></p>
          </div>

          
          <img src="${defaultImg}" alt="Destination" style="width:100%;height:260px;object-fit:cover;display:block;">

          
          <div style="padding:30px;">
            <h2 style="color:#025244;font-size:22px;margin-top:0;">${title}</h2>
            <table style="width:100%;margin-top:15px;border-collapse:collapse;font-size:15px;">
              <tr>
                <td style="padding:6px 0;color:#555;">🗓️ <strong>Date de départ :</strong></td>
                <td style="padding:6px 0;text-align:right;">${new Date(date).toLocaleDateString("fr-FR")}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#555;">💰 <strong>Montant payé :</strong></td>
                <td style="padding:6px 0;text-align:right;color:#025244;font-weight:bold;">${finalTnd.toLocaleString()} TND</td>
              </tr>
            </table>

            <div style="background:#f7fbf8;border-left:5px solid #b0ce58;padding:16px;margin:25px 0;border-radius:8px;">
              <p style="margin:0;font-size:15px;line-height:1.7;color:#333;">
                ✈️ Votre réservation a été <strong>validée avec succès</strong>.<br>
                Vous recevrez très bientôt tous les détails nécessaires avant votre départ 🌍.
              </p>
            </div>

            <hr style="border:none;border-top:1px solid #eee;margin:30px 0;">

            <p style="font-size:14px;color:#555;margin:0;">
              🧳 <strong>HYVE Voyages</strong> vous remercie pour votre confiance.<br>
              Nous avons hâte de vous faire découvrir de nouvelles aventures uniques !
            </p>
          </div>

          
          <div style="background:#025244;color:white;text-align:center;padding:24px;">
            <h3 style="margin:0;font-size:18px;font-weight:600;">HYVE Voyages</h3>
            <p style="margin:6px 0 12px;font-size:14px;opacity:0.9;">Explorez. Vivez. Ressentez.</p>
            <p style="margin:0;font-size:12px;opacity:0.8;">
              ✉️ travelhyve@gmail.com &nbsp; | &nbsp; 📍 Tunis, Tunisie
            </p>
          </div>
        </div>
      </div>
    `;

    await SendEmail({
      from: '"HYVE Voyages" <travelhyve@gmail.com>',
      to,
      subject: "✈️ Confirmation de votre réservation – HYVE Voyages",
      html: htmlContent,
    });
  } catch (err) {
    console.error("Erreur envoi email :", err.message);
  }
}

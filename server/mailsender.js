import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export async function SendEmail(mailOptions) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "travelhyve@gmail.com",
        pass: process.env.EMAILPASSWORD,
      },
    });

    await transporter.sendMail(mailOptions);
  } catch (error) {}
}

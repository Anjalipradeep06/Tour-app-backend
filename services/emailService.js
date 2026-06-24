import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text, html }) => {
  console.log("sendEmail called");
  console.log("TO:", to);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.verify();
    console.log("SMTP Connected");

    const info = await transporter.sendMail({
      from: `"Tour Booking System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Mail sent:", info.messageId);
  } catch (error) {
    console.error("EMAIL ERROR:", error);
  }
};
import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text, html }) => {
  console.log("sendEmail called");
  console.log("TO:", to);

 const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,        // STARTTLS, not SSL
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
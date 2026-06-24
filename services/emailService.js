import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  console.log("sendEmail called");
  console.log("TO:", to);

  try {
    await sgMail.send({
      from: "Meridian Travel <anjalipradeep126@gmail.com>",
      to,
      subject,
      html,
    });
    console.log("Mail sent");
  } catch (error) {
    console.error("EMAIL ERROR:", error.response?.body || error);
  }
};
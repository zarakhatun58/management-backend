import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  try {
    console.log("📧 Trying to send email...");
    console.log("➡️ To:", to);
    console.log("➡️ User:", process.env.EMAIL_USER);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();
    console.log("✅ SMTP connection verified");

    const info = await transporter.sendMail({
      from: `"School Management" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent successfully:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ Error in sendEmail:", err.message);
    if (err.response) {
      console.error("📩 SMTP Response:", err.response);
    }
    throw err;
  }
};

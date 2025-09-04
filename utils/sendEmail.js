import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  try {
    console.log("📧 Trying to send email...");
    console.log("➡️ To:", to);

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // smtp-relay.brevo.com
      port: process.env.EMAIL_PORT, // 587
      secure: false, // TLS over 587 (use true if port 465)
      auth: {
        user: process.env.EMAIL_USER, // Brevo login
        pass: process.env.EMAIL_PASS, // Brevo SMTP key
      },
    });

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
    throw err;
  }
};
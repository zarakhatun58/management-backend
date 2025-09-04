import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  try {
    console.log("📧 Trying to send email...");
    console.log("➡️ To:", to);

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, 
      port: process.env.EMAIL_PORT,     
      secure: false,                   
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,   
      },
      tls: {
        rejectUnauthorized: false, 
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
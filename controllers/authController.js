import db from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";

export const register = (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ message: "All fields required" });

  db.query("SELECT * FROM users WHERE email=?", [email], async (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    db.query("INSERT INTO users (username, email, password) VALUES (?,?,?)",
      [username, email, hashedPassword],
      (err2, result2) => {
        if (err2) return res.status(500).json(err2);
        res.json({ message: "Registration successful" });
      }
    );
  });
};

export const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "All fields required" });

  db.query("SELECT * FROM users WHERE email=?", [email], async (err, results) => {
    if (err) return res.status(500).json(err);
    if (!results.length) return res.status(400).json({ message: "User not found" });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ message: "Login successful", token, user: { id: user.id, username: user.username, email: user.email } });
  });
};

const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}; 

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const rows = await query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); 

    await query("UPDATE users SET otp = ?, otp_expiry = ? WHERE email = ?", [
      otp,
      expiry,
      email,
    ]);

    await sendEmail(
      email,
      "Password Reset OTP",
      `
        <h2>School Management System</h2>
        <p>Hello,</p>
        <p>Your OTP for password reset is:</p>
        <h3 style="color:blue;">${otp}</h3>
        <p>This code will expire in 10 minutes.</p>
      `
    );

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("❌ forgotPassword error:", err.message);

    res.status(500).json({
      message: "Server error",
      error: err.message  
    });
  }
};


export const verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  db.query("SELECT * FROM users WHERE email=? AND otp=?", [email, otp], (err, results) => {
    if (err) return res.status(500).json(err);
    if (!results.length) return res.status(400).json({ message: "Invalid OTP" });

    const user = results[0];
    if (new Date() > new Date(user.otp_expiry)) return res.status(400).json({ message: "OTP expired" });

    res.json({ message: "OTP verified" });
  });
};

export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) return res.status(400).json({ message: "All fields required" });

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  db.query("UPDATE users SET password=?, otp=NULL, otp_expiry=NULL WHERE email=?", [hashedPassword, email], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Password reset successful" });
  });
};

export const getProfile = (req, res) => {
    const userId = req.user?.id; 
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const sql = "SELECT id, username, email, created_at FROM users WHERE id=?";
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ message: "User not found" });
        res.json(results[0]);
    });
};


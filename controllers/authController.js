import db from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";


const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// ========================== REGISTER ==========================
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await query("SELECT * FROM users WHERE email=?", [email]);
    if (existing.length) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await query("INSERT INTO users (username, email, password) VALUES (?,?,?)", [
      username,
      email,
      hashedPassword,
    ]);

    res.json({ message: "Registration successful" });
  } catch (err) {
    console.error("❌ Register error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ========================== LOGIN ==========================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const results = await query("SELECT * FROM users WHERE email=?", [email]);
    if (!results.length) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ========================== FORGOT PASSWORD ==========================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const rows = await query("SELECT * FROM users WHERE email = ?", [email]);
    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

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
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ========================== VERIFY OTP ==========================
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const results = await query("SELECT * FROM users WHERE email=? AND otp=?", [
      email,
      otp,
    ]);
    if (!results.length) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const user = results[0];
    if (new Date() > new Date(user.otp_expiry)) {
      return res.status(400).json({ message: "OTP expired" });
    }

    res.json({ message: "OTP verified" });
  } catch (err) {
    console.error("❌ verifyOtp error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ========================== RESET PASSWORD ==========================
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await query(
      "UPDATE users SET password=?, otp=NULL, otp_expiry=NULL WHERE email=?",
      [hashedPassword, email]
    );

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("❌ resetPassword error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ========================== GET PROFILE ==========================
export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const results = await query(
      "SELECT id, username, email, created_at FROM users WHERE id=?",
      [userId]
    );
    if (!results.length) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(results[0]);
  } catch (err) {
    console.error("❌ getProfile error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
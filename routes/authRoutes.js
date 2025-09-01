import express from "express";
import { register, login, forgotPassword, verifyOtp, resetPassword, getProfile } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.get("/profile", verifyToken, getProfile);

router.post("/logout", verifyToken, (req, res) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    res.json({ message: "Logged out successfully" });
});

export default router;
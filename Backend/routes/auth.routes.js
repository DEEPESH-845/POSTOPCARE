const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");

// OTP Routes
router.post("/send-otp", AuthController.sendOTP);
router.post("/verify-otp", AuthController.verifyOTP);
router.post("/resend-otp", AuthController.resendOTP);

module.exports = router;

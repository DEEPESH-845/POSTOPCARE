const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const OTP = require("../models/otp.model");
const emailService = require("../services/email.service");

// Generate OTP
const generateOTP = () => {
	return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP
const sendOTP = async (req, res) => {
	try {
		const { email } = req.body;

		if (!email) {
			return res.status(400).json({
				success: false,
				message: "Email is required",
			});
		}

		// Generate 6-digit OTP
		const otpCode = generateOTP();
		const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

		// Save OTP to database
		await OTP.create({
			email,
			otp: otpCode,
			expiresAt,
			isUsed: false,
		});

		// Send email
		await emailService.sendOTPEmail(email, otpCode);

		res.status(200).json({
			success: true,
			message: "OTP sent successfully",
		});
	} catch (error) {
		console.error("Send OTP error:", error);
		res.status(500).json({
			success: false,
			message: "Failed to send OTP",
		});
	}
};

// Verify OTP
const verifyOTP = async (req, res) => {
	try {
		const { email, otp } = req.body;

		if (!email || !otp) {
			return res.status(400).json({
				success: false,
				message: "Email and OTP are required",
			});
		}

		// Find valid OTP
		const otpRecord = await OTP.findOne({
			email,
			otp,
			isUsed: false,
			expiresAt: { $gt: new Date() },
		});

		if (!otpRecord) {
			return res.status(400).json({
				success: false,
				message: "Invalid or expired OTP",
			});
		}

		// Mark OTP as used
		await OTP.updateOne({ _id: otpRecord._id }, { isUsed: true });

		res.status(200).json({
			success: true,
			message: "OTP verified successfully",
		});
	} catch (error) {
		console.error("Verify OTP error:", error);
		res.status(500).json({
			success: false,
			message: "Failed to verify OTP",
		});
	}
};

// Resend OTP
const resendOTP = async (req, res) => {
	try {
		const { email } = req.body;

		if (!email) {
			return res.status(400).json({
				success: false,
				message: "Email is required",
			});
		}

		// Invalidate previous OTPs
		await OTP.updateMany({ email, isUsed: false }, { isUsed: true });

		// Generate new OTP
		const otpCode = generateOTP();
		const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

		// Save new OTP
		await OTP.create({
			email,
			otp: otpCode,
			expiresAt,
			isUsed: false,
		});

		// Send email
		await emailService.sendOTPEmail(email, otpCode);

		res.status(200).json({
			success: true,
			message: "OTP resent successfully",
		});
	} catch (error) {
		console.error("Resend OTP error:", error);
		res.status(500).json({
			success: false,
			message: "Failed to resend OTP",
		});
	}
};

module.exports = {
	sendOTP,
	verifyOTP,
	resendOTP,
};

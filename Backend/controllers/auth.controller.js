const OTPModel = require("../models/otp.model");
const emailService = require("../services/email.service");

class AuthController {
	static async sendOTP(req, res) {
		try {
			const { email } = req.body;

			if (!email) {
				return res.status(400).json({
					success: false,
					message: "Email is required",
				});
			}

			// Validate email format
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) {
				return res.status(400).json({
					success: false,
					message: "Invalid email format",
				});
			}

			// Generate OTP
			const otpCode = OTPModel.generateOTP();
			const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES) || 5;
			const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

			// Save OTP to database
			await OTPModel.saveOTP(email, otpCode, expiresAt);

			// Send OTP via email
			const emailResult = await emailService.sendOTP(email, otpCode);

			if (!emailResult.success) {
				return res.status(500).json({
					success: false,
					message: "Failed to send OTP email",
				});
			}

			res.status(200).json({
				success: true,
				message: "OTP sent successfully",
				expiresIn: expiryMinutes * 60, // seconds
			});
		} catch (error) {
			console.error("Send OTP error:", error);
			res.status(500).json({
				success: false,
				message: "Internal server error",
			});
		}
	}

	static async verifyOTP(req, res) {
		try {
			const { email, otp } = req.body;

			if (!email || !otp) {
				return res.status(400).json({
					success: false,
					message: "Email and OTP are required",
				});
			}

			// Verify OTP
			const otpRecord = await OTPModel.verifyOTP(email, otp);

			if (!otpRecord) {
				return res.status(400).json({
					success: false,
					message: "Invalid or expired OTP",
				});
			}

			// Mark OTP as used
			await OTPModel.markOTPAsUsed(otpRecord.id);

			res.status(200).json({
				success: true,
				message: "OTP verified successfully",
				data: {
					email: email,
					verified: true,
				},
			});
		} catch (error) {
			console.error("Verify OTP error:", error);
			res.status(500).json({
				success: false,
				message: "Internal server error",
			});
		}
	}

	static async resendOTP(req, res) {
		// Reuse the sendOTP logic
		return AuthController.sendOTP(req, res);
	}
}

module.exports = AuthController;

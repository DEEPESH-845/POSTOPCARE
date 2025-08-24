const OTPModel = require("../models/otp.model");

async function initializeDatabase() {
	try {
		await OTPModel.createOTPTable();
		console.log("OTP table initialized successfully");
	} catch (error) {
		console.error("Database initialization error:", error);
	}
}

module.exports = { initializeDatabase };

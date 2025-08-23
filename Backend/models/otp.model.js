const db = require("../db/db");
const crypto = require("crypto");

class OTPModel {
	static async createOTPTable() {
		const query = `
            CREATE TABLE IF NOT EXISTS otps (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                otp_code VARCHAR(6) NOT NULL,
                expires_at DATETIME NOT NULL,
                is_used BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_email_otp (email, otp_code),
                INDEX idx_expires (expires_at)
            )
        `;
		return db.execute(query);
	}

	static async saveOTP(email, otpCode, expiresAt) {
		// Delete any existing unused OTPs for this email
		await this.deleteOTPsByEmail(email);

		const query = `
            INSERT INTO otps (email, otp_code, expires_at) 
            VALUES (?, ?, ?)
        `;
		return db.execute(query, [email, otpCode, expiresAt]);
	}

	static async verifyOTP(email, otpCode) {
		const query = `
            SELECT * FROM otps 
            WHERE email = ? AND otp_code = ? AND expires_at > NOW() AND is_used = FALSE
            ORDER BY created_at DESC 
            LIMIT 1
        `;
		const [rows] = await db.execute(query, [email, otpCode]);
		return rows[0] || null;
	}

	static async markOTPAsUsed(id) {
		const query = `UPDATE otps SET is_used = TRUE WHERE id = ?`;
		return db.execute(query, [id]);
	}

	static async deleteOTPsByEmail(email) {
		const query = `DELETE FROM otps WHERE email = ?`;
		return db.execute(query, [email]);
	}

	static async deleteExpiredOTPs() {
		const query = `DELETE FROM otps WHERE expires_at < NOW()`;
		return db.execute(query);
	}

	static generateOTP() {
		return crypto.randomInt(100000, 999999).toString();
	}
}

module.exports = OTPModel;

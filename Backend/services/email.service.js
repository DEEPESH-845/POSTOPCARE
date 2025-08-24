const nodemailer = require("nodemailer");

class EmailService {
	constructor() {
		this.transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: "ppoudel_be23@thapar.edu",
				pass: "uodt buei zzhe cvaq",
			},
		});
	}

	async sendOTP(email, otpCode) {
		const mailOptions = {
			from: "ppoudel_be23@thapar.edu",
			to: to,
			subject: "PostOpCare+ - Verification Code",
			html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0;">PostOpCare+</h1>
                    </div>
                    
                    <div style="padding: 30px; background-color: #f9f9f9;">
                        <h2 style="color: #333; margin-bottom: 20px;">Verification Code</h2>
                        
                        <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
                            Your verification code is:
                        </p>
                        
                        <div style="background: white; border: 2px solid #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
                            <span style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px;">
                                ${otpCode}
                            </span>
                        </div>
                        
                        <p style="color: #666; font-size: 14px; margin-top: 30px;">
                            This code will expire in ${
															process.env.OTP_EXPIRY_MINUTES || 5
														} minutes.
                        </p>
                        
                        <p style="color: #666; font-size: 14px;">
                            If you didn't request this code, please ignore this email.
                        </p>
                    </div>
                    
                    <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
                        © 2025 PostOpCare+. All rights reserved.
                    </div>
                </div>
            `,
		};

		try {
			const result = await this.transporter.sendMail(mailOptions);
			return { success: true, messageId: result.messageId };
		} catch (error) {
			console.error("Email sending failed:", error);
			return { success: false, error: error.message };
		}
	}
}

module.exports = new EmailService();

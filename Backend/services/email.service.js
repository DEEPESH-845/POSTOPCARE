const nodemailer = require("nodemailer");

// Create transporter
const createTransporter = () => {
	return nodemailer.createTransport({
		host: process.env.SMTP_HOST || "smtp.gmail.com",
		port: process.env.SMTP_PORT || 587,
		secure: false, // true for 465, false for other ports
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS,
		},
	});
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
	try {
		const transporter = createTransporter();

		const mailOptions = {
			from: `"PostOpCare+" <${process.env.SMTP_USER}>`,
			to: email,
			subject: "Your OTP for Account Verification",
			html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563eb;">PostOpCare+ Account Verification</h2>
                    <p>Hello,</p>
                    <p>Your OTP for account verification is:</p>
                    <div style="background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #2563eb; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
                    </div>
                    <p>This OTP will expire in 10 minutes.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                    <p>Best regards,<br>PostOpCare+ Team</p>
                </div>
            `,
		};

		const result = await transporter.sendMail(mailOptions);
		console.log("Email sent successfully:", result.messageId);
		return result;
	} catch (error) {
		console.error("Email sending failed:", error);
		throw error;
	}
};

module.exports = {
	sendOTPEmail,
};

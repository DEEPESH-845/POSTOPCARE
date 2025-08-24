import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LanguageToggle from "@/components/LanguageToggle";
import OTPInput from "@/components/OTPInput";
import { ArrowLeft, Clock, RefreshCw } from "lucide-react";
import { authApiService } from "@/services/authApi";

// Consolidated error interface
interface ApiErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

const VerifyOTP: React.FC = () => {
	const { t } = useLanguage();
	const { errors, isLoading, formData, setCurrentStep } = useAuth();
	const navigate = useNavigate();

	const [otp, setOtp] = useState("");
	const [timer, setTimer] = useState(49); // Start at 49s as shown in design
	const [canResend, setCanResend] = useState(false);
	const [localError, setLocalError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isResending, setIsResending] = useState(false);

	const isApiError = (error: unknown): error is ApiErrorResponse => {
		return typeof error === "object" && error !== null && "response" in error;
	};

	const sendOTP = useCallback(async () => {
		try {
			setLocalError(null);
			const result = await authApiService.sendOTP(formData.email);

			if (result.success) {
				console.log("OTP sent successfully");
			}
		} catch (error: unknown) {
			console.error("Send OTP error:", error);
			setLocalError(
				(isApiError(error) && error.response?.data?.message) ||
					"Failed to send OTP. Please try again."
			);
		}
	}, [formData.email]);

	useEffect(() => {
		if (formData.email) {
			sendOTP();
		} else {
			navigate("/signup");
		}
	}, [formData.email, navigate, sendOTP]);

	useEffect(() => {
		if (timer > 0) {
			const interval = setInterval(() => {
				setTimer((prev) => prev - 1);
			}, 1000);
			return () => clearInterval(interval);
		} else {
			setCanResend(true);
		}
	}, [timer]);

	const handleOTPComplete = async (otpValue: string) => {
		setOtp(otpValue);
		setIsSubmitting(true);
		setLocalError(null);

		try {
			const result = await authApiService.verifyOTP(formData.email, otpValue);

			if (result.success) {
				setCurrentStep(2);
				navigate("/select-plan");
			}
		} catch (error: unknown) {
			console.error("Verify OTP error:", error);
			setLocalError(
				(isApiError(error) && error.response?.data?.message) ||
					"Invalid OTP. Please try again."
			);
			setOtp("");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleResend = async () => {
		setIsResending(true);
		setTimer(49); // Reset to 49s
		setCanResend(false);
		setOtp("");
		setLocalError(null);

		try {
			const result = await authApiService.resendOTP(formData.email);

			if (result.success) {
				console.log("OTP resent successfully");
			}
		} catch (error: unknown) {
			console.error("Send OTP error:", error);
			setLocalError(
				(isApiError(error) && error.response?.data?.message) ||
					"Failed to send OTP. Please try again."
			);
		} finally {
			setIsResending(false);
		}
	};

	const formatTime = (seconds: number) => {
		return `${seconds}s`;
	};

	const maskEmail = (email: string) => {
		const [username, domain] = email.split("@");
		const maskedUsername = username.substring(0, 2) + "***";
		return `${maskedUsername}@${domain}`;
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
			<div className="w-full max-w-md mx-auto bg-white rounded-2xl p-8 shadow-lg">
				{/* Header with Back Button and Language Toggle */}
				<div className="flex items-center justify-between mb-8">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => navigate("/signup")}
						className="p-2 hover:bg-gray-100 rounded-full"
					>
						<ArrowLeft className="h-5 w-5" />
					</Button>

					<LanguageToggle />
				</div>

				{/* Progress Indicator */}
				<div className="mb-8">
					<div className="flex items-center justify-between text-sm text-gray-600 mb-2">
						<span>Step 2 of 4</span>
						<span>50%</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2">
						<div
							className="bg-blue-600 h-2 rounded-full transition-all duration-300"
							style={{ width: "50%" }}
						/>
					</div>
				</div>

				{/* Title */}
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-blue-800 mb-4">
						Verify Your Account
					</h1>
					<p className="text-gray-600 mb-4">
						Enter the 6-digit code sent to your mobile/email.
					</p>
					<p className="text-blue-800 font-medium">
						{maskEmail(formData.email)}
					</p>
				</div>

				{/* Error Alert */}
				{(errors.otp || localError) && (
					<Alert className="mb-6 border-red-200 bg-red-50">
						<AlertDescription className="text-red-600">
							{localError || t(errors.otp)}
						</AlertDescription>
					</Alert>
				)}

				{/* OTP Input */}
				<div className="mb-8 flex justify-center">
					<div className="otp-container">
						<OTPInput
							value={otp}
							length={6}
							onComplete={isSubmitting ? () => {} : handleOTPComplete}
						/>
						<style>{`
							.otp-container :global(input) {
								width: 48px !important;
								height: 48px !important;
								border: 2px solid #e5e7eb !important;
								border-radius: 12px !important;
								font-size: 18px !important;
								font-weight: 600 !important;
								text-align: center !important;
								background: white !important;
								color: #1f2937 !important;
								margin: 0 4px !important;
								transition: all 0.2s ease !important;
							}

							.otp-container :global(input:focus) {
								outline: none !important;
								border-color: #2563eb !important;
								box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1) !important;
							}

							.otp-container :global(input:hover) {
								border-color: #6b7280 !important;
							}

							.otp-container :global(input[value]:not([value=""])) {
								border-color: #2563eb !important;
								background: #eff6ff !important;
							}
						`}</style>
					</div>
				</div>

				{/* Timer and Resend */}
				<div className="text-center mb-8">
					{!canResend ? (
						<div className="flex items-center justify-center gap-2 text-gray-600">
							<Clock className="h-4 w-4" />
							<span className="text-sm">
								Resend code in {formatTime(timer)}
							</span>
						</div>
					) : (
						<Button
							variant="ghost"
							onClick={handleResend}
							disabled={isResending}
							className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
						>
							{isResending ? (
								<RefreshCw className="h-4 w-4 mr-2 animate-spin" />
							) : (
								<RefreshCw className="h-4 w-4 mr-2" />
							)}
							Resend code
						</Button>
					)}
				</div>

				{/* Verify Button */}
				<Button
					onClick={() => handleOTPComplete(otp)}
					disabled={otp.length !== 6 || isSubmitting}
					className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-xl mb-6"
				>
					{isSubmitting ? "Verifying..." : "Verify"}
				</Button>

				{/* Help Text */}
				<div className="text-center">
					<p className="text-sm text-gray-600">
						Didn't receive the code?{" "}
						<Button
							variant="link"
							className="text-blue-600 hover:text-blue-700 p-0 h-auto font-normal"
						>
							Check your spam folder or try a different method.
						</Button>
					</p>
				</div>
			</div>
		</div>
	);
};

export default VerifyOTP;

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

const VerifyOTP: React.FC = () => {
	const { t } = useLanguage();
	const { errors, isLoading, formData, setCurrentStep } = useAuth();
	const navigate = useNavigate();

	const [otp, setOtp] = useState("");
	const [timer, setTimer] = useState(60);
	const [canResend, setCanResend] = useState(false);
	const [localError, setLocalError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isResending, setIsResending] = useState(false);

	const isAxiosError = (
		error: unknown
	): error is { response?: { data?: { message?: string } } } => {
		return typeof error === "object" && error !== null && "response" in error;
	};

	// ✅ Move sendOTP function BEFORE useEffect
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
				(isAxiosError(error) && error.response?.data?.message) ||
					"Failed to send OTP. Please try again."
			);
		}
	}, [formData.email]); // Dependencies for useCallback

	// Send OTP when component mounts
	useEffect(() => {
		if (formData.email) {
			sendOTP();
		} else {
			navigate("/signup");
		}
	}, [formData.email, navigate, sendOTP]); // ✅ Now sendOTP is available

	// Timer logic
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

	// ...rest of your functions and JSX

	interface AxiosError {
		response?: {
			data?: {
				message?: string;
			};
		};
	}

	// Function to verify OTP using API service
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
			const axiosError = error as AxiosError;
			setLocalError(
				axiosError.response?.data?.message || "Invalid OTP. Please try again."
			);
			setOtp("");
		} finally {
			setIsSubmitting(false);
		}
	};

	interface ApiError {
		response?: {
			data?: {
				message?: string;
			};
		};
	}

	// Function to resend OTP using API service
	const handleResend = async () => {
		setIsResending(true);
		setTimer(60);
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
			const apiError = error as ApiError;
			setLocalError(
				apiError.response?.data?.message ||
					"Failed to send OTP. Please try again."
			);
		} finally {
			setIsResending(false);
		}
	};

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
	};

	return (
		<div className="auth-container">
			<div className="auth-card animate-scale-in">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
						{t("verify_email")}
					</h1>
					<p className="text-muted-foreground mt-2">
						{t("enter_otp_sent_to")} <strong>{formData.email}</strong>
					</p>
				</div>

				{/* Error Alert */}
				{(errors.otp || localError) && (
					<Alert className="mb-6 border-destructive/50 bg-destructive/5">
						<AlertDescription className="text-destructive">
							{localError || t(errors.otp)}
						</AlertDescription>
					</Alert>
				)}

				{/* OTP Input */}
				<div className="mb-6">
					<OTPInput
						value={otp}
						length={6} // Add this - typically 4 or 6 digits
						onComplete={isSubmitting ? () => {} : handleOTPComplete}
					/>
				</div>

				{/* Timer and Resend */}
				<div className="text-center mb-6">
					{!canResend ? (
						<div className="flex items-center justify-center gap-2 text-muted-foreground">
							<Clock className="h-4 w-4" />
							<span>
								{t("resend_in")} {formatTime(timer)}
							</span>
						</div>
					) : (
						<Button
							variant="ghost"
							onClick={handleResend}
							disabled={isResending}
							className="text-primary hover:text-primary/80"
						>
							{isResending ? (
								<RefreshCw className="h-4 w-4 mr-2 animate-spin" />
							) : (
								<RefreshCw className="h-4 w-4 mr-2" />
							)}
							{t("resend_otp")}
						</Button>
					)}
				</div>

				{/* Back Button */}
				<Button
					variant="outline"
					onClick={() => navigate("/signup")}
					className="w-full"
					disabled={isSubmitting}
				>
					<ArrowLeft className="h-4 w-4 mr-2" />
					{t("back_to_signup")}
				</Button>

				{/* Language Toggle */}
				<div className="mt-6 flex justify-center">
					<LanguageToggle />
				</div>
			</div>
		</div>
	);
};

export default VerifyOTP;

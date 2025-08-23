import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LanguageToggle from "@/components/LanguageToggle";
import OTPInput from "@/components/OTPInput";
import { ArrowLeft, Clock, RefreshCw } from "lucide-react";

const VerifyOTP: React.FC = () => {
	const { t } = useLanguage();
	const { verifyOTP, errors, isLoading, formData, setCurrentStep } = useAuth();
	const navigate = useNavigate();

	const [otp, setOtp] = useState("");
	const [timer, setTimer] = useState(60);
	const [canResend, setCanResend] = useState(false);

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
		const success = await verifyOTP(otpValue);
		if (success) {
			setCurrentStep(2);
			navigate("/select-plan");
		}
	};

	const handleResend = () => {
		setTimer(60);
		setCanResend(false);
		setOtp("");
		// In a real app, this would trigger the resend API call
	};

	return (
		<div className="auth-container">
			<div className="auth-card animate-scale-in">
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => navigate("/signup")}
						className="p-2"
					>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<LanguageToggle />
				</div>

				{/* Progress Indicator */}
				<div className="mb-6">
					<div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
						<span>Step 2 of 4</span>
						<span>50%</span>
					</div>
					<div className="w-full bg-muted rounded-full h-2">
						<div
							className="bg-primary h-2 rounded-full transition-all duration-500 animate-progress-fill"
							style={{ width: "50%" }}
						/>
					</div>
				</div>

				{/* Title */}
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gradient mb-2">
						{t("otp.title")}
					</h1>
					<p className="text-muted-foreground mb-4">{t("otp.subtitle")}</p>
					{formData.email && (
						<p className="text-sm text-primary font-medium">
							{formData.email.replace(/(.{2})(.*)(@.*)/, "$1***$3")}
						</p>
					)}
				</div>

				{/* Error Alert */}
				{errors.otp && (
					<Alert className="mb-6 border-destructive/50 bg-destructive/5">
						<AlertDescription className="text-destructive">
							{t(errors.otp)}
						</AlertDescription>
					</Alert>
				)}

				{/* OTP Input */}
				<div className="mb-8">
					<OTPInput length={6} onComplete={handleOTPComplete} value={otp} />
				</div>

				{/* Timer and Resend */}
				<div className="text-center mb-6">
					{!canResend ? (
						<div className="flex items-center justify-center text-muted-foreground">
							<Clock className="h-4 w-4 mr-2" />
							<span>Resend code in {timer}s</span>
						</div>
					) : (
						<Button
							variant="outline"
							onClick={handleResend}
							className="transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
						>
							<RefreshCw className="h-4 w-4 mr-2" />
							{t("otp.resend")}
						</Button>
					)}
				</div>

				{/* Verify Button */}
				<Button
					onClick={() => handleOTPComplete(otp)}
					disabled={otp.length !== 6 || isLoading}
					className="w-full bg-primary hover:bg-primary-hover transition-all duration-300 transform hover:-translate-y-0.5"
				>
					{isLoading ? "Verifying..." : t("otp.verify")}
				</Button>

				{/* Help Text */}
				<div className="mt-6 text-center">
					<p className="text-xs text-muted-foreground">
						Didn't receive the code? Check your spam folder or try a different
						method.
					</p>
				</div>
			</div>
		</div>
	);
};

export default VerifyOTP;

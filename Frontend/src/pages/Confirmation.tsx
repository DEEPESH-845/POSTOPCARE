import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import LanguageToggle from "@/components/LanguageToggle";
import { CheckCircle, ArrowRight, Star, Gift } from "lucide-react";

const Confirmation: React.FC = () => {
	const { t } = useLanguage();
	const { completeRegistration, formData } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		completeRegistration();
	}, [completeRegistration]);

	const handleGoToDashboard = () => {
		navigate("/dashboard");
	};

	return (
		<div className="auth-container">
			<div className="auth-card animate-scale-in">
				{/* Header */}
				<div className="flex justify-end mb-6">
					<LanguageToggle />
				</div>

				{/* Progress Indicator - Complete */}
				<div className="mb-6">
					<div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
						<span>Complete!</span>
						<span>100%</span>
					</div>
					<div className="w-full bg-muted rounded-full h-2">
						<div
							className="bg-success h-2 rounded-full transition-all duration-1000 animate-progress-fill"
							style={{ width: "100%" }}
						/>
					</div>
				</div>

				{/* Success Animation */}
				<div className="text-center mb-8">
					<div className="mb-6">
						<CheckCircle className="h-20 w-20 text-success mx-auto animate-success-checkmark" />
					</div>

					<h1 className="text-3xl font-bold text-gradient mb-2">
						{t("confirmation.title")}
					</h1>
					<p className="text-muted-foreground mb-4">
						{t("confirmation.subtitle")}
					</p>

					{formData.fullname && (
						<p className="text-lg font-medium text-primary">
							Welcome, {formData.fullname}! 🎉
						</p>
					)}
				</div>

				{/* Plan Summary */}
				{formData.plan && (
					<Card className="p-4 mb-6 bg-gradient-to-r from-primary/5 to-premium/5 border-primary/20">
						<div className="flex items-center justify-between">
							<div className="flex items-center">
								{formData.plan === "premium" ? (
									<Star className="h-5 w-5 text-premium mr-2" />
								) : (
									<Gift className="h-5 w-5 text-primary mr-2" />
								)}
								<div>
									<p className="font-semibold capitalize">
										{formData.plan} Plan
									</p>
									<p className="text-sm text-muted-foreground">
										{formData.plan === "premium"
											? "Premium features unlocked"
											: formData.plan === "standard"
											? "Standard features activated"
											: "Free tier access granted"}
									</p>
								</div>
							</div>
							<div className="text-right">
								<p className="font-bold">
									{formData.plan === "premium"
										? "₹599"
										: formData.plan === "standard"
										? "₹299"
										: "₹0"}
								</p>
								{formData.plan !== "free" && (
									<p className="text-xs text-muted-foreground">/month</p>
								)}
							</div>
						</div>
					</Card>
				)}

				{/* Next Steps */}
				<div className="space-y-4 mb-8">
					<div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
						<CheckCircle className="h-5 w-5 text-success mt-0.5" />
						<div>
							<p className="font-medium">Account Verified</p>
							<p className="text-sm text-muted-foreground">
								Your email and phone have been confirmed
							</p>
						</div>
					</div>

					<div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
						<CheckCircle className="h-5 w-5 text-success mt-0.5" />
						<div>
							<p className="font-medium">Plan Activated</p>
							<p className="text-sm text-muted-foreground">
								Your premium features are now available
							</p>
						</div>
					</div>

					<div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
						<CheckCircle className="h-5 w-5 text-success mt-0.5" />
						<div>
							<p className="font-medium">Security Enabled</p>
							<p className="text-sm text-muted-foreground">
								Bank-grade encryption protecting your data
							</p>
						</div>
					</div>
				</div>

				{/* Dashboard Button */}
				<Button
					onClick={handleGoToDashboard}
					size="lg"
					className="w-full bg-primary hover:bg-primary-hover transition-all duration-300 transform hover:-translate-y-0.5 mb-4"
				>
					{t("confirmation.dashboard")}
					<ArrowRight className="ml-2 h-5 w-5" />
				</Button>

				{/* Help Link */}
				<div className="text-center">
					<p className="text-xs text-muted-foreground">
						Need help getting started?
						<Button variant="link" className="text-xs p-0 ml-1 h-auto">
							Visit our help center
						</Button>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Confirmation;

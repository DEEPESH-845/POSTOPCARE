import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth, PlanType } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import LanguageToggle from "@/components/LanguageToggle";
import { ArrowLeft, Check, Star, Crown, Zap } from "lucide-react";

const SelectPlan: React.FC = () => {
	const { t } = useLanguage();
	const { selectPlan, setCurrentStep } = useAuth();
	const navigate = useNavigate();

	const [selectedPlan, setSelectedPlan] = useState<PlanType>("standard");

	const plans = [
		{
			id: "free" as PlanType,
			name: t("plans.free"),
			price: "₹0",
			icon: Zap,
			features: [
				"Basic features",
				"Email support",
				"1 GB storage",
				"Standard security",
			],
			recommended: false,
		},
		{
			id: "standard" as PlanType,
			name: t("plans.standard"),
			price: "₹299",
			icon: Star,
			features: [
				"All basic features",
				"Priority support",
				"10 GB storage",
				"Advanced security",
				"Analytics dashboard",
			],
			recommended: true,
		},
		{
			id: "premium" as PlanType,
			name: t("plans.premium"),
			price: "₹599",
			icon: Crown,
			features: [
				"All standard features",
				"24/7 phone support",
				"Unlimited storage",
				"Enterprise security",
				"Custom integrations",
				"White-label options",
			],
			recommended: false,
		},
	];

	const handleSelectPlan = (planId: PlanType) => {
		setSelectedPlan(planId);
		selectPlan(planId);
	};

	const handleContinue = () => {
		setCurrentStep(3);
		navigate("/confirmation");
	};

	return (
		<div className="auth-container">
			<div className="w-full max-w-4xl animate-scale-in">
				{/* Header */}
				<div className="flex items-center justify-between mb-6 px-6">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => navigate("/verify-otp")}
						className="p-2"
					>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<LanguageToggle />
				</div>

				{/* Progress Indicator */}
				<div className="mb-8 px-6">
					<div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
						<span>Step 3 of 4</span>
						<span>75%</span>
					</div>
					<div className="w-full bg-muted rounded-full h-2">
						<div
							className="bg-primary h-2 rounded-full transition-all duration-500 animate-progress-fill"
							style={{ width: "75%" }}
						/>
					</div>
				</div>

				{/* Title */}
				<div className="text-center mb-8 px-6">
					<h1 className="text-3xl font-bold text-gradient mb-2">
						{t("plans.title")}
					</h1>
					<p className="text-muted-foreground">{t("plans.subtitle")}</p>
				</div>

				{/* Plans Grid */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 px-6">
					{plans.map((plan, index) => (
						<Card
							key={plan.id}
							className={`plan-card ${
								selectedPlan === plan.id ? "plan-card-selected" : ""
							} ${plan.id === "premium" ? "plan-card-premium" : ""}`}
							onClick={() => handleSelectPlan(plan.id)}
							style={{ animationDelay: `${index * 0.1}s` }}
						>
							{plan.recommended && (
								<div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
									<div className="premium-badge text-xs px-3 py-1">
										Recommended
									</div>
								</div>
							)}

							<div className="text-center mb-4">
								<plan.icon
									className={`h-12 w-12 mx-auto mb-3 ${
										plan.id === "premium"
											? "text-premium"
											: plan.id === "standard"
											? "text-primary"
											: "text-muted-foreground"
									}`}
								/>
								<h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
								<div className="text-3xl font-bold">
									{plan.price}
									<span className="text-sm font-normal text-muted-foreground">
										{plan.price !== "₹0" && t("plans.monthly")}
									</span>
								</div>
							</div>

							<ul className="space-y-3 mb-6">
								{plan.features.map((feature, featureIndex) => (
									<li key={featureIndex} className="flex items-center text-sm">
										<Check className="h-4 w-4 text-success mr-3 flex-shrink-0" />
										{feature}
									</li>
								))}
							</ul>

							<Button
								variant={selectedPlan === plan.id ? "default" : "outline"}
								className="w-full transition-all duration-200"
							>
								{selectedPlan === plan.id
									? t("plans.selected")
									: t("plans.select")}
							</Button>
						</Card>
					))}
				</div>

				{/* Continue Button */}
				<div className="text-center px-6">
					<Button
						onClick={handleContinue}
						size="lg"
						className="bg-primary hover:bg-primary-hover transition-all duration-300 transform hover:-translate-y-0.5 px-8"
					>
						{t("auth.continue")}
					</Button>
				</div>

				{/* Trust Badge */}
				<div className="text-center mt-6 px-6">
					<p className="text-xs text-muted-foreground">
						🔒 Secure checkout • Cancel anytime • 30-day money-back guarantee
					</p>
				</div>
			</div>
		</div>
	);
};

export default SelectPlan;

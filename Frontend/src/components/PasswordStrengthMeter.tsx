import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PasswordStrengthMeterProps {
	password: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
	password,
}) => {
	const { t } = useLanguage();

	const getPasswordStrength = (password: string) => {
		let score = 0;
		const checks = {
			length: password.length >= 8,
			lowercase: /[a-z]/.test(password),
			uppercase: /[A-Z]/.test(password),
			number: /\d/.test(password),
			special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
		};

		score = Object.values(checks).filter(Boolean).length;

		if (score <= 2)
			return {
				strength: "weak",
				width: "33%",
				color: "bg-red-500",
			};
		if (score <= 4)
			return {
				strength: "medium",
				width: "66%",
				color: "bg-yellow-500",
			};
		return {
			strength: "strong",
			width: "100%",
			color: "bg-green-500",
		};
	};

	if (!password) return null;

	const { strength, width, color } = getPasswordStrength(password);

	return (
		<div className="mt-2 space-y-2">
			<div className="flex justify-between text-xs">
				<span className="text-muted-foreground">Password Strength</span>
				<span
					className={`capitalize ${
						strength === "weak"
							? "text-destructive"
							: strength === "medium"
							? "text-warning"
							: "text-success"
					}`}
				>
					{strength}
				</span>
			</div>
			<div className="h-1 bg-muted rounded-full overflow-hidden">
				<div
					className={`h-full ${color} transition-all duration-300 ease-out`}
					style={{ width }}
				/>
			</div>
			<p className="text-xs text-muted-foreground">
				{t("signup.passwordHint")}
			</p>
		</div>
	);
};

export default PasswordStrengthMeter;

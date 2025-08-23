import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LanguageToggle from "@/components/LanguageToggle";
import PasswordStrengthMeter from "@/components/PasswordStrengthMeter";
import { ArrowLeft, Eye, EyeOff, User, Mail, Phone, Lock } from "lucide-react";

const SignUp: React.FC = () => {
	const { t } = useLanguage();
	const { signUp, errors, isLoading, setCurrentStep } = useAuth();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const success = await signUp(formData);
		if (success) {
			setCurrentStep(1);
			navigate("/verify-otp");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-500 p-20">
			<div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 animate-scale-in">
				{/* Header */}
				<div className="flex items-center justify-between mb-5 ">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => navigate("/signin")}
						className="p-2"
					>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<LanguageToggle />
				</div>

				{/* Title */}
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gradient mb-2">
						{t("signup.title")}
					</h1>
					<p className="text-muted-foreground">{t("signup.subtitle")}</p>
				</div>

				{/* Error Alerts */}
				{Object.entries(errors).map(([field, message]) => (
					<Alert
						key={field}
						className="mb-4 border-destructive/50 bg-destructive/5"
					>
						<AlertDescription className="text-destructive">
							{t(message)}
						</AlertDescription>
					</Alert>
				))}

				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="name" className="flex items-center gap-2">
							<User className="h-4 w-4" />
							{t("signup.name")}
						</Label>
						<Input
							id="name"
							type="text"
							value={formData.name}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, name: e.target.value }))
							}
							placeholder="Riya Sharma"
							required
							className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="email" className="flex items-center gap-2">
							<Mail className="h-4 w-4" />
							{t("signup.email")}
						</Label>
						<Input
							id="email"
							type="email"
							value={formData.email}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, email: e.target.value }))
							}
							placeholder="riya@example.com"
							required
							className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="phone" className="flex items-center gap-2">
							<Phone className="h-4 w-4" />
							{t("signup.phone")}
						</Label>
						<Input
							id="phone"
							type="tel"
							value={formData.phone}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, phone: e.target.value }))
							}
							placeholder="+91 98765 43210"
							className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="password" className="flex items-center gap-2">
							<Lock className="h-4 w-4" />
							{t("signup.password")}
						</Label>
						<div className="relative">
							<Input
								id="password"
								type={showPassword ? "text" : "password"}
								value={formData.password}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, password: e.target.value }))
								}
								placeholder="••••••••"
								required
								className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
							/>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
							>
								{showPassword ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
							</Button>
						</div>
						<PasswordStrengthMeter password={formData.password} />
					</div>

					<Button
						type="submit"
						className="w-full bg-indigo-500 hover:bg-indigo-600 transition-all duration-300 transform hover:-translate-y-0.5"
						disabled={isLoading}
					>
						{isLoading ? "Creating Account..." : t("auth.continue")}
					</Button>
				</form>

				{/* Divider */}
				<div className="flex items-center my-6">
					<div className="flex-1 border-t border-border" />
					<span className="px-3 text-sm text-muted-foreground">
						{t("auth.or")}
					</span>
					<div className="flex-1 border-t border-border" />
				</div>

				{/* Sign In Link */}
				<div className="text-center">
					<p className="text-sm text-muted-foreground mb-2">
						{t("signup.hasAccount")}
					</p>
					<Button
						variant="outline"
						onClick={() => navigate("/signin")}
						className="transition-all duration-200 hover:bg-indigo-500 hover:text-primary-foreground"
					>
						{t("auth.signin")}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default SignUp;

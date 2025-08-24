import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LanguageToggle from "@/components/LanguageToggle";
import { ArrowLeft, Eye, EyeOff, Mail, Lock } from "lucide-react";

const SignIn: React.FC = () => {
	const { t } = useLanguage();
	const { signIn, errors, isLoading } = useAuth();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const success = await signIn(formData.email, formData.password);
		if (success) {
			navigate("/dashboard");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
			<div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 animate-scale-in">
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => navigate("/")}
						className="p-2"
					>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<LanguageToggle />
				</div>

				{/* Title */}
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gradient mb-2">
						{t("signin.title")}
					</h1>
					<p className="text-muted-foreground">{t("signin.subtitle")}</p>
				</div>

				{/* Error Alert */}
				{errors.general && (
					<Alert className="mb-6 border-destructive/50 bg-destructive/5">
						<AlertDescription className="text-destructive">
							{t(errors.general)}
						</AlertDescription>
					</Alert>
				)}

				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-6 ">
					<div className="space-y-2">
						<Label htmlFor="email" className="flex items-center gap-2">
							<Mail className="h-4 w-4" />
							{t("signin.email")}
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
						<Label htmlFor="password" className="flex items-center gap-2">
							<Lock className="h-4 w-4" />
							{t("signin.password")}
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
					</div>

					<div className="flex justify-end">
						<Link
							to="/forgot-password"
							className="text-sm text-primary hover:text-primary-hover transition-colors"
						>
							{t("signin.forgot")}
						</Link>
					</div>

					<Button
						type="submit"
						className="w-full bg-indigo-500 hover:bg-indigo-600 transition-all duration-300 transform hover:-translate-y-0.5"
						disabled={isLoading}
					>
						{isLoading ? "Signing In..." : t("auth.signin")}
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

				{/* Sign Up Link */}
				<div className="text-center p-4 bg-muted/30 rounded-lg">
					<p className="text-sm text-muted-foreground mb-2">
						{t("signin.noAccount")}
					</p>
					<Button
						variant="outline"
						onClick={() => navigate("/signup")}
						className="transition-all duration-200 hover:bg-indigo-600 hover:text-primary-foreground"
					>
						{t("auth.signup")}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default SignIn;

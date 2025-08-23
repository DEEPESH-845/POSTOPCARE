import React, { createContext, useContext, useState, ReactNode } from "react";

export type PlanType = "free" | "standard" | "premium";

interface User {
	name: string;
	email: string;
	phone?: string;
	plan: PlanType;
}

interface AuthContextType {
	user: User | null;
	currentStep: number;
	setCurrentStep: (step: number) => void;
	formData: Partial<User & { password: string; otp: string }>;
	setFormData: (
		data: Partial<User & { password: string; otp: string }>
	) => void;
	errors: Record<string, string>;
	setErrors: (errors: Record<string, string>) => void;
	isLoading: boolean;
	setIsLoading: (loading: boolean) => void;
	signIn: (email: string, password: string) => Promise<boolean>;
	signUp: (userData: Partial<User & { password: string }>) => Promise<boolean>;
	verifyOTP: (otp: string) => Promise<boolean>;
	selectPlan: (plan: PlanType) => void;
	completeRegistration: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);
	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] = useState<
		Partial<User & { password: string; otp: string }>
	>({});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isLoading, setIsLoading] = useState(false);

	// Test users from requirements
	const testUsers = [
		{
			name: "Riya Sharma",
			email: "riya@example.com",
			password: "Riya@1234",
			plan: "premium" as PlanType,
		},
		{
			name: "Arjun Mehta",
			email: "arjun@example.com",
			password: "Arjun@5678",
			plan: "standard" as PlanType,
		},
	];

	const signIn = async (email: string, password: string): Promise<boolean> => {
		setIsLoading(true);
		setErrors({});

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		const testUser = testUsers.find(
			(u) => u.email === email && u.password === password
		);

		if (testUser) {
			setUser({
				name: testUser.name,
				email: testUser.email,
				plan: testUser.plan,
			});
			setIsLoading(false);
			return true;
		} else {
			setErrors({ general: "error.invalid" });
			setIsLoading(false);
			return false;
		}
	};

	const signUp = async (
		userData: Partial<User & { password: string }>
	): Promise<boolean> => {
		setIsLoading(true);
		setErrors({});

		// Validate password strength
		if (userData.password && !isPasswordStrong(userData.password)) {
			setErrors({ password: "error.weak" });
			setIsLoading(false);
			return false;
		}

		// Check for duplicate email
		if (testUsers.some((u) => u.email === userData.email)) {
			setErrors({ email: "error.duplicate" });
			setIsLoading(false);
			return false;
		}

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		setFormData((prev) => ({ ...prev, ...userData }));
		setIsLoading(false);
		return true;
	};

	const verifyOTP = async (otp: string): Promise<boolean> => {
		setIsLoading(true);
		setErrors({});

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// For demo, accept any 6-digit code
		if (otp.length === 6 && /^\d+$/.test(otp)) {
			setFormData((prev) => ({ ...prev, otp }));
			setIsLoading(false);
			return true;
		} else {
			setErrors({ otp: "error.expired" });
			setIsLoading(false);
			return false;
		}
	};

	const selectPlan = (plan: PlanType) => {
		setFormData((prev) => ({ ...prev, plan }));
	};

	const completeRegistration = () => {
		const newUser: User = {
			name: formData.name || "",
			email: formData.email || "",
			phone: formData.phone,
			plan: formData.plan || "free",
		};
		setUser(newUser);
	};

	const isPasswordStrong = (password: string): boolean => {
		const hasMinLength = password.length >= 8;
		const hasNumber = /\d/.test(password);
		const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
		return hasMinLength && hasNumber && hasSpecialChar;
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				currentStep,
				setCurrentStep,
				formData,
				setFormData,
				errors,
				setErrors,
				isLoading,
				setIsLoading,
				signIn,
				signUp,
				verifyOTP,
				selectPlan,
				completeRegistration,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

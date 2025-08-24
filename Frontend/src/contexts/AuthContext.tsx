import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import api from "@/lib/api";

export type PlanType = "free" | "standard" | "premium";

interface User {
	id: string;
	fullname: string;
	email: string;
	language: string;
	plan?: PlanType;
}
interface AuthContextType {
	user: User | null;
	token: string | null;
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
	// signIn: (email: string, password: string) => Promise<boolean>;
	signUp: (userData: Partial<User & { password: string }>) => Promise<boolean>;
	verifyOTP: (otp: string) => Promise<boolean>;
	selectPlan: (plan: PlanType) => void;
	completeRegistration: () => void;
	login: (email: string, password: string) => Promise<void>;
	register: (
		fullname: string,
		email: string,
		password: string,
		language: string
	) => Promise<void>;
	logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
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

	useEffect(() => {
		// Check if user is logged in on app start
		const storedToken = localStorage.getItem("authToken");
		const storedUser = localStorage.getItem("user");

		if (storedToken && storedUser) {
			setToken(storedToken);
			setUser(JSON.parse(storedUser));
		}
		setIsLoading(false);
	}, []);

	const login = async (email: string, password: string) => {
		try {
			const response = await api.post("/user/login", { email, password });
			const { token: authToken, message } = response.data;

			// Store token
			localStorage.setItem("authToken", authToken);
			setToken(authToken);

			// For now, we'll create a user object from the email
			// In a real app, you'd want the backend to return user info
			const userData: User = {
				id: crypto.randomUUID(), // ✅ Add unique ID
				fullname: "John Doe",
				email: "john@example.com",
				language: "en", // ✅ Add language (default or from user preference)
				plan: "free", // PlanType
			};
			localStorage.setItem("user", JSON.stringify(userData));
			setUser(userData);
		} catch (error) {
			const message = error.response?.data?.message || "Login failed";
			throw new Error(message);
		}
	};

	const register = async (
		fullname: string,
		email: string,
		password: string,
		language: string
	) => {
		try {
			const response = await api.post("/user/register", {
				fullname,
				email,
				password,
				language,
			});

			const { token: authToken, message } = response.data;

			// Store token
			localStorage.setItem("authToken", authToken);
			setToken(authToken);

			// Create user object
			const userData = { id: "1", fullname, email, language };
			localStorage.setItem("user", JSON.stringify(userData));
			setUser(userData);
		} catch (error) {
			const message = error.response?.data?.message || "Registration failed";
			throw new Error(message);
		}
	};

	const logout = () => {
		localStorage.removeItem("authToken");
		localStorage.removeItem("user");
		setToken(null);
		setUser(null);
	};

	// const signIn = async (email: string, password: string): Promise<boolean> => {
	// 	setIsLoading(true);
	// 	setErrors({});

	// 	// Simulate API call
	// 	await new Promise((resolve) => setTimeout(resolve, 1000));

	// 	const testUser = testUsers.find(
	// 		(u) => u.email === email && u.password === password
	// 	);

	// 	if (testUser) {
	// 		setUser((prevUser) => ({
	// 			...prevUser, // ✅ Keeps existing id, language, etc.
	// 			plan: testUser.plan, // Updates only the plan
	// 		}));
	// 		setIsLoading(false);
	// 		return true;
	// 	} else {
	// 		setErrors({ general: "error.invalid" });
	// 		setIsLoading(false);
	// 		return false;
	// 	}
	// };

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
			fullname: formData.fullname || "",
			email: formData.email || "",
			plan: formData.plan || "free",
			id: "",
			language: "",
		};
		setUser(newUser);
	};

	const isPasswordStrong = (password: string): boolean => {
		const hasMinLength = password.length >= 8;
		const hasNumber = /\d/.test(password);
		const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
		return hasMinLength && hasNumber && hasSpecialChar;
	};

	const value = {
		user,
		token,
		login,
		register,
		logout,
		currentStep,
		setCurrentStep,
		formData,
		setFormData,
		errors,
		setErrors,
		isLoading,
		setIsLoading,
		signUp,
		verifyOTP,
		selectPlan,
		completeRegistration,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

import React, { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "hi" | "ta";

interface LanguageContextType {
	language: Language;
	setLanguage: (lang: Language) => void;
	t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
	undefined
);

const translations = {
	en: {
		// Landing Page
		"landing.title": "Secure Premium Access",
		"landing.subtitle":
			"Join thousands of professionals who trust our premium platform",
		"landing.cta": "Get Started",
		"landing.benefit1": "Bank-grade security",
		"landing.benefit2": "Premium features",
		"landing.benefit3": "24/7 support",

		// Auth Common
		"auth.signin": "Sign In",
		"auth.signup": "Sign Up",
		"auth.continue": "Continue",
		"auth.back": "Back",
		"auth.or": "Or",

		// Sign In
		"signin.title": "Welcome back",
		"signin.subtitle": "Enter your credentials to access your account",
		"signin.email": "Email or Phone",
		"signin.password": "Password",
		"signin.forgot": "Forgot password?",
		"signin.noAccount":
			"No account yet? Create one to unlock premium features.",

		// Sign Up
		"signup.title": "Create Account",
		"signup.subtitle": "Join our premium platform today",
		"signup.name": "Full Name",
		"signup.email": "Email",
		"signup.phone": "Phone Number",
		"signup.password": "Password",
		"signup.passwordHint":
			"Use 8+ characters, at least 1 number & special character.",
		"signup.hasAccount": "Already have an account?",

		// OTP
		"otp.title": "Verify Your Account",
		"otp.subtitle": "Enter the 6-digit code sent to your mobile/email.",
		"otp.resend": "Resend Code",
		"otp.verify": "Verify",

		// Plans
		"plans.title": "Choose Your Plan",
		"plans.subtitle": "Select the perfect plan for your needs",
		"plans.free": "Free",
		"plans.standard": "Standard",
		"plans.premium": "Premium",
		"plans.monthly": "/month",
		"plans.select": "Select Plan",
		"plans.selected": "Selected",

		// Confirmation
		"confirmation.title": "Welcome to Premium!",
		"confirmation.subtitle": "Your account has been successfully created",
		"confirmation.dashboard": "Go to Dashboard",

		// Errors
		"error.title": "⚠ Please check your details and try again.",
		"error.invalid": "Invalid credentials",
		"error.weak": "Password too weak",
		"error.expired": "Code expired",
		"error.duplicate": "Email already exists",
	},
	hi: {
		// Landing Page
		"landing.title": "सुरक्षित प्रीमियम एक्सेस",
		"landing.subtitle":
			"हजारों पेशेवरों में शामिल हों जो हमारे प्रीमियम प्लेटफॉर्म पर भरोसा करते हैं",
		"landing.cta": "शुरू करें",
		"landing.benefit1": "बैंक-ग्रेड सुरक्षा",
		"landing.benefit2": "प्रीमियम फीचर्स",
		"landing.benefit3": "24/7 सहायता",

		// Auth Common
		"auth.signin": "साइन इन",
		"auth.signup": "साइन अप",
		"auth.continue": "जारी रखें",
		"auth.back": "वापस",
		"auth.or": "या",

		// Sign In
		"signin.title": "वापस स्वागत है",
		"signin.subtitle": "अपने खाते तक पहुंचने के लिए अपनी जानकारी दर्ज करें",
		"signin.email": "ईमेल या फोन",
		"signin.password": "पासवर्ड",
		"signin.forgot": "पासवर्ड भूल गए?",
		"signin.noAccount":
			"अभी तक कोई खाता नहीं है? प्रीमियम फीचर्स अनलॉक करने के लिए एक बनाएं।",

		// Sign Up
		"signup.title": "खाता बनाएं",
		"signup.subtitle": "आज ही हमारे प्रीमियम प्लेटफॉर्म से जुड़ें",
		"signup.name": "पूरा नाम",
		"signup.email": "ईमेल",
		"signup.phone": "फोन नंबर",
		"signup.password": "पासवर्ड",
		"signup.passwordHint":
			"8+ अक्षर, कम से कम 1 संख्या और विशेष अक्षर का उपयोग करें।",
		"signup.hasAccount": "पहले से खाता है?",

		// OTP
		"otp.title": "अपना खाता सत्यापित करें",
		"otp.subtitle": "आपके मोबाइल/ईमेल पर भेजा गया 6-अंकीय कोड दर्ज करें।",
		"otp.resend": "कोड फिर से भेजें",
		"otp.verify": "सत्यापित करें",

		// Plans
		"plans.title": "अपना प्लान चुनें",
		"plans.subtitle": "अपनी आवश्यकताओं के लिए सही प्लान चुनें",
		"plans.free": "मुफ्त",
		"plans.standard": "स्टैंडर्ड",
		"plans.premium": "प्रीमियम",
		"plans.monthly": "/महीना",
		"plans.select": "प्लान चुनें",
		"plans.selected": "चुना गया",

		// Confirmation
		"confirmation.title": "प्रीमियम में आपका स्वागत है!",
		"confirmation.subtitle": "आपका खाता सफलतापूर्वक बनाया गया है",
		"confirmation.dashboard": "डैशबोर्ड पर जाएं",

		// Errors
		"error.title": "⚠ कृपया अपनी जानकारी जांचें और फिर कोशिश करें।",
		"error.invalid": "अमान्य क्रेडेंशियल",
		"error.weak": "पासवर्ड बहुत कमजोर",
		"error.expired": "कोड समाप्त",
		"error.duplicate": "ईमेल पहले से मौजूद है",
	},
	ta: {
		// Landing Page
		"landing.title": "பாதுகாப்பான பிரீமியம் அணுகல்",
		"landing.subtitle":
			"எங்கள் பிரீமியம் தளத்தை நம்பும் ஆயிரக்கணக்கான தொழில் வல்லுநர்களில் சேருங்கள்",
		"landing.cta": "தொடங்குங்கள்",
		"landing.benefit1": "வங்கி-தர பாதுகாப்பு",
		"landing.benefit2": "பிரீமியம் அம்சங்கள்",
		"landing.benefit3": "24/7 ஆதரவு",

		// Auth Common
		"auth.signin": "உள்நுழைவு",
		"auth.signup": "பதிவு",
		"auth.continue": "தொடரவும்",
		"auth.back": "பின்செல்",
		"auth.or": "அல்லது",

		// Sign In
		"signin.title": "மீண்டும் வரவேற்கிறோம்",
		"signin.subtitle": "உங்கள் கணக்கை அணுக உங்கள் விவரங்களை உள்ளிடவும்",
		"signin.email": "மின்னஞ்சல் அல்லது தொலைபேசி",
		"signin.password": "கடவுச்சொல்",
		"signin.forgot": "கடவுச்சொல் மறந்துவிட்டதா?",
		"signin.noAccount":
			"இன்னும் கணக்கு இல்லையா? பிரீமியம் அம்சங்களை திறக்க ஒன்றை உருவாக்கவும்.",

		// Sign Up
		"signup.title": "கணக்கு உருவாக்கவும்",
		"signup.subtitle": "இன்றே எங்கள் பிரீமியம் தளத்தில் சேருங்கள்",
		"signup.name": "முழு பெயர்",
		"signup.email": "மின்னஞ்சல்",
		"signup.phone": "தொலைபேசி எண்",
		"signup.password": "கடவுச்சொல்",
		"signup.passwordHint":
			"8+ எழுத்துகள், குறைந்தது 1 எண் மற்றும் சிறப்பு எழுத்தைப் பயன்படுத்தவும்.",
		"signup.hasAccount": "ஏற்கனவே கணக்கு உள்ளதா?",

		// OTP
		"otp.title": "உங்கள் கணக்கை சரிபார்க்கவும்",
		"otp.subtitle":
			"உங்கள் மொபைல்/மின்னஞ்சலுக்கு அனுப்பப்பட்ட 6-இலக்க குறியீட்டை உள்ளிடவும்.",
		"otp.resend": "குறியீட்டை மீண்டும் அனுப்பவும்",
		"otp.verify": "சரிபார்",

		// Plans
		"plans.title": "உங்கள் திட்டத்தைத் தேர்ந்தெடுக்கவும்",
		"plans.subtitle": "உங்கள் தேவைகளுக்கு ஏற்ற திட்டத்தைத் தேர்ந்தெடுக்கவும்",
		"plans.free": "இலவசம்",
		"plans.standard": "நிலையான",
		"plans.premium": "பிரீமியம்",
		"plans.monthly": "/மாதம்",
		"plans.select": "திட்டத்தைத் தேர்ந்தெடுக்கவும்",
		"plans.selected": "தேர்ந்தெடுக்கப்பட்டது",

		// Confirmation
		"confirmation.title": "பிரீமியத்தில் வரவேற்கிறோம்!",
		"confirmation.subtitle": "உங்கள் கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது",
		"confirmation.dashboard": "டாஷ்போர்டுக்குச் செல்லவும்",

		// Errors
		"error.title":
			"⚠ தயவுசெய்து உங்கள் விவரங்களைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.",
		"error.invalid": "தவறான நற்சான்றிதழ்கள்",
		"error.weak": "கடவுச்சொல் மிகவும் பலவீனமானது",
		"error.expired": "குறியீடு காலாவதியானது",
		"error.duplicate": "மின்னஞ்சல் ஏற்கனவே உள்ளது",
	},
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [language, setLanguage] = useState<Language>("en");

	const t = (key: string): string => {
		return (
			translations[language][
				key as keyof (typeof translations)[typeof language]
			] || key
		);
	};

	return (
		<LanguageContext.Provider value={{ language, setLanguage, t }}>
			{children}
		</LanguageContext.Provider>
	);
};

export const useLanguage = () => {
	const context = useContext(LanguageContext);
	if (!context) {
		throw new Error("useLanguage must be used within a LanguageProvider");
	}
	return context;
};

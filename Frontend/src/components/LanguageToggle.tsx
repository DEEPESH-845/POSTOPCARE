import React from "react";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const LanguageToggle: React.FC = () => {
	const { language, setLanguage } = useLanguage();

	const languages: { code: Language; name: string }[] = [
		{ code: "en", name: "English" },
		{ code: "hi", name: "हिंदी" },
		{ code: "ta", name: "தமிழ்" },
	];

	return (
		<div className="flex items-center gap-2 p-1 bg-secondary rounded-lg">
			<Globe className="h-4 w-4 text-muted-foreground" />
			{languages.map((lang) => (
				<Button
					key={lang.code}
					variant={language === lang.code ? "default" : "ghost"}
					size="sm"
					onClick={() => setLanguage(lang.code)}
					className={`text-xs transition-all duration-200 ${
						language === lang.code
							? "bg-indigo-500 hover:bg-indigo-600 text-primary-foreground shadow-sm"
							: "hover:bg-background"
					}`}
				>
					{lang.name}
				</Button>
			))}
		</div>
	);
};

export default LanguageToggle;

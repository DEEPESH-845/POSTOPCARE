import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Globe, ArrowRight, Shield, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' }
];

const translations = {
  en: {
    title: "Welcome to PostOpCare+",
    subtitle: "Let's set up your personalized recovery plan",
    languageLabel: "Choose your preferred language",
    consentTitle: "Privacy & Consent",
    consentText: "I understand that PostOpCare+ will collect and process my health data to provide personalized recovery support. I consent to:",
    consentItems: [
      "Daily check-in data collection and analysis",
      "Photo upload for wound monitoring",
      "Secure communication with my care team",
      "Anonymous data use for improving recovery outcomes"
    ],
    consentCheckbox: "I agree to the privacy policy and terms of service",
    continueButton: "Continue to surgery selection",
    trustBadge: "HIPAA Compliant & Secure"
  },
  hi: {
    title: "PostOpCare+ में आपका स्वागत है",
    subtitle: "आइए आपकी व्यक्तिगत रिकवरी योजना तैयार करें",
    languageLabel: "अपनी पसंदीदा भाषा चुनें",
    consentTitle: "गोपनीयता और सहमति",
    consentText: "मैं समझता हूं कि PostOpCare+ व्यक्तिगत रिकवरी सहायता प्रदान करने के लिए मेरे स्वास्थ्य डेटा को एकत्रित और संसाधित करेगा। मैं इसकी सहमति देता हूं:",
    consentItems: [
      "दैनिक चेक-इन डेटा संग्रह और विश्लेषण",
      "घाव की निगरानी के लिए फोटो अपलोड",
      "मेरी देखभाल टीम के साथ सुरक्षित संचार",
      "रिकवरी परिणामों में सुधार के लिए गुमनाम डेटा का उपयोग"
    ],
    consentCheckbox: "मैं गोपनीयता नीति और सेवा की शर्तों से सहमत हूं",
    continueButton: "सर्जरी चयन जारी रखें",
    trustBadge: "HIPAA अनुपालित और सुरक्षित"
  },
  ta: {
    title: "PostOpCare+ இல் உங்களை வரவேற்கிறோம்",
    subtitle: "உங்கள் தனிப்பயன் மீட்புத் திட்டத்தை அமைப்போம்",
    languageLabel: "உங்கள் விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்",
    consentTitle: "தனியுரிமை மற்றும் ஒப்புதல்",
    consentText: "தனிப்பயன் மீட்பு ஆதரவை வழங்க PostOpCare+ எனது சுகாதார தரவை சேகரித்து செயலாக்கும் என்பதை நான் புரிந்துகொள்கிறேன். நான் ஒப்புக்கொள்கிறேன்:",
    consentItems: [
      "தினசரி சோதனை தரவு சேகரிப்பு மற்றும் பகுப்பாய்வு",
      "காயம் கண்காணிப்புக்கான புகைப்பட பதிவேற்றம்",
      "எனது கவனிப்பு குழுவுடன் பாதுகாப்பான தொடர்பு",
      "மீட்பு முடிவுகளை மேம்படுத்த அநாமதேய தரவு பயன்பாடு"
    ],
    consentCheckbox: "நான் தனியுரிமைக் கொள்கை மற்றும் சேவை விதிமுறைகளுக்கு ஒப்புக்கொள்கிறேன்",
    continueButton: "அறுவை சிகிச்சை தேர்வுக்கு தொடரவும்",
    trustBadge: "HIPAA இணக்கம் மற்றும் பாதுகாப்பு"
  }
};

const Onboarding = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [consentGiven, setConsentGiven] = useState(false);
  
  const t = translations[selectedLanguage as keyof typeof translations];

  return (
    <div className="min-h-screen bg-gradient-subtle px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>

        {/* Language Selection */}
        <Card className="mb-6 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Globe className="w-5 h-5 mr-2 text-primary" />
              {t.languageLabel}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedLanguage === lang.code
                      ? 'border-primary bg-primary-soft'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">{lang.native}</div>
                      <div className="text-sm text-muted-foreground">{lang.name}</div>
                    </div>
                    {selectedLanguage === lang.code && (
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Consent */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Shield className="w-5 h-5 mr-2 text-success" />
              {t.consentTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{t.consentText}</p>
            
            <ul className="space-y-2">
              {t.consentItems.map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-sm text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
            
            <div className="flex items-center space-x-2 pt-4">
              <Checkbox 
                id="consent" 
                checked={consentGiven}
                onCheckedChange={(checked) => setConsentGiven(checked === true)}
              />
              <label 
                htmlFor="consent" 
                className="text-sm text-foreground cursor-pointer"
              >
                {t.consentCheckbox}
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Trust Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center bg-success-soft text-success px-4 py-2 rounded-full text-sm font-medium">
            <Shield className="w-4 h-4 mr-2" />
            {t.trustBadge}
          </div>
        </div>

        {/* Continue Button */}
        <Link to="/surgery-selection">
          <Button 
            variant="primary" 
            size="lg" 
            className="w-full"
            disabled={!consentGiven}
          >
            {t.continueButton}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Onboarding;
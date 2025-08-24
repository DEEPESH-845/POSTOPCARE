import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Onboarding from "./pages/Onboarding";
import SurgerySelection from "./pages/SurgerySelection";
import RecoveryPlan from "./pages/RecoveryPlan";
import DailyCheckin from "./pages/DailyCheckin";
import PhotoCapture from "./pages/PhotoCapture";
import AlertModal from "./pages/AlertModal";
import ClinicianDashboard from "./pages/ClinicianDashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { LanguageProvider } from "./contexts/LanguageContext";
import VerifyOTP from "./pages/VerifyOTP";
import SelectPlan from "./pages/SelectPlan";
import Confirmation from "./pages/Confirmation";
import Transcript from "./pages/Transcript";

const queryClient = new QueryClient();

const App = () => (
	<QueryClientProvider client={queryClient}>
		<TooltipProvider>
			<LanguageProvider>
				<AuthProvider>
					<Toaster />
					<Sonner />
					<BrowserRouter>
						<Routes>
							<Route path="/" element={<Landing />} />
							<Route path="/onboarding" element={<Onboarding />} />
							<Route path="/signin" element={<SignIn />} />
							<Route path="/signup" element={<SignUp />} />
							<Route path="/verify-otp" element={<VerifyOTP />} />
							<Route path="/select-plan" element={<SelectPlan />} />
							<Route path="/confirmation" element={<Confirmation />} />
							<Route path="/transcript" element={<Transcript />} />
							<Route path="/surgery-selection" element={<SurgerySelection />} />
							<Route path="/recovery-plan" element={<RecoveryPlan />} />
							<Route path="/daily-checkin" element={<DailyCheckin />} />
							<Route path="/photo-capture" element={<PhotoCapture />} />
							<Route path="/alert-modal" element={<AlertModal />} />
							<Route
								path="/clinician-dashboard"
								element={<ClinicianDashboard />}
							/>
							<Route path="/profile" element={<Profile />} />
							{/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
							<Route path="*" element={<NotFound />} />
						</Routes>
					</BrowserRouter>
				</AuthProvider>
			</LanguageProvider>
		</TooltipProvider>
	</QueryClientProvider>
);

export default App;

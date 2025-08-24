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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            
            {/* Protected routes */}
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            } />
            <Route path="/surgery-selection" element={
              <ProtectedRoute>
                <SurgerySelection />
              </ProtectedRoute>
            } />
            <Route path="/recovery-plan" element={
              <ProtectedRoute>
                <RecoveryPlan />
              </ProtectedRoute>
            } />
            <Route path="/recovery-plan/:recoveryId" element={
              <ProtectedRoute>
                <RecoveryPlan />
              </ProtectedRoute>
            } />
            <Route path="/daily-checkin" element={
              <ProtectedRoute>
                <DailyCheckin />
              </ProtectedRoute>
            } />
            <Route path="/photo-capture" element={
              <ProtectedRoute>
                <PhotoCapture />
              </ProtectedRoute>
            } />
            <Route path="/alert-modal" element={
              <ProtectedRoute>
                <AlertModal />
              </ProtectedRoute>
            } />
            <Route path="/clinician-dashboard" element={
              <ProtectedRoute>
                <ClinicianDashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

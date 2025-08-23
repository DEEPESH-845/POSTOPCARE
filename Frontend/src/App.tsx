import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Onboarding from "./pages/Onboarding";
import SurgerySelection from "./pages/SurgerySelection";
import RecoveryPlan from "./pages/RecoveryPlan";
import DailyCheckin from "./pages/DailyCheckin";
import PhotoCapture from "./pages/PhotoCapture";
import AlertModal from "./pages/AlertModal";
import ClinicianDashboard from "./pages/ClinicianDashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/surgery-selection" element={<SurgerySelection />} />
          <Route path="/recovery-plan" element={<RecoveryPlan />} />
          <Route path="/daily-checkin" element={<DailyCheckin />} />
          <Route path="/photo-capture" element={<PhotoCapture />} />
          <Route path="/alert-modal" element={<AlertModal />} />
          <Route path="/clinician-dashboard" element={<ClinicianDashboard />} />
          <Route path="/profile" element={<Profile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

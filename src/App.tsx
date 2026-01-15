import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashScreen from "./pages/SplashScreen";
import LoginScreen from "./pages/LoginScreen";
import RegisterScreen from "./pages/RegisterScreen";
import RewardsScreen from "./pages/RewardsScreen";
import RedeemScreen from "./pages/RedeemScreen";
import ScanScreen from "./pages/ScanScreen";
import HistoryScreen from "./pages/HistoryScreen";
import RemindersScreen from "./pages/RemindersScreen";
import ProfileScreen from "./pages/ProfileScreen";
import ApiTestPage from "./pages/ApiTestPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/rewards" element={<RewardsScreen />} />
          <Route path="/redeem" element={<RedeemScreen />} />
          <Route path="/scan" element={<ScanScreen />} />
          <Route path="/history" element={<HistoryScreen />} />
          <Route path="/reminders" element={<RemindersScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/api-test" element={<ApiTestPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AddMedication from "./pages/AddMedication";
import MedicineSearch from "./pages/MedicineSearch";
import Reminders from "./pages/Reminders";
import Chatbot from "./pages/Chatbot";
import Profile from "./pages/Profile";
import HealthRecords from "./pages/HealthRecords";
import NotFound from "./pages/NotFound";

import Navbar from "./components/layout/Navbar";
import BottomNav from "./components/layout/BottomNav";
import AuthGuard from "./components/auth/AuthGuard";
import { ThemeProvider, ThemeToggle } from "./components/theme/ThemeProvider";
import MedicoLogo from "./components/ui/MedicoLogo";

const queryClient = new QueryClient();

const App = () => {
  // Get username from localStorage or use a default
  const username = localStorage.getItem('username') || "Dashboard";
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatePresence mode="wait">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                
                {/* Protected routes */}
                <Route path="/dashboard" element={
                  <AuthGuard>
                    <Dashboard />
                  </AuthGuard>
                } />
                <Route path="/add-medication" element={
                  <AuthGuard>
                    <AddMedication />
                  </AuthGuard>
                } />
                <Route path="/medicine-search" element={
                  <AuthGuard>
                    <MedicineSearch />
                  </AuthGuard>
                } />
                <Route path="/reminders" element={
                  <AuthGuard>
                    <Reminders />
                  </AuthGuard>
                } />
                <Route path="/chatbot" element={
                  <AuthGuard>
                    <Chatbot />
                  </AuthGuard>
                } />
                <Route path="/health-records" element={
                  <AuthGuard>
                    <HealthRecords />
                  </AuthGuard>
                } />
                <Route path="/profile" element={
                  <AuthGuard>
                    <Profile />
                  </AuthGuard>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
            
            {/* Only show navigation on protected routes */}
            <Routes>
              <Route path="/" element={null} />
              <Route path="/auth" element={null} />
              <Route path="*" element={
                <>
                  <Navbar username={username} themeToggle={<ThemeToggle />} />
                  <BottomNav />
                </>
              } />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;

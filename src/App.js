import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import Dashboard from "./pages/Dashboard";
import ProfessionalDashboard from "./pages/ProfessionalDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDashboardNew from "./pages/AdminDashboardNew";
import AdminRoleSelection from "./pages/AdminRoleSelection";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AppSettings from "./pages/AppSettings";
import HowToUse from "./pages/HowToUse";
import PremiumPlans from "./pages/PremiumPlans";
import Notifications from "./pages/Notifications";
import ContactUs from "./pages/ContactUs";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import Reminders from "./pages/Reminders";
import Medicines from "./pages/Medicines";
import SmartReminders from "./pages/SmartReminders";
import PricingPage from "./pages/PricingPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import MedicalDisclaimer from "./pages/MedicalDisclaimer";
import RefundPolicy from "./pages/RefundPolicy";
import { initializeCapacitor } from "./capacitor-init";
import { ThemeProvider } from "./contexts/ThemeContext";
import AddMedicationHandler from "./components/AddMedicationHandler";
import SubscriptionGuard from "./components/SubscriptionGuard";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// Axios interceptor for auth
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Disable dark mode globally on app start
    document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', 'false');
    
    // Initialize Capacitor on native platforms
    initializeCapacitor();
    
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        <div className="animate-pulse text-2xl text-emerald-600">Loading...</div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="App">
        <BrowserRouter>
        <AddMedicationHandler />
        <Routes>
          <Route path="/" element={<LandingPage setUser={setUser} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/admin-role-selection"
            element={
              user?.is_admin ? (
                <AdminRoleSelection />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/admin"
            element={
              user?.is_admin ? (
                <AdminDashboardNew user={user} setUser={setUser} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/admin/old"
            element={
              user?.is_admin ? (
                <AdminDashboard user={user} setUser={setUser} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              user ? (
                <SubscriptionGuard user={user} language={localStorage.getItem("preferredLanguage") || "ar"}>
                  {user.is_admin && !localStorage.getItem("admin_role") ? (
                    <Navigate to="/admin-role-selection" replace />
                  ) : user.is_professional ? (
                    <ProfessionalDashboard user={user} setUser={setUser} />
                  ) : (
                    <Dashboard user={user} setUser={setUser} />
                  )}
                </SubscriptionGuard>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/profile"
            element={
              user ? (
                <Profile 
                  user={user} 
                  setUser={setUser} 
                  language={localStorage.getItem("preferredLanguage") || user.language || "en"}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/settings"
            element={
              user ? (
                <Settings 
                  user={user} 
                  setUser={setUser}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/app-settings"
            element={
              user ? (
                <AppSettings />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/how-to-use"
            element={
              user ? (
                <HowToUse />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/premium"
            element={
              user ? (
                <PremiumPlans user={user} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/notifications"
            element={
              user ? (
                <Notifications user={user} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/contact"
            element={
              user ? (
                <ContactUs />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/terms"
            element={
              user ? (
                <TermsAndConditions />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/privacy"
            element={
              user ? (
                <PrivacyPolicyPage />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/medicines"
            element={
              user ? (
                <Medicines 
                  user={user} 
                  language={localStorage.getItem("preferredLanguage") || user.language || "en"}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/reminders"
            element={
              user ? (
                <SmartReminders 
                  user={user} 
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/reminders-old"
            element={
              user ? (
                <Reminders 
                  user={user} 
                  language={localStorage.getItem("preferredLanguage") || user.language || "en"}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/pricing"
            element={
              <PricingPage 
                user={user} 
                language={localStorage.getItem("preferredLanguage") || user?.language || "ar"}
              />
            }
          />
          <Route
            path="/payment-success"
            element={
              user ? (
                <PaymentSuccess 
                  setUser={setUser}
                  language={localStorage.getItem("preferredLanguage") || user.language || "ar"}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/privacy-policy"
            element={
              <PrivacyPolicy 
                language={localStorage.getItem("preferredLanguage") || user?.language || "ar"}
              />
            }
          />
          <Route
            path="/terms-of-service"
            element={
              <TermsOfService 
                language={localStorage.getItem("preferredLanguage") || user?.language || "ar"}
              />
            }
          />
          <Route
            path="/medical-disclaimer"
            element={
              <MedicalDisclaimer 
                language={localStorage.getItem("preferredLanguage") || user?.language || "ar"}
              />
            }
          />
          <Route
            path="/refund-policy"
            element={
              <RefundPolicy 
                language={localStorage.getItem("preferredLanguage") || user?.language || "ar"}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
    </ThemeProvider>
  );
}

export default App;

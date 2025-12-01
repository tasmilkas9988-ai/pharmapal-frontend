import React, { useState } from "react";
import axios from "axios";
import { API } from "../App";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { toast } from "sonner";
import { Pill, Scan, Shield, Clock, Smartphone, Award } from "lucide-react";

const LandingPage = ({ setUser }) => {
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [language, setLanguage] = useState("en");

  // Auth form state
  const [authData, setAuthData] = useState({
    email: "",
    password: "",
    full_name: "",
    is_professional: false,
  });

  const handleAuth = async (type) => {
    try {
      const endpoint = type === "login" ? "/auth/login" : "/auth/register";
      const payload =
        type === "login"
          ? { email: authData.email, password: authData.password }
          : { ...authData, language };

      const response = await axios.post(`${API}${endpoint}`, payload);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("preferredLanguage", language); // Save language preference
      setUser(response.data.user);
      toast.success(language === "ar" ? "تم تسجيل الدخول بنجاح" : "Successfully logged in!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Auth error:", error);
      toast.error(error.response?.data?.detail || "Authentication failed");
    }
  };

  const handleInputChange = (field, value) => {
    try {
      setAuthData(prev => ({ ...prev, [field]: value }));
    } catch (error) {
      console.error("Input change error:", error);
    }
  };

  const content = {
    en: {
      hero: "Your Intelligent Medication Companion",
      subtitle: "Manage medications precisely with AI-powered recognition and Saudi SFDA database",
      getStarted: "Get Started",
      features: "Features",
      howItWorks: "How It Works",
      login: "Login",
      register: "Register",
      email: "Email",
      password: "Password",
      fullName: "Full Name",
      professional: "I am a healthcare professional",
      feature1Title: "AI Recognition",
      feature1Desc: "Snap a photo of any medication package for instant identification",
      feature2Title: "SFDA Verified",
      feature2Desc: "Access Saudi SFDA approved medication database",
      feature3Title: "Smart Scheduling",
      feature3Desc: "Get personalized medication schedules based on your routine",
      feature4Title: "Interaction Alerts",
      feature4Desc: "Real-time warnings about potential drug interactions",
      feature5Title: "Wearable Integration",
      feature5Desc: "Connect with smartwatches for health-optimized recommendations",
      feature6Title: "Professional Tools",
      feature6Desc: "Advanced analytics for healthcare professionals",
    },
    ar: {
      hero: "رفيقك الذكي للأدوية",
      subtitle: "إدارة الأدوية بدقة مع التعرف المدعوم بالذكاء الاصطناعي وقاعدة بيانات الهيئة العامة للغذاء والدواء السعودية",
      getStarted: "ابدأ الآن",
      features: "الميزات",
      howItWorks: "كيف يعمل",
      login: "تسجيل الدخول",
      register: "إنشاء حساب",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      fullName: "الاسم الكامل",
      professional: "أنا متخصص في الرعاية الصحية",
      feature1Title: "التعرف بالذكاء الاصطناعي",
      feature1Desc: "التقط صورة لأي عبوة دواء للتعرف الفوري",
      feature2Title: "معتمد من الهيئة",
      feature2Desc: "الوصول إلى قاعدة بيانات الأدوية المعتمدة من الهيئة السعودية",
      feature3Title: "جدولة ذكية",
      feature3Desc: "احصل على جداول أدوية مخصصة بناءً على روتينك",
      feature4Title: "تنبيهات التفاعلات",
      feature4Desc: "تحذيرات فورية حول التفاعلات الدوائية المحتملة",
      feature5Title: "تكامل الأجهزة القابلة للارتداء",
      feature5Desc: "اتصل بالساعات الذكية للحصول على توصيات محسّنة صحياً",
      feature6Title: "أدوات احترافية",
      feature6Desc: "تحليلات متقدمة لمتخصصي الرعاية الصحية",
    },
  };

  const t = content[language];

  if (showAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-4">
        <Card className="w-full max-w-md shadow-2xl" data-testid="auth-card">
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <CardTitle className="text-2xl gradient-text">PharmaPal</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={language === "en" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLanguage("en")}
                  data-testid="lang-en-btn"
                >
                  EN
                </Button>
                <Button
                  variant={language === "ar" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLanguage("ar")}
                  data-testid="lang-ar-btn"
                >
                  AR
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" data-testid="login-tab">{t.login}</TabsTrigger>
                <TabsTrigger value="register" data-testid="register-tab">{t.register}</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="space-y-4">
                <Input
                  type="email"
                  placeholder={t.email}
                  value={authData.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  data-testid="login-email-input"
                />
                <Input
                  type="password"
                  placeholder={t.password}
                  value={authData.password || ""}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  data-testid="login-password-input"
                />
                <Button
                  className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                  onClick={() => handleAuth("login")}
                  data-testid="login-submit-btn"
                >
                  {t.login}
                </Button>
              </TabsContent>
              <TabsContent value="register" className="space-y-4">
                <Input
                  type="text"
                  placeholder={t.fullName}
                  value={authData.full_name || ""}
                  onChange={(e) => handleInputChange("full_name", e.target.value)}
                  data-testid="register-name-input"
                />
                <Input
                  type="email"
                  placeholder={t.email}
                  value={authData.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  data-testid="register-email-input"
                />
                <Input
                  type="password"
                  placeholder={t.password}
                  value={authData.password || ""}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  data-testid="register-password-input"
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={authData.is_professional || false}
                    onChange={(e) => handleInputChange("is_professional", e.target.checked)}
                    className="w-4 h-4 text-emerald-600"
                    data-testid="professional-checkbox"
                  />
                  <span className="text-sm">{t.professional}</span>
                </label>
                <Button
                  className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                  onClick={() => handleAuth("register")}
                  data-testid="register-submit-btn"
                >
                  {t.register}
                </Button>
              </TabsContent>
            </Tabs>
            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={() => setShowAuth(false)}
              data-testid="back-to-landing-btn"
            >
              ← Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full glass z-50 border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Pill className="w-8 h-8 text-emerald-600" />
            <h1 className="text-2xl font-bold gradient-text" data-testid="app-title">PharmaPal</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              data-testid="nav-lang-toggle"
            >
              {language === "en" ? "العربية" : "English"}
            </Button>
            <Button
              onClick={() => setShowAuth(true)}
              className="bg-emerald-600 hover:bg-emerald-700"
              data-testid="nav-get-started-btn"
            >
              {t.getStarted}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 animate-fade-in" data-testid="hero-title">
            {t.hero}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8 animate-fade-in" data-testid="hero-subtitle">
            {t.subtitle}
          </p>
          <Button
            size="lg"
            onClick={() => setShowAuth(true)}
            className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-lg px-8 py-6 pulse-ring"
            data-testid="hero-get-started-btn"
          >
            {t.getStarted}
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 gradient-text" data-testid="features-title">
            {t.features}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="card-hover" data-testid="feature-card-1">
              <CardHeader>
                <Scan className="w-12 h-12 text-emerald-600 mb-4" />
                <CardTitle>{t.feature1Title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t.feature1Desc}</CardDescription>
              </CardContent>
            </Card>

            <Card className="card-hover" data-testid="feature-card-2">
              <CardHeader>
                <Shield className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>{t.feature2Title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t.feature2Desc}</CardDescription>
              </CardContent>
            </Card>

            <Card className="card-hover" data-testid="feature-card-3">
              <CardHeader>
                <Clock className="w-12 h-12 text-purple-600 mb-4" />
                <CardTitle>{t.feature3Title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t.feature3Desc}</CardDescription>
              </CardContent>
            </Card>

            <Card className="card-hover" data-testid="feature-card-4">
              <CardHeader>
                <Pill className="w-12 h-12 text-rose-600 mb-4" />
                <CardTitle>{t.feature4Title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t.feature4Desc}</CardDescription>
              </CardContent>
            </Card>

            <Card className="card-hover" data-testid="feature-card-5">
              <CardHeader>
                <Smartphone className="w-12 h-12 text-cyan-600 mb-4" />
                <CardTitle>{t.feature5Title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t.feature5Desc}</CardDescription>
              </CardContent>
            </Card>

            <Card className="card-hover" data-testid="feature-card-6">
              <CardHeader>
                <Award className="w-12 h-12 text-amber-600 mb-4" />
                <CardTitle>{t.feature6Title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t.feature6Desc}</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Pill className="w-6 h-6" />
            <h3 className="text-xl font-bold">PharmaPal</h3>
          </div>
          <p className="text-gray-400">
            {language === "en"
              ? "Intelligent medication management for better health"
              : "إدارة ذكية للأدوية من أجل صحة أفضل"}
          </p>
          <p className="text-sm text-gray-500 mt-4">© 2025 PharmaPal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

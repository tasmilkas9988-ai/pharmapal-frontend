import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../App";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { toast } from "sonner";
import { Pill, Scan, Shield, Clock, Bell, AlertTriangle } from "lucide-react";
import Footer from "../components/Footer";

const LandingPage = ({ setUser }) => {
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [language, setLanguage] = useState("ar");
  const [shouldNavigate, setShouldNavigate] = useState(false);

  // Auth form state
  const [authData, setAuthData] = useState({
    email: "",
    password: "",
    full_name: "",
  });
  
  // Navigate after user state is confirmed updated
  useEffect(() => {
    if (shouldNavigate) {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      if (token && storedUser) {
        try {
          const user = JSON.parse(storedUser);
          // Check if admin - redirect to admin dashboard
          if (user.is_admin) {
            navigate("/admin");
          } else {
            // Regular user - redirect to dashboard
            navigate("/dashboard");
          }
        } catch (error) {
          // Fallback to dashboard if parsing fails
          navigate("/dashboard");
        }
      }
    }
  }, [shouldNavigate, navigate]);

  const handleAuth = async (type) => {
    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
      const endpoint = type === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload =
        type === "login"
          ? { email: authData.email, password: authData.password }
          : { ...authData, language };

      const response = await axios.post(`${BACKEND_URL}${endpoint}`, payload);
      
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("preferredLanguage", language);
      setUser(response.data.user);
      toast.success(language === "ar" ? "تم تسجيل الدخول بنجاح" : "Successfully logged in!");
      
      // Trigger navigation after state update
      setShouldNavigate(true);
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
      subtitle: "Manage your medications safely with AI-powered recognition and smart reminders",
      getStarted: "Get Started",
      features: "Features",
      login: "Login",
      register: "Register",
      email: "Email",
      password: "Password",
      fullName: "Full Name",
      feature1Title: "AI Recognition",
      feature1Desc: "Instantly identify medications by scanning the package with your camera",
      feature2Title: "Drug Interactions",
      feature2Desc: "Get real-time alerts about dangerous drug interactions",
      feature3Title: "Smart Reminders",
      feature3Desc: "Never miss a dose with intelligent medication schedules",
      whyChoose: "Why Choose PharmaPal?",
      stat1: "AI-Powered",
      stat1Desc: "Advanced recognition technology",
      stat2: "Safe & Secure",
      stat2Desc: "Your data is protected",
      stat3: "24/7 Available",
      stat3Desc: "Access anytime, anywhere",
    },
    ar: {
      hero: "رفيقك الذكي لإدارة الأدوية",
      subtitle: "إدارة أدويتك بأمان مع التعرف الذكي والتذكيرات الذكية",
      getStarted: "ابدأ الآن",
      features: "المميزات",
      login: "تسجيل الدخول",
      register: "إنشاء حساب",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      fullName: "الاسم الكامل",
      feature1Title: "التعرف بالذكاء الاصطناعي",
      feature1Desc: "تعرف فوري على الأدوية عبر مسح العبوة بالكاميرا",
      feature2Title: "التداخلات الدوائية",
      feature2Desc: "تنبيهات فورية عن التداخلات الدوائية الخطيرة",
      feature3Title: "تذكيرات ذكية",
      feature3Desc: "لن تفوتك أي جرعة مع جداول الأدوية الذكية",
      whyChoose: "لماذا تختار PharmaPal؟",
      stat1: "مدعوم بالذكاء الاصطناعي",
      stat1Desc: "تقنية تعرف متقدمة",
      stat2: "آمن ومحمي",
      stat2Desc: "بياناتك محمية بالكامل",
      stat3: "متاح 24/7",
      stat3Desc: "الوصول في أي وقت ومكان",
    },
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center h-16 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <Pill className="w-8 h-8 text-teal-600" />
              <span className="text-2xl font-bold text-gray-800">PharmaPal</span>
            </div>
            <div className={`flex gap-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <button
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                className="text-gray-600 hover:text-teal-600 font-medium transition"
              >
                {language === 'en' ? 'العربية' : 'English'}
              </button>
              <Button
                onClick={() => setShowAuth(true)}
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6"
              >
                {t.getStarted}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Image */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className={`grid md:grid-cols-2 gap-12 items-center ${language === 'ar' ? 'md:grid-flow-dense' : ''}`}>
            {/* Text Content */}
            <div className={`${language === 'ar' ? 'md:col-start-2 text-right' : ''}`}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                {t.hero}
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {t.subtitle}
              </p>
              <Button
                onClick={() => setShowAuth(true)}
                size="lg"
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                {t.getStarted}
              </Button>
            </div>

            {/* Hero Image */}
            <div className={language === 'ar' ? 'md:col-start-1' : ''}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-3xl transform rotate-3"></div>
                <img
                  src="https://images.pexels.com/photos/5214966/pexels-photo-5214966.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Healthcare Professional"
                  className="relative rounded-3xl shadow-2xl w-full h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12">{t.whyChoose}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scan className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t.stat1}</h3>
              <p className="text-gray-600">{t.stat1Desc}</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t.stat2}</h3>
              <p className="text-gray-600">{t.stat2Desc}</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t.stat3}</h3>
              <p className="text-gray-600">{t.stat3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12 sm:mb-16">{t.features}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1: AI Recognition */}
            <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-teal-300">
              <CardHeader>
                <div className="w-full h-48 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1573883431205-98b5f10aaedb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwxfHxtZWRpY2F0aW9uJTIwcGlsbHN8ZW58MHx8fHRlYWx8MTc2MzI2NTkxMXww&ixlib=rb-4.1.0&q=85&w=400"
                    alt="AI Recognition"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Scan className="w-6 h-6 text-teal-600" />
                  {t.feature1Title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600">
                  {t.feature1Desc}
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 2: Drug Interactions */}
            <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-red-300">
              <CardHeader>
                <div className="w-full h-48 bg-gradient-to-br from-red-400 to-orange-500 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Drug Interactions"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  {t.feature2Title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600">
                  {t.feature2Desc}
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 3: Smart Reminders */}
            <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-purple-300">
              <CardHeader>
                <div className="w-full h-48 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/2055500/pexels-photo-2055500.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Smart Reminders"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Bell className="w-6 h-6 text-purple-600" />
                  {t.feature3Title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600">
                  {t.feature3Desc}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-cyan-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">
            {language === 'ar' ? 'ابدأ رحلتك الصحية اليوم' : 'Start Your Health Journey Today'}
          </h2>
          <p className="text-xl text-teal-50 mb-8">
            {language === 'ar' 
              ? 'انضم إلى آلاف المستخدمين الذين يثقون في PharmaPal لإدارة أدويتهم'
              : 'Join thousands of users who trust PharmaPal for their medication management'}
          </p>
          <Button
            onClick={() => setShowAuth(true)}
            size="lg"
            className="bg-white text-teal-600 hover:bg-gray-100 font-bold px-8 py-6 text-lg shadow-xl"
          >
            {t.getStarted}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">
            © 2025 PharmaPal. {language === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved.'}
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <div className={`flex justify-between items-center ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <CardTitle className="text-2xl">{t.getStarted}</CardTitle>
                <button
                  onClick={() => setShowAuth(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="login">{t.login}</TabsTrigger>
                  <TabsTrigger value="register">{t.register}</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4">
                  <Input
                    type="email"
                    placeholder={t.email}
                    value={authData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full"
                  />
                  <Input
                    type="password"
                    placeholder={t.password}
                    value={authData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="w-full"
                  />
                  <Button
                    onClick={() => handleAuth("login")}
                    className="w-full bg-teal-600 hover:bg-teal-700"
                  >
                    {t.login}
                  </Button>
                </TabsContent>

                <TabsContent value="register" className="space-y-4">
                  <Input
                    type="text"
                    placeholder={t.fullName}
                    value={authData.full_name}
                    onChange={(e) => handleInputChange("full_name", e.target.value)}
                    className="w-full"
                  />
                  <Input
                    type="email"
                    placeholder={t.email}
                    value={authData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full"
                  />
                  <Input
                    type="password"
                    placeholder={t.password}
                    value={authData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="w-full"
                  />
                  <Button
                    onClick={() => handleAuth("register")}
                    className="w-full bg-teal-600 hover:bg-teal-700"
                  >
                    {t.register}
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Footer */}
      {!showAuth && <Footer language={language} />}
    </div>
  );
};

export default LandingPage;

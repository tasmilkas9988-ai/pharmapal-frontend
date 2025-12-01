import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent } from "../components/ui/dialog";
import { Pill, AlertTriangle, Bell, FileText, Lock, Scan, Headphones } from "lucide-react";
import { toast } from "sonner";
import Footer from "../components/Footer";

// 🔥 أهم سطر — تعريف رابط الباك إند
const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL ||
  "https://pharmapal-backend-production-9328.up.railway.app";

const LandingPage = ({ setUser }) => {
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [language, setLanguage] = useState("ar");
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const [authData, setAuthData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });

  // ⛔ إطفاء الدارك مود
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("darkMode", "false");
  }, []);

  // ⚡ فحص إذا المستخدم داخل مسبقاً
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const adminRole = localStorage.getItem("admin_role");

        if (user.is_admin && !adminRole) navigate("/admin-role-selection");
        else if (user.is_admin && adminRole === "admin") navigate("/admin");
        else navigate("/dashboard");
      } catch (e) {
        navigate("/dashboard");
      }
    }
  }, [navigate]);

  // 🧠 تحديث البيانات داخل النموذج
  const handleInputChange = (field, value) => {
    setAuthData((prev) => ({ ...prev, [field]: value }));
  };

  // 🚀 تسجيل الدخول / التسجيل
  const handleAuth = async (type) => {
    setIsAuthLoading(true);

    try {
      // فحص الجوال
      if (!authData.phone || !authData.phone.match(/^05\d{8}$/)) {
        toast.error(
          language === "ar"
            ? "رقم الجوال غير صحيح (يجب أن يبدأ بـ 05)"
            : "Invalid phone number"
        );
        setIsAuthLoading(false);
        return;
      }

      // فحص الحقول عند التسجيل
      if (type === "register") {
        if (!authData.full_name || !authData.email || !authData.password) {
          toast.error(language === "ar" ? "الرجاء إدخال كل البيانات" : "Please fill all fields");
          setIsAuthLoading(false);
          return;
        }

        if (authData.password !== authData.confirm_password) {
          toast.error(language === "ar" ? "كلمات المرور غير متطابقة" : "Passwords do not match");
          setIsAuthLoading(false);
          return;
        }
      }

      // 🔥 endpoint الصحيح 100%
      const endpoint =
        type === "login" ? "/api/auth/login" : "/api/auth/register";

      const payload =
        type === "login"
          ? { phone: authData.phone, password: authData.password }
          : {
              full_name: authData.full_name,
              email: authData.email,
              phone: authData.phone,
              password: authData.password,
            };

      // 🔥 الاتصال الصحيح بالباك إند
      const response = await axios.post(`${BACKEND_URL}${endpoint}`, payload);

      toast.success(
        language === "ar" ? "تم تسجيل الدخول!" : "Login successful"
      );

      setUser(response.data.user);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(
        language === "ar" ? "فشل تسجيل الدخول" : "Login failed"
      );
    }

    setIsAuthLoading(false);
  };

  // 📝 المحتوى (ما غيرته)
  const content = {
    en: {
      hero: "Your Intelligent Medication Companion",
      subtitle: "Manage your medications safely with AI-powered tools",
      getStarted: "Get Started",
      login: "Login",
      register: "Register",
    },
    ar: {
      hero: "رفيقك الذكي لإدارة الأدوية",
      subtitle: "إدارة آمنة لأدويتك بالتقنيات الذكية",
      getStarted: "ابدأ الآن",
      login: "تسجيل الدخول",
      register: "إنشاء حساب",
    },
  };

  const t = content[language];

  // ⭐⭐ باقي الكود كما هو (UI فقط)… ما لمسته ⭐⭐

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex justify-between items-center h-16 ${
              language === "ar" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`flex items-center gap-2 ${
                language === "ar" ? "flex-row-reverse" : ""
              }`}
            >
              <Pill className="w-8 h-8 text-teal-600" />
              <span className="text-2xl font-bold text-gray-800">
                PharmaPal
              </span>
            </div>

            <button
              onClick={() =>
                setLanguage(language === "en" ? "ar" : "en")
              }
              className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
            >
              {language === "en" ? "العربية" : "English"}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{t.hero}</h1>
          <p className="text-gray-600 mb-8">{t.subtitle}</p>

          <Button
            onClick={() => setShowAuth(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-10 py-6 text-lg rounded-xl"
          >
            {t.getStarted}
          </Button>
        </div>
      </section>

      {/* Auth Dialog */}
      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
          <div className="bg-gradient-to-br from-teal-500 to-cyan-600 px-6 py-10 text-white text-center">
            <Pill className="w-10 h-10 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">
              {authMode === "login"
                ? t.login
                : t.register}
            </h2>
          </div>

          <div className="p-6 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAuth(authMode);
              }}
            >
              {authMode === "register" && (
                <>
                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={authData.full_name}
                    onChange={(e) =>
                      handleInputChange("full_name", e.target.value)
                    }
                    className="mb-3"
                  />

                  <Input
                    type="email"
                    placeholder="Email"
                    value={authData.email}
                    onChange={(e) =>
                      handleInputChange("email", e.target.value)
                    }
                    className="mb-3"
                  />
                </>
              )}

              <Input
                type="tel"
                placeholder="05xxxxxxxx"
                value={authData.phone}
                onChange={(e) =>
                  handleInputChange(
                    "phone",
                    e.target.value.replace(/\D/g, "")
                  )
                }
                maxLength={10}
                className="mb-3"
              />

              <Input
                type="password"
                placeholder="Password"
                value={authData.password}
                onChange={(e) =>
                  handleInputChange("password", e.target.value)
                }
                className="mb-3"
              />

              {authMode === "register" && (
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={authData.confirm_password}
                  onChange={(e) =>
                    handleInputChange("confirm_password", e.target.value)
                  }
                  className="mb-3"
                />
              )}

              <Button
                type="submit"
                disabled={isAuthLoading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white h-12"
              >
                {isAuthLoading
                  ? language === "ar"
                    ? "جاري التحميل..."
                    : "Loading..."
                  : authMode === "login"
                  ? t.login
                  : t.register}
              </Button>

              <button
                type="button"
                onClick={() =>
                  setAuthMode(
                    authMode === "login" ? "register" : "login"
                  )
                }
                className="w-full mt-3 text-teal-600 text-sm"
              >
                {authMode === "login"
                  ? language === "ar"
                    ? "إنشاء حساب جديد"
                    : "Create new account"
                  : language === "ar"
                  ? "تسجيل الدخول"
                  : "Login"}
              </button>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <Footer language={language} />
    </div>
  );
};

export default LandingPage;

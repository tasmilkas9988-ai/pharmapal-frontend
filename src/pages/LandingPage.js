import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../App";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { toast } from "sonner";
import { Pill, Scan, Shield, Clock, Bell, AlertTriangle, Calendar, FileText, CheckSquare, Lock, Headphones } from "lucide-react";
import Footer from "../components/Footer";

const LandingPage = ({ setUser }) => {
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // Changed default from "register" to "login"
  const [language, setLanguage] = useState("ar");
  const [shouldNavigate, setShouldNavigate] = useState(false);

  // Loading state for auth actions
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Auth form state
  const [authData, setAuthData] = useState({
    password: "",
    confirm_password: "",
    full_name: "",
    phone: "",
  });
  
  // Disable dark mode on landing page
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', 'false');
  }, []);

  // Check for existing token on mount and navigate
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const adminRole = localStorage.getItem("admin_role");
        
        if (user.is_admin && !adminRole) {
          // Admin without role selection - go to role selection page
          navigate("/admin-role-selection");
        } else if (user.is_admin && adminRole === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } catch (error) {
        navigate("/dashboard");
      }
    }
    
    // Restore scroll position when returning from legal pages
    const savedScrollPosition = sessionStorage.getItem('previousScrollPosition');
    if (savedScrollPosition) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScrollPosition));
        sessionStorage.removeItem('previousScrollPosition');
      }, 100);
    }
  }, [navigate]);
  
  // Navigate after user state is confirmed updated
  useEffect(() => {
    if (shouldNavigate) {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      
      if (!token || !storedUser) {
        setShouldNavigate(false);
        return;
      }
      
      if (token && storedUser) {
        try {
          const user = JSON.parse(storedUser);
          const adminRole = localStorage.getItem("admin_role");
          
          if (user.is_admin && !adminRole) {
            // Admin without role selection - go to role selection page
            navigate("/admin-role-selection");
          } else if (user.is_admin && adminRole === "admin") {
            navigate("/admin");
          } else {
            navigate("/dashboard");
          }
        } catch (error) {
          console.error("Error navigating:", error);
          setShouldNavigate(false);
        }
      }
    }
  }, [shouldNavigate, navigate]);

  const handleAuth = async (type) => {
  setIsAuthLoading(true);

  try {
    // Validate phone number format (05xxxxxxxx)
    if (!authData.phone || authData.phone.trim() === "") {
      toast.error(language === "ar" ? "الرجاء إدخال رقم الجوال" : "Please enter phone number");
      setIsAuthLoading(false);
      return;
    }

    if (!authData.phone.match(/^05\d{8}$/)) {
      toast.error(
        language === "ar"
          ? "رقم الجوال يجب أن يبدأ بـ 05 متبوعاً بـ 8 أرقام"
          : "Phone must start with 05 followed by 8 digits"
      );
      setIsAuthLoading(false);
      return;
    }

    // Validate registration fields
    if (type === "register") {
      if (!authData.full_name || !authData.email || !authData.password) {
        toast.error(language === "ar" ? "الرجاء إدخال جميع البيانات" : "Please fill all fields");
        setIsAuthLoading(false);
        return;
      }
    }

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const endpoint =
      type === "login"
        ? `${BACKEND_URL}/api/auth/login`
        : `${BACKEND_URL}/api/auth/register`;

    const payload =
      type === "login"
        ? {
            phone: authData.phone,
            password: authData.password,
          }
        : {
            full_name: authData.full_name,
            email: authData.email,
            phone: authData.phone,
            password: authData.password,
          };

    const response = await axios.post(endpoint, payload);

    toast.success(language === "ar" ? "تم تسجيل الدخول بنجاح!" : "Login successful");
    setUser(response.data.user);

    navigate("/home");
  } catch (error) {
    console.error(error);
    toast.error(language === "ar" ? "فشل تسجيل الدخول" : "Login failed");
  } finally {
    setIsAuthLoading(false);
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
      features: "Why Choose PharmaPal?",
      login: "Login",
      register: "Register",
      email: "Email",
      password: "Password",
      fullName: "Full Name",
      
      // 8 Features
      feature1Title: "AI Medication Recognition",
      feature1Desc: "Identify medications instantly by scanning the package with your camera",
      
      feature2Title: "Drug Interactions",
      feature2Desc: "Real-time alerts about dangerous drug interactions",
      
      feature3Title: "Smart Reminders",
      feature3Desc: "Never miss a dose with intelligent medication schedules",
      
      feature4Title: "Prescription Management",
      feature4Desc: "Organize and track all your prescriptions in one place",
      
      feature5Title: "Adherence Tracking",
      feature5Desc: "Monitor and improve your medication compliance",
      
      feature6Title: "Dosage Information",
      feature6Desc: "Accurate details about dosages and usage",
      
      feature7Title: "Data Privacy",
      feature7Desc: "Your medical data is protected with advanced security",
      
      feature8Title: "Quick Support",
      feature8Desc: "Fast technical support whenever you need it",
      
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
      subtitle: "إدارة آمنة لأدويتك مع التعرف الذكي والتذكيرات التلقائية",
      getStarted: "ابدأ الآن",
      features: "لماذا تختار PharmaPal؟",
      login: "تسجيل الدخول",
      register: "إنشاء حساب",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      fullName: "الاسم الكامل",
      
      // 8 Features
      feature1Title: "التعرف بالذكاء الاصطناعي",
      feature1Desc: "تعرف فوري على الأدوية بمسح العبوة بالكاميرا",
      
      feature2Title: "التداخلات الدوائية",
      feature2Desc: "تنبيهات فورية عن التداخلات الدوائية الخطيرة",
      
      feature3Title: "التذكيرات الذكية",
      feature3Desc: "لن تفوتك جرعة مع الجداول الذكية",
      
      feature4Title: "إدارة الوصفات",
      feature4Desc: "تنظيم ومتابعة جميع وصفاتك في مكان واحد",
      
      feature5Title: "متابعة الالتزام",
      feature5Desc: "راقب وحسّن التزامك بالعلاج",
      
      feature6Title: "معلومات الجرعات",
      feature6Desc: "تفاصيل دقيقة عن الجرعات والاستخدام",
      
      feature7Title: "خصوصية البيانات",
      feature7Desc: "بياناتك الطبية محمية بأمان متقدم",
      
      feature8Title: "دعم سريع",
      feature8Desc: "دعم فني سريع عند الحاجة",
      
      whyChoose: "لماذا PharmaPal؟",
      stat1: "ذكاء اصطناعي",
      stat1Desc: "تقنية تعرف متقدمة",
      stat2: "آمن ومحمي",
      stat2Desc: "بياناتك محمية بالكامل",
      stat3: "متاح 24/7",
      stat3Desc: "الوصول في أي وقت ومكان",
    },
  };

  const t = content[language];

  // Features data with icons, images, and detailed benefits
  const featuresDetails = {
    en: [
      {
        id: 1,
        icon: Scan,
        image: "https://images.unsplash.com/photo-1667058015056-b03fa4974abf?w=400",
        title: "AI Medication Recognition",
        desc: "Identify medications instantly by scanning the package with your camera",
        benefits: [
          "Instant medication identification with 99% accuracy",
          "Save time - no need to manually search",
          "Reduce medication errors",
          "Access complete drug information immediately",
          "Works with most medication packages"
        ],
        advantages: [
          "Fast and accurate AI technology",
          "Easy to use - just point and scan",
          "Comprehensive database of medications",
          "Regular updates for new medications"
        ]
      },
      {
        id: 2,
        icon: AlertTriangle,
        image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400",
        title: "Drug Interactions",
        desc: "Real-time alerts about dangerous drug interactions",
        benefits: [
          "Prevent dangerous medication combinations",
          "Real-time interaction warnings",
          "Protect your health and safety",
          "Evidence-based interaction data",
          "Alerts for food-drug interactions"
        ],
        advantages: [
          "Advanced medical database",
          "Instant alerts before taking medication",
          "Covers prescription and OTC drugs",
          "Regularly updated interaction database"
        ]
      },
      {
        id: 3,
        icon: Bell,
        image: "https://images.unsplash.com/photo-1624711076872-ecdbc5ade023?w=400",
        title: "Smart Reminders",
        desc: "Never miss a dose with intelligent medication schedules",
        benefits: [
          "Never forget to take your medication",
          "Customizable reminder schedules",
          "Multiple reminders per medication",
          "Improve medication adherence",
          "Track your medication history"
        ],
        advantages: [
          "Smart notification system",
          "Works even when app is closed",
          "Flexible scheduling options",
          "Quiet hours support"
        ]
      },
      {
        id: 4,
        icon: FileText,
        image: "https://images.unsplash.com/photo-1543709533-c032159da7b0?w=400",
        title: "Prescription Management",
        desc: "Organize and track all your prescriptions in one place",
        benefits: [
          "All prescriptions in one secure place",
          "Track refill dates and quantities",
          "Share prescriptions with doctors easily",
          "Digital prescription storage",
          "Medication history at your fingertips"
        ],
        advantages: [
          "Cloud-based secure storage",
          "Easy organization and search",
          "Never lose a prescription again",
          "Export and share capabilities"
        ]
      },
      {
        id: 5,
        icon: Pill,
        image: "https://images.pexels.com/photos/4176479/pexels-photo-4176479.jpeg?w=400",
        title: "Dosage Information",
        desc: "Accurate details about dosages and usage",
        benefits: [
          "Detailed dosage instructions",
          "Understand proper usage",
          "Side effects information",
          "Contraindications and warnings",
          "Storage instructions"
        ],
        advantages: [
          "Medically accurate information",
          "Easy to understand format",
          "Available in multiple languages",
          "Regular content updates"
        ]
      },
      {
        id: 6,
        icon: Lock,
        image: "https://images.unsplash.com/photo-1633265486064-086b219458ec?w=400",
        title: "Data Privacy",
        desc: "Your medical data is protected with advanced security",
        benefits: [
          "Bank-level encryption",
          "Your data is completely private",
          "No sharing without permission",
          "GDPR compliant",
          "Secure cloud backup"
        ],
        advantages: [
          "Advanced security protocols",
          "Regular security audits",
          "Data stored on secure servers",
          "Full control over your data"
        ]
      },
      {
        id: 7,
        icon: Headphones,
        image: "https://images.unsplash.com/photo-1712159018726-4564d92f3ec2?w=400",
        title: "Quick Support",
        desc: "Fast technical support whenever you need it",
        benefits: [
          "24/7 support availability",
          "Quick response times",
          "Knowledgeable support team",
          "Multiple contact channels",
          "In-app support chat"
        ],
        advantages: [
          "Dedicated support team",
          "Solutions within hours",
          "Friendly and helpful staff",
          "Available in Arabic and English"
        ]
      }
    ],
    ar: [
      {
        id: 1,
        icon: Scan,
        image: "https://images.unsplash.com/photo-1667058015056-b03fa4974abf?w=400",
        title: "التعرف بالذكاء الاصطناعي",
        desc: "تعرف فوري على الأدوية بمسح العبوة بالكاميرا",
        benefits: [
          "تعرف فوري على الأدوية بدقة 99%",
          "توفير الوقت - لا حاجة للبحث اليدوي",
          "تقليل أخطاء الأدوية",
          "الوصول لمعلومات الدواء كاملة فوراً",
          "يعمل مع معظم عبوات الأدوية"
        ],
        advantages: [
          "تقنية ذكاء اصطناعي سريعة ودقيقة",
          "سهل الاستخدام - فقط وجه الكاميرا وامسح",
          "قاعدة بيانات شاملة للأدوية",
          "تحديثات منتظمة للأدوية الجديدة"
        ]
      },
      {
        id: 2,
        icon: AlertTriangle,
        image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400",
        title: "التداخلات الدوائية",
        desc: "تنبيهات فورية عن التداخلات الدوائية الخطيرة",
        benefits: [
          "منع التركيبات الدوائية الخطيرة",
          "تحذيرات فورية عن التداخلات",
          "حماية صحتك وسلامتك",
          "بيانات تداخلات مبنية على الأدلة",
          "تنبيهات عن تداخلات الطعام مع الدواء"
        ],
        advantages: [
          "قاعدة بيانات طبية متقدمة",
          "تنبيهات فورية قبل تناول الدواء",
          "تشمل الأدوية بوصفة وبدون وصفة",
          "تحديثات منتظمة لقاعدة التداخلات"
        ]
      },
      {
        id: 3,
        icon: Bell,
        image: "https://images.unsplash.com/photo-1624711076872-ecdbc5ade023?w=400",
        title: "التذكيرات الذكية",
        desc: "لن تفوتك جرعة مع الجداول الذكية",
        benefits: [
          "لن تنسى أبداً تناول دوائك",
          "جداول تذكير قابلة للتخصيص",
          "تذكيرات متعددة لكل دواء",
          "تحسين الالتزام بالعلاج",
          "تتبع سجل أدويتك"
        ],
        advantages: [
          "نظام إشعارات ذكي",
          "يعمل حتى عند إغلاق التطبيق",
          "خيارات جدولة مرنة",
          "دعم ساعات الهدوء"
        ]
      },
      {
        id: 4,
        icon: FileText,
        image: "https://images.unsplash.com/photo-1543709533-c032159da7b0?w=400",
        title: "إدارة الوصفات",
        desc: "تنظيم ومتابعة جميع وصفاتك في مكان واحد",
        benefits: [
          "جميع الوصفات في مكان آمن واحد",
          "تتبع مواعيد التجديد والكميات",
          "مشاركة الوصفات مع الأطباء بسهولة",
          "تخزين رقمي للوصفات",
          "سجل الأدوية في متناول يدك"
        ],
        advantages: [
          "تخزين آمن على السحابة",
          "تنظيم وبحث سهل",
          "لن تفقد وصفة طبية مرة أخرى",
          "إمكانيات التصدير والمشاركة"
        ]
      },
      {
        id: 5,
        icon: Pill,
        image: "https://images.pexels.com/photos/4176479/pexels-photo-4176479.jpeg?w=400",
        title: "معلومات الجرعات",
        desc: "تفاصيل دقيقة عن الجرعات والاستخدام",
        benefits: [
          "تعليمات مفصلة عن الجرعات",
          "فهم الاستخدام الصحيح",
          "معلومات عن الآثار الجانبية",
          "موانع الاستعمال والتحذيرات",
          "تعليمات التخزين"
        ],
        advantages: [
          "معلومات دقيقة طبياً",
          "صيغة سهلة الفهم",
          "متاحة بلغات متعددة",
          "تحديثات منتظمة للمحتوى"
        ]
      },
      {
        id: 6,
        icon: Lock,
        image: "https://images.unsplash.com/photo-1633265486064-086b219458ec?w=400",
        title: "خصوصية البيانات",
        desc: "بياناتك الطبية محمية بأمان متقدم",
        benefits: [
          "تشفير بمستوى البنوك",
          "بياناتك خاصة تماماً",
          "لا مشاركة بدون إذن",
          "متوافق مع GDPR",
          "نسخ احتياطي آمن على السحابة"
        ],
        advantages: [
          "بروتوكولات أمان متقدمة",
          "مراجعات أمنية منتظمة",
          "بيانات مخزنة على خوادم آمنة",
          "تحكم كامل في بياناتك"
        ]
      },
      {
        id: 7,
        icon: Headphones,
        image: "https://images.unsplash.com/photo-1712159018726-4564d92f3ec2?w=400",
        title: "دعم سريع",
        desc: "دعم فني سريع عند الحاجة",
        benefits: [
          "دعم متاح 24/7",
          "أوقات استجابة سريعة",
          "فريق دعم متمرس",
          "قنوات اتصال متعددة",
          "دردشة دعم داخل التطبيق"
        ],
        advantages: [
          "فريق دعم مخصص",
          "حلول خلال ساعات",
          "طاقم ودود ومتعاون",
          "متاح بالعربي والإنجليزي"
        ]
      }
    ]
  };

  const features = featuresDetails[language];

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
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
            >
              {language === 'en' ? 'العربية' : 'English'}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className={`grid md:grid-cols-2 gap-12 items-center ${language === 'ar' ? 'md:grid-flow-dense' : ''}`}>
            {/* Text Content */}
            <div className={`${language === 'ar' ? 'md:col-start-2 text-right' : ''}`}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {t.hero}
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {t.subtitle}
              </p>
              
              {/* Call to Action Buttons */}
              <div className="flex flex-col gap-4">
                <Button
                  onClick={() => {
                    // Don't force register mode, use current authMode (default is login)
                    setShowAuth(true);
                  }}
                  size="lg"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-10 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl"
                >
                  {t.getStarted}
                </Button>
                
                <button
                  onClick={() => {
                    setAuthMode("register");
                    setShowAuth(true);
                  }}
                  className="text-gray-600 hover:text-teal-600 font-medium transition-colors text-base"
                >
                  {language === 'ar' ? 'ليس لديك حساب؟ سجل الآن' : 'Don\'t have an account? Register'}
                </button>
              </div>
            </div>

            {/* Hero Image */}
            <div className={language === 'ar' ? 'md:col-start-1' : ''}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-3xl transform rotate-3"></div>
                <img
                  src="https://images.unsplash.com/photo-1758691030826-86a149b6278b?w=800&q=80"
                  alt="Elderly person happily using PharmaPal app"
                  className="relative rounded-3xl shadow-2xl w-full h-80 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - 7 Features */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-12">{t.features}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="hover:shadow-xl transition-all duration-300 border hover:border-teal-300 group"
                >
                  <CardHeader className="p-0">
                    <div className="w-full h-40 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-t-lg overflow-hidden">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="flex items-center gap-2 text-base mb-2">
                      <Icon className="w-5 h-5 text-teal-600 flex-shrink-0" />
                      <span className="leading-snug">{feature.title}</span>
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 leading-relaxed">
                      {feature.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Auth Dialog - Enhanced Design */}
      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent className="sm:max-w-lg border-none shadow-2xl overflow-hidden p-0" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          {/* Header with Gradient Background */}
          <div className="bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600 px-8 pt-10 pb-6 relative">
            {/* Decorative Circle */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
            
            <div className="relative">
              {/* Icon */}
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <Pill className="w-8 h-8 text-white" />
              </div>
              
              {/* Title */}
              <h2 className="text-2xl font-bold text-white text-center mb-2">
                {authMode === "register" 
                  ? (language === 'ar' ? 'إنشاء حساب جديد' : 'Create New Account') 
                  : (language === 'ar' ? 'تسجيل الدخول' : 'Login to Your Account')
                }
              </h2>
              
              {/* Description */}
              <p className="text-white/90 text-center text-sm">
                {authMode === "register" 
                  ? (language === 'ar' ? 'انضم إلينا وابدأ رحلتك الصحية الذكية' : 'Join us and start your smart health journey')
                  : (language === 'ar' ? 'أهلاً بعودتك! سجل دخولك للمتابعة' : 'Welcome back! Login to continue')
                }
              </p>
            </div>
          </div>
          
          {/* Form Content */}
          <div className="px-8 py-6 bg-white">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleAuth(authMode);
              }}
            >
              {authMode === "register" ? (
                // Register Form
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      {t.fullName}
                    </label>
                    <Input
                      type="text"
                      placeholder={language === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                      value={authData.full_name}
                      onChange={(e) => handleInputChange("full_name", e.target.value)}
                      className="h-12 text-base border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      {language === 'ar' ? 'رقم الجوال' : 'Mobile Number'}
                    </label>
                    <Input
                      type="tel"
                      placeholder="05xxxxxxxx"
                      value={authData.phone}
                      onChange={(e) => {
                        // Only allow numbers and limit to 10 digits
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 10) {
                          handleInputChange("phone", value);
                        }
                      }}
                      className="h-12 text-base border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                      dir="ltr"
                      maxLength={10}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {language === 'ar' ? 'رقم الجوال للتسجيل وتسجيل الدخول' : 'Phone number for registration and login'}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      {language === 'ar' ? 'كلمة المرور' : 'Password'}
                    </label>
                    <Input
                      type="password"
                      placeholder={language === 'ar' ? 'كلمة المرور (6 أحرف على الأقل)' : 'Password (min 6 characters)'}
                      value={authData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="h-12 text-base border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      {language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                    </label>
                    <Input
                      type="password"
                      placeholder={language === 'ar' ? 'أعد إدخال كلمة المرور' : 'Re-enter password'}
                      value={authData.confirm_password}
                      onChange={(e) => handleInputChange("confirm_password", e.target.value)}
                      className="h-12 text-base border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isAuthLoading}
                    className="w-full h-12 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAuthLoading ? (language === 'ar' ? 'جاري التسجيل...' : 'Registering...') : t.register}
                  </Button>
                  
                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">
                        {language === 'ar' ? 'أو' : 'or'}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setAuthMode("login")}
                    className="w-full text-center text-gray-600 hover:text-teal-600 text-sm font-medium transition-colors py-2"
                  >
                    {language === 'ar' ? 'لديك حساب بالفعل؟ تسجيل الدخول' : 'Already have an account? Login'}
                  </button>
                </div>
              ) : (
                // Login Form
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      {language === 'ar' ? 'رقم الجوال' : 'Mobile Number'}
                    </label>
                    <Input
                      type="tel"
                      placeholder="05xxxxxxxx"
                      value={authData.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 10) {
                          handleInputChange("phone", value);
                        }
                      }}
                      className="h-12 text-base border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                      dir="ltr"
                      maxLength={10}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      {language === 'ar' ? 'كلمة المرور' : 'Password'}
                    </label>
                    <Input
                      type="password"
                      placeholder={language === 'ar' ? 'كلمة المرور' : 'Password'}
                      value={authData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="h-12 text-base border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isAuthLoading}
                    className="w-full h-12 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAuthLoading ? (language === 'ar' ? 'جاري تسجيل الدخول...' : 'Logging in...') : t.login}
                  </Button>
                  
                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">
                        {language === 'ar' ? 'أو' : 'or'}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setAuthMode("register")}
                    className="w-full text-center text-gray-600 hover:text-teal-600 text-sm font-medium transition-colors py-2"
                  >
                    {language === 'ar' ? 'ليس لديك حساب؟ سجل الآن' : "Don't have an account? Register"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <Footer language={language} />
    </div>
  );
};

export default LandingPage;

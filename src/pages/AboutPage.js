import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ArrowLeft, ArrowRight, Pill, Heart, Users, Target } from "lucide-react";
import Footer from "../components/Footer";

const AboutPage = () => {
  const navigate = useNavigate();
  const language = localStorage.getItem("preferredLanguage") || "ar";

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const content = {
    en: {
      title: "About PharmaPal",
      subtitle: "Your trusted partner in medication management",
      mission: "Our Mission",
      missionText: "To revolutionize medication management through AI-powered technology, ensuring safer and more effective healthcare for everyone.",
      vision: "Our Vision",
      visionText: "A world where medication errors are eliminated, and every individual has access to intelligent healthcare guidance.",
      values: "Our Values",
      value1: "Safety First",
      value1Desc: "Patient safety is at the core of everything we do",
      value2: "Innovation",
      value2Desc: "Leveraging cutting-edge AI technology for better healthcare",
      value3: "Accessibility",
      value3Desc: "Making quality healthcare information available to all",
      back: "Back to Home"
    },
    ar: {
      title: "من نحن",
      subtitle: "شريكك الموثوق في إدارة الأدوية",
      mission: "مهمتنا",
      missionText: "إحداث ثورة في إدارة الأدوية من خلال التكنولوجيا المدعومة بالذكاء الاصطناعي، لضمان رعاية صحية أكثر أماناً وفعالية للجميع.",
      vision: "رؤيتنا",
      visionText: "عالم خالٍ من أخطاء الأدوية، حيث يحصل كل فرد على إرشادات صحية ذكية.",
      values: "قيمنا",
      value1: "السلامة أولاً",
      value1Desc: "سلامة المريض هي جوهر كل ما نقوم به",
      value2: "الابتكار",
      value2Desc: "الاستفادة من أحدث تقنيات الذكاء الاصطناعي لرعاية صحية أفضل",
      value3: "سهولة الوصول",
      value3Desc: "جعل معلومات الرعاية الصحية الجيدة متاحة للجميع",
      back: "العودة للرئيسية"
    }
  };

  const t = content[language];

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            onClick={handleBack}
            variant="ghost"
            className="text-teal-700 hover:text-teal-900 font-semibold"
          >
            <ArrowLeft className={`w-5 h-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
            {t.back}
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Pill className="w-16 h-16 text-teal-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t.title}
          </h1>
          <p className="text-xl text-gray-600">
            {t.subtitle}
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-8 h-8 text-teal-600" />
              <h2 className="text-2xl font-bold text-gray-900">{t.mission}</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">{t.missionText}</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-8 h-8 text-teal-600" />
              <h2 className="text-2xl font-bold text-gray-900">{t.vision}</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">{t.visionText}</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">{t.values}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t.value1}</h3>
              <p className="text-gray-600">{t.value1Desc}</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Pill className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t.value2}</h3>
              <p className="text-gray-600">{t.value2Desc}</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t.value3}</h3>
              <p className="text-gray-600">{t.value3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer language={language} />
    </div>
  );
};

export default AboutPage;

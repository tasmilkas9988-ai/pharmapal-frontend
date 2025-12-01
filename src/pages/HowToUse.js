import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Plus, Camera, Pill, Clock, User, Sparkles, ChevronLeft } from 'lucide-react';

const HowToUse = () => {
  const navigate = useNavigate();
  const [language] = useState(localStorage.getItem('preferredLanguage') || 'ar');

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  const sections = [
    {
      id: 1,
      title: {
        ar: 'إضافة دواء جديد',
        en: 'Add New Medication'
      },
      description: {
        ar: 'انقر على الزر الأرجواني "+" في الأسفل لإضافة دواء جديد. يمكنك البحث في قائمة الأدوية المسجلة والمعتمدة أو استخدام الكاميرا للتعرف على الدواء',
        en: 'Click the purple "+" button at the bottom to add a new medication. You can search the registered medications database or use the camera to recognize the medication'
      },
      icon: Plus,
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      id: 2,
      title: {
        ar: 'التعرف الذكي بالكاميرا',
        en: 'Smart Camera Recognition'
      },
      description: {
        ar: 'التقط صورة لعبوة الدواء باستخدام الكاميرا، وسيقوم الذكاء الاصطناعي بالتعرف على الدواء وعرض تفاصيله الكاملة تلقائياً',
        en: 'Capture an image of the medication package using the camera, and AI will recognize it and automatically display its complete details'
      },
      icon: Camera,
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      id: 3,
      title: {
        ar: 'قائمة أدويتي',
        en: 'My Medications'
      },
      description: {
        ar: 'اعرض جميع أدويتك في مكان واحد مع جميع التفاصيل الكاملة لكل دواء. انقر على "الأدوية" في الشريط السفلي للوصول إلى قائمتك',
        en: 'View all your medications in one place with complete details for each. Click "Medicines" in the bottom bar to access your list'
      },
      icon: Pill,
      gradient: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600'
    },
    {
      id: 4,
      title: {
        ar: 'التذكيرات الذكية',
        en: 'Smart Reminders'
      },
      description: {
        ar: 'احصل على تذكيرات ذكية لمواعيد أدويتك ومدة العلاج. التطبيق يعتمد على مصادر موثوقة ولكن يجب الرجوع دائماً لإرشادات طبيبك المعالج',
        en: 'Get smart reminders for your medications and treatment duration. The app relies on reliable sources but always refer to your doctor\'s instructions'
      },
      icon: Clock,
      gradient: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-50',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      id: 5,
      title: {
        ar: 'الملف الشخصي والتوصيات',
        en: 'Profile & Recommendations'
      },
      description: {
        ar: 'أضف معلوماتك الصحية (الوزن، الطول، العمر، الجنس) لتحصل على توصيات صحية مخصصة وحساب مؤشر كتلة الجسم (BMI) تلقائياً',
        en: 'Add your health information (weight, height, age, gender) to get personalized health recommendations and automatic BMI calculation'
      },
      icon: User,
      gradient: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* iOS-Style Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <ChevronLeft className={`w-6 h-6 text-gray-700 ${language === 'ar' ? 'rotate-180' : ''}`} />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'كيف تستخدم التطبيق' : 'How to Use the App'}
              </h1>
              <p className="text-sm text-gray-600">
                {language === 'ar' ? 'دليل استخدام PharmaPal' : 'PharmaPal User Guide'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center">
            <Sparkles className="w-14 h-14 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">
            {language === 'ar' ? 'اكتشف قوة PharmaPal' : 'Discover PharmaPal\'s Power'}
          </h2>
          <p className="text-white/90 text-base leading-relaxed max-w-2xl mx-auto">
            {language === 'ar'
              ? 'تعرف على الميزات الذكية التي تساعدك في إدارة أدويتك بسهولة وأمان'
              : 'Learn about the smart features that help you manage your medications easily and safely'}
          </p>
        </div>
      </div>

      {/* Features Sections */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-5">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
          >
            {/* Section Header with Gradient */}
            <div className={`bg-gradient-to-r ${section.gradient} px-6 py-5 flex items-center gap-4`}>
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center flex-shrink-0">
                <section.icon className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white/80 text-sm font-medium">
                    {language === 'ar' ? `الخطوة ${index + 1}` : `Step ${index + 1}`}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  {section.title[language]}
                </h3>
              </div>
            </div>

            {/* Section Content */}
            <div className={`${section.bgColor} px-6 py-6`}>
              <p className="text-gray-700 text-base leading-relaxed">
                {section.description[language]}
              </p>
            </div>

            {/* Bottom Accent */}
            <div className={`h-1 bg-gradient-to-r ${section.gradient}`}></div>
          </div>
        ))}
      </div>

      {/* Tips Section */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl border-2 border-amber-200 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-amber-900 mb-2">
                {language === 'ar' ? '💡 نصيحة مهمة' : '💡 Important Tip'}
              </h4>
              <p className="text-amber-800 text-sm leading-relaxed">
                {language === 'ar'
                  ? 'هذا التطبيق هو أداة مساعدة فقط ولا يُعتبر بديلاً عن الاستشارة الطبية. استشر طبيبك دائماً قبل اتخاذ أي قرارات علاجية.'
                  : 'This app is a helpful tool only and is not a substitute for medical consultation. Always consult your doctor before making any treatment decisions.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl p-8 text-center shadow-xl">
          <h3 className="text-2xl font-bold text-white mb-3">
            {language === 'ar' ? 'جاهز للبدء؟' : 'Ready to Start?'}
          </h3>
          <p className="text-white/90 mb-6 text-base">
            {language === 'ar'
              ? 'ابدأ الآن بإضافة أول دواء لك'
              : 'Start now by adding your first medication'}
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-white text-teal-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 active:scale-95 transition-all shadow-lg inline-flex items-center gap-2"
          >
            <span>{language === 'ar' ? 'انتقل إلى الصفحة الرئيسية' : 'Go to Dashboard'}</span>
            <ArrowRight className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-8"></div>
    </div>
  );
};

export default HowToUse;

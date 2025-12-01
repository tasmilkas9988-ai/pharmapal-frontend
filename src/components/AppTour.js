import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

const AppTour = ({ isOpen, onClose, language = 'ar' }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tourSteps = [
    {
      title: {
        ar: "🎉 مرحباً بك في PharmaPal",
        en: "🎉 Welcome to PharmaPal"
      },
      description: {
        ar: "سنأخذك في جولة سريعة لتتعرف على أهم ميزات التطبيق وكيفية استخدامها بذكاء وسهولة",
        en: "We'll take you on a quick tour to learn about the app's main features and how to use them smartly"
      },
      icon: "👋",
      highlight: null
    },
    {
      title: {
        ar: "➕ إضافة دواء جديد",
        en: "➕ Add New Medication"
      },
      description: {
        ar: "انقر على الزر الأرجواني '+' في الأسفل لإضافة دواء جديد. يمكنك البحث في قائمة الأدوية المسجلة والمعتمدة",
        en: "Click the purple '+' button at the bottom to add a new medication. You can search the registered and approved medications database"
      },
      icon: "➕",
      highlight: "bottom-nav-add",
      image: "https://img.icons8.com/color/96/add--v1.png"
    },
    {
      title: {
        ar: "📸 التعرف الذكي بالكاميرا",
        en: "📸 Smart Camera Recognition"
      },
      description: {
        ar: "التقط صورة لعبوة الدواء باستخدام الكاميرا، وسيقوم الذكاء الاصطناعي بالتعرف على عبوة الدواء وعرض تفاصيله",
        en: "Capture an image of the medication package using the camera, and AI will recognize the package and display its details"
      },
      icon: "📸",
      highlight: null,
      image: "https://img.icons8.com/color/96/camera--v1.png"
    },
    {
      title: {
        ar: "💊 قائمة أدويتي",
        en: "💊 My Medications"
      },
      description: {
        ar: "اعرض جميع أدويتك في مكان واحد مع جميع التفاصيل الكاملة لكل دواء. انقر على 'الأدوية' في الشريط السفلي لعرض قائمتك الكاملة",
        en: "View all your medications in one place with complete details for each. Click 'Medicines' in the bottom bar to see your full list"
      },
      icon: "💊",
      highlight: "bottom-nav-medicines",
      image: "https://img.icons8.com/color/96/pill.png"
    },
    {
      title: {
        ar: "⏰ التذكيرات الذكية",
        en: "⏰ Smart Reminders"
      },
      description: {
        ar: "احصل على تذكيرات ذكية لمواعيد أدويتك ومدة العلاج بالاعتماد على مصادر موثوقة. يجب الرجوع دائماً لإرشادات وتوجيهات طبيبك المعالج",
        en: "Get smart reminders for your medications and treatment duration based on reliable sources. Always refer to your treating doctor's instructions and guidance"
      },
      icon: "⏰",
      highlight: "bottom-nav-reminders",
      image: "https://img.icons8.com/color/96/alarm-clock--v1.png"
    },
    {
      title: {
        ar: "👤 الملف الشخصي",
        en: "👤 Profile"
      },
      description: {
        ar: "أضف معلوماتك الصحية (الوزن، الطول، العمر، الجنس) لتحصل على توصيات صحية مخصصة وحساب مؤشر كتلة الجسم (BMI) تلقائياً",
        en: "Add your health information (weight, height, age, gender) to get personalized health recommendations and automatic BMI calculation"
      },
      icon: "👤",
      highlight: "bottom-nav-profile",
      image: "https://img.icons8.com/color/96/user.png"
    },
    {
      title: {
        ar: "✨ كل شيء جاهز!",
        en: "✨ All Set!"
      },
      description: {
        ar: "الآن أنت جاهز لبدء استخدام PharmaPal! ابدأ بإضافة أول دواء لك عن طريق الكاميرا أو البحث في قائمة الأدوية المسجلة",
        en: "You're now ready to start using PharmaPal! Start by adding your first medication using the camera or searching the registered medications"
      },
      icon: "🎊",
      highlight: null,
      image: "https://img.icons8.com/color/96/checkmark--v1.png"
    }
  ];

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Save to localStorage that user has seen the tour
    localStorage.setItem('tourCompleted', 'true');
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem('tourCompleted', 'skipped');
    onClose();
  };

  if (!isOpen) return null;

  const step = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card className="max-w-lg w-full shadow-2xl border-4 border-emerald-200">
        <CardContent className="p-6">
          {/* Close Button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Step Counter */}
          <div className="text-center mb-4">
            <span className="text-sm font-semibold text-gray-500">
              {language === 'ar' 
                ? `الخطوة ${currentStep + 1} من ${tourSteps.length}` 
                : `Step ${currentStep + 1} of ${tourSteps.length}`}
            </span>
          </div>

          {/* Icon/Image */}
          <div className="flex justify-center mb-6">
            {step.image ? (
              <img src={step.image} alt={step.title[language]} className="w-24 h-24" />
            ) : (
              <div className="text-7xl">{step.icon}</div>
            )}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
            {step.title[language]}
          </h2>

          {/* Description */}
          <p className="text-center text-gray-600 leading-relaxed mb-8 px-4">
            {step.description[language]}
          </p>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <Button
                onClick={handlePrevious}
                variant="outline"
                className="flex-1"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                {language === 'ar' ? 'السابق' : 'Previous'}
              </Button>
            )}
            
            {currentStep < tourSteps.length - 1 ? (
              <Button
                onClick={handleNext}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
              >
                {language === 'ar' ? 'التالي' : 'Next'}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
              >
                {language === 'ar' ? '✨ ابدأ الاستخدام' : '✨ Start Using'}
              </Button>
            )}
          </div>

          {/* Skip Button */}
          {currentStep < tourSteps.length - 1 && (
            <button
              onClick={handleSkip}
              className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
            >
              {language === 'ar' ? 'تخطي الجولة' : 'Skip Tour'}
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppTour;

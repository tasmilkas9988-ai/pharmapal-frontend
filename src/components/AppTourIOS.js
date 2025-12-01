import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

const AppTourIOS = ({ isOpen, onClose, language = 'ar' }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tourSteps = [
    {
      title: {
        ar: "مرحباً بك في PharmaPal",
        en: "Welcome to PharmaPal"
      },
      description: {
        ar: "سنأخذك في جولة سريعة لتتعرف على أهم ميزات التطبيق وكيفية استخدامها بذكاء وسهولة",
        en: "We'll take you on a quick tour to learn about the app's main features and how to use them smartly"
      },
      icon: "🎉"
    },
    {
      title: {
        ar: "إضافة دواء جديد",
        en: "Add New Medication"
      },
      description: {
        ar: "انقر على الزر الأرجواني '+' في الأسفل لإضافة دواء جديد. يمكنك البحث في قائمة الأدوية المسجلة والمعتمدة",
        en: "Click the purple '+' button at the bottom to add a new medication. You can search the registered and approved medications database"
      },
      icon: "➕"
    },
    {
      title: {
        ar: "التعرف الذكي بالكاميرا",
        en: "Smart Camera Recognition"
      },
      description: {
        ar: "التقط صورة لعبوة الدواء باستخدام الكاميرا، وسيقوم الذكاء الاصطناعي بالتعرف على الدواء وعرض تفاصيله",
        en: "Capture an image of the medication package using the camera, and AI will recognize it and display its details"
      },
      icon: "📸"
    },
    {
      title: {
        ar: "قائمة أدويتي",
        en: "My Medications"
      },
      description: {
        ar: "اعرض جميع أدويتك في مكان واحد مع جميع التفاصيل. انقر على 'الأدوية' في الشريط السفلي",
        en: "View all your medications in one place with complete details. Click 'Medicines' in the bottom bar"
      },
      icon: "💊"
    },
    {
      title: {
        ar: "التذكيرات الذكية",
        en: "Smart Reminders"
      },
      description: {
        ar: "احصل على تذكيرات ذكية لمواعيد أدويتك. يجب الرجوع دائماً لإرشادات طبيبك المعالج",
        en: "Get smart reminders for your medications. Always refer to your doctor's instructions"
      },
      icon: "⏰"
    },
    {
      title: {
        ar: "الملف الشخصي",
        en: "Profile"
      },
      description: {
        ar: "أضف معلوماتك الصحية للحصول على توصيات مخصصة وحساب مؤشر كتلة الجسم تلقائياً",
        en: "Add your health information to get personalized recommendations and automatic BMI calculation"
      },
      icon: "👤"
    },
    {
      title: {
        ar: "كل شيء جاهز!",
        en: "All Set!"
      },
      description: {
        ar: "الآن أنت جاهز لبدء استخدام PharmaPal! ابدأ بإضافة أول دواء لك",
        en: "You're now ready to start using PharmaPal! Start by adding your first medication"
      },
      icon: "✨"
    }
  ];

  const currentStepData = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      handleFinish();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    localStorage.setItem('tourCompleted', 'true');
    localStorage.setItem('welcomeTourSeen', 'true');
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem('tourCompleted', 'true');
    localStorage.setItem('welcomeTourSeen', 'true');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Close Button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 left-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Header with Icon */}
        <div className="bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 px-6 py-12 text-center">
          <div className="text-6xl mb-4">
            {currentStepData.icon}
          </div>
          <h2 className="text-2xl font-bold text-white">
            {currentStepData.title[language]}
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          <p className="text-center text-gray-700 text-base leading-relaxed mb-8">
            {currentStepData.description[language]}
          </p>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-6">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-teal-600'
                    : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            {!isFirstStep && (
              <button
                onClick={handlePrevious}
                className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {language === 'ar' ? (
                  <>
                    <span>{language === 'ar' ? 'السابق' : 'Previous'}</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    <ChevronLeft className="w-5 h-5" />
                    <span>Previous</span>
                  </>
                )}
              </button>
            )}
            <button
              onClick={handleNext}
              className={`${
                isFirstStep ? 'w-full' : 'flex-1'
              } py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all active:scale-95 shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2`}
            >
              {language === 'ar' ? (
                <>
                  <ChevronLeft className="w-5 h-5" />
                  <span>{isLastStep ? 'إنهاء' : 'التالي'}</span>
                </>
              ) : (
                <>
                  <span>{isLastStep ? 'Finish' : 'Next'}</span>
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Step Counter */}
          <p className="text-center text-sm text-gray-500 mt-4">
            {language === 'ar'
              ? `${currentStep + 1} من ${tourSteps.length}`
              : `${currentStep + 1} of ${tourSteps.length}`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppTourIOS;
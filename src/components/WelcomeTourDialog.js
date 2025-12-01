import React from 'react';
import { X } from 'lucide-react';

const WelcomeTourDialog = ({ isOpen, onClose, onStartTour, language = 'ar' }) => {
  if (!isOpen) return null;

  const handleStartTour = () => {
    onStartTour();
    onClose();
  };

  const handleSkip = () => {
    // Mark as seen even if skipped
    localStorage.setItem('welcomeTourSeen', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-md mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden"
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 px-6 py-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-12 h-12 text-white" fill="currentColor">
              <path d="M4.5 12.75a6 6 0 0 1 11.85-1.35l-6.19 6.19a6 6 0 0 1-5.66-4.84Zm12.65 1.45a6 6 0 0 1-11.85 1.35l6.19-6.19a6 6 0 0 1 5.66 4.84Z" opacity="0.9"/>
              <path d="M12 6v12M6 12h12" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {language === 'ar' ? 'أهلاً بك في PharmaPal' : 'Welcome to PharmaPal'}
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-center text-gray-700 text-base leading-relaxed mb-6">
            {language === 'ar'
              ? 'حتى تتعرف على ميزات التطبيق اسمح لي بأخذك في جولة إرشادية بسيطة'
              : 'To learn about the app features, allow me to take you on a simple guided tour'}
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleStartTour}
              className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all active:scale-95 shadow-lg shadow-teal-600/30"
            >
              {language === 'ar' ? 'نعم، ابدأ الجولة' : 'Yes, Start Tour'}
            </button>
            <button
              onClick={handleSkip}
              className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all active:scale-95"
            >
              {language === 'ar' ? 'لا، شكراً' : 'No, Thanks'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeTourDialog;
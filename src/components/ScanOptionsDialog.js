import React from 'react';
import { Camera, Image as ImageIcon, X } from 'lucide-react';

/**
 * ScanOptionsDialog - نافذة خيارات المسح بأسلوب iOS
 */
const ScanOptionsDialog = ({ isOpen, onClose, onSelectCamera, onSelectGallery, language = "ar" }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 animate-fadeIn"
      onClick={onClose}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* iOS-style action sheet */}
      <div 
        className="bg-white/95 backdrop-blur-xl rounded-t-[28px] sm:rounded-[28px] shadow-2xl w-full sm:max-w-md mx-0 sm:mx-4 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with icon and title */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {language === "ar" ? "مسح الدواء" : "Scan Medication"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <p className="text-sm text-gray-600">
            {language === "ar" 
              ? "اختر طريقة مسح الدواء"
              : "Choose how to scan the medication"}
          </p>
        </div>

        {/* iOS-style list options */}
        <div className="px-4 pb-4">
          <div className="bg-gray-50 rounded-2xl overflow-hidden">
            {/* Camera Option */}
            <button
              onClick={() => {
                onSelectCamera();
                onClose();
              }}
              className="w-full p-4 flex items-center gap-4 hover:bg-gray-100 active:bg-gray-200 transition-colors border-b border-gray-200"
            >
              <div className="w-11 h-11 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div className={`flex-1 ${language === "ar" ? "text-right" : "text-left"}`}>
                <p className="text-base font-medium text-gray-900">
                  {language === "ar" ? "التقط صورة" : "Take Photo"}
                </p>
                <p className="text-sm text-gray-500">
                  {language === "ar" ? "استخدم الكاميرا مباشرة" : "Use camera directly"}
                </p>
              </div>
            </button>

            {/* Gallery Option */}
            <button
              onClick={() => {
                onSelectGallery();
                onClose();
              }}
              className="w-full p-4 flex items-center gap-4 hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <div className="w-11 h-11 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex-1 ${language === "ar" ? "text-right" : "text-left"}`}>
                <p className="text-base font-medium text-gray-900">
                  {language === "ar" ? "اختر من المعرض" : "Choose from Gallery"}
                </p>
                <p className="text-sm text-gray-500">
                  {language === "ar" ? "اختر صورة موجودة" : "Select existing photo"}
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* iOS-style Cancel Button */}
        <div className="px-4 pb-6 sm:pb-4">
          <button
            onClick={onClose}
            className="w-full bg-white hover:bg-gray-50 active:bg-gray-100 text-blue-500 rounded-2xl p-4 font-semibold text-base transition-colors border border-gray-200 shadow-sm"
          >
            {language === "ar" ? "إلغاء" : "Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanOptionsDialog;

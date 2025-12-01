import React, { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Pill, Plus, Bell, User, Search, Camera, X } from 'lucide-react';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAddOptions, setShowAddOptions] = useState(false);

  const tabs = [
    { 
      id: 'home', 
      label: 'الرئيسية', 
      labelEn: 'Home',
      path: '/dashboard', 
      icon: Home,
      color: 'emerald'
    },
    { 
      id: 'medicines', 
      label: 'الأدوية', 
      labelEn: 'Medicines',
      path: '/medicines', 
      icon: Pill,
      color: 'blue'
    },
    { 
      id: 'add', 
      label: 'إضافة', 
      labelEn: 'Add',
      path: null, 
      icon: Plus,
      isCenter: true,
      color: 'purple'
    },
    { 
      id: 'reminders', 
      label: 'التذكيرات', 
      labelEn: 'Reminders',
      path: '/reminders', 
      icon: Bell,
      color: 'orange'
    },
    { 
      id: 'settings', 
      label: 'الإعدادات', 
      labelEn: 'Settings',
      path: '/settings', 
      icon: User,
      color: 'teal'
    }
  ];

  const language = localStorage.getItem('preferredLanguage') || 'ar';

  const isActive = (path) => {
    if (!path) return false;
    return location.pathname === path;
  };

  const handleNavClick = useCallback((tab) => {
    console.log('🎯 [BottomNav] Tab clicked:', tab.id, '|', tab.label);
    
    if (tab.isCenter) {
      console.log('➕ [BottomNav] Center button clicked - opening modal');
      setShowAddOptions(true);
    } else if (tab.path) {
      console.log('📍 [BottomNav] Navigating to:', tab.path);
      navigate(tab.path);
    }
  }, [navigate]);

  const handleSearchInDatabase = useCallback(() => {
    console.log('🔍 [BottomNav] Search in database clicked');
    setShowAddOptions(false);
    
    setTimeout(() => {
      console.log('📤 [BottomNav] Dispatching openAddMedication event with method: search');
      const event = new CustomEvent('openAddMedication', { 
        detail: { method: 'search' },
        bubbles: true,
        cancelable: true
      });
      window.dispatchEvent(event);
      console.log('✅ [BottomNav] Event dispatched successfully');
    }, 100);
  }, []);

  const handleScanImage = useCallback(() => {
    console.log('📷 [BottomNav] Scan image clicked');
    setShowAddOptions(false);
    
    setTimeout(() => {
      console.log('📤 [BottomNav] Dispatching openAddMedication event with method: scan');
      const event = new CustomEvent('openAddMedication', { 
        detail: { method: 'scan' },
        bubbles: true,
        cancelable: true
      });
      window.dispatchEvent(event);
      console.log('✅ [BottomNav] Event dispatched successfully');
    }, 100);
  }, []);

  return (
    <>
      {/* Add Options Modal - iOS Style */}
      {showAddOptions && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 animate-fadeIn" 
          onClick={(e) => {
            console.log('🔙 Backdrop clicked, closing modal');
            e.stopPropagation();
            setShowAddOptions(false);
          }}
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        >
          <div 
            className="bg-white/95 backdrop-blur-xl rounded-t-[28px] sm:rounded-[28px] shadow-2xl w-full sm:max-w-md mx-0 sm:mx-4 overflow-hidden animate-slideUp" 
            onClick={(e) => {
              e.stopPropagation();
              console.log('📦 Modal content clicked');
            }}
          >
            {/* iOS-style Header */}
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {language === 'ar' ? 'إضافة دواء' : 'Add Medication'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddOptions(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <p className="text-sm text-gray-600">
                {language === 'ar' 
                  ? 'اختر طريقة إضافة الدواء' 
                  : 'Choose how to add medication'}
              </p>
            </div>
            
            {/* iOS-style Options List */}
            <div className="px-4 pb-4">
              <div className="bg-gray-50 rounded-2xl overflow-hidden">
                {/* Option 1: Search in Database */}
                <button
                  onClick={handleSearchInDatabase}
                  className="w-full p-4 flex items-center gap-4 hover:bg-gray-100 active:bg-gray-200 transition-colors border-b border-gray-200"
                >
                  <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <Search className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div className={`flex-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    <h4 className="font-medium text-gray-900 text-base">
                      {language === 'ar' ? 'البحث في قاعدة الأدوية المسجلة' : 'Search Registered Medications'}
                    </h4>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {language === 'ar' ? 'ابحث عن دوائك في قاعدة بيانات الهيئة' : 'Search in SFDA database'}
                    </p>
                  </div>
                </button>

                {/* Option 2: Scan Image */}
                <button
                  onClick={handleScanImage}
                  className="w-full p-4 flex items-center gap-4 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                >
                  <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <Camera className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div className={`flex-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    <h4 className="font-medium text-gray-900 text-base">
                      {language === 'ar' ? 'التقاط صورة أو اختيار من المعرض' : 'Scan or Upload Image'}
                    </h4>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {language === 'ar' ? 'التقط صورة للدواء أو اختر من معرض الصور' : 'Take a photo or choose from gallery'}
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* iOS-style Cancel Button */}
            <div className="px-4 pb-6 sm:pb-4">
              <button
                onClick={() => setShowAddOptions(false)}
                className="w-full bg-white hover:bg-gray-50 active:bg-gray-100 text-blue-500 rounded-2xl p-4 font-semibold text-base transition-colors border border-gray-200 shadow-sm"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="max-w-lg mx-auto px-2 pb-safe">
          <div className="grid py-2 relative items-end" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr' }}>
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const active = isActive(tab.path);
              
              if (tab.isCenter) {
                return (
                  <div key={tab.id} className="relative -top-6 flex justify-center items-center w-full">
                    <button
                      onClick={() => handleNavClick(tab)}
                      className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg hover:shadow-xl active:scale-95 transform transition-all duration-200 flex items-center justify-center group flex-shrink-0"
                      aria-label={language === 'ar' ? tab.label : tab.labelEn}
                    >
                      <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                        <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                          {language === 'ar' ? tab.label : tab.labelEn}
                        </span>
                      </div>
                    </button>
                  </div>
                );
              }

            return (
              <div key={tab.id} className="flex justify-center items-center w-full">
                <button
                  onClick={() => handleNavClick(tab)}
                  className={`flex flex-col items-center justify-center py-2 w-16 rounded-xl transition-all duration-200 flex-shrink-0 ${
                    active 
                      ? 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  aria-label={language === 'ar' ? tab.label : tab.labelEn}
                >
                <div className={`relative transition-transform duration-200 ${active ? 'scale-110' : ''}`}>
                  <Icon 
                    className={`w-6 h-6 transition-colors duration-200 ${
                      active 
                        ? `text-${tab.color}-600 dark:text-${tab.color}-400` 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                    strokeWidth={active ? 2.5 : 2}
                    fill={active ? 'currentColor' : 'none'}
                  />
                  {active && (
                    <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-${tab.color}-600 dark:bg-${tab.color}-400`}></div>
                  )}
                </div>
                <span className={`text-[10px] mt-1 font-medium transition-colors duration-200 ${
                  active 
                    ? `text-${tab.color}-700 dark:text-${tab.color}-300` 
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {language === 'ar' ? tab.label : tab.labelEn}
                </span>
                </button>
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomNav;

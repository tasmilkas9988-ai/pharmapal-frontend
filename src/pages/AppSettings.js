import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft,
  ChevronRight,
  Bell,
  Moon,
  Sun,
  Type
} from 'lucide-react';
import { toast } from 'sonner';
import BottomNav from '../components/BottomNav';

const AppSettings = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState(
    localStorage.getItem('preferredLanguage') || 'ar'
  );
  
  // Notification Settings
  const [medicationReminders, setMedicationReminders] = useState(
    localStorage.getItem('notif_medication_reminders') !== 'false'
  );
  const [generalNotifications, setGeneralNotifications] = useState(
    localStorage.getItem('notif_general') !== 'false'
  );
  const [soundEnabled, setSoundEnabled] = useState(
    localStorage.getItem('notif_sound') !== 'false'
  );
  
  // Notification Sound/Tone
  const [notificationTone, setNotificationTone] = useState(
    localStorage.getItem('notification_tone') || 'gentle_chime'
  );
  const [showToneSelector, setShowToneSelector] = useState(false);
  
  // Available notification tones for medical app
  const notificationTones = [
    { 
      id: 'gentle_chime', 
      nameAr: 'جرس هادئ', 
      nameEn: 'Gentle Chime',
      description_ar: 'نغمة لطيفة وهادئة',
      description_en: 'Soft and calming tone',
      icon: '🔔'
    },
    { 
      id: 'soft_bell', 
      nameAr: 'جرس ناعم', 
      nameEn: 'Soft Bell',
      description_ar: 'جرس ناعم وواضح',
      description_en: 'Clear and gentle bell',
      icon: '🎐'
    },
    { 
      id: 'calm_tone', 
      nameAr: 'نغمة هادئة', 
      nameEn: 'Calm Tone',
      description_ar: 'نغمة مريحة للأعصاب',
      description_en: 'Soothing and relaxing',
      icon: '🎵'
    },
    { 
      id: 'medical_beep', 
      nameAr: 'صفارة طبية', 
      nameEn: 'Medical Beep',
      description_ar: 'صوت تنبيه طبي احترافي',
      description_en: 'Professional medical alert',
      icon: '⚕️'
    },
    { 
      id: 'peaceful_melody', 
      nameAr: 'لحن هادئ', 
      nameEn: 'Peaceful Melody',
      description_ar: 'لحن موسيقي مريح',
      description_en: 'Relaxing musical tone',
      icon: '🎼'
    }
  ];
  
  // Dark Mode
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  );
  
  // Text Size
  const [textSize, setTextSize] = useState(
    localStorage.getItem('textSize') || 'medium'
  );

  useEffect(() => {
    // Ensure dark mode is always disabled in settings pages
    document.documentElement.classList.remove('dark');
    setDarkMode(false);
    localStorage.setItem('darkMode', 'false');
  }, []);

  const handleMedicationRemindersToggle = () => {
    const newValue = !medicationReminders;
    setMedicationReminders(newValue);
    localStorage.setItem('notif_medication_reminders', newValue.toString());
    toast.success(
      language === 'ar'
        ? newValue ? 'تم تفعيل تذكيرات الأدوية' : 'تم تعطيل تذكيرات الأدوية'
        : newValue ? 'Medication reminders enabled' : 'Medication reminders disabled'
    );
  };

  const handleGeneralNotificationsToggle = () => {
    const newValue = !generalNotifications;
    setGeneralNotifications(newValue);
    localStorage.setItem('notif_general', newValue.toString());
    toast.success(
      language === 'ar'
        ? newValue ? 'تم تفعيل الإشعارات العامة' : 'تم تعطيل الإشعارات العامة'
        : newValue ? 'General notifications enabled' : 'General notifications disabled'
    );
  };

  const handleSoundToggle = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem('notif_sound', newValue.toString());
    toast.success(
      language === 'ar'
        ? newValue ? 'تم تفعيل الصوت' : 'تم تعطيل الصوت'
        : newValue ? 'Sound enabled' : 'Sound disabled'
    );
  };

  const handleToneChange = (toneId) => {
    setNotificationTone(toneId);
    localStorage.setItem('notification_tone', toneId);
    
    // Play the selected tone
    playNotificationTone(toneId);
    
    toast.success(
      language === 'ar'
        ? 'تم تغيير نغمة التنبيه'
        : 'Notification tone changed'
    );
  };

  const playNotificationTone = (toneId) => {
    // Create different tones using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Set tone characteristics based on selection
    switch(toneId) {
      case 'gentle_chime':
        oscillator.frequency.value = 800;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
        oscillator.type = 'sine';
        break;
      case 'soft_bell':
        oscillator.frequency.value = 1000;
        gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
        oscillator.type = 'triangle';
        break;
      case 'calm_tone':
        oscillator.frequency.value = 600;
        gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.2);
        oscillator.type = 'sine';
        break;
      case 'medical_beep':
        oscillator.frequency.value = 1200;
        gainNode.gain.setValueAtTime(0.35, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        oscillator.type = 'square';
        break;
      case 'peaceful_melody':
        oscillator.frequency.value = 700;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
        oscillator.type = 'triangle';
        break;
      default:
        oscillator.frequency.value = 800;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        oscillator.type = 'sine';
    }
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1.5);
  };

  const handleDarkModeToggle = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem('darkMode', newValue.toString());
    toast.success(
      language === 'ar'
        ? newValue ? 'تم تفعيل الوضع الداكن' : 'تم تعطيل الوضع الداكن'
        : newValue ? 'Dark mode enabled' : 'Dark mode disabled'
    );
  };

  const handleTextSizeChange = (size) => {
    setTextSize(size);
    localStorage.setItem('textSize', size);
    
    // Apply text size to root element
    const root = document.documentElement;
    root.classList.remove('text-small', 'text-medium', 'text-large');
    root.classList.add(`text-${size}`);
    
    toast.success(
      language === 'ar'
        ? `تم تغيير حجم النص إلى ${size === 'small' ? 'صغير' : size === 'large' ? 'كبير' : 'متوسط'}`
        : `Text size changed to ${size}`
    );
  };

  // iOS-style Toggle Switch Component
  const ToggleSwitch = ({ checked, onChange, label, sublabel }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <p className="text-[15px] font-normal text-gray-900">
          {label}
        </p>
        {sublabel && (
          <p className="text-xs text-gray-500 mt-0.5">
            {sublabel}
          </p>
        )}
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
          checked ? 'bg-emerald-500' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
            checked ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div 
      className="min-h-screen bg-gray-50 pb-20"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/settings')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {language === 'ar' ? (
                <ChevronRight className="w-6 h-6 text-gray-600" />
              ) : (
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              )}
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              {language === 'ar' ? 'إعدادات التطبيق' : 'App Settings'}
            </h1>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="max-w-4xl mx-auto px-4 mt-5 space-y-4">
        
        {/* Notification Settings Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                <Bell className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-base font-semibold text-gray-900">
                {language === 'ar' ? 'إعدادات الإشعارات' : 'Notification Settings'}
              </h2>
            </div>
          </div>
          <div className="px-4 divide-y divide-gray-100">
            <ToggleSwitch
              checked={medicationReminders}
              onChange={handleMedicationRemindersToggle}
              label={language === 'ar' ? 'تذكيرات الأدوية' : 'Medication Reminders'}
              sublabel={language === 'ar' ? 'إشعارات لمواعيد تناول الأدوية' : 'Notifications for medication times'}
            />
            <ToggleSwitch
              checked={generalNotifications}
              onChange={handleGeneralNotificationsToggle}
              label={language === 'ar' ? 'الإشعارات العامة' : 'General Notifications'}
              sublabel={language === 'ar' ? 'تحديثات وأخبار التطبيق' : 'App updates and news'}
            />
            <ToggleSwitch
              checked={soundEnabled}
              onChange={handleSoundToggle}
              label={language === 'ar' ? 'الصوت' : 'Sound'}
              sublabel={language === 'ar' ? 'تشغيل الصوت مع الإشعارات' : 'Play sound with notifications'}
            />
            
            {/* Notification Tone Selector */}
            {soundEnabled && (
              <div className="mt-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                <button
                  onClick={() => setShowToneSelector(!showToneSelector)}
                  className="w-full flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                      <span className="text-xl">🎵</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {language === 'ar' ? 'نغمة التنبيه' : 'Notification Tone'}
                      </p>
                      <p className="text-xs text-gray-600">
                        {notificationTones.find(t => t.id === notificationTone)?.[language === 'ar' ? 'nameAr' : 'nameEn']}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${showToneSelector ? 'rotate-90' : ''}`} />
                </button>
                
                {/* Tone Options */}
                {showToneSelector && (
                  <div className="mt-3 space-y-2">
                    {notificationTones.map((tone) => (
                      <button
                        key={tone.id}
                        onClick={() => {
                          handleToneChange(tone.id);
                          setShowToneSelector(false);
                        }}
                        className={`w-full p-3 rounded-xl transition-all duration-200 ${
                          notificationTone === tone.id
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                            : 'bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{tone.icon}</span>
                          <div className="flex-1 text-right">
                            <p className={`text-sm font-semibold ${
                              notificationTone === tone.id ? 'text-white' : 'text-gray-900'
                            }`}>
                              {language === 'ar' ? tone.nameAr : tone.nameEn}
                            </p>
                            <p className={`text-xs ${
                              notificationTone === tone.id ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {language === 'ar' ? tone.description_ar : tone.description_en}
                            </p>
                          </div>
                          {notificationTone === tone.id && (
                            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                              <span className="text-blue-600 text-sm">✓</span>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Dark Mode Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                {darkMode ? (
                  <Moon className="w-4 h-4 text-purple-600" />
                ) : (
                  <Sun className="w-4 h-4 text-purple-600" />
                )}
              </div>
              <h2 className="text-base font-semibold text-gray-900">
                {language === 'ar' ? 'المظهر' : 'Appearance'}
              </h2>
            </div>
          </div>
          <div className="px-4">
            <ToggleSwitch
              checked={darkMode}
              onChange={handleDarkModeToggle}
              label={language === 'ar' ? 'الوضع الداكن' : 'Dark Mode'}
              sublabel={language === 'ar' ? 'تفعيل المظهر الداكن للتطبيق' : 'Enable dark theme for the app'}
            />
          </div>
        </div>

        {/* Text Size Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
                <Type className="w-4 h-4 text-orange-600" />
              </div>
              <h2 className="text-base font-semibold text-gray-900">
                {language === 'ar' ? 'حجم النص' : 'Text Size'}
              </h2>
            </div>
          </div>
          <div className="px-4 py-4">
            <p className="text-sm text-gray-600 mb-4">
              {language === 'ar' ? 'اختر حجم النص المناسب' : 'Choose your preferred text size'}
            </p>
            
            {/* Text Size Preview */}
            <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p 
                className={`text-gray-900 transition-all ${
                  textSize === 'small' ? 'text-sm' : 
                  textSize === 'large' ? 'text-lg' : 
                  'text-base'
                }`}
              >
                {language === 'ar' ? 'هذا نموذج للنص' : 'This is sample text'}
              </p>
            </div>

            {/* Text Size Options */}
            <div className="space-y-2">
              {['small', 'medium', 'large'].map((size) => (
                <button
                  key={size}
                  onClick={() => handleTextSizeChange(size)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    textSize === size
                      ? 'bg-emerald-50 border-2 border-emerald-500'
                      : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <span className={`font-medium ${
                    textSize === size 
                      ? 'text-emerald-700'
                      : 'text-gray-700'
                  }`}>
                    {language === 'ar' 
                      ? size === 'small' ? 'صغير' : size === 'large' ? 'كبير' : 'متوسط'
                      : size.charAt(0).toUpperCase() + size.slice(1)
                    }
                  </span>
                  {textSize === size && (
                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Info Note */}
        <div className="px-4 py-3 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-xs text-blue-800 text-center">
            {language === 'ar' 
              ? 'سيتم تطبيق الإعدادات فوراً على التطبيق'
              : 'Settings will be applied immediately to the app'
            }
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default AppSettings;

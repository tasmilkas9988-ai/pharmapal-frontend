import React, { useState } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { toast } from 'sonner';

const NotificationPermissionDialog = ({ language, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleEnableNotifications = async () => {
    setIsProcessing(true);
    try {
      // Check if browser supports notifications
      if (!('Notification' in window)) {
        toast.error(
          language === 'ar'
            ? 'المتصفح لا يدعم الإشعارات'
            : 'Browser does not support notifications'
        );
        onClose(false);
        return;
      }

      // Request permission from browser
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        // Save preference
        localStorage.setItem('notifications_enabled', 'true');
        localStorage.setItem('notifications_permission_asked', 'true');
        
        // Show success toast with iOS style
        toast.success(
          language === 'ar' 
            ? '✅ تم تفعيل التذكيرات بنجاح!' 
            : '✅ Reminders enabled successfully!',
          {
            duration: 3000,
            style: {
              background: '#10b981',
              color: 'white',
              borderRadius: '12px',
              padding: '16px',
            }
          }
        );
        
        // Test notification
        new Notification('PharmaPal', {
          body: language === 'ar' 
            ? '🎉 التذكيرات مفعلة! سنرسل لك تذكيرات بمواعيد أدويتك'
            : '🎉 Reminders are on! We\'ll remind you to take your medications',
          icon: '/logo192.png',
          badge: '/logo192.png',
        });
        
        onClose(true);
      } else if (permission === 'denied') {
        toast.error(
          language === 'ar'
            ? 'تم رفض إذن الإشعارات. يمكنك تفعيلها من إعدادات المتصفح.'
            : 'Notification permission denied. You can enable it from browser settings.',
          {
            duration: 5000,
            style: {
              borderRadius: '12px',
            }
          }
        );
        
        localStorage.setItem('notifications_enabled', 'false');
        localStorage.setItem('notifications_permission_asked', 'true');
        onClose(false);
      } else {
        // User dismissed the prompt
        localStorage.setItem('notifications_permission_asked', 'false');
        onClose(false);
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
      toast.error(
        language === 'ar'
          ? 'حدث خطأ في تفعيل التذكيرات'
          : 'Error enabling reminders',
        {
          duration: 3000,
          style: {
            borderRadius: '12px',
          }
        }
      );
      onClose(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('notifications_enabled', 'false');
    localStorage.setItem('notifications_permission_asked', 'true');
    onClose(false);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-200">
        {/* iOS-Style Header */}
        <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 px-6 pt-8 pb-6">
          {/* Close button - iOS style */}
          <button
            onClick={handleSkip}
            className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all backdrop-blur-sm"
            disabled={isProcessing}
          >
            <X size={18} className="text-white" />
          </button>

          {/* Icon - iOS style */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <Bell size={40} className="text-white" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-white mb-2">
            {language === 'ar' ? 'تفعيل التذكيرات' : 'Enable Reminders'}
          </h2>
          
          <p className="text-center text-white/90 text-sm">
            {language === 'ar' 
              ? 'لا تفوت أي جرعة دواء'
              : 'Never miss a medication dose'}
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Description */}
          <p className="text-center text-gray-600 text-[15px] leading-relaxed mb-6">
            {language === 'ar' 
              ? 'احصل على تذكيرات في الوقت المحدد لتناول أدويتك. سنساعدك على الالتزام بخطتك العلاجية.'
              : 'Get timely reminders to take your medications. We\'ll help you stick to your treatment plan.'}
          </p>

          {/* Benefits - iOS style list */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check size={14} className="text-blue-600" />
              </div>
              <span className="text-gray-700 text-[15px]">
                {language === 'ar' 
                  ? 'تذكيرات دقيقة في المواعيد المحددة'
                  : 'Precise reminders at scheduled times'}
              </span>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check size={14} className="text-blue-600" />
              </div>
              <span className="text-gray-700 text-[15px]">
                {language === 'ar' 
                  ? 'تعمل حتى لو كان التطبيق مغلقاً'
                  : 'Works even when app is closed'}
              </span>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check size={14} className="text-blue-600" />
              </div>
              <span className="text-gray-700 text-[15px]">
                {language === 'ar' 
                  ? 'يمكنك التحكم من الإعدادات'
                  : 'Control from settings anytime'}
              </span>
            </div>
          </div>

          {/* Buttons - iOS style */}
          <div className="space-y-3">
            <button
              onClick={handleEnableNotifications}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none active:scale-[0.98]"
            >
              {isProcessing 
                ? (language === 'ar' ? 'جاري التفعيل...' : 'Enabling...')
                : (language === 'ar' ? 'تفعيل التذكيرات' : 'Enable Reminders')}
            </button>
            
            <button
              onClick={handleSkip}
              disabled={isProcessing}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3.5 px-6 rounded-xl transition-all disabled:opacity-50 active:scale-[0.98]"
            >
              {language === 'ar' ? 'ليس الآن' : 'Not Now'}
            </button>
          </div>

          {/* Note - iOS style */}
          <p className="text-xs text-gray-500 text-center mt-5 leading-relaxed">
            {language === 'ar'
              ? 'يمكنك تفعيل أو إلغاء التذكيرات في أي وقت من صفحة الإعدادات'
              : 'You can enable or disable reminders anytime from settings'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationPermissionDialog;

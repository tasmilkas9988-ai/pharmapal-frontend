import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  MessageSquare, 
  FileText, 
  Shield, 
  Settings as SettingsIcon,
  LogOut,
  ChevronRight,
  Bell,
  Search,
  HelpCircle,
  Crown
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import CountdownTimer from '../components/CountdownTimer';
import { toast } from 'sonner';
import axios from 'axios';
import { API } from '../App';

const Settings = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState(
    localStorage.getItem('preferredLanguage') || 'ar'
  );
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    // Disable dark mode in settings pages
    document.documentElement.classList.remove('dark');
    // Fetch unread notifications count
    fetchUnreadNotifications();
  }, []);

  const fetchUnreadNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await axios.get(`${API}/notifications?unread_only=true`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setUnreadNotifications(response.data.unread_count);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleNotificationsClick = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      // Mark all as read
      await axios.post(`${API}/notifications/mark-all-read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUnreadNotifications(0);
      
      toast.success(
        language === 'ar'
          ? 'تم وضع علامة مقروء على جميع الإشعارات'
          : 'All notifications marked as read'
      );
      
      // Navigate to notifications page (we'll create this)
      navigate('/notifications');
    } catch (error) {
      console.error('Error handling notifications:', error);
      toast.error(
        language === 'ar'
          ? 'حدث خطأ في معالجة الإشعارات'
          : 'Error processing notifications'
      );
    }
  };

  const settingsItems = [
    {
      id: 'profile',
      icon: User,
      labelAr: 'الملف الشخصي',
      labelEn: 'Personal Profile',
      path: '/profile',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'premium',
      icon: Crown,
      labelAr: 'الترقية إلى بريميوم',
      labelEn: 'Upgrade to Premium',
      path: '/premium',
      color: 'text-amber-600',
      bgColor: 'bg-gradient-to-r from-amber-50 to-orange-50',
      badge: !user?.is_premium,
      special: true
    },
    {
      id: 'how-to-use',
      icon: HelpCircle,
      labelAr: 'كيف تستخدم التطبيق',
      labelEn: 'How to Use the App',
      path: '/how-to-use',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      id: 'contact',
      icon: MessageSquare,
      labelAr: 'تواصل معنا',
      labelEn: 'Contact Us',
      path: '/contact',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'terms',
      icon: FileText,
      labelAr: 'الشروط والأحكام',
      labelEn: 'Terms and Conditions',
      path: '/terms',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: 'privacy',
      icon: Shield,
      labelAr: 'الخصوصية',
      labelEn: 'Privacy Policy',
      path: '/privacy',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      id: 'app-settings',
      icon: SettingsIcon,
      labelAr: 'الإعدادات',
      labelEn: 'App Settings',
      path: '/app-settings',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('preferredLanguage');
    localStorage.removeItem('termsAccepted');
    setUser(null);
    toast.success(
      language === 'ar'
        ? 'تم تسجيل الخروج بنجاح'
        : 'Logged out successfully'
    );
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      language === 'ar'
        ? 'هل أنت متأكد من حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه وسيتم حذف جميع بياناتك بشكل نهائي.\n\nملاحظة: لن تتمكن من استخدام نفس رقم الجوال مرة أخرى.'
        : 'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.\n\nNote: You will not be able to use the same phone number again.'
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API}/account`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      localStorage.clear();
      setUser(null);
      
      toast.success(
        language === 'ar'
          ? 'تم حذف حسابك بنجاح'
          : 'Account deleted successfully'
      );
      
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error(
        language === 'ar'
          ? 'حدث خطأ أثناء حذف الحساب'
          : 'Error deleting account'
      );
    }
  };

  const handleNavigation = (item) => {
    const path = item.path;
    
    if (path === '/profile') {
      navigate(path);
    } else if (path === '/premium') {
      navigate('/premium');
    } else if (path === '/how-to-use') {
      navigate('/how-to-use');
    } else if (path === '/contact') {
      navigate('/contact');
    } else if (path === '/terms') {
      navigate('/terms');
    } else if (path === '/privacy') {
      navigate('/privacy');
    } else if (path === '/app-settings') {
      navigate('/app-settings');
    } else {
      toast.info(
        language === 'ar'
          ? 'هذه الصفحة قيد التطوير'
          : 'This page is under development'
      );
    }
  };

  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
    localStorage.setItem('preferredLanguage', newLang);
    window.location.reload();
  };

  return (
    <div 
      className="min-h-screen bg-gray-50 pb-20"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* iOS-Style Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Top Action Icons */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={handleNotificationsClick}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <MessageSquare className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <button 
              onClick={toggleLanguage}
              className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              {language === 'ar' ? 'English' : 'العربية'}
            </button>
          </div>

          {/* Countdown Timer */}
          {user?.subscription_end_date && user?.subscription_tier !== 'lifetime' && (
            <div className="mb-4">
              <CountdownTimer 
                endDate={user.subscription_end_date}
                language={language}
                subscriptionTier={user.subscription_tier}
              />
            </div>
          )}

          {/* Welcome Message with App Logo */}
          <div className="flex items-center gap-3">
            {/* App Logo - Pill with cross */}
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden">
              {/* Pill Shape */}
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="currentColor">
                <path d="M4.5 12.75a6 6 0 0 1 11.85-1.35l-6.19 6.19a6 6 0 0 1-5.66-4.84Zm12.65 1.45a6 6 0 0 1-11.85 1.35l6.19-6.19a6 6 0 0 1 5.66 4.84Z" opacity="0.9"/>
                {/* Plus/Cross Icon */}
                <path d="M12 6v12M6 12h12" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                {language === 'ar' ? 'أهلاً' : 'Welcome'}
              </p>
              <h2 className="text-lg font-semibold text-gray-900">
                {user?.full_name || user?.phone || (language === 'ar' ? 'مستخدم' : 'User')}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Settings List - iOS Style */}
      <div className="max-w-4xl mx-auto px-4 mt-5">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          {settingsItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={`
                w-full flex items-center px-4 py-3.5
                hover:bg-gray-50 active:bg-gray-100 transition-colors
                ${index !== settingsItems.length - 1 ? 'border-b border-gray-100' : ''}
              `}
            >
              {/* Chevron - Left side for RTL, right side for LTR */}
              <ChevronRight 
                className={`w-5 h-5 text-gray-400 flex-shrink-0 ${language === 'ar' ? 'rotate-180 order-last ml-3' : 'mr-3'}`} 
              />
              
              {/* Label */}
              <div className="flex-1 flex items-center gap-2">
                <span className={`text-[15px] font-normal text-gray-900 ${item.special ? 'font-semibold' : ''}`}>
                  {language === 'ar' ? item.labelAr : item.labelEn}
                </span>
                {item.badge && (
                  <span className="px-2 py-0.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full">
                    {language === 'ar' ? 'جديد' : 'New'}
                  </span>
                )}
              </div>
              
              {/* Icon */}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${item.bgColor} ${language === 'ar' ? 'order-first mr-3' : 'ml-3'} ${item.special ? 'shadow-md' : ''}`}>
                <item.icon className={`w-[18px] h-[18px] ${item.color}`} />
              </div>
            </button>
          ))}
        </div>

        {/* Logout Button - Separate iOS Style */}
        <div className="mt-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3.5 bg-white rounded-2xl shadow-sm hover:bg-red-50 active:bg-red-100 transition-colors border border-gray-100"
          >
            <ChevronRight 
              className={`w-5 h-5 text-gray-400 flex-shrink-0 ${language === 'ar' ? 'rotate-180 order-last ml-3' : 'mr-3'}`} 
            />
            
            <span className="flex-1 text-[15px] font-normal text-red-600 text-left">
              {language === 'ar' ? 'تسجيل خروج' : 'Logout'}
            </span>
            
            <div className={`w-9 h-9 rounded-full flex items-center justify-center bg-red-50 ${language === 'ar' ? 'order-first mr-3' : 'ml-3'}`}>
              <LogOut className="w-[18px] h-[18px] text-red-600" />
            </div>
          </button>
        </div>

        {/* Delete Account Button - Small and Dangerous */}
        <div className="mt-4 text-center">
          <button
            onClick={handleDeleteAccount}
            className="text-xs text-gray-400 hover:text-red-600 transition-colors px-4 py-2"
          >
            {language === 'ar' ? 'حذف الحساب نهائياً' : 'Delete Account Permanently'}
          </button>
        </div>

        {/* App Version - iOS Style */}
        <div className="mt-6 mb-4 text-center">
          <p className="text-xs text-gray-400 font-medium">
            PharmaPal v1.0.0
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Settings;

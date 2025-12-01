import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

const AdminRoleSelection = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('ar');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') || 'ar';
    setLanguage(storedLanguage);

    // Check if user is actually an admin
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.is_admin) {
      // Not an admin, redirect to dashboard
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSelectRole = async (role) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

    try {
      if (role === 'user') {
        // Activate premium forever
        const response = await axios.post(
          `${BACKEND_URL}/api/admin/activate-premium-self`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          // Update user in localStorage
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          user.is_premium = true;
          user.subscription_status = 'active';
          user.subscription_tier = 'lifetime';
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('admin_role', 'user');

          toast.success(
            language === 'ar'
              ? 'تم تفعيل الميزات المميزة بنجاح! 🎉'
              : 'Premium features activated successfully! 🎉'
          );

          // Force reload to update App.js state
          window.location.href = '/dashboard';
        }
      } else {
        // Admin mode
        localStorage.setItem('admin_role', 'admin');
        
        toast.success(
          language === 'ar'
            ? 'مرحباً بك في لوحة الإدارة! 👨‍💼'
            : 'Welcome to Admin Dashboard! 👨‍💼'
        );

        // Redirect to admin dashboard
        setTimeout(() => navigate('/admin'), 500);
      }
    } catch (error) {
      console.error('Error selecting role:', error);
      toast.error(
        language === 'ar'
          ? 'حدث خطأ، يرجى المحاولة مرة أخرى'
          : 'An error occurred, please try again'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
      }}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-lg mb-4">
            <span className="text-4xl">💊</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            {language === 'ar' ? 'PharmaPal' : 'PharmaPal'}
          </h1>
          <p className="text-white/90 text-lg">
            {language === 'ar'
              ? 'اختر طريقة الدخول'
              : 'Choose Access Mode'}
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="space-y-4">
          {/* User Mode Card */}
          <button
            onClick={() => handleSelectRole('user')}
            disabled={loading}
            className="w-full bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">👤</span>
              </div>
              <div className="flex-1 text-right">
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {language === 'ar' ? 'مستخدم عادي' : 'Regular User'}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'ar'
                    ? 'جميع الميزات المميزة للأبد 🎁'
                    : 'All Premium Features Forever 🎁'}
                </p>
              </div>
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>✓</span>
                <span>
                  {language === 'ar'
                    ? 'جميع الأدوية والتذكيرات'
                    : 'All Medications & Reminders'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <span>✓</span>
                <span>
                  {language === 'ar'
                    ? 'التذكيرات الذكية المتقدمة'
                    : 'Advanced Smart Reminders'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <span>✓</span>
                <span>
                  {language === 'ar' ? 'بدون إعلانات' : 'Ad-free Experience'}
                </span>
              </div>
            </div>
          </button>

          {/* Admin Mode Card */}
          <button
            onClick={() => handleSelectRole('admin')}
            disabled={loading}
            className="w-full bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">👨‍💼</span>
              </div>
              <div className="flex-1 text-right">
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {language === 'ar' ? 'مدير النظام' : 'System Admin'}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'ar'
                    ? 'لوحة الإدارة والتحكم 🛠️'
                    : 'Management Dashboard 🛠️'}
                </p>
              </div>
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>✓</span>
                <span>
                  {language === 'ar'
                    ? 'إدارة المستخدمين'
                    : 'User Management'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <span>✓</span>
                <span>
                  {language === 'ar'
                    ? 'إرسال الإشعارات'
                    : 'Send Notifications'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <span>✓</span>
                <span>
                  {language === 'ar'
                    ? 'الإحصائيات والتقارير'
                    : 'Statistics & Reports'}
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Full Logout */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              localStorage.removeItem('admin_role');
              localStorage.removeItem('termsAccepted');
              navigate('/', { replace: true });
            }}
            className="text-white/90 hover:text-white text-sm underline transition-colors"
          >
            {language === 'ar' ? 'تسجيل خروج كامل' : 'Full Logout'}
          </button>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 text-center">
                {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRoleSelection;

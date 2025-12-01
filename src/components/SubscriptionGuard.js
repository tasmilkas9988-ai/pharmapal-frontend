import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Lock } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
const API = `${BACKEND_URL}/api`;

const SubscriptionGuard = ({ children, user, language = 'ar' }) => {
  const navigate = useNavigate();
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSubscription();
    // Check every minute
    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const checkSubscription = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/subscription/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const status = response.data;
      setSubscriptionStatus(status);

      // Show warning 24 hours before expiry
      if (status.is_active && status.hours_remaining <= 24 && status.hours_remaining > 0) {
        if (status.subscription_tier === 'trial') {
          toast.warning(
            language === 'ar'
              ? `⚠️ تنتهي الفترة التجريبية خلال ${status.hours_remaining} ساعة`
              : `⚠️ Trial period expires in ${status.hours_remaining} hours`,
            { duration: 5000 }
          );
        } else {
          toast.warning(
            language === 'ar'
              ? `⚠️ ينتهي اشتراكك خلال ${status.hours_remaining} ساعة. يرجى التجديد`
              : `⚠️ Your subscription expires in ${status.hours_remaining} hours. Please renew`,
            { duration: 5000 }
          );
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error checking subscription:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>{children}</div>;
  }

  // Skip check for admins with lifetime subscription or users with lifetime tier
  if (user?.is_premium && user?.subscription_tier === 'lifetime') {
    return <div>{children}</div>;
  }

  // Skip check if subscription tier is lifetime (from localStorage)
  if (subscriptionStatus?.subscription_tier === 'lifetime') {
    return <div>{children}</div>;
  }

  // If subscription is not active, show upgrade screen
  if (subscriptionStatus && !subscriptionStatus.is_active) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          {/* Header */}
          <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 px-6 py-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center">
              <Lock className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {language === 'ar' ? 'انتهت صلاحية اشتراكك' : 'Subscription Expired'}
            </h2>
            <p className="text-white/90 text-sm">
              {subscriptionStatus.subscription_tier === 'trial'
                ? (language === 'ar' 
                    ? 'انتهت الفترة التجريبية (48 ساعة). قم بالترقية للاستمرار'
                    : 'Your 48-hour trial has ended. Upgrade to continue')
                : (language === 'ar'
                    ? 'انتهى اشتراكك. قم بالتجديد للوصول إلى جميع الميزات'
                    : 'Your subscription has ended. Renew to access all features')}
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Lock className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-sm text-gray-700">
                  {language === 'ar' 
                    ? 'جميع الميزات معطلة حالياً'
                    : 'All features are currently disabled'}
                </p>
              </div>

              {subscriptionStatus.trial_used && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-xs text-amber-800 text-center">
                    {language === 'ar'
                      ? '⚠️ لقد استخدمت الفترة التجريبية. لا يمكن استخدامها مرة أخرى بنفس رقم الجوال'
                      : '⚠️ You have used your trial period. Cannot be used again with the same phone number'}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('/premium')}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"
            >
              <Crown className="w-5 h-5" />
              <span>{language === 'ar' ? 'عرض خطط الاشتراك' : 'View Subscription Plans'}</span>
            </button>

            <button
              onClick={() => {
                localStorage.clear();
                navigate('/');
              }}
              className="w-full mt-3 py-3 text-gray-600 hover:text-gray-800 text-sm font-medium"
            >
              {language === 'ar' ? 'تسجيل خروج' : 'Logout'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <div>{children}</div>;
};

export default SubscriptionGuard;

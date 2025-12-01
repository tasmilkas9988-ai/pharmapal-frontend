import React, { useState, useEffect } from 'react';
import { Bell, BellOff, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { requestNotificationPermission, onMessageListener, refreshFCMToken, setupVisibilityListener } from '../lib/firebase';

const API = process.env.REACT_APP_BACKEND_URL;

// VAPID Key from Firebase Console
const VAPID_KEY = 'BFoYdKOZQ3gKPel7VauTW5JKYJPwqt_XmzUSBtLRAqApUbhjq8A8gtScmwCMRsYaFhc1qiUgKRjMVK9qXudyTno';

export default function NotificationSetup({ language = 'ar' }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fcmToken, setFcmToken] = useState(null);

  const texts = {
    ar: {
      title: 'تفعيل إشعارات التذكير',
      description: 'احصل على تذكيرات لتناول أدويتك في الوقت المحدد',
      enable: 'تفعيل الإشعارات',
      disable: 'إيقاف الإشعارات',
      enabled: 'الإشعارات مفعلة',
      disabled: 'الإشعارات معطلة',
      testButton: 'إرسال إشعار تجريبي',
      permissionDenied: 'تم رفض أذونات الإشعارات. يرجى تفعيلها من إعدادات المتصفح.',
      success: 'تم تفعيل الإشعارات بنجاح!',
      error: 'حدث خطأ أثناء تفعيل الإشعارات',
      testSent: 'تم إرسال إشعار تجريبي!'
    },
    en: {
      title: 'Enable Medication Reminders',
      description: 'Get reminders to take your medications on time',
      enable: 'Enable Notifications',
      disable: 'Disable Notifications',
      enabled: 'Notifications Enabled',
      disabled: 'Notifications Disabled',
      testButton: 'Send Test Notification',
      permissionDenied: 'Notification permission denied. Please enable it in browser settings.',
      success: 'Notifications enabled successfully!',
      error: 'Error enabling notifications',
      testSent: 'Test notification sent!'
    }
  };

  const t = texts[language];

  useEffect(() => {
    // Check if notifications are already enabled
    checkNotificationStatus();

    // Listen for foreground messages
    onMessageListener((payload) => {
      console.log('Received foreground message:', payload);
      setMessage(t.testSent);
      setTimeout(() => setMessage(''), 3000);
    });

    // Setup visibility change listener for token refresh
    const cleanupVisibilityListener = setupVisibilityListener(async (newToken) => {
      console.log('🔄 Token refreshed on foreground:', newToken.substring(0, 50) + '...');
      
      // Re-register token with backend
      try {
        const authToken = localStorage.getItem('token');
        if (authToken) {
          await axios.post(
            `${API}/api/fcm/register-token`,
            { token: newToken, device_type: 'web' },
            { headers: { Authorization: `Bearer ${authToken}` } }
          );
          
          // Update local state
          localStorage.setItem('fcm_token', newToken);
          setFcmToken(newToken);
          console.log('✅ Token re-registered with backend');
        }
      } catch (error) {
        console.error('❌ Error re-registering token:', error);
      }
    });

    // Cleanup on unmount
    return () => {
      if (cleanupVisibilityListener) {
        cleanupVisibilityListener();
      }
    };
  }, []);

  const checkNotificationStatus = async () => {
    try {
      const token = localStorage.getItem('fcm_token');
      const permission = Notification.permission;
      
      console.log('🔍 Checking notification status:', { 
        hasToken: !!token, 
        permission 
      });
      
      // Only enable if we have BOTH token AND granted permission
      if (token && permission === 'granted') {
        setNotificationsEnabled(true);
        setFcmToken(token);
      } else {
        // Clear inconsistent state
        setNotificationsEnabled(false);
        setFcmToken(null);
        
        // Clean up if permission was revoked
        if (token && permission !== 'granted') {
          localStorage.removeItem('fcm_token');
          console.log('⚠️ Cleared token - permission revoked');
        }
      }
    } catch (error) {
      console.error('Error checking notification status:', error);
      // Reset to safe state on error
      setNotificationsEnabled(false);
      setFcmToken(null);
    }
  };

  const enableNotifications = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      // Check if notifications are supported
      if (!('Notification' in window)) {
        setMessage(language === 'ar' ? 'متصفحك لا يدعم الإشعارات' : 'Your browser does not support notifications');
        setIsLoading(false);
        return;
      }

      // Check if service worker is supported
      if (!('serviceWorker' in navigator)) {
        setMessage(language === 'ar' ? 'متصفحك لا يدعم Service Worker' : 'Your browser does not support Service Worker');
        setIsLoading(false);
        return;
      }

      // Check if VAPID key is set
      if (VAPID_KEY === 'YOUR_VAPID_KEY_HERE') {
        setMessage('VAPID Key not configured. Please add it to NotificationSetup.js');
        setIsLoading(false);
        return;
      }

      console.log('Requesting notification permission...');

      // Request permission and get FCM token
      const token = await requestNotificationPermission();

      console.log('Token received:', token ? 'Yes' : 'No');

      if (!token) {
        setMessage(t.permissionDenied);
        setIsLoading(false);
        return;
      }

      // Register token with backend
      const authToken = localStorage.getItem('token');
      const response = await axios.post(
        `${API}/api/fcm/register-token`,
        {
          token: token,
          device_type: 'web'
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      );

      if (response.data) {
        setFcmToken(token);
        localStorage.setItem('fcm_token', token);
        setNotificationsEnabled(true);
        setMessage(t.success);
        setTimeout(() => setMessage(''), 3000);
      }

    } catch (error) {
      console.error('Error enabling notifications:', error);
      
      // Reset state on error
      setNotificationsEnabled(false);
      setFcmToken(null);
      localStorage.removeItem('fcm_token');
      
      // Show detailed error message
      const errorDetail = error.response?.data?.detail || error.message || 'Unknown error';
      setMessage(t.error + ': ' + errorDetail);
      
      // Keep error message visible longer for user to read
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const disableNotifications = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem('fcm_token');
      const authToken = localStorage.getItem('token');

      if (token) {
        await axios.delete(`${API}/api/fcm/remove-token?token=${token}`, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
      }

      localStorage.removeItem('fcm_token');
      setFcmToken(null);
      setNotificationsEnabled(false);
      setMessage(t.disabled);
      setTimeout(() => setMessage(''), 3000);

    } catch (error) {
      console.error('Error disabling notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestNotification = async (isRetry = false) => {
    setIsLoading(true);

    try {
      const authToken = localStorage.getItem('token');
      await axios.post(
        `${API}/api/fcm/test-notification`,
        {
          title: language === 'ar' ? 'تذكير تجريبي' : 'Test Reminder',
          body: language === 'ar' ? 'هذا إشعار تجريبي من PharmaPal' : 'This is a test notification from PharmaPal'
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      );

      setMessage(t.testSent);
      setTimeout(() => setMessage(''), 3000);

    } catch (error) {
      console.error('Error sending test notification:', error);
      
      // Check if error is due to invalid/stale token
      const errorMessage = error.response?.data?.detail || error.message || '';
      const isTokenError = errorMessage.includes('not found') || 
                          errorMessage.includes('unregistered') ||
                          errorMessage.includes('invalid');
      
      // If token error and not already retried, refresh token and retry
      if (isTokenError && !isRetry) {
        console.log('🔄 Token error detected, refreshing and retrying...');
        
        try {
          // Refresh FCM token
          const newToken = await refreshFCMToken();
          
          // Re-register with backend
          await axios.post(
            `${API}/api/fcm/register-token`,
            { token: newToken, device_type: 'web' },
            { headers: { Authorization: `Bearer ${authToken}` } }
          );
          
          // Update local storage and state
          localStorage.setItem('fcm_token', newToken);
          setFcmToken(newToken);
          
          console.log('✅ Token refreshed, retrying notification...');
          
          // Retry sending notification
          setIsLoading(false);
          return await sendTestNotification(true); // Mark as retry to prevent infinite loop
          
        } catch (refreshError) {
          console.error('❌ Error refreshing token:', refreshError);
          setMessage(language === 'ar' ? 
            'فشل تحديث التوكن. يرجى إعادة تفعيل الإشعارات.' : 
            'Failed to refresh token. Please re-enable notifications.'
          );
        }
      } else {
        setMessage(t.error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-full ${notificationsEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
          {notificationsEnabled ? (
            <Bell className="w-6 h-6 text-green-600" />
          ) : (
            <BellOff className="w-6 h-6 text-gray-600" />
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {t.title}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {t.description}
          </p>

          {message && (
            <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
              message.includes('خطأ') || message.includes('Error') 
                ? 'bg-red-50 text-red-800' 
                : 'bg-green-50 text-green-800'
            }`}>
              {message.includes('خطأ') || message.includes('Error') ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              <span className="text-sm">{message}</span>
            </div>
          )}

          <div className="flex gap-3">
            {!notificationsEnabled ? (
              <button
                onClick={enableNotifications}
                disabled={isLoading}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (language === 'ar' ? 'جاري التحميل...' : 'Loading...') : t.enable}
              </button>
            ) : (
              <>
                <button
                  onClick={sendTestNotification}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t.testButton}
                </button>
                <button
                  onClick={disableNotifications}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t.disable}
                </button>
              </>
            )}
          </div>

          {notificationsEnabled && (
            <p className="text-xs text-green-600 mt-3 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              {t.enabled}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

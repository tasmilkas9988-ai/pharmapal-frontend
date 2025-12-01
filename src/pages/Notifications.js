import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, Trash2, CheckCheck } from 'lucide-react';
import axios from 'axios';
import { API } from '../App';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import BottomNav from '../components/BottomNav';

const Notifications = ({ user }) => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState(
    localStorage.getItem('preferredLanguage') || 'ar'
  );
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const response = await axios.get(`${API}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unread_count);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error(
        language === 'ar'
          ? 'حدث خطأ في تحميل الإشعارات'
          : 'Error loading notifications'
      );
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/notifications/mark-read`, {
        notification_ids: [notificationId]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state
      setNotifications(notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API}/notifications/${notificationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state
      const notification = notifications.find(n => n.id === notificationId);
      setNotifications(notifications.filter(n => n.id !== notificationId));
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      toast.success(
        language === 'ar'
          ? 'تم حذف الإشعار'
          : 'Notification deleted'
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error(
        language === 'ar'
          ? 'حدث خطأ في حذف الإشعار'
          : 'Error deleting notification'
      );
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/notifications/mark-all-read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);

      toast.success(
        language === 'ar'
          ? 'تم وضع علامة مقروء على جميع الإشعارات'
          : 'All notifications marked as read'
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'reminder':
        return '⏰';
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      default:
        return 'ℹ️';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'reminder':
        return 'from-blue-50 to-cyan-50 border-blue-200';
      case 'warning':
        return 'from-amber-50 to-yellow-50 border-amber-200';
      case 'success':
        return 'from-green-50 to-emerald-50 border-green-200';
      default:
        return 'from-gray-50 to-slate-50 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) {
      return language === 'ar' ? 'الآن' : 'Now';
    } else if (minutes < 60) {
      return language === 'ar' ? `منذ ${minutes} دقيقة` : `${minutes}m ago`;
    } else if (hours < 24) {
      return language === 'ar' ? `منذ ${hours} ساعة` : `${hours}h ago`;
    } else if (days < 7) {
      return language === 'ar' ? `منذ ${days} يوم` : `${days}d ago`;
    } else {
      return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* iOS-style Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/settings')}
            className={`flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors mb-3 ${language === 'ar' ? 'mr-auto' : 'ml-0'}`}
          >
            <ChevronLeft className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
            <span className="font-medium">{language === 'ar' ? 'الإعدادات' : 'Settings'}</span>
          </button>

          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {language === 'ar' ? 'الإشعارات' : 'Notifications'}
                </h1>
                <p className="text-sm text-gray-600">
                  {unreadCount > 0
                    ? (language === 'ar' ? `${unreadCount} غير مقروء` : `${unreadCount} unread`)
                    : (language === 'ar' ? 'لا توجد إشعارات جديدة' : 'No new notifications')}
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                variant="ghost"
                size="sm"
                className="text-blue-600"
              >
                <CheckCheck className="w-5 h-5 mr-1" />
                {language === 'ar' ? 'قراءة الكل' : 'Read All'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
            <p className="text-gray-600 font-medium">
              {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
            </p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {language === 'ar' ? 'لا توجد إشعارات' : 'No notifications'}
            </h3>
            <p className="text-gray-600">
              {language === 'ar'
                ? 'ستظهر الإشعارات هنا عندما تتوفر'
                : 'Notifications will appear here when available'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-gradient-to-br ${getNotificationColor(notification.type)} rounded-2xl p-4 shadow-sm border ${!notification.read ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-base font-semibold text-gray-900">
                        {notification.title}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed mb-2">
                      {notification.body}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        {formatDate(notification.created_at)}
                      </p>
                      {!notification.read && (
                        <span className="text-xs font-semibold text-blue-600">
                          {language === 'ar' ? 'جديد' : 'New'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav user={user} />
    </div>
  );
};

export default Notifications;

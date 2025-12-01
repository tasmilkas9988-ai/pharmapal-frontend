import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Users, Bell, BarChart3, Send, ChevronRight, 
  CheckCircle, AlertTriangle, Info, Clock, LogOut, Settings
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
const API = `${BACKEND_URL}/api`;

const AdminDashboard = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [language] = useState(localStorage.getItem("preferredLanguage") || user?.language || "ar");
  
  const [stats, setStats] = useState({
    total_users: 0,
    total_medications: 0,
    total_reminders: 0,
    total_notifications: 0
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Active tab
  const [activeTab, setActiveTab] = useState('overview');
  
  // Notifications Management
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    body: '',
    type: 'info',
    target: 'all',
    userId: ''
  });
  const [sendingNotification, setSendingNotification] = useState(false);
  const [sentNotifications, setSentNotifications] = useState([]);
  const [notificationStats, setNotificationStats] = useState({
    total_sent: 0,
    total_read: 0,
    total_unread: 0
  });

  // Check if user is admin
  useEffect(() => {
    if (!user?.is_admin) {
      navigate('/dashboard');
      toast.error(language === 'ar' ? 'غير مصرح لك بالدخول' : 'Unauthorized access');
    } else {
      fetchStats();
      fetchUsers();
      fetchNotificationStats();
    }
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchNotificationStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/admin/notifications/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotificationStats(response.data);
      setSentNotifications(response.data.recent_notifications || []);
    } catch (error) {
      console.error('Error fetching notification stats:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm(
      language === 'ar'
        ? 'هل أنت متأكد من حذف هذا المستخدم؟ سيتم حذف جميع بياناته نهائياً.'
        : 'Are you sure you want to delete this user? All their data will be permanently deleted.'
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(
        language === 'ar'
          ? 'تم حذف المستخدم بنجاح'
          : 'User deleted successfully'
      );

      // Refresh users list
      fetchUsers();
      fetchStats();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(
        language === 'ar'
          ? 'حدث خطأ أثناء حذف المستخدم'
          : 'Error deleting user'
      );
    }
  };

  const sendNotification = async () => {
    if (!notificationForm.title || !notificationForm.body) {
      toast.error(language === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill all fields');
      return;
    }

    if (notificationForm.target === 'specific' && !notificationForm.userId) {
      toast.error(language === 'ar' ? 'يرجى اختيار مستخدم' : 'Please select a user');
      return;
    }

    setSendingNotification(true);
    try {
      const token = localStorage.getItem('token');
      const endpoint = notificationForm.target === 'all' 
        ? `${API}/admin/notifications/broadcast`
        : `${API}/admin/notifications/send`;

      const payload = notificationForm.target === 'all'
        ? {
            title: notificationForm.title,
            body: notificationForm.body,
            type: notificationForm.type
          }
        : {
            user_id: notificationForm.userId,
            title: notificationForm.title,
            body: notificationForm.body,
            type: notificationForm.type
          };

      await axios.post(endpoint, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(
        language === 'ar' 
          ? 'تم إرسال الإشعار بنجاح!' 
          : 'Notification sent successfully!'
      );

      // Reset form
      setNotificationForm({
        title: '',
        body: '',
        type: 'info',
        target: 'all',
        userId: ''
      });

      // Refresh stats
      fetchNotificationStats();
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error(
        language === 'ar' 
          ? 'حدث خطأ في إرسال الإشعار' 
          : 'Error sending notification'
      );
    } finally {
      setSendingNotification(false);
    }
  };

  const handleLogout = () => {
    // Admin logout from admin dashboard: go back to role selection
    localStorage.removeItem('admin_role');
    navigate('/admin-role-selection', { replace: true });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-[18px] h-[18px]" />;
      case 'warning': return <AlertTriangle className="w-[18px] h-[18px]" />;
      case 'reminder': return <Clock className="w-[18px] h-[18px]" />;
      default: return <Info className="w-[18px] h-[18px]" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return { text: 'text-emerald-600', bg: 'bg-emerald-50' };
      case 'warning': return { text: 'text-orange-600', bg: 'bg-orange-50' };
      case 'reminder': return { text: 'text-blue-600', bg: 'bg-blue-50' };
      default: return { text: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-gray-600 font-medium">
            {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* iOS-Style Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Top Action Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'لوحة التحكم' : 'Admin Panel'}
                </p>
                <h2 className="text-lg font-semibold text-gray-900">
                  {user?.full_name || (language === 'ar' ? 'المسؤول' : 'Administrator')}
                </h2>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  localStorage.removeItem('admin_role');
                  navigate('/admin-role-selection');
                }}
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                {language === 'ar' ? 'تبديل الوضع' : 'Switch Mode'}
              </button>
              
              <button 
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200"
              >
                {language === 'ar' ? 'خروج' : 'Logout'}
              </button>
            </div>
          </div>

          {/* Navigation Tabs - iOS Style */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[
              { id: 'overview', label: language === 'ar' ? 'نظرة عامة' : 'Overview', icon: BarChart3 },
              { id: 'users', label: language === 'ar' ? 'المستخدمين' : 'Users', icon: Users },
              { id: 'notifications', label: language === 'ar' ? 'الإشعارات' : 'Notifications', icon: Bell }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-4xl mx-auto px-4 py-5">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Statistics Cards - iOS Style */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { 
                  label: language === 'ar' ? 'المستخدمين' : 'Users', 
                  value: stats.total_users, 
                  icon: Users,
                  color: 'text-blue-600',
                  bgColor: 'bg-blue-50'
                },
                { 
                  label: language === 'ar' ? 'الأدوية' : 'Medications', 
                  value: stats.total_medications,
                  icon: Bell,
                  color: 'text-emerald-600',
                  bgColor: 'bg-emerald-50'
                },
                { 
                  label: language === 'ar' ? 'التذكيرات' : 'Reminders', 
                  value: stats.total_reminders,
                  icon: Clock,
                  color: 'text-purple-600',
                  bgColor: 'bg-purple-50'
                },
                { 
                  label: language === 'ar' ? 'الإشعارات' : 'Notifications', 
                  value: notificationStats.total_sent,
                  icon: Bell,
                  color: 'text-orange-600',
                  bgColor: 'bg-orange-50'
                }
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.bgColor} mb-3`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900">
                {language === 'ar' ? 'قائمة المستخدمين' : 'Users List'}
              </h3>
              <span className="text-sm text-gray-600">
                {language === 'ar' ? `${users.length} مستخدم` : `${users.length} users`}
              </span>
            </div>

            {users.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {language === 'ar' ? 'لا يوجد مستخدمين' : 'No users found'}
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {users.map((u, index) => (
                  <div
                    key={u.id}
                    className={`flex items-center px-4 py-3.5 ${
                      index !== users.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900 text-[15px]">{u.full_name}</p>
                        {u.is_admin && (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium">
                            {language === 'ar' ? 'مسؤول' : 'Admin'}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{u.phone}</p>
                      {u.last_login && (
                        <p className="text-xs text-gray-400 mt-1">
                          {language === 'ar' ? 'آخر دخول: ' : 'Last login: '}
                          {new Date(u.last_login).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      {language === 'ar' ? 'حذف' : 'Delete'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-5">
            {/* Send Notification Form - iOS Style */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Send className="w-5 h-5 text-purple-600" />
                {language === 'ar' ? 'إرسال إشعار جديد' : 'Send New Notification'}
              </h3>

              <div className="space-y-4">
                {/* Target Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'إرسال إلى' : 'Send To'}
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setNotificationForm({ ...notificationForm, target: 'all' })}
                      className={`flex-1 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                        notificationForm.target === 'all'
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {language === 'ar' ? 'الجميع' : 'All Users'}
                    </button>
                    <button
                      onClick={() => setNotificationForm({ ...notificationForm, target: 'specific' })}
                      className={`flex-1 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                        notificationForm.target === 'specific'
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {language === 'ar' ? 'مستخدم محدد' : 'Specific User'}
                    </button>
                  </div>
                </div>

                {/* User Selection (if specific) */}
                {notificationForm.target === 'specific' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'اختر المستخدم' : 'Select User'}
                    </label>
                    <select
                      value={notificationForm.userId}
                      onChange={(e) => setNotificationForm({ ...notificationForm, userId: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-[15px]"
                    >
                      <option value="">
                        {language === 'ar' ? 'اختر مستخدم' : 'Select a user'}
                      </option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.full_name} - {u.phone}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Notification Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'نوع الإشعار' : 'Notification Type'}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { value: 'info', label: language === 'ar' ? 'معلومة' : 'Info', icon: Info },
                      { value: 'success', label: language === 'ar' ? 'نجاح' : 'Success', icon: CheckCircle },
                      { value: 'warning', label: language === 'ar' ? 'تحذير' : 'Warning', icon: AlertTriangle },
                      { value: 'reminder', label: language === 'ar' ? 'تذكير' : 'Reminder', icon: Clock }
                    ].map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setNotificationForm({ ...notificationForm, type: type.value })}
                        className={`px-3 py-2 rounded-xl font-medium text-xs transition-all flex flex-col items-center gap-1 ${
                          notificationForm.type === type.value
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <type.icon className="w-4 h-4" />
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'العنوان' : 'Title'}
                  </label>
                  <Input
                    value={notificationForm.title}
                    onChange={(e) => setNotificationForm({ ...notificationForm, title: e.target.value })}
                    placeholder={language === 'ar' ? 'أدخل عنوان الإشعار' : 'Enter notification title'}
                    className="w-full rounded-xl"
                  />
                </div>

                {/* Body */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الرسالة' : 'Message'}
                  </label>
                  <textarea
                    value={notificationForm.body}
                    onChange={(e) => setNotificationForm({ ...notificationForm, body: e.target.value })}
                    placeholder={language === 'ar' ? 'أدخل نص الإشعار' : 'Enter notification message'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-[15px]"
                    rows="4"
                  />
                </div>

                {/* Send Button */}
                <Button
                  onClick={sendNotification}
                  disabled={sendingNotification}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-3 font-semibold"
                >
                  {sendingNotification ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      {language === 'ar' ? 'جاري الإرسال...' : 'Sending...'}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Send className="w-5 h-5" />
                      {language === 'ar' ? 'إرسال الإشعار' : 'Send Notification'}
                    </div>
                  )}
                </Button>
              </div>
            </div>

            {/* Notification Stats - iOS Style */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { 
                  label: language === 'ar' ? 'مرسل' : 'Sent', 
                  value: notificationStats.total_sent,
                  icon: Send,
                  color: 'text-blue-600',
                  bgColor: 'bg-blue-50'
                },
                { 
                  label: language === 'ar' ? 'مقروء' : 'Read', 
                  value: notificationStats.total_read,
                  icon: CheckCircle,
                  color: 'text-emerald-600',
                  bgColor: 'bg-emerald-50'
                },
                { 
                  label: language === 'ar' ? 'غير مقروء' : 'Unread', 
                  value: notificationStats.total_unread,
                  icon: AlertTriangle,
                  color: 'text-orange-600',
                  bgColor: 'bg-orange-50'
                }
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stat.bgColor} mb-2`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <p className="text-xs text-gray-600 mb-0.5">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Recent Notifications */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                {language === 'ar' ? 'الإشعارات الأخيرة' : 'Recent Notifications'}
              </h3>
              {sentNotifications.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                  <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">
                    {language === 'ar' ? 'لم يتم إرسال إشعارات بعد' : 'No notifications sent yet'}
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  {sentNotifications.map((notif, index) => {
                    const colors = getNotificationColor(notif.type);
                    return (
                      <div
                        key={notif.id}
                        className={`flex items-start gap-3 px-4 py-3.5 ${
                          index !== sentNotifications.length - 1 ? 'border-b border-gray-100' : ''
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${colors.bg}`}>
                          {getNotificationIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-[15px] mb-0.5">{notif.title}</h4>
                          <p className="text-sm text-gray-600 mb-1 line-clamp-2">{notif.body}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(notif.created_at).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

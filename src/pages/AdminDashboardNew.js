import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Users, Activity, Download, TrendingUp, Bell, Settings,
  UserCheck, UserX, Clock, DollarSign, BarChart3, PieChart,
  Mail, MessageSquare, AlertCircle, CheckCircle, ArrowRight,
  RefreshCw, Search, LogOut, Menu, X, Edit, Trash2, Ban,
  Crown, Calendar, Filter, ChevronDown, ChevronUp
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, PieChart as RePieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const AdminDashboardNew = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('ar');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [topMedications, setTopMedications] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, messages, notifications
  const [messages, setMessages] = useState([]);
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    body: '',
    category: 'all'
  });
  const [messageReplyForm, setMessageReplyForm] = useState({
    messageId: null,
    reply: ''
  });
  
  useEffect(() => {
    if (!user?.is_admin) {
      navigate('/dashboard');
      return;
    }
    setLanguage(localStorage.getItem('language') || 'ar');
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const [statsRes, analyticsRes, usersRes, medsRes, messagesRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${BACKEND_URL}/api/admin/analytics`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${BACKEND_URL}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${BACKEND_URL}/api/admin/top-medications`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${BACKEND_URL}/api/admin/contact-messages`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      setStats(statsRes.data.stats);
      setAnalytics(analyticsRes.data);
      setUsers(usersRes.data.users);
      setTopMedications(medsRes.data.medications);
      setMessages(messagesRes.data.messages);
      
    } catch (error) {
      console.error('Error:', error);
      toast.error(language === 'ar' ? 'خطأ في تحميل البيانات' : 'Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async () => {
    if (!notificationForm.title || !notificationForm.body) {
      toast.error(language === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill all fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BACKEND_URL}/api/admin/send-notification-bulk`,
        notificationForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success(language === 'ar' 
        ? `تم إرسال الإشعار لـ ${response.data.count} مستخدم` 
        : `Notification sent to ${response.data.count} users`);
      
      setNotificationForm({ title: '', body: '', category: 'all' });
    } catch (error) {
      toast.error(language === 'ar' ? 'فشل الإرسال' : 'Failed to send');
    }
  };

  const handleUpdateSubscription = async (userId, tier) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${BACKEND_URL}/api/admin/users/${userId}/subscription`,
        { tier },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(language === 'ar' ? 'تم تحديث الاشتراك' : 'Subscription updated');
      fetchDashboardData();
      setShowUserModal(false);
    } catch (error) {
      toast.error(language === 'ar' ? 'فشل التحديث' : 'Update failed');
    }
  };

  const handleDisableUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${BACKEND_URL}/api/admin/users/${userId}/disable`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(language === 'ar' ? 'تم تعطيل الحساب' : 'Account disabled');
      fetchDashboardData();
      setShowUserModal(false);
    } catch (error) {
      toast.error(language === 'ar' ? 'فشل التعطيل' : 'Disable failed');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا المستخدم؟' : 'Delete this user?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BACKEND_URL}/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(language === 'ar' ? 'تم حذف المستخدم' : 'User deleted');
      fetchDashboardData();
      setShowUserModal(false);
    } catch (error) {
      toast.error(language === 'ar' ? 'فشل الحذف' : 'Delete failed');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchSearch = u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       u.phone?.includes(searchTerm);
    
    if (filterActive === 'active') {
      const lastLogin = u.last_login ? new Date(u.last_login) : null;
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return matchSearch && lastLogin && lastLogin > sevenDaysAgo;
    }
    if (filterActive === 'premium') return matchSearch && u.is_premium;
    if (filterActive === 'trial') return matchSearch && u.subscription_tier === 'trial';
    
    return matchSearch;
  });

  const StatCard = ({ icon: Icon, title, value, subtitle, change, color }) => (
    <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        {change !== undefined && (
          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
            change > 0 ? 'bg-green-100 text-green-700' : change < 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
          }`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold text-white">💊</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">PharmaPal</h1>
                <p className="text-xs text-gray-500">{language === 'ar' ? 'لوحة الإدارة' : 'Admin Dashboard'}</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <button onClick={fetchDashboardData} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
              
              <button
                onClick={() => {
                  localStorage.removeItem('admin_role');
                  navigate('/admin-role-selection');
                }}
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                <span className="text-sm font-medium">{language === 'ar' ? 'تبديل' : 'Switch'}</span>
              </button>
            </div>

            <button className="md:hidden p-2" onClick={() => setShowMobileMenu(!showMobileMenu)}>
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          
          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden border-t border-gray-200 py-3 space-y-2">
              <button 
                onClick={fetchDashboardData} 
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {language === 'ar' ? 'تحديث البيانات' : 'Refresh Data'}
                </span>
              </button>
              
              <button
                onClick={() => {
                  localStorage.removeItem('admin_role');
                  navigate('/admin-role-selection');
                }}
                className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors"
              >
                <ArrowRight className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
                <span className="text-sm font-medium">
                  {language === 'ar' ? 'تبديل الوضع' : 'Switch Mode'}
                </span>
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-md mb-6 p-2 flex gap-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              activeTab === 'dashboard' 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <BarChart3 className="w-5 h-5" />
              <span>{language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              activeTab === 'messages' 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <MessageSquare className="w-5 h-5" />
              <span>{language === 'ar' ? 'الرسائل' : 'Messages'}</span>
              {messages.filter(m => !m.is_read).length > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {messages.filter(m => !m.is_read).length}
                </span>
              )}
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              activeTab === 'notifications' 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Bell className="w-5 h-5" />
              <span>{language === 'ar' ? 'الإشعارات' : 'Notifications'}</span>
            </div>
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={Users} title={language === 'ar' ? 'إجمالي المسجلين' : 'Total Registered'} 
            value={analytics?.total_users || 0} color="from-blue-500 to-blue-600" />
          <StatCard icon={UserCheck} title={language === 'ar' ? 'المستخدمون النشطون' : 'Active Users'} 
            value={analytics?.active_users || 0} subtitle={language === 'ar' ? 'آخر 7 أيام' : 'Last 7 days'} color="from-green-500 to-green-600" />
          <StatCard icon={UserX} title={language === 'ar' ? 'حسابات محذوفة' : 'Deleted Accounts'} 
            value={analytics?.deleted_users || 0} color="from-red-500 to-red-600" />
          <StatCard icon={Download} title={language === 'ar' ? 'إجمالي الأدوية' : 'Total Medications'} 
            value={stats?.medications?.total || 0} color="from-purple-500 to-purple-600" />
        </div>

        {/* Gender & Age Stats */}
        {analytics?.gender_stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-6">{language === 'ar' ? 'توزيع الجنس' : 'Gender Distribution'}</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                  <span className="text-sm font-medium">{language === 'ar' ? 'ذكر' : 'Male'}</span>
                  <span className="text-lg font-bold text-blue-600">{analytics.gender_stats.male}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-pink-50 rounded-xl">
                  <span className="text-sm font-medium">{language === 'ar' ? 'أنثى' : 'Female'}</span>
                  <span className="text-lg font-bold text-pink-600">{analytics.gender_stats.female}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm font-medium">{language === 'ar' ? 'غير محدد' : 'Not Specified'}</span>
                  <span className="text-lg font-bold text-gray-600">{analytics.gender_stats.not_specified}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-6">{language === 'ar' ? 'نمو المستخدمين' : 'User Growth'}</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={analytics?.user_growth?.slice(-14) || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#999" style={{ fontSize: '10px' }} />
                  <YAxis stroke="#999" style={{ fontSize: '10px' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Top Medications Chart */}
        <div className="bg-white rounded-3xl p-6 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{language === 'ar' ? 'أكثر 20 دواء إضافة' : 'Top 20 Medications'}</h3>
              <p className="text-sm text-gray-500">{language === 'ar' ? 'الأدوية الأكثر استخداماً' : 'Most used medications'}</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topMedications.slice(0, 20)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#999" style={{ fontSize: '10px' }} />
              <YAxis dataKey="name" type="category" width={150} stroke="#999" style={{ fontSize: '10px' }} />
              <Tooltip contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{language === 'ar' ? 'قائمة المستخدمين' : 'Users List'}</h3>
              <p className="text-sm text-gray-500">{filteredUsers.length} {language === 'ar' ? 'مستخدم' : 'users'}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 pl-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center gap-2 transition-colors"
              >
                <Filter className="w-4 h-4" />
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="flex gap-2 mb-4 flex-wrap">
              {['all', 'active', 'premium', 'trial'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setFilterActive(filter)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    filterActive === filter 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter === 'all' ? (language === 'ar' ? 'الكل' : 'All') :
                   filter === 'active' ? (language === 'ar' ? 'نشط' : 'Active') :
                   filter === 'premium' ? (language === 'ar' ? 'مميز' : 'Premium') :
                   (language === 'ar' ? 'تجريبي' : 'Trial')}
                </button>
              ))}
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">{language === 'ar' ? 'المستخدم' : 'User'}</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">{language === 'ar' ? 'الهاتف' : 'Phone'}</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">{language === 'ar' ? 'الاشتراك' : 'Subscription'}</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">{language === 'ar' ? 'آخر ظهور' : 'Last Seen'}</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">{language === 'ar' ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u, index) => (
                  <tr key={index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                          {u.full_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{u.full_name || 'مستخدم'}</p>
                          {u.is_admin && <span className="text-xs text-purple-600">Admin</span>}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{u.phone}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        u.subscription_tier === 'lifetime' ? 'bg-purple-100 text-purple-700' :
                        u.subscription_tier === 'yearly' ? 'bg-green-100 text-green-700' :
                        u.subscription_tier === 'monthly' ? 'bg-blue-100 text-blue-700' :
                        u.subscription_tier === 'weekly' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {u.subscription_tier || 'trial'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {u.last_login ? new Date(u.last_login).toLocaleDateString('en-GB') : '-'}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setShowUserModal(true);
                        }}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {language === 'ar' ? 'رسائل المستخدمين' : 'User Messages'}
            </h3>
            
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">{language === 'ar' ? 'لا توجد رسائل' : 'No messages yet'}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div 
                    key={idx}
                    className={`p-5 rounded-2xl border-2 transition-all ${
                      msg.is_read ? 'bg-gray-50 border-gray-100' : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                          {msg.user_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{msg.user_name || 'مستخدم'}</p>
                          <p className="text-sm text-gray-500">{msg.user_phone}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(msg.created_at).toLocaleDateString('ar-EG')}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <p className="font-medium text-gray-800 mb-1">{msg.subject}</p>
                      <p className="text-gray-600 text-sm">{msg.message}</p>
                    </div>

                    {msg.admin_reply && (
                      <div className="bg-white p-3 rounded-xl border border-green-200 mb-3">
                        <p className="text-xs text-green-600 font-medium mb-1">
                          {language === 'ar' ? 'الرد' : 'Reply'}
                        </p>
                        <p className="text-sm text-gray-700">{msg.admin_reply}</p>
                      </div>
                    )}

                    {!msg.admin_reply && (
                      <button
                        onClick={() => setMessageReplyForm({ messageId: msg.id, reply: '' })}
                        className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-colors"
                      >
                        {language === 'ar' ? 'رد' : 'Reply'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {language === 'ar' ? 'إرسال إشعار جماعي' : 'Send Bulk Notification'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'العنوان' : 'Title'}
                </label>
                <input
                  type="text"
                  value={notificationForm.title}
                  onChange={(e) => setNotificationForm({ ...notificationForm, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={language === 'ar' ? 'عنوان الإشعار' : 'Notification title'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الرسالة' : 'Message'}
                </label>
                <textarea
                  value={notificationForm.body}
                  onChange={(e) => setNotificationForm({ ...notificationForm, body: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={language === 'ar' ? 'محتوى الإشعار' : 'Notification content'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الفئة المستهدفة' : 'Target Category'}
                </label>
                <select
                  value={notificationForm.category}
                  onChange={(e) => setNotificationForm({ ...notificationForm, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">{language === 'ar' ? 'جميع المستخدمين' : 'All Users'}</option>
                  <option value="premium">{language === 'ar' ? 'مستخدمو بريميوم' : 'Premium Users'}</option>
                  <option value="trial">{language === 'ar' ? 'مستخدمو التجربة' : 'Trial Users'}</option>
                  <option value="active">{language === 'ar' ? 'المستخدمون النشطون' : 'Active Users'}</option>
                </select>
              </div>

              <button
                onClick={handleSendNotification}
                disabled={!notificationForm.title || !notificationForm.body}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Bell className="w-5 h-5" />
                {language === 'ar' ? 'إرسال الإشعار' : 'Send Notification'}
              </button>

              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-1">
                      {language === 'ar' ? 'ملاحظة' : 'Note'}
                    </p>
                    <p>
                      {language === 'ar' 
                        ? 'سيتم إرسال الإشعار لجميع المستخدمين في الفئة المحددة. تأكد من المحتوى قبل الإرسال.'
                        : 'The notification will be sent to all users in the selected category. Please review before sending.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Message Reply Modal */}
      {messageReplyForm.messageId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">{language === 'ar' ? 'الرد على الرسالة' : 'Reply to Message'}</h3>
              <button onClick={() => setMessageReplyForm({ messageId: null, reply: '' })}>
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الرد' : 'Reply'}
              </label>
              <textarea
                value={messageReplyForm.reply}
                onChange={(e) => setMessageReplyForm({ ...messageReplyForm, reply: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={language === 'ar' ? 'اكتب ردك هنا...' : 'Write your reply here...'}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={async () => {
                  try {
                    const token = localStorage.getItem('token');
                    await axios.post(
                      `${BACKEND_URL}/api/admin/reply-message`,
                      { 
                        message_id: messageReplyForm.messageId, 
                        reply: messageReplyForm.reply 
                      },
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    toast.success(language === 'ar' ? 'تم إرسال الرد' : 'Reply sent');
                    setMessageReplyForm({ messageId: null, reply: '' });
                    fetchDashboardData();
                  } catch (error) {
                    toast.error(language === 'ar' ? 'فشل الإرسال' : 'Failed to send');
                  }
                }}
                disabled={!messageReplyForm.reply}
                className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
              >
                {language === 'ar' ? 'إرسال' : 'Send'}
              </button>
              
              <button
                onClick={() => setMessageReplyForm({ messageId: null, reply: '' })}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Edit Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">{language === 'ar' ? 'إدارة المستخدم' : 'Manage User'}</h3>
              <button onClick={() => setShowUserModal(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">{language === 'ar' ? 'الاسم' : 'Name'}</p>
              <p className="font-medium text-lg">{selectedUser.full_name}</p>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">{language === 'ar' ? 'ترقية الاشتراك' : 'Upgrade Subscription'}</p>
              <div className="grid grid-cols-2 gap-2">
                {['weekly', 'monthly', 'yearly', 'lifetime'].map(tier => (
                  <button
                    key={tier}
                    onClick={() => handleUpdateSubscription(selectedUser.id, tier)}
                    className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-sm font-medium transition-colors"
                  >
                    {tier === 'weekly' ? (language === 'ar' ? 'أسبوعي' : 'Weekly') :
                     tier === 'monthly' ? (language === 'ar' ? 'شهري' : 'Monthly') :
                     tier === 'yearly' ? (language === 'ar' ? 'سنوي' : 'Yearly') :
                     (language === 'ar' ? 'مدى الحياة' : 'Lifetime')}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleDisableUser(selectedUser.id)}
                className="w-full px-4 py-3 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Ban className="w-5 h-5" />
                {language === 'ar' ? 'تعطيل الحساب' : 'Disable Account'}
              </button>
              
              <button
                onClick={() => handleDeleteUser(selectedUser.id)}
                className="w-full px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                {language === 'ar' ? 'حذف الحساب' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardNew;
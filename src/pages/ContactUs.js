import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, MessageSquare, Send, ArrowLeft, Check } from 'lucide-react';
import { toast } from 'sonner';
import BottomNav from '../components/BottomNav';

const ContactUs = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('ar');
  const [contactMethod, setContactMethod] = useState('app'); // 'app' or 'email'
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') || 'ar';
    setLanguage(storedLanguage);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.message) {
      toast.error(
        language === 'ar'
          ? 'يرجى ملء جميع الحقول المطلوبة'
          : 'Please fill all required fields'
      );
      return;
    }

    try {
      setSending(true);
      const token = localStorage.getItem('token');
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      
      const response = await fetch(`${BACKEND_URL}/api/send-contact-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subject: formData.subject,
          message: formData.message,
          method: contactMethod
        })
      });

      const data = await response.json();
      
      if (data.success || data.email_sent !== false) {
        toast.success(
          language === 'ar'
            ? 'تم إرسال رسالتك بنجاح! 🎉'
            : 'Your message has been sent successfully! 🎉'
        );
        
        setFormData({ subject: '', message: '' });
      } else {
        throw new Error(data.message || 'Failed to send');
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(
        language === 'ar'
          ? 'حدث خطأ في إرسال الرسالة'
          : 'Error sending message'
      );
    } finally {
      setSending(false);
    }
  };

  const t = {
    title: language === 'ar' ? 'تواصل معنا' : 'Contact Us',
    subtitle: language === 'ar' ? 'نحن هنا للمساعدة' : 'We are here to help',
    appMethod: language === 'ar' ? 'رسالة داخل التطبيق' : 'In-App Message',
    emailMethod: language === 'ar' ? 'البريد الإلكتروني' : 'Email',
    subject: language === 'ar' ? 'نوع الرسالة' : 'Message Type',
    message: language === 'ar' ? 'رسالتك' : 'Your Message',
    send: language === 'ar' ? 'إرسال الرسالة' : 'Send Message',
    back: language === 'ar' ? 'رجوع' : 'Back'
  };

  const messageTypes = [
    { value: 'suggestion', label: language === 'ar' ? 'اقتراح للتحسين' : 'Improvement Suggestion' },
    { value: 'issue', label: language === 'ar' ? 'مشكلة تقنية' : 'Technical Issue' },
    { value: 'question', label: language === 'ar' ? 'استفسار عام' : 'General Inquiry' },
    { value: 'other', label: language === 'ar' ? 'أخرى' : 'Other' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{t.title}</h1>
            <p className="text-sm text-gray-500">{t.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* Contact Method Selection */}
        <div className="bg-white rounded-3xl p-2 shadow-lg mb-6">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setContactMethod('app')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-medium transition-all ${
                contactMethod === 'app'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="text-sm">{t.appMethod}</span>
            </button>
            <button
              onClick={() => setContactMethod('email')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-medium transition-all ${
                contactMethod === 'email'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Mail className="w-5 h-5" />
              <span className="text-sm">{t.emailMethod}</span>
            </button>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Subject Selection */}
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              {t.subject}
            </label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
              required
            >
              <option value="">{language === 'ar' ? 'اختر نوع الرسالة' : 'Select message type'}</option>
              {messageTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              {t.message}
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={6}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 resize-none"
              placeholder={language === 'ar' ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
              required
            />
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              {contactMethod === 'app' ? (
                <MessageSquare className="w-4 h-4 text-blue-600" />
              ) : (
                <Mail className="w-4 h-4 text-blue-600" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm text-blue-900">
                {contactMethod === 'app'
                  ? (language === 'ar'
                    ? 'سيتم إرسال رسالتك إلى لوحة الإدارة وسنقوم بالرد عليك في أقرب وقت'
                    : 'Your message will be sent to the admin panel and we will reply soon')
                  : (language === 'ar'
                    ? 'سيتم إرسال رسالتك إلى البريد الإلكتروني info@pharmapal.online'
                    : 'Your message will be sent to info@pharmapal.online')}
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={sending}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {sending ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{language === 'ar' ? 'جاري الإرسال...' : 'Sending...'}</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>{t.send}</span>
              </>
            )}
          </button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
};

export default ContactUs;
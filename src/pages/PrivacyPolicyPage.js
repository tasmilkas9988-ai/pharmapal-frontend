import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Shield, Lock, Eye, Database, UserCheck } from 'lucide-react';
import BottomNav from '../components/BottomNav';

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();
  const [language] = useState(
    localStorage.getItem('preferredLanguage') || 'ar'
  );

  useEffect(() => {
    // Disable dark mode in settings pages
    document.documentElement.classList.remove('dark');
  }, []);

  const privacySectionsAr = [
    {
      icon: Database,
      title: '1. \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0627\u0644\u062a\u064a \u0646\u062c\u0645\u0639\u0647\u0627',
      content: '\u0646\u0642\u0648\u0645 \u0628\u062c\u0645\u0639 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0627\u0644\u062a\u064a \u062a\u0642\u062f\u0645\u0647\u0627 \u0644\u0646\u0627 \u0645\u0628\u0627\u0634\u0631\u0629\u060c \u0645\u062b\u0644:\n\u2022 \u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0627\u0644\u062d\u0633\u0627\u0628 (\u0627\u0644\u0627\u0633\u0645\u060c \u0631\u0642\u0645 \u0627\u0644\u062c\u0648\u0627\u0644)\n\u2022 \u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0627\u0644\u0623\u062f\u0648\u064a\u0629 \u0648\u0627\u0644\u062a\u0630\u0643\u064a\u0631\u0627\u062a\n\u2022 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u0635\u062d\u064a\u0629 \u0627\u0644\u062a\u064a \u062a\u062e\u062a\u0627\u0631 \u0645\u0634\u0627\u0631\u0643\u062a\u0647\u0627\n\u2022 \u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0627\u0644\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0648\u0627\u0644\u062a\u0641\u0636\u064a\u0644\u0627\u062a',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Lock,
      title: '2. \u0643\u064a\u0641\u064a\u0629 \u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062a',
      content: '\u0646\u0633\u062a\u062e\u062f\u0645 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0627\u0644\u062a\u064a \u0646\u062c\u0645\u0639\u0647\u0627 \u0645\u0646 \u0623\u062c\u0644:\n\u2022 \u062a\u0642\u062f\u064a\u0645 \u0648\u062a\u062d\u0633\u064a\u0646 \u062e\u062f\u0645\u0627\u062a\u0646\u0627\n\u2022 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u062a\u0630\u0643\u064a\u0631\u0627\u062a \u0648\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062a\n\u2022 \u062a\u062e\u0635\u064a\u0635 \u062a\u062c\u0631\u0628\u062a\u0643 \u0641\u064a \u0627\u0644\u062a\u0637\u0628\u064a\u0642\n\u2022 \u0627\u0644\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0643 \u0628\u062e\u0635\u0648\u0635 \u0627\u0644\u062a\u062d\u062f\u064a\u062b\u0627\u062a \u0648\u0627\u0644\u062a\u062d\u0633\u064a\u0646\u0627\u062a',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      icon: Shield,
      title: '3. \u062d\u0645\u0627\u064a\u0629 \u0645\u0639\u0644\u0648\u0645\u0627\u062a\u0643',
      content: '\u0646\u062a\u062e\u0630 \u0625\u062c\u0631\u0627\u0621\u0627\u062a \u0623\u0645\u0646\u064a\u0629 \u0635\u0627\u0631\u0645\u0629 \u0644\u062d\u0645\u0627\u064a\u0629 \u0645\u0639\u0644\u0648\u0645\u0627\u062a\u0643:\n\u2022 \u062a\u0634\u0641\u064a\u0631 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a \u0623\u062b\u0646\u0627\u0621 \u0627\u0644\u0646\u0642\u0644 \u0648\u0627\u0644\u062a\u062e\u0632\u064a\u0646\n\u2022 \u062e\u0648\u0627\u062f\u0645 \u0622\u0645\u0646\u0629 \u0648\u0645\u062d\u0645\u064a\u0629\n\u2022 \u0627\u0644\u0648\u0635\u0648\u0644 \u0627\u0644\u0645\u062d\u062f\u0648\u062f \u0644\u0644\u0628\u064a\u0627\u0646\u0627\u062a\n\u2022 \u0645\u0631\u0627\u062c\u0639\u0629 \u0623\u0645\u0646\u064a\u0629 \u0645\u0646\u062a\u0638\u0645\u0629',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Eye,
      title: '4. \u0645\u0634\u0627\u0631\u0643\u0629 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062a',
      content: '\u0646\u062d\u0646 \u0644\u0627 \u0646\u0628\u064a\u0639 \u0623\u0648 \u0646\u0634\u0627\u0631\u0643 \u0645\u0639\u0644\u0648\u0645\u0627\u062a\u0643 \u0627\u0644\u0634\u062e\u0635\u064a\u0629 \u0645\u0639 \u0623\u0637\u0631\u0627\u0641 \u062b\u0627\u0644\u062b\u0629 \u0625\u0644\u0627 \u0641\u064a \u0627\u0644\u062d\u0627\u0644\u0627\u062a \u0627\u0644\u062a\u0627\u0644\u064a\u0629:\n\u2022 \u0628\u0645\u0648\u0627\u0641\u0642\u062a\u0643 \u0627\u0644\u0635\u0631\u064a\u062d\u0629\n\u2022 \u0644\u0644\u0627\u0645\u062a\u062b\u0627\u0644 \u0644\u0644\u0642\u0648\u0627\u0646\u064a\u0646 \u0648\u0627\u0644\u0644\u0648\u0627\u0626\u062d\n\u2022 \u0644\u062d\u0645\u0627\u064a\u0629 \u062d\u0642\u0648\u0642\u0646\u0627 \u0648\u0633\u0644\u0627\u0645\u0629 \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645\u064a\u0646\n\u2022 \u0645\u0639 \u0645\u0642\u062f\u0645\u064a \u0627\u0644\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0645\u0648\u062b\u0648\u0642\u064a\u0646',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: UserCheck,
      title: '5. \u062d\u0642\u0648\u0642\u0643',
      content: '\u0644\u062f\u064a\u0643 \u0627\u0644\u062d\u0642 \u0641\u064a:\n\u2022 \u0627\u0644\u0648\u0635\u0648\u0644 \u0625\u0644\u0649 \u0628\u064a\u0627\u0646\u0627\u062a\u0643 \u0627\u0644\u0634\u062e\u0635\u064a\u0629\n\u2022 \u062a\u0635\u062d\u064a\u062d \u0623\u0648 \u062a\u062d\u062f\u064a\u062b \u0645\u0639\u0644\u0648\u0645\u0627\u062a\u0643\n\u2022 \u062d\u0630\u0641 \u062d\u0633\u0627\u0628\u0643 \u0648\u0628\u064a\u0627\u0646\u0627\u062a\u0643\n\u2022 \u0625\u0644\u063a\u0627\u0621 \u0627\u0644\u0627\u0634\u062a\u0631\u0627\u0643 \u0641\u064a \u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062a\n\u2022 \u062a\u0642\u062f\u064a\u0645 \u0634\u0643\u0648\u0649 \u0628\u0634\u0623\u0646 \u0645\u0639\u0627\u0644\u062c\u0629 \u0628\u064a\u0627\u0646\u0627\u062a\u0643',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    }
  ];

  const privacySectionsEn = [
    {
      icon: Database,
      title: '1. Information We Collect',
      content: 'We collect information you provide directly to us, such as:\n\u2022 Account information (name, phone number)\n\u2022 Medication and reminder information\n\u2022 Health data you choose to share\n\u2022 Usage information and preferences',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Lock,
      title: '2. How We Use Information',
      content: 'We use the information we collect to:\n\u2022 Provide and improve our services\n\u2022 Send reminders and notifications\n\u2022 Personalize your app experience\n\u2022 Communicate with you about updates and improvements',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      icon: Shield,
      title: '3. Protecting Your Information',
      content: 'We take strict security measures to protect your information:\n\u2022 Data encryption in transit and storage\n\u2022 Secure and protected servers\n\u2022 Limited data access\n\u2022 Regular security reviews',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Eye,
      title: '4. Information Sharing',
      content: 'We do not sell or share your personal information with third parties except:\n\u2022 With your explicit consent\n\u2022 To comply with laws and regulations\n\u2022 To protect our rights and user safety\n\u2022 With trusted service providers',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: UserCheck,
      title: '5. Your Rights',
      content: 'You have the right to:\n\u2022 Access your personal data\n\u2022 Correct or update your information\n\u2022 Delete your account and data\n\u2022 Unsubscribe from notifications\n\u2022 File a complaint about data processing',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    }
  ];

  const sections = language === 'ar' ? privacySectionsAr : privacySectionsEn;

  return (
    <div 
      className="min-h-screen bg-gray-50 pb-20"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 mt-5 space-y-4">
        
        {/* Introduction */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
          <p className="text-sm text-gray-700 leading-relaxed">
            {language === 'ar'
              ? 'في PharmaPal، نحن ملتزمون بحماية خصوصيتك وأمان معلوماتك الشخصية. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية معلوماتك عند استخدام تطبيقنا.'
              : 'At PharmaPal, we are committed to protecting your privacy and the security of your personal information. This Privacy Policy explains how we collect, use, and protect your information when you use our application.'}
          </p>
          <p className="text-xs text-gray-600 mt-3">
            {language === 'ar' ? 'آخر تحديث: نوفمبر 2024' : 'Last Updated: November 2024'}
          </p>
        </div>

        {/* Privacy Sections */}
        <div className="space-y-3">
          {sections.map((section, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl ${section.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <section.icon className={`w-6 h-6 ${section.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
          </h4>
          <p className="text-xs text-gray-600">
            {language === 'ar'
              ? 'إذا كان لديك أي أسئلة حول سياسة الخصوصية، يرجى التواصل معنا عبر صفحة "تواصل معنا".'
              : 'If you have any questions about this Privacy Policy, please contact us through the "Contact Us" page.'}
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default PrivacyPolicyPage;
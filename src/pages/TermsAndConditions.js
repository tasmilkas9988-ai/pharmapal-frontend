import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, FileText, CheckCircle } from 'lucide-react';
import BottomNav from '../components/BottomNav';

const TermsAndConditions = () => {
  const navigate = useNavigate();
  const [language] = useState(
    localStorage.getItem('preferredLanguage') || 'ar'
  );

  useEffect(() => {
    // Disable dark mode in settings pages
    document.documentElement.classList.remove('dark');
  }, []);

  const termsAr = [
    {
      title: '1. قبول الشروط',
      content: 'باستخدامك لتطبيق PharmaPal، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام التطبيق.'
    },
    {
      title: '2. استخدام التطبيق',
      content: 'تطبيق PharmaPal مصمم لمساعدتك في إدارة أدويتك والتذكير بمواعيد تناولها. التطبيق لا يقدم استشارات طبية ولا يحل محل استشارة الطبيب المختص.'
    },
    {
      title: '3. دقة المعلومات',
      content: 'نبذل قصارى جهدنا لضمان دقة المعلومات المقدمة، لكننا لا نضمن دقة أو اكتمال أو موثوقية أي محتوى في التطبيق. استخدام المعلومات على مسؤوليتك الخاصة.'
    },
    {
      title: '4. حساب المستخدم',
      content: 'أنت مسؤول عن الحفاظ على سرية حسابك وكلمة المرور. توافق على قبول المسؤولية عن جميع الأنشطة التي تحدث تحت حسابك.'
    },
    {
      title: '5. الخصوصية',
      content: 'نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. يرجى مراجعة سياسة الخصوصية الخاصة بنا لمزيد من المعلومات حول كيفية جمع واستخدام بياناتك.'
    },
    {
      title: '6. حقوق الملكية الفكرية',
      content: 'جميع المحتويات والمواد المتاحة في التطبيق، بما في ذلك النصوص والرسومات والشعارات، هي ملك لـ PharmaPal أو مرخصة لها ومحمية بموجب قوانين حقوق النشر.'
    },
    {
      title: '7. التعديلات على الشروط',
      content: 'نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إخطارك بأي تغييرات جوهرية من خلال التطبيق أو عبر البريد الإلكتروني.'
    },
    {
      title: '8. إخلاء المسؤولية',
      content: 'التطبيق مقدم "كما هو" دون أي ضمانات من أي نوع. لا نتحمل المسؤولية عن أي أضرار ناتجة عن استخدام التطبيق أو عدم القدرة على استخدامه.'
    },
    {
      title: '9. القانون الساري',
      content: 'تخضع هذه الشروط والأحكام لقوانين المملكة العربية السعودية وتفسر وفقاً لها.'
    },
    {
      title: '10. الاتصال بنا',
      content: 'إذا كان لديك أي أسئلة حول هذه الشروط والأحكام، يرجى الاتصال بنا عبر صفحة "تواصل معنا".'
    }
  ];

  const termsEn = [
    {
      title: '1. Acceptance of Terms',
      content: 'By using the PharmaPal application, you agree to comply with these terms and conditions. If you do not agree with any part of these terms, please do not use the application.'
    },
    {
      title: '2. Use of Application',
      content: 'PharmaPal is designed to help you manage your medications and remind you of their schedules. The application does not provide medical advice and does not replace consultation with a qualified physician.'
    },
    {
      title: '3. Accuracy of Information',
      content: 'We strive to ensure the accuracy of the information provided, but we do not guarantee the accuracy, completeness, or reliability of any content in the application. Use of information is at your own risk.'
    },
    {
      title: '4. User Account',
      content: 'You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.'
    },
    {
      title: '5. Privacy',
      content: 'We respect your privacy and are committed to protecting your personal data. Please review our Privacy Policy for more information on how we collect and use your data.'
    },
    {
      title: '6. Intellectual Property Rights',
      content: 'All content and materials available in the application, including text, graphics, and logos, are owned by or licensed to PharmaPal and protected under copyright laws.'
    },
    {
      title: '7. Modifications to Terms',
      content: 'We reserve the right to modify these terms at any time. You will be notified of any material changes through the application or via email.'
    },
    {
      title: '8. Disclaimer',
      content: 'The application is provided "as is" without warranties of any kind. We are not liable for any damages resulting from the use or inability to use the application.'
    },
    {
      title: '9. Governing Law',
      content: 'These terms and conditions are governed by and construed in accordance with the laws of the Kingdom of Saudi Arabia.'
    },
    {
      title: '10. Contact Us',
      content: 'If you have any questions about these Terms and Conditions, please contact us through the "Contact Us" page.'
    }
  ];

  const terms = language === 'ar' ? termsAr : termsEn;

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
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                {language === 'ar' ? 'الشروط والأحكام' : 'Terms and Conditions'}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 mt-5 space-y-4">
        
        {/* Last Updated */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <p className="text-sm text-gray-700">
            {language === 'ar' ? 'آخر تحديث: نوفمبر 2024' : 'Last Updated: November 2024'}
          </p>
        </div>

        {/* Terms List */}
        <div className="space-y-3">
          {terms.map((term, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100"
            >
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    {term.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {term.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
          <p className="text-sm text-gray-700 text-center">
            {language === 'ar'
              ? 'باستخدامك لتطبيق PharmaPal، فإنك توافق على هذه الشروط والأحكام'
              : 'By using PharmaPal, you agree to these Terms and Conditions'}
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default TermsAndConditions;
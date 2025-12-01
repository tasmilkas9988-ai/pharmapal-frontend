import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { FileText, ArrowLeft } from 'lucide-react';

const TermsOfService = () => {
  const navigate = useNavigate();
  const language = localStorage.getItem('preferredLanguage') || 'ar';

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const content = {
    ar: {
      title: 'شروط الاستخدام',
      lastUpdated: 'آخر تحديث',
      backButton: 'العودة',
      sections: [
        {
          title: 'من نحن',
          content: 'مرحباً بك في PharmaPal. هذه الشروط والأحكام تحكم استخدامك لتطبيق PharmaPal المقدم من فارما بال أونلاين، مقرها جدة، المملكة العربية السعودية. باستخدامك للتطبيق، فإنك توافق على الالتزام بهذه الشروط.'
        },
        {
          title: '١. قبول الشروط',
          content: `بإنشاء حساب أو استخدام التطبيق، فإنك:

  • تقر بأنك قرأت وفهمت ووافقت على الالتزام بهذه الشروط
  • يجب أن يكون عمرك ١٨ عاماً على الأقل لاستخدام التطبيق
  • إذا كنت تستخدم التطبيق نيابة عن منظمة، فإنك تقر بأن لديك السلطة لإلزام تلك المنظمة بهذه الشروط`
        },
        {
          title: '٢. وصف الخدمة',
          content: `PharmaPal هو تطبيق إدارة أدوية يوفر:

  • التعرف على الأدوية باستخدام الذكاء الاصطناعي
  • قاعدة بيانات شاملة لأكثر من ١٢١ألف دواء مسجل في SFDA
  • تذكيرات ذكية لمواعيد الأدوية
  • فحص التفاعلات الدوائية
  • الأسعار الرسمية للأدوية

الخدمة المجانية تشمل:
  • ٣ محاولات لإضافة الأدوية
  • ٣ عمليات بحث في قاعدة SFDA
  • ٣ تذكيرات تنتهي بعد ٣ أيام

الخدمة المميزة Premium تشمل:
  • وصول غير محدود لجميع الميزات
  • تذكيرات دائمة لا تنتهي
  • دعم فني ذو أولوية`
        },
        {
          title: '٣. حساب المستخدم',
          content: `مسؤوليات التسجيل:
  • يجب تقديم معلومات دقيقة وكاملة عند التسجيل
  • أنت مسؤول عن الحفاظ على سرية كلمة المرور
  • يجب إخطارنا فوراً بأي استخدام غير مصرح به لحسابك

مسؤوليات المستخدم:
  • استخدام التطبيق للأغراض القانونية فقط
  • عدم مشاركة معلومات خاطئة أو مضللة
  • عدم محاولة اختراق أو إتلاف التطبيق
  • احترام حقوق الملكية الفكرية

إنهاء الحساب:
  • يمكنك حذف حسابك في أي وقت من إعدادات الملف الشخصي
  • نحتفظ بالحق في تعليق أو إنهاء حسابك عند انتهاك الشروط`
        },
        {
          title: '٤. الاشتراك والدفع',
          content: `الاشتراك المميز Premium:
  • السعر: ١٩.٩٩ ريال سعودي شهرياً شامل ضريبة القيمة المضافة
  • التجديد التلقائي كل شهر ما لم يتم الإلغاء
  • معالجة الدفع عبر Stripe بشكل آمن

سياسة الإلغاء والاسترجاع:
  • يمكنك إلغاء اشتراكك في أي وقت
  • يحق لك إلغاء الاشتراك واسترجاع الرسوم كاملة خلال ٣ أيام من تاريخ الاشتراك
  • سيتم معالجة طلب الاسترجاع بنفس طريقة الدفع الأصلية خلال ٥-٧ أيام عمل
  • بعد انقضاء فترة الـ٣ أيام، لا يوجد استرداد للرسوم
  • عند الإلغاء بعد فترة الاسترجاع، ستستمر في الوصول للميزات المميزة حتى نهاية فترة الاشتراك الحالية

التغيير في الأسعار:
  • نحتفظ بالحق في تغيير أسعار الاشتراك
  • سيتم إخطارك قبل ٣٠ يوماً من أي تغيير في السعر
  • يمكنك إلغاء اشتراكك إذا لم توافق على السعر الجديد`
        },
        {
          title: '٥. الملكية الفكرية',
          content: `جميع المحتويات والميزات في التطبيق:
  • مملوكة لـ فارما بال أونلاين
  • العلامة التجارية PharmaPal والشعار محميان بحقوق الملكية الفكرية
  • لا يجوز نسخ أو توزيع أو تعديل أي جزء من التطبيق بدون إذن كتابي

حقوقك:
  • تحتفظ بملكية المحتوى الذي تنشئه مثل قوائم الأدوية
  • تمنحنا ترخيصاً لاستخدام المحتوى لتقديم الخدمة`
        },
        {
          title: '٦. إخلاء المسؤولية الطبية',
          content: `تحذير هام:

  • PharmaPal هو أداة معلوماتية فقط وليس بديلاً عن الاستشارة الطبية المتخصصة
  • المعلومات المقدمة للإرشاد العام ولا تشكل نصيحة طبية
  • يجب عليك دائماً استشارة الطبيب أو الصيدلي قبل تناول أي دواء
  • لا تتوقف عن تناول الأدوية أو تغير الجرعات بدون استشارة طبيبك
  • في حالات الطوارئ الطبية، اتصل بالإسعاف ٩٩٧ فوراً

راجع صفحة إخلاء المسؤولية الطبية للمزيد من التفاصيل`
        },
        {
          title: '٧. حدود المسؤولية',
          content: `يُقدم التطبيق كما هو دون أي ضمانات:

  • لا نضمن دقة أو اكتمال المعلومات الطبية
  • لا نضمن أن التطبيق سيكون خالياً من الأخطاء أو الانقطاعات

لا نتحمل المسؤولية عن:
  • أي أضرار ناتجة عن استخدام أو عدم القدرة على استخدام التطبيق
  • قرارات طبية تتخذها بناءً على معلومات التطبيق
  • فقدان البيانات أو الأرباح
  • الأضرار غير المباشرة أو العرضية

الحد الأقصى للمسؤولية:
  • في جميع الأحوال، لن تتجاوز مسؤوليتنا المبلغ الذي دفعته للاشتراك في آخر ١٢ شهراً`
        },
        {
          title: '٨. الخصوصية وحماية البيانات',
          content: `نلتزم بحماية خصوصية بياناتك:
  • وفقاً لسياسة الخصوصية الخاصة بنا
  • يُرجى قراءة سياسة الخصوصية لفهم كيفية جمع واستخدام معلوماتك
  • باستخدام التطبيق، فإنك توافق على سياسة الخصوصية`
        },
        {
          title: '٩. خدمات الطرف الثالث',
          content: `نستخدم خدمات طرف ثالث لتقديم وظائف التطبيق:

  • Stripe لمعالجة المدفوعات
  • خدمات الاستضافة السحابية وخدمات الذكاء الاصطناعي
  • MongoDB لتخزين البيانات
  • OpenAI GPT-4 لتحليل الأدوية

هذه الخدمات لها شروطها وسياساتها الخاصة، ونحن غير مسؤولين عن ممارساتها`
        },
        {
          title: '١٠. الأنشطة المحظورة',
          content: `يُحظر عليك:

  • استخدام التطبيق لأي غرض غير قانوني
  • انتحال شخصية أي شخص أو كيان
  • نشر فيروسات أو برامج ضارة
  • محاولة الوصول غير المصرح به للخوادم
  • جمع معلومات مستخدمين آخرين
  • إساءة استخدام الميزات المجانية لتجاوز القيود
  • بيع أو نقل حسابك
  • استخدام روبوتات أو برامج آلية

انتهاك هذه القواعد قد يؤدي إلى إنهاء فوري لحسابك`
        },
        {
          title: '١١. التعديلات على الخدمة',
          content: `نحتفظ بالحق في:

  • تعديل أو إيقاف أي جزء من الخدمة في أي وقت
  • تحديث الميزات أو إزالتها
  • تغيير شروط الاستخدام مع إشعار مسبق
  • إجراء صيانة مجدولة أو طارئة

سنبذل قصارى جهدنا لإخطارك مسبقاً بأي تغييرات جوهرية`
        },
        {
          title: '١٢. القانون الحاكم',
          content: `تخضع هذه الشروط وتُفسر وفقاً لقوانين:
  • المملكة العربية السعودية للمستخدمين في السعودية
  • ولاية Missouri الولايات المتحدة لشؤون الشركة

أي نزاعات:
  • تحل عبر التحكيم أو المحاكم المختصة
  • تنطبق الشروط بغض النظر عن تضارب القوانين`
        },
        {
          title: '١٣. اتصل بنا',
          content: `لأي استفسارات حول هذه الشروط:

فارما بال أونلاين
جدة، المملكة العربية السعودية

البريد الإلكتروني: support@pharmapal.com

نحن نرحب بملاحظاتك واقتراحاتك`
        }
      ]
    },
    en: {
      title: 'Terms of Service',
      lastUpdated: 'Last Updated',
      backButton: 'Back',
      sections: [
        {
          title: 'About Us',
          content: 'Welcome to PharmaPal. These Terms and Conditions govern your use of the PharmaPal application provided by PharmaPal Online, headquartered in Jeddah, Saudi Arabia. By using the app, you agree to be bound by these Terms.'
        },
        {
          title: '1. Acceptance of Terms',
          content: `By creating an account or using the app, you:

  • Acknowledge that you have read, understood, and agree to be bound by these Terms
  • Must be at least 18 years old to use the app
  • If using the app on behalf of an organization, represent that you have authority to bind that organization to these Terms`
        },
        {
          title: '2. Service Description',
          content: `PharmaPal is a medication management app that provides:

  • AI-powered medication recognition
  • Comprehensive database of 121,000+ SFDA-registered medications
  • Smart medication reminders
  • Drug interaction checking
  • Official medication prices

Free Service includes:
  • 3 attempts to add medications
  • 3 SFDA database searches
  • 3 reminders that expire after 3 days

Premium Service includes:
  • Unlimited access to all features
  • Permanent reminders that never expire
  • Priority technical support`
        },
        {
          title: '3. User Account',
          content: `Registration responsibilities:
  • Must provide accurate and complete information when registering
  • Responsible for maintaining password confidentiality
  • Must notify us immediately of any unauthorized account use

User responsibilities:
  • Use app for lawful purposes only
  • Do not share false or misleading information
  • Do not attempt to hack or damage the app
  • Respect intellectual property rights

Account termination:
  • May delete account anytime from profile settings
  • We reserve the right to suspend or terminate account for violation of Terms`
        },
        {
          title: '4. Subscription and Payment',
          content: `Premium Subscription:
  • Price: 19.99 SAR monthly including VAT
  • Automatic renewal every month unless cancelled
  • Payment processed securely through Stripe

Cancellation and Refund Policy:
  • May cancel subscription anytime
  • You have the right to cancel and receive a full refund within 3 days from the subscription date
  • Refund requests will be processed using the original payment method within 5-7 business days
  • After the 3-day period, no refunds will be issued
  • When canceling after the refund period, you will continue to access premium features until the end of current subscription period

Price Changes:
  • We reserve the right to change subscription prices
  • Will be notified 30 days before any price change
  • May cancel subscription if you disagree with new price`
        },
        {
          title: '5. Intellectual Property',
          content: `All content and features in the app:
  • Owned by PharmaPal Online
  • PharmaPal trademark and logo protected by intellectual property rights
  • May not copy, distribute, or modify any part of app without written permission

Your rights:
  • Retain ownership of content you create such as medication lists
  • Grant us a license to use content to provide the service`
        },
        {
          title: '6. Medical Disclaimer',
          content: `Important warning:

  • PharmaPal is an informational tool only and not a substitute for professional medical advice
  • Information provided is for general guidance and does not constitute medical advice
  • Should always consult a doctor or pharmacist before taking any medication
  • Do not stop taking medications or change doses without consulting your doctor
  • In medical emergencies, call 997 immediately

See Medical Disclaimer page for more details`
        },
        {
          title: '7. Limitation of Liability',
          content: `App is provided as is without any warranties:

  • Do not guarantee accuracy or completeness of medical information
  • Do not guarantee app will be error-free or uninterrupted

Not responsible for:
  • Any damages resulting from use or inability to use app
  • Medical decisions you make based on app information
  • Loss of data or profits
  • Indirect or incidental damages

Maximum liability:
  • In all cases, our liability will not exceed amount you paid for subscription in last 12 months`
        },
        {
          title: '8. Privacy and Data Protection',
          content: `We are committed to protecting your data privacy:
  • According to our Privacy Policy
  • Please read Privacy Policy to understand how we collect and use your information
  • By using app, you agree to Privacy Policy`
        },
        {
          title: '9. Third-Party Services',
          content: `We use third-party services to provide app functionality:

  • Stripe for payment processing
  • Cloud hosting and AI services providers
  • MongoDB for data storage
  • OpenAI GPT-4 for medication analysis

These services have their own terms and policies, and we are not responsible for their practices`
        },
        {
          title: '10. Prohibited Activities',
          content: `You are prohibited from:

  • Using app for any illegal purpose
  • Impersonating any person or entity
  • Posting viruses or malicious software
  • Attempting unauthorized access to servers
  • Collecting information about other users
  • Abusing free features to bypass restrictions
  • Selling or transferring your account
  • Using bots or automated programs

Violation of these rules may result in immediate account termination`
        },
        {
          title: '11. Modifications to Service',
          content: `We reserve the right to:

  • Modify or discontinue any part of service at any time
  • Update or remove features
  • Change Terms of Service with prior notice
  • Perform scheduled or emergency maintenance

Will do our best to notify you in advance of any material changes`
        },
        {
          title: '12. Governing Law',
          content: `These Terms are governed by and construed in accordance with laws of:
  • Kingdom of Saudi Arabia for users in Saudi Arabia
  • State of Missouri, United States for company matters

Any disputes:
  • Shall be resolved through arbitration or competent courts
  • Terms apply regardless of conflict of laws`
        },
        {
          title: '13. Contact Us',
          content: `For any inquiries about these Terms:

PharmaPal Online
Jeddah, Saudi Arabia

Email: support@pharmapal.com

We welcome your feedback and suggestions`
        }
      ]
    }
  };

  const t = content[language];
  const currentDate = new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <nav className="glass border-b border-blue-100 sticky top-0 z-50 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="text-teal-700 hover:text-teal-900 font-semibold"
            >
              <ArrowLeft className={`w-5 h-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              {t.backButton}
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {t.title}
          </h1>
          <p className="text-gray-600">
            {t.lastUpdated}: {currentDate}
          </p>
        </div>

        <div className="space-y-6">
          {t.sections.map((section, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {section.title}
                </h2>
                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
                  {section.content}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <p className="text-center text-blue-800 font-medium">
            {language === 'ar' 
              ? '© 2025 فارما بال أونلاين. جميع الحقوق محفوظة.'
              : '© 2025 PharmaPal Online. All rights reserved.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;

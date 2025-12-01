import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Shield, ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const language = localStorage.getItem('preferredLanguage') || 'ar';

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const content = {
    ar: {
      title: 'سياسة الخصوصية',
      lastUpdated: 'آخر تحديث',
      backButton: 'العودة',
      sections: [
        {
          title: 'مقدمة',
          content: 'مرحباً بك في PharmaPal. نحن في فارما بال أونلاين نلتزم بحماية خصوصيتك وبياناتك الشخصية. توضح سياسة الخصوصية هذه كيفية جمعنا واستخدامنا وحمايتنا ومشاركتنا لمعلوماتك الشخصية عند استخدامك لتطبيق PharmaPal.'
        },
        {
          title: '١. المعلومات التي نجمعها',
          content: `نقوم بجمع الأنواع التالية من المعلومات:

المعلومات الشخصية:
  • الاسم الكامل
  • عنوان البريد الإلكتروني
  • كلمة المرور المشفرة
  • تاريخ الميلاد
  • الجنس
  • الوزن والطول لحساب مؤشر كتلة الجسم

المعلومات الصحية:
  • قائمة الأدوية التي تستخدمها
  • الجرعات وأوقات تناول الأدوية
  • التذكيرات الطبية
  • معلومات عن التفاعلات الدوائية

معلومات الاستخدام:
  • سجل البحث في قاعدة بيانات SFDA
  • الصور الملتقطة للتعرف على الأدوية
  • تفضيلات اللغة
  • إحصائيات الاستخدام

معلومات الدفع:
  • يتم معالجة معلومات الدفع بشكل آمن عبر Stripe
  • نحن لا نخزن تفاصيل بطاقتك الائتمانية`
        },
        {
          title: '٢. كيف نستخدم معلوماتك',
          content: `نستخدم المعلومات المجمعة للأغراض التالية:

  • توفير الخدمة وإدارة حسابك وتقديم ميزات التطبيق
  • تحسين التجربة وتخصيص المحتوى والتوصيات
  • حماية حسابك ومنع الاحتيال والأنشطة المشبوهة
  • الرد على استفساراتك وتقديم الدعم الفني
  • معالجة المدفوعات وإدارة الاشتراكات والفواتير
  • إرسال إشعارات هامة وتحديثات عن الخدمة
  • الالتزام بالقوانين واللوائح المعمول بها`
        },
        {
          title: '٣. مشاركة المعلومات',
          content: `نحن لا نبيع معلوماتك الشخصية أبداً. نشارك معلوماتك فقط في الحالات التالية:

مع مقدمي الخدمات:
  • Stripe لمعالجة المدفوعات بشكل آمن
  • خدمات الاستضافة السحابية وخدمات الذكاء الاصطناعي
  • خوادم MongoDB لتخزين البيانات بشكل آمن

للامتثال القانوني:
  • عندما يكون ذلك مطلوباً بموجب القانون
  • للامتثال لأوامر المحكمة أو الإجراءات القانونية
  • لحماية حقوقنا وسلامة المستخدمين

في حالة نقل الأعمال:
  • عند الاندماج أو الاستحواذ أو بيع الأصول`
        },
        {
          title: '٤. أمان البيانات',
          content: `نتخذ إجراءات أمنية صارمة لحماية معلوماتك:

  • تشفير جميع البيانات باستخدام بروتوكولات SSL/TLS
  • تشفير كلمات المرور باستخدام خوارزمية bcrypt
  • استضافة على خوادم آمنة وموثوقة
  • وصول محدود للموظفين المصرح لهم فقط
  • مراقبة مستمرة للأنشطة المشبوهة
  • نسخ احتياطي منتظم للبيانات`
        },
        {
          title: '٥. حقوقك',
          content: `لديك الحقوق التالية فيما يتعلق بمعلوماتك الشخصية:

  • الوصول إلى بياناتك وطلب نسخة منها
  • تحديث أو تصحيح معلوماتك الشخصية
  • حذف حسابك وبياناتك بشكل كامل
  • الحصول على بياناتك بصيغة قابلة للنقل
  • سحب موافقتك في أي وقت
  • الاعتراض على معالجة بياناتك

للممارسة أي من هذه الحقوق، يرجى التواصل معنا على البريد الإلكتروني المذكور أدناه.`
        },
        {
          title: '٦. ملفات الارتباط',
          content: `نستخدم ملفات الارتباط (Cookies) للأغراض التالية:

  • حفظ تفضيلات اللغة الخاصة بك
  • تفعيل ميزة تسجيل الدخول التلقائي
  • تحليل استخدام التطبيق وتحسين الأداء
  • توفير تجربة مخصصة للمستخدم

يمكنك التحكم في ملفات الارتباط من خلال إعدادات المتصفح الخاص بك.`
        },
        {
          title: '٧. الاحتفاظ بالبيانات',
          content: `نحتفظ بمعلوماتك طالما كان حسابك نشطاً أو حسب الحاجة لتوفير خدماتنا.

عند طلب حذف حسابك:
  • سنحذف معلوماتك في غضون ٣٠ يوماً
  • باستثناء المعلومات التي يتطلب القانون الاحتفاظ بها
  • سيتم إخطارك عند اكتمال عملية الحذف`
        },
        {
          title: '٨. خصوصية الأطفال',
          content: `التطبيق غير مخصص للأطفال دون سن ١٨ عاماً.

  • نحن لا نجمع معلومات من الأطفال عن قصد
  • إذا علمنا أننا جمعنا معلومات من طفل دون موافقة الوالدين سنحذفها فوراً
  • يجب على الوالدين الإشراف على استخدام أطفالهم للتطبيق`
        },
        {
          title: '٩. نقل البيانات الدولي',
          content: `قد يتم نقل بياناتك ومعالجتها في الولايات المتحدة الأمريكية أو دول أخرى حيث تعمل خوادمنا.

  • نضمن حماية بياناتك وفقاً لسياسة الخصوصية هذه
  • نلتزم بالقوانين المعمول بها في جميع المناطق
  • نطبق معايير الأمان الدولية المعترف بها`
        },
        {
          title: '١٠. التغييرات على السياسة',
          content: `قد نقوم بتحديث سياسة الخصوصية من وقت لآخر.

سنخطرك بأي تغييرات جوهرية عبر:
  • البريد الإلكتروني المسجل لديك
  • إشعار داخل التطبيق
  • رسالة نصية في الحالات الهامة

يُعتبر استمرارك في استخدام التطبيق بعد التغييرات موافقة منك على السياسة المحدثة.`
        },
        {
          title: '١١. اتصل بنا',
          content: `إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه:

فارما بال أونلاين
جدة، المملكة العربية السعودية

البريد الإلكتروني: support@pharmapal.com

نحن نلتزم بالرد على استفساراتك في غضون ٧٢ ساعة.`
        },
        {
          title: '١٢. الامتثال القانوني',
          content: `نلتزم بالقوانين والأنظمة التالية:

  • نظام حماية البيانات الشخصية السعودي
  • اللائحة العامة لحماية البيانات الأوروبية GDPR
  • قانون قابلية نقل التأمين الصحي والمساءلة HIPAA
  • قوانين الخصوصية الأمريكية الفيدرالية وعلى مستوى الولايات`
        }
      ]
    },
    en: {
      title: 'Privacy Policy',
      lastUpdated: 'Last Updated',
      backButton: 'Back',
      sections: [
        {
          title: 'Introduction',
          content: 'Welcome to PharmaPal. We at PharmaPal Online are committed to protecting your privacy and personal data. This Privacy Policy explains how we collect, use, protect, and share your personal information when you use the PharmaPal application.'
        },
        {
          title: '1. Information We Collect',
          content: `We collect the following types of information:

Personal Information:
  • Full name
  • Email address
  • Encrypted password
  • Date of birth
  • Gender
  • Weight and height for BMI calculation

Health Information:
  • List of medications you use
  • Dosages and medication schedules
  • Medical reminders
  • Drug interaction information

Usage Information:
  • SFDA database search history
  • Images captured for medication recognition
  • Language preferences
  • Usage statistics

Payment Information:
  • Payment information is processed securely through Stripe
  • We do not store your credit card details`
        },
        {
          title: '2. How We Use Your Information',
          content: `We use the collected information for the following purposes:

  • Provide services, manage your account, and deliver app features
  • Improve experience and personalize content and recommendations
  • Protect your account and prevent fraud and suspicious activities
  • Respond to inquiries and provide technical support
  • Process payments and manage subscriptions and invoices
  • Send important notifications and service updates
  • Comply with applicable laws and regulations`
        },
        {
          title: '3. Information Sharing',
          content: `We never sell your personal information. We share your information only in the following cases:

With Service Providers:
  • Stripe for secure payment processing
  • Cloud hosting and AI services providers
  • MongoDB servers for secure data storage

For Legal Compliance:
  • When required by law
  • To comply with court orders or legal proceedings
  • To protect our rights and user safety

In Case of Business Transfer:
  • During merger, acquisition, or asset sale`
        },
        {
          title: '4. Data Security',
          content: `We take strict security measures to protect your information:

  • Encrypt all data using SSL/TLS protocols
  • Encrypt passwords using bcrypt algorithm
  • Host on secure and trusted servers
  • Limit access to authorized personnel only
  • Continuously monitor for suspicious activities
  • Perform regular data backups`
        },
        {
          title: '5. Your Rights',
          content: `You have the following rights regarding your personal information:

  • Access your data and request a copy
  • Update or correct your personal information
  • Delete your account and data completely
  • Obtain your data in a portable format
  • Withdraw your consent at any time
  • Object to the processing of your data

To exercise any of these rights, please contact us at the email address listed below.`
        },
        {
          title: '6. Cookies',
          content: `We use cookies for the following purposes:

  • Save your language preferences
  • Enable automatic login feature
  • Analyze app usage and improve performance
  • Provide personalized user experience

You can control cookies through your browser settings.`
        },
        {
          title: '7. Data Retention',
          content: `We retain your information as long as your account is active or as needed to provide our services.

When you request account deletion:
  • We will delete your information within 30 days
  • Except information required by law to be retained
  • You will be notified when deletion is complete`
        },
        {
          title: '8. Children\'s Privacy',
          content: `The app is not intended for children under 18 years of age.

  • We do not knowingly collect information from children
  • If we learn we have collected information from a child without parental consent, we will delete it immediately
  • Parents should supervise their children's use of the app`
        },
        {
          title: '9. International Data Transfer',
          content: `Your data may be transferred and processed in the United States or other countries where our servers operate.

  • We ensure your data is protected according to this Privacy Policy
  • We comply with applicable laws in all regions
  • We apply internationally recognized security standards`
        },
        {
          title: '10. Policy Changes',
          content: `We may update the Privacy Policy from time to time.

We will notify you of any material changes via:
  • Your registered email address
  • In-app notification
  • Text message in important cases

Your continued use of the app after changes constitutes your acceptance of the updated policy.`
        },
        {
          title: '11. Contact Us',
          content: `If you have any questions about this Privacy Policy:

PharmaPal Online
Jeddah, Saudi Arabia

Email: support@pharmapal.com

We are committed to responding to your inquiries within 72 hours.`
        },
        {
          title: '12. Legal Compliance',
          content: `We comply with the following laws and regulations:

  • Saudi Personal Data Protection System
  • European General Data Protection Regulation (GDPR)
  • Health Insurance Portability and Accountability Act (HIPAA)
  • US Federal and State Privacy Laws`
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <nav className="glass border-b border-emerald-100 sticky top-0 z-50 bg-white/80 backdrop-blur-sm">
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
          <Shield className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
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

        <div className="mt-12 p-6 bg-emerald-50 border-2 border-emerald-200 rounded-lg">
          <p className="text-center text-emerald-800 font-medium">
            {language === 'ar' 
              ? '© 2025 فارما بال أونلاين. جميع الحقوق محفوظة.'
              : '© 2025 PharmaPal Online. All rights reserved.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

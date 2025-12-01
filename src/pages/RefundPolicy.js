import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { DollarSign, ArrowLeft } from 'lucide-react';

const RefundPolicy = ({ language: initialLanguage = 'ar' }) => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState(initialLanguage);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const content = {
    ar: {
      title: 'سياسة الاسترجاع والاستبدال',
      lastUpdated: 'آخر تحديث',
      backButton: 'العودة',
      sections: [
        {
          title: 'مقدمة',
          content: 'نحن في PHARMAPAL-ONLINE نلتزم بتقديم خدمة عالية الجودة لجميع مستخدمي تطبيق PharmaPal. توضح سياسة الاسترجاع هذه شروط وإجراءات استرداد المبالغ المدفوعة للاشتراك المميز.'
        },
        {
          title: '١. الأهلية للاسترجاع',
          content: `يمكنك طلب استرداد المبلغ في الحالات التالية:

  • خلال ٧ أيام من تاريخ الاشتراك الأول
  • إذا لم تستخدم أي ميزات مميزة خلال فترة الاشتراك
  • في حالة وجود خطأ في الفوترة (تم محاسبتك مرتين مثلاً)
  • إذا واجهت مشاكل تقنية خطيرة لم نتمكن من حلها

لا يمكن استرداد المبلغ في الحالات التالية:
  • بعد مرور ٧ أيام من تاريخ الاشتراك
  • إذا تم استخدام الميزات المميزة
  • عند التجديد التلقائي (يجب إلغاء الاشتراك قبل التجديد)
  • للاشتراكات المجانية أو التجريبية`
        },
        {
          title: '٢. كيفية طلب الاسترجاع',
          content: `لطلب استرداد المبلغ، اتبع الخطوات التالية:

الخطوة الأولى: التواصل معنا
  • أرسل بريداً إلكترونياً إلى: [سيتم إضافة البريد الإلكتروني]

الخطوة الثانية: معلومات مطلوبة
  • الاسم الكامل
  • عنوان البريد الإلكتروني المسجل
  • تاريخ الاشتراك
  • رقم المعاملة إن وجد
  • سبب طلب الاسترجاع

الخطوة الثالثة: المراجعة
  • سنراجع طلبك خلال ٣ إلى ٥ أيام عمل

الخطوة الرابعة: القرار
  • سنخطرك بالقرار عبر البريد الإلكتروني`
        },
        {
          title: '٣. الجدول الزمني للاسترجاع',
          content: `المدة الزمنية لمعالجة الاسترجاع:

  • مراجعة الطلب: ٣ إلى ٥ أيام عمل
  • الموافقة: خلال ٢٤ ساعة من المراجعة
  • معالجة الاسترداد: ٥ إلى ١٠ أيام عمل
  • ظهور المبلغ في حسابك: ٥ إلى ١٤ يوم عمل (حسب البنك)

إجمالي المدة: قد تستغرق حتى ٢١ يوم عمل من تاريخ الطلب

ملاحظة: المدة تعتمد على البنك أو طريقة الدفع المستخدمة`
        },
        {
          title: '٤. طريقة الاسترجاع',
          content: `سيتم استرداد المبلغ إلى نفس طريقة الدفع المستخدمة للاشتراك:

  • إذا كانت البطاقة منتهية أو ملغاة، يرجى التواصل معنا لترتيبات بديلة
  • نستخدم Stripe لمعالجة الاستردادات بشكل آمن

طرق الاسترجاع والمدة المتوقعة:
  • بطاقة مدى: ٥ إلى ٧ أيام عمل
  • بطاقة ائتمانية: ٥ إلى ١٠ أيام عمل
  • Apple Pay أو Google Pay: ٣ إلى ٧ أيام عمل`
        },
        {
          title: '٥. الاستردادات الجزئية',
          content: `لا نقدم استردادات جزئية في الحالات التالية:

  • إذا استخدمت جزءاً من فترة الاشتراك
  • إذا ألغيت الاشتراك في منتصف الفترة الشهرية
  • عند إلغاء التجديد التلقائي (ستستمر في الوصول للميزات حتى نهاية الفترة المدفوعة)

استثناء:
  • في حالات الأخطاء التقنية الخطيرة من جانبنا، قد نقدم استرداداً جزئياً بناءً على التقييم`
        },
        {
          title: '٦. إلغاء الاشتراك',
          content: `لتجنب الرسوم المستقبلية:

  • يمكنك إلغاء اشتراكك في أي وقت من إعدادات حسابك
  • عند الإلغاء، ستستمر في الوصول للميزات المميزة حتى نهاية الفترة المدفوعة
  • لن يتم تجديد الاشتراك تلقائياً بعد الإلغاء
  • لا يوجد استرداد للفترة الحالية عند الإلغاء الطوعي

كيفية الإلغاء:
  • الملف الشخصي ← الاشتراك ← إلغاء الاشتراك`
        },
        {
          title: '٧. المشاكل التقنية',
          content: `إذا واجهت مشاكل تقنية:

  • اتصل بالدعم الفني أولاً: [سيتم إضافة البريد الإلكتروني]
  • سنعمل على حل المشكلة خلال ٤٨ ساعة
  • إذا لم نتمكن من الحل، قد تكون مؤهلاً للاسترداد

المشاكل المشمولة:
  • عدم القدرة على الوصول للحساب
  • عطل كامل في التطبيق
  • فقدان البيانات بسبب خطأ من جانبنا

المشاكل غير المشمولة:
  • مشاكل الإنترنت من جانبك
  • عدم التوافق مع جهازك القديم
  • عدم الرضا عن الميزات (بعد ٧ أيام)`
        },
        {
          title: '٨. الحماية من الاحتيال',
          content: `نحن نحمي حقوقك:

  • جميع المعاملات مشفرة عبر Stripe
  • نراقب الأنشطة المشبوهة
  • في حالة الاحتيال، اتصل بنا فوراً

إذا لاحظت رسوماً غير مصرح بها:
  • اتصل بنا على الفور
  • قدم تفاصيل المعاملة
  • سنحقق في الأمر خلال ٢٤ ساعة
  • سنسترد المبلغ إذا ثبت الاحتيال`
        },
        {
          title: '٩. اتصل بنا',
          content: `للاستفسارات والاقتراحات:

PHARMAPAL-ONLINE
جدة، المملكة العربية السعودية

البريد الإلكتروني: support@pharmapal.com

أوقات الرد:
  • طلبات الاسترجاع: خلال ٣ إلى ٥ أيام عمل
  • الاستفسارات العامة: خلال ٢٤ إلى ٤٨ ساعة

نحن ملتزمون بتقديم خدمة عملاء ممتازة`
        }
      ]
    },
    en: {
      title: 'Refund and Return Policy',
      lastUpdated: 'Last Updated',
      backButton: 'Back',
      sections: [
        {
          title: 'Introduction',
          content: 'At PHARMAPAL-ONLINE, we are committed to providing high-quality service to all PharmaPal app users. This refund policy clarifies the terms and procedures for refunding amounts paid for premium subscription.'
        },
        {
          title: '1. Refund Eligibility',
          content: `You may request a refund in the following cases:

  • Within 7 days from the first subscription date
  • If you have not used any premium features during the subscription period
  • In case of billing errors (charged twice, for example)
  • If you encountered serious technical issues we could not resolve

Refunds are NOT available in the following cases:
  • After 7 days from subscription date
  • If premium features were used
  • Upon automatic renewal (must cancel before renewal)
  • For free or trial subscriptions`
        },
        {
          title: '2. How to Request a Refund',
          content: `To request a refund, follow these steps:

Step 1: Contact Us
  • Send an email to: [Email to be added]

Step 2: Required Information
  • Full name
  • Registered email address
  • Subscription date
  • Transaction number (if available)
  • Reason for refund request

Step 3: Review
  • We will review your request within 3 to 5 business days

Step 4: Decision
  • We will notify you of the decision via email`
        },
        {
          title: '3. Refund Timeline',
          content: `Timeline for refund processing:

  • Request review: 3 to 5 business days
  • Approval: Within 24 hours of review
  • Refund processing: 5 to 10 business days
  • Amount appears in your account: 5 to 14 business days (depending on bank)

Total duration: May take up to 21 business days from request date

Note: Duration depends on the bank or payment method used`
        },
        {
          title: '4. Refund Method',
          content: `Refund will be made to the same payment method used for subscription:

  • If card is expired or cancelled, please contact us for alternative arrangements
  • We use Stripe to process refunds securely

Refund methods and expected duration:
  • Mada card: 5 to 7 business days
  • Credit card: 5 to 10 business days
  • Apple Pay or Google Pay: 3 to 7 business days`
        },
        {
          title: '5. Partial Refunds',
          content: `We do NOT offer partial refunds in the following cases:

  • If you used part of the subscription period
  • If you cancelled subscription mid-month
  • Upon cancelling automatic renewal (you will continue to access features until end of paid period)

Exception:
  • In cases of serious technical errors on our end, we may offer a partial refund based on assessment`
        },
        {
          title: '6. Subscription Cancellation',
          content: `To avoid future charges:

  • You can cancel your subscription anytime from account settings
  • Upon cancellation, you will continue to access premium features until end of paid period
  • Subscription will not automatically renew after cancellation
  • No refund for current period upon voluntary cancellation

How to cancel:
  • Profile → Subscription → Cancel Subscription`
        },
        {
          title: '7. Technical Issues',
          content: `If you encounter technical issues:

  • Contact technical support first: [Email to be added]
  • We will work to resolve the issue within 48 hours
  • If we cannot resolve it, you may be eligible for refund

Covered issues:
  • Inability to access account
  • Complete app malfunction
  • Data loss due to error on our end

Not covered issues:
  • Internet problems on your end
  • Incompatibility with your old device
  • Dissatisfaction with features (after 7 days)`
        },
        {
          title: '8. Fraud Protection',
          content: `We protect your rights:

  • All transactions encrypted via Stripe
  • We monitor suspicious activities
  • In case of fraud, contact us immediately

If you notice unauthorized charges:
  • Contact us immediately
  • Provide transaction details
  • We will investigate within 24 hours
  • We will refund if fraud is proven`
        },
        {
          title: '9. Contact Us',
          content: `For inquiries and suggestions:

PHARMAPAL-ONLINE
Jeddah, Saudi Arabia

Email: support@pharmapal.com

Response times:
  • Refund requests: Within 3 to 5 business days
  • General inquiries: Within 24 to 48 hours

We are committed to providing excellent customer service`
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <nav className="glass border-b border-green-100 sticky top-0 z-50 bg-white/80 backdrop-blur-sm">
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
          <DollarSign className="w-16 h-16 text-green-600 mx-auto mb-4" />
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

        <div className="mt-12 p-6 bg-green-50 border-2 border-green-200 rounded-lg">
          <p className="text-center text-green-800 font-medium">
            {language === 'ar' 
              ? '© 2025 PHARMAPAL-ONLINE. جميع الحقوق محفوظة.'
              : '© 2025 PHARMAPAL-ONLINE. All rights reserved.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;

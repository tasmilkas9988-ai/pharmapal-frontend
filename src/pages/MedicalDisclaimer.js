import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { AlertTriangle, ArrowLeft, Phone, Languages } from 'lucide-react';

const MedicalDisclaimer = () => {
  const navigate = useNavigate();
  const language = localStorage.getItem('preferredLanguage') || 'ar';

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    localStorage.setItem('preferredLanguage', newLang);
    window.location.reload(); // Reload to apply language change
  };

  const content = {
    ar: {
      title: 'إخلاء المسؤولية الطبية',
      subtitle: 'يرجى قراءة هذا الإخلاء بعناية قبل استخدام التطبيق',
      lastUpdated: 'آخر تحديث',
      backButton: 'العودة',
      emergencyTitle: '🚨 في حالات الطوارئ الطبية',
      emergencyContent: 'اتصل فوراً بالإسعاف على الرقم 997 أو توجه لأقرب مستشفى',
      sections: [
        {
          title: '⚠️ تنويه هام',
          content: 'PharmaPal هو تطبيق معلوماتي وتنظيمي مصمم لمساعدتك في إدارة أدويتك. المعلومات المقدمة في هذا التطبيق هي للإرشاد العام فقط وليست نصيحة طبية متخصصة.'
        },
        {
          title: '١. ليس بديلاً عن الاستشارة الطبية',
          content: `التطبيق لا يقدم:
  • تشخيصاً طبياً
  • وصفات طبية
  • علاجاً طبياً
  • نصائح طبية متخصصة

يجب عليك:
  • استشارة طبيب مؤهل لأي مسألة صحية
  • عدم الاعتماد على التطبيق كبديل عن الرعاية الطبية
  • مراجعة طبيبك قبل البدء أو تغيير أو إيقاف أي دواء
  • استشارة الصيدلي للأسئلة المتعلقة بالأدوية`
        },
        {
          title: '٢. حدود الذكاء الاصطناعي',
          content: `نظام التعرف على الأدوية بالذكاء الاصطناعي:
  • قد لا يكون دقيقاً بنسبة ١٠٠٪
  • قد يحدث أخطاء في التعرف على الدواء
  • يعتمد على جودة الصورة الملتقطة
  • لا يعتبر بديلاً عن قراءة النشرة الطبية

يجب عليك دائماً:
  • التحقق من اسم الدواء مع الصيدلي
  • قراءة النشرة الطبية المرفقة مع الدواء
  • عدم الاعتماد فقط على التطبيق لتحديد الأدوية`
        },
        {
          title: '٣. دقة المعلومات',
          content: `المعلومات الطبية في التطبيق:
  • مستقاة من مصادر موثوقة (SFDA، مراجع طبية)
  • قد تحتوي على أخطاء أو معلومات قديمة
  • قد لا تنطبق على حالتك الخاصة
  • لا تغطي جميع الحالات والاستثناءات

نحن نسعى لتوفير معلومات دقيقة لكننا لا نضمن:
  • صحة أو اكتمال المعلومات
  • ملاءمة المعلومات لحالتك الشخصية
  • تحديث المعلومات بشكل فوري عند تغييرها`
        },
        {
          title: '٤. التفاعلات الدوائية',
          content: `ميزة فحص التفاعلات الدوائية:
  • توفر معلومات عامة عن التفاعلات المحتملة
  • قد لا تكون شاملة لجميع التفاعلات
  • لا تأخذ في الاعتبار حالتك الصحية الفردية
  • لا تعتبر نصيحة طبية شخصية

يجب عليك:
  • إبلاغ طبيبك بجميع الأدوية التي تتناولها
  • استشارة الصيدلي قبل تناول أدوية جديدة
  • عدم الاعتماد فقط على التطبيق لاكتشاف التفاعلات`
        },
        {
          title: '٥. تذكيرات الجرعات',
          content: `نظام التذكيرات:
  • هو أداة مساعدة فقط
  • قد تحدث أعطال تقنية تمنع إرسال التذكيرات
  • أنت مسؤول عن تناول أدويتك في الوقت المحدد
  • لا تعتمد فقط على التطبيق لتذكيرك

في حالة نسيان جرعة:
  • اتصل بطبيبك أو صيدلانيك
  • لا تضاعف الجرعة بدون استشارة طبية`
        },
        {
          title: '٦. الأسعار الرسمية',
          content: `أسعار الأدوية المعروضة:
  • مأخوذة من قاعدة بيانات هيئة الغذاء والدواء السعودية SFDA
  • قد تختلف الأسعار الفعلية في الصيدليات
  • قد لا تعكس الخصومات أو العروض الحالية
  • قد تتغير الأسعار دون إشعار مسبق

للحصول على السعر الفعلي:
  • استفسر من الصيدلية مباشرة`
        },
        {
          title: '٧. حدود المسؤولية',
          content: `فارما بال أونلاين وتطبيق PharmaPal:
  • غير مسؤولين عن أي أضرار ناتجة عن استخدام التطبيق
  • غير مسؤولين عن قرارات طبية تتخذها بناءً على معلومات التطبيق
  • غير مسؤولين عن أخطاء في المعلومات المقدمة
  • غير مسؤولين عن ردود فعل سلبية للأدوية
  • غير مسؤولين عن فشل نظام التذكيرات

أنت تستخدم التطبيق على مسؤوليتك الخاصة.`
        },
        {
          title: '٨. لا تستبدل الرعاية الطبية',
          content: `لا تستخدم التطبيق كبديل عن:
  • زيارات الطبيب المنتظمة
  • الفحوصات الطبية
  • المتابعة مع المختصين
  • العلاج الطبي الموصوف

اطلب المساعدة الطبية الفورية إذا:
  • شعرت بأعراض جانبية خطيرة
  • لديك رد فعل تحسسي
  • ساءت حالتك الصحية
  • لديك أسئلة عاجلة عن أدويتك`
        },
        {
          title: '٩. الفئات الخاصة',
          content: `الحوامل والمرضعات:
  • يجب استشارة الطبيب قبل تناول أي دواء
  • المعلومات في التطبيق عامة ولا تأخذ في الاعتبار حالة الحمل أو الرضاعة

الأطفال:
  • التطبيق غير مخصص للأطفال دون ١٨ عاماً
  • جرعات الأطفال تختلف عن البالغين

كبار السن:
  • قد تحتاج جرعات معدلة
  • استشر طبيبك بشأن التفاعلات المحتملة

المرضى ذوو الحالات المزمنة:
  • يجب مراجعة الطبيب بانتظام
  • بعض الأدوية قد تتطلب مراقبة خاصة`
        },
        {
          title: '١٠. حالات الطوارئ',
          content: `🚨 في حالات الطوارئ الطبية:

اتصل فوراً بـ:
  • الإسعاف: ٩٩٧
  • مركز السموم: ٩٢٠٠٠١٢٢٢٠

علامات الطوارئ الطبية:
  • صعوبة في التنفس
  • ألم شديد في الصدر
  • رد فعل تحسسي حاد (تورم الوجه، صعوبة البلع)
  • نزيف حاد
  • فقدان الوعي
  • تسمم دوائي

لا تنتظر اطلب المساعدة الطبية فوراً!`
        },
        {
          title: '١١. القبول والموافقة',
          content: `باستخدامك لتطبيق PharmaPal، فإنك:

  • تقر بأنك قرأت وفهمت هذا الإخلاء
  • توافق على أن التطبيق للإرشاد فقط
  • تتحمل المسؤولية الكاملة عن قراراتك الصحية
  • تتعهد باستشارة الطبيب للمسائل الطبية
  • تتنازل عن أي مطالبات ضد فارما بال أونلاين فيما يتعلق بالمعلومات الطبية

إذا كنت لا توافق على هذا الإخلاء، يرجى عدم استخدام التطبيق.`
        },
        {
          title: '١٢. اتصل بنا',
          content: `لأي استفسارات حول هذا الإخلاء:

فارما بال أونلاين
جدة، المملكة العربية السعودية

البريد الإلكتروني: support@pharmapal.com

ملاحظة: لا نقدم استشارات طبية عبر البريد الإلكتروني. للمسائل الطبية، يرجى استشارة طبيبك.`
        }
      ]
    },
    en: {
      title: 'Medical Disclaimer',
      subtitle: 'Please read this disclaimer carefully before using the app',
      lastUpdated: 'Last Updated',
      backButton: 'Back',
      emergencyTitle: '🚨 In Medical Emergencies',
      emergencyContent: 'Call 997 for ambulance immediately or go to the nearest hospital',
      sections: [
        {
          title: '⚠️ Important Notice',
          content: 'PharmaPal is an informational and organizational app designed to help you manage your medications. The information provided in this app is for general guidance only and is not professional medical advice.'
        },
        {
          title: '1. Not a Substitute for Medical Consultation',
          content: `The app does NOT provide:
  • Medical diagnosis
  • Medical prescriptions
  • Medical treatment
  • Professional medical advice

You should:
  • Consult a qualified doctor for any health matter
  • Not rely on the app as a substitute for medical care
  • See your doctor before starting, changing, or stopping any medication
  • Consult a pharmacist for medication-related questions`
        },
        {
          title: '2. AI Limitations',
          content: `AI Medication Recognition System:
  • May not be 100% accurate
  • May make mistakes in identifying medications
  • Depends on captured image quality
  • Is not a substitute for reading the medication leaflet

You should always:
  • Verify medication name with pharmacist
  • Read the medication leaflet included with the drug
  • Not rely solely on the app to identify medications`
        },
        {
          title: '3. Information Accuracy',
          content: `Medical information in the app:
  • Is sourced from trusted references (SFDA, medical references)
  • May contain errors or outdated information
  • May not apply to your specific case
  • Does not cover all cases and exceptions

We strive to provide accurate information but do not guarantee:
  • Correctness or completeness of information
  • Suitability of information for your personal situation
  • Immediate updates when information changes`
        },
        {
          title: '4. Drug Interactions',
          content: `Drug Interaction Check Feature:
  • Provides general information about potential interactions
  • May not be comprehensive for all interactions
  • Does not consider your individual health condition
  • Is not personal medical advice

You should:
  • Inform your doctor of all medications you are taking
  • Consult pharmacist before taking new medications
  • Not rely solely on the app to detect interactions`
        },
        {
          title: '5. Dosage Reminders',
          content: `Reminder System:
  • Is only an assistive tool
  • Technical failures may prevent reminder delivery
  • You are responsible for taking your medications on time
  • Do not rely solely on the app to remind you

If you miss a dose:
  • Contact your doctor or pharmacist
  • Do not double the dose without medical consultation`
        },
        {
          title: '6. Official Prices',
          content: `Displayed medication prices:
  • Are taken from Saudi FDA (SFDA) database
  • Actual prices in pharmacies may differ
  • May not reflect current discounts or offers
  • May change without prior notice

For actual price:
  • Inquire directly from the pharmacy`
        },
        {
          title: '7. Limitation of Liability',
          content: `PharmaPal Online and PharmaPal app:
  • Are not responsible for any damages resulting from app use
  • Are not responsible for medical decisions you make based on app information
  • Are not responsible for errors in provided information
  • Are not responsible for adverse drug reactions
  • Are not responsible for reminder system failures

You use the app at your own risk.`
        },
        {
          title: '8. Do Not Replace Medical Care',
          content: `Do not use the app as a substitute for:
  • Regular doctor visits
  • Medical examinations
  • Follow-up with specialists
  • Prescribed medical treatment

Seek immediate medical help if:
  • You experience serious side effects
  • You have an allergic reaction
  • Your health condition worsens
  • You have urgent questions about your medications`
        },
        {
          title: '9. Special Populations',
          content: `Pregnant and nursing mothers:
  • Must consult doctor before taking any medication
  • Information in app is general and does not consider pregnancy or nursing status

Children:
  • App is not intended for children under 18
  • Children's doses differ from adults

Elderly:
  • May need adjusted doses
  • Consult your doctor about potential interactions

Patients with chronic conditions:
  • Should see doctor regularly
  • Some medications may require special monitoring`
        },
        {
          title: '10. Emergencies',
          content: `🚨 In medical emergencies:

Call immediately:
  • Ambulance: 997
  • Poison Center: 9200012220

Medical emergency signs:
  • Difficulty breathing
  • Severe chest pain
  • Severe allergic reaction (facial swelling, difficulty swallowing)
  • Severe bleeding
  • Loss of consciousness
  • Drug poisoning

Do not wait seek medical help immediately!`
        },
        {
          title: '11. Acceptance and Agreement',
          content: `By using PharmaPal app, you:

  • Acknowledge that you have read and understood this disclaimer
  • Agree that the app is for guidance only
  • Take full responsibility for your health decisions
  • Commit to consulting doctor for medical matters
  • Waive any claims against PharmaPal Online regarding medical information

If you do not agree with this disclaimer, please do not use the app.`
        },
        {
          title: '12. Contact Us',
          content: `For any inquiries about this disclaimer:

PharmaPal Online
Jeddah, Saudi Arabia

Email: support@pharmapal.com

Note: We do not provide medical consultations via email. For medical matters, please consult your doctor.`
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <nav className="glass border-b border-red-100 sticky top-0 z-50 bg-white/80 backdrop-blur-sm">
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
        <div className="text-center mb-8">
          <AlertTriangle className="w-20 h-20 text-red-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {t.title}
          </h1>
          <p className="text-lg text-gray-700 mb-2">
            {t.subtitle}
          </p>
          <p className="text-gray-600">
            {t.lastUpdated}: {currentDate}
          </p>
        </div>

        <Card className="mb-8 border-4 border-red-500 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Phone className="w-12 h-12 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-red-900 mb-2">
                  {t.emergencyTitle}
                </h3>
                <p className="text-red-800 text-lg font-semibold">
                  {t.emergencyContent}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

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

        <div className="mt-12 p-6 bg-red-50 border-4 border-red-300 rounded-lg">
          <p className="text-center text-red-900 font-bold text-lg mb-2">
            {language === 'ar' 
              ? '⚠️ تحذير: هذا التطبيق للإرشاد فقط وليس بديلاً عن الاستشارة الطبية'
              : '⚠️ Warning: This app is for guidance only and not a substitute for medical consultation'}
          </p>
          <p className="text-center text-red-800 font-medium">
            {language === 'ar' 
              ? '© 2025 فارما بال أونلاين. جميع الحقوق محفوظة.'
              : '© 2025 PharmaPal Online. All rights reserved.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MedicalDisclaimer;

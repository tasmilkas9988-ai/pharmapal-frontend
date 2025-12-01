import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, Crown, Zap, Sparkles, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';

const PremiumPlans = ({ user }) => {
  const navigate = useNavigate();
  const [language] = useState(localStorage.getItem('preferredLanguage') || 'ar');
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  const plans = [
    {
      id: 'trial',
      name: { ar: 'تجربة مجانية', en: 'Free Trial' },
      price: { ar: '0 ريال', en: '0 SAR' },
      period: { ar: 'لمدة 48 ساعة', en: 'for 48 hours' },
      icon: Star,
      color: 'from-gray-400 to-gray-500',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      features: [
        { ar: 'جميع الميزات متاحة', en: 'All features available' },
        { ar: 'أدوية غير محدودة', en: 'Unlimited medications' },
        { ar: 'تذكيرات ذكية', en: 'Smart reminders' },
        { ar: 'فحص التداخلات الدوائية', en: 'Drug interaction checker' },
        { ar: 'مساعد ذكي كامل', en: 'Full AI assistant' },
        { ar: 'صالحة لمدة 48 ساعة فقط', en: 'Valid for 48 hours only' }
      ]
    },
    {
      id: 'weekly',
      name: { ar: 'أسبوعي', en: 'Weekly' },
      price: { ar: '7.99 ريال', en: '7.99 SAR' },
      period: { ar: 'أسبوعياً', en: 'per week' },
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      features: [
        { ar: 'جميع الميزات متاحة', en: 'All features available' },
        { ar: 'أدوية غير محدودة', en: 'Unlimited medications' },
        { ar: 'تذكيرات ذكية متقدمة', en: 'Advanced smart reminders' },
        { ar: 'فحص التداخلات الدوائية', en: 'Drug interactions checker' },
        { ar: 'مساعد ذكي كامل', en: 'Full AI assistant' },
        { ar: 'دعم فني متواصل', en: 'Continuous support' }
      ]
    },
    {
      id: 'monthly',
      name: { ar: 'شهري', en: 'Monthly' },
      price: { ar: '29.99 ريال', en: '29.99 SAR' },
      period: { ar: 'شهرياً', en: 'per month' },
      icon: Crown,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-300',
      badge: { ar: 'الأكثر شعبية', en: 'Most Popular' },
      popular: true,
      features: [
        { ar: 'جميع الميزات متاحة', en: 'All features available' },
        { ar: 'أدوية غير محدودة', en: 'Unlimited medications' },
        { ar: 'تذكيرات ذكية متقدمة', en: 'Advanced smart reminders' },
        { ar: 'تتبع الجرعات والالتزام', en: 'Dose tracking & adherence' },
        { ar: 'تقارير صحية شهرية', en: 'Monthly health reports' },
        { ar: 'مساعد ذكي كامل', en: 'Full AI assistant' },
        { ar: 'دعم فني ذو أولوية', en: 'Priority support' }
      ]
    },
    {
      id: 'yearly',
      name: { ar: 'سنوي', en: 'Yearly' },
      price: { ar: '249.99 ريال', en: '249.99 SAR' },
      period: { ar: 'سنوياً', en: 'per year' },
      originalPrice: { ar: '357.48 ريال', en: '357.48 SAR' },
      discount: { ar: 'وفر 30%', en: 'Save 30%' },
      icon: Sparkles,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-300',
      badge: { ar: 'أفضل قيمة', en: 'Best Value' },
      features: [
        { ar: 'جميع الميزات متاحة', en: 'All features available' },
        { ar: 'أدوية غير محدودة', en: 'Unlimited medications' },
        { ar: 'وفر 30% عن الاشتراك الشهري', en: 'Save 30% vs monthly' },
        { ar: 'تذكيرات ذكية متقدمة', en: 'Advanced smart reminders' },
        { ar: 'تقارير صحية تفصيلية', en: 'Detailed health reports' },
        { ar: 'مساعد ذكي كامل', en: 'Full AI assistant' },
        { ar: 'دعم فني مخصص على مدار العام', en: 'Year-round dedicated support' },
        { ar: 'أولوية في الميزات الجديدة', en: 'Priority access to new features' }
      ]
    }
  ];

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
    
    if (planId === 'free') {
      toast.info(
        language === 'ar'
          ? 'أنت بالفعل على الخطة المجانية!'
          : 'You are already on the Free plan!'
      );
      return;
    }

    // Here you would integrate with Tap Payments
    toast.success(
      language === 'ar'
        ? 'جاري تحويلك لصفحة الدفع...'
        : 'Redirecting to payment page...'
    );

    // Simulate payment redirect
    setTimeout(() => {
      toast.info(
        language === 'ar'
          ? 'سيتم تفعيل بوابة الدفع قريباً!'
          : 'Payment gateway will be activated soon!'
      );
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <ChevronLeft className={`w-6 h-6 text-gray-700 ${language === 'ar' ? 'rotate-180' : ''}`} />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'اختر خطتك المثالية' : 'Choose Your Perfect Plan'}
              </h1>
              <p className="text-sm text-gray-600">
                {language === 'ar' ? 'احصل على المزيد من المميزات' : 'Get more features'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 px-4 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center">
            <Crown className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">
            {language === 'ar' ? 'ارتقِ بتجربتك مع PharmaPal' : 'Upgrade Your PharmaPal Experience'}
          </h2>
          <p className="text-white/90 text-base leading-relaxed max-w-2xl mx-auto">
            {language === 'ar'
              ? 'اختر الخطة التي تناسب احتياجاتك واحصل على مميزات حصرية لإدارة أفضل لأدويتك'
              : 'Choose the plan that suits your needs and get exclusive features for better medication management'}
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-4 py-8 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((plan) => {
            const isCurrentPlan = user?.subscription_tier === plan.id || (!user?.subscription_tier && plan.id === 'free');
            
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-3xl shadow-lg border-2 ${plan.borderColor} overflow-hidden transition-all hover:scale-105 ${
                  plan.popular ? 'ring-4 ring-purple-200' : ''
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className={`absolute top-4 ${language === 'ar' ? 'left-4' : 'right-4'} bg-gradient-to-r ${plan.color} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                    {plan.badge[language]}
                  </div>
                )}

                {/* Header */}
                <div className={`${plan.bgColor} px-6 py-6`}>
                  <div className={`w-14 h-14 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mb-4`}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name[language]}
                  </h3>
                  {plan.originalPrice && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-500 line-through">
                        {plan.originalPrice[language]}
                      </span>
                      <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                        {plan.discount[language]}
                      </span>
                    </div>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {plan.price[language].split(' ')[0]}
                    </span>
                    <span className="text-gray-600 text-sm">
                      {plan.price[language].split(' ')[1]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {plan.period[language]}
                  </p>
                </div>

                {/* Features */}
                <div className="px-6 py-6">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 leading-relaxed">
                          {feature[language]}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={isCurrentPlan}
                    className={`w-full py-3 rounded-xl font-bold transition-all ${
                      isCurrentPlan
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : `bg-gradient-to-r ${plan.color} text-white hover:opacity-90 active:scale-95 shadow-lg`
                    }`}
                  >
                    {isCurrentPlan
                      ? (language === 'ar' ? 'الخطة الحالية' : 'Current Plan')
                      : (language === 'ar' ? 'اشترك الآن' : 'Subscribe Now')}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {language === 'ar' ? 'أسئلة شائعة' : 'Frequently Asked Questions'}
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {language === 'ar' ? 'هل يمكنني الترقية أو التخفيض في أي وقت؟' : 'Can I upgrade or downgrade anytime?'}
              </h4>
              <p className="text-sm text-gray-600">
                {language === 'ar'
                  ? 'نعم، يمكنك تغيير خطتك في أي وقت. سيتم احتساب الفرق في التكلفة.'
                  : 'Yes, you can change your plan anytime. The cost difference will be calculated.'}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {language === 'ar' ? 'ما هي طرق الدفع المتاحة؟' : 'What payment methods are available?'}
              </h4>
              <p className="text-sm text-gray-600">
                {language === 'ar'
                  ? 'نقبل جميع بطاقات الائتمان والخصم، Apple Pay، وSTC Pay عبر بوابة الدفع الآمنة.'
                  : 'We accept all credit/debit cards, Apple Pay, and STC Pay through our secure payment gateway.'}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {language === 'ar' ? 'هل توجد فترة تجريبية مجانية؟' : 'Is there a free trial?'}
              </h4>
              <p className="text-sm text-gray-600">
                {language === 'ar'
                  ? 'الخطة المجانية متاحة دائماً. للخطط المدفوعة، نقدم ضمان استرداد المال خلال 14 يوم.'
                  : 'The free plan is always available. For paid plans, we offer a 14-day money-back guarantee.'}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">
            {language === 'ar' ? 'هل لديك أسئلة؟' : 'Have questions?'}
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="text-teal-600 hover:text-teal-700 font-semibold text-sm"
          >
            {language === 'ar' ? 'تواصل معنا →' : 'Contact us →'}
          </button>
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-8"></div>
    </div>
  );
};

export default PremiumPlans;

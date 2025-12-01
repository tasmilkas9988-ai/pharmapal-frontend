import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Check, Sparkles, Loader2, Crown, Zap, Gift, TrendingUp, Calendar } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
const API = `${BACKEND_URL}/api`;

const PricingPage = ({ user, language = 'ar' }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // New pricing plans
  const pricingPlans = [
    {
      id: 'trial',
      name: language === 'ar' ? 'يومين تجربة' : '2 Days Trial',
      nameEn: '2 Days Trial',
      nameAr: 'يومين تجربة',
      price: 0,
      period: language === 'ar' ? 'مجاناً' : 'Free',
      originalPrice: null,
      badge: language === 'ar' ? 'جرب الآن' : 'Try Now',
      icon: Gift,
      gradient: 'from-blue-500 to-cyan-500',
      badgeColor: 'bg-blue-500',
      popular: false,
      features: [
        language === 'ar' ? 'كامل ميزات التطبيق' : 'Full app features',
        language === 'ar' ? 'إضافة أدوية غير محدودة' : 'Unlimited medications',
        language === 'ar' ? 'تذكيرات ذكية' : 'Smart reminders',
        language === 'ar' ? 'فحص التداخلات الدوائية' : 'Drug interaction check',
        language === 'ar' ? 'البحث في قاعدة SFDA' : 'SFDA database search',
        language === 'ar' ? 'دعم فني متميز' : 'Priority support'
      ],
      description: language === 'ar' 
        ? 'اختبر جميع الميزات مجاناً لمدة يومين' 
        : 'Test all features free for 2 days'
    },
    {
      id: 'weekly',
      name: language === 'ar' ? 'جرب أسبوع' : 'Try a Week',
      nameEn: 'Try a Week',
      nameAr: 'جرب أسبوع',
      price: 7.99,
      period: language === 'ar' ? 'أسبوع' : 'week',
      originalPrice: null,
      badge: language === 'ar' ? 'الأفضل للتجربة' : 'Best to Try',
      icon: Zap,
      gradient: 'from-purple-500 to-pink-500',
      badgeColor: 'bg-purple-500',
      popular: false,
      features: [
        language === 'ar' ? 'جميع ميزات التطبيق' : 'All app features',
        language === 'ar' ? 'إضافة أدوية غير محدودة' : 'Unlimited medications',
        language === 'ar' ? 'تذكيرات ذكية' : 'Smart reminders',
        language === 'ar' ? 'فحص التداخلات الدوائية' : 'Drug interaction check',
        language === 'ar' ? 'البحث في قاعدة SFDA' : 'SFDA database search',
        language === 'ar' ? 'دعم فني سريع' : 'Fast support'
      ],
      description: language === 'ar' 
        ? 'اشتراك أسبوعي شامل الضريبة' 
        : 'Weekly subscription including VAT',
      pricePerDay: language === 'ar' ? '1.14 ريال/يوم' : '1.14 SAR/day'
    },
    {
      id: 'monthly',
      name: language === 'ar' ? 'الاشتراك الشهري' : 'Monthly Plan',
      nameEn: 'Monthly Plan',
      nameAr: 'الاشتراك الشهري',
      price: 29.99,
      period: language === 'ar' ? 'شهر' : 'month',
      originalPrice: null,
      badge: language === 'ar' ? 'الأكثر شيوعاً' : 'Most Popular',
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-teal-500',
      badgeColor: 'bg-emerald-500',
      popular: true,
      features: [
        language === 'ar' ? 'جميع ميزات التطبيق' : 'All app features',
        language === 'ar' ? 'إضافة أدوية غير محدودة' : 'Unlimited medications',
        language === 'ar' ? 'تذكيرات ذكية متقدمة' : 'Advanced smart reminders',
        language === 'ar' ? 'فحص التداخلات الدوائية' : 'Drug interaction check',
        language === 'ar' ? 'البحث المتقدم في SFDA' : 'Advanced SFDA search',
        language === 'ar' ? 'تقارير شهرية مفصلة' : 'Detailed monthly reports',
        language === 'ar' ? 'دعم فني أولوية' : 'Priority support'
      ],
      description: language === 'ar' 
        ? 'ريال واحد عن كل يوم' 
        : 'One riyal per day',
      pricePerDay: language === 'ar' ? '1 ريال/يوم' : '1 SAR/day',
      savings: null
    },
    {
      id: 'yearly',
      name: language === 'ar' ? 'الاشتراك السنوي' : 'Yearly Plan',
      nameEn: 'Yearly Plan',
      nameAr: 'الاشتراك السنوي',
      price: 249.99,
      period: language === 'ar' ? 'سنة' : 'year',
      originalPrice: 359.88, // 29.99 * 12
      badge: language === 'ar' ? 'وفر 30%' : 'Save 30%',
      icon: Crown,
      gradient: 'from-amber-500 to-orange-500',
      badgeColor: 'bg-gradient-to-r from-amber-500 to-orange-500',
      popular: false,
      features: [
        language === 'ar' ? 'جميع ميزات التطبيق' : 'All app features',
        language === 'ar' ? 'إضافة أدوية غير محدودة' : 'Unlimited medications',
        language === 'ar' ? 'تذكيرات ذكية متقدمة' : 'Advanced smart reminders',
        language === 'ar' ? 'فحص التداخلات الدوائية' : 'Drug interaction check',
        language === 'ar' ? 'البحث المتقدم في SFDA' : 'Advanced SFDA search',
        language === 'ar' ? 'تقارير شهرية وسنوية' : 'Monthly & yearly reports',
        language === 'ar' ? 'دعم فني VIP' : 'VIP support',
        language === 'ar' ? 'ميزات حصرية قادمة' : 'Exclusive upcoming features'
      ],
      description: language === 'ar' 
        ? 'وفر 110 ريال سنوياً' 
        : 'Save 110 SAR annually',
      pricePerDay: language === 'ar' ? '0.68 ريال/يوم' : '0.68 SAR/day',
      savings: '30%'
    }
  ];

  const handleSubscribe = async (planId) => {
    if (!user) {
      navigate('/');
      return;
    }

    setSelectedPlan(planId);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Create checkout session on backend
      const result = await axios.post(
        `${API}/create-checkout?plan_id=${planId}`,
        {},
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (result.data.success && result.data.payment_url) {
        // Redirect to Tap payment page
        window.location.href = result.data.payment_url;
      } else {
        throw new Error('Failed to get payment URL');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-1.5 rounded-full text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          {language === 'ar' ? 'خطط مرنة لكل احتياجاتك' : 'Flexible Plans for Your Needs'}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {language === 'ar' ? 'اختر خطتك المثالية' : 'Choose Your Perfect Plan'}
        </h1>
        <p className="text-base text-gray-600 max-w-2xl mx-auto">
          {language === 'ar' 
            ? 'ابدأ مجاناً واستمتع بجميع الميزات، ثم اختر الخطة التي تناسبك' 
            : 'Start free and enjoy all features, then choose the plan that suits you'}
        </p>
      </div>

      {/* Pricing Cards Carousel - Horizontal Scroll */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex gap-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory scrollbar-hide" 
             style={{ 
               scrollBehavior: 'smooth',
               WebkitOverflowScrolling: 'touch'
             }}>
        {pricingPlans.map((plan) => {
          const Icon = plan.icon;
          const isPopular = plan.popular;
          const isTrial = plan.id === 'trial';
          const isUserInTrial = user?.is_premium === false; // Assuming user.is_premium is false during trial
          
          return (
            <div 
              key={plan.id}
              className={`flex-shrink-0 w-80 snap-center bg-white rounded-2xl shadow-lg overflow-hidden ${
                isPopular ? 'ring-2 ring-emerald-400' : ''
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className={`flex items-center justify-center py-2 px-4 bg-gradient-to-r ${plan.gradient}`}>
                  <span className="text-white text-xs font-bold flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5" />
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="p-5">
                {/* Icon Circle */}
                <div className={`w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br ${plan.gradient} p-3 shadow-md`}>
                  <Icon className="w-full h-full text-white" strokeWidth={2.5} />
                </div>

                {/* Plan Name */}
                <h3 className="text-center text-lg font-bold text-gray-900 mb-1">
                  {plan.name}
                </h3>

                {/* Description */}
                <p className="text-center text-xs text-gray-600 mb-3">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="text-center mb-4 bg-gray-50 rounded-lg p-3">
                  {plan.originalPrice && (
                    <div className="text-xs text-gray-400 line-through mb-0.5">
                      {plan.originalPrice.toFixed(2)} {language === 'ar' ? 'ريال' : 'SAR'}
                    </div>
                  )}
                  
                  <div className="flex items-baseline justify-center gap-1.5">
                    <span className="text-3xl font-extrabold text-gray-900">
                      {plan.price === 0 ? (language === 'ar' ? 'مجاناً' : 'Free') : plan.price.toFixed(2)}
                    </span>
                    {plan.price > 0 && (
                      <div className="flex flex-col items-start">
                        <span className="text-xs text-gray-600">
                          {language === 'ar' ? 'ريال' : 'SAR'}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          /{plan.period}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Price per day */}
                  {plan.pricePerDay && (
                    <div className="mt-1 text-[10px] text-gray-500 font-medium">
                      {plan.pricePerDay}
                    </div>
                  )}

                  {/* Savings Badge */}
                  {plan.savings && (
                    <div className="mt-2">
                      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        🎉 {language === 'ar' ? 'وفر' : 'Save'} {plan.savings}
                      </span>
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-xs">
                      <Check className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${isPopular ? 'text-emerald-500' : 'text-gray-400'}`} strokeWidth={3} />
                      <span className="text-gray-700 leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => !isTrial || !isUserInTrial ? handleSubscribe(plan.id) : null}
                  disabled={(loading && selectedPlan === plan.id) || (isTrial && isUserInTrial)}
                  className={`w-full py-2.5 px-4 rounded-lg font-bold text-xs transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                    isTrial && isUserInTrial
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : isPopular
                      ? `bg-gradient-to-r ${plan.gradient} text-white hover:shadow-lg`
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {loading && selectedPlan === plan.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {isTrial && isUserInTrial ? (
                        language === 'ar' ? 'في فترة التجربة' : 'In Trial Period'
                      ) : plan.price === 0 ? (
                        language === 'ar' ? 'ابدأ التجربة' : 'Start Trial'
                      ) : (
                        language === 'ar' ? 'اشترك الآن' : 'Subscribe Now'
                      )}
                      {!(isTrial && isUserInTrial) && <Icon className="w-3.5 h-3.5" />}
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="max-w-4xl mx-auto mt-16 text-center px-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>{language === 'ar' ? 'دفع آمن ومشفر' : 'Secure encrypted payment'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>{language === 'ar' ? 'إلغاء في أي وقت' : 'Cancel anytime'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{language === 'ar' ? 'بدون التزام طويل الأمد' : 'No long-term commitment'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto mt-12 text-center">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
        >
          {language === 'ar' ? '→' : '←'} 
          {language === 'ar' ? 'العودة إلى لوحة التحكم' : 'Back to Dashboard'}
        </button>
      </div>
    </div>
  );
};

export default PricingPage;

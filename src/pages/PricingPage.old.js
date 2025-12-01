import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '../App';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Check, X, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const PricingPage = ({ user, language = 'ar' }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const content = {
    ar: {
      title: 'خطط الأسعار',
      subtitle: 'اختر الخطة المناسبة لك',
      free: 'مجاني',
      premium: 'بريميوم',
      perMonth: 'شهرياً',
      currentPlan: 'خطتك الحالية',
      upgradeToPremium: 'الترقية إلى بريميوم',
      features: {
        medications: 'إضافة الأدوية',
        sfdaSearch: 'بحث SFDA',
        reminders: 'التذكيرات',
        interactions: 'فحص التفاعلات',
        support: 'الدعم الفني',
        unlimited: 'غير محدود',
        limited: 'محدود',
        basic: 'أساسي',
        priority: 'ذو أولوية',
        comprehensive: 'شامل'
      },
      limitDetails: {
        freeMeds: '3 محاولات فقط',
        freeSearch: '3 عمليات بحث',
        freeReminders: '3 تذكيرات (تنتهي بعد 3 أيام)',
        freeInteractions: 'فقط للأدوية المضافة'
      }
    },
    en: {
      title: 'Pricing Plans',
      subtitle: 'Choose the plan that works for you',
      free: 'Free',
      premium: 'Premium',
      perMonth: 'per month',
      currentPlan: 'Current Plan',
      upgradeToPremium: 'Upgrade to Premium',
      features: {
        medications: 'Add Medications',
        sfdaSearch: 'SFDA Search',
        reminders: 'Reminders',
        interactions: 'Drug Interactions',
        support: 'Support',
        unlimited: 'Unlimited',
        limited: 'Limited',
        basic: 'Basic',
        priority: 'Priority',
        comprehensive: 'Comprehensive'
      },
      limitDetails: {
        freeMeds: '3 attempts only',
        freeSearch: '3 searches',
        freeReminders: '3 reminders (expire after 3 days)',
        freeInteractions: 'Only for added medications'
      }
    }
  };

  const t = content[language];

  const handleUpgrade = async () => {
    if (!user) {
      toast.error(language === 'ar' ? 'يرجى تسجيل الدخول أولاً' : 'Please login first');
      navigate('/');
      return;
    }

    setLoading(true);
    try {
      // Get frontend origin URL
      const originUrl = window.location.origin;

      // Create checkout session
      const response = await axios.post(
        `${API}/payment/create-checkout`,
        { origin_url: originUrl },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success && response.data.checkout_url) {
        // Redirect to Stripe checkout
        window.location.href = response.data.checkout_url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      toast.error(
        language === 'ar' 
          ? 'حدث خطأ أثناء معالجة الطلب. يرجى المحاولة مرة أخرى'
          : 'Error processing request. Please try again'
      );
      setLoading(false);
    }
  };

  const isPremium = user?.is_premium || false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Header */}
      <nav className="glass border-b border-emerald-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="text-emerald-700 hover:text-emerald-900"
          >
            ← {language === 'ar' ? 'العودة' : 'Back'}
          </Button>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {t.title}
          </h1>
          <p className="text-xl text-gray-600">
            {t.subtitle}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card className="border-2 border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {t.free}
              </CardTitle>
              <CardDescription className="text-center">
                <div className="text-4xl font-bold text-gray-900 mt-4">
                  {language === 'ar' ? '٠' : '0'} {language === 'ar' ? 'ر.س' : 'SAR'}
                </div>
                <div className="text-gray-500 mt-2">{t.perMonth}</div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Features */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{t.features.medications}</p>
                    <p className="text-sm text-gray-500">{t.limitDetails.freeMeds}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{t.features.sfdaSearch}</p>
                    <p className="text-sm text-gray-500">{t.limitDetails.freeSearch}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{t.features.reminders}</p>
                    <p className="text-sm text-gray-500">{t.limitDetails.freeReminders}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{t.features.interactions}</p>
                    <p className="text-sm text-gray-500">{t.limitDetails.freeInteractions}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{t.features.support}</p>
                    <p className="text-sm text-gray-500">{t.features.basic}</p>
                  </div>
                </div>
              </div>

              {!isPremium && (
                <div className="pt-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                    <p className="text-green-700 font-medium">
                      ✓ {t.currentPlan}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="border-4 border-emerald-400 hover:shadow-2xl transition-shadow relative overflow-hidden">
            {/* Popular Badge */}
            <div className="absolute top-0 right-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
              ⭐ {language === 'ar' ? 'الأفضل' : 'Popular'}
            </div>
            
            <CardHeader className="bg-gradient-to-br from-emerald-50 to-teal-50 pb-8">
              <CardTitle className="text-2xl text-center pt-4">
                <Sparkles className="w-6 h-6 inline-block text-emerald-600 mb-1" /> {t.premium}
              </CardTitle>
              <CardDescription className="text-center">
                <div className="text-5xl font-bold text-emerald-600 mt-4">
                  19.99 {language === 'ar' ? 'ر.س' : 'SAR'}
                </div>
                <div className="text-gray-600 mt-2">{t.perMonth}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {language === 'ar' ? 'شامل ضريبة القيمة المضافة' : 'VAT included'}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {/* Features */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-emerald-700">{t.features.medications}</p>
                    <p className="text-sm text-emerald-600 font-semibold">✨ {t.features.unlimited}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-emerald-700">{t.features.sfdaSearch}</p>
                    <p className="text-sm text-emerald-600 font-semibold">✨ {t.features.unlimited}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-emerald-700">{t.features.reminders}</p>
                    <p className="text-sm text-emerald-600 font-semibold">
                      ✨ {t.features.unlimited} ({language === 'ar' ? 'لا تنتهي' : 'Never expire'})
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-emerald-700">{t.features.interactions}</p>
                    <p className="text-sm text-emerald-600 font-semibold">✨ {t.features.comprehensive}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-emerald-700">{t.features.support}</p>
                    <p className="text-sm text-emerald-600 font-semibold">✨ {t.features.priority}</p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-6">
                {isPremium ? (
                  <div className="bg-emerald-50 border-2 border-emerald-300 rounded-lg p-4 text-center">
                    <p className="text-emerald-700 font-bold text-lg">
                      ✓ {t.currentPlan}
                    </p>
                    <p className="text-emerald-600 text-sm mt-1">
                      {language === 'ar' ? 'أنت تستمتع بجميع الميزات المميزة!' : 'You have all premium features!'}
                    </p>
                  </div>
                ) : (
                  <Button
                    onClick={handleUpgrade}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin ml-2" />
                        {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 ml-2" />
                        {t.upgradeToPremium}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Features Comparison */}
        <div className="mt-16 mb-12">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            {language === 'ar' ? '📋 مقارنة تفصيلية للميزات' : '📋 Detailed Features Comparison'}
          </h3>
          
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-right text-gray-700 font-bold">
                        {language === 'ar' ? 'الميزة' : 'Feature'}
                      </th>
                      <th className="px-6 py-4 text-center text-gray-700 font-bold">
                        {language === 'ar' ? 'مجاني' : 'Free'}
                      </th>
                      <th className="px-6 py-4 text-center text-emerald-700 font-bold">
                        {language === 'ar' ? 'بريميوم' : 'Premium'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {/* Medications */}
                    <tr>
                      <td className="px-6 py-4 text-gray-800 font-medium">
                        {language === 'ar' ? 'إضافة الأدوية' : 'Add Medications'}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-600">
                        3 {language === 'ar' ? 'محاولات' : 'attempts'}
                      </td>
                      <td className="px-6 py-4 text-center text-emerald-600 font-semibold">
                        ∞ {language === 'ar' ? 'غير محدود' : 'Unlimited'}
                      </td>
                    </tr>
                    
                    {/* SFDA Search */}
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 text-gray-800 font-medium">
                        {language === 'ar' ? 'بحث في قاعدة بيانات SFDA (121 ألف دواء)' : 'SFDA Database Search (121k medications)'}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-600">
                        3 {language === 'ar' ? 'عمليات' : 'searches'}
                      </td>
                      <td className="px-6 py-4 text-center text-emerald-600 font-semibold">
                        ∞ {language === 'ar' ? 'غير محدود' : 'Unlimited'}
                      </td>
                    </tr>
                    
                    {/* Reminders */}
                    <tr>
                      <td className="px-6 py-4 text-gray-800 font-medium">
                        {language === 'ar' ? 'التذكيرات الذكية' : 'Smart Reminders'}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-600">
                        <div>3 {language === 'ar' ? 'تذكيرات' : 'reminders'}</div>
                        <div className="text-xs text-red-500">
                          ({language === 'ar' ? 'تنتهي بعد 3 أيام' : 'expire after 3 days'})
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-emerald-600 font-semibold">
                        <div>∞ {language === 'ar' ? 'غير محدود' : 'Unlimited'}</div>
                        <div className="text-xs">
                          ({language === 'ar' ? 'لا تنتهي' : 'never expire'})
                        </div>
                      </td>
                    </tr>
                    
                    {/* Drug Interactions */}
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 text-gray-800 font-medium">
                        {language === 'ar' ? 'فحص التفاعلات الدوائية' : 'Drug Interactions Check'}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-600 text-sm">
                        {language === 'ar' ? 'فقط للأدوية المضافة' : 'Added medications only'}
                      </td>
                      <td className="px-6 py-4 text-center text-emerald-600 font-semibold">
                        {language === 'ar' ? 'شامل لجميع الأدوية' : 'All medications'}
                      </td>
                    </tr>
                    
                    {/* AI Recognition */}
                    <tr>
                      <td className="px-6 py-4 text-gray-800 font-medium">
                        {language === 'ar' ? 'التعرف بالذكاء الاصطناعي' : 'AI Recognition'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                      </td>
                    </tr>
                    
                    {/* Official Prices */}
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 text-gray-800 font-medium">
                        {language === 'ar' ? 'الأسعار الرسمية من SFDA' : 'Official SFDA Prices'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                      </td>
                    </tr>
                    
                    {/* Support */}
                    <tr>
                      <td className="px-6 py-4 text-gray-800 font-medium">
                        {language === 'ar' ? 'الدعم الفني' : 'Technical Support'}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-600">
                        {language === 'ar' ? 'أساسي' : 'Basic'}
                      </td>
                      <td className="px-6 py-4 text-center text-emerald-600 font-semibold">
                        {language === 'ar' ? 'ذو أولوية' : 'Priority'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
            {language === 'ar' ? '💳 طرق الدفع المتاحة في السعودية' : '💳 Payment Methods Available in Saudi Arabia'}
          </h3>
          
          {/* Main payment methods */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              {/* Mada */}
              <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow border-2 border-gray-200 hover:border-emerald-400">
                <div className="text-center">
                  <div className="text-4xl mb-2">💳</div>
                  <p className="font-bold text-gray-800">{language === 'ar' ? 'مدى' : 'Mada'}</p>
                  <p className="text-xs text-gray-500 mt-1">{language === 'ar' ? 'البطاقة الوطنية' : 'National Card'}</p>
                </div>
              </div>
              
              {/* Visa */}
              <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow border-2 border-gray-200 hover:border-emerald-400">
                <div className="text-center">
                  <div className="text-4xl mb-2">💳</div>
                  <p className="font-bold text-gray-800">Visa</p>
                  <p className="text-xs text-gray-500 mt-1">{language === 'ar' ? 'ائتمان ومدين' : 'Credit & Debit'}</p>
                </div>
              </div>
              
              {/* Mastercard */}
              <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow border-2 border-gray-200 hover:border-emerald-400">
                <div className="text-center">
                  <div className="text-4xl mb-2">💳</div>
                  <p className="font-bold text-gray-800">Mastercard</p>
                  <p className="text-xs text-gray-500 mt-1">{language === 'ar' ? 'ائتمان ومدين' : 'Credit & Debit'}</p>
                </div>
              </div>
              
              {/* Apple Pay */}
              <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow border-2 border-gray-200 hover:border-emerald-400">
                <div className="text-center">
                  <div className="text-4xl mb-2">🍎</div>
                  <p className="font-bold text-gray-800">Apple Pay</p>
                  <p className="text-xs text-gray-500 mt-1">{language === 'ar' ? 'آيفون وآيباد' : 'iPhone & iPad'}</p>
                </div>
              </div>
              
              {/* Google Pay */}
              <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow border-2 border-gray-200 hover:border-emerald-400">
                <div className="text-center">
                  <div className="text-4xl mb-2">📱</div>
                  <p className="font-bold text-gray-800">Google Pay</p>
                  <p className="text-xs text-gray-500 mt-1">{language === 'ar' ? 'أندرويد' : 'Android'}</p>
                </div>
              </div>
            </div>

            {/* Additional payment methods */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {/* STC Pay */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 shadow-lg border-2 border-purple-200">
                <div className="text-center">
                  <div className="text-4xl mb-2">📱</div>
                  <p className="font-bold text-purple-700">STC Pay</p>
                  <p className="text-xs text-purple-600 mt-1">{language === 'ar' ? 'محفظة رقمية' : 'Digital Wallet'}</p>
                </div>
              </div>
              
              {/* Bank Transfer */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow-lg border-2 border-blue-200">
                <div className="text-center">
                  <div className="text-4xl mb-2">🏦</div>
                  <p className="font-bold text-blue-700">{language === 'ar' ? 'التحويل البنكي' : 'Bank Transfer'}</p>
                  <p className="text-xs text-blue-600 mt-1">{language === 'ar' ? 'جميع البنوك' : 'All Banks'}</p>
                </div>
              </div>
              
              {/* American Express */}
              <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-gray-200">
                <div className="text-center">
                  <div className="text-4xl mb-2">💳</div>
                  <p className="font-bold text-gray-800">Amex</p>
                  <p className="text-xs text-gray-500 mt-1">{language === 'ar' ? 'أمريكان إكسبرس' : 'American Express'}</p>
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🔒</div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 mb-2">
                    {language === 'ar' ? 'الأمان والموثوقية' : 'Security & Reliability'}
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      {language === 'ar' 
                        ? 'جميع المعاملات مشفرة بتقنية SSL/TLS' 
                        : 'All transactions encrypted with SSL/TLS'}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      {language === 'ar' 
                        ? 'معتمد من البنك المركزي السعودي (SAMA)' 
                        : 'Certified by Saudi Central Bank (SAMA)'}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      {language === 'ar' 
                        ? 'متوافق مع معايير PCI DSS العالمية' 
                        : 'PCI DSS compliant'}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      {language === 'ar' 
                        ? 'لا نحفظ بيانات بطاقتك - آمن 100%' 
                        : 'We never store your card data - 100% secure'}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Powered by Stripe */}
            <div className="text-center mt-6">
              <p className="text-gray-500 text-sm">
                {language === 'ar' ? 'مدعوم بتقنية' : 'Powered by'} <span className="font-bold text-indigo-600">Stripe</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {language === 'ar' 
                  ? 'منصة الدفع الأكثر موثوقية في العالم' 
                  : "World's most trusted payment platform"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;

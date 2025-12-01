import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { API } from '../App';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';

const PaymentSuccess = ({ language = 'ar', setUser }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setStatus('error');
        setMessage(language === 'ar' ? 'معرّف الجلسة غير صالح' : 'Invalid session ID');
        return;
      }

      try {
        const response = await axios.get(
          `${API}/payment/status/${sessionId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        if (response.data.success && response.data.payment_status === 'paid') {
          setStatus('success');
          setMessage(response.data.message || '');
          
          // Update user state to reflect premium status
          if (setUser && response.data.user) {
            setUser(response.data.user);
          }
        } else {
          setStatus('error');
          setMessage(response.data.message || (language === 'ar' ? 'فشل التحقق من الدفع' : 'Payment verification failed'));
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('error');
        setMessage(
          language === 'ar' 
            ? 'حدث خطأ أثناء التحقق من الدفع'
            : 'Error verifying payment'
        );
      }
    };

    verifyPayment();
  }, [sessionId, language, setUser]);

  const content = {
    ar: {
      verifying: 'جاري التحقق من الدفع...',
      success: '🎉 تم الدفع بنجاح!',
      successMessage: 'تم ترقية حسابك إلى Premium بنجاح',
      benefits: 'الآن يمكنك الاستمتاع بـ:',
      benefit1: '✨ إضافة أدوية غير محدودة',
      benefit2: '✨ عمليات بحث SFDA غير محدودة',
      benefit3: '✨ تذكيرات غير محدودة (لا تنتهي صلاحيتها)',
      benefit4: '✨ فحص التفاعلات الدوائية الشامل',
      benefit5: '✨ دعم فني ذو أولوية',
      goToDashboard: 'الذهاب إلى لوحة التحكم',
      error: 'فشل التحقق من الدفع',
      errorMessage: 'حدث خطأ أثناء معالجة الدفع',
      tryAgain: 'المحاولة مرة أخرى',
      contactSupport: 'تواصل مع الدعم'
    },
    en: {
      verifying: 'Verifying payment...',
      success: '🎉 Payment Successful!',
      successMessage: 'Your account has been upgraded to Premium',
      benefits: 'Now you can enjoy:',
      benefit1: '✨ Unlimited medications',
      benefit2: '✨ Unlimited SFDA searches',
      benefit3: '✨ Unlimited reminders (never expire)',
      benefit4: '✨ Comprehensive drug interactions',
      benefit5: '✨ Priority support',
      goToDashboard: 'Go to Dashboard',
      error: 'Payment Verification Failed',
      errorMessage: 'An error occurred while processing payment',
      tryAgain: 'Try Again',
      contactSupport: 'Contact Support'
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl">
        <CardContent className="pt-12 pb-8">
          {/* Loading State */}
          {status === 'loading' && (
            <div className="text-center space-y-6">
              <Loader2 className="w-16 h-16 animate-spin text-emerald-500 mx-auto" />
              <h2 className="text-2xl font-bold text-gray-800">
                {t.verifying}
              </h2>
              <p className="text-gray-600">
                {language === 'ar' ? 'يرجى الانتظار...' : 'Please wait...'}
              </p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-800">
                {t.success}
              </h2>
              
              <p className="text-xl text-gray-600">
                {t.successMessage}
              </p>

              {/* Benefits List */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-6 text-right">
                <p className="text-lg font-semibold text-emerald-700 mb-4">
                  {t.benefits}
                </p>
                <div className="space-y-3 text-gray-700">
                  <p className="text-base">{t.benefit1}</p>
                  <p className="text-base">{t.benefit2}</p>
                  <p className="text-base">{t.benefit3}</p>
                  <p className="text-base">{t.benefit4}</p>
                  <p className="text-base">{t.benefit5}</p>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-6 px-12 text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  {t.goToDashboard} →
                </Button>
              </div>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-16 h-16 text-red-500" />
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-800">
                {t.error}
              </h2>
              
              <p className="text-xl text-gray-600">
                {message || t.errorMessage}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center pt-4">
                <Button
                  onClick={() => navigate('/pricing')}
                  variant="outline"
                  className="px-8 py-6 text-lg"
                >
                  {t.tryAgain}
                </Button>
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="bg-emerald-600 hover:bg-emerald-700 px-8 py-6 text-lg"
                >
                  {t.goToDashboard}
                </Button>
              </div>

              <p className="text-sm text-gray-500">
                {t.contactSupport}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;

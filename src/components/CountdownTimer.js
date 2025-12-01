import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const CountdownTimer = ({ endDate, language = 'ar', subscriptionTier }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const now = new Date();
    const end = new Date(endDate);
    const difference = end - now;

    if (difference <= 0) {
      return { expired: true };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return { days, hours, minutes, seconds, expired: false };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (timeLeft.expired) {
    return (
      <div className="bg-red-50 rounded-2xl p-4 flex items-center gap-3">
        <Clock className="w-5 h-5 text-red-600" />
        <p className="text-sm font-medium text-red-700">
          {language === 'ar' ? 'انتهى الاشتراك' : 'Subscription Expired'}
        </p>
      </div>
    );
  }

  const isTrial = subscriptionTier === 'trial';
  
  return (
    <div className={`rounded-2xl p-4 ${
      isTrial ? 'bg-gradient-to-r from-orange-50 to-red-50' : 'bg-gradient-to-r from-blue-50 to-purple-50'
    }`}>
      <div className="flex items-center gap-2 mb-3">
        <Clock className={`w-5 h-5 ${isTrial ? 'text-orange-600' : 'text-blue-600'}`} />
        <p className={`text-sm font-semibold ${isTrial ? 'text-orange-900' : 'text-blue-900'}`}>
          {isTrial 
            ? (language === 'ar' ? 'وقت التجربة المتبقي' : 'Trial Time Remaining')
            : (language === 'ar' ? 'وقت الاشتراك المتبقي' : 'Subscription Time Remaining')
          }
        </p>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {timeLeft.days > 0 && (
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <p className={`text-2xl font-bold ${isTrial ? 'text-orange-600' : 'text-blue-600'}`}>
              {timeLeft.days}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {language === 'ar' ? 'يوم' : 'Days'}
            </p>
          </div>
        )}
        
        <div className="bg-white rounded-xl p-3 text-center shadow-sm">
          <p className={`text-2xl font-bold ${isTrial ? 'text-orange-600' : 'text-blue-600'}`}>
            {timeLeft.hours}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {language === 'ar' ? 'ساعة' : 'Hours'}
          </p>
        </div>
        
        <div className="bg-white rounded-xl p-3 text-center shadow-sm">
          <p className={`text-2xl font-bold ${isTrial ? 'text-orange-600' : 'text-blue-600'}`}>
            {timeLeft.minutes}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {language === 'ar' ? 'دقيقة' : 'Mins'}
          </p>
        </div>
        
        <div className="bg-white rounded-xl p-3 text-center shadow-sm">
          <p className={`text-2xl font-bold ${isTrial ? 'text-orange-600' : 'text-blue-600'}`}>
            {timeLeft.seconds}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {language === 'ar' ? 'ثانية' : 'Secs'}
          </p>
        </div>
      </div>
      
      {isTrial && (
        <p className="text-xs text-orange-700 mt-3 text-center">
          {language === 'ar' 
            ? 'قم بالاشتراك للاستمرار بعد انتهاء التجربة'
            : 'Subscribe to continue after trial ends'
          }
        </p>
      )}
    </div>
  );
};

export default CountdownTimer;

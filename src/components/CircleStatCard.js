import React from 'react';

const CircleStatCard = ({ icon: Icon, title, description, gradient = 'from-purple-500 to-pink-500', onClick }) => {
  const language = localStorage.getItem('preferredLanguage') || 'ar';
  
  // تحديد ألوان الخلفية والأيقونة بناءً على gradient
  const getColors = () => {
    if (gradient.includes('purple')) {
      return { bg: 'bg-gradient-to-br from-purple-100 to-pink-100', icon: 'text-purple-600' };
    } else if (gradient.includes('emerald')) {
      return { bg: 'bg-gradient-to-br from-emerald-100 to-teal-100', icon: 'text-emerald-600' };
    } else if (gradient.includes('blue')) {
      return { bg: 'bg-gradient-to-br from-blue-100 to-cyan-100', icon: 'text-blue-600' };
    } else {
      return { bg: 'bg-gradient-to-br from-orange-100 to-pink-100', icon: 'text-orange-600' };
    }
  };

  const { bg, icon: iconColor } = getColors();

  return (
    <div 
      onClick={onClick}
      className="flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 group"
    >
      {/* الدائرة البسيطة */}
      <div className="relative">
        {/* توهج خفيف عند hover */}
        <div className={`absolute -inset-2 rounded-full bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`} />
        
        {/* الدائرة الرئيسية */}
        <div className={`
          relative
          w-24 h-24 sm:w-28 sm:h-28 
          rounded-full 
          ${bg}
          flex items-center justify-center
          shadow-lg
          group-hover:shadow-xl
          transition-all duration-300
        `}>
          {Icon && (
            <Icon 
              className={`w-10 h-10 sm:w-12 sm:h-12 ${iconColor} transition-transform duration-300 group-hover:scale-110`}
              strokeWidth={2}
            />
          )}
        </div>
      </div>

      {/* العنوان */}
      <h3 className={`
        mt-3
        text-base sm:text-lg
        font-bold
        text-gray-800
        text-center
        ${language === 'ar' ? 'font-arabic' : ''}
      `}>
        {title}
      </h3>

      {/* الوصف */}
      <p className={`
        mt-1
        text-xs sm:text-sm
        text-gray-600
        text-center
        ${language === 'ar' ? 'font-arabic' : ''}
      `}>
        {description}
      </p>
    </div>
  );
};

export default CircleStatCard;

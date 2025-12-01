import React from 'react';
import { Card, CardContent } from './ui/card';
import { ChevronRight } from 'lucide-react';

/**
 * ActionCard - بطاقة تجمع بين الإحصائية والأفعال المرتبطة بها
 * مصممة خصيصاً لكبار السن - خطوط كبيرة وواضحة
 */
const ActionCard = ({ 
  title,
  value, 
  icon: Icon, 
  actions = [],
  gradient,
  iconBg = "bg-white/20",
  language = "ar"
}) => {
  return (
    <Card className={`${gradient} text-white shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden`}>
      <CardContent className="p-4 sm:p-6">
        {/* الرأس - الإحصائية */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <p className="text-white/90 text-base sm:text-lg font-semibold mb-2">
              {title}
            </p>
            <p className="text-3xl sm:text-4xl md:text-5xl font-bold">
              {value}
            </p>
          </div>
          <div className={`w-16 h-16 sm:w-20 sm:h-20 ${iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
        </div>

        {/* الخط الفاصل */}
        {actions.length > 0 && (
          <div className="border-t border-white/30 my-3 sm:my-4"></div>
        )}

        {/* الأفعال */}
        <div className="space-y-2">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              disabled={action.disabled}
              className={`
                w-full flex items-center justify-between 
                bg-white/10 hover:bg-white/20 
                backdrop-blur-sm
                rounded-xl p-3 sm:p-4
                transition-all duration-200
                group
                ${action.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
              `}
            >
              <div className="flex items-center gap-3 flex-1">
                {action.icon && (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    {action.icon}
                  </div>
                )}
                <div className="text-left flex-1">
                  <p className="text-white font-bold text-base sm:text-lg leading-tight">
                    {action.label}
                  </p>
                  {action.sublabel && (
                    <p className="text-white/70 text-xs sm:text-sm mt-1">
                      {action.sublabel}
                    </p>
                  )}
                </div>
              </div>
              
              {!action.disabled && (
                <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionCard;

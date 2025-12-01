import React from 'react';
import { Card, CardContent } from './ui/card';
import { TrendingUp, Activity } from 'lucide-react';

const ProfessionalStatCard = ({ value, label, icon, color, trend }) => {
  const colorClasses = {
    blue: {
      bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
      light: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-600',
      glow: 'shadow-blue-500/20'
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-500 to-purple-600',
      light: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-600',
      glow: 'shadow-purple-500/20'
    },
    green: {
      bg: 'bg-gradient-to-br from-green-500 to-green-600',
      light: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-600',
      glow: 'shadow-green-500/20'
    },
    gray: {
      bg: 'bg-gradient-to-br from-gray-500 to-gray-600',
      light: 'bg-gray-50',
      border: 'border-gray-200',
      text: 'text-gray-600',
      glow: 'shadow-gray-500/20'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <Card className={`relative overflow-hidden border-2 ${colors.border} ${colors.light} hover:shadow-xl transition-all duration-300 ${colors.glow}`}>
      <CardContent className="p-6">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="40" fill="currentColor" className={colors.text} />
            <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="2" className={colors.text} />
            <circle cx="50" cy="50" r="10" fill="currentColor" className={colors.text} />
          </svg>
        </div>

        {/* Icon Badge */}
        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${colors.bg} shadow-lg mb-4 relative z-10`}>
          <span className="text-2xl text-white">{icon}</span>
        </div>

        {/* Value */}
        <div className="relative z-10">
          <div className="flex items-baseline gap-2 mb-1">
            <h3 className={`text-4xl font-bold ${colors.text}`}>
              {value}
            </h3>
            {trend && (
              <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {trend}
              </span>
            )}
          </div>

          {/* Label */}
          <p className="text-sm font-medium text-gray-600">
            {label}
          </p>

          {/* Separator Line */}
          <div className={`mt-3 h-1 w-12 rounded-full ${colors.bg}`}></div>
        </div>

        {/* Activity Indicator */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-xs text-gray-400">
          <Activity className="w-3 h-3" />
          <span>Live</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessionalStatCard;

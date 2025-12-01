import React from "react";

const Avatar = ({ type, size = 200 }) => {
  const getAvatarSVG = () => {
    const baseProps = {
      width: size,
      height: size,
      viewBox: "0 0 200 200",
    };

    // Color schemes
    const skinTone = "#FFD1A1";
    const hairColor = "#4A3728";
    
    switch (type) {
      case "male-thin":
        return (
          <svg {...baseProps}>
            {/* Background circle */}
            <circle cx="100" cy="100" r="95" fill="#E3F2FD" />
            
            {/* Thin body */}
            <ellipse cx="100" cy="140" rx="25" ry="50" fill="#4A90E2" />
            
            {/* Head */}
            <circle cx="100" cy="70" r="30" fill={skinTone} />
            
            {/* Hair */}
            <path d="M 70 55 Q 100 40 130 55" fill={hairColor} />
            
            {/* Eyes */}
            <circle cx="90" cy="70" r="3" fill="#2C3E50" />
            <circle cx="110" cy="70" r="3" fill="#2C3E50" />
            
            {/* Smile */}
            <path d="M 90 80 Q 100 85 110 80" stroke="#2C3E50" strokeWidth="2" fill="none" />
            
            {/* Arms - thin */}
            <rect x="65" y="140" width="8" height="40" rx="4" fill={skinTone} />
            <rect x="127" y="140" width="8" height="40" rx="4" fill={skinTone} />
          </svg>
        );

      case "male-normal":
        return (
          <svg {...baseProps}>
            {/* Background circle */}
            <circle cx="100" cy="100" r="95" fill="#E8F5E9" />
            
            {/* Normal body */}
            <ellipse cx="100" cy="140" rx="35" ry="50" fill="#4CAF50" />
            
            {/* Head */}
            <circle cx="100" cy="70" r="32" fill={skinTone} />
            
            {/* Hair */}
            <path d="M 68 50 Q 100 35 132 50" fill={hairColor} />
            
            {/* Eyes */}
            <circle cx="90" cy="70" r="3" fill="#2C3E50" />
            <circle cx="110" cy="70" r="3" fill="#2C3E50" />
            
            {/* Smile */}
            <path d="M 88 82 Q 100 88 112 82" stroke="#2C3E50" strokeWidth="2" fill="none" />
            
            {/* Arms - normal */}
            <rect x="60" y="140" width="12" height="45" rx="6" fill={skinTone} />
            <rect x="128" y="140" width="12" height="45" rx="6" fill={skinTone} />
          </svg>
        );

      case "male-overweight":
        return (
          <svg {...baseProps}>
            {/* Background circle */}
            <circle cx="100" cy="100" r="95" fill="#FFF3E0" />
            
            {/* Overweight body */}
            <ellipse cx="100" cy="140" rx="45" ry="52" fill="#FF9800" />
            
            {/* Head */}
            <circle cx="100" cy="70" r="34" fill={skinTone} />
            
            {/* Hair */}
            <path d="M 66 48 Q 100 32 134 48" fill={hairColor} />
            
            {/* Eyes */}
            <circle cx="90" cy="70" r="3" fill="#2C3E50" />
            <circle cx="110" cy="70" r="3" fill="#2C3E50" />
            
            {/* Smile */}
            <path d="M 88 82 Q 100 87 112 82" stroke="#2C3E50" strokeWidth="2" fill="none" />
            
            {/* Arms - thicker */}
            <rect x="50" y="140" width="15" height="45" rx="7" fill={skinTone} />
            <rect x="135" y="140" width="15" height="45" rx="7" fill={skinTone} />
          </svg>
        );

      case "male-obese":
        return (
          <svg {...baseProps}>
            {/* Background circle */}
            <circle cx="100" cy="100" r="95" fill="#FFEBEE" />
            
            {/* Obese body */}
            <ellipse cx="100" cy="145" rx="55" ry="55" fill="#F44336" />
            
            {/* Head */}
            <circle cx="100" cy="68" r="36" fill={skinTone} />
            
            {/* Hair */}
            <path d="M 64 45 Q 100 28 136 45" fill={hairColor} />
            
            {/* Eyes */}
            <circle cx="88" cy="68" r="3" fill="#2C3E50" />
            <circle cx="112" cy="68" r="3" fill="#2C3E50" />
            
            {/* Smile */}
            <path d="M 86 80 Q 100 84 114 80" stroke="#2C3E50" strokeWidth="2" fill="none" />
            
            {/* Arms - thick */}
            <rect x="40" y="145" width="18" height="45" rx="9" fill={skinTone} />
            <rect x="142" y="145" width="18" height="45" rx="9" fill={skinTone} />
          </svg>
        );

      case "female-thin":
        return (
          <svg {...baseProps}>
            {/* Background circle */}
            <circle cx="100" cy="100" r="95" fill="#F3E5F5" />
            
            {/* Thin body - dress */}
            <path d="M 75 120 L 100 190 L 125 120 Z" fill="#9C27B0" />
            <ellipse cx="100" cy="130" rx="25" ry="15" fill="#9C27B0" />
            
            {/* Head */}
            <circle cx="100" cy="70" r="30" fill={skinTone} />
            
            {/* Hair - long */}
            <ellipse cx="100" cy="55" rx="35" ry="25" fill="#6D4C41" />
            <path d="M 65 70 Q 60 100 65 120" stroke="#6D4C41" strokeWidth="8" fill="none" />
            <path d="M 135 70 Q 140 100 135 120" stroke="#6D4C41" strokeWidth="8" fill="none" />
            
            {/* Eyes */}
            <circle cx="90" cy="70" r="3" fill="#2C3E50" />
            <circle cx="110" cy="70" r="3" fill="#2C3E50" />
            
            {/* Smile */}
            <path d="M 90 80 Q 100 85 110 80" stroke="#E91E63" strokeWidth="2" fill="none" />
            
            {/* Arms - thin */}
            <rect x="68" y="130" width="8" height="35" rx="4" fill={skinTone} />
            <rect x="124" y="130" width="8" height="35" rx="4" fill={skinTone} />
          </svg>
        );

      case "female-normal":
        return (
          <svg {...baseProps}>
            {/* Background circle */}
            <circle cx="100" cy="100" r="95" fill="#E1F5FE" />
            
            {/* Normal body - dress */}
            <path d="M 70 125 L 100 190 L 130 125 Z" fill="#00BCD4" />
            <ellipse cx="100" cy="135" rx="30" ry="18" fill="#00BCD4" />
            
            {/* Head */}
            <circle cx="100" cy="70" r="32" fill={skinTone} />
            
            {/* Hair - long */}
            <ellipse cx="100" cy="55" rx="37" ry="27" fill="#6D4C41" />
            <path d="M 63 70 Q 58 105 63 130" stroke="#6D4C41" strokeWidth="10" fill="none" />
            <path d="M 137 70 Q 142 105 137 130" stroke="#6D4C41" strokeWidth="10" fill="none" />
            
            {/* Eyes */}
            <circle cx="90" cy="70" r="3" fill="#2C3E50" />
            <circle cx="110" cy="70" r="3" fill="#2C3E50" />
            
            {/* Smile */}
            <path d="M 88 82 Q 100 88 112 82" stroke="#E91E63" strokeWidth="2" fill="none" />
            
            {/* Arms - normal */}
            <rect x="60" y="135" width="12" height="40" rx="6" fill={skinTone} />
            <rect x="128" y="135" width="12" height="40" rx="6" fill={skinTone} />
          </svg>
        );

      case "female-overweight":
        return (
          <svg {...baseProps}>
            {/* Background circle */}
            <circle cx="100" cy="100" r="95" fill="#FFF9C4" />
            
            {/* Overweight body - dress */}
            <path d="M 60 130 L 100 190 L 140 130 Z" fill="#FFC107" />
            <ellipse cx="100" cy="140" rx="40" ry="22" fill="#FFC107" />
            
            {/* Head */}
            <circle cx="100" cy="70" r="34" fill={skinTone} />
            
            {/* Hair - long */}
            <ellipse cx="100" cy="55" rx="39" ry="29" fill="#6D4C41" />
            <path d="M 61 70 Q 55 110 61 135" stroke="#6D4C41" strokeWidth="12" fill="none" />
            <path d="M 139 70 Q 145 110 139 135" stroke="#6D4C41" strokeWidth="12" fill="none" />
            
            {/* Eyes */}
            <circle cx="90" cy="70" r="3" fill="#2C3E50" />
            <circle cx="110" cy="70" r="3" fill="#2C3E50" />
            
            {/* Smile */}
            <path d="M 88 82 Q 100 87 112 82" stroke="#E91E63" strokeWidth="2" fill="none" />
            
            {/* Arms - thicker */}
            <rect x="50" y="140" width="15" height="40" rx="7" fill={skinTone} />
            <rect x="135" y="140" width="15" height="40" rx="7" fill={skinTone} />
          </svg>
        );

      case "female-obese":
        return (
          <svg {...baseProps}>
            {/* Background circle */}
            <circle cx="100" cy="100" r="95" fill="#FCE4EC" />
            
            {/* Obese body - dress */}
            <path d="M 50 140 L 100 190 L 150 140 Z" fill="#E91E63" />
            <ellipse cx="100" cy="145" rx="50" ry="25" fill="#E91E63" />
            
            {/* Head */}
            <circle cx="100" cy="68" r="36" fill={skinTone} />
            
            {/* Hair - long */}
            <ellipse cx="100" cy="52" rx="41" ry="31" fill="#6D4C41" />
            <path d="M 59 68 Q 52 115 59 145" stroke="#6D4C41" strokeWidth="14" fill="none" />
            <path d="M 141 68 Q 148 115 141 145" stroke="#6D4C41" strokeWidth="14" fill="none" />
            
            {/* Eyes */}
            <circle cx="88" cy="68" r="3" fill="#2C3E50" />
            <circle cx="112" cy="68" r="3" fill="#2C3E50" />
            
            {/* Smile */}
            <path d="M 86 80 Q 100 84 114 80" stroke="#E91E63" strokeWidth="2" fill="none" />
            
            {/* Arms - thick */}
            <rect x="40" y="145" width="18" height="40" rx="9" fill={skinTone} />
            <rect x="142" y="145" width="18" height="40" rx="9" fill={skinTone} />
          </svg>
        );

      default:
        return (
          <svg {...baseProps}>
            <circle cx="100" cy="100" r="95" fill="#F5F5F5" />
            <circle cx="100" cy="80" r="40" fill="#BDBDBD" />
            <circle cx="100" cy="150" r="50" fill="#9E9E9E" />
            <text x="100" y="110" textAnchor="middle" fontSize="24" fill="#757575">?</text>
          </svg>
        );
    }
  };

  return (
    <div className="flex items-center justify-center">
      {getAvatarSVG()}
    </div>
  );
};

export default Avatar;

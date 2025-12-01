import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Trash2, Archive, ChevronLeft, ChevronRight } from "lucide-react";

const SwipeableCard = ({ 
  children, 
  onDelete, 
  onArchive, 
  onClick,
  showHint = false,
  language = 'ar',
  enableSwipeHint = true
}) => {
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Show hint on first load for mobile
    if (showHint && enableSwipeHint) {
      const hintShown = localStorage.getItem('swipe_hint_shown');
      if (!hintShown && window.innerWidth < 768) {
        setShowSwipeHint(true);
        setTimeout(() => {
          setShowSwipeHint(false);
          localStorage.setItem('swipe_hint_shown', 'true');
        }, 4000);
      }
    }
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [showHint, enableSwipeHint]);
  
  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-200, 0, 200],
    ["rgba(239, 68, 68, 0.8)", "transparent", "rgba(59, 130, 246, 0.8)"]
  );

  const handleDragEnd = (event, info) => {
    if (!isMobile) {
      x.set(0);
      return;
    }
    
    const threshold = 150;
    
    if (info.offset.x > threshold && onDelete) {
      // Swipe right - Delete
      onDelete();
    } else if (info.offset.x < -threshold && onArchive) {
      // Swipe left - Archive
      onArchive();
    } else {
      // Return to original position
      x.set(0);
    }
  };

  return (
    <div className="relative">
      {/* Swipe Hint - Only on mobile */}
      {showSwipeHint && isMobile && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute -top-14 left-0 right-0 z-20 flex justify-center"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs md:text-sm py-2 px-4 rounded-full shadow-lg flex items-center gap-2">
            <ChevronRight className="w-4 h-4 animate-pulse" />
            <span className="font-medium">
              {language === 'ar' 
                ? '← مرر لليمين أو اليسار للتصفح →' 
                : '← Swipe left or right to browse →'}
            </span>
            <ChevronLeft className="w-4 h-4 animate-pulse" />
          </div>
        </motion.div>
      )}
      
      <div className="relative overflow-hidden">
        {/* Background indicators */}
        <motion.div
          className="absolute inset-0 flex items-center justify-between px-6"
          style={{ background }}
        >
          <div className="flex items-center gap-2 text-white">
            <Trash2 className="w-6 h-6" />
            <span className="font-semibold">{language === 'ar' ? 'حذف' : 'Delete'}</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <span className="font-semibold">{language === 'ar' ? 'أرشفة' : 'Archive'}</span>
            <Archive className="w-6 h-6" />
          </div>
        </motion.div>

        {/* Draggable card */}
        <motion.div
          drag={isMobile ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.5}
          style={{ x }}
          onDragEnd={handleDragEnd}
          onClick={onClick}
          whileTap={{ scale: 0.98 }}
          className={`relative z-10 ${onClick ? 'cursor-pointer' : ''}`}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default SwipeableCard;

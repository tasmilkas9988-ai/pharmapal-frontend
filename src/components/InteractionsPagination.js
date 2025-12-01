import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

const InteractionsPagination = ({ text, language }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);

  // Split text into lines and group into pages (8 lines per page for better readability)
  const lines = text.split('\n').filter(line => line.trim() !== '');
  const linesPerPage = 8;
  const pages = [];
  
  for (let i = 0; i < lines.length; i += linesPerPage) {
    pages.push(lines.slice(i, i + linesPerPage));
  }

  const totalPages = pages.length;

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setDirection(1);
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage(currentPage - 1);
    }
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="relative">
      {/* Pages Container */}
      <div className="relative overflow-hidden min-h-[200px] bg-white rounded-lg p-6">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentPage}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                nextPage();
              } else if (swipe > swipeConfidenceThreshold) {
                prevPage();
              }
            }}
            className="absolute w-full"
          >
            <div className="space-y-2">
              {pages[currentPage]?.map((line, idx) => {
                // Check if line contains emojis or special markers
                const isHeader = line.includes('━') || line.includes('**');
                const hasEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(line);
                const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
                
                return (
                  <p 
                    key={idx} 
                    className={`text-sm leading-relaxed ${
                      isHeader 
                        ? 'font-bold text-gray-900 text-center' 
                        : isBullet
                        ? 'text-gray-700 pl-2'
                        : 'text-gray-800'
                    }`}
                    style={{ 
                      minHeight: '1.5rem',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word'
                    }}
                  >
                    {line}
                  </p>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            disabled={currentPage === 0}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            {language === "ar" ? "السابق" : "Previous"}
          </Button>

          {/* Page Indicators */}
          <div className="flex items-center gap-2">
            {pages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentPage ? 1 : -1);
                  setCurrentPage(idx);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentPage 
                    ? 'bg-blue-600 w-6' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`${language === "ar" ? "الصفحة" : "Page"} ${idx + 1}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            className="flex items-center gap-1"
          >
            {language === "ar" ? "التالي" : "Next"}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Page Counter */}
      {totalPages > 1 && (
        <div className="text-center mt-2 text-xs text-gray-500">
          {language === "ar" 
            ? `الصفحة ${currentPage + 1} من ${totalPages}`
            : `Page ${currentPage + 1} of ${totalPages}`}
        </div>
      )}

      {/* Swipe Hint */}
      {totalPages > 1 && currentPage === 0 && (
        <div className="text-center mt-2 text-xs text-gray-400 italic">
          {language === "ar" 
            ? "👆 اسحب يميناً أو يساراً للتنقل"
            : "👆 Swipe left or right to navigate"}
        </div>
      )}
    </div>
  );
};

export default InteractionsPagination;

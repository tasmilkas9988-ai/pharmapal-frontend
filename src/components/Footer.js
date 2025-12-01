import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, AlertTriangle } from 'lucide-react';

export default function Footer({ language = 'en' }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Show footer ONLY on homepage "/"
  if (location.pathname !== "/") {
    return null;
  }

  // Function to save scroll position before navigating
  const handleNavigateToLegal = (path) => {
    const scrollPosition = window.scrollY || window.pageYOffset;
    sessionStorage.setItem('previousScrollPosition', scrollPosition.toString());
    navigate(path);
  };

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div
          dir={language === "ar" ? "rtl" : "ltr"}
          className="w-full flex flex-col gap-10"
        >

          {/* --- القسم الأول: قانوني --- */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              <span className="font-semibold text-white">
                {language === "ar" ? "قانوني" : "Legal"}
              </span>
            </div>

            <div className="flex flex-col text-gray-200 text-sm gap-2">
              <button
                onClick={() => handleNavigateToLegal('/about')}
                className="hover:text-emerald-400 transition-colors text-left rtl:text-right"
              >
                {language === "ar" ? "من نحن" : "About Us"}
              </button>

              <button
                onClick={() => handleNavigateToLegal('/privacy-policy')}
                className="hover:text-emerald-400 transition-colors text-left rtl:text-right"
              >
                {language === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
              </button>

              <button
                onClick={() => handleNavigateToLegal('/terms-of-service')}
                className="hover:text-emerald-400 transition-colors text-left rtl:text-right"
              >
                {language === "ar" ? "شروط الاستخدام" : "Terms of Use"}
              </button>

              <button
                onClick={() => handleNavigateToLegal('/medical-disclaimer')}
                className="hover:text-emerald-400 transition-colors text-left rtl:text-right"
              >
                {language === "ar" ? "إخلاء المسؤولية الطبية" : "Medical Disclaimer"}
              </button>

              <button
                onClick={() => handleNavigateToLegal('/refund-policy')}
                className="hover:text-emerald-400 transition-colors text-left rtl:text-right"
              >
                {language === "ar" ? "سياسة الاسترجاع" : "Refund Policy"}
              </button>
            </div>
          </div>


          {/* --- القسم الثاني: تنويه هام --- */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span className="font-semibold text-white">
                {language === "ar" ? "تنويه هام" : "Important Notice"}
              </span>
            </div>

            <div className="rounded-xl border border-amber-500 bg-amber-900/40 px-4 py-3 text-sm text-gray-100 leading-relaxed">
              {language === "ar" ? (
                <>
                  تنويه: <span className="font-semibold">PharmaPal</span> للإرشاد فقط
                  وليس بديلاً عن الاستشارة الطبية. في حالات الطوارئ، اتصل بالإسعاف
                  <span className="font-bold"> 997 </span>.
                </>
              ) : (
                <>
                  Note: <span className="font-semibold">PharmaPal</span> is for guidance only
                  and not a substitute for medical consultation. In emergencies, call
                  <span className="font-bold"> 911 </span>.
                </>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} فارما بال أونلاين. {language === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}
          </p>
        </div>
      </div>
    </footer>
  );
}

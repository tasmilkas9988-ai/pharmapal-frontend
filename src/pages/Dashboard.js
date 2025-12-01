import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { API } from "../App";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";
import { X, Moon, Sun, Sparkles, Activity, AlertTriangle, LogOut, Clock, Bell, Camera, Search, Plus, Menu, Image as ImageIcon, Pill, ChevronLeft, ChevronRight, Crown, RefreshCw } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import Webcam from "react-webcam";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import Avatar from "../components/Avatar";
import Footer from "../components/Footer";
import MedicationIcon from "../components/MedicationIcon";
import NotificationPermissionDialog from "../components/NotificationPermissionDialog";
import ActionCard from "../components/ActionCard";
import ScanOptionsDialog from "../components/ScanOptionsDialog";
import CircleStatCard from "../components/CircleStatCard";
import ProfessionalStatCard from "../components/ProfessionalStatCard";
import BottomNav from "../components/BottomNav";
import AppTour from "../components/AppTour";
import WelcomeTourDialog from "../components/WelcomeTourDialog";
import AppTourIOS from "../components/AppTourIOS";

// Translation helpers
const translateFrequency = (frequency) => {
  const translations = {
    'As directed': 'حسب التوجيهات',
    'Once daily': 'مرة واحدة يومياً',
    'Twice daily': 'مرتين يومياً',
    'Three times daily': 'ثلاث مرات يومياً',
    'Four times daily': 'أربع مرات يومياً',
    'Every 4 hours': 'كل 4 ساعات',
    'Every 6 hours': 'كل 6 ساعات',
    'Every 8 hours': 'كل 8 ساعات',
    'Every 12 hours': 'كل 12 ساعة',
    'Before meals': 'قبل الوجبات',
    'After meals': 'بعد الوجبات',
    'With meals': 'مع الوجبات',
    'At bedtime': 'عند النوم',
    'As needed': 'عند الحاجة'
  };
  return translations[frequency] || frequency;
};

const normalizeMedication = (med) => {
  const packageSize =
    med.package_size ??
    med.pack ??
    med.pack_size ??
    med.pack_count ??
    med.pkg_size ??
    null;

  return {
    ...med,
    package_size: packageSize,
  };
};


const translateClassification = (classification) => {
  const translations = {
    'Antibiotic': 'مضاد حيوي',
    'Pain reliever': 'مسكن للألم',
    'Anti-inflammatory': 'مضاد للالتهاب',
    'NSAID': 'مضاد التهاب غير ستيرويدي',
    'Antidiabetic': 'مضاد للسكري',
    'Antihypertensive': 'خافض لضغط الدم',
    'Antihistamine': 'مضاد للهستامين',
    'Antacid': 'مضاد للحموضة',
    'Bronchodilator': 'موسع للشعب الهوائية',
    'Corticosteroid': 'كورتيكوستيرويد',
    'Beta-blocker': 'حاصرات بيتا',
    'ACE inhibitor': 'مثبط الإنزيم المحول للأنجيوتنسين',
    'Calcium channel blocker': 'حاصر قنوات الكالسيوم',
    'Diuretic': 'مدر للبول',
    'Statin': 'ستاتين',
    'Anticoagulant': 'مضاد للتخثر',
    'Antidepressant': 'مضاد للاكتئاب',
    'Antipsychotic': 'مضاد للذهان',
    'Anxiolytic': 'مضاد للقلق',
    'Antiviral': 'مضاد للفيروسات',
    'Antifungal': 'مضاد للفطريات'
  };
  return translations[classification] || classification;
};

const translateText = (text, language) => {
  if (language !== 'ar' || !text) return text;
  
  // Common medical terms translation
  const patterns = [
    { en: /take.*once daily/i, ar: 'تناول مرة واحدة يومياً' },
    { en: /take.*twice daily/i, ar: 'تناول مرتين يومياً' },
    { en: /take.*three times daily/i, ar: 'تناول ثلاث مرات يومياً' },
    { en: /with food/i, ar: 'مع الطعام' },
    { en: /before food/i, ar: 'قبل الطعام' },
    { en: /after food/i, ar: 'بعد الطعام' },
    { en: /at consistent time/i, ar: 'في وقت ثابت' },
    { en: /morning/i, ar: 'صباحاً' },
    { en: /evening/i, ar: 'مساءً' },
    { en: /bedtime/i, ar: 'قبل النوم' },
    { en: /before meals/i, ar: 'قبل الوجبات' },
    { en: /after meals/i, ar: 'بعد الوجبات' }
  ];
  
  let translated = text;
  patterns.forEach(pattern => {
    if (pattern.en.test(translated)) {
      translated = translated.replace(pattern.en, pattern.ar);
    }
  });
  
  return translated;
};

const Dashboard = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null); // Native camera input for mobile
  const [medications, setMedications] = useState([]);
  const [userMedications, setUserMedications] = useState([]);
  const [healthData, setHealthData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [webcamError, setWebcamError] = useState(null);
  const [isMobile, setIsMobile] = useState(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  });
  const [recognizing, setRecognizing] = useState(false);
  const [showCameraOptions, setShowCameraOptions] = useState(false);
  const [showAddMedication, setShowAddMedication] = useState(false);
  const [newMedication, setNewMedication] = useState({
    brand_name: "",
    active_ingredient: "",
    condition: "",
    prescribed_dosage: "",
    frequency: "",
    times: ["08:00", "20:00"],
    start_date: new Date().toISOString().split('T')[0],
    notes: ""
  });
  const [recognitionResult, setRecognitionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState(
    localStorage.getItem("preferredLanguage") || user?.language || "ar"
  );
  const [upcomingDosesCount, setUpcomingDosesCount] = useState(0);
  const [showDosesModal, setShowDosesModal] = useState(false);
  
  // Mobile device detection is now done in useState initialization above
  
  // Auto-hide recognition result after 10 seconds and clean up captured image
  // Disable dark mode on dashboard
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', 'false');
  }, []);

  useEffect(() => {
    if (recognitionResult) {
      const timer = setTimeout(() => {
        setRecognitionResult(null);
        setCapturedImage(null); // Clear captured image to allow new scans
      }, 10000); // 10 seconds
      
      return () => clearTimeout(timer); // Cleanup on unmount or when recognitionResult changes
    }
  }, [recognitionResult]);
  const [notificationPermission, setNotificationPermission] = useState("default");
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [showMedicationDetails, setShowMedicationDetails] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState({
    terms: false,
    privacy: false,
    medical: false
  });
  const [showTour, setShowTour] = useState(false);
  const [showWelcomeSection, setShowWelcomeSection] = useState(true);
  const [showWelcomeTourDialog, setShowWelcomeTourDialog] = useState(false);
  const [selectedMedicationDetails, setSelectedMedicationDetails] = useState(null);
  const [wikipediaInfo, setWikipediaInfo] = useState(null);
  const [loadingWikipediaInfo, setLoadingWikipediaInfo] = useState(false);
  // Force always start from 0
  const [activeRemindersCount, setActiveRemindersCount] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [medicationToDelete, setMedicationToDelete] = useState(null);
  const [showArchive, setShowArchive] = useState(false);
  const [archivedMedications, setArchivedMedications] = useState([]);
  const [drugInteractions, setDrugInteractions] = useState(null);
  const [checkingInteractions, setCheckingInteractions] = useState(false);
  const [clearingCache, setClearingCache] = useState(false);
  const [showInteractionsDialog, setShowInteractionsDialog] = useState(false);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [showScanOptions, setShowScanOptions] = useState(false);
  
  // SFDA Search states
  const [sfdaSearchQuery, setSfdaSearchQuery] = useState("");
  const [sfdaSearchResults, setSfdaSearchResults] = useState([]);
  const [loadingSfdaSearch, setLoadingSfdaSearch] = useState(false);
  const [showSfdaResults, setShowSfdaResults] = useState(false);
  const [sfdaMedicationPrice, setSfdaMedicationPrice] = useState(null);
  const [loadingSfdaPrice, setLoadingSfdaPrice] = useState(false);
  
  // Reminders states
  const [showRemindersModal, setShowRemindersModal] = useState(false);
  const [currentReminderMed, setCurrentReminderMed] = useState(null);
  const [currentReminder, setCurrentReminder] = useState(null);
  const [reminderTimesEdit, setReminderTimesEdit] = useState(['08:00', '20:00']);
  const [loadingReminder, setLoadingReminder] = useState(false);
  // View mode code removed

  // User limits tracking
  const [userLimits, setUserLimits] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Ref for medication carousel scroll container
  const carouselRef = useRef(null);

  // Mouse drag functionality for carousel
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    
    let isDown = false;
    let startX;
    let scrollLeft;
    
    const handleMouseDown = (e) => {
      isDown = true;
      el.style.cursor = 'grabbing';
      el.style.userSelect = 'none';
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };
    
    const handleMouseLeave = () => {
      isDown = false;
      el.style.cursor = 'grab';
      el.style.userSelect = 'auto';
    };
    
    const handleMouseUp = () => {
      isDown = false;
      el.style.cursor = 'grab';
      el.style.userSelect = 'auto';
    };
    
    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 2; // Scroll speed multiplier
      el.scrollLeft = scrollLeft - walk;
    };
    
    el.addEventListener('mousedown', handleMouseDown);
    el.addEventListener('mouseleave', handleMouseLeave);
    el.addEventListener('mouseup', handleMouseUp);
    el.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      el.removeEventListener('mousedown', handleMouseDown);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.removeEventListener('mouseup', handleMouseUp);
      el.removeEventListener('mousemove', handleMouseMove);
    };
  }, [userMedications]); // Re-attach listeners when medications change

  // Check if user should see welcome section and tour
  useEffect(() => {
    const tourCompleted = localStorage.getItem('tourCompleted');
    const termsAcceptedInStorage = localStorage.getItem('termsAccepted');
    const welcomeTourSeen = localStorage.getItem('welcomeTourSeen');
    
    // Hide welcome section if user has dismissed it or completed tour
    if (tourCompleted) {
      setShowWelcomeSection(false);
    }
    
    // Show welcome tour dialog only once after terms are accepted
    // This dialog will ask if user wants to take the tour
    if (!welcomeTourSeen && user && termsAcceptedInStorage === 'true') {
      // Show welcome dialog after a short delay
      setTimeout(() => {
        setShowWelcomeTourDialog(true);
      }, 500);
    }
  }, [user]);

  // Listen for add medication event from BottomNav - STABLE VERSION
  useEffect(() => {
    const handleOpenAddMedication = (event) => {
      console.log('🎯 [Dashboard] Received openAddMedication event:', event.detail);
      
      const method = event.detail?.method;
      
      // Immediately close all modals
      setShowMedicationDetails(false);
      setShowInteractionsDialog(false);
      setShowDeleteConfirm(false);
      setShowRemindersModal(false);
      setShowUpgradeModal(false);
      setShowScanOptions(false);
      setShowCameraOptions(false);
      setCapturedImage(null);
      setRecognitionResult(null);
      setWebcamError(null);
      
      // Check if user has accepted terms first
      if (user && !user.has_accepted_terms) {
        console.log('⚠️ [Dashboard] User has not accepted terms, showing terms dialog');
        setShowTermsDialog(true);
        // Store the intended action for after terms are accepted
        sessionStorage.setItem('pendingAction', JSON.stringify({ method }));
        return;
      }
      
      // Open the correct modal based on method
      if (method === 'search') {
        console.log('✅ [Dashboard] Opening search modal');
        setShowCamera(false);
        setShowScanOptions(false);
        setShowAddMedication(true);
      } else if (method === 'scan') {
        console.log('✅ [Dashboard] Opening scan options dialog');
        setShowAddMedication(false);
        setShowCamera(false);
        setShowScanOptions(true);
      } else {
        console.log('✅ [Dashboard] Opening search modal (default)');
        setShowCamera(false);
        setShowScanOptions(false);
        setShowAddMedication(true);
      }
    };
    
    console.log('🔗 [Dashboard] Adding openAddMedication event listener');
    window.addEventListener('openAddMedication', handleOpenAddMedication);
    
    return () => {
      console.log('🔗 [Dashboard] Removing openAddMedication event listener');
      window.removeEventListener('openAddMedication', handleOpenAddMedication);
    };
  }, []);

  // Fetch reminders count - ONLY counts actual reminders from API
  const fetchActiveRemindersCount = async () => {
    console.log('🔍 [FETCH] Starting fetchActiveRemindersCount...');
    
    try {
      const token = localStorage.getItem('token');
      const timestamp = Date.now();
      const url = `${API}/reminders?t=${timestamp}`;
      
      console.log('🔍 [FETCH] Calling:', url);
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('📦 [FETCH] Raw response.data:', JSON.stringify(response.data));
      
      // Count ONLY enabled reminders
      const count = Array.isArray(response.data) 
        ? response.data.filter(r => r && r.enabled === true).length 
        : 0;
      
      console.log(`✅ [FETCH] Setting count to: ${count}`);
      console.log(`📊 [FETCH] Total reminders: ${response.data?.length || 0}, Enabled: ${count}`);
      
      // FORCE set to exact count
      setActiveRemindersCount(count);
      
      // Verify after set
      setTimeout(() => {
        console.log('🔍 [VERIFY] State should now be:', count);
      }, 100);
      
    } catch (error) {
      console.error('❌ [FETCH] Error:', error);
      setActiveRemindersCount(0);
    }
  };

  // Fetch total daily doses count (sum of all medications' daily doses)
  const fetchUpcomingDosesCount = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Get medications with dosage info
      const medsResponse = await axios.get(`${API}/user-medications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const medications = medsResponse.data || [];
      
      // Calculate total daily doses
      let totalDailyDoses = 0;
      const medicationsWithDoses = [];
      
      medications.forEach(med => {
        if (med.user_dosage_confirmed && med.user_dosage_info) {
          const timesPerDay = parseInt(med.user_dosage_info.times_per_day) || 0;
          
          if (timesPerDay > 0) {
            totalDailyDoses += timesPerDay;
            medicationsWithDoses.push({
              name: med.brand_name || med.trade_name || med.condition,
              dailyDoses: timesPerDay,
              pillsPerDay: med.user_dosage_info.pills_per_day || 0
            });
          }
        }
      });
      
      setUpcomingDosesCount(totalDailyDoses);
      
      // Store medications with doses for modal display
      window.todayDosesDetails = medicationsWithDoses;
      
      console.log('📊 [DOSES] Total daily doses:', totalDailyDoses);
      console.log('📋 [DOSES] Medications with doses:', medicationsWithDoses);
    } catch (error) {
      console.error('❌ [DOSES] Error fetching doses count:', error);
      setUpcomingDosesCount(0);
    }
  };

  // Hard Reset - Clear cache and reload
  useEffect(() => {
    fetchUserMedications();
    fetchHealthData();
    fetchProfileData();
    fetchUserLimits();
    fetchActiveRemindersCount();
    fetchUpcomingDosesCount();
    
    // Check notification permission
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
    
    // Check if user has accepted terms (check both user object and localStorage)
    const termsAcceptedInStorage = localStorage.getItem('termsAccepted');
    if (user && !user.has_accepted_terms && termsAcceptedInStorage !== 'true') {
      setShowTermsDialog(true);
    } else if (user && termsAcceptedInStorage === 'true' && !user.has_accepted_terms) {
      // Update user object if localStorage says terms are accepted but user object doesn't
      setUser({ ...user, has_accepted_terms: true });
    }
    
    // Restore scroll position when returning from legal pages
    const savedScrollPosition = sessionStorage.getItem('previousScrollPosition');
    if (savedScrollPosition) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScrollPosition));
        sessionStorage.removeItem('previousScrollPosition');
      }, 100);
    }
    
    // Listen for medication deletion events to update reminders counter
    const handleMedicationDeleted = (event) => {
      console.log('🗑️ [Dashboard] Medication deleted event received:', event.detail);
      // Refresh reminders count
      fetchActiveRemindersCount();
      // Also refresh medications list
      fetchUserMedications();
    };
    
    // Listen for reminder deletion events to update counter
    const handleReminderDeleted = (event) => {
      console.log('🗑️ [Dashboard] Reminder deleted event received:', event.detail);
      // Refresh reminders count
      fetchActiveRemindersCount();
      // Refresh upcoming doses count
      fetchUpcomingDosesCount();
    };
    
    // Listen for reminder creation events to update counters
    const handleReminderCreated = (event) => {
      console.log('✅ [Dashboard] Reminder created event received:', event.detail);
      // Refresh reminders count
      fetchActiveRemindersCount();
      // Refresh upcoming doses count
      fetchUpcomingDosesCount();
    };
    
    window.addEventListener('medicationDeleted', handleMedicationDeleted);
    window.addEventListener('reminderDeleted', handleReminderDeleted);
    window.addEventListener('reminderCreated', handleReminderCreated);
    
    // Cleanup
    return () => {
      window.removeEventListener('medicationDeleted', handleMedicationDeleted);
      window.removeEventListener('reminderDeleted', handleReminderDeleted);
      window.removeEventListener('reminderCreated', handleReminderCreated);
    };
  }, []);

  // Handle navigation state from other pages
  useEffect(() => {
    if (location.state?.openModal) {
      console.log('📍 [Dashboard] Received navigation state:', location.state);
      const method = location.state.method || 'search';
      
      // Clear navigation state
      navigate(location.pathname, { replace: true, state: {} });
      
      // Open the appropriate modal
      setTimeout(() => {
        if (method === 'search') {
          console.log('✅ [Dashboard] Opening search modal from navigation');
          setShowAddMedication(true);
        } else if (method === 'scan') {
          console.log('✅ [Dashboard] Opening scan options dialog from navigation');
          setShowScanOptions(true);
        }
      }, 100);
    }
  }, [location.state, navigate, location.pathname]);

  // Re-check drug interactions when language changes
  useEffect(() => {
    if (userMedications.length > 1) {
      checkDrugInteractions(userMedications);
    }
  }, [language]);

  const fetchUserLimits = async () => {
    try {
      const response = await axios.get(`${API}/user/limits`);
      if (response.data.success) {
        setUserLimits(response.data);
      }
    } catch (error) {
      console.error('Error fetching user limits:', error);
    }
  };

  const acceptTerms = async () => {
    // Check if all checkboxes are checked
    if (!termsAccepted.terms || !termsAccepted.privacy || !termsAccepted.medical) {
      alert(language === 'ar' 
        ? 'يرجى الموافقة على جميع الشروط للمتابعة' 
        : 'Please accept all terms to continue');
      return;
    }

    // Close dialog immediately
    setShowTermsDialog(false);
    
    // Save acceptance in localStorage FIRST (before API call)
    localStorage.setItem('termsAccepted', 'true');
    
    // Update user object in state
    const updatedUser = { ...user, has_accepted_terms: true };
    setUser(updatedUser);
    
    // Update user object in localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Show welcome tour dialog after accepting terms
    setTimeout(() => {
      setShowWelcomeTourDialog(true);
    }, 500);
    
    // Try to save to backend (but don't fail if it doesn't work)
    try {
      await axios.post(`${API}/accept-terms`);
    } catch (error) {
      console.error('Error saving terms to backend (non-critical):', error);
      // Continue anyway - localStorage save is what matters for UX
    }
    
    // Show tour for new users after accepting terms
    const tourCompleted = localStorage.getItem('tourCompleted');
    if (!tourCompleted && userMedications.length < 3) {
      setTimeout(() => {
        setShowTour(true);
      }, 500);
    }
    
    // Check if there's a pending action
    const pendingActionStr = sessionStorage.getItem('pendingAction');
    if (pendingActionStr) {
      try {
        const pendingAction = JSON.parse(pendingActionStr);
        sessionStorage.removeItem('pendingAction');
        
        // Execute the pending action after a short delay
        setTimeout(() => {
          if (pendingAction.method === 'search') {
            setShowAddMedication(true);
          } else if (pendingAction.method === 'scan') {
            setShowScanOptions(true);
          }
        }, 300);
      } catch (e) {
        console.error('Error parsing pending action:', e);
      }
    }
  };


  const checkCanAddMedication = () => {
    if (!userLimits || userLimits.is_premium) {
      return true; // Premium users have no limits
    }

    const remainingMeds = userLimits.limits?.medications?.remaining || 0;
    return remainingMeds > 0;
  };

  const showLimitReachedMessage = (type = 'medications') => {
    // Clear any existing recognition result or captured image
    setRecognitionResult(null);
    setCapturedImage(null);
    setShowCamera(false);
    
    const messages = {
      ar: {
        medications: 'لقد استنفذت محاولاتك الـ3 لإضافة الأدوية\n\nالمستخدمون المجانيون لديهم 3 محاولات فقط لإضافة الأدوية.\nحتى لو قمت بحذف الأدوية، لا يمكنك إضافة المزيد.\n\n💎 اشترك في Premium للحصول على:\n• أدوية غير محدودة\n• عمليات بحث غير محدودة\n• تنبيهات دائمة\n\nأو تواصل مع الإدارة للمساعدة',
        searches: 'لقد استنفذت عمليات البحث المتاحة (3 عمليات)\n\n💎 اشترك في Premium للحصول على عمليات بحث غير محدودة!'
      },
      en: {
        medications: 'You have exhausted your 3 attempts to add medications\n\nFree users have only 3 attempts to add medications.\nEven if you delete medications, you cannot add more.\n\n💎 Upgrade to Premium to get:\n• Unlimited medications\n• Unlimited searches\n• Permanent reminders\n\nOr contact admin for assistance',
        searches: 'You have exhausted available searches (3 searches)\n\n💎 Upgrade to Premium for unlimited searches!'
      }
    };

    const lang = language === 'ar' ? 'ar' : 'en';
    alert(messages[lang][type]);
    setShowUpgradeModal(true);
  };

  const fetchUserMedications = async () => {
    try {
      const response = await axios.get(`${API}/user-medications`);
      console.log("📦 Fetched medications (raw):", response.data);
      
      // Normalize medications to ensure package_size is set
      const normalizedMedications = response.data.map(normalizeMedication);
      
      normalizedMedications.forEach((med, idx) => {
        console.log(`Medication ${idx + 1}: ${med.brand_name}`, {
          package_size: med.package_size,
          frequency: med.frequency,
          pack: med.pack
        });
      });
      
      setUserMedications(normalizedMedications);
      // Refresh limits after fetching medications
      fetchUserLimits();
      
      // Auto-check drug interactions when medications are fetched
      if (response.data.length > 1) {
        checkDrugInteractions(response.data);
      }
    } catch (error) {
      console.error("Error fetching user medications:", error);
    }
  };

  const checkDrugInteractions = async (medications) => {
    if (!medications || medications.length < 2) {
      setDrugInteractions(null);
      return;
    }

    setCheckingInteractions(true);
    try {
      // Map medications with ACTIVE INGREDIENT as priority for accurate interaction checking
      const medList = medications.map(med => ({
        brand_name: med.brand_name || med.condition,  // Use brand_name field or fallback to condition
        active_ingredient: med.active_ingredient || '',  // CRITICAL: Active ingredient for interaction analysis
        name: med.brand_name || med.condition,  // For backward compatibility
        dosage: med.prescribed_dosage,
        start_date: med.start_date
      }));
      
      console.log("Checking drug interactions for:", medList);
      
      const response = await axios.post(`${API}/check-drug-interactions`, {
        medications: medList,
        language: language
      });
      
      console.log("Drug interactions response:", response.data);
      setDrugInteractions(response.data);
    } catch (error) {
      console.error("Error checking drug interactions:", error);
      toast.error(language === "ar" ? "فشل فحص التداخلات" : "Failed to check interactions");
    } finally {
      setCheckingInteractions(false);
    }
  };

  const fetchArchivedMedications = async () => {
    try {
      const response = await axios.get(`${API}/user-medications/archived`);
      setArchivedMedications(response.data);
    } catch (error) {
      console.error("Error fetching archived medications:", error);
    }
  };

  useEffect(() => {
    if (showArchive) {
      fetchArchivedMedications();
    }
  }, [showArchive]);

  // Check if this is user's first time and show notification permission dialog
  useEffect(() => {
    const hasAskedPermission = localStorage.getItem('notifications_permission_asked');
    
    if (!hasAskedPermission) {
      // Show dialog after a short delay to let page load first
      const timer = setTimeout(() => {
        setShowNotificationDialog(true);
      }, 2000); // 2 seconds delay
      
      return () => clearTimeout(timer);
    }
  }, []);

  const fetchHealthData = async () => {
    try {
      const response = await axios.get(`${API}/profile-health/latest`);
      if (response.data) {
        setHealthData(response.data);
      }
    } catch (error) {
      console.error("Error fetching health data:", error);
    }
  };

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(`${API}/profile`);
      setProfileData(response.data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === "granted") {
        toast.success("Notifications enabled!");
      }
    }
  };

  // Open reminders modal for specific medication
  const openRemindersModal = async (medication) => {
    setCurrentReminderMed(medication);
    setLoadingReminder(true);
    
    try {
      // Check if reminder exists for this medication
      const response = await axios.get(`${API}/reminders`);
      const existingReminder = response.data.find(r => r.medication_id === medication.medication_id);
      
      if (existingReminder) {
        setCurrentReminder(existingReminder);
        setReminderTimesEdit(existingReminder.reminder_times);
      } else {
        setCurrentReminder(null);
        setReminderTimesEdit(medication.times || ['08:00', '20:00']);
      }
      
      setShowRemindersModal(true);
    } catch (error) {
      console.error('Error fetching reminder:', error);
      setCurrentReminder(null);
      setReminderTimesEdit(medication.times || ['08:00', '20:00']);
      setShowRemindersModal(true);
    } finally {
      setLoadingReminder(false);
    }
  };

  // Save/Update reminder
  const saveReminder = async () => {
    if (!currentReminderMed) return;
    
    setLoadingReminder(true);
    try {
      if (currentReminder) {
        // Update existing reminder
        await axios.patch(`${API}/reminders/${currentReminder.id}`, {
          reminder_times: reminderTimesEdit
        });
        toast.success(language === 'ar' ? '✅ تم تحديث التذكير' : '✅ Reminder updated');
      } else {
        // Create new reminder
        await axios.post(`${API}/reminders`, {
          medication_id: currentReminderMed.medication_id,
          medication_name: currentReminderMed.brand_name || currentReminderMed.condition,
          reminder_times: reminderTimesEdit
        });
        toast.success(language === 'ar' ? '✅ تم إضافة التذكير' : '✅ Reminder added');
      }
      
      setShowRemindersModal(false);
    } catch (error) {
      console.error('Error saving reminder:', error);
      toast.error(language === 'ar' ? '❌ خطأ في حفظ التذكير' : '❌ Error saving reminder');
    } finally {
      setLoadingReminder(false);
    }
  };

  // Delete reminder
  const deleteReminder = async () => {
    if (!currentReminder) return;
    
    if (!window.confirm(language === 'ar' ? 'هل تريد حذف هذا التذكير؟' : 'Delete this reminder?')) {
      return;
    }
    
    setLoadingReminder(true);
    try {
      await axios.delete(`${API}/reminders/${currentReminder.id}`);
      toast.success(language === 'ar' ? '✅ تم حذف التذكير' : '✅ Reminder deleted');
      setShowRemindersModal(false);
      setCurrentReminder(null);
    } catch (error) {
      console.error('Error deleting reminder:', error);
      toast.error(language === 'ar' ? '❌ خطأ في حذف التذكير' : '❌ Error deleting reminder');
    } finally {
      setLoadingReminder(false);
    }
  };

  // Toggle reminder enabled/disabled
  const toggleReminder = async () => {
    if (!currentReminder) return;
    
    setLoadingReminder(true);
    try {
      const response = await axios.patch(`${API}/reminders/${currentReminder.id}/toggle`);
      setCurrentReminder({...currentReminder, enabled: response.data.enabled});
      toast.success(language === 'ar' ? '✅ تم التحديث' : '✅ Updated');
    } catch (error) {
      console.error('Error toggling reminder:', error);
      toast.error(language === 'ar' ? '❌ خطأ في التحديث' : '❌ Error updating');
    } finally {
      setLoadingReminder(false);
    }
  };

  // Add time slot
  const addReminderTimeSlot = () => {
    setReminderTimesEdit([...reminderTimesEdit, '12:00']);
  };

  // Update time slot
  const updateReminderTimeSlot = (index, value) => {
    const newTimes = [...reminderTimesEdit];
    newTimes[index] = value;
    setReminderTimesEdit(newTimes);
  };

  // Remove time slot
  const removeReminderTimeSlot = (index) => {
    if (reminderTimesEdit.length > 1) {
      setReminderTimesEdit(reminderTimesEdit.filter((_, i) => i !== index));
    }
  };

  const capture = useCallback(() => {
    // CRITICAL: Check medication limit FIRST before any processing
    if (!checkCanAddMedication()) {
      showLimitReachedMessage('medications');
      setShowCamera(false); // Close camera modal
      return; // Stop immediately - no image capture, no AI recognition
    }
    
    if (!webcamRef.current) {
      console.error("Webcam ref is null");
      setWebcamError(language === 'ar' 
        ? "⚠️ لا يمكن الوصول للكاميرا. الرجاء إعادة المحاولة أو استخدم 'اختيار من المعرض'." 
        : "⚠️ Cannot access camera. Please try again or use 'Choose from Gallery'."
      );
      return;
    }
    
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      console.error("Failed to capture image");
      return;
    }
    
    setCapturedImage(imageSrc);
    setShowCamera(false);
    handleImageRecognition(imageSrc);
  }, [webcamRef, language]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      // Check medication limit before processing image
      if (!checkCanAddMedication()) {
        showLimitReachedMessage('medications');
        event.target.value = ''; // Reset file input
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        setCapturedImage(base64Image);
        setShowCameraOptions(false);
        setShowCamera(false); // Close camera modal when file is selected
        handleImageRecognition(base64Image);
      };
      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        toast.error(language === 'ar' ? 'فشل في قراءة الصورة' : 'Failed to read image');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle native camera capture for mobile devices
  const handleCameraCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check medication limit before processing image
      if (!checkCanAddMedication()) {
        showLimitReachedMessage('medications');
        event.target.value = ''; // Reset file input
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        setCapturedImage(base64Image);
        setShowCamera(false);
        handleImageRecognition(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open native camera on mobile
  const openNativeCamera = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleImageRecognition = async (imageData) => {
    // Double check medication limit before processing
    if (!checkCanAddMedication()) {
      showLimitReachedMessage('medications');
      return;
    }
    
    setLoading(true);
    setRecognitionResult(null);
    
    try {
      // Convert base64 to blob
      const base64Data = imageData.split(",")[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/jpeg" });

      const formData = new FormData();
      formData.append("image", blob, "medication.jpg");
      formData.append("language", language);

      const authToken = localStorage.getItem('token');
      const response = await axios.post(`${API}/medications/recognize`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${authToken}`,
        },
        timeout: 15000, // 15 seconds timeout for comprehensive analysis
      });

      console.log("Recognition response:", response.data);
      setRecognitionResult(response.data);
      
      // Auto-submit to My Medications if recognized successfully
      if (response.data.success && response.data.auto_add_data) {
        // Pass timing_note from root level to auto_add_data
        const medDataWithTiming = {
          ...response.data.auto_add_data,
          timing_note: response.data.timing_note || response.data.auto_add_data.timing_note
        };
        await autoAddMedication(medDataWithTiming);
        toast.success(language === "ar" ? "✅ تم التعرف على الدواء وإضافته!" : "✅ Medication recognized and added!");
      } else {
        toast.warning(language === "ar" ? "⚠️ لم يتم التعرف على الدواء بوضوح. يرجى المحاولة مرة أخرى" : "⚠️ Could not recognize medication clearly. Please try again");
      }
    } catch (error) {
      console.error("Recognition error:", error);
      toast.error(language === "ar" ? "❌ فشل التعرف على الدواء. يرجى المحاولة مرة أخرى" : "❌ Failed to recognize medication. Please try again");
    } finally {
      setLoading(false);
    }
  };

  const autoAddMedication = async (medData) => {
    try {
      // Check for duplicate medication before adding
      const isDuplicate = userMedications.some(med => {
        const sameBrand = (med.brand_name || '').toLowerCase().trim() === (medData.medication_name || '').toLowerCase().trim();
        const sameIngredient = (med.active_ingredient || '').toLowerCase().trim() === (medData.active_ingredient || '').toLowerCase().trim();
        const sameDosage = (med.prescribed_dosage || '').toLowerCase().trim() === (medData.dosage_strength || '').toLowerCase().trim();
        
        // Consider it duplicate if brand name + active ingredient + dosage all match
        return sameBrand && sameIngredient && sameDosage;
      });
      
      if (isDuplicate) {
        toast.warning(
          language === "ar" 
            ? "⚠️ هذا الدواء موجود بالفعل في قائمتك" 
            : "⚠️ This medication already exists in your list",
          { duration: 4000 }
        );
        return; // Don't add duplicate
      }
      
      // Search SFDA database to get bilingual names
      let sfdaData = null;
      try {
        const authToken = localStorage.getItem('token');
        const searchResponse = await axios.get(`${API}/sfda-medications/search`, {
          params: {
            query: medData.medication_name,
            limit: 3
          },
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        
        if (searchResponse.data.success && searchResponse.data.results.length > 0) {
          // Find best match
          const results = searchResponse.data.results;
          sfdaData = results[0]; // Take first result as best match
          
          console.log("Found SFDA match:", sfdaData);
        }
      } catch (sfdaError) {
        console.log("SFDA search failed, continuing without bilingual data:", sfdaError);
      }
      
      const medicationData = {
        medication_id: `captured-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        brand_name: medData.medication_name || "Unknown",
        active_ingredient: medData.active_ingredient || "",
        condition: medData.medication_name,
        prescribed_dosage: medData.dosage_strength || "As directed",
        frequency: medData.recommended_frequency || "As directed",
        times: medData.best_times || ["08:00"], // Default to once daily if no times suggested
        start_date: new Date().toISOString().split('T')[0],
        notes: `Auto-added from image recognition`,
        classification: medData.classification || null,
        timing_note: medData.timing_note || null,
        package_size: sfdaData?.package_size || medData.package_size || null,
        dosage_form: sfdaData?.dosage_form || medData.dosage_form || null,
        strength: sfdaData?.strength || medData.strength || null,
        strength_unit: sfdaData?.strength_unit || medData.strength_unit || null,
        // Add bilingual fields from SFDA if available
        trade_name_ar: sfdaData?.trade_name_ar || null,
        scientific_name_ar: sfdaData?.scientific_name_ar || null,
        dosage_form_ar: sfdaData?.dosage_form_ar || null,
        pack_ar: sfdaData?.pack_ar || null,
        manufacturer: sfdaData?.manufacturer || null,
        manufacturer_ar: sfdaData?.manufacturer_ar || null,
        price_sar: sfdaData?.price_sar || null,
        strength_ar: sfdaData?.strength_ar || null,
        strength_unit_ar: sfdaData?.strength_unit_ar || null,
        administration_route: sfdaData?.administration_route || null,
        administration_route_ar: sfdaData?.administration_route_ar || null,
        storage_conditions: sfdaData?.storage_conditions || null,
        storage_conditions_ar: sfdaData?.storage_conditions_ar || null,
        legal_status: sfdaData?.legal_status || null,
        legal_status_ar: sfdaData?.legal_status_ar || null,
        active: true,
        archived: false
      };
      
      console.log("Adding medication with bilingual support:", medicationData);
      const response = await axios.post(`${API}/user-medications`, medicationData);
      console.log("Add response:", response.data);
      
      // Force refresh the list
      await fetchUserMedications();
      await fetchActiveRemindersCount();
      
      console.log("Medication added successfully, list refreshed");
    } catch (error) {
      console.error("Auto-add failed:", error);
      console.error("Error details:", error.response?.data);
    }
  };

  const fetchMedicationDetails = async (medication) => {
    setSelectedMedicationDetails(medication);
    setWikipediaInfo(null);
    setShowMedicationDetails(true);
    
    // Fetch Wikipedia information based on scientific name
    fetchWikipediaInfo(medication);
  };
  
  const fetchWikipediaInfo = async (medication) => {
    setLoadingWikipediaInfo(true);
    
    try {
      const token = localStorage.getItem('token');
      
      // Get both trade name and scientific name
      const tradeName = medication.trade_name || medication.brand_name || medication.condition;
      const scientificName = medication.scientific_name || 
                            medication.active_ingredient || 
                            medication.active_ingredients ||
                            medication.scientific_name_ar;
      
      if (!tradeName && !scientificName) {
        console.log("⚠️ No drug name found in medication data");
        toast.error(language === "ar" 
          ? "اسم الدواء غير متوفر" 
          : "Drug name not available");
        setLoadingWikipediaInfo(false);
        return;
      }
      
      console.log(`🤖 Fetching AI info for: ${tradeName} (${scientificName || 'N/A'})`);
      
      // Fetch from AI API - can use trade name OR scientific name
      const response = await axios.get(`${API}/ai/drug-info`, {
        params: {
          drug_name: tradeName,
          scientific_name: scientificName,
          language: language
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        console.log("✅ AI drug info fetched successfully", response.data.data);
        setWikipediaInfo(response.data.data);
      } else {
        console.log("⚠️ AI drug info not available", response.data);
        toast.info(language === "ar" 
          ? `لم يتم العثور على معلومات`
          : `No information found`);
        setWikipediaInfo(null);
      }
      
    } catch (error) {
      console.error("❌ Error fetching AI drug info:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      setWikipediaInfo(null);
      
      // Show error toast
      toast.error(language === "ar" 
        ? "حدث خطأ في جلب معلومات الدواء"
        : "Error fetching drug information");
    } finally {
      setLoadingWikipediaInfo(false);
    }
  };
  
  // Fetch SFDA price
  const fetchSfdaPrice = async (medication) => {
    console.log("PRICE REQUEST:", medication);
    setLoadingSfdaPrice(true);
    try {
      // First, try searching by trade name (brand name)
      const searchName = medication.brand_name || medication.condition;
      console.log("Search name:", searchName);
      const authToken = localStorage.getItem('token');
      let response = await axios.get(`${API}/sfda-medications/search`, {
        params: {
          query: searchName,
          limit: 5
        },
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      
      // If no results found by trade name, try searching by active ingredient
      if (!response.data.success || response.data.results.length === 0) {
        if (medication.active_ingredient) {
          console.log("No results by trade name, trying active ingredient:", medication.active_ingredient);
          response = await axios.get(`${API}/sfda-medications/search`, {
            params: {
              query: medication.active_ingredient,
              limit: 5
            },
            headers: {
              Authorization: `Bearer ${authToken}`
            }
          });
        }
      }
      
      if (response.data.success && response.data.results.length > 0) {
        // Find exact match or closest match
        const results = response.data.results;
        
        console.log("SFDA search results:", results);
        console.log("Looking for medication:", medication);
        
        // Extract dosage number from prescribed_dosage (e.g., "40mg" -> "40")
        const dosageMatch = medication.prescribed_dosage ? medication.prescribed_dosage.match(/(\d+)/g) : null;
        const dosageNumber = dosageMatch ? dosageMatch[0] : null;
        
        console.log("Extracted dosage number:", dosageNumber);
        
        // Try to find best match
        let bestMatch = null;
        
        // First: Try exact match with trade name and dosage
        if (dosageNumber) {
          bestMatch = results.find(med => {
            const medDosage = med.strength ? med.strength.match(/(\d+)/g) : null;
            const medDosageNumber = medDosage ? medDosage[0] : null;
            return med.trade_name.toLowerCase().includes(searchName.toLowerCase()) && 
                   medDosageNumber === dosageNumber;
          });
        }
        
        // Second: Try match with just trade name
        if (!bestMatch) {
          bestMatch = results.find(med => 
            med.trade_name.toLowerCase().includes(searchName.toLowerCase())
          );
        }
        
        // Third: Take first result
        if (!bestMatch) {
          bestMatch = results[0];
        }
        
        console.log("Best match found:", bestMatch);
        setSfdaMedicationPrice(bestMatch);
      }
    } catch (error) {
      console.error("Failed to fetch SFDA price:", error);
    } finally {
      setLoadingSfdaPrice(false);
    }
  };

  // SFDA Dynamic Search
  const searchSfdaMedications = async (query) => {
    if (!query || query.length < 2) {
      setSfdaSearchResults([]);
      setShowSfdaResults(false);
      return;
    }
    
    setLoadingSfdaSearch(true);
    setShowSfdaResults(true);
    
    try {
      const authToken = localStorage.getItem('token');
      const response = await axios.get(`${API}/sfda-medications/search`, {
        params: {
          query: query,
          limit: 10
        },
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      
      if (response.data.success) {
        setSfdaSearchResults(response.data.results);
      }
    } catch (error) {
      console.error("SFDA search error:", error);
      
      // Handle search limit error (403)
      if (error.response && error.response.status === 403) {
        const errorDetail = error.response.data.detail;
        if (errorDetail && errorDetail.error === 'search_limit_reached') {
          alert(`⚠️ ${language === 'ar' ? 'وصلت للحد الأقصى' : 'Search Limit Reached'}\n\n${errorDetail.message}\n\n${language === 'ar' ? '💎 اشترك في Premium للحصول على عمليات بحث غير محدودة!' : '💎 Upgrade to Premium for unlimited searches!'}`);
        }
      }
      
      setSfdaSearchResults([]);
    } finally {
      setLoadingSfdaSearch(false);
    }
  };
  
  // Debounced search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (sfdaSearchQuery) {
        searchSfdaMedications(sfdaSearchQuery);
      }
    }, 300); // Wait 300ms after user stops typing
    
    return () => clearTimeout(timer);
  }, [sfdaSearchQuery]);
  
  // Select medication from SFDA search
  const selectSfdaMedication = (medication) => {
    // Check for duplicates
    const medicationName = medication.commercial_name_en || medication.trade_name || medication.commercial_name_ar;
    const isDuplicate = medications.some(med => {
      const sameName = (med.brand_name || med.condition).toLowerCase() === medicationName.toLowerCase();
      const sameStrength = med.prescribed_dosage === (medication.strength || '').toString();
      const samePack = med.pack === medication.package_type;
      
      // Duplicate if same name AND (same strength OR same pack)
      return sameName && (sameStrength || samePack);
    });
    
    if (isDuplicate) {
      toast.error(
        language === "ar" 
          ? `⚠️ ${medicationName} موجود بالفعل بنفس التركيز أو العبوة!` 
          : `⚠️ ${medicationName} already exists with same strength or pack!`,
        { duration: 4000 }
      );
      return;
    }
    
    // Fill the form with SFDA data (bilingual support)
    setNewMedication({
      ...newMedication,
      brand_name: medicationName,
      condition: medicationName,
      active_ingredient: medication.scientific_name || medication.active_ingredients,
      prescribed_dosage: medication.strength || '',
      // Store additional SFDA info
      manufacturer: medication.manufacturer,
      pack: medication.package_type,
      price_sar: medication.price_sar,
      package_size: medication.package_size || medication.pack_size || null,
      dosage_form: medication.dosage_form || medication.pharmaceutical_form || null,
      strength: medication.strength || null,
      strength_unit: medication.strength_unit || null,
      administration_route: medication.administration_route || null,
      storage_conditions: medication.storage_conditions || null,
      legal_status: medication.legal_status || null,
      // Store bilingual fields for later display
      trade_name_ar: medication.commercial_name_ar || medication.trade_name_ar || null,
      scientific_name_ar: medication.scientific_name_ar || null,
      dosage_form_ar: medication.dosage_form_ar || null,
      pack_ar: medication.package_type_ar || medication.pack_ar || null,
      manufacturer_ar: medication.manufacturer_ar || null,
      strength_ar: medication.strength_ar || null,
      strength_unit_ar: medication.strength_unit_ar || null,
      administration_route_ar: medication.administration_route_ar || null,
      storage_conditions_ar: medication.storage_conditions_ar || null,
      legal_status_ar: medication.legal_status_ar || null
    });
    
    // Clear search
    setSfdaSearchQuery("");
    setSfdaSearchResults([]);
    setShowSfdaResults(false);
    
    toast.success(
      language === "ar" 
        ? `✅ تم تحديد ${medication.trade_name} - السعر: ${medication.price_sar} ريال` 
        : `✅ Selected ${medication.trade_name} - Price: ${medication.price_sar} SAR`,
      { duration: 3000 }
    );
  };

  const handleDeleteMedication = async (medicationId) => {
    setMedicationToDelete(medicationId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    // إغلاق نافذة التأكيد فوراً لجعل التجربة أسرع
    setShowDeleteConfirm(false);
    const tempMedicationId = medicationToDelete;
    setMedicationToDelete(null);
    
    try {
      // حذف سريع بدون انتظار
      await axios.delete(`${API}/user-medications/${tempMedicationId}`);
      toast.success(language === "ar" ? "✅ تم الحذف" : "✅ Deleted", {
        duration: 2000, // رسالة قصيرة
      });
      await fetchUserMedications();
      await fetchUserLimits(); // Ensure limits are refreshed
      await fetchActiveRemindersCount();
    } catch (error) {
      toast.error(language === "ar" ? "❌ فشل الحذف" : "❌ Delete failed");
      // في حالة الفشل، إعادة عرض البيانات
      fetchUserMedications();
    }
  };

  const handleArchiveMedication = async (medicationId) => {
    try {
      await axios.patch(`${API}/user-medications/${medicationId}/archive`);
      toast.success(language === "ar" ? "تم أرشفة الدواء" : "Medication archived");
      fetchUserMedications();
      fetchActiveRemindersCount();
      if (showArchive) {
        fetchArchivedMedications();
      }
    } catch (error) {
      toast.error(language === "ar" ? "فشلت الأرشفة" : "Failed to archive medication");
    }
  };

  const handleUnarchiveMedication = async (medicationId) => {
    try {
      await axios.patch(`${API}/user-medications/${medicationId}/unarchive`);
      toast.success(language === "ar" ? "تم استعادة الدواء" : "Medication restored");
      fetchUserMedications();
      fetchArchivedMedications();
    } catch (error) {
      toast.error(language === "ar" ? "فشلت الاستعادة" : "Failed to restore medication");
    }
  };

  const handleAddMedication = async () => {
    if (!newMedication.brand_name || !newMedication.prescribed_dosage) {
      toast.error(language === "ar" ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields");
      return;
    }
    
    try {
      const medicationData = {
        medication_id: `user-med-${Date.now()}`,
        brand_name: newMedication.brand_name,
        active_ingredient: newMedication.active_ingredient || "",
        condition: newMedication.brand_name,  // For backward compatibility
        prescribed_dosage: newMedication.prescribed_dosage,
        frequency: "As directed", // Default value since we removed the field
        times: newMedication.times,
        start_date: newMedication.start_date,
        notes: newMedication.notes,
        // SFDA data if available
        manufacturer: newMedication.manufacturer || null,
        pack: newMedication.pack || null,
        price_sar: newMedication.price_sar || null,
        package_size: newMedication.package_size || null,
        dosage_form: newMedication.dosage_form || null,
        strength: newMedication.strength || null,
        strength_unit: newMedication.strength_unit || null,
        administration_route: newMedication.administration_route || null,
        storage_conditions: newMedication.storage_conditions || null,
        legal_status: newMedication.legal_status || null,
        // Bilingual fields
        trade_name_ar: newMedication.trade_name_ar || null,
        scientific_name_ar: newMedication.scientific_name_ar || null,
        dosage_form_ar: newMedication.dosage_form_ar || null,
        pack_ar: newMedication.pack_ar || null,
        manufacturer_ar: newMedication.manufacturer_ar || null,
        strength_ar: newMedication.strength_ar || null,
        strength_unit_ar: newMedication.strength_unit_ar || null,
        administration_route_ar: newMedication.administration_route_ar || null,
        storage_conditions_ar: newMedication.storage_conditions_ar || null,
        legal_status_ar: newMedication.legal_status_ar || null
      };
      
      const response = await axios.post(`${API}/user-medications`, medicationData);
      toast.success(language === "ar" ? "تمت إضافة الدواء بنجاح" : "Medication added successfully!");
      
      // Automatically analyze medication course
      try {
        const analysisResponse = await axios.post(`${API}/analyze-medication-course`, {
          medication_name: medicationData.brand_name,
          active_ingredient: medicationData.active_ingredient,
          dosage_form: medicationData.dosage_form,
          condition: medicationData.condition
        });
        
        // Save analysis result
        await axios.put(`${API}/user-medications/${medicationData.medication_id}`, {
          courseAnalysis: analysisResponse.data
        });
        
        // Show analysis result
        if (analysisResponse.data.is_as_needed) {
          toast.info(
            language === 'ar' 
              ? `💊 ${medicationData.brand_name}: يؤخذ عند الحاجة فقط` 
              : `💊 ${medicationData.brand_name}: Take as needed only`,
            { duration: 4000 }
          );
        } else {
          toast.success(
            language === 'ar' 
              ? `✅ ${medicationData.brand_name}: كورس ${analysisResponse.data.recommended_duration} يوم` 
              : `✅ ${medicationData.brand_name}: ${analysisResponse.data.recommended_duration} days course`,
            { duration: 4000 }
          );
        }
      } catch (analysisError) {
        console.log('Auto-analysis failed:', analysisError);
        // Don't show error to user, analysis can be done manually later
      }
      
      setShowAddMedication(false);
      
      // Reset SFDA search
      setSfdaSearchQuery("");
      setSfdaSearchResults([]);
      setShowSfdaResults(false);
      
      setNewMedication({
        brand_name: "",
        active_ingredient: "",
        condition: "",
        prescribed_dosage: "",
        frequency: "",
        times: ["08:00", "20:00"],
        start_date: new Date().toISOString().split('T')[0],
        notes: ""
      });
      fetchUserMedications();
      
      // Navigate to medicines page to show the newly added medication
      navigate('/medicines');
    } catch (error) {
      toast.error(language === "ar" ? "فشلت إضافة الدواء: " + (error.response?.data?.detail || error.message) : "Failed to add medication: " + (error.response?.data?.detail || error.message));
      console.error("Add medication error:", error.response?.data || error);
    }
  };

  const handleLogout = () => {
    // Check if user is admin
    const isAdmin = user?.is_admin;
    
    if (isAdmin) {
      // Admin logout: only remove admin_role, keep token and user
      localStorage.removeItem("admin_role");
      navigate("/admin-role-selection", { replace: true });
    } else {
      // Regular user logout: remove everything
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("termsAccepted");
      localStorage.removeItem("admin_role");
      setUser(null);
      navigate("/", { replace: true });
    }
  };

  const handleClearCache = async () => {
    setClearingCache(true);
    
    try {
      // Unregister all service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (let registration of registrations) {
          await registration.unregister();
        }
      }
      
      // Clear all cache storage
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        for (let cacheName of cacheNames) {
          await caches.delete(cacheName);
        }
      }
      
      // Show success message
      toast.success(language === "ar" ? "تم مسح الذاكرة المؤقتة! سيتم إعادة تحميل التطبيق..." : "Cache cleared! Reloading app...");
      
      // Reload after 1 second
      setTimeout(() => {
        window.location.reload(true);
      }, 1000);
      
    } catch (error) {
      console.error("Error clearing cache:", error);
      toast.error(language === "ar" ? "فشل مسح الذاكرة المؤقتة" : "Failed to clear cache");
      setClearingCache(false);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setRecognitionResult(null);
    setWebcamError(null); // Reset webcam error when opening camera
    setShowCamera(true);
  };

  const content = {
    en: {
      dashboard: "Dashboard",
      myMedications: "My Medications",
      addMedication: "Drug Search",
      takePicture: "Take Picture",
      retake: "Retake",
      analyzing: "Analyzing...",
      healthData: "Health Data",
      heartRate: "Heart Rate",
      sleep: "Sleep",
      steps: "Steps",
      noMedications: "No medications added yet",
      medicationName: "Medication Name",
      dosage: "Dosage",
      frequency: "Frequency",
      times: "Times",
      startDate: "Start Date",
      notes: "Notes",
      save: "Save",
      cancel: "Cancel",
      logout: "Logout",
      welcome: "Welcome",
      recognitionResult: "Medication Details",
      aiAnalysis: "AI Analysis",
      warnings: "Warnings",
      addToSchedule: "Add to Schedule",
      enableNotifications: "Enable Reminders",
      capture: "Capture",
      close: "Close",
      setReminder: "Set Reminder",
      reminderTimes: "Reminder Times"
    },
    ar: {
      dashboard: "لوحة التحكم",
      myMedications: "أدويتي",
      addMedication: "البحث عن الدواء",
      takePicture: "التقط صورة",
      retake: "إعادة التقاط",
      analyzing: "جارٍ التحليل...",
      healthData: "البيانات الصحية",
      heartRate: "معدل ضربات القلب",
      sleep: "النوم",
      steps: "الخطوات",
      noMedications: "لم تتم إضافة أدوية بعد",
      medicationName: "اسم الدواء",
      dosage: "الجرعة",
      frequency: "التكرار",
      times: "الأوقات",
      startDate: "تاريخ البداية",
      notes: "ملاحظات",
      save: "حفظ",
      cancel: "إلغاء",
      logout: "تسجيل الخروج",
      welcome: "مرحباً",
      recognitionResult: "تفاصيل الدواء",
      aiAnalysis: "تحليل الذكاء الاصطناعي",
      warnings: "تحذيرات",
      addToSchedule: "إضافة إلى الجدول",
      enableNotifications: "تفعيل التذكيرات",
      capture: "التقاط",
      close: "إغلاق",
      setReminder: "تعيين تذكير",
      reminderTimes: "أوقات التذكير"
    },
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 pb-20" data-testid="patient-dashboard">
      {/* Navigation */}
      <nav className="glass border-b border-emerald-100 dark:border-gray-700 dark:bg-gray-800/50 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <Pill className="w-9 h-9 sm:w-10 sm:h-10 text-emerald-600 dark:text-emerald-400" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold gradient-text dark:text-white" data-testid="dashboard-title">PharmaPal</h1>
                <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  {language === "ar" 
                    ? "رفيقك الذكي لإدارة الأدوية"
                    : "Your Smart Medication Companion"}
                </p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-300 max-w-[150px] truncate" data-testid="user-welcome">
                {t.welcome}, {user?.full_name}
              </span>
              
              {!user?.is_premium && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/pricing")}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 font-semibold"
                  data-testid="pricing-btn"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {language === "ar" ? "الأسعار" : "Pricing"}
                </Button>
              )}
              
              {user?.is_premium && (
                <div className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-xs font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {language === "ar" ? "بريميوم" : "Premium"}
                </div>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/profile")}
                data-testid="profile-btn"
              >
                <Activity className="w-4 h-4 mr-2" />
                {language === "ar" ? "بياناتي" : "My Profile"}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newLang = language === "en" ? "ar" : "en";
                  setLanguage(newLang);
                  localStorage.setItem("preferredLanguage", newLang);
                }}
                data-testid="dashboard-lang-toggle"
              >
                {language === "en" ? "العربية" : "English"}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClearCache}
                disabled={clearingCache}
                className="bg-teal-50 hover:bg-teal-100 border-teal-300 text-teal-700"
                data-testid="clear-cache-btn"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {clearingCache ? (language === "ar" ? "جارٍ التحديث..." : "Updating...") : (language === "ar" ? "🔄 تحديث" : "🔄 Update")}
              </Button>
              
              {user?.is_admin && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    localStorage.removeItem('admin_role');
                    navigate('/admin-role-selection');
                  }}
                  className="bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-700"
                  data-testid="switch-mode-btn"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  {language === 'ar' ? 'تبديل' : 'Switch'}
                </Button>
              )}
              
              <Button variant="outline" size="sm" onClick={handleLogout} data-testid="logout-btn">
                <LogOut className="w-4 h-4 mr-2" />
                {t.logout}
              </Button>
            </div>

            {/* Premium Badge Button - Same style as Language button */}
            {!user?.is_premium && (
              <button
                onClick={() => navigate('/premium')}
                className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 rounded-full shadow-md hover:shadow-lg transition-all"
              >
                <Crown className="w-5 h-5 text-white" />
              </button>
            )}

            {/* Language Toggle Button - Always Visible */}
            <button
              onClick={() => {
                const newLang = language === "en" ? "ar" : "en";
                setLanguage(newLang);
                localStorage.setItem("preferredLanguage", newLang);
              }}
              className="w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all dark:bg-gray-800 dark:text-white"
            >
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                {language === "ar" ? "EN" : "ع"}
              </span>
            </button>

          </div>

          {/* Mobile Menu Removed - All options moved to Profile page */}
          {false && (
            <div className="md:hidden mt-3 pt-3 border-t border-emerald-100 space-y-2">
              <div className="text-sm text-gray-600 font-medium mb-3" data-testid="user-welcome-mobile">
                {t.welcome}, {user?.full_name}
              </div>
              
              {user?.is_premium && (
                <div className="px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-bold flex items-center gap-2 justify-center mb-2">
                  <Sparkles className="w-4 h-4" />
                  {language === "ar" ? "حساب بريميوم" : "Premium Account"}
                </div>
              )}
              
              {!user?.is_premium && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigate("/pricing");
                    setShowMobileMenu(false);
                  }}
                  className="w-full justify-start bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600"
                  data-testid="pricing-btn-mobile"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {language === "ar" ? "ترقية إلى بريميوم" : "Upgrade to Premium"}
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigate("/profile");
                  setShowMobileMenu(false);
                }}
                className="w-full justify-start"
                data-testid="profile-btn-mobile"
              >
                <Activity className="w-4 h-4 mr-2" />
                {language === "ar" ? "بياناتي الصحية" : "My Health Profile"}
              </Button>

              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  toggleTheme();
                  setShowMobileMenu(false);
                }}
                className="w-full justify-start"
              >
                {isDarkMode ? (
                  <>
                    <Sun className="w-4 h-4 mr-2" />
                    {language === "ar" ? "☀️ الوضع النهاري" : "☀️ Light Mode"}
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 mr-2" />
                    {language === "ar" ? "🌙 الوضع الليلي" : "🌙 Dark Mode"}
                  </>
                )}
              </Button>

              {/* Notifications Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowNotificationDialog(true);
                  setShowMobileMenu(false);
                }}
                className="w-full justify-start"
              >
                <Bell className="w-4 h-4 mr-2" />
                {language === "ar" ? "🔔 إعدادات الإشعارات" : "🔔 Notification Settings"}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  handleClearCache();
                  setShowMobileMenu(false);
                }}
                disabled={clearingCache}
                className="w-full justify-start bg-teal-50 hover:bg-teal-100 border-teal-300 text-teal-700"
                data-testid="clear-cache-btn-mobile"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {clearingCache ? (language === "ar" ? "جارٍ التحديث..." : "Updating...") : (language === "ar" ? "🔄 تحديث التطبيق" : "🔄 Update App")}
              </Button>
              
              {user?.is_admin && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    localStorage.removeItem('admin_role');
                    navigate('/admin-role-selection');
                    setShowMobileMenu(false);
                  }}
                  className="w-full justify-start bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-700"
                  data-testid="switch-mode-btn-mobile"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  {language === 'ar' ? 'تبديل الوضع' : 'Switch Mode'}
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  handleLogout();
                  setShowMobileMenu(false);
                }}
                className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                data-testid="logout-btn-mobile"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t.logout}
              </Button>
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">

        {/* Welcome Section - FIRST THING ON PAGE */}
        {showWelcomeSection && (
          <div className="mb-8">
            <Card className="shadow-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
              <CardContent className="py-8 px-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* Real Pharmacist Image */}
                  <div className="flex-shrink-0">
                    <img 
                      src="https://customer-assets.emergentagent.com/job_med-dashboard-fixes/artifacts/645npht4_file_0000000089e071f4ae03d7f671daff8a.png"
                      alt="Pharmacist"
                      className="w-80 h-auto rounded-3xl object-contain shadow-2xl"
                    />
                  </div>
                  
                  {/* Welcome Content */}
                  <div className="flex-1 text-center md:text-right">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {language === "ar" 
                        ? `مرحباً ${user?.full_name || ""}!` 
                        : `Welcome ${user?.full_name || ""}!`}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {language === "ar" 
                        ? "شكراً لاختيارك PharmaPal! نحن سعداء بوجودك معنا" 
                        : "Thank you for choosing PharmaPal! We're happy to have you"}
                    </p>
                    
                    <div className="bg-white rounded-lg p-4 border-2 border-teal-200">
                      <p className="text-sm text-gray-700 mb-3">
                        {language === "ar" 
                          ? "هل تود أن نأخذك في جولة سريعة لتتعرف على أهم أقسام التطبيق وكيفية استخدامها؟" 
                          : "Would you like a quick tour to learn about the app's main features and how to use them?"}
                      </p>
                      
                      <div className="flex gap-2 justify-center md:justify-end">
                        <Button
                          onClick={() => {
                            console.log('🎯 Starting tour');
                            setShowTour(true);
                          }}
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold"
                        >
                          {language === "ar" ? "✨ نعم، ابدأ الجولة" : "✨ Yes, Start Tour"}
                        </Button>
                        
                        <Button
                          onClick={() => {
                            console.log('❌ Tour dismissed');
                            localStorage.setItem('tourCompleted', 'skipped');
                            setShowWelcomeSection(false);
                            toast.success(language === "ar" ? "يمكنك دائماً بدء الجولة من الإعدادات" : "You can always start the tour from settings");
                          }}
                          variant="outline"
                          className="text-gray-600"
                        >
                          {language === "ar" ? "لا، شكراً" : "No, thanks"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* iOS Style Statistics Cards */}
        <div className="space-y-3 mb-8 sm:mb-12" dir={language === "ar" ? "rtl" : "ltr"}>
          {/* Total Medications */}
          <div 
            className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group border border-gray-100"
            onClick={() => {
              const medsSection = document.querySelector('[data-testid="my-medications-card"]');
              if (medsSection) {
                medsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center shadow-sm">
                  <Pill className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {language === "ar" ? "إجمالي الأدوية" : "Total Medications"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {userMedications.length}
                  </p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform ${language === "ar" ? "rotate-180" : ""}`} />
            </div>
            <p className={`text-xs text-gray-500 mt-2 ${language === "ar" ? "pr-16" : "pl-16"}`}>
              {language === "ar" 
                ? "عدد الأدوية المضافة في قائمتك الشخصية"
                : "Number of medications added to your personal list"}
            </p>
          </div>

          {/* Drug Interactions */}
          <div 
            className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group border border-gray-100"
            onClick={async () => {
              if (userMedications.length >= 2) {
                await checkDrugInteractions(userMedications);
                setShowInteractionsDialog(true);
              } else {
                toast.warning(language === "ar" ? "يجب أن يكون لديك دواءان على الأقل" : "You need at least 2 medications");
              }
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full ${drugInteractions?.has_interactions ? 'bg-orange-500' : 'bg-green-500'} flex items-center justify-center shadow-sm`}>
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {language === "ar" ? "التداخلات الدوائية" : "Drug Interactions"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {drugInteractions?.has_interactions ? drugInteractions.total_interactions : 0}
                  </p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform ${language === "ar" ? "rotate-180" : ""}`} />
            </div>
            <p className={`text-xs text-gray-500 mt-2 ${language === "ar" ? "pr-16" : "pl-16"}`}>
              {language === "ar" 
                ? "فحص التفاعلات المحتملة بين أدويتك"
                : "Check potential interactions between your medications"}
            </p>
          </div>

          {/* Active Reminders */}
          <div 
            key={`reminders-${activeRemindersCount}`}
            className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group border border-gray-100"
            onClick={() => navigate("/reminders")}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center shadow-sm">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {language === "ar" ? "التذكيرات النشطة" : "Active Reminders"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {typeof activeRemindersCount === 'number' ? activeRemindersCount : 0}
                  </p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform ${language === "ar" ? "rotate-180" : ""}`} />
            </div>
            <p className={`text-xs text-gray-500 mt-2 ${language === "ar" ? "pr-16" : "pl-16"}`}>
              {language === "ar" 
                ? "التنبيهات المفعّلة لمواعيد تناول الأدوية"
                : "Active alerts for medication schedules"}
            </p>
          </div>

          {/* Today's Doses */}
          <div 
            className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group border border-gray-100"
            onClick={() => setShowDosesModal(true)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center shadow-sm">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {language === "ar" ? "جرعات اليوم" : "Today's Doses"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {upcomingDosesCount}
                  </p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform ${language === "ar" ? "rotate-180" : ""}`} />
            </div>
            <p className={`text-xs text-gray-500 mt-2 ${language === "ar" ? "pr-16" : "pl-16"}`}>
              {language === "ar" 
                ? "عدد الجرعات المقرر تناولها اليوم"
                : "Number of doses scheduled for today"}
            </p>
          </div>
        </div>

        {/* Action Buttons - Add Medication */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
        </div>

        <div className="space-y-6">
          {/* Recognition Result - Show only when there's a result */}
          {recognitionResult && !loading && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow-lg" data-testid="camera-card">
                <CardContent className="space-y-4">
                  <div className="space-y-4" data-testid="recognition-result">
                      {/* Success message */}
                      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-emerald-400">
                      <CardContent className="pt-6 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-emerald-700 mb-2">
                              {language === "ar" ? "تم التعرف على الدواء بنجاح!" : "Medication Recognized Successfully!"}
                            </h3>
                            <p className="text-gray-700 font-semibold text-lg">
                              {recognitionResult.auto_add_data?.medication_name || "Medication"}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                              {language === "ar" 
                                ? "تمت إضافة الدواء إلى قائمة أدويتي تلقائياً"
                                : "Medication has been added to My Medications automatically"}
                            </p>
                          </div>
                          {/* Classification & Timing Info */}
                          {recognitionResult.auto_add_data?.classification && (
                            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 w-full">
                              <p className="text-sm font-semibold text-blue-800 mb-1">
                                📋 {language === "ar" ? "التصنيف:" : "Classification:"} 
                                <span className="ml-2 bg-blue-200 px-2 py-1 rounded">
                                  {recognitionResult.auto_add_data.classification}
                                </span>
                              </p>
                            </div>
                          )}
                          
                          <div className="bg-white rounded-lg p-3 border border-emerald-200 w-full">
                            <p className="text-sm text-emerald-700 font-medium">
                              {language === "ar" 
                                ? "💡 للحصول على التفاصيل الكاملة، انقر على اسم الدواء في قائمة 'أدويتي' أدناه"
                                : "💡 For complete details, click on the medication name in 'My Medications' below"}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {recognitionResult.warnings && recognitionResult.warnings.length > 0 && (
                      <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4" data-testid="warnings-section">
                        <h4 className="font-semibold flex items-center gap-2 text-amber-800 mb-2">
                          <AlertTriangle className="w-5 h-5" />
                          {language === "ar" ? "تحذيرات هامة" : "Important Warnings"}
                        </h4>
                        <ul className="text-sm text-amber-700 space-y-1">
                          {recognitionResult.warnings.map((warning, idx) => (
                            <li key={idx} data-testid={`warning-${idx}`}>• {warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

            {/* My Medications moved to /medicines page */}
          </div>

          {/* Welcome section moved to top of page */}
      </div>

      {/* Add Medication Dialog - iOS Style */}
      <Dialog open={showAddMedication} onOpenChange={(open) => {
        console.log('💬 Add Medication Dialog onOpenChange:', open);
        setShowAddMedication(open);
        if (!open) {
          // Cleanup when closing
          setSfdaSearchQuery("");
          setSfdaSearchResults([]);
          setShowSfdaResults(false);
          setNewMedication({
            brand_name: "",
            active_ingredient: "",
            prescribed_dosage: "",
            frequency: "As directed",
            times: [],
            start_date: new Date().toISOString().split('T')[0],
            notes: "",
          });
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden p-0 gap-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl border-0 shadow-2xl">
          {/* iOS-style Header with Search - Sticky at Top */}
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
            <div className="px-6 py-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {language === "ar" ? "بحث عن دواء" : "Search Medication"}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {language === "ar" ? "ابحث في 8,637 دواء مسجل" : "Search in 8,637 registered medications"}
                  </p>
                </div>
              </div>
              
              {/* Search Input - Directly in Header */}
              <div className="relative">
                <Input
                  type="text"
                  value={sfdaSearchQuery}
                  onChange={(e) => setSfdaSearchQuery(e.target.value)}
                  placeholder={language === "ar" ? "🔍 اكتب اسم الدواء... (مثال: بانادول)" : "🔍 Type medication name... (e.g., Panadol)"}
                  className="h-14 text-base rounded-2xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 shadow-sm hover:shadow-md px-5"
                  dir={language === "ar" ? "rtl" : "ltr"}
                  autoFocus
                />
                
                {loadingSfdaSearch && (
                  <div className="absolute right-4 top-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-3 border-blue-200 border-t-blue-600"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Scrollable Content - Results Only */}
          <div className="overflow-y-auto max-h-[calc(90vh-240px)] px-6 py-2">
            <div className="space-y-2">
              {/* Search Results Dropdown - Close to Search Box */}
              <div className="relative">
                {showSfdaResults && sfdaSearchResults.length > 0 && (
                  <div className="bg-white/95 backdrop-blur-xl border-2 border-blue-200 rounded-2xl shadow-xl overflow-hidden">
                    <div className="overflow-y-auto max-h-96 p-1.5">
                      {sfdaSearchResults.map((med, idx) => (
                        <div
                          key={idx}
                          onClick={() => selectSfdaMedication(med)}
                          className="p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer rounded-xl mb-1.5 last:mb-0 transition-all duration-200 border border-transparent hover:border-blue-200 hover:shadow-sm"
                          dir={language === "ar" ? "rtl" : "ltr"}
                        >
                        <div className="flex flex-col gap-0.5">
                          {/* Trade Name - Compact */}
                          <p className="font-bold text-gray-900 text-sm leading-tight">
                            {language === "ar" && med.commercial_name_ar 
                              ? med.commercial_name_ar 
                              : med.commercial_name_en || med.trade_name || med.trade_name_ar}
                          </p>
                          
                          {/* Active Ingredient - Smaller */}
                          <p className="text-xs text-gray-600 font-medium leading-tight">
                            💊 {language === "ar" && med.scientific_name_ar 
                              ? med.scientific_name_ar 
                              : med.scientific_name || med.active_ingredients}
                          </p>
                          
                          {/* Pack Size & Strength - Compact */}
                          <div className="flex items-center gap-1.5 flex-wrap mt-1">
                            {(med.package_type || med.package_type_ar) && (
                              <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded text-[10px]">
                                📦 {language === "ar" && med.package_type_ar ? med.package_type_ar : med.package_type}
                                {med.package_size && ` (${med.package_size})`}
                              </span>
                            )}
                            {med.strength && med.strength !== 'nan' && (
                              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded text-[10px]">
                                ⚕️ {med.strength} {med.strength_unit || med.strength_unit_ar || ''}
                              </span>
                            )}
                          </div>
                          
                          {/* Price - Compact */}
                          {med.price_sar && (
                            <div className="flex items-center gap-1.5 mt-1">
                              <p className="font-bold text-green-700 text-sm bg-green-50 px-2 py-0.5 rounded">
                                💰 {med.price_sar} {language === "ar" ? "ر.س" : "SAR"}
                              </p>
                            </div>
                          )}
                          
                          {/* Manufacturer - Very Small */}
                          {(med.manufacturer || med.manufacturer_ar) && med.manufacturer !== 'nan' && (
                            <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">
                              🏭 {language === "ar" && med.manufacturer_ar ? med.manufacturer_ar : med.manufacturer}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                )}
                
                {showSfdaResults && sfdaSearchResults.length === 0 && !loadingSfdaSearch && sfdaSearchQuery.length >= 2 && (
                  <div className="bg-white/95 backdrop-blur-xl border-2 border-gray-200 rounded-2xl shadow-lg p-4 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl">🔍</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      {language === "ar" ? "لم يتم العثور على نتائج" : "No results found"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {language === "ar" ? "جرب اسم آخر" : "Try another name"}
                    </p>
                  </div>
                )}
              </div>

            {/* Selected Medication Info */}
            {newMedication.price_sar && (
              <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <p className="font-semibold text-emerald-900 text-sm">
                      {language === "ar" ? "تم اختيار الدواء" : "Medication Selected"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-600">{language === "ar" ? "السعر:" : "Price:"}</span>
                      <span className="font-bold text-emerald-700">{newMedication.price_sar} {language === "ar" ? "ر.س" : "SAR"}</span>
                    </div>
                    {newMedication.manufacturer && (
                      <div className="flex items-center gap-1">
                        <span className="text-gray-600">{language === "ar" ? "الشركة:" : "Company:"}</span>
                        <span className="font-medium text-gray-800">{newMedication.manufacturer}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* iOS-style Footer with Action Buttons */}
          <div className="sticky bottom-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 px-6 py-4">
            <div className="flex gap-3">
              <Button
                onClick={handleAddMedication}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 font-semibold"
                data-testid="save-medication-btn"
              >
                {t.save}
              </Button>
              <Button
                onClick={() => {
                  setShowAddMedication(false);
                  // Reset search
                  setSfdaSearchQuery("");
                  setSfdaSearchResults([]);
                  setShowSfdaResults(false);
                }}
                variant="outline"
                className="flex-1 rounded-xl py-3 font-semibold"
                data-testid="cancel-medication-btn"
              >
                {t.cancel}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Medication Details Dialog - iOS Style Enhanced */}
      <Dialog open={showMedicationDetails} onOpenChange={setShowMedicationDetails}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-0 gap-0 bg-gray-50">
          {/* iOS Style Header - Enhanced */}
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="text-2xl">💊</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-gray-900 leading-tight truncate">
                      {selectedMedicationDetails?.condition}
                    </h2>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {language === "ar" ? "تفاصيل الدواء الكاملة" : "Complete Medication Details"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMedicationDetails(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-4 py-4" dir={language === "ar" ? "rtl" : "ltr"}>
            {loadingWikipediaInfo ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">
                  {language === "ar" ? "جاري تحميل البيانات..." : "Loading data..."}
                </p>
              </div>
            ) : selectedMedicationDetails ? (
              <div className="space-y-3">
                {/* 1. التصنيف الدوائي - Drug Classification */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 shadow-sm border border-purple-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-xl">🏷️</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-purple-900 mb-1.5">
                        {language === "ar" ? "التصنيف الدوائي" : "Drug Classification"}
                      </p>
                      <p className="text-base text-purple-800 font-medium leading-snug">
                        {wikipediaInfo?.classification || 
                          selectedMedicationDetails.classification || 
                          (language === "ar" ? "غير متوفر" : "Not available")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. الاستخدامات - Uses/Indications */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 shadow-sm border border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-xl">💊</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-blue-900 mb-1.5">
                        {language === "ar" ? "الاستخدامات والمؤشرات" : "Uses & Indications"}
                      </p>
                      <p className="text-base text-blue-800 font-medium leading-relaxed whitespace-pre-line">
                        {wikipediaInfo?.uses || 
                          selectedMedicationDetails.uses || 
                          (language === "ar" ? "غير متوفر" : "Not available")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. الجرعة الموصى بها - Recommended Dosage */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 shadow-sm border border-green-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-xl">⚕️</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-green-900 mb-1.5">
                        {language === "ar" ? "الجرعة الموصى بها" : "Recommended Dosage"}
                      </p>
                      {wikipediaInfo?.dosage ? (
                        <p className="text-base text-green-800 font-medium leading-relaxed whitespace-pre-line">
                          {wikipediaInfo.dosage}
                        </p>
                      ) : (
                        <div className="space-y-1.5">
                          <p className="text-base text-green-800 font-medium">
                            {selectedMedicationDetails.prescribed_dosage || 
                              selectedMedicationDetails.strength ||
                              (language === "ar" ? "حسب إرشادات الطبيب" : "As directed")}
                          </p>
                          <p className="text-sm text-green-700">
                            {selectedMedicationDetails.frequency || 
                              (language === "ar" ? "حسب إرشادات الطبيب" : "As directed")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 4. محاذير الاستخدام - Warnings & Precautions */}
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-4 shadow-sm border border-amber-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-xl">⚠️</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-amber-900 mb-1.5">
                        {language === "ar" ? "محاذير الاستخدام" : "Warnings & Precautions"}
                      </p>
                      <p className="text-base text-amber-800 font-medium leading-relaxed whitespace-pre-line">
                        {wikipediaInfo?.warnings || 
                          selectedMedicationDetails.warnings || 
                          selectedMedicationDetails.precautions ||
                          (language === "ar" ? "غير متوفر" : "Not available")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 5. الحمل والرضاعة - Pregnancy & Lactation */}
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-4 shadow-sm border border-pink-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-xl">👶</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-pink-900 mb-1.5">
                        {language === "ar" ? "الحمل والرضاعة" : "Pregnancy & Lactation"}
                      </p>
                      <p className="text-base text-pink-800 font-medium leading-relaxed whitespace-pre-line">
                        {wikipediaInfo?.pregnancy_lactation || 
                          selectedMedicationDetails.pregnancy_lactation || 
                          (language === "ar" ? "غير متوفر" : "Not available")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 6. التخزين - Storage */}
                <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-4 shadow-sm border border-slate-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-xl">🌡️</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 mb-1.5">
                        {language === "ar" ? "التخزين" : "Storage"}
                      </p>
                      <p className="text-base text-slate-800 font-medium leading-relaxed">
                        {(language === "ar" && selectedMedicationDetails.storage_conditions_ar) 
                          ? selectedMedicationDetails.storage_conditions_ar
                          : selectedMedicationDetails.storage_conditions || 
                            (language === "ar" 
                              ? "يُحفظ في درجة حرارة الغرفة، بعيداً عن الضوء والرطوبة"
                              : "Store at room temperature, away from light and moisture"
                            )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Notes Section - if available */}
                {selectedMedicationDetails.notes && (
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-4 shadow-sm border border-indigo-200">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="text-xl">📝</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-indigo-900 mb-1.5">
                          {language === "ar" ? "ملاحظات خاصة" : "Personal Notes"}
                        </p>
                        <p className="text-base text-indigo-800 font-medium leading-relaxed">
                          {selectedMedicationDetails.notes}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
                <p className="text-gray-600 font-medium">
                  {language === "ar" ? "جاري التحميل..." : "Loading..."}
                </p>
              </div>
            )}
          </div>

          {/* iOS Style Footer - Back Button */}
          <div className="sticky bottom-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 px-6 py-4">
            <Button
              onClick={() => setShowMedicationDetails(false)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 font-semibold"
            >
              {language === "ar" ? "رجوع" : "Back"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Drug Interactions Details Dialog - iOS Style */}
      <Dialog open={showInteractionsDialog} onOpenChange={setShowInteractionsDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-0 gap-0 bg-gray-50">
          {/* iOS-style Header */}
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-lg border-b border-gray-200">
            <div className="px-6 py-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {language === "ar" ? "تفاصيل التداخلات الدوائية" : "Drug Interactions Details"}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {language === "ar" 
                      ? "معلومات دقيقة من Medscape" 
                      : "Information from Medscape"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Scrollable Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-6 py-4">
            {drugInteractions?.interactions && drugInteractions.interactions.length > 0 ? (
              <div className="space-y-4">
                {/* iOS-style Summary Card */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        {language === "ar" ? "إجمالي التداخلات" : "Total Interactions"}
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {drugInteractions.total_interactions}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">
                        {language === "ar" ? "الأدوية المفحوصة" : "Medications Checked"}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {drugInteractions.medications_checked}
                      </p>
                    </div>
                  </div>
                </div>

                {/* iOS-style Interactions List */}
                {drugInteractions.interactions.map((interaction, idx) => {
                  const severityColors = {
                    severe: {
                      bg: 'bg-red-50',
                      border: 'border-red-200',
                      text: 'text-red-900',
                      badge: 'bg-red-500',
                      badgeText: 'text-white',
                      label: language === "ar" ? "شديد" : "Severe"
                    },
                    major: {
                      bg: 'bg-red-50',
                      border: 'border-red-200',
                      text: 'text-red-900',
                      badge: 'bg-red-500',
                      badgeText: 'text-white',
                      label: language === "ar" ? "خطير" : "Major"
                    },
                    moderate: {
                      bg: 'bg-yellow-50',
                      border: 'border-yellow-200',
                      text: 'text-yellow-900',
                      badge: 'bg-yellow-500',
                      badgeText: 'text-white',
                      label: language === "ar" ? "متوسط" : "Moderate"
                    },
                    minor: {
                      bg: 'bg-green-50',
                      border: 'border-green-200',
                      text: 'text-green-900',
                      badge: 'bg-green-500',
                      badgeText: 'text-white',
                      label: language === "ar" ? "خفيف" : "Minor"
                    }
                  };

                  const colors = severityColors[interaction.severity] || severityColors.severe;

                  return (
                    <div 
                      key={idx}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200"
                    >
                      {/* Header with severity */}
                      <div className={`${colors.bg} px-4 py-3 border-b ${colors.border}`}>
                        <div className="flex items-center justify-between">
                          <span className={`${colors.badge} ${colors.badgeText} px-3 py-1 rounded-full text-sm font-semibold`}>
                            {colors.label}
                          </span>
                          <span className="text-xs text-gray-600 font-medium">
                            {language === "ar" ? `تداخل رقم ${idx + 1}` : `Interaction #${idx + 1}`}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 space-y-4">
                        {/* Drugs Involved */}
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-2">
                            {language === "ar" ? "الأدوية المتفاعلة:" : "Interacting Drugs:"}
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                              <p className="font-medium text-gray-900 text-sm">
                                {interaction.drug1 || interaction.drug1_brand || interaction.drug1_trade || "Unknown"}
                              </p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                              <p className="font-medium text-gray-900 text-sm">
                                {interaction.drug2 || interaction.drug2_brand || interaction.drug2_trade || "Unknown"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Clinical Effect */}
                        {(interaction.effect || interaction.clinical_effects) && (
                          <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                            <p className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                              <span className="text-base">⚠️</span>
                              {language === "ar" ? "التأثير السريري:" : "Clinical Effect:"}
                            </p>
                            <p className="text-sm text-gray-800 leading-relaxed">
                              {interaction.effect || interaction.clinical_effects}
                            </p>
                          </div>
                        )}

                        {/* Recommendation */}
                        {(interaction.action || interaction.recommendation || interaction.recommendations) && (
                          <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                            <p className="text-sm font-semibold text-blue-900 mb-1.5 flex items-center gap-1">
                              <span className="text-base">💊</span>
                              {language === "ar" ? "التوصية الطبية:" : "Medical Recommendation:"}
                            </p>
                            <p className="text-sm text-blue-800 leading-relaxed">
                              {interaction.action || interaction.recommendation || interaction.recommendations}
                            </p>
                          </div>
                        )}

                        {/* Fallback for old format */}
                        {interaction.details && !interaction.mechanism && (
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {interaction.details}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* iOS-style Warning Card */}
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                        <span className="text-lg">⚕️</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-amber-900 mb-1">
                        {language === "ar" ? "تحذير هام" : "Important Warning"}
                      </p>
                      <p className="text-sm text-amber-800 leading-relaxed">
                        {language === "ar" 
                          ? "يُرجى استشارة طبيبك أو الصيدلي قبل تناول هذه الأدوية معاً. هذه المعلومات للإرشاد فقط وليست بديلاً عن الاستشارة الطبية."
                          : "Please consult your doctor or pharmacist before taking these medications together. This information is for guidance only and not a substitute for medical advice."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">
                  {language === "ar" ? "لا توجد تفاصيل متاحة" : "No details available"}
                </p>
              </div>
            )}
          </div>

          {/* iOS-style Footer with Action Button */}
          <div className="sticky bottom-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 px-6 py-4">
            <Button
              onClick={() => setShowInteractionsDialog(false)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 font-semibold"
            >
              {language === "ar" ? "رجوع" : "Back"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-6 h-6" />
              {language === "ar" ? "تأكيد الحذف" : "Confirm Delete"}
            </DialogTitle>
            <DialogDescription className="text-base">
              {language === "ar" 
                ? "هل أنت متأكد من حذف هذا الدواء؟"
                : "Are you sure you want to delete this medication?"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
            <Button
              onClick={confirmDelete}
              className="flex-1 bg-red-600 hover:bg-red-700 text-base py-6 min-h-[50px]"
              data-testid="confirm-delete-btn"
            >
              {language === "ar" ? "حذف" : "Delete"}
            </Button>
            <Button
              onClick={() => setShowDeleteConfirm(false)}
              variant="outline"
              className="flex-1 text-base py-6 min-h-[50px]"
              data-testid="cancel-delete-btn"
            >
              {language === "ar" ? "رجوع" : "Back"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden native camera input for mobile */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCameraCapture}
        style={{ display: 'none' }}
      />

      {/* Hidden file input for gallery selection */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* Camera Modal */}
      <Dialog open={showCamera} onOpenChange={(open) => {
        console.log('📷 Camera Dialog onOpenChange:', open);
        setShowCamera(open);
        if (!open) {
          // Cleanup when closing
          setCapturedImage(null);
          setRecognitionResult(null);
          setWebcamError(null);
          setRecognizing(false);
          setLoading(false);
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t.takePicture}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* For mobile devices, show options instead of webcam */}
            {isMobile && !capturedImage && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                  <Camera className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                  <p className="text-gray-700 mb-4">
                    {language === 'ar' 
                      ? 'اختر طريقة إضافة صورة الدواء' 
                      : 'Choose how to add medication image'}
                  </p>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={openNativeCamera}
                      className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 flex items-center justify-center gap-2"
                    >
                      <Camera className="w-5 h-5" />
                      {language === 'ar' ? '📸 التقط صورة الآن' : '📸 Take Photo Now'}
                    </button>
                    <button
                      onClick={() => {
                        if (!checkCanAddMedication()) {
                          showLimitReachedMessage('medications');
                          setShowCamera(false);
                          return;
                        }
                        // Don't close modal - let handleFileSelect close it after file is selected
                        fileInputRef.current?.click();
                      }}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                      <ImageIcon className="w-5 h-5" />
                      {language === 'ar' ? '📁 اختر من المعرض' : '📁 Choose from Gallery'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* For desktop, use webcam */}
            {!isMobile && !capturedImage && !webcamError && (
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="w-full rounded-lg"
                videoConstraints={{
                  facingMode: "environment",
                  aspectRatio: { ideal: 1.0 }
                }}
                style={{ maxHeight: "500px", objectFit: "contain" }}
                onUserMediaError={(error) => {
                  console.error("Webcam error:", error);
                  setWebcamError(language === 'ar' 
                    ? "⚠️ لا يمكن الوصول للكاميرا. الرجاء السماح بالوصول للكاميرا في إعدادات المتصفح أو استخدم خيار 'اختيار من المعرض'." 
                    : "⚠️ Cannot access camera. Please allow camera access in browser settings or use 'Choose from Gallery'."
                  );
                }}
              />
            )}
            
            {!isMobile && webcamError && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <p className="text-yellow-800 mb-3">{webcamError}</p>
                <button
                  onClick={() => {
                    if (!checkCanAddMedication()) {
                      showLimitReachedMessage('medications');
                      setShowCamera(false);
                      setWebcamError(null);
                      return;
                    }
                    // Don't close modal - let handleFileSelect close it
                    setWebcamError(null);
                    fileInputRef.current?.click();
                  }}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
                >
                  {language === 'ar' ? '📁 اختيار من المعرض' : '📁 Choose from Gallery'}
                </button>
              </div>
            )}
            
            {capturedImage && (
              <img
                src={capturedImage}
                alt="Captured medication"
                className="w-full rounded-lg"
                data-testid="captured-image"
              />
            )}
            
            {loading && (
              <div className="text-center py-8">
                <div className="animate-pulse text-lg text-emerald-600">{t.analyzing}</div>
              </div>
            )}
            
            {/* Action buttons - only show for desktop */}
            {!isMobile && (
              <div className="flex gap-2">
                {!capturedImage && !loading && (
                  <>
                    <Button
                      onClick={capture}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      data-testid="capture-btn"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      {t.capture}
                    </Button>
                    <Button
                      onClick={() => {
                        if (!checkCanAddMedication()) {
                          showLimitReachedMessage('medications');
                          return;
                        }
                        fileInputRef.current?.click();
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      {language === "ar" ? "المعرض" : "Gallery"}
                    </Button>
                  </>
                )}
                {capturedImage && !loading && (
                  <>
                    <Button
                      onClick={retakePhoto}
                      variant="outline"
                      className="flex-1"
                      data-testid="retake-btn"
                    >
                      {t.retake}
                    </Button>
                    <Button
                      onClick={() => setShowCamera(false)}
                      className="flex-1 bg-teal-600 hover:bg-teal-700"
                    >
                      {language === "ar" ? "رجوع" : "Back"}
                    </Button>
                  </>
                )}
                {!capturedImage && !loading && (
                  <Button
                    onClick={() => setShowCamera(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    {language === "ar" ? "إلغاء" : "Cancel"}
                  </Button>
                )}
              </div>
            )}
            
            {/* Action buttons for mobile - just back button */}
            {isMobile && !capturedImage && !loading && (
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => setShowCamera(false)}
                  variant="outline"
                  className="w-full"
                >
                  {language === "ar" ? "إلغاء" : "Cancel"}
                </Button>
              </div>
            )}
            
            {/* Back button when image is captured on mobile */}
            {isMobile && capturedImage && !loading && (
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={retakePhoto}
                  variant="outline"
                  className="flex-1"
                >
                  {language === "ar" ? "إعادة التقاط" : "Retake"}
                </Button>
                <Button
                  onClick={() => setShowCamera(false)}
                  className="flex-1 bg-teal-600 hover:bg-teal-700"
                >
                  {language === "ar" ? "رجوع" : "Back"}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Reminders Management Modal */}
      <Dialog open={showRemindersModal} onOpenChange={setShowRemindersModal}>
        <DialogContent className="max-w-lg" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-teal-700">
              {language === 'ar' ? '⏰ إدارة التذكيرات' : '⏰ Manage Reminders'}
            </DialogTitle>
            <DialogDescription>
              {currentReminderMed && (
                <span className="text-lg font-semibold text-gray-700">
                  {currentReminderMed.brand_name || currentReminderMed.condition}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Reminder Status */}
            {currentReminder && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-semibold">
                  {language === 'ar' ? 'الحالة:' : 'Status:'}
                </span>
                <Button
                  size="sm"
                  variant={currentReminder.enabled ? 'default' : 'outline'}
                  onClick={toggleReminder}
                  disabled={loadingReminder}
                  className={currentReminder.enabled ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  {currentReminder.enabled 
                    ? (language === 'ar' ? '✓ مفعّل' : '✓ Enabled')
                    : (language === 'ar' ? '✗ معطّل' : '✗ Disabled')
                  }
                </Button>
              </div>
            )}

            {/* Reminder Times */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === 'ar' ? 'أوقات التذكير:' : 'Reminder Times:'}
              </label>
              <div className="space-y-2">
                {reminderTimesEdit.map((time, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => updateReminderTimeSlot(index, e.target.value)}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none"
                    />
                    {reminderTimesEdit.length > 1 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeReminderTimeSlot(index)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={addReminderTimeSlot}
                className="mt-2 text-teal-600 hover:text-teal-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                {language === 'ar' ? 'إضافة موعد' : 'Add Time'}
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={saveReminder}
                disabled={loadingReminder}
                className="flex-1 bg-teal-600 hover:bg-teal-700"
              >
                {loadingReminder ? (
                  language === 'ar' ? 'جاري الحفظ...' : 'Saving...'
                ) : (
                  <>
                    <Bell className="w-4 h-4 mr-2" />
                    {currentReminder 
                      ? (language === 'ar' ? 'تحديث' : 'Update')
                      : (language === 'ar' ? 'حفظ' : 'Save')
                    }
                  </>
                )}
              </Button>
              
              {currentReminder && (
                <Button
                  onClick={deleteReminder}
                  disabled={loadingReminder}
                  variant="outline"
                  className="text-red-600 hover:bg-red-50"
                >
                  {language === 'ar' ? 'حذف' : 'Delete'}
                </Button>
              )}
              <Button
                onClick={() => setShowRemindersModal(false)}
                variant="outline"
                className="flex-1"
              >
                {language === 'ar' ? 'رجوع' : 'Back'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upgrade to Premium Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">
              <Sparkles className="w-8 h-8 inline-block text-yellow-500 mb-2" />
              <br />
              {language === 'ar' ? '💎 الترقية إلى Premium' : '💎 Upgrade to Premium'}
            </DialogTitle>
            <DialogDescription className="text-center text-base pt-4">
              {language === 'ar' 
                ? 'احصل على وصول غير محدود لجميع الميزات!' 
                : 'Get unlimited access to all features!'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-4 space-y-2">
              <p className="text-emerald-700 font-semibold">✨ {language === 'ar' ? 'أدوية غير محدودة' : 'Unlimited medications'}</p>
              <p className="text-emerald-700 font-semibold">✨ {language === 'ar' ? 'عمليات بحث غير محدودة' : 'Unlimited searches'}</p>
              <p className="text-emerald-700 font-semibold">✨ {language === 'ar' ? 'تذكيرات دائمة' : 'Permanent reminders'}</p>
              <p className="text-emerald-700 font-semibold">✨ {language === 'ar' ? 'فحص شامل للتفاعلات' : 'Comprehensive interactions'}</p>
            </div>
            
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-600">19.99 {language === 'ar' ? 'ر.س' : 'SAR'}</p>
              <p className="text-gray-500 text-sm">{language === 'ar' ? 'شهرياً' : 'per month'}</p>
            </div>

            <Button
              onClick={() => {
                setShowUpgradeModal(false);
                window.location.href = '/pricing';
              }}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-6 text-lg"
            >
              {language === 'ar' ? 'عرض الخطط والأسعار' : 'View Pricing Plans'}
            </Button>
            
            <Button
              onClick={() => setShowUpgradeModal(false)}
              variant="outline"
              className="w-full"
            >
              {language === 'ar' ? 'رجوع' : 'Back'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notification Permission Dialog - First Time */}
      {showNotificationDialog && (
        <NotificationPermissionDialog 
          language={language}
          onClose={(enabled) => {
            setShowNotificationDialog(false);
            if (enabled) {
              console.log('✅ User enabled notifications');
            } else {
              console.log('ℹ️ User skipped notifications');
            }
          }}
        />
      )}

      {/* Terms and Conditions Dialog - iOS Style */}
      {showTermsDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div 
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          >
            {/* Header with gradient */}
            <div className="bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 px-6 py-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-12 h-12 text-white" fill="currentColor">
                  <path d="M4.5 12.75a6 6 0 0 1 11.85-1.35l-6.19 6.19a6 6 0 0 1-5.66-4.84Zm12.65 1.45a6 6 0 0 1-11.85 1.35l6.19-6.19a6 6 0 0 1 5.66 4.84Z" opacity="0.9"/>
                  <path d="M12 6v12M6 12h12" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {language === 'ar' ? 'مرحباً بك في PharmaPal!' : 'Welcome to PharmaPal!'}
              </h2>
              <p className="text-white/90 text-sm">
                {language === 'ar' 
                  ? 'يرجى الموافقة على الشروط التالية للمتابعة' 
                  : 'Please accept the following terms to continue'}
              </p>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
              {/* Terms of Service */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted.terms}
                  onChange={(e) => setTermsAccepted({ ...termsAccepted, terms: e.target.checked })}
                  className="mt-1 w-5 h-5 text-teal-600 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
                <label htmlFor="terms" className="flex-1 cursor-pointer">
                  <p className="font-semibold text-gray-900 mb-1">
                    {language === 'ar' ? 'شروط الاستخدام' : 'Terms of Service'}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {language === 'ar' 
                      ? 'أوافق على الالتزام بشروط الاستخدام الخاصة بـ PharmaPal' 
                      : 'I agree to comply with PharmaPal Terms of Service'}
                  </p>
                  <a 
                    href="/terms-of-service" 
                    target="_blank"
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium inline-flex items-center gap-1 mt-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {language === 'ar' ? 'اقرأ التفاصيل كاملة ←' : 'Read full details →'}
                  </a>
                </label>
              </div>

              {/* Privacy Policy */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <input
                  type="checkbox"
                  id="privacy"
                  checked={termsAccepted.privacy}
                  onChange={(e) => setTermsAccepted({ ...termsAccepted, privacy: e.target.checked })}
                  className="mt-1 w-5 h-5 text-teal-600 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
                <label htmlFor="privacy" className="flex-1 cursor-pointer">
                  <p className="font-semibold text-gray-900 mb-1">
                    {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {language === 'ar' 
                      ? 'أوافق على سياسة الخصوصية وطريقة معالجة بياناتي الشخصية' 
                      : 'I agree to the Privacy Policy and how my personal data is processed'}
                  </p>
                  <a 
                    href="/privacy-policy" 
                    target="_blank"
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium inline-flex items-center gap-1 mt-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {language === 'ar' ? 'اقرأ التفاصيل كاملة ←' : 'Read full details →'}
                  </a>
                </label>
              </div>

              {/* Medical Disclaimer */}
              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border-2 border-amber-200">
                <input
                  type="checkbox"
                  id="medical"
                  checked={termsAccepted.medical}
                  onChange={(e) => setTermsAccepted({ ...termsAccepted, medical: e.target.checked })}
                  className="mt-1 w-5 h-5 text-teal-600 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
                <label htmlFor="medical" className="flex-1 cursor-pointer">
                  <p className="font-semibold text-amber-900 mb-1 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    {language === 'ar' ? 'إخلاء المسؤولية الطبية' : 'Medical Disclaimer'}
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    {language === 'ar' 
                      ? 'أدرك أن هذا التطبيق لا يُعتبر بديلاً عن الاستشارة الطبية المتخصصة. المعلومات المقدمة هي لأغراض تعليمية فقط. يجب استشارة طبيب مختص قبل اتخاذ أي قرارات علاجية.' 
                      : 'I understand that this app is not a substitute for professional medical consultation. The information provided is for educational purposes only. You should consult a qualified physician before making any treatment decisions.'}
                  </p>
                  <a 
                    href="/medical-disclaimer" 
                    target="_blank"
                    className="text-sm text-amber-700 hover:text-amber-800 font-medium inline-flex items-center gap-1 mt-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {language === 'ar' ? 'اقرأ التفاصيل كاملة ←' : 'Read full details →'}
                  </a>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 py-6 border-t border-gray-100">
              <button
                onClick={acceptTerms}
                disabled={!termsAccepted.terms || !termsAccepted.privacy || !termsAccepted.medical}
                className={`w-full py-4 text-lg font-bold rounded-xl transition-all ${
                  termsAccepted.terms && termsAccepted.privacy && termsAccepted.medical
                    ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/30 active:scale-95'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {language === 'ar' ? 'أوافق وأكمل التسجيل' : 'I Accept and Continue'}
              </button>
              <p className="text-xs text-center text-gray-500 mt-3 leading-relaxed">
                {language === 'ar' 
                  ? 'بالموافقة، أنت تقر بأنك قرأت وفهمت جميع الشروط والسياسات' 
                  : 'By accepting, you acknowledge that you have read and understood all terms and policies'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Scan Options Dialog */}
      <ScanOptionsDialog
        isOpen={showScanOptions}
        onClose={() => setShowScanOptions(false)}
        onSelectCamera={() => {
          if (cameraInputRef.current) {
            cameraInputRef.current.click();
          }
        }}
        onSelectGallery={() => {
          if (fileInputRef.current) {
            fileInputRef.current.click();
          }
        }}
        language={language}
      />
      
      {/* Footer */}
      <Footer language={language} />
      
      {/* Bottom Navigation */}
      <BottomNav />
      
      {/* Welcome Tour Dialog - Appears once after terms acceptance */}
      <WelcomeTourDialog
        isOpen={showWelcomeTourDialog}
        onClose={() => setShowWelcomeTourDialog(false)}
        onStartTour={() => {
          setShowWelcomeTourDialog(false);
          setShowTour(true);
        }}
        language={language}
      />
      
      {/* Today's Doses Modal */}
      {showDosesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDosesModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-teal-500 to-emerald-600 text-white p-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {language === 'ar' ? 'جرعات اليوم' : "Today's Doses"}
                    </h3>
                    <p className="text-xs text-white/80">
                      {new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDosesModal(false)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-4">
              {window.todayDosesDetails && window.todayDosesDetails.length > 0 ? (
                <div className="space-y-3">
                  <div className="bg-emerald-50 rounded-xl p-3 mb-4">
                    <p className="text-sm text-center">
                      <span className="font-bold text-2xl text-emerald-600">{upcomingDosesCount}</span>
                      <span className="text-gray-600 mr-2">
                        {language === 'ar' ? 'جرعة إجمالية اليوم' : 'Total doses today'}
                      </span>
                    </p>
                  </div>
                  
                  {window.todayDosesDetails.map((med, index) => (
                    <div key={index} className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-emerald-300 transition-all">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            {med.name}
                          </h4>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                                <Clock className="w-3.5 h-3.5 text-teal-600" />
                              </div>
                              <span className="text-gray-600">
                                {language === 'ar' 
                                  ? `${med.dailyDoses} مرات في اليوم`
                                  : `${med.dailyDoses} times per day`
                                }
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                <Pill className="w-3.5 h-3.5 text-emerald-600" />
                              </div>
                              <span className="text-gray-600">
                                {language === 'ar' 
                                  ? `${med.pillsPerDay} حبة في اليوم`
                                  : `${med.pillsPerDay} pills per day`
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                          <span className="text-white font-bold text-lg">{med.dailyDoses}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-2">
                    {language === 'ar' ? 'لا توجد جرعات مجدولة لليوم' : 'No doses scheduled for today'}
                  </p>
                  <p className="text-sm text-gray-400">
                    {language === 'ar' 
                      ? 'أضف أدوية وحدد جرعاتها لتظهر هنا'
                      : 'Add medications and set their dosages to see them here'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* App Tour - iOS Style */}
      <AppTourIOS 
        isOpen={showTour} 
        onClose={() => {
          setShowTour(false);
          setShowWelcomeSection(false);
        }}
        language={language}
      />
    </div>
  );
};

export default Dashboard;

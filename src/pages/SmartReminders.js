import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '../App';
import { Card, CardContent } from '../components/ui/card';
import { Bell, BellOff, Clock, Pill, Activity, Timer, CheckCircle2, AlertTriangle, Info, ChevronLeft, ChevronRight, Plus, AlertCircle, Calendar } from 'lucide-react';
import moment from 'moment-hijri';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import MedicationIcon from '../components/MedicationIcon';
import ReminderCard from '../components/ReminderCard';
import BottomNav from '../components/BottomNav';
import { toast } from 'sonner';

const SmartReminders = ({ user }) => {
  const navigate = useNavigate();
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzingMedication, setAnalyzingMedication] = useState(null);
  const [expandedMed, setExpandedMed] = useState(null);
  const [viewMode, setViewMode] = useState('compact'); // compact, detailed
  const [calendarType, setCalendarType] = useState(localStorage.getItem('calendarType') || 'gregorian'); // gregorian or islamic
  const [totalReminders, setTotalReminders] = useState(0);
  // Removed AI-related state - now using user input
  const language = localStorage.getItem('preferredLanguage') || 'ar';
  const carouselRef = React.useRef(null);

  // Show all medications without filtering
  const filteredMedications = medications;

  const fetchTotalReminders = async () => {
    try {
      const response = await axios.get(`${API}/reminders`);
      // Count only enabled reminders
      const enabledCount = response.data.filter(r => r.enabled === true).length;
      setTotalReminders(enabledCount);
    } catch (error) {
      console.error('Error fetching reminders count:', error);
      setTotalReminders(0);
    }
  };

  useEffect(() => {
    fetchMedications();
    checkForNewMedications();
    fetchTotalReminders();
  }, []);
  
  // Removed AI dosage fetching - now using user input forms

  // Check if user just added medications without reminders
  const checkForNewMedications = async () => {
    const hasSeenReminderPrompt = localStorage.getItem('hasSeenReminderPrompt');
    
    if (!hasSeenReminderPrompt) {
      try {
        // Check if there are medications without reminders
        const response = await axios.get(`${API}/user-medications`);
        const meds = response.data;
        
        if (meds.length > 0) {
          // Check if any medication has reminders
          const remindersResponse = await axios.get(`${API}/reminders`);
          const reminders = remindersResponse.data;
          
          if (reminders.length === 0) {
            // Show prompt
            setTimeout(() => {
              toast.info(
                language === 'ar'
                  ? '💡 نصيحة: أضف تذكيرات لأدويتك لتجنب نسيان الجرعات!'
                  : '💡 Tip: Add reminders to your medications to avoid missing doses!',
                { duration: 5000 }
              );
              localStorage.setItem('hasSeenReminderPrompt', 'true');
            }, 2000);
          }
        }
      } catch (error) {
        console.error('Error checking medications:', error);
      }
    }
  };

  // Auto-analyze medications without analysis (SILENT - no toasts)
  useEffect(() => {
    const autoAnalyzeMedications = async () => {
      const medsWithoutAnalysis = medications.filter(med => !med.courseAnalysis);
      
      // Only analyze if there are unanalyzed medications
      if (medsWithoutAnalysis.length === 0) return;
      
      for (const med of medsWithoutAnalysis) {
        try {
          await analyzeMedicationCourseSilent(med);
          // Small delay to avoid overwhelming the API
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error('Auto-analysis failed for', med.brand_name, error);
        }
      }
    };

    if (medications.length > 0 && !analyzingMedication) {
      autoAnalyzeMedications();
    }
  }, [medications.length]); // Only run when medications count changes

  const fetchMedications = async () => {
    try {
      setLoading(true);
      
      // Fetch medications and reminders together
      const [medsResponse, remindersResponse] = await Promise.all([
        axios.get(`${API}/user-medications`),
        axios.get(`${API}/reminders`)
      ]);
      
      const medications = medsResponse.data;
      const reminders = remindersResponse.data;
      
      // Map reminders to medications
      const medsWithReminders = medications.map(med => {
        const medReminder = reminders.find(r => r.medication_id === med.medication_id);
        return {
          ...med,
          times: medReminder ? medReminder.reminder_times : [],
          reminder_id: medReminder ? medReminder.id : null
        };
      });
      
      console.log('📥 Fetched medications with reminders:', medsWithReminders);
      console.log('📊 Medications with confirmed dosage:', medsWithReminders.filter(m => m.user_dosage_confirmed));
      
      setMedications(medsWithReminders);
    } catch (error) {
      console.error('Error fetching medications:', error);
      toast.error(language === 'ar' ? 'خطأ في تحميل الأدوية' : 'Error loading medications');
    } finally {
      setLoading(false);
    }
  };

  // AI-powered medication course analysis (SILENT VERSION - no toasts)
  const analyzeMedicationCourseSilent = async (medication) => {
    setAnalyzingMedication(medication.medication_id);
    
    try {
      const response = await axios.post(`${API}/analyze-medication-course`, {
        medication_name: medication.brand_name || medication.trade_name,
        active_ingredient: medication.active_ingredient,
        dosage_form: medication.dosage_form,
        condition: medication.condition
      });

      const analysis = response.data;
      
      // Save analysis to database
      await axios.put(`${API}/user-medications/${medication.medication_id}`, {
        courseAnalysis: analysis
      });
      
      // Update medication with course info
      const updatedMeds = medications.map(med => 
        med.medication_id === medication.medication_id 
          ? { ...med, courseAnalysis: analysis }
          : med
      );
      
      setMedications(updatedMeds);
      
      // NO TOASTS - Silent analysis
      console.log('✅ Medication analyzed silently:', medication.brand_name);
      
    } catch (error) {
      console.error('Error analyzing medication:', error);
      // Don't show error toast to avoid annoying users
    } finally {
      setAnalyzingMedication(null);
    }
  };

  // AI-powered medication course analysis (WITH TOASTS - for manual trigger)
  const analyzeMedicationCourse = async (medication) => {
    setAnalyzingMedication(medication.medication_id);
    
    try {
      const response = await axios.post(`${API}/analyze-medication-course`, {
        medication_name: medication.brand_name || medication.trade_name,
        active_ingredient: medication.active_ingredient,
        dosage_form: medication.dosage_form,
        condition: medication.condition
      });

      const analysis = response.data;
      
      // Save analysis to database
      await axios.put(`${API}/user-medications/${medication.medication_id}`, {
        courseAnalysis: analysis
      });
      
      // Update medication with course info
      const updatedMeds = medications.map(med => 
        med.medication_id === medication.medication_id 
          ? { ...med, courseAnalysis: analysis }
          : med
      );
      
      setMedications(updatedMeds);
      
      // Show toast based on analysis (only for manual trigger)
      if (analysis.is_as_needed) {
        toast.info(
          language === 'ar' 
            ? `💊 ${medication.brand_name}: يؤخذ عند الحاجة فقط` 
            : `💊 ${medication.brand_name}: Take as needed only`,
          { duration: 5000 }
        );
      } else {
        toast.success(
          language === 'ar' 
            ? `✅ ${medication.brand_name}: كورس ${analysis.recommended_duration} يوم` 
            : `✅ ${medication.brand_name}: ${analysis.recommended_duration} days course`,
          { duration: 5000 }
        );
      }
      
    } catch (error) {
      console.error('Error analyzing medication:', error);
      toast.error(language === 'ar' ? 'خطأ في تحليل الدواء' : 'Error analyzing medication');
    } finally {
      setAnalyzingMedication(null);
    }
  };

  // User dosage form submission handler with auto-reminder creation
  const handleDosageSubmission = async (medicationId, dosageData) => {
    try {
      // Find the medication
      const medication = medications.find(m => m.medication_id === medicationId);
      
      console.log('💾 Saving dosage info for:', medicationId);
      console.log('📦 Data to save:', { user_dosage_confirmed: true, user_dosage_info: dosageData });
      
      // Save dosage info
      const updateResponse = await axios.put(`${API}/user-medications/${medicationId}`, {
        user_dosage_confirmed: true,
        user_dosage_info: dosageData
      });
      
      console.log('✅ Update response:', updateResponse.data);
      
      // Calculate reminder times based on times_per_day
      const timesPerDay = parseInt(dosageData.times_per_day);
      const reminderTimes = [];
      
      if (timesPerDay === 1) {
        reminderTimes.push('09:00');
      } else if (timesPerDay === 2) {
        reminderTimes.push('09:00', '21:00');
      } else if (timesPerDay === 3) {
        reminderTimes.push('08:00', '14:00', '20:00');
      } else if (timesPerDay === 4) {
        reminderTimes.push('08:00', '12:00', '17:00', '21:00');
      } else {
        // For more than 4 times, distribute evenly
        const interval = Math.floor(24 / timesPerDay);
        for (let i = 0; i < timesPerDay; i++) {
          const hour = (8 + (i * interval)) % 24;
          reminderTimes.push(`${hour.toString().padStart(2, '0')}:00`);
        }
      }
      
      console.log('📅 Creating auto-reminders:', reminderTimes);
      
      // Auto-create reminders
      try {
        await axios.post(`${API}/reminders`, {
          medication_id: medicationId,
          medication_name: medication.brand_name || medication.trade_name || medication.condition || 'Medication',
          reminder_times: reminderTimes
        });
        
        console.log('✅ Reminders created successfully');
        
        toast.success(
          language === 'ar' 
            ? `تم حفظ الجرعة وإنشاء ${timesPerDay} تذكير تلقائياً` 
            : `Dosage saved and ${timesPerDay} reminders created automatically`
        );
      } catch (reminderError) {
        // Check if error is "already exists"
        if (reminderError.response?.status === 400) {
          console.log('⚠️ Reminder already exists, updating...');
          // Try to update existing reminder
          try {
            const existingReminders = await axios.get(`${API}/reminders`);
            const existing = existingReminders.data.find(r => r.medication_id === medicationId);
            if (existing) {
              await axios.put(`${API}/reminders/${existing.id}`, {
                reminder_times: reminderTimes,
                enabled: true
              });
              console.log('✅ Reminder updated successfully');
            }
          } catch (updateError) {
            console.error('❌ Failed to update reminder:', updateError);
          }
          
          toast.success(
            language === 'ar' 
              ? `تم حفظ الجرعة وتحديث التذكيرات` 
              : `Dosage saved and reminders updated`
          );
        } else {
          console.error('❌ Error creating reminders:', reminderError);
          toast.warning(
            language === 'ar' 
              ? 'تم حفظ الجرعة، لكن فشل إنشاء التذكيرات' 
              : 'Dosage saved, but failed to create reminders'
          );
        }
      }
      
      // Re-fetch medications from backend to ensure data is in sync
      // Add small delay to ensure backend has processed the save
      await new Promise(resolve => setTimeout(resolve, 500));
      await fetchMedications();
      
    } catch (error) {
      console.error('Error saving dosage info:', error);
      toast.error(
        language === 'ar' 
          ? 'خطأ في حفظ معلومات الجرعة' 
          : 'Error saving dosage information'
      );
    }
  };

  const toggleCalendarType = () => {
    const newType = calendarType === 'gregorian' ? 'islamic' : 'gregorian';
    setCalendarType(newType);
    localStorage.setItem('calendarType', newType);
  };

  // حساب مدة الكورس الفعلية من العبوة
  const calculateActualCourseDuration = (medication) => {
    // إذا كان لديه package_size وعدد مرات يومية
    if (medication.package_size && medication.times && medication.times.length > 0) {
      // حساب: عدد الحبات ÷ عدد المرات يومياً = عدد الأيام
      const duration = Math.floor(medication.package_size / medication.times.length);
      return duration;
    }
    
    // إذا كان لديه AI analysis
    if (medication.courseAnalysis && medication.courseAnalysis.recommended_duration) {
      return medication.courseAnalysis.recommended_duration;
    }
    
    return null;
  };

  const formatDateByCalendar = (dateString) => {
    if (!dateString) return '';
    
    if (calendarType === 'islamic') {
      // تنسيق التاريخ الهجري باستخدام moment-hijri
      const hijriDate = moment(dateString);
      
      if (language === 'ar') {
        // عربي: "10 جمادى الأولى 1446"
        hijriDate.locale('ar-sa');
        return hijriDate.format('iD iMMMM iYYYY');
      } else {
        // إنجليزي: "Jumada al-awwal 10, 1446"
        hijriDate.locale('en');
        return hijriDate.format('iMMMM iD, iYYYY');
      }
    } else {
      // تنسيق التاريخ الميلادي
      const gregorianDate = moment(dateString);
      
      if (language === 'ar') {
        gregorianDate.locale('ar-sa');
        return gregorianDate.format('D MMMM YYYY');
      } else {
        gregorianDate.locale('en');
        return gregorianDate.format('MMM D, YYYY');
      }
    }
  };

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 400;
      const newScrollLeft = direction === 'left' 
        ? carouselRef.current.scrollLeft - scrollAmount
        : carouselRef.current.scrollLeft + scrollAmount;
      
      carouselRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hour, minute] = time.split(':');
    const h = parseInt(hour);
    const m = parseInt(minute);
    
    if (language === 'ar') {
      const period = h >= 12 ? 'مساءً' : 'صباحاً';
      const displayHour = h > 12 ? h - 12 : (h === 0 ? 12 : h);
      return `${displayHour}:${m.toString().padStart(2, '0')} ${period}`;
    } else {
      const period = h >= 12 ? 'PM' : 'AM';
      const displayHour = h > 12 ? h - 12 : (h === 0 ? 12 : h);
      return `${displayHour}:${m.toString().padStart(2, '0')} ${period}`;
    }
  };

  const getMedicationIconType = (med) => {
    const brandName = (med.brand_name || '').toLowerCase();
    const dosageForm = (med.dosage_form || '').toLowerCase();
    const fullText = `${brandName} ${dosageForm}`.toLowerCase();
    
    if (fullText.includes('tablet') || fullText.includes('أقراص')) return 'tablet';
    if (fullText.includes('capsule') || fullText.includes('كبسولات')) return 'capsule';
    if (fullText.includes('syrup') || fullText.includes('شراب')) return 'syrup';
    if (fullText.includes('inhaler')) return 'inhaler';
    return 'tablet';
  };

  const calculateProgress = (startDate, duration) => {
    if (!startDate || !duration) return 0;
    const start = new Date(startDate);
    const now = new Date();
    const daysPassed = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    return Math.min(100, Math.round((daysPassed / duration) * 100));
  };

  const getRemainingDays = (startDate, duration) => {
    if (!startDate || !duration) return null;
    const start = new Date(startDate);
    const now = new Date();
    const daysPassed = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    return Math.max(0, duration - daysPassed);
  };
  
  const getElapsedDays = (startDate) => {
    if (!startDate) return 0;
    const start = new Date(startDate);
    const now = new Date();
    const daysPassed = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    return Math.max(0, daysPassed);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 pb-24" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Back Button - iOS Style */}
          <button
            onClick={() => navigate('/dashboard')}
            className={`flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors mb-3 ${language === 'ar' ? 'mr-auto' : 'ml-0'}`}
          >
            <ChevronLeft className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
            <span className="font-medium">{language === 'ar' ? 'الرئيسية' : 'Home'}</span>
          </button>

          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg flex-shrink-0">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-gray-900 truncate">
                  {language === 'ar' ? 'التذكيرات الذكية' : 'Smart Reminders'}
                </h1>
                <p className="text-sm text-gray-600">
                  {language === 'ar' 
                    ? `${totalReminders} تذكير نشط` 
                    : `${totalReminders} active reminders`}
                </p>
              </div>
            </div>

            {/* Calendar Type Toggle - Smaller */}
            <button
              onClick={toggleCalendarType}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-all shadow-sm flex-shrink-0 text-xs"
            >
              <Clock className="w-3.5 h-3.5 text-purple-600" />
              <span className="font-medium text-gray-700 whitespace-nowrap">
                {calendarType === 'gregorian' 
                  ? (language === 'ar' ? 'ميلادي' : 'Greg')
                  : (language === 'ar' ? 'هجري' : 'Hijri')}
              </span>
            </button>
          </div>
          
          {/* Description */}
          <p className="text-gray-600 text-sm max-w-3xl">
            {language === 'ar' 
              ? 'احصل على تذكيرات ذكية بمواعيد أدويتك ومدة العلاج بالاعتماد على مصادر موثوقة. تذكّر دائماً بمراجعة طبيبك المعالج'
              : 'Get smart reminders for your medications and treatment duration based on reliable sources. Always consult your doctor'}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Filters removed - showing all medications */}

        {/* Medications Grid/List */}
        {filteredMedications.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Pill className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {language === 'ar' ? 'لا توجد أدوية' : 'No Medications'}
              </h3>
              <p className="text-gray-600 mb-6">
                {language === 'ar' ? 'ابدأ بإضافة أدويتك لإدارة التذكيرات' : 'Start by adding your medications to manage reminders'}
              </p>
              <Button onClick={() => navigate('/dashboard')} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'إضافة دواء' : 'Add Medication'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="relative">
            {/* Navigation Arrows */}
            {filteredMedications.length > 1 && (
              <>
                <button
                  onClick={() => scrollCarousel('left')}
                  className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-white/90 hover:bg-white shadow-lg rounded-full transition-all hover:scale-110"
                  aria-label={language === 'ar' ? 'السابق' : 'Previous'}
                >
                  <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>
                <button
                  onClick={() => scrollCarousel('right')}
                  className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-white/90 hover:bg-white shadow-lg rounded-full transition-all hover:scale-110"
                  aria-label={language === 'ar' ? 'التالي' : 'Next'}
                >
                  <ChevronRight className="w-6 h-6 text-gray-700" />
                </button>
              </>
            )}

            {/* Horizontal Carousel */}
            <div 
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto scroll-smooth pb-4 px-1"
              style={{ 
                scrollbarWidth: 'thin',
                scrollbarColor: '#CBD5E0 #F7FAFC'
              }}
            >
            {filteredMedications.map((med) => {
              const analysis = med.courseAnalysis;
              const isExpanded = expandedMed === med.medication_id;
              
              // Get user dosage info for this medication
              const hasConfirmedDosage = med.user_dosage_confirmed;
              const userDosageInfo = med.user_dosage_info || {};
              
              // Calculate duration from user input or fallback to old calculation
              const calculatedDurationFromOld = calculateActualCourseDuration(med);
              let actualDuration = calculatedDurationFromOld;
              if (hasConfirmedDosage && userDosageInfo.duration_value && userDosageInfo.duration_unit) {
                const durationValue = parseInt(userDosageInfo.duration_value);
                if (userDosageInfo.duration_unit === 'days') {
                  actualDuration = durationValue;
                } else if (userDosageInfo.duration_unit === 'weeks') {
                  actualDuration = durationValue * 7;
                } else if (userDosageInfo.duration_unit === 'months') {
                  actualDuration = durationValue * 30;
                }
              }
              
              const isAsNeeded = analysis && analysis.is_as_needed;
              const progress = !isAsNeeded && actualDuration
                ? calculateProgress(med.start_date, actualDuration)
                : null;
              const remainingDays = !isAsNeeded && actualDuration
                ? getRemainingDays(med.start_date, actualDuration)
                : null;

              return (
                <Card 
                  key={med.medication_id} 
                  className="group relative overflow-hidden transition-all duration-300 bg-white hover:shadow-2xl hover:scale-[1.01] border-2 border-gray-100 flex-shrink-0"
                  style={{ width: '95vw', maxWidth: '500px' }}
                >
                  <CardContent className="p-4 sm:p-5">
                    {/* Main Card Content - Always Visible */}
                    <div 
                      className="flex items-start gap-3 mb-3 cursor-pointer"
                      onClick={() => setExpandedMed(isExpanded ? null : med.medication_id)}
                    >
                      <div className="w-14 h-14 flex-shrink-0 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-2.5 shadow-sm border border-blue-100">
                        <MedicationIcon iconType={getMedicationIconType(med)} size={36} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <h3 className="font-bold text-gray-900 text-lg leading-tight flex-1">
                            {language === 'ar' ? (med.trade_name_ar || med.brand_name || med.condition) : (med.brand_name || med.condition)}
                          </h3>
                          {/* Reminder status indicator badge */}
                          {(() => {
                            // Check if reminders are set
                            const hasReminders = med.times && med.times.length > 0;
                            const isDosageConfirmed = med.user_dosage_confirmed === true;
                            
                            if (hasReminders) {
                              return (
                                <div className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 bg-emerald-100 rounded-full">
                                  <Bell className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-xs font-semibold text-emerald-700">✓</span>
                                </div>
                              );
                            } else if (isDosageConfirmed) {
                              return (
                                <div className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 bg-amber-100 rounded-full">
                                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                                </div>
                              );
                            } else {
                              return (
                                <div className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-full">
                                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                                </div>
                              );
                            }
                          })()}
                        </div>
                        
                        {/* Added Date with Calendar Icon */}
                        {/* Hidden - All details removed as per user request */}
                        
                        {/* Analyzing indicator */}
                        {analyzingMedication === med.medication_id && (
                          <div className="flex items-center gap-2 mt-2">
                            <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs font-medium text-blue-600">
                              {language === 'ar' ? 'جاري التحليل...' : 'Analyzing...'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Expanded Details - Shows on Click */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        {/* Active Ingredient */}
                        {(med.active_ingredient || med.scientific_name_ar) && (
                          <div className="mb-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <p className="text-xs text-slate-700">
                              <span className="font-semibold text-slate-900">{language === 'ar' ? 'المادة الفعالة:' : 'Active Ingredient:'}</span> {language === 'ar' ? (med.scientific_name_ar || med.active_ingredient) : med.active_ingredient}
                            </p>
                          </div>
                        )}

                        {/* User Input Form for Dosage & Duration */}
                        {(() => {
                          // Check if user has confirmed dosage info
                          const hasConfirmedDosage = med.user_dosage_confirmed === true;
                          const userDosageInfo = med.user_dosage_info || {};
                          
                          console.log(`🔍 Medication: ${med.brand_name}`);
                          console.log(`  - user_dosage_confirmed: ${med.user_dosage_confirmed}`);
                          console.log(`  - hasConfirmedDosage: ${hasConfirmedDosage}`);
                          console.log(`  - userDosageInfo:`, userDosageInfo);
                          
                          const elapsedDays = getElapsedDays(med.start_date);
                          
                          // Get days from user input (support both old and new format)
                          let treatmentDuration = 30; // default
                          
                          if (userDosageInfo) {
                            // New format: duration_days
                            if (userDosageInfo.duration_days) {
                              treatmentDuration = parseInt(userDosageInfo.duration_days);
                            }
                            // Old format: duration_value + duration_unit
                            else if (userDosageInfo.duration_value && userDosageInfo.duration_unit) {
                              const value = parseInt(userDosageInfo.duration_value);
                              const unit = userDosageInfo.duration_unit;
                              if (unit === 'days') treatmentDuration = value;
                              else if (unit === 'weeks') treatmentDuration = value * 7;
                              else if (unit === 'months') treatmentDuration = value * 30;
                            }
                            console.log(`✅ [${med.brand_name}] Duration: ${treatmentDuration} days`);
                          }
                          
                          return (
                            <div className="mb-4 p-4 sm:p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200 shadow-sm">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                  <Activity className="w-4 h-4 text-emerald-600" />
                                  <span className="text-sm font-semibold text-emerald-900">
                                    {language === 'ar' ? 'تقدم العلاج' : 'Treatment Progress'}
                                  </span>
                                </div>
                                <span className="text-sm font-bold text-emerald-700">
                                  {progress}%
                                </span>
                              </div>
                              
                              {/* User Input Form for Dosage Information */}
                              {!hasConfirmedDosage ? (
                                <DosageInputForm 
                                  medication={med}
                                  language={language}
                                  onSubmit={handleDosageSubmission}
                                  onDelete={async (medId) => {
                                    try {
                                      await axios.delete(`${API}/user-medications/${medId}`);
                                      setMedications(medications.filter(m => m.medication_id !== medId));
                                      toast.success(language === 'ar' ? 'تم حذف الدواء' : 'Medication deleted');
                                      navigate('/dashboard');
                                    } catch (error) {
                                      console.error('Error deleting medication:', error);
                                      toast.error(language === 'ar' ? 'خطأ في حذف الدواء' : 'Error deleting medication');
                                    }
                                  }}
                                />
                              ) : (
                                <div className="mb-4 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-300 shadow-sm">
                                  <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                                      <CheckCircle2 className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm font-semibold text-emerald-900 leading-relaxed mb-2">
                                        {language === 'ar' ? 'تم تأكيد معلومات الجرعة من قبل المستخدم' : 'Dosage information confirmed by user'}
                                      </p>
                                      {userDosageInfo.pills_per_day && (
                                        <div className="flex items-center gap-2 text-xs font-medium text-emerald-800 bg-white/80 px-3 py-2 rounded-lg">
                                          <span className="text-lg">💊</span>
                                          <span>
                                            {language === 'ar' 
                                              ? `${userDosageInfo.pills_per_day} حبة، ${userDosageInfo.times_per_day} مرات يومياً`
                                              : `${userDosageInfo.pills_per_day} pills, ${userDosageInfo.times_per_day} times daily`
                                            }
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {/* Smart Progress Bar - Days or Weeks based on duration */}
                              <div className="mb-3">
                                {treatmentDuration < 7 ? (
                                  /* Short Duration - Show Days Only */
                                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-200">
                                    <div className="text-xs font-semibold text-emerald-700 mb-2 text-center">
                                      {language === 'ar' ? 'تقدم العلاج - بالأيام' : 'Treatment Progress - Days'}
                                    </div>
                                    
                                    {/* Days in a single row - Mobile optimized */}
                                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-7 sm:gap-3">
                                      {Array.from({ length: treatmentDuration }, (_, i) => {
                                        const day = i + 1;
                                        const isCompleted = day <= elapsedDays;
                                        const isToday = day === elapsedDays;
                                        
                                        return (
                                          <div
                                            key={day}
                                            className={`
                                              relative w-full aspect-square rounded-lg flex flex-col items-center justify-center
                                              text-xs font-bold transition-all duration-300 cursor-pointer active:scale-95
                                              ${isCompleted 
                                                ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md' 
                                                : 'bg-white border-2 border-emerald-300 text-emerald-700'
                                              }
                                              ${isToday ? 'ring-2 ring-yellow-400 ring-offset-1 scale-105' : ''}
                                              hover:shadow-lg
                                            `}
                                            title={`${language === 'ar' ? 'اليوم' : 'Day'} ${day}${userDosageInfo.pills_per_day ? `: ${userDosageInfo.pills_per_day} ${language === 'ar' ? 'حبة' : 'pills'}` : ''}`}
                                          >
                                            {isCompleted ? (
                                              <>
                                                <svg className="w-4 h-4 mb-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-[10px] font-semibold">{day}</span>
                                              </>
                                            ) : (
                                              <span className="text-sm font-bold">{day}</span>
                                            )}
                                            
                                            {/* Today indicator */}
                                            {isToday && (
                                              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-pulse shadow-sm" />
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                    
                                    {/* Legend for days view - Mobile optimized */}
                                    <div className="mt-3 pt-3 border-t border-emerald-200 flex flex-wrap items-center justify-center gap-3 text-[11px] text-emerald-700">
                                      <div className="flex items-center gap-1.5">
                                        <div className="w-5 h-5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded shadow-sm flex items-center justify-center">
                                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                          </svg>
                                        </div>
                                        <span className="font-medium whitespace-nowrap">{language === 'ar' ? 'مكتمل' : 'Done'}</span>
                                      </div>
                                      
                                      <div className="flex items-center gap-1.5">
                                        <div className="w-5 h-5 bg-white border-2 border-emerald-300 rounded flex items-center justify-center text-emerald-600 text-[10px] font-bold">
                                          #
                                        </div>
                                        <span className="font-medium whitespace-nowrap">{language === 'ar' ? 'متبقي' : 'Left'}</span>
                                      </div>
                                      
                                      <div className="flex items-center gap-1.5">
                                        <div className="relative w-5 h-5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded shadow-sm flex items-center justify-center">
                                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                          </svg>
                                          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-400 rounded-full" />
                                        </div>
                                        <span className="font-medium whitespace-nowrap">{language === 'ar' ? 'اليوم' : 'Today'}</span>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  /* Long Duration - Show Calendar Grid by Weeks */
                                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-200">
                                  {(() => {
                                    const totalWeeks = Math.ceil(treatmentDuration / 7);
                                    const weeks = [];
                                    
                                    for (let week = 0; week < totalWeeks; week++) {
                                      const weekDays = [];
                                      const startDay = week * 7 + 1;
                                      const endDay = Math.min((week + 1) * 7, treatmentDuration);
                                      
                                      for (let day = startDay; day <= endDay; day++) {
                                        const isCompleted = day <= elapsedDays;
                                        const isToday = day === elapsedDays;
                                        
                                        weekDays.push(
                                          <div
                                            key={day}
                                            className={`
                                              relative w-full aspect-square rounded-lg flex items-center justify-center
                                              text-xs font-bold transition-all duration-300 cursor-pointer active:scale-95
                                              ${isCompleted 
                                                ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md' 
                                                : 'bg-white border-2 border-emerald-300 text-emerald-700'
                                              }
                                              ${isToday ? 'ring-2 ring-yellow-400 ring-offset-1 scale-105' : ''}
                                              hover:shadow-lg
                                            `}
                                            title={`${language === 'ar' ? 'اليوم' : 'Day'} ${day}${userDosageInfo.pills_per_day ? `: ${userDosageInfo.pills_per_day} ${language === 'ar' ? 'حبة' : 'pills'}` : ''}`}
                                          >
                                            {isCompleted ? (
                                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                              </svg>
                                            ) : (
                                              <span className="text-[11px] font-bold">{day}</span>
                                            )}
                                            
                                            {/* Today indicator */}
                                            {isToday && (
                                              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-pulse shadow-sm" />
                                            )}
                                          </div>
                                        );
                                      }
                                      
                                      // No empty placeholders needed with grid layout
                                      
                                      weeks.push(
                                        <div key={week} className="mb-2 last:mb-0">
                                          {/* Week header */}
                                          <div className="flex items-center gap-2 mb-1.5">
                                            <span className="text-xs font-semibold text-emerald-700 min-w-[60px]">
                                              {language === 'ar' ? `أسبوع ${week + 1}` : `Week ${week + 1}`}
                                            </span>
                                            <div className="flex-1 h-px bg-emerald-200" />
                                            <span className="text-[10px] text-emerald-600">
                                              ({Math.min(7, endDay - startDay + 1)}/7)
                                            </span>
                                          </div>
                                          
                                          {/* Week days - Mobile optimized grid */}
                                          <div className="grid grid-cols-4 gap-2 sm:grid-cols-7 sm:gap-3">
                                            {weekDays}
                                          </div>
                                        </div>
                                      );
                                    }
                                    
                                    return weeks;
                                  })()}
                                  
                                  {/* Legend for calendar grid - Mobile optimized */}
                                  <div className="mt-3 pt-3 border-t border-emerald-200 flex flex-wrap items-center justify-center gap-3 text-[11px] text-emerald-700">
                                      <div className="flex items-center gap-1.5">
                                        <div className="w-5 h-5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded shadow-sm flex items-center justify-center">
                                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                          </svg>
                                        </div>
                                        <span className="font-medium whitespace-nowrap">{language === 'ar' ? 'مكتمل' : 'Completed'}</span>
                                      </div>
                                      
                                      <div className="flex items-center gap-1.5">
                                        <div className="w-5 h-5 bg-white border-2 border-emerald-300 rounded flex items-center justify-center text-emerald-600 text-[10px] font-bold">
                                          #
                                        </div>
                                        <span className="font-medium whitespace-nowrap">{language === 'ar' ? 'متبقي' : 'Remaining'}</span>
                                      </div>
                                      
                                    <div className="flex items-center gap-1.5">
                                      <div className="relative w-5 h-5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded shadow-sm flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-400 rounded-full" />
                                      </div>
                                      <span className="font-medium whitespace-nowrap">{language === 'ar' ? 'اليوم' : 'Today'}</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                              
                              {/* Regular progress bar if no user dosage info */}
                              {(!userDosageInfo.pills_per_day || !hasConfirmedDosage) && (
                                <div className="w-full bg-emerald-200 rounded-full h-2.5 mb-2">
                                  <div 
                                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2.5 rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                              )}
                              
                              <div className="flex items-center justify-between text-xs text-emerald-700">
                                <span>
                                  {language === 'ar' 
                                    ? `المدة: ${treatmentDuration} يوم` 
                                    : `Duration: ${treatmentDuration} days`}
                                </span>
                                {remainingDays !== null && (
                                  <span className="font-semibold">
                                    {remainingDays} {language === 'ar' ? 'يوم متبقي' : 'days left'}
                                  </span>
                                )}
                              </div>
                              
                              {analysis.warning && (
                                <div className="mt-3 p-3 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg border-2 border-amber-300 shadow-sm">
                                  <div className="flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
                                    <p className="text-xs font-medium text-amber-900 leading-relaxed">
                                      {language === 'ar' ? analysis.warning_ar : analysis.warning}
                                    </p>
                                  </div>
                                </div>
                              )}
                              
                              {/* User can add custom warnings if needed */}
                            </div>
                          );
                        })()}

                        {/* As Needed Warning */}
                        {analysis && analysis.is_as_needed && (
                          <div className="mb-3 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-amber-900 text-sm mb-1">
                                  {language === 'ar' ? 'تنبيه: استخدام عند الضرورة' : 'Notice: Use As Needed'}
                                </h4>
                                <p className="text-xs text-amber-700 leading-relaxed">
                                  {language === 'ar' 
                                    ? analysis.usage_note_ar || 'هذا الدواء يؤخذ عند الحاجة فقط وليس بشكل منتظم. لا تتناوله إلا عند الضرورة.'
                                    : analysis.usage_note || 'This medication should be taken only when needed, not regularly. Use only when necessary.'}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Reminders Section */}
                        <div className="mb-3">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Bell className="w-4 h-4 text-emerald-600" />
                            {language === 'ar' ? 'التذكيرات' : 'Reminders'}
                          </h4>
                          <ReminderCard 
                            medication={med} 
                            language={language}
                            onReminderUpdate={() => {
                              fetchMedications();
                              fetchTotalReminders();
                            }}
                          />
                        </div>
                        
                        {/* Info message for confirmed medications */}
                        {hasConfirmedDosage && (
                          <div className="mt-4 pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-400 text-center leading-relaxed">
                              {language === 'ar' 
                                ? 'تم حفظ معلومات الدواء بنجاح. لتعديل البيانات، يجب حذف الدواء وإضافته من جديد'
                                : 'Medication information saved. To edit, please delete and re-add the medication'}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                  </CardContent>
                </Card>
              );
            })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

// Dosage Input Form Component
const DosageInputForm = ({ medication, language, onSubmit, onDelete }) => {
  const [formData, setFormData] = useState({
    duration_days: '',
    pills_per_day: '',
    times_per_day: ''
  });

  const handleSubmit = () => {
    // Validation
    if (!formData.duration_days || !formData.pills_per_day || !formData.times_per_day) {
      toast.error(language === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill all fields');
      return;
    }
    
    const days = parseInt(formData.duration_days);
    if (days < 1) {
      toast.error(language === 'ar' ? 'عدد الأيام يجب أن يكون على الأقل 1' : 'Days must be at least 1');
      return;
    }

    onSubmit(medication.medication_id, formData);
  };

  return (
    <div className="mb-4 p-4 sm:p-5 bg-white rounded-xl border-2 border-emerald-200 shadow-sm">
      <h4 className="text-base font-bold text-emerald-900 mb-4">
        {language === 'ar' ? 'أدخل معلومات الجرعة' : 'Enter Dosage Information'}
      </h4>
      
      {/* Dosage Form - Direct without confirmation */}
      <>
          {/* Duration in Days Only */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-800 mb-2.5">
              {language === 'ar' ? 'عدد الأيام' : 'Number of Days'}
            </label>
            <input
              type="number"
              min="1"
              value={formData.duration_days}
              onChange={(e) => setFormData(prev => ({ ...prev, duration_days: e.target.value }))}
              placeholder={language === 'ar' ? 'أدخل عدد الأيام' : 'Enter number of days'}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>
          
          {/* Pills per day - Mobile optimized */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-800 mb-2.5">
              {language === 'ar' ? 'كم حبة في اليوم؟' : 'How many pills per day?'}
            </label>
            <input
              type="number"
              min="1"
              value={formData.pills_per_day}
              onChange={(e) => setFormData(prev => ({ ...prev, pills_per_day: e.target.value }))}
              placeholder={language === 'ar' ? 'عدد الحبات' : 'Number of pills'}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>
          
          {/* Times per day - Mobile optimized */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-800 mb-2.5">
              {language === 'ar' ? 'كم مرة في اليوم؟' : 'How many times per day?'}
            </label>
            <input
              type="number"
              min="1"
              value={formData.times_per_day}
              onChange={(e) => setFormData(prev => ({ ...prev, times_per_day: e.target.value }))}
              placeholder={language === 'ar' ? 'عدد المرات' : 'Number of times'}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>
          
          {/* Submit Button - Enhanced */}
          <button
            onClick={handleSubmit}
            className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg text-sm font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
          >
            {language === 'ar' ? '✓ تأكيد المعلومات' : '✓ Confirm Information'}
          </button>
      </>
    </div>
  );
};

export default SmartReminders;

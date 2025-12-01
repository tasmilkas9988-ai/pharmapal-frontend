import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '../App';
import { Card, CardContent } from '../components/ui/card';
import { Pill, Trash2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent } from '../components/ui/dialog';
import MedicationIcon from '../components/MedicationIcon';
import BottomNav from '../components/BottomNav';
import { toast } from 'sonner';

const Medicines = ({ user }) => {
  const navigate = useNavigate();
  const [medications, setMedications] = useState([]);
  const [filteredMedications, setFilteredMedications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [medicationToDelete, setMedicationToDelete] = useState(null);
  const [showMedicationDetails, setShowMedicationDetails] = useState(false);
  const [selectedMedicationDetails, setSelectedMedicationDetails] = useState(null);
  const [wikipediaInfo, setWikipediaInfo] = useState(null);
  const [loadingWikipediaInfo, setLoadingWikipediaInfo] = useState(false);
  const language = localStorage.getItem('preferredLanguage') || 'ar';
  const carouselRef = React.useRef(null);

  useEffect(() => {
    fetchMedications();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMedications(medications);
    } else {
      const filtered = medications.filter(med => {
        const searchLower = searchQuery.toLowerCase();
        return (
          (med.brand_name && med.brand_name.toLowerCase().includes(searchLower)) ||
          (med.trade_name_ar && med.trade_name_ar.includes(searchQuery)) ||
          (med.active_ingredient && med.active_ingredient.toLowerCase().includes(searchLower)) ||
          (med.scientific_name_ar && med.scientific_name_ar.includes(searchQuery)) ||
          (med.condition && med.condition.toLowerCase().includes(searchLower))
        );
      });
      setFilteredMedications(filtered);
    }
  }, [searchQuery, medications]);

  const fetchMedications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/user-medications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMedications(response.data);
      setFilteredMedications(response.data);
    } catch (error) {
      console.error('Error fetching medications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMedication = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API}/user-medications/${medicationToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Show success message with details
      const remindersDeleted = response.data?.reminders_deleted || 0;
      if (remindersDeleted > 0) {
        toast.success(
          language === 'ar' 
            ? `تم حذف الدواء و ${remindersDeleted} تذكير مرتبط به` 
            : `Medication and ${remindersDeleted} associated reminder(s) deleted`
        );
      } else {
        toast.success(language === 'ar' ? 'تم حذف الدواء بنجاح' : 'Medication deleted successfully');
      }
      
      // Reload medications
      await fetchMedications();
      
      // Trigger custom event to update reminders counter in other components
      window.dispatchEvent(new CustomEvent('medicationDeleted', { 
        detail: { 
          medicationId: medicationToDelete,
          remindersDeleted: remindersDeleted 
        } 
      }));
      
      setShowDeleteConfirm(false);
      setMedicationToDelete(null);
    } catch (error) {
      console.error('Error deleting medication:', error);
      toast.error(language === 'ar' ? 'خطأ في حذف الدواء' : 'Error deleting medication');
    }
  };

  const openRemindersModal = (med) => {
    navigate('/reminders');
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

  const getMedicationIconType = (med) => {
    const brandName = (med.brand_name || med.trade_name || '').toLowerCase();
    const dosageForm = (med.dosage_form || '').toLowerCase();
    const packType = (med.pack || '').toLowerCase();
    const fullText = `${brandName} ${dosageForm} ${packType}`.toLowerCase();
    
    if (fullText.includes('prefilled pen') || fullText.includes('pre-filled pen') || fullText.includes('pen injector')) return 'prefilled_pen';
    if (fullText.includes('automatic injection device') || fullText.includes('autoinjector')) return 'autoinjector_device';
    if (fullText.includes('pre-filled syringe') || fullText.includes('prefilled syringe')) return 'prefilled_syringe';
    if (fullText.includes('injection syringe')) return 'injection_syringe';
    if (fullText.includes('vial')) return 'vial';
    if (fullText.includes('ampoule') || fullText.includes('amp') || fullText.includes('أمبول')) return 'ampoule';
    if (fullText.includes('bag') || (fullText.includes('pouch') && fullText.includes('infusion'))) return 'bag_infusion';
    if (fullText.includes('ovule') || fullText.includes('vaginal sponge applicator') || fullText.includes('suppository') || fullText.includes('supp') || fullText.includes('rectal') || fullText.includes('تحاميل')) return 'ovule_vaginal';
    if (fullText.includes('transdermal patch')) return 'transdermal_patch';
    if (fullText.includes('patch') || fullText.includes('tape') || fullText.includes('لاصقة')) return 'patch';
    if (fullText.includes('nasal applicator')) return 'nasal_applicator';
    if (fullText.includes('nasal spray')) return 'nasal_spray';
    if (fullText.includes('oral spray')) return 'oral_spray';
    if (fullText.includes('topical spray')) return 'topical_spray';
    if (fullText.includes('spray container') || fullText.includes('spray pump') || fullText.includes('spray') || fullText.includes('بخاخ')) return 'spray_container';
    if (fullText.includes('inhaler') || fullText.includes('aerosol') || fullText.includes('بخاخ صدري')) return 'inhaler';
    if (fullText.includes('injection') || fullText.includes('حقن')) return 'injection_syringe';
    if (fullText.includes('drops') || fullText.includes('drop') || fullText.includes('قطرة')) return 'bottle_dropper';
    if (fullText.includes('capsule') || fullText.includes('cap') || fullText.includes('كبسولة')) return 'capsule';
    if (fullText.includes('cream') || fullText.includes('ointment') || fullText.includes('gel') || fullText.includes('كريم')) return 'tube';
    if (fullText.includes('syrup') || fullText.includes('solution') || fullText.includes('suspension') || fullText.includes('شراب')) return 'syrup';
    if (fullText.includes('tablet') || fullText.includes('tab') || fullText.includes('أقراص')) return 'tablet';
    
    return 'tablet';
  };

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 400; // pixels to scroll
      const newScrollPosition = carouselRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      carouselRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const getMedicationType = (med) => {
    const classification = (med.dosage_form || med.classification || '').toLowerCase();
    
    if (classification.includes('tablet') || classification.includes('tab')) {
      return language === 'ar' ? 'أقراص' : 'Tablet';
    }
    if (classification.includes('capsule') || classification.includes('cap')) {
      return language === 'ar' ? 'كبسولة' : 'Capsule';
    }
    if (classification.includes('syrup') || classification.includes('liquid') || classification.includes('oral')) {
      return language === 'ar' ? 'شراب' : 'Syrup';
    }
    if (classification.includes('spray') || classification.includes('nasal')) {
      return language === 'ar' ? 'بخاخ' : 'Spray';
    }
    if (classification.includes('inhaler') || classification.includes('aerosol')) {
      return language === 'ar' ? 'بخاخ صدري' : 'Inhaler';
    }
    if (classification.includes('injection') || classification.includes('ampoule') || classification.includes('amp')) {
      return language === 'ar' ? 'حقن' : 'Injection';
    }
    if (classification.includes('drops') || classification.includes('drop')) {
      return language === 'ar' ? 'قطرة' : 'Drops';
    }
    if (classification.includes('cream') || classification.includes('ointment') || classification.includes('gel')) {
      return language === 'ar' ? 'كريم' : 'Cream';
    }
    return language === 'ar' ? 'دواء' : 'Medication';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header - iOS Style like SmartReminders */}
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
              <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg flex-shrink-0">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-gray-900 truncate">
                  {language === 'ar' ? 'قائمة الأدوية' : 'Medications List'}
                </h1>
                <p className="text-sm text-gray-600">
                  {language === 'ar' 
                    ? `${medications.length} دواء مسجل` 
                    : `${medications.length} medications`}
                </p>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-gray-600 text-sm max-w-3xl">
            {language === 'ar' 
              ? 'عرض وإدارة جميع أدويتك مع التفاصيل الكاملة لكل دواء'
              : 'View and manage all your medications with complete details for each'}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : filteredMedications.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Pill className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery 
                  ? (language === 'ar' ? 'لا توجد نتائج' : 'No results found')
                  : (language === 'ar' ? 'لا توجد أدوية' : 'No medicines yet')}
              </h3>
              <p className="text-gray-600">
                {searchQuery
                  ? (language === 'ar' ? 'جرب البحث بكلمات مختلفة' : 'Try searching with different keywords')
                  : (language === 'ar' ? 'ابدأ بإضافة أدويتك من الصفحة الرئيسية' : 'Start by adding your medicines from the home page')}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="relative">
            {/* Navigation Buttons for Desktop */}
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
            
            <div 
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto scroll-smooth pb-4 px-1"
              style={{ 
                scrollbarWidth: 'thin',
                scrollbarColor: '#CBD5E0 #F7FAFC'
              }}
            >
              {filteredMedications.map((med, idx) => (
                    <Card 
                      key={med.id}
                      className="group relative overflow-hidden transition-all duration-500 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 hover:shadow-2xl hover:scale-[1.02] border-0 flex-shrink-0 cursor-pointer rounded-3xl backdrop-blur-sm"
                      style={{ 
                        width: '380px', 
                        maxWidth: '90vw',
                        animation: `fadeIn 0.5s ease-out ${idx * 0.1}s both`,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                      }}
                      onClick={() => fetchMedicationDetails(med)}
                    >
                    {/* Gradient Overlay for Fading Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <CardContent className="p-5 relative z-10">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-16 h-16 flex-shrink-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl p-3 shadow-lg">
                          <MedicationIcon iconType={getMedicationIconType(med)} size={40} className="text-white" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent text-lg leading-tight mb-2">
                            {language === 'ar' && med.trade_name_ar 
                              ? med.trade_name_ar 
                              : (med.brand_name || med.trade_name || med.condition)}
                          </h3>
                          
                          <div className="flex items-center gap-1.5 flex-wrap mb-2">
                            <span className="px-3 py-1 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-full text-xs font-semibold shadow-sm">
                              {getMedicationType(med)}
                            </span>
                            {(med.prescribed_dosage || med.strength) && (
                              <span className="px-3 py-1 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-full text-xs font-semibold shadow-sm">
                                {language === "ar" ? (med.prescribed_dosage || med.strength).replace(/mg/gi, 'ملغ').replace(/ml/gi, 'مل') : (med.prescribed_dosage || med.strength)}
                              </span>
                            )}
                          </div>

                          {(med.active_ingredient || med.scientific_name || med.active_ingredients || med.scientific_name_ar) && (
                            <div className="mb-2 p-2.5 bg-white/60 backdrop-blur-sm rounded-xl border border-blue-100/50 shadow-sm">
                              <p className="text-xs text-gray-700 leading-relaxed">
                                <span className="font-bold text-blue-700">💊 {language === 'ar' ? 'المادة الفعالة:' : 'Active:'}</span> {language === 'ar' && med.scientific_name_ar 
                                  ? med.scientific_name_ar 
                                  : (med.active_ingredient || med.scientific_name || med.active_ingredients)}
                              </p>
                            </div>
                          )}
                        </div>

                        <Button
                          size="sm"
                          variant="ghost"
                          className="hover:bg-red-50 rounded-full p-2.5 flex-shrink-0 transition-all duration-300 hover:scale-110"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMedicationToDelete(med.id);
                            setShowDeleteConfirm(true);
                          }}
                        >
                          <Trash2 className="w-5 h-5 text-red-500" />
                        </Button>
                      </div>

                      <div className="space-y-2.5 pt-3 border-t border-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
                        <div className="flex items-center justify-between p-2 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl">
                          <span className="font-semibold text-gray-700 text-sm flex items-center gap-1.5">
                            📦 {language === 'ar' ? 'حجم العبوة' : 'Package Size'}
                          </span>
                          <span className="font-medium text-gray-900 text-sm">
                            {med.package_size
                              ? `${med.package_size} ${language === 'ar' ? (med.unit_ar || med.unit || 'وحدة') : (med.unit || 'units')}`
                              : (language === 'ar' ? 'غير محدد' : 'Not specified')}
                          </span>
                        </div>

                        {med.price_sar && (
                          <div className="flex items-center justify-between p-2 bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-xl">
                            <span className="font-semibold text-gray-700 text-sm flex items-center gap-1.5">
                              💰 {language === 'ar' ? 'السعر' : 'Price'}
                            </span>
                            <span className="font-bold text-emerald-600 text-base">
                              {med.price_sar} {language === 'ar' ? 'ر.س' : 'SAR'}
                            </span>
                          </div>
                        )}

                        <p className="text-xs text-blue-500 font-medium pt-2 text-center animate-pulse">
                          {language === 'ar' ? '👆 اضغط لعرض التفاصيل الكاملة' : '👆 Tap to view full details'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  ))}
              </div>
            </div>
          )}
      </div>

      {/* Medication Details Dialog */}
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
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-4 py-4" dir={language === "ar" ? "rtl" : "ltr"}>
            {loadingWikipediaInfo ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
                <p className="text-gray-600 font-medium">
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

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete'}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === 'ar' ? 'هل أنت متأكد من حذف هذا الدواء؟' : 'Are you sure you want to delete this medication?'}
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDeleteMedication}
              >
                {language === 'ar' ? 'حذف' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Medicines;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../App';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight, User, Calendar, Phone, Users } from 'lucide-react';
import BottomNav from '../components/BottomNav';

const Profile = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [language] = useState(
    localStorage.getItem('preferredLanguage') || 'ar'
  );
  
  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    birth_date: '',
    gender: '',
    height: '',
    weight: ''
  });

  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState('');
  const [bmiColor, setBmiColor] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Disable dark mode in settings pages
    document.documentElement.classList.remove('dark');
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API}/profile`);
      const data = {
        full_name: response.data.full_name || '',
        phone: response.data.phone || '',
        birth_date: response.data.birth_date || '',
        gender: response.data.gender || '',
        height: response.data.height || '',
        weight: response.data.weight || ''
      };
      setProfileData(data);
      
      // Calculate BMI if height and weight exist
      if (data.height && data.weight) {
        calculateBMI(data.height, data.weight);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const calculateBMI = (height, weight) => {
    if (height && weight && height > 0 && weight > 0) {
      const heightInMeters = height / 100;
      const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      setBmi(bmiValue);
      
      // Determine BMI category
      if (bmiValue < 18.5) {
        setBmiCategory(language === 'ar' ? 'نقص الوزن' : 'Underweight');
        setBmiColor('text-blue-600');
      } else if (bmiValue >= 18.5 && bmiValue < 25) {
        setBmiCategory(language === 'ar' ? 'وزن طبيعي' : 'Normal weight');
        setBmiColor('text-green-600');
      } else if (bmiValue >= 25 && bmiValue < 30) {
        setBmiCategory(language === 'ar' ? 'زيادة وزن' : 'Overweight');
        setBmiColor('text-yellow-600');
      } else {
        setBmiCategory(language === 'ar' ? 'سمنة' : 'Obese');
        setBmiColor('text-red-600');
      }
    } else {
      setBmi(null);
      setBmiCategory('');
      setBmiColor('');
    }
  };

  useEffect(() => {
    calculateBMI(profileData.height, profileData.weight);
  }, [profileData.height, profileData.weight, language]);

  const handleInputChange = (field, value) => {
    setProfileData({
      ...profileData,
      [field]: value
    });
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      
      // Validate required fields
      if (!profileData.full_name.trim()) {
        toast.error(
          language === 'ar'
            ? 'يرجى إدخال الاسم الكامل'
            : 'Please enter your full name'
        );
        return;
      }

      await axios.put(`${API}/profile`, profileData);
      
      // Update user in context
      setUser({
        ...user,
        full_name: profileData.full_name
      });
      
      // Update localStorage
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({
        ...storedUser,
        full_name: profileData.full_name
      }));

      toast.success(
        language === 'ar'
          ? 'تم تحديث الملف الشخصي بنجاح'
          : 'Profile updated successfully'
      );
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error(
        language === 'ar'
          ? 'حدث خطأ أثناء تحديث الملف'
          : 'Error updating profile'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-gray-50 pb-20"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/settings')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {language === 'ar' ? (
                <ChevronRight className="w-6 h-6 text-gray-600" />
              ) : (
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              )}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                {language === 'ar' ? 'الملف الشخصي' : 'Personal Profile'}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 mt-5 space-y-4">
        
        {/* Profile Form */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            {language === 'ar' ? 'معلومات الحساب' : 'Account Information'}
          </h2>
          
          <div className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{language === 'ar' ? 'الاسم الكامل' : 'Full Name'} *</span>
                </div>
              </label>
              <Input
                type="text"
                value={profileData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                placeholder={language === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                className="w-full"
                dir={language === 'ar' ? 'rtl' : 'ltr'}
                style={{ textAlign: language === 'ar' ? 'right' : 'left' }}
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{language === 'ar' ? 'رقم الجوال' : 'Phone Number'}</span>
                </div>
              </label>
              <Input
                type="tel"
                value={profileData.phone}
                disabled
                className="w-full bg-gray-100 cursor-not-allowed"
                dir="ltr"
                style={{ textAlign: 'left' }}
              />
              <p className="text-xs text-gray-500 mt-1">
                {language === 'ar' 
                  ? 'لا يمكن تغيير رقم الجوال'
                  : 'Phone number cannot be changed'
                }
              </p>
            </div>

            {/* Birth Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{language === 'ar' ? 'تاريخ الميلاد' : 'Birth Date'}</span>
                </div>
              </label>
              <Input
                type="date"
                value={profileData.birth_date}
                onChange={(e) => handleInputChange('birth_date', e.target.value)}
                className="w-full"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{language === 'ar' ? 'الجنس' : 'Gender'}</span>
                </div>
              </label>
              <select
                value={profileData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                dir={language === 'ar' ? 'rtl' : 'ltr'}
                style={{ textAlign: language === 'ar' ? 'right' : 'left' }}
              >
                <option value="">
                  {language === 'ar' ? 'اختر الجنس' : 'Select gender'}
                </option>
                <option value="male">
                  {language === 'ar' ? 'ذكر' : 'Male'}
                </option>
                <option value="female">
                  {language === 'ar' ? 'أنثى' : 'Female'}
                </option>
              </select>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-4"></div>

            {/* Health Metrics Section */}
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              {language === 'ar' ? 'المقاييس الصحية' : 'Health Metrics'}
            </h3>

            {/* Height and Weight in Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Height */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الطول (سم)' : 'Height (cm)'}
                </label>
                <Input
                  type="number"
                  value={profileData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  placeholder="170"
                  className="w-full"
                  min="50"
                  max="250"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الوزن (كجم)' : 'Weight (kg)'}
                </label>
                <Input
                  type="number"
                  value={profileData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  placeholder="70"
                  className="w-full"
                  min="20"
                  max="300"
                />
              </div>
            </div>
          </div>

          {/* BMI Card */}
          {bmi && (
            <div className="mt-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {language === 'ar' ? 'مؤشر كتلة الجسم (BMI)' : 'Body Mass Index (BMI)'}
                </h3>
                <div className="text-right">
                  <p className="text-3xl font-bold text-blue-600">{bmi}</p>
                  <p className={`text-sm font-semibold ${bmiColor}`}>{bmiCategory}</p>
                </div>
              </div>

              {/* BMI Scale Chart */}
              <div className="space-y-3">
                <div className="relative">
                  {/* Scale Bar */}
                  <div className="h-8 rounded-full overflow-hidden flex">
                    <div className="bg-blue-400 flex-1"></div>
                    <div className="bg-green-400 flex-1"></div>
                    <div className="bg-yellow-400 flex-1"></div>
                    <div className="bg-red-400 flex-1"></div>
                  </div>
                  
                  {/* Indicator */}
                  <div 
                    className="absolute top-0 transform -translate-x-1/2"
                    style={{
                      left: `${Math.min(Math.max((bmi / 40) * 100, 0), 100)}%`,
                      marginTop: '-8px'
                    }}
                  >
                    <div className="w-1 h-12 bg-gray-800 rounded-full"></div>
                    <div className="w-3 h-3 bg-gray-800 rounded-full absolute -top-1 left-1/2 transform -translate-x-1/2"></div>
                  </div>
                </div>

                {/* Legend */}
                <div className="grid grid-cols-4 gap-2 text-xs text-center mt-6">
                  <div>
                    <div className="w-4 h-4 bg-blue-400 rounded-full mx-auto mb-1"></div>
                    <p className="text-gray-700 font-medium">&lt;18.5</p>
                    <p className="text-gray-600 text-[10px]">
                      {language === 'ar' ? 'نقص وزن' : 'Underweight'}
                    </p>
                  </div>
                  <div>
                    <div className="w-4 h-4 bg-green-400 rounded-full mx-auto mb-1"></div>
                    <p className="text-gray-700 font-medium">18.5-24.9</p>
                    <p className="text-gray-600 text-[10px]">
                      {language === 'ar' ? 'طبيعي' : 'Normal'}
                    </p>
                  </div>
                  <div>
                    <div className="w-4 h-4 bg-yellow-400 rounded-full mx-auto mb-1"></div>
                    <p className="text-gray-700 font-medium">25-29.9</p>
                    <p className="text-gray-600 text-[10px]">
                      {language === 'ar' ? 'زيادة وزن' : 'Overweight'}
                    </p>
                  </div>
                  <div>
                    <div className="w-4 h-4 bg-red-400 rounded-full mx-auto mb-1"></div>
                    <p className="text-gray-700 font-medium">≥30</p>
                    <p className="text-gray-600 text-[10px]">
                      {language === 'ar' ? 'سمنة' : 'Obese'}
                    </p>
                  </div>
                </div>

                {/* BMI Info */}
                <div className="mt-4 p-3 bg-white/80 rounded-lg">
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {language === 'ar'
                      ? 'مؤشر كتلة الجسم (BMI) هو مقياس للوزن بالنسبة للطول. استشر طبيبك للحصول على تقييم صحي شامل.'
                      : 'BMI is a measure of weight relative to height. Consult your doctor for a comprehensive health assessment.'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-6">
            <Button
              onClick={handleSaveProfile}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
            >
              {isLoading
                ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...')
                : (language === 'ar' ? 'حفظ التغييرات' : 'Save Changes')
              }
            </Button>
          </div>
        </div>

        {/* Info Note */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <p className="text-sm text-blue-800">
            {language === 'ar'
              ? 'ملاحظة: رقم الجوال هو وسيلة تسجيل الدخول الخاصة بك ولا يمكن تغييره لأسباب أمنية.'
              : 'Note: Your phone number is your login credential and cannot be changed for security reasons.'
            }
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;

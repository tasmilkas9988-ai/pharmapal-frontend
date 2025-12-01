import React, { useState } from 'react';
import { X, AlertCircle, Check } from 'lucide-react';

const DosageInputForm = ({ medication, language, onSubmit, onCancel, onDelete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    is_correct_medication: null,
    duration_value: '',
    duration_unit: 'days',
    pills_per_day: '',
    times_per_day: ''
  });

  const handleMedicationConfirm = (isCorrect) => {
    if (!isCorrect) {
      // Delete medication and redirect
      onDelete(medication.medication_id);
    } else {
      setFormData({ ...formData, is_correct_medication: true });
      setStep(2);
    }
  };

  const handleSubmit = () => {
    // Validate all fields
    if (!formData.duration_value || !formData.pills_per_day || !formData.times_per_day) {
      alert(language === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill all fields');
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="mb-3 p-4 bg-white rounded-xl border-2 border-blue-300 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-blue-900">
          {language === 'ar' ? '📋 معلومات الجرعة' : '📋 Dosage Information'}
        </h3>
        <button
          onClick={onCancel}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Step 1: Medication Confirmation */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-semibold text-blue-900 mb-3">
              {language === 'ar' 
                ? '❓ هل هذا الدواء هو نفسه الذي وصفه لك الطبيب؟' 
                : '❓ Is this the same medication prescribed by your doctor?'}
            </p>
            <div className="text-sm text-blue-800 mb-4">
              <div className="font-bold">{medication.brand_name || medication.condition}</div>
              {medication.scientific_name && (
                <div className="text-xs mt-1">{medication.scientific_name}</div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleMedicationConfirm(true)}
                className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                {language === 'ar' ? 'نعم، صحيح' : 'Yes, Correct'}
              </button>
              <button
                onClick={() => handleMedicationConfirm(false)}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                {language === 'ar' ? 'لا، ليس صحيح' : 'No, Not Correct'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Dosage Details */}
      {step === 2 && (
        <div className="space-y-4">
          {/* Duration */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {language === 'ar' ? '📅 مدة العلاج' : '📅 Treatment Duration'}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                value={formData.duration_value}
                onChange={(e) => setFormData({ ...formData, duration_value: e.target.value })}
                className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder={language === 'ar' ? 'أدخل الرقم' : 'Enter number'}
              />
              <select
                value={formData.duration_unit}
                onChange={(e) => setFormData({ ...formData, duration_unit: e.target.value })}
                className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="days">{language === 'ar' ? 'أيام' : 'Days'}</option>
                <option value="weeks">{language === 'ar' ? 'أسابيع' : 'Weeks'}</option>
                <option value="months">{language === 'ar' ? 'أشهر' : 'Months'}</option>
              </select>
            </div>
          </div>

          {/* Pills per day */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {language === 'ar' ? '💊 كم حبة في اليوم؟' : '💊 How many pills per day?'}
            </label>
            <input
              type="number"
              min="1"
              value={formData.pills_per_day}
              onChange={(e) => setFormData({ ...formData, pills_per_day: e.target.value })}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder={language === 'ar' ? 'مثال: 2' : 'Example: 2'}
            />
          </div>

          {/* Times per day */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {language === 'ar' ? '🕐 كم مرة في اليوم؟' : '🕐 How many times per day?'}
            </label>
            <input
              type="number"
              min="1"
              value={formData.times_per_day}
              onChange={(e) => setFormData({ ...formData, times_per_day: e.target.value })}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder={language === 'ar' ? 'مثال: 3' : 'Example: 3'}
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
          >
            {language === 'ar' ? '✓ تأكيد وحفظ' : '✓ Confirm and Save'}
          </button>
        </div>
      )}
    </div>
  );
};

export default DosageInputForm;

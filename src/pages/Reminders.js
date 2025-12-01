import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Plus, X } from 'lucide-react';
import BottomNav from '../components/BottomNav';

const API = process.env.REACT_APP_BACKEND_URL || '';

function Reminders({ user, language }) {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState([]);
  const [userMedications, setUserMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [reminderTimes, setReminderTimes] = useState(['08:00', '20:00']);
  const [adherenceStats, setAdherenceStats] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reminderToDelete, setReminderToDelete] = useState(null);

  const text = {
    ar: {
      title: 'إدارة التذكيرات الذكية',
      backToDashboard: 'العودة للصفحة الرئيسية',
      allReminders: 'جميع التذكيرات',
      addReminder: 'إضافة تذكير جديد',
      noReminders: 'لا توجد تذكيرات حتى الآن',
      medication: 'الدواء',
      times: 'المواعيد',
      enabled: 'مفعّل',
      disabled: 'معطّل',
      edit: 'تعديل',
      delete: 'حذف',
      selectMedication: 'اختر الدواء',
      addTime: 'إضافة موعد',
      save: 'حفظ',
      cancel: 'إلغاء',
      adherence: 'معدل الالتزام',
      last7days: 'آخر 7 أيام',
      expected: 'المتوقع',
      taken_count: 'المأخوذ',
      missed: 'المفقود',
      deleteConfirm: 'هل تريد حذف هذا التذكير؟',
      addMedicationFirst: 'يرجى إضافة أدوية أولاً من الصفحة الرئيسية',
      reminderExists: 'يوجد تذكير لهذا الدواء بالفعل',
      loading: 'جاري التحميل...'
    },
    en: {
      title: 'Smart Reminders Management',
      backToDashboard: 'Back to Home',
      allReminders: 'All Reminders',
      addReminder: 'Add New Reminder',
      noReminders: 'No reminders yet',
      medication: 'Medication',
      times: 'Times',
      enabled: 'Enabled',
      disabled: 'Disabled',
      edit: 'Edit',
      delete: 'Delete',
      selectMedication: 'Select Medication',
      addTime: 'Add Time',
      save: 'Save',
      cancel: 'Cancel',
      adherence: 'Adherence Rate',
      last7days: 'Last 7 Days',
      expected: 'Expected',
      taken_count: 'Taken',
      missed: 'Missed',
      deleteConfirm: 'Are you sure you want to delete this reminder?',
      addMedicationFirst: 'Please add medications first from the home page',
      reminderExists: 'Reminder already exists for this medication',
      loading: 'Loading...'
    }
  };

  const t = text[language] || text.en;

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch reminders
      const remindersRes = await axios.get(`${API}/api/reminders`, { headers });
      setReminders(remindersRes.data);

      // Fetch user medications for dropdown
      const medsRes = await axios.get(`${API}/api/user-medications`, { headers });
      setUserMedications(medsRes.data.filter(med => med.active && !med.archived));

      // Fetch adherence stats for each reminder
      const stats = {};
      for (const reminder of remindersRes.data) {
        try {
          const statsRes = await axios.get(
            `${API}/api/reminders/${reminder.id}/adherence?days=7`,
            { headers }
          );
          stats[reminder.id] = statsRes.data;
        } catch (err) {
          console.error('Error fetching adherence stats:', err);
        }
      }
      setAdherenceStats(stats);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(language === 'ar' ? 'خطأ في جلب البيانات' : 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddReminder = async () => {
    if (!selectedMedication) {
      toast.warning(t.selectMedication);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const data = {
        medication_id: selectedMedication.medication_id,
        medication_name: selectedMedication.brand_name || selectedMedication.condition,
        reminder_times: reminderTimes
      };

      await axios.post(`${API}/api/reminders`, data, { headers });
      toast.success(language === 'ar' ? '✅ تم إضافة التذكير' : '✅ Reminder added');
      setShowAddModal(false);
      setSelectedMedication(null);
      setReminderTimes(['08:00', '20:00']);
      fetchData();
    } catch (error) {
      console.error('Error adding reminder:', error);
      if (error.response?.status === 400) {
        toast.error(t.reminderExists);
      } else {
        toast.error(language === 'ar' ? 'خطأ في إضافة التذكير' : 'Error adding reminder');
      }
    }
  };

  const handleToggleReminder = async (reminderId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.patch(`${API}/api/reminders/${reminderId}/toggle`, {}, { headers });
      toast.success(language === 'ar' ? '✅ تم التحديث' : '✅ Updated');
      fetchData();
    } catch (error) {
      console.error('Error toggling reminder:', error);
      toast.error(language === 'ar' ? 'خطأ في التحديث' : 'Error updating');
    }
  };

  const handleDeleteReminder = async () => {
    if (!reminderToDelete) return;

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.delete(`${API}/reminders/${reminderToDelete}`, { headers });
      toast.success(language === 'ar' ? '✅ تم حذف التذكير بنجاح' : '✅ Reminder deleted successfully');
      
      // Trigger event to update counter in Dashboard
      window.dispatchEvent(new CustomEvent('reminderDeleted', { 
        detail: { reminderId: reminderToDelete } 
      }));
      
      setShowDeleteConfirm(false);
      setReminderToDelete(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting reminder:', error);
      toast.error(language === 'ar' ? 'خطأ في حذف التذكير' : 'Error deleting reminder');
    }
  };

  const addTimeSlot = () => {
    setReminderTimes([...reminderTimes, '12:00']);
  };

  const updateTimeSlot = (index, value) => {
    const newTimes = [...reminderTimes];
    newTimes[index] = value;
    setReminderTimes(newTimes);
  };

  const removeTimeSlot = (index) => {
    if (reminderTimes.length > 1) {
      setReminderTimes(reminderTimes.filter((_, i) => i !== index));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 p-8 flex items-center justify-center">
        <div className="text-2xl text-teal-600">{t.loading}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 p-4 md:p-8 pb-24" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className={`flex justify-between items-center ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-white rounded-lg transition"
            >
              <ArrowLeft className={`w-6 h-6 text-teal-700 ${language === 'ar' ? 'rotate-180' : ''}`} />
            </button>
            <h1 className="text-4xl font-bold text-teal-700">{t.title}</h1>
          </div>
        </div>
      </div>

      {/* All Reminders Section */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-teal-700 mb-4">{t.allReminders}</h2>
          {reminders.length === 0 ? (
            <div className="text-center py-16">
              <Bell className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">{t.noReminders}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="border-2 border-gray-200 rounded-lg p-5 hover:border-teal-300 transition"
                >
                  <div className={`flex justify-between items-start ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {reminder.medication_name}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {reminder.reminder_times.map((time, index) => (
                          <span
                            key={index}
                            className="bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold"
                          >
                            ⏰ {time}
                          </span>
                        ))}
                      </div>
                      
                      {/* Adherence Stats */}
                      {adherenceStats[reminder.id] && (
                        <div className="bg-gray-50 rounded-lg p-4 mt-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-600">
                              {t.adherence} ({t.last7days})
                            </span>
                            <span className="text-3xl font-bold text-teal-600">
                              {adherenceStats[reminder.id].adherence_rate}%
                            </span>
                          </div>
                          <div className="flex gap-4 text-sm">
                            <span className="text-gray-600">
                              {t.expected}: <strong>{adherenceStats[reminder.id].expected_doses}</strong>
                            </span>
                            <span className="text-green-600">
                              {t.taken_count}: <strong>{adherenceStats[reminder.id].taken_doses}</strong>
                            </span>
                            <span className="text-red-600">
                              {t.missed}: <strong>{adherenceStats[reminder.id].missed_doses}</strong>
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className={`flex flex-col gap-2 ${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                      <button
                        onClick={() => handleToggleReminder(reminder.id)}
                        className={`px-5 py-2 rounded-lg font-semibold transition ${
                          reminder.enabled
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {reminder.enabled ? t.enabled : t.disabled}
                      </button>
                      <button
                        onClick={() => {
                          setReminderToDelete(reminder.id);
                          setShowDeleteConfirm(true);
                        }}
                        className="bg-red-100 text-red-700 px-5 py-2 rounded-lg hover:bg-red-200 transition font-semibold"
                      >
                        {t.delete}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Reminder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h2 className={`text-2xl font-bold text-teal-700 mb-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>{t.addReminder}</h2>
            
            {/* Medication Selection */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">{t.medication}</label>
              <select
                value={selectedMedication?.medication_id || ''}
                onChange={(e) => {
                  const med = userMedications.find(m => m.medication_id === e.target.value);
                  setSelectedMedication(med);
                }}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none"
              >
                <option value="">{t.selectMedication}</option>
                {userMedications.map((med) => (
                  <option key={med.medication_id} value={med.medication_id}>
                    {med.brand_name || med.condition}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Slots */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">{t.times}</label>
              {reminderTimes.map((time, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => updateTimeSlot(index, e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none"
                  />
                  {reminderTimes.length > 1 && (
                    <button
                      onClick={() => removeTimeSlot(index)}
                      className="bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addTimeSlot}
                className="text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1 mt-2"
              >
                <Plus className="w-4 h-4" />
                {t.addTime}
              </button>
            </div>

            {/* Buttons */}
            <div className={`flex gap-2 mt-6 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <button
                onClick={handleAddReminder}
                className="flex-1 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition font-semibold flex items-center justify-center gap-2"
              >
                <Bell className="w-5 h-5" />
                {t.save}
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedMedication(null);
                  setReminderTimes(['08:00', '20:00']);
                }}
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete'}
              </h3>
            </div>

            {/* Message */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              {language === 'ar' 
                ? 'هل أنت متأكد من حذف هذا التذكير؟ لن تتمكن من التراجع عن هذا الإجراء.' 
                : 'Are you sure you want to delete this reminder? This action cannot be undone.'}
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleDeleteReminder}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                {language === 'ar' ? 'حذف' : 'Delete'}
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setReminderToDelete(null);
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

export default Reminders;

import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Bell, BellOff, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import axios from 'axios';
import { API } from '../App';
import { toast } from 'sonner';

const ReminderCard = ({ medication, language, onReminderUpdate }) => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [newReminderTimes, setNewReminderTimes] = useState(['08:00']);
  const [editingReminder, setEditingReminder] = useState(null);

  useEffect(() => {
    fetchReminders();
  }, [medication.medication_id]);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/reminders`);
      const medReminders = response.data.filter(
        r => r.medication_id === medication.medication_id
      );
      setReminders(medReminders);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReminder = async () => {
    try {
      // Validate times
      if (newReminderTimes.length === 0) {
        toast.error(language === 'ar' ? 'أضف وقتاً واحداً على الأقل' : 'Add at least one time');
        return;
      }

      const reminderData = {
        medication_id: medication.medication_id,
        medication_name: medication.brand_name || medication.condition,
        reminder_times: newReminderTimes,
        enabled: true
      };

      const response = await axios.post(`${API}/reminders`, reminderData);
      
      toast.success(language === 'ar' ? '✅ تم إضافة التذكير' : '✅ Reminder added');
      
      // Trigger event to update counters in Dashboard
      window.dispatchEvent(new CustomEvent('reminderCreated', { 
        detail: { 
          reminderId: response.data?.id,
          medicationId: medication.medication_id 
        } 
      }));
      
      setShowAddReminder(false);
      setNewReminderTimes(['08:00']);
      fetchReminders();
      
      if (onReminderUpdate) onReminderUpdate();
    } catch (error) {
      console.error('Error adding reminder:', error);
      
      if (error.response?.status === 403) {
        toast.error(
          language === 'ar'
            ? '❌ وصلت للحد الأقصى من التذكيرات المجانية (3). قم بالترقية للحصول على تذكيرات غير محدودة'
            : '❌ Reached free reminder limit (3). Upgrade for unlimited reminders'
        );
      } else {
        toast.error(language === 'ar' ? '❌ خطأ في إضافة التذكير' : '❌ Error adding reminder');
      }
    }
  };

  const handleToggleReminder = async (reminder) => {
    try {
      await axios.patch(`${API}/reminders/${reminder.id}/toggle`);
      toast.success(language === 'ar' ? '✅ تم التحديث' : '✅ Updated');
      fetchReminders();
      if (onReminderUpdate) onReminderUpdate();
    } catch (error) {
      console.error('Error toggling reminder:', error);
      toast.error(language === 'ar' ? '❌ خطأ في التحديث' : '❌ Error updating');
    }
  };

  const handleDeleteReminder = async (reminderId) => {
    if (!window.confirm(language === 'ar' ? 'هل تريد حذف هذا التذكير؟' : 'Delete this reminder?')) {
      return;
    }

    try {
      await axios.delete(`${API}/reminders/${reminderId}`);
      toast.success(language === 'ar' ? '✅ تم الحذف' : '✅ Deleted');
      fetchReminders();
      if (onReminderUpdate) onReminderUpdate();
    } catch (error) {
      console.error('Error deleting reminder:', error);
      toast.error(language === 'ar' ? '❌ خطأ في الحذف' : '❌ Error deleting');
    }
  };

  const handleUpdateReminder = async (reminder) => {
    try {
      await axios.patch(`${API}/reminders/${reminder.id}`, {
        reminder_times: reminder.reminder_times
      });
      
      toast.success(language === 'ar' ? '✅ تم التحديث' : '✅ Updated');
      setEditingReminder(null);
      fetchReminders();
      if (onReminderUpdate) onReminderUpdate();
    } catch (error) {
      console.error('Error updating reminder:', error);
      toast.error(language === 'ar' ? '❌ خطأ في التحديث' : '❌ Error updating');
    }
  };

  const addTimeSlot = (isNewReminder = true) => {
    if (isNewReminder) {
      setNewReminderTimes([...newReminderTimes, '12:00']);
    } else if (editingReminder) {
      setEditingReminder({
        ...editingReminder,
        reminder_times: [...editingReminder.reminder_times, '12:00']
      });
    }
  };

  const removeTimeSlot = (index, isNewReminder = true) => {
    if (isNewReminder) {
      if (newReminderTimes.length > 1) {
        setNewReminderTimes(newReminderTimes.filter((_, i) => i !== index));
      }
    } else if (editingReminder && editingReminder.reminder_times.length > 1) {
      setEditingReminder({
        ...editingReminder,
        reminder_times: editingReminder.reminder_times.filter((_, i) => i !== index)
      });
    }
  };

  const updateTimeSlot = (index, value, isNewReminder = true) => {
    if (isNewReminder) {
      const newTimes = [...newReminderTimes];
      newTimes[index] = value;
      setNewReminderTimes(newTimes);
    } else if (editingReminder) {
      const newTimes = [...editingReminder.reminder_times];
      newTimes[index] = value;
      setEditingReminder({
        ...editingReminder,
        reminder_times: newTimes
      });
    }
  };

  // Auto-suggest times based on medication times or frequency
  const getAutoSuggestedTimes = () => {
    if (medication.times && medication.times.length > 0) {
      return medication.times;
    }

    // Default suggestions based on frequency
    const frequency = medication.frequency?.toLowerCase() || '';
    
    if (frequency.includes('once') || frequency.includes('مرة')) {
      return ['08:00'];
    } else if (frequency.includes('twice') || frequency.includes('مرتين')) {
      return ['08:00', '20:00'];
    } else if (frequency.includes('three') || frequency.includes('ثلاث')) {
      return ['08:00', '14:00', '20:00'];
    } else if (frequency.includes('four') || frequency.includes('أربع')) {
      return ['08:00', '12:00', '16:00', '20:00'];
    }

    return ['08:00', '20:00']; // Default
  };

  const autoFillTimes = () => {
    const suggestedTimes = getAutoSuggestedTimes();
    setNewReminderTimes(suggestedTimes);
    toast.success(
      language === 'ar'
        ? `تم ملء ${suggestedTimes.length} وقت تلقائياً`
        : `Auto-filled ${suggestedTimes.length} times`
    );
  };

  if (loading) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
      </div>
    );
  }

  return (
    <div 
      className="space-y-3" 
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Existing Reminders */}
      {reminders.length > 0 ? (
        <div className="space-y-2">
          {reminders.map((reminder) => (
            <Card key={reminder.id} className="border-2 border-emerald-100">
              <CardContent className="p-4">
                {editingReminder?.id === reminder.id ? (
                  // Edit Mode
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-700">
                        {language === 'ar' ? 'تعديل الأوقات' : 'Edit Times'}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingReminder(null)}
                          className="h-8"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateReminder(editingReminder)}
                          className="h-8 bg-emerald-600 hover:bg-emerald-700"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          {language === 'ar' ? 'حفظ' : 'Save'}
                        </Button>
                      </div>
                    </div>

                    {editingReminder.reminder_times.map((time, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="time"
                          value={time}
                          onChange={(e) => updateTimeSlot(index, e.target.value, false)}
                          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        {editingReminder.reminder_times.length > 1 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeTimeSlot(index, false)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addTimeSlot(false)}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {language === 'ar' ? 'إضافة وقت' : 'Add Time'}
                    </Button>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {reminder.enabled ? (
                          <Bell className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <BellOff className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-sm font-medium text-gray-700">
                          {language === 'ar' ? 'التذكير نشط' : 'Active Reminder'}
                        </span>
                        <Badge variant={reminder.enabled ? 'default' : 'secondary'}>
                          {reminder.enabled
                            ? language === 'ar' ? 'مفعّل' : 'Enabled'
                            : language === 'ar' ? 'معطّل' : 'Disabled'}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {reminder.reminder_times.map((time, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {time}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleReminder(reminder)}
                        className="h-8"
                      >
                        {reminder.enabled ? (
                          <BellOff className="w-4 h-4" />
                        ) : (
                          <Bell className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingReminder(reminder)}
                        className="h-8"
                      >
                        {language === 'ar' ? 'تعديل' : 'Edit'}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteReminder(reminder.id);
                        }}
                        className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 bg-amber-50 border-2 border-dashed border-amber-200 rounded-xl">
          <Bell className="w-8 h-8 text-amber-600 mx-auto mb-2" />
          <p className="text-sm text-amber-800 font-medium mb-1">
            {language === 'ar' ? '⚠️ لم يتم إضافة تذكير بعد' : '⚠️ No reminders set'}
          </p>
          <p className="text-xs text-amber-700">
            {language === 'ar'
              ? 'أضف تذكيراً لتجنب نسيان الجرعات'
              : 'Add a reminder to avoid missing doses'}
          </p>
        </div>
      )}

      {/* Add New Reminder */}
      {showAddReminder ? (
        <Card className="border-2 border-emerald-200 bg-emerald-50">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-emerald-900">
                  {language === 'ar' ? '➕ إضافة تذكير جديد' : '➕ Add New Reminder'}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={autoFillTimes}
                  className="text-xs h-7"
                >
                  {language === 'ar' ? '✨ ملء تلقائي' : '✨ Auto-fill'}
                </Button>
              </div>

              {newReminderTimes.map((time, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => updateTimeSlot(index, e.target.value, true)}
                    className="flex-1 px-3 py-2 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                  {newReminderTimes.length > 1 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeTimeSlot(index, true)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}

              <Button
                size="sm"
                variant="outline"
                onClick={() => addTimeSlot(true)}
                className="w-full border-emerald-300 hover:bg-emerald-100"
              >
                <Plus className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'إضافة وقت' : 'Add Time'}
              </Button>

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={handleAddReminder}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  <Check className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'حفظ' : 'Save'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowAddReminder(false);
                    setNewReminderTimes(['08:00']);
                  }}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          onClick={() => setShowAddReminder(true)}
          variant="outline"
          className="w-full border-2 border-dashed border-emerald-300 hover:bg-emerald-50 hover:border-emerald-400"
        >
          <Plus className="w-4 h-4 mr-2" />
          {language === 'ar' ? '➕ إضافة تذكير جديد' : '➕ Add New Reminder'}
        </Button>
      )}
    </div>
  );
};

export default ReminderCard;

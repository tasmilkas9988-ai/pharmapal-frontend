import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

/**
 * Native Local Notifications Manager
 * Works on Android and iOS without requiring internet or Firebase
 */

export const isNativePlatform = () => {
  return Capacitor.isNativePlatform();
};

/**
 * Request notification permissions
 */
export const requestNotificationPermission = async () => {
  try {
    if (!isNativePlatform()) {
      console.log('Not a native platform, skipping local notifications');
      return false;
    }

    const permission = await LocalNotifications.requestPermissions();
    console.log('Native notification permission:', permission);
    
    return permission.display === 'granted';
  } catch (error) {
    console.error('Error requesting native notification permission:', error);
    return false;
  }
};

/**
 * Schedule a medication reminder
 */
export const scheduleMedicationReminder = async (medication, time) => {
  try {
    if (!isNativePlatform()) {
      console.log('Not a native platform, cannot schedule local notification');
      return false;
    }

    // Parse time (HH:MM format)
    const [hours, minutes] = time.split(':').map(Number);
    
    // Create notification for today and future days
    const now = new Date();
    const scheduledDate = new Date();
    scheduledDate.setHours(hours, minutes, 0, 0);
    
    // If time has passed today, schedule for tomorrow
    if (scheduledDate <= now) {
      scheduledDate.setDate(scheduledDate.getDate() + 1);
    }

    const notificationId = parseInt(medication.id.replace(/[^0-9]/g, '').substring(0, 9));

    await LocalNotifications.schedule({
      notifications: [
        {
          id: notificationId,
          title: '💊 تذكير بتناول الدواء',
          body: `حان موعد تناول ${medication.brand_name || medication.active_ingredient}`,
          schedule: {
            at: scheduledDate,
            repeats: true,
            every: 'day'
          },
          sound: 'beep.wav',
          attachments: null,
          actionTypeId: '',
          extra: {
            medication_id: medication.id,
            medication_name: medication.brand_name || medication.active_ingredient,
            time: time
          }
        }
      ]
    });

    console.log(`✅ Scheduled native notification for ${medication.brand_name} at ${time}`);
    return true;
  } catch (error) {
    console.error('Error scheduling native notification:', error);
    return false;
  }
};

/**
 * Cancel medication reminder
 */
export const cancelMedicationReminder = async (medicationId) => {
  try {
    if (!isNativePlatform()) {
      return false;
    }

    const notificationId = parseInt(medicationId.replace(/[^0-9]/g, '').substring(0, 9));
    
    await LocalNotifications.cancel({
      notifications: [{ id: notificationId }]
    });

    console.log(`✅ Cancelled native notification for medication ${medicationId}`);
    return true;
  } catch (error) {
    console.error('Error cancelling native notification:', error);
    return false;
  }
};

/**
 * Schedule multiple medication reminders
 */
export const scheduleMultipleMedicationReminders = async (medications) => {
  try {
    if (!isNativePlatform()) {
      return false;
    }

    const results = await Promise.all(
      medications.map(async (med) => {
        if (!med.times || !Array.isArray(med.times)) {
          return false;
        }
        
        const timeResults = await Promise.all(
          med.times.map(time => scheduleMedicationReminder(med, time))
        );
        
        return timeResults.every(r => r);
      })
    );

    return results.every(r => r);
  } catch (error) {
    console.error('Error scheduling multiple reminders:', error);
    return false;
  }
};

/**
 * Get all pending notifications
 */
export const getPendingNotifications = async () => {
  try {
    if (!isNativePlatform()) {
      return [];
    }

    const result = await LocalNotifications.getPending();
    console.log('Pending native notifications:', result.notifications);
    return result.notifications;
  } catch (error) {
    console.error('Error getting pending notifications:', error);
    return [];
  }
};

/**
 * Cancel all notifications
 */
export const cancelAllNotifications = async () => {
  try {
    if (!isNativePlatform()) {
      return false;
    }

    const pending = await getPendingNotifications();
    if (pending.length > 0) {
      await LocalNotifications.cancel({
        notifications: pending.map(n => ({ id: n.id }))
      });
      console.log(`✅ Cancelled ${pending.length} pending notifications`);
    }
    return true;
  } catch (error) {
    console.error('Error cancelling all notifications:', error);
    return false;
  }
};

/**
 * Register notification action handler
 */
export const registerNotificationActionHandler = (handler) => {
  try {
    if (!isNativePlatform()) {
      return;
    }

    LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
      console.log('Notification action performed:', notification);
      if (handler) {
        handler(notification);
      }
    });
  } catch (error) {
    console.error('Error registering notification action handler:', error);
  }
};

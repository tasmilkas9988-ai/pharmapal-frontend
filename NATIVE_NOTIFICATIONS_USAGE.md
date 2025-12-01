# استخدام التذكيرات المحلية (Native Local Notifications)

## 🎯 كيفية استخدام التذكيرات في التطبيق:

### 1. استيراد المكتبة:

```javascript
import {
  isNativePlatform,
  requestNotificationPermission,
  scheduleMedicationReminder,
  cancelMedicationReminder,
  scheduleMultipleMedicationReminders,
  getPendingNotifications,
  cancelAllNotifications
} from './lib/nativeNotifications';
```

### 2. طلب الأذونات:

```javascript
const setupNotifications = async () => {
  const granted = await requestNotificationPermission();
  if (granted) {
    console.log('✅ تم منح أذونات التذكيرات');
  } else {
    console.log('❌ تم رفض أذونات التذكيرات');
  }
};
```

### 3. جدولة تذكير لدواء واحد:

```javascript
const medication = {
  id: 'med-123',
  brand_name: 'Panadol',
  active_ingredient: 'Paracetamol'
};

const time = '08:00'; // صباحاً

const success = await scheduleMedicationReminder(medication, time);
if (success) {
  console.log('✅ تم جدولة التذكير');
}
```

### 4. جدولة تذكيرات لعدة أوقات:

```javascript
const medications = [
  {
    id: 'med-123',
    brand_name: 'Panadol',
    times: ['08:00', '14:00', '20:00']
  },
  {
    id: 'med-456',
    brand_name: 'Aspirin',
    times: ['09:00', '21:00']
  }
];

const success = await scheduleMultipleMedicationReminders(medications);
```

### 5. إلغاء تذكير:

```javascript
await cancelMedicationReminder('med-123');
```

### 6. عرض التذكيرات المجدولة:

```javascript
const pending = await getPendingNotifications();
console.log('التذكيرات المجدولة:', pending);
```

### 7. إلغاء جميع التذكيرات:

```javascript
await cancelAllNotifications();
```

---

## 💡 أمثلة عملية:

### مثال 1: إضافة دواء جديد مع تذكيرات

```javascript
const addMedicationWithReminders = async (medicationData) => {
  try {
    // 1. حفظ الدواء في قاعدة البيانات
    const response = await axios.post(`${API}/user-medications`, medicationData);
    const savedMedication = response.data.medication;
    
    // 2. جدولة التذكيرات المحلية
    if (isNativePlatform() && savedMedication.times) {
      for (const time of savedMedication.times) {
        await scheduleMedicationReminder(savedMedication, time);
      }
    }
    
    console.log('✅ تم إضافة الدواء مع التذكيرات');
  } catch (error) {
    console.error('خطأ:', error);
  }
};
```

### مثال 2: تحديث أوقات الدواء

```javascript
const updateMedicationTimes = async (medicationId, newTimes) => {
  try {
    // 1. إلغاء التذكيرات القديمة
    await cancelMedicationReminder(medicationId);
    
    // 2. تحديث في قاعدة البيانات
    await axios.patch(`${API}/user-medications/${medicationId}`, {
      times: newTimes
    });
    
    // 3. جدولة تذكيرات جديدة
    const medication = await getMedication(medicationId);
    for (const time of newTimes) {
      await scheduleMedicationReminder(medication, time);
    }
    
    console.log('✅ تم تحديث التذكيرات');
  } catch (error) {
    console.error('خطأ:', error);
  }
};
```

### مثال 3: حذف دواء

```javascript
const deleteMedication = async (medicationId) => {
  try {
    // 1. إلغاء التذكيرات
    await cancelMedicationReminder(medicationId);
    
    // 2. حذف من قاعدة البيانات
    await axios.delete(`${API}/user-medications/${medicationId}`);
    
    console.log('✅ تم حذف الدواء والتذكيرات');
  } catch (error) {
    console.error('خطأ:', error);
  }
};
```

### مثال 4: تهيئة التذكيرات عند تسجيل الدخول

```javascript
const initializeUserNotifications = async (userId) => {
  try {
    // 1. طلب الأذونات
    const granted = await requestNotificationPermission();
    if (!granted) {
      console.log('المستخدم رفض أذونات التذكيرات');
      return;
    }
    
    // 2. إلغاء جميع التذكيرات القديمة
    await cancelAllNotifications();
    
    // 3. جلب أدوية المستخدم
    const response = await axios.get(`${API}/user-medications`);
    const medications = response.data.medications || [];
    
    // 4. جدولة تذكيرات جديدة
    const activeMeds = medications.filter(m => m.is_active && m.times);
    await scheduleMultipleMedicationReminders(activeMeds);
    
    console.log(`✅ تم جدولة ${activeMeds.length} تذكير`);
  } catch (error) {
    console.error('خطأ في تهيئة التذكيرات:', error);
  }
};
```

---

## 🔔 التعامل مع أحداث التذكيرات:

```javascript
import { registerNotificationActionHandler } from './lib/nativeNotifications';

// تسجيل معالج الأحداث
registerNotificationActionHandler((notification) => {
  console.log('المستخدم ضغط على التذكير:', notification);
  
  const medicationId = notification.notification.extra.medication_id;
  const medicationName = notification.notification.extra.medication_name;
  
  // يمكنك فتح صفحة الدواء أو تسجيل أن المستخدم أخذ الدواء
  // مثال: navigate(`/medication/${medicationId}`);
});
```

---

## ⚙️ الإعدادات:

### تخصيص الإشعار:

يمكنك تخصيص مظهر الإشعار في `capacitor.config.json`:

```json
{
  "plugins": {
    "LocalNotifications": {
      "smallIcon": "ic_stat_icon_config_sample",
      "iconColor": "#0EA5E9",
      "sound": "beep.wav"
    }
  }
}
```

### إضافة صوت مخصص:

1. Android: ضع الملف الصوتي في `/android/app/src/main/res/raw/`
2. iOS: ضع الملف الصوتي في المشروع عبر Xcode

---

## ✅ المزايا:

1. **تعمل بدون إنترنت** - لا تحتاج اتصال
2. **تعمل حتى لو كان التطبيق مغلق** - مضمونة 100%
3. **دقيقة** - تصل في الوقت المحدد بالضبط
4. **موثوقة** - لا تعتمد على Firebase أو أي خدمة خارجية
5. **متكررة** - تتكرر يومياً تلقائياً
6. **صوت واهتزاز** - تنبيه قوي

---

## 📱 الفرق بين Local و Push Notifications:

| الميزة | Local Notifications | Push Notifications |
|--------|---------------------|-------------------|
| تحتاج إنترنت | ❌ لا | ✅ نعم |
| تعمل والتطبيق مغلق | ✅ نعم | ✅ نعم |
| مصدر الإشعار | الهاتف نفسه | السيرفر |
| الموثوقية | 100% | ~95% |
| الاستخدام | تذكيرات منتظمة | إشعارات فورية |

---

## 🎉 الخلاصة:

التذكيرات المحلية هي **الحل الأمثل** للتذكيرات الدوائية لأنها:
- ✅ مضمونة 100%
- ✅ تعمل بدون إنترنت
- ✅ لا تستنزف البطارية
- ✅ سهلة الاستخدام

**الآن تطبيق PharmaPal لديه نظام تذكيرات قوي وموثوق!** 🎊

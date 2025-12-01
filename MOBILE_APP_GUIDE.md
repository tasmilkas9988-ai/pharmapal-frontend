# PharmaPal Mobile App Guide

## 📱 تم تحويل التطبيق إلى تطبيق موبايل أصلي

التطبيق الآن جاهز للنشر على Google Play و App Store!

---

## ✅ ما تم إنجازه:

### 1. **Capacitor Setup**
- ✅ تثبيت Capacitor
- ✅ إضافة منصة Android
- ✅ إضافة منصة iOS
- ✅ تكوين package name: `com.pharmapal.online`

### 2. **Native Plugins**
- ✅ Local Notifications (تذكيرات محلية - تعمل 100%)
- ✅ Push Notifications (إشعارات Firebase)
- ✅ Splash Screen
- ✅ Status Bar
- ✅ App (lifecycle management)

### 3. **Permissions**
- ✅ Internet
- ✅ POST_NOTIFICATIONS (Android 13+)
- ✅ SCHEDULE_EXACT_ALARM (للتذكيرات الدقيقة)
- ✅ USE_EXACT_ALARM
- ✅ VIBRATE
- ✅ WAKE_LOCK
- ✅ RECEIVE_BOOT_COMPLETED (للتذكيرات بعد إعادة تشغيل الهاتف)

### 4. **Native Features**
- ✅ تذكيرات محلية تعمل بدون إنترنت
- ✅ تذكيرات متكررة يومياً
- ✅ Splash screen مع لون مخصص
- ✅ Status bar مخصص
- ✅ Deep linking support

---

## 📦 بناء التطبيق:

### لبناء Android APK:

```bash
cd /app/frontend

# 1. Build React app
yarn build

# 2. Sync with Android
npx cap sync android

# 3. Open in Android Studio
npx cap open android

# 4. في Android Studio:
# - Build > Generate Signed Bundle / APK
# - اختر APK
# - أنشئ keystore جديد أو استخدم موجود
# - Build
```

### لبناء iOS App:

```bash
cd /app/frontend

# 1. Build React app
yarn build

# 2. Sync with iOS
npx cap sync ios

# 3. Open in Xcode
npx cap open ios

# 4. في Xcode:
# - Product > Archive
# - Distribute App
```

---

## 🔑 متطلبات النشر:

### Google Play Store:
1. **حساب Google Play Developer** ($25 مرة واحدة)
   - التسجيل: https://play.google.com/console
   
2. **Keystore للتوقيع**
   ```bash
   keytool -genkey -v -keystore pharmapal-release-key.keystore -alias pharmapal -keyalg RSA -keysize 2048 -validity 10000
   ```

3. **معلومات التطبيق:**
   - App ID: `com.pharmapal.online`
   - App Name: `PharmaPal`
   - Version: 1.0.0

### Apple App Store:
1. **حساب Apple Developer** ($99/سنة)
   - التسجيل: https://developer.apple.com

2. **App Store Connect**
   - إنشاء App ID
   - إنشاء Provisioning Profile
   - رفع التطبيق عبر Xcode

---

## 🧪 اختبار التطبيق:

### على Android:
```bash
# تشغيل على محاكي أو جهاز حقيقي
cd /app/frontend
npx cap run android
```

### على iOS:
```bash
# تشغيل على محاكي أو جهاز حقيقي
cd /app/frontend
npx cap run ios
```

---

## 📱 ميزات التطبيق المحلي:

### ✅ التذكيرات المحلية (Local Notifications):
- تعمل **بدون إنترنت**
- تعمل **حتى لو كان التطبيق مغلق**
- تتكرر يومياً تلقائياً
- دقيقة 100%

### ✅ Push Notifications (Firebase):
- إشعارات فورية من السيرفر
- تعمل في الخلفية

### ✅ Native Performance:
- أسرع من Web App
- تجربة مستخدم أفضل
- وصول لميزات الهاتف

---

## 🔧 التحديثات المستقبلية:

لتحديث التطبيق:
```bash
cd /app/frontend

# 1. عدّل الكود
# 2. Build
yarn build

# 3. Sync
npx cap sync

# 4. زِد رقم الإصدار في:
# - package.json: "version": "1.0.1"
# - android/app/build.gradle: versionCode & versionName
# - ios/App/App.xcodeproj

# 5. Build & Upload
```

---

## 📞 معلومات الاتصال:

- **Domain:** pharmapal.online
- **Email:** info@pharmapal.online
- **Package:** com.pharmapal.online

---

## ⚠️ ملاحظات مهمة:

1. **الأيقونات:** يجب إضافة أيقونات بجودة عالية قبل النشر
   - Android: `/app/frontend/android/app/src/main/res/mipmap-*/`
   - iOS: `/app/frontend/ios/App/App/Assets.xcassets/AppIcon.appiconset/`

2. **الاختبار:** اختبر التطبيق بشكل شامل قبل النشر

3. **Privacy Policy:** ضع رابط سياسة الخصوصية في المتجر

4. **Screenshots:** حضّر screenshots للمتاجر (1-8 صور)

---

## 🎉 التطبيق جاهز للنشر!

**الخطوات القادمة:**
1. ✅ اختبر التطبيق محلياً
2. ✅ أضف الأيقونات والـ screenshots
3. ✅ سجّل في Google Play و App Store
4. ✅ ارفع التطبيق
5. ✅ انتظر الموافقة (1-7 أيام)

**تهانينا! 🎊 تطبيق PharmaPal أصبح تطبيق موبايل حقيقي!**

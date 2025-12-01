import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Firebase configuration - from environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyBzxOOifyQXjhHk6Kq3LAHNXv7mJ9Y31bs",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "pharmapal-4d0b2.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "pharmapal-4d0b2",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "pharmapal-4d0b2.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "754886803994",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:754886803994:web:2a0b61549f785d73de07a3",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-86E86KNJDY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// VAPID Key - from environment variable
const VAPID_KEY = process.env.REACT_APP_VAPID_KEY || 'BFoYdKOZQ3gKPel7VauTW5JKYJPwqt_XmzUSBtLRAqApUbhjq8A8gtScmwCMRsYaFhc1qiUgKRjMVK9qXudyTno';

/**
 * Request notification permission and get FCM token
 */
export const requestNotificationPermission = async () => {
  try {
    // Check if browser supports notifications
    if (!('Notification' in window)) {
      throw new Error('This browser does not support notifications');
    }

    // Check if service worker is supported
    if (!('serviceWorker' in navigator)) {
      throw new Error('This browser does not support service workers');
    }

    console.log('🔔 Step 1: Requesting notification permission...');
    
    // Request permission
    const permission = await Notification.requestPermission();
    console.log('Permission result:', permission);
    
    if (permission !== 'granted') {
      throw new Error('Notification permission denied');
    }

    console.log('🔔 Step 2: Registering Firebase Messaging Service Worker...');
    
    // Register Firebase Messaging Service Worker
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/'
    });
    
    console.log('✅ Service Worker registered:', registration);
    
    // Wait for service worker to be ready
    await navigator.serviceWorker.ready;
    console.log('✅ Service Worker ready');
    
    console.log('🔔 Step 3: Initializing Firebase Messaging...');
    
    // Initialize messaging
    const messaging = getMessaging(app);
    console.log('✅ Messaging initialized');
    
    console.log('🔔 Step 4: Getting FCM token...');
    
    // Get token
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration
    });
    
    if (!token) {
      throw new Error('No FCM token received');
    }
    
    console.log('✅ FCM Token obtained:', token.substring(0, 50) + '...');
    
    // Setup foreground message listener
    onMessage(messaging, (payload) => {
      console.log('📬 Foreground message received:', payload);
      
      // Show notification using service worker
      if (payload.notification) {
        registration.showNotification(
          payload.notification.title || 'PharmaPal',
          {
            body: payload.notification.body,
            icon: '/logo192.png',
            badge: '/logo192.png',
            tag: 'medication-reminder',
            requireInteraction: true,
            data: payload.data,
            vibrate: [200, 100, 200]
          }
        );
      }
    });
    
    return token;
    
  } catch (error) {
    console.error('❌ Error in notification setup:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
    throw error;
  }
};

/**
 * Refresh FCM token (for when token becomes stale)
 */
export const refreshFCMToken = async () => {
  try {
    console.log('🔄 Refreshing FCM token...');
    
    // Get service worker registration
    const registration = await navigator.serviceWorker.ready;
    
    // Initialize messaging
    const messaging = getMessaging(app);
    
    // Delete old token first
    try {
      await messaging.deleteToken();
      console.log('✅ Old token deleted');
    } catch (err) {
      console.log('⚠️ Could not delete old token:', err.message);
    }
    
    // Get new token
    const newToken = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration
    });
    
    if (!newToken) {
      throw new Error('Failed to get new FCM token');
    }
    
    console.log('✅ New FCM token obtained:', newToken.substring(0, 50) + '...');
    return newToken;
    
  } catch (error) {
    console.error('❌ Error refreshing FCM token:', error);
    throw error;
  }
};

/**
 * Setup visibility change listener to refresh token when app comes to foreground
 */
export const setupVisibilityListener = (onTokenRefresh) => {
  let lastVisible = !document.hidden;
  
  const handleVisibilityChange = async () => {
    // Only act when coming back to foreground
    if (!document.hidden && !lastVisible) {
      console.log('👁️ App came to foreground, checking FCM token...');
      
      try {
        // Small delay to ensure app is fully active
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Try to get current token
        const messaging = getMessaging(app);
        const registration = await navigator.serviceWorker.ready;
        
        const currentToken = await getToken(messaging, {
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration: registration
        });
        
        if (currentToken) {
          console.log('✅ Token is still valid');
          // Optionally notify parent component to re-register token
          if (onTokenRefresh) {
            onTokenRefresh(currentToken);
          }
        } else {
          console.log('⚠️ Token invalid, refreshing...');
          const newToken = await refreshFCMToken();
          if (onTokenRefresh) {
            onTokenRefresh(newToken);
          }
        }
      } catch (error) {
        console.error('❌ Error checking token on foreground:', error);
      }
    }
    
    lastVisible = !document.hidden;
  };
  
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  // Return cleanup function
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
};

/**
 * Listen for foreground messages
 */
export const onMessageListener = (callback) => {
  try {
    const messaging = getMessaging(app);
    return onMessage(messaging, callback);
  } catch (error) {
    console.error('Error setting up message listener:', error);
    return () => {}; // Return empty function to avoid errors
  }
};

export { app };

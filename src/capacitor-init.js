import { App } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

/**
 * Initialize Capacitor plugins and native features
 */
export const initializeCapacitor = async () => {
  try {
    if (!Capacitor.isNativePlatform()) {
      console.log('Running on web, skipping native initialization');
      return;
    }

    console.log('🚀 Initializing Capacitor native features...');

    // Hide splash screen after a delay
    setTimeout(async () => {
      await SplashScreen.hide();
      console.log('✅ Splash screen hidden');
    }, 2000);

    // Configure status bar
    if (Capacitor.getPlatform() !== 'web') {
      try {
        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setBackgroundColor({ color: '#0EA5E9' });
        console.log('✅ Status bar configured');
      } catch (error) {
        console.warn('Status bar configuration failed:', error);
      }
    }

    // Listen to app state changes
    App.addListener('appStateChange', ({ isActive }) => {
      console.log('App state changed. Active:', isActive);
      if (isActive) {
        // App came to foreground
        console.log('App is now in foreground');
      } else {
        // App went to background
        console.log('App is now in background');
      }
    });

    // Listen to URL open events (for deep linking)
    App.addListener('appUrlOpen', (data) => {
      console.log('App opened with URL:', data);
    });

    // Listen to back button on Android
    App.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        App.exitApp();
      } else {
        window.history.back();
      }
    });

    console.log('✅ Capacitor initialization complete');
  } catch (error) {
    console.error('❌ Error initializing Capacitor:', error);
  }
};

/**
 * Get app info
 */
export const getAppInfo = async () => {
  try {
    if (!Capacitor.isNativePlatform()) {
      return {
        name: 'PharmaPal',
        version: '1.0.0',
        build: '1',
        platform: 'web'
      };
    }

    const info = await App.getInfo();
    return {
      name: info.name,
      version: info.version,
      build: info.build,
      platform: Capacitor.getPlatform()
    };
  } catch (error) {
    console.error('Error getting app info:', error);
    return null;
  }
};

// Register service worker for PWA functionality

export function register(config) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log('✅ Service Worker registered successfully:', registration.scope);

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute

          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) {
              return;
            }

            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New update available
                  console.log('🔄 New content is available; please refresh.');
                  
                  // Call onUpdate callback if provided
                  if (config && config.onUpdate) {
                    config.onUpdate(registration);
                  } else {
                    // Show update notification to user
                    if (window.confirm('يتوفر تحديث جديد للتطبيق. هل تريد التحديث الآن؟\n\nA new update is available. Would you like to update now?')) {
                      window.location.reload();
                    }
                  }
                } else {
                  // Content is cached for offline use
                  console.log('✅ Content is cached for offline use.');
                  
                  // Call onSuccess callback if provided
                  if (config && config.onSuccess) {
                    config.onSuccess(registration);
                  }
                }
              }
            };
          };
          
          // Call onSuccess callback if provided
          if (config && config.onSuccess) {
            config.onSuccess(registration);
          }
        })
        .catch((error) => {
          console.error('❌ Service Worker registration failed:', error);
        });
    });
  } else {
    console.log('⚠️ Service Worker is not supported in this browser.');
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
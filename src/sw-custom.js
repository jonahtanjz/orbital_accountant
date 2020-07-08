if ("function" === typeof importScripts) {
    importScripts(
      "https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js"
    );
  
    // Global workbox
    if (workbox) {
      console.log("Workbox is loaded");
  
      // Disable logging
      workbox.setConfig({ debug: false });
  
      //`generateSW` and `generateSWString` provide the option
      // to force update an exiting service worker.
      // Since we're using `injectManifest` to build SW,
      // manually overriding the skipWaiting();
      self.addEventListener("install", (event) => {
        self.skipWaiting();
        self.location.reload();
      });


      self.addEventListener('push', function(e) {
        var body;
      
        if (e.data) {
          body = e.data.text();
        } else {
          body = 'Push message no payload';
        }
        console.log(body);
        var options = {
          body: body,
          // icon: 'images/notification-flat.png',
          vibrate: [100, 50, 100],
          data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
          },
          actions: [
            {action: 'explore', title: 'See more'},
            {action: 'close', title: 'Later'},
          ]
        };
        e.waitUntil(
          self.registration.showNotification('Accountant', options)
        );
      });
      
      self.addEventListener('notificationclose', function(e) {
        var notification = e.notification;
        var primaryKey = notification.data.primaryKey;
      
        console.log('Closed notification: ' + primaryKey);
      });
      
      
      self.addEventListener('notificationclick', function(e) {
        var notification = e.notification;
        var primaryKey = notification.data.primaryKey;
        var action = e.action;
      
        if (action === 'close') {
          notification.close();
        } else {
          self.clients.openWindow('https://accountant.tubalt.com');
          notification.close();
        }
      });
  
      // Manual injection point for manifest files.
      // All assets under build/ and 5MB sizes are precached.
      workbox.precaching.precacheAndRoute([]);
  
      // Font caching
      workbox.routing.registerRoute(
        new RegExp("https://fonts.(?:.googlepis|gstatic).com/(.*)"),
        workbox.strategies.cacheFirst({
          cacheName: "googleapis",
          plugins: [
            new workbox.expiration.Plugin({
              maxEntries: 30,
            }),
          ],
        })
      );
  
      // Image caching
      workbox.routing.registerRoute(
        /\.(?:png|gif|jpg|jpeg|svg)$/,
        workbox.strategies.cacheFirst({
          cacheName: "images",
          plugins: [
            new workbox.expiration.Plugin({
              maxEntries: 60,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
            }),
          ],
        })
      );
  
      // JS, CSS caching
      workbox.routing.registerRoute(
        /\.(?:js|css)$/,
        workbox.strategies.staleWhileRevalidate({
          cacheName: "static-resources",
          plugins: [
            new workbox.expiration.Plugin({
              maxEntries: 60,
              maxAgeSeconds: 20 * 24 * 60 * 60, // 20 Days
            }),
          ],
        })
      );
    } else {
      console.error("Workbox could not be loaded. No offline support");
    }
  }
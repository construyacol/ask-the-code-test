if (typeof importScripts === 'function') {
  // eslint-disable-next-line no-undef
    importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');
    /* global workbox */
    if (workbox) {
      console.log('Workbox is loaded');
      workbox.core.skipWaiting();
      // eslint-disable-next-line
      workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

       workbox.routing.registerRoute(
        new workbox.routing.NavigationRoute(
          new workbox.strategies.StaleWhileRevalidate({
            cacheName: 'PRODUCTION',
          })
        )
      );
    } else {
      //
    }
  }
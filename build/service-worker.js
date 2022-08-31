if (typeof importScripts === "function") {
  // eslint-disable-next-line no-undef
  importScripts(
    "https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js"
  );
  /* global workbox */
  if (workbox) {
    console.log("Workbox is loaded");
    workbox.core.skipWaiting();
    // eslint-disable-next-line
    workbox.precaching.precacheAndRoute([{"revision":"aa01e5c3f5b105d6ab97ad6815341833","url":"maskable_icon.png"},{"revision":"861e48573d993a004e1363a2c501f9a7","url":"static/css/120.4b16a441.chunk.css"},{"revision":"f7a8885ffe02e7d3f9f9db0f7dbaae14","url":"static/css/123.92933c9f.chunk.css"},{"revision":"3a04bf9fb8f3fb1e6bd0d7440bf179de","url":"static/css/124.fc71c765.chunk.css"},{"revision":"6eac7179d8a0f5ee01042c23ea738d87","url":"static/css/125.fc71c765.chunk.css"},{"revision":"fd9aacdbaf8e469f60086e9cfa08b8eb","url":"static/css/126.fc71c765.chunk.css"},{"revision":"e4678e3f425feecfe3c5a9c020572a72","url":"static/css/127.92933c9f.chunk.css"},{"revision":"436217948328548505ad6c6bea4fc60e","url":"static/css/128.fc71c765.chunk.css"},{"revision":"7fb649f6892e89817f4648b578cf89d0","url":"static/css/129.fc71c765.chunk.css"},{"revision":"2916e0209b57645dae2df1405e2b460a","url":"static/css/130.fc71c765.chunk.css"},{"revision":"8ecc407ada34652586a9b1125694cef0","url":"static/css/131.445f7abb.chunk.css"},{"revision":"077d8417a2ce5b9a0d2ae2a69e997c0e","url":"static/css/133.fc71c765.chunk.css"},{"revision":"418195e62c6eedbad125439749dd952c","url":"static/css/134.5a818e92.chunk.css"},{"revision":"475b086a6cefd649099393a11f122754","url":"static/css/135.ae42ce75.chunk.css"},{"revision":"a3af4dd4adf66d4297aad440098a30b2","url":"static/css/142.047fd448.chunk.css"},{"revision":"7d5dc7411df2df0bf71d955cebfafac6","url":"static/css/20.ae42ce75.chunk.css"},{"revision":"9ef2f3d9ab0591ef22ee0647c2a0a7ef","url":"static/css/36.fc71c765.chunk.css"},{"revision":"d41ef09b07f03884492361e3ca77f99a","url":"static/css/40.909f83ef.chunk.css"},{"revision":"10efc43539c35edffe018c70ed1dd7c5","url":"static/css/42.26a191ea.chunk.css"},{"revision":"f228a0a7c2a6625b3974a1b4d47849a4","url":"static/css/43.26a191ea.chunk.css"},{"revision":"d7064a679b19a48f598a420d2fb1512f","url":"static/css/46.fc71c765.chunk.css"},{"revision":"1483a7f9487f55280d43e1bbe651088c","url":"static/css/47.fc71c765.chunk.css"},{"revision":"9221924ad1741935ac040f8940a73335","url":"static/css/48.fc71c765.chunk.css"},{"revision":"a7e9ef943ee762e8b62c5fff0054681b","url":"static/css/49.fc71c765.chunk.css"},{"revision":"8473c80183012a79e570b522df566825","url":"static/css/50.fc71c765.chunk.css"},{"revision":"e256bf2d1ed72902ee2643841de60a97","url":"static/css/53.92933c9f.chunk.css"},{"revision":"fb8d2ff01b141343f90e9e752e09bf60","url":"static/css/54.26a191ea.chunk.css"},{"revision":"ef37f5eec0ac03844cf3b5373a68dffb","url":"static/css/56.fc71c765.chunk.css"},{"revision":"9511046b3b7d20999d5d77a5986ba210","url":"static/css/57.fc71c765.chunk.css"},{"revision":"36bb2ea7a128cad9a1198bd621e2da74","url":"static/css/65.f1889954.chunk.css"},{"revision":"5c8b316b186452da247e43bd32e66908","url":"static/css/8.20b9ac78.chunk.css"},{"revision":"b8f96c88da8dc9eb95b5a61d4320dc02","url":"static/css/main.4080d92e.chunk.css"},{"revision":"465838bfb2b459ce490718c1acc7f267","url":"static/media/hand.e4b8a38a.png"},{"revision":"6d534ac9ea6eb6a2d7f2e9e17d71c730","url":"static/media/isoType.64ae383b.png"}]);

    workbox.routing.registerRoute(
      new workbox.routing.NavigationRoute(
        new workbox.strategies.StaleWhileRevalidate({
          cacheName: "PRODUCTION",
        })
      )
    );
  } else {
    //
  }
}

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
    workbox.precaching.precacheAndRoute([{"revision":"aa01e5c3f5b105d6ab97ad6815341833","url":"maskable_icon.png"},{"revision":"861e48573d993a004e1363a2c501f9a7","url":"static/css/120.4b16a441.chunk.css"},{"revision":"b88eb19db431b933b33f40a6f0cbb040","url":"static/css/123.1712be87.chunk.css"},{"revision":"3a04bf9fb8f3fb1e6bd0d7440bf179de","url":"static/css/124.fc71c765.chunk.css"},{"revision":"6eac7179d8a0f5ee01042c23ea738d87","url":"static/css/125.fc71c765.chunk.css"},{"revision":"fd9aacdbaf8e469f60086e9cfa08b8eb","url":"static/css/126.fc71c765.chunk.css"},{"revision":"b5c1c406b583cefec23817bd0fa0b20f","url":"static/css/127.1712be87.chunk.css"},{"revision":"436217948328548505ad6c6bea4fc60e","url":"static/css/128.fc71c765.chunk.css"},{"revision":"7fb649f6892e89817f4648b578cf89d0","url":"static/css/129.fc71c765.chunk.css"},{"revision":"2916e0209b57645dae2df1405e2b460a","url":"static/css/130.fc71c765.chunk.css"},{"revision":"8ecc407ada34652586a9b1125694cef0","url":"static/css/131.445f7abb.chunk.css"},{"revision":"077d8417a2ce5b9a0d2ae2a69e997c0e","url":"static/css/133.fc71c765.chunk.css"},{"revision":"418195e62c6eedbad125439749dd952c","url":"static/css/134.5a818e92.chunk.css"},{"revision":"475b086a6cefd649099393a11f122754","url":"static/css/135.ae42ce75.chunk.css"},{"revision":"79ed68f33ba171c83fd32b6de8780a27","url":"static/css/142.6e6ae917.chunk.css"},{"revision":"1328d9df029c824c76b1892dc90105f0","url":"static/css/19.ae42ce75.chunk.css"},{"revision":"b565ece93fd58f1661f813e829362b3d","url":"static/css/35.fc71c765.chunk.css"},{"revision":"10d9b99f874454123969775732f440aa","url":"static/css/39.909f83ef.chunk.css"},{"revision":"10b36ca313a056741fc65d8b893ffd8c","url":"static/css/40.26a191ea.chunk.css"},{"revision":"10efc43539c35edffe018c70ed1dd7c5","url":"static/css/42.26a191ea.chunk.css"},{"revision":"5ec37d35dac067b47482d6832a2936ec","url":"static/css/45.fc71c765.chunk.css"},{"revision":"d7064a679b19a48f598a420d2fb1512f","url":"static/css/46.fc71c765.chunk.css"},{"revision":"1483a7f9487f55280d43e1bbe651088c","url":"static/css/47.fc71c765.chunk.css"},{"revision":"9585251023f8f4b5b8e8f62e66443d12","url":"static/css/49.1712be87.chunk.css"},{"revision":"8473c80183012a79e570b522df566825","url":"static/css/50.fc71c765.chunk.css"},{"revision":"85b3a3ac80bc5f793c5b7271657f72e3","url":"static/css/51.fc71c765.chunk.css"},{"revision":"2d4e030dcdc5a4e1570ea373afe21d59","url":"static/css/52.26a191ea.chunk.css"},{"revision":"cf74a9bd9fb40a3cb04047c4218c58cd","url":"static/css/54.fc71c765.chunk.css"},{"revision":"b2234076b7ccebfbd57903cc834acfeb","url":"static/css/55.fc71c765.chunk.css"},{"revision":"6f64ea3f99a26aef3d4a14d589766cbc","url":"static/css/63.f1889954.chunk.css"},{"revision":"caf852cbab486b3d0a7ea341f112082b","url":"static/css/7.20b9ac78.chunk.css"},{"revision":"6a3c1b222a31e0d270c8a305894d7a70","url":"static/css/main.1c6bdffb.chunk.css"},{"revision":"465838bfb2b459ce490718c1acc7f267","url":"static/media/hand.e4b8a38a.png"},{"revision":"6d534ac9ea6eb6a2d7f2e9e17d71c730","url":"static/media/isoType.64ae383b.png"}]);

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

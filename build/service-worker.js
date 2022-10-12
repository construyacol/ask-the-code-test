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
    workbox.precaching.precacheAndRoute([{"revision":"aa01e5c3f5b105d6ab97ad6815341833","url":"maskable_icon.png"},{"revision":"0af261b7b4b6f0ded78afa2cbf384403","url":"static/css/127.4b16a441.chunk.css"},{"revision":"2916e0209b57645dae2df1405e2b460a","url":"static/css/130.fc71c765.chunk.css"},{"revision":"5208ce13ea1cb9402c9107e91a054d2a","url":"static/css/131.fc71c765.chunk.css"},{"revision":"cf622ab4ea3f746289491d98f96fcc5d","url":"static/css/132.fc71c765.chunk.css"},{"revision":"077d8417a2ce5b9a0d2ae2a69e997c0e","url":"static/css/133.fc71c765.chunk.css"},{"revision":"400398e023808871012a2b35ba0fb9e3","url":"static/css/134.fc71c765.chunk.css"},{"revision":"26a79d0d3976fe784bbdf2abe7453d01","url":"static/css/135.92933c9f.chunk.css"},{"revision":"109506e82ff0e3d7d295c99a0aaff54a","url":"static/css/136.92933c9f.chunk.css"},{"revision":"f9ace7a21c1805e6458dace1d9c41078","url":"static/css/137.fc71c765.chunk.css"},{"revision":"31fea1976c5347c0f5f2c11e744b6ada","url":"static/css/138.fc71c765.chunk.css"},{"revision":"ba2b1a72dd8ddcdfe9f1d8ac36da49aa","url":"static/css/139.fc71c765.chunk.css"},{"revision":"c2a3fe57b6ac7dfaa65b6ee1416fd1f4","url":"static/css/140.445f7abb.chunk.css"},{"revision":"c6aa7dfe0a0956893303f0c2fe52494a","url":"static/css/142.fc71c765.chunk.css"},{"revision":"c9d37d441f58e95aa16fe8080feacff1","url":"static/css/144.ae42ce75.chunk.css"},{"revision":"8fe29ef47cfdf7142e6d8f51f6cb25d2","url":"static/css/153.047fd448.chunk.css"},{"revision":"1328d9df029c824c76b1892dc90105f0","url":"static/css/19.ae42ce75.chunk.css"},{"revision":"e832e49f659537adb40429d70a0cd5f7","url":"static/css/34.26a191ea.chunk.css"},{"revision":"84660872e84aed2ea0adf1a15f8b1ed1","url":"static/css/35.26a191ea.chunk.css"},{"revision":"9ef2f3d9ab0591ef22ee0647c2a0a7ef","url":"static/css/36.fc71c765.chunk.css"},{"revision":"91f04e580dca435c7dfb60129ba77e88","url":"static/css/39.fc71c765.chunk.css"},{"revision":"b2432e80d62f9e011687824b9112db3a","url":"static/css/40.fc71c765.chunk.css"},{"revision":"395ed2f496eb05e191710a60666c0320","url":"static/css/41.26a191ea.chunk.css"},{"revision":"85971b39d9179fa59aa555177c309706","url":"static/css/43.92933c9f.chunk.css"},{"revision":"2c22cd397caa76a03454166c42934bcd","url":"static/css/44.fc71c765.chunk.css"},{"revision":"5ec37d35dac067b47482d6832a2936ec","url":"static/css/45.fc71c765.chunk.css"},{"revision":"d7064a679b19a48f598a420d2fb1512f","url":"static/css/46.fc71c765.chunk.css"},{"revision":"1483a7f9487f55280d43e1bbe651088c","url":"static/css/47.fc71c765.chunk.css"},{"revision":"9221924ad1741935ac040f8940a73335","url":"static/css/48.fc71c765.chunk.css"},{"revision":"518a79c9606a86484afab1ae9bb2a397","url":"static/css/49.26a191ea.chunk.css"},{"revision":"aeb72a9fe52ef26cc3e5ffa13c5c8963","url":"static/css/57.f1889954.chunk.css"},{"revision":"caf852cbab486b3d0a7ea341f112082b","url":"static/css/7.20b9ac78.chunk.css"},{"revision":"0b44e1396425649b1e13f4287e9b83dd","url":"static/css/main.50cea21f.chunk.css"},{"revision":"465838bfb2b459ce490718c1acc7f267","url":"static/media/hand.e4b8a38a.png"},{"revision":"6d534ac9ea6eb6a2d7f2e9e17d71c730","url":"static/media/isoType.64ae383b.png"}]);

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

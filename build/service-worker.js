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
    workbox.precaching.precacheAndRoute([{"revision":"aa01e5c3f5b105d6ab97ad6815341833","url":"maskable_icon.png"},{"revision":"c58eaeceb06899eed96d163dab9a9268","url":"static/css/12.fc71c765.chunk.css"},{"revision":"41686f63e8f69b879cf9fac382687eb2","url":"static/css/129.4b16a441.chunk.css"},{"revision":"cf622ab4ea3f746289491d98f96fcc5d","url":"static/css/132.fc71c765.chunk.css"},{"revision":"077d8417a2ce5b9a0d2ae2a69e997c0e","url":"static/css/133.fc71c765.chunk.css"},{"revision":"6971f80c396cdc4d59d41154a0ebf742","url":"static/css/134.92933c9f.chunk.css"},{"revision":"26a79d0d3976fe784bbdf2abe7453d01","url":"static/css/135.92933c9f.chunk.css"},{"revision":"6bfaad905213896fff73940e5212b268","url":"static/css/136.fc71c765.chunk.css"},{"revision":"f9ace7a21c1805e6458dace1d9c41078","url":"static/css/137.fc71c765.chunk.css"},{"revision":"31fea1976c5347c0f5f2c11e744b6ada","url":"static/css/138.fc71c765.chunk.css"},{"revision":"682b4e7aab3da3db950cc81b6deb98e6","url":"static/css/139.445f7abb.chunk.css"},{"revision":"addbc80897e92db5a61af5efcb114bd6","url":"static/css/141.fc71c765.chunk.css"},{"revision":"dd5a8a5a6f405c6961a9a8647d4787ed","url":"static/css/143.ae42ce75.chunk.css"},{"revision":"f577eccc5e0e700a25d915d7621903af","url":"static/css/152.047fd448.chunk.css"},{"revision":"1328d9df029c824c76b1892dc90105f0","url":"static/css/19.ae42ce75.chunk.css"},{"revision":"84660872e84aed2ea0adf1a15f8b1ed1","url":"static/css/35.26a191ea.chunk.css"},{"revision":"16ca6460dff87c453a056a2d2eace9cb","url":"static/css/38.26a191ea.chunk.css"},{"revision":"2c22cd397caa76a03454166c42934bcd","url":"static/css/44.fc71c765.chunk.css"},{"revision":"5ec37d35dac067b47482d6832a2936ec","url":"static/css/45.fc71c765.chunk.css"},{"revision":"e594a34770fd6142d52e9aaefc2a5e2f","url":"static/css/46.26a191ea.chunk.css"},{"revision":"aa232a9adac32cc248f267568c4d9039","url":"static/css/49.92933c9f.chunk.css"},{"revision":"8473c80183012a79e570b522df566825","url":"static/css/50.fc71c765.chunk.css"},{"revision":"85b3a3ac80bc5f793c5b7271657f72e3","url":"static/css/51.fc71c765.chunk.css"},{"revision":"1578e7f89b9b4dbf5f19a0efcd20d447","url":"static/css/52.fc71c765.chunk.css"},{"revision":"ba81ebfbdc8affafe2d745ad0b71279e","url":"static/css/53.fc71c765.chunk.css"},{"revision":"fb8d2ff01b141343f90e9e752e09bf60","url":"static/css/54.26a191ea.chunk.css"},{"revision":"b2234076b7ccebfbd57903cc834acfeb","url":"static/css/55.fc71c765.chunk.css"},{"revision":"1b0d0a680bce35f0174eb45d4cc4de68","url":"static/css/59.f1889954.chunk.css"},{"revision":"5c8b316b186452da247e43bd32e66908","url":"static/css/8.20b9ac78.chunk.css"},{"revision":"0b44e1396425649b1e13f4287e9b83dd","url":"static/css/main.50cea21f.chunk.css"},{"revision":"465838bfb2b459ce490718c1acc7f267","url":"static/media/hand.e4b8a38a.png"},{"revision":"6d534ac9ea6eb6a2d7f2e9e17d71c730","url":"static/media/isoType.64ae383b.png"}]);

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

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
    workbox.precaching.precacheAndRoute([{"revision":"aa01e5c3f5b105d6ab97ad6815341833","url":"maskable_icon.png"},{"revision":"4e6dbe71d878fb63cf60c80342776cef","url":"static/css/100.38c941b1.chunk.css"},{"revision":"f12d312831681ce669b7ae3350a00bfe","url":"static/css/11.2620e85e.chunk.css"},{"revision":"86c56a361574fdb28380aaa92d2150e7","url":"static/css/12.2620e85e.chunk.css"},{"revision":"39406280faef038ba2e0d185f63e1fef","url":"static/css/18.20b9ac78.chunk.css"},{"revision":"f34906a5636e75090d143e79fd79194b","url":"static/css/19.30f6919d.chunk.css"},{"revision":"444d8a200e473403b44b40d5b1b0b3a4","url":"static/css/28.568c5480.chunk.css"},{"revision":"4fc5a47a9db4b15dd60999c90ffce70e","url":"static/css/29.43ffd52f.chunk.css"},{"revision":"125b41058303917b9deedc9f1414998f","url":"static/css/33.0630e9c7.chunk.css"},{"revision":"ab2b8c6f4e57d8e8a45e694fb7f1d0bc","url":"static/css/34.2620e85e.chunk.css"},{"revision":"6d1256367eba26e0221931f4526ea481","url":"static/css/7.bb22e477.chunk.css"},{"revision":"629ce377ea2777412de8dc11ab2249cb","url":"static/css/73.34fb208e.chunk.css"},{"revision":"452280d53e85f5dbc67ea4e8a86b5684","url":"static/css/74.7e09c14f.chunk.css"},{"revision":"b928be157c9bb381c4a0e2c82b99a7a1","url":"static/css/75.84538e33.chunk.css"},{"revision":"8eaf0335fd3b3637a5dc13869643b33b","url":"static/css/76.1e9c30db.chunk.css"},{"revision":"6561f6591ed586fee16d25620442ae88","url":"static/css/77.1b8155c0.chunk.css"},{"revision":"e36ffb52378a4e6d54fedb7e7aaa3e95","url":"static/css/78.7f3aed76.chunk.css"},{"revision":"08ac6c0257dc336ce83c12d59f0fa473","url":"static/css/8.38c941b1.chunk.css"},{"revision":"ce939ab1f24e4da4db903b464b9ce71c","url":"static/css/80.1b8155c0.chunk.css"},{"revision":"38580a745bc49b53950d8abb2ad69b51","url":"static/css/81.537a9563.chunk.css"},{"revision":"17f42914d2472a71b583e55eca023f5e","url":"static/css/82.1b8155c0.chunk.css"},{"revision":"c4a3813f94cc3bd5a4f24d0e82df60f5","url":"static/css/83.1b8155c0.chunk.css"},{"revision":"9d7aae677479361473c2e8001fefa5a8","url":"static/css/84.920f6974.chunk.css"},{"revision":"bfbdff2c020a738847888a2ba600cf47","url":"static/css/87.0a85741b.chunk.css"},{"revision":"a3ab6fdbd34ea97ec9dc639803a8c2d4","url":"static/css/89.c8358670.chunk.css"},{"revision":"1c929dd8da33f392ef78f529fad5061a","url":"static/css/90.02d74405.chunk.css"},{"revision":"3995195a7f65a85f3f541ed9a9257835","url":"static/css/91.348fe525.chunk.css"},{"revision":"206dcb1aadb039cb980c6b749915f650","url":"static/css/92.c8358670.chunk.css"},{"revision":"2f472616ca9a4c367b97bd074a4f3ada","url":"static/css/93.74d940e4.chunk.css"},{"revision":"27c4ee5ec83e3e09b59f4eeb04472bde","url":"static/css/94.e59dcce4.chunk.css"},{"revision":"f5177f7dbb26599e258906730ff5b4ad","url":"static/css/96.c8358670.chunk.css"},{"revision":"c75cbfc961b1c6ae9b43b31a14c78a92","url":"static/css/97.c5210ab2.chunk.css"},{"revision":"c78bad22857e9fdbd24bd10a2850accf","url":"static/css/98.b84d8382.chunk.css"},{"revision":"caa55c7b2182da243bc89f426fe0e638","url":"static/css/main.a92d077a.chunk.css"},{"revision":"465838bfb2b459ce490718c1acc7f267","url":"static/media/hand.e4b8a38a.png"},{"revision":"6d534ac9ea6eb6a2d7f2e9e17d71c730","url":"static/media/isoType.64ae383b.png"}]);

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

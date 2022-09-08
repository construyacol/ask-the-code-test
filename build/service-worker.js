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
    workbox.precaching.precacheAndRoute([{"revision":"aa01e5c3f5b105d6ab97ad6815341833","url":"maskable_icon.png"},{"revision":"085968854cb90872c88ac97ea29bd5cc","url":"static/css/128.4b16a441.chunk.css"},{"revision":"cf622ab4ea3f746289491d98f96fcc5d","url":"static/css/132.fc71c765.chunk.css"},{"revision":"077d8417a2ce5b9a0d2ae2a69e997c0e","url":"static/css/133.fc71c765.chunk.css"},{"revision":"400398e023808871012a2b35ba0fb9e3","url":"static/css/134.fc71c765.chunk.css"},{"revision":"26a79d0d3976fe784bbdf2abe7453d01","url":"static/css/135.92933c9f.chunk.css"},{"revision":"109506e82ff0e3d7d295c99a0aaff54a","url":"static/css/136.92933c9f.chunk.css"},{"revision":"f9ace7a21c1805e6458dace1d9c41078","url":"static/css/137.fc71c765.chunk.css"},{"revision":"31fea1976c5347c0f5f2c11e744b6ada","url":"static/css/138.fc71c765.chunk.css"},{"revision":"ba2b1a72dd8ddcdfe9f1d8ac36da49aa","url":"static/css/139.fc71c765.chunk.css"},{"revision":"19073af289cbb2b0f5648704af47c4b8","url":"static/css/140.fc71c765.chunk.css"},{"revision":"d41407864260c626bf8a08e13c4c6dc9","url":"static/css/141.445f7abb.chunk.css"},{"revision":"29829cac91221fdd0b23e2d2d633421a","url":"static/css/143.fc71c765.chunk.css"},{"revision":"c9d37d441f58e95aa16fe8080feacff1","url":"static/css/144.ae42ce75.chunk.css"},{"revision":"8fe29ef47cfdf7142e6d8f51f6cb25d2","url":"static/css/153.047fd448.chunk.css"},{"revision":"1328d9df029c824c76b1892dc90105f0","url":"static/css/19.ae42ce75.chunk.css"},{"revision":"6aeae31626a3ce742cc6d40ca9fb8494","url":"static/css/37.909f83ef.chunk.css"},{"revision":"0c7aa8206d2eeeeafe0c8df0ab431160","url":"static/css/38.909f83ef.chunk.css"},{"revision":"10d9b99f874454123969775732f440aa","url":"static/css/39.909f83ef.chunk.css"},{"revision":"5770ec52b728e1736245b3c9c8bb65c6","url":"static/css/40.20b9ac78.chunk.css"},{"revision":"2c22cd397caa76a03454166c42934bcd","url":"static/css/44.fc71c765.chunk.css"},{"revision":"5ec37d35dac067b47482d6832a2936ec","url":"static/css/45.fc71c765.chunk.css"},{"revision":"d7064a679b19a48f598a420d2fb1512f","url":"static/css/46.fc71c765.chunk.css"},{"revision":"5512341e9dd8a0929ccde74c5b61480f","url":"static/css/48.92933c9f.chunk.css"},{"revision":"a7e9ef943ee762e8b62c5fff0054681b","url":"static/css/49.fc71c765.chunk.css"},{"revision":"8473c80183012a79e570b522df566825","url":"static/css/50.fc71c765.chunk.css"},{"revision":"85b3a3ac80bc5f793c5b7271657f72e3","url":"static/css/51.fc71c765.chunk.css"},{"revision":"ba81ebfbdc8affafe2d745ad0b71279e","url":"static/css/53.fc71c765.chunk.css"},{"revision":"cf74a9bd9fb40a3cb04047c4218c58cd","url":"static/css/54.fc71c765.chunk.css"},{"revision":"69abf7782bd024571567924548d4a36f","url":"static/css/55.26a191ea.chunk.css"},{"revision":"20ab77aafbf7d6b82840c22ec95de4a2","url":"static/css/66.f1889954.chunk.css"},{"revision":"83e11bdf6ec4e47d0f724893ecd2dedc","url":"static/css/main.3ad38959.chunk.css"},{"revision":"465838bfb2b459ce490718c1acc7f267","url":"static/media/hand.e4b8a38a.png"},{"revision":"6d534ac9ea6eb6a2d7f2e9e17d71c730","url":"static/media/isoType.64ae383b.png"}]);

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

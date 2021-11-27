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
    workbox.precaching.precacheAndRoute([{"revision":"aa01e5c3f5b105d6ab97ad6815341833","url":"maskable_icon.png"},{"revision":"e4a6c832bdb621305d6e961ba9d28e49","url":"static/css/13.bfefabdf.chunk.css"},{"revision":"2bd43c91fea3b61c73c3d7284552df13","url":"static/css/14.c56c22dd.chunk.css"},{"revision":"13c376cc0239387d260df37e728b2cc6","url":"static/css/28.a72b4523.chunk.css"},{"revision":"9cf41650d028bdd6784adb8ffb1de468","url":"static/css/30.f0cd96f5.chunk.css"},{"revision":"6716231b37c41b514208a63760444959","url":"static/css/32.0929c9d7.chunk.css"},{"revision":"20ec9aaad75f40a462f140a7a30382ae","url":"static/css/33.cafd19fb.chunk.css"},{"revision":"35b6f2d8b025961a9d434293c88781fc","url":"static/css/34.b2997ac6.chunk.css"},{"revision":"b917d69237fd26b11e585cc76536be35","url":"static/css/35.677ce046.chunk.css"},{"revision":"2595cc6b3b35dd02bbbec5b8e8ba3909","url":"static/css/37.92200c02.chunk.css"},{"revision":"336649084f7527c4053b52e1c516046a","url":"static/css/38.7fdb4521.chunk.css"},{"revision":"38a6e404b7826ab5acd9584713c0e16d","url":"static/css/39.f73372b7.chunk.css"},{"revision":"ba317b450fb1230fdcef487cbe7675cc","url":"static/css/40.537a9563.chunk.css"},{"revision":"a3e530c65a81806c47cd0c5cf8a8bd62","url":"static/css/41.670a2862.chunk.css"},{"revision":"ab8670e285d0833edb93fd71220bb8ed","url":"static/css/43.783939f0.chunk.css"},{"revision":"ec557c05200e798d296bc2b792fc4f8b","url":"static/css/45.df1615d0.chunk.css"},{"revision":"759323b62d7eca95c5b09a0976afd407","url":"static/css/46.331ea72d.chunk.css"},{"revision":"82da07a808fe739b31be567999677355","url":"static/css/47.348fe525.chunk.css"},{"revision":"dbf5d15cfc79510ec50d167427333a45","url":"static/css/48.30f6919d.chunk.css"},{"revision":"235b409c9863749ab359c594374a9bd1","url":"static/css/49.e365f5c3.chunk.css"},{"revision":"7e519788a8d08274e83025209ff3c501","url":"static/css/5.bf2c6778.chunk.css"},{"revision":"b6c4c20238daebe8a28193ba2b5aaffe","url":"static/css/50.0eb489b3.chunk.css"},{"revision":"6a254badb1140a157ffe318970d28177","url":"static/css/51.dbec6b08.chunk.css"},{"revision":"58589d8a229d5aaa1437a9a5327af14d","url":"static/css/52.84ebb5f4.chunk.css"},{"revision":"86ab01867064aff6d01a726982bbbb4a","url":"static/css/54.d4cd6500.chunk.css"},{"revision":"3c78074e0c22308f0b877fbad9d0ac24","url":"static/css/55.c5210ab2.chunk.css"},{"revision":"4f64d580ba49df71b65c9b839d212f36","url":"static/css/56.b84d8382.chunk.css"},{"revision":"f18c31290221de5712d5c5e84f720eb3","url":"static/css/58.bf2c6778.chunk.css"},{"revision":"f927ee62070d85b0a0dc06c4b9dd1744","url":"static/css/9.20b9ac78.chunk.css"},{"revision":"14bb0180d6491817f56b1a7e9d07b2cb","url":"static/css/main.ab07bb34.chunk.css"}]);

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

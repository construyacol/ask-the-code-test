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
    workbox.precaching.precacheAndRoute([{"revision":"aa01e5c3f5b105d6ab97ad6815341833","url":"maskable_icon.png"},{"revision":"006b63921ff25e8b426be3a46b4b2b23","url":"static/css/10.20b9ac78.chunk.css"},{"revision":"57330e87e1f8c213e4282ad2872c1c69","url":"static/css/14.bfefabdf.chunk.css"},{"revision":"d71a531ba219f5947f570e1a1585e2f6","url":"static/css/15.c56c22dd.chunk.css"},{"revision":"202811d0b154d6f3f4a94b95363f4a2a","url":"static/css/29.00c453e4.chunk.css"},{"revision":"5bb334310304b746c66a2870e835185c","url":"static/css/30.5a1584cc.chunk.css"},{"revision":"205e18aebe231862aabcca6fd4e63f8c","url":"static/css/32.d8d9fac2.chunk.css"},{"revision":"4d2437f51a3778854004eebf7347696a","url":"static/css/33.a72b231e.chunk.css"},{"revision":"35b6f2d8b025961a9d434293c88781fc","url":"static/css/34.b2997ac6.chunk.css"},{"revision":"b917d69237fd26b11e585cc76536be35","url":"static/css/35.677ce046.chunk.css"},{"revision":"3fca45ef713433d4c271e4b6ac8ec949","url":"static/css/37.fc2dd3a7.chunk.css"},{"revision":"336649084f7527c4053b52e1c516046a","url":"static/css/38.7fdb4521.chunk.css"},{"revision":"38a6e404b7826ab5acd9584713c0e16d","url":"static/css/39.f73372b7.chunk.css"},{"revision":"ba317b450fb1230fdcef487cbe7675cc","url":"static/css/40.537a9563.chunk.css"},{"revision":"a3e530c65a81806c47cd0c5cf8a8bd62","url":"static/css/41.670a2862.chunk.css"},{"revision":"ab8670e285d0833edb93fd71220bb8ed","url":"static/css/43.783939f0.chunk.css"},{"revision":"ec557c05200e798d296bc2b792fc4f8b","url":"static/css/45.df1615d0.chunk.css"},{"revision":"e1099ce6bdcf79190cd9d085972e3372","url":"static/css/46.0a85741b.chunk.css"},{"revision":"82da07a808fe739b31be567999677355","url":"static/css/47.348fe525.chunk.css"},{"revision":"dbf5d15cfc79510ec50d167427333a45","url":"static/css/48.30f6919d.chunk.css"},{"revision":"235b409c9863749ab359c594374a9bd1","url":"static/css/49.e365f5c3.chunk.css"},{"revision":"b6c4c20238daebe8a28193ba2b5aaffe","url":"static/css/50.0eb489b3.chunk.css"},{"revision":"6a254badb1140a157ffe318970d28177","url":"static/css/51.dbec6b08.chunk.css"},{"revision":"58589d8a229d5aaa1437a9a5327af14d","url":"static/css/52.84ebb5f4.chunk.css"},{"revision":"86ab01867064aff6d01a726982bbbb4a","url":"static/css/54.d4cd6500.chunk.css"},{"revision":"3c78074e0c22308f0b877fbad9d0ac24","url":"static/css/55.c5210ab2.chunk.css"},{"revision":"4f64d580ba49df71b65c9b839d212f36","url":"static/css/56.b84d8382.chunk.css"},{"revision":"f18c31290221de5712d5c5e84f720eb3","url":"static/css/58.bf2c6778.chunk.css"},{"revision":"b7091134c93cd593cb493b3db8886f17","url":"static/css/6.bf2c6778.chunk.css"},{"revision":"14bb0180d6491817f56b1a7e9d07b2cb","url":"static/css/main.ab07bb34.chunk.css"}]);

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

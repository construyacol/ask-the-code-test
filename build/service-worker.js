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
    workbox.precaching.precacheAndRoute([{"revision":"aa01e5c3f5b105d6ab97ad6815341833","url":"maskable_icon.png"},{"revision":"006b63921ff25e8b426be3a46b4b2b23","url":"static/css/10.20b9ac78.chunk.css"},{"revision":"3452fafb0330d60bbd9737650e8c71ff","url":"static/css/14.fd0d85a9.chunk.css"},{"revision":"607486c6a0b9c698c6a5e9fcd6ed559b","url":"static/css/15.2b81247e.chunk.css"},{"revision":"00dff61212396844d7abf324d57fa3fa","url":"static/css/29.1940c1e6.chunk.css"},{"revision":"db94b23f7517baf12fa4040008a6785b","url":"static/css/30.eaebd3dd.chunk.css"},{"revision":"72e4b9b4c9400a1fa2e6a3e99c432231","url":"static/css/32.4bbbb834.chunk.css"},{"revision":"d4387f19f20b8baf213835af62f4da31","url":"static/css/33.8b58da8e.chunk.css"},{"revision":"35b6f2d8b025961a9d434293c88781fc","url":"static/css/34.b2997ac6.chunk.css"},{"revision":"d693df8bf72a0cb9ea6f2d5fc044a926","url":"static/css/35.b56009f2.chunk.css"},{"revision":"eec6901f18e575ad1de11bbca6e0d904","url":"static/css/37.58c39ec3.chunk.css"},{"revision":"336649084f7527c4053b52e1c516046a","url":"static/css/38.7fdb4521.chunk.css"},{"revision":"38a6e404b7826ab5acd9584713c0e16d","url":"static/css/39.f73372b7.chunk.css"},{"revision":"ba317b450fb1230fdcef487cbe7675cc","url":"static/css/40.537a9563.chunk.css"},{"revision":"a3e530c65a81806c47cd0c5cf8a8bd62","url":"static/css/41.670a2862.chunk.css"},{"revision":"af116d957477456eed96a23825586111","url":"static/css/43.15f1ca42.chunk.css"},{"revision":"ec557c05200e798d296bc2b792fc4f8b","url":"static/css/45.df1615d0.chunk.css"},{"revision":"e1099ce6bdcf79190cd9d085972e3372","url":"static/css/46.0a85741b.chunk.css"},{"revision":"82da07a808fe739b31be567999677355","url":"static/css/47.348fe525.chunk.css"},{"revision":"dbf5d15cfc79510ec50d167427333a45","url":"static/css/48.30f6919d.chunk.css"},{"revision":"235b409c9863749ab359c594374a9bd1","url":"static/css/49.e365f5c3.chunk.css"},{"revision":"b6c4c20238daebe8a28193ba2b5aaffe","url":"static/css/50.0eb489b3.chunk.css"},{"revision":"6a254badb1140a157ffe318970d28177","url":"static/css/51.dbec6b08.chunk.css"},{"revision":"58589d8a229d5aaa1437a9a5327af14d","url":"static/css/52.84ebb5f4.chunk.css"},{"revision":"86ab01867064aff6d01a726982bbbb4a","url":"static/css/54.d4cd6500.chunk.css"},{"revision":"3c78074e0c22308f0b877fbad9d0ac24","url":"static/css/55.c5210ab2.chunk.css"},{"revision":"4f64d580ba49df71b65c9b839d212f36","url":"static/css/56.b84d8382.chunk.css"},{"revision":"7bee8e30f181d922d67ae303ba74c49d","url":"static/css/58.38c941b1.chunk.css"},{"revision":"a345df67bcac6cb2c4d638b98b9cd7f4","url":"static/css/6.38c941b1.chunk.css"},{"revision":"14bb0180d6491817f56b1a7e9d07b2cb","url":"static/css/main.ab07bb34.chunk.css"}]);

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

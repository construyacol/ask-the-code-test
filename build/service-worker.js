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
    workbox.precaching.precacheAndRoute([{"revision":"aa01e5c3f5b105d6ab97ad6815341833","url":"maskable_icon.png"},{"revision":"006b63921ff25e8b426be3a46b4b2b23","url":"static/css/10.20b9ac78.chunk.css"},{"revision":"3452fafb0330d60bbd9737650e8c71ff","url":"static/css/14.fd0d85a9.chunk.css"},{"revision":"607486c6a0b9c698c6a5e9fcd6ed559b","url":"static/css/15.2b81247e.chunk.css"},{"revision":"5ad26b6086f5f6bad52571eb9de1f3d7","url":"static/css/29.7ff0427d.chunk.css"},{"revision":"e722b928942f95e66fb885fdeba17f91","url":"static/css/30.bf6842db.chunk.css"},{"revision":"33a7f723f1d7db83a3a3ce13b25f3416","url":"static/css/32.c7852b44.chunk.css"},{"revision":"87b4e17bd17b0470e4c52c0574c61b1f","url":"static/css/33.cf589f99.chunk.css"},{"revision":"35b6f2d8b025961a9d434293c88781fc","url":"static/css/34.b2997ac6.chunk.css"},{"revision":"d693df8bf72a0cb9ea6f2d5fc044a926","url":"static/css/35.b56009f2.chunk.css"},{"revision":"eec6901f18e575ad1de11bbca6e0d904","url":"static/css/37.58c39ec3.chunk.css"},{"revision":"f2682038213050fc4fd98bff7cc2350f","url":"static/css/38.5da48568.chunk.css"},{"revision":"7818ddf4fc29da7a69a12bbb6afeb481","url":"static/css/39.7fdb4521.chunk.css"},{"revision":"ce523f60af2acdbab4e95e4148e921e3","url":"static/css/40.f73372b7.chunk.css"},{"revision":"bba6a953418a27f3d27645ddef29fccb","url":"static/css/41.537a9563.chunk.css"},{"revision":"ed3d942ac6ca608bb37e039dc2c6e91f","url":"static/css/42.670a2862.chunk.css"},{"revision":"d074889b8cf83bb2db7567963d59cfbf","url":"static/css/44.15f1ca42.chunk.css"},{"revision":"a3958e9a6b91b2752a7a7d744c67d865","url":"static/css/46.df1615d0.chunk.css"},{"revision":"e1768feaa38b83132b792f015b605927","url":"static/css/47.0a85741b.chunk.css"},{"revision":"7e6502c3b457722aec0b145adf2747a8","url":"static/css/48.348fe525.chunk.css"},{"revision":"ccd8ef7211e40c3085f5f768db2807e5","url":"static/css/49.30f6919d.chunk.css"},{"revision":"8c18c4d9f5a4e2a263c100ae9279a47a","url":"static/css/50.e365f5c3.chunk.css"},{"revision":"ad31735466defcbbab411b73d4d6a06e","url":"static/css/51.0eb489b3.chunk.css"},{"revision":"7f20a85b202cf887f822538e9bdf4fa1","url":"static/css/52.dbec6b08.chunk.css"},{"revision":"d6daa00fade15651ded17d63aa7c883c","url":"static/css/53.84ebb5f4.chunk.css"},{"revision":"0adc04b82d1f91e3986e984b6b3c9359","url":"static/css/55.d4cd6500.chunk.css"},{"revision":"fe29e4f91282c818ea476260fc745516","url":"static/css/56.c5210ab2.chunk.css"},{"revision":"1553016470441d3960790ff0a6d52c14","url":"static/css/57.b84d8382.chunk.css"},{"revision":"cb682e2691cf263ef2e6316bb81c9e99","url":"static/css/59.38c941b1.chunk.css"},{"revision":"a345df67bcac6cb2c4d638b98b9cd7f4","url":"static/css/6.38c941b1.chunk.css"},{"revision":"14bb0180d6491817f56b1a7e9d07b2cb","url":"static/css/main.ab07bb34.chunk.css"}]);

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

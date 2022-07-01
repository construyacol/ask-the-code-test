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
    workbox.precaching.precacheAndRoute([{"revision":"aa01e5c3f5b105d6ab97ad6815341833","url":"maskable_icon.png"},{"revision":"e7b159a9fbd6d9eed69a44e54252dc2f","url":"static/css/11.5e75c695.chunk.css"},{"revision":"1e651fecb8a4b3cf1100b32d7bee155e","url":"static/css/12.48a0f462.chunk.css"},{"revision":"973649b0769124b1d7b1970a8c42b0d1","url":"static/css/146.3d9f0e53.chunk.css"},{"revision":"1530b6cd922cfaf585090bd95eccdeee","url":"static/css/147.2a08ff86.chunk.css"},{"revision":"bf60a254feaeb52fe33a6eeca12d4f1d","url":"static/css/148.b9facb56.chunk.css"},{"revision":"68e0e29741237f61cf7064c4466bd5cd","url":"static/css/150.128f32e3.chunk.css"},{"revision":"5022ebac46abc9e5e770ad8627c293d6","url":"static/css/151.0832319b.chunk.css"},{"revision":"d033b6efc5949716eaaa32e995e32382","url":"static/css/154.31cbcc2c.chunk.css"},{"revision":"cdfb4ccde5b2f13d0f77b6a3261e7d5c","url":"static/css/155.99f921c4.chunk.css"},{"revision":"98adc74e537745e9cd606932306bd5f6","url":"static/css/156.ae42ce75.chunk.css"},{"revision":"85887e43e4592ec80a142dbd8b50749a","url":"static/css/163.348fe525.chunk.css"},{"revision":"9c7aca97a76898273436f5564ea72db1","url":"static/css/164.31cbcc2c.chunk.css"},{"revision":"2b3fd906efbf4a5f0450422219c589fa","url":"static/css/165.f911b982.chunk.css"},{"revision":"a64e919243f8aa3859d28bbfdfcce211","url":"static/css/166.7d168463.chunk.css"},{"revision":"b2b249111ff48b48769eb9f861f9c4d0","url":"static/css/169.f911b982.chunk.css"},{"revision":"430957d0e9aea0851cc6c0d114e66a73","url":"static/css/170.1f193940.chunk.css"},{"revision":"68b1ec4044f6f7a6131befd5668ee237","url":"static/css/172.f911b982.chunk.css"},{"revision":"422d25ccf299fe02ed059a7434560aef","url":"static/css/173.7ade23d3.chunk.css"},{"revision":"da72ebeaa62ea82c2824d7cfefa2b202","url":"static/css/174.83b16277.chunk.css"},{"revision":"f13aa71f2390b99c652d11167b307b05","url":"static/css/178.31cbcc2c.chunk.css"},{"revision":"d3271a66363e6ccdb142e058ecffe754","url":"static/css/18.ae42ce75.chunk.css"},{"revision":"614c5d1d7e19bf48a86bcd76d76fa84e","url":"static/css/36.70b4a32c.chunk.css"},{"revision":"692e81ead53ecdcb3006e42bb05b027f","url":"static/css/46.f94acc0d.chunk.css"},{"revision":"f9dce1f9fe99e25e64943ef6646b8710","url":"static/css/47.48a0f462.chunk.css"},{"revision":"8c5b71e4e0efb6355a044cc60d1d43a2","url":"static/css/48.909f83ef.chunk.css"},{"revision":"518a79c9606a86484afab1ae9bb2a397","url":"static/css/49.26a191ea.chunk.css"},{"revision":"ea386c6e0cf1420e9fc3eb9329f28386","url":"static/css/5.20b9ac78.chunk.css"},{"revision":"94f2cdab9e150ddcb97edd34e7916328","url":"static/css/50.26a191ea.chunk.css"},{"revision":"7f275ef54245a966efe03fbb649f2762","url":"static/css/51.26a191ea.chunk.css"},{"revision":"4b0d0a15816ba2a9323855df3cacf362","url":"static/css/53.31cbcc2c.chunk.css"},{"revision":"7d8fa3e2234f080aaf478b73628c71c1","url":"static/css/54.96ed091f.chunk.css"},{"revision":"cc74d1b51d9f1a9b5deba78cfcddb3a3","url":"static/css/57.26a191ea.chunk.css"},{"revision":"60416ed6eb5f8171700092ee8a1362fc","url":"static/css/62.1f193940.chunk.css"},{"revision":"a561499831b6304d3ea70d7acb11765d","url":"static/css/7.1b8155c0.chunk.css"},{"revision":"9a66ef65113e8706c2601bdce692d105","url":"static/css/76.f1889954.chunk.css"},{"revision":"bb5cbdade4cfc2697d9b24136b2cc790","url":"static/css/77.31cbcc2c.chunk.css"},{"revision":"098061ca08024d47ec8424e129fc1a46","url":"static/css/main.08a6b264.chunk.css"},{"revision":"465838bfb2b459ce490718c1acc7f267","url":"static/media/hand.e4b8a38a.png"},{"revision":"6d534ac9ea6eb6a2d7f2e9e17d71c730","url":"static/media/isoType.64ae383b.png"}]);

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

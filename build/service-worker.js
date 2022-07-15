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
    workbox.precaching.precacheAndRoute([{"revision":"aa01e5c3f5b105d6ab97ad6815341833","url":"maskable_icon.png"},{"revision":"c222bd3fdd7e85e2a970ec5e4c20606a","url":"static/css/10.48a0f462.chunk.css"},{"revision":"0af261b7b4b6f0ded78afa2cbf384403","url":"static/css/127.4b16a441.chunk.css"},{"revision":"6b8f8f44026ef034aa12f33ee7efd5e3","url":"static/css/128.8b079173.chunk.css"},{"revision":"bccd03d51961465bf3907ec1c81102f2","url":"static/css/129.cd5edd64.chunk.css"},{"revision":"e1fbc2fb7dde23eeddcb1e42807101bb","url":"static/css/130.441b5621.chunk.css"},{"revision":"f056a4f0224fdea2e927dcfbc74f8bd9","url":"static/css/132.0832319b.chunk.css"},{"revision":"eac149db5180582aec094899b4b29798","url":"static/css/135.e1dc00b2.chunk.css"},{"revision":"22b26116b1010121dc8c262dae872241","url":"static/css/136.31cbcc2c.chunk.css"},{"revision":"8d30b97177c84e3f405377476813cc65","url":"static/css/137.99f921c4.chunk.css"},{"revision":"31b4be4c8b2c7bde06305a67278e6b90","url":"static/css/138.ae42ce75.chunk.css"},{"revision":"a5595221fe4efaa9f7861bd8686889ad","url":"static/css/144.31cbcc2c.chunk.css"},{"revision":"d11f94aa70d9c8ebe6573318e1e16c71","url":"static/css/147.1f193940.chunk.css"},{"revision":"4f39fe5cd84ffa5fb2835da66f8d201a","url":"static/css/148.7d168463.chunk.css"},{"revision":"0e4e644ad9f29bbbfe6fe709f7a71cd0","url":"static/css/150.7ade23d3.chunk.css"},{"revision":"2cab58c381ecfbfddbf1cd530f4e520c","url":"static/css/151.83b16277.chunk.css"},{"revision":"e83f5a978f5c10371b5826697ea2ca50","url":"static/css/155.31cbcc2c.chunk.css"},{"revision":"b39c9437c2e252a16a4dcb8ab0356b80","url":"static/css/16.ae42ce75.chunk.css"},{"revision":"3f216e1492103d2971131626668a1e61","url":"static/css/40.f94acc0d.chunk.css"},{"revision":"a94494bfba38cf0149cd7c1889617218","url":"static/css/41.48a0f462.chunk.css"},{"revision":"cabde3ae26c8045aff1f2e5d0c7f2593","url":"static/css/42.909f83ef.chunk.css"},{"revision":"f228a0a7c2a6625b3974a1b4d47849a4","url":"static/css/43.26a191ea.chunk.css"},{"revision":"d6beabb86e608ec63d88a06f7c9d71ab","url":"static/css/44.26a191ea.chunk.css"},{"revision":"65da046b055936009b49ff7deeae727f","url":"static/css/45.26a191ea.chunk.css"},{"revision":"98a817549af7cdafe46ea014252497ce","url":"static/css/47.96ed091f.chunk.css"},{"revision":"ea386c6e0cf1420e9fc3eb9329f28386","url":"static/css/5.20b9ac78.chunk.css"},{"revision":"94f2cdab9e150ddcb97edd34e7916328","url":"static/css/50.26a191ea.chunk.css"},{"revision":"78218d54b9025e49937ad765b4809410","url":"static/css/54.1f193940.chunk.css"},{"revision":"20ab77aafbf7d6b82840c22ec95de4a2","url":"static/css/66.f1889954.chunk.css"},{"revision":"364353c9fde66f46601efc58e0104a58","url":"static/css/67.31cbcc2c.chunk.css"},{"revision":"f8411398db0fa6d37b2c35cc5d20bf80","url":"static/css/7.537a9563.chunk.css"},{"revision":"156ab62172ec50d6bfe689fa5c796cfe","url":"static/css/9.5e75c695.chunk.css"},{"revision":"098061ca08024d47ec8424e129fc1a46","url":"static/css/main.08a6b264.chunk.css"},{"revision":"465838bfb2b459ce490718c1acc7f267","url":"static/media/hand.e4b8a38a.png"},{"revision":"6d534ac9ea6eb6a2d7f2e9e17d71c730","url":"static/media/isoType.64ae383b.png"}]);

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

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
    workbox.precaching.precacheAndRoute([{"revision":"aa01e5c3f5b105d6ab97ad6815341833","url":"maskable_icon.png"},{"revision":"9d5b5524c388fe75731036f2ef57a898","url":"static/css/10.5e75c695.chunk.css"},{"revision":"eee5f2b104b68cd3e608e6c95b245dc8","url":"static/css/11.48a0f462.chunk.css"},{"revision":"efa388b8ae7adf491540bd760b450269","url":"static/css/129.3d9f0e53.chunk.css"},{"revision":"24a2ae15c1f20abd89ea4c5e22d80e80","url":"static/css/130.2a08ff86.chunk.css"},{"revision":"f4d47dadeb356b7fedb87549a950269e","url":"static/css/131.403b6aec.chunk.css"},{"revision":"d978dbaee33e0ba75927c52d40ab63e5","url":"static/css/133.128f32e3.chunk.css"},{"revision":"56e794fb0684ef35c43be733d07a4f7a","url":"static/css/134.0832319b.chunk.css"},{"revision":"000aed4a9ff2a278b0782d9836327a8b","url":"static/css/137.31cbcc2c.chunk.css"},{"revision":"9ccef89b83756ea67321c54a463a9e4b","url":"static/css/138.99f921c4.chunk.css"},{"revision":"87b7da6c4415fe6ef6ec2b56ec8543ba","url":"static/css/139.ae42ce75.chunk.css"},{"revision":"881b0474179b56a5e7fde288db532517","url":"static/css/145.348fe525.chunk.css"},{"revision":"c90deb4ba6ecf4d3e453cf0f98b50ba3","url":"static/css/146.31cbcc2c.chunk.css"},{"revision":"6b92d36561dc8fd63701215d4cdcb2a8","url":"static/css/149.1f193940.chunk.css"},{"revision":"2e54a02de740f223e774b3465e52baee","url":"static/css/150.7d168463.chunk.css"},{"revision":"a93e0b19a9e99413c73c999d386abb9b","url":"static/css/152.7ade23d3.chunk.css"},{"revision":"b3eccc7b98067778562535a7da5bf5a6","url":"static/css/153.83b16277.chunk.css"},{"revision":"626b2efdd24c74b9bd454d65f2acb4a5","url":"static/css/157.31cbcc2c.chunk.css"},{"revision":"b39c9437c2e252a16a4dcb8ab0356b80","url":"static/css/16.ae42ce75.chunk.css"},{"revision":"3f216e1492103d2971131626668a1e61","url":"static/css/40.f94acc0d.chunk.css"},{"revision":"a94494bfba38cf0149cd7c1889617218","url":"static/css/41.48a0f462.chunk.css"},{"revision":"cabde3ae26c8045aff1f2e5d0c7f2593","url":"static/css/42.909f83ef.chunk.css"},{"revision":"f228a0a7c2a6625b3974a1b4d47849a4","url":"static/css/43.26a191ea.chunk.css"},{"revision":"d6beabb86e608ec63d88a06f7c9d71ab","url":"static/css/44.26a191ea.chunk.css"},{"revision":"65da046b055936009b49ff7deeae727f","url":"static/css/45.26a191ea.chunk.css"},{"revision":"63fc9c1b9954cefcfa1471b2f090e35b","url":"static/css/47.31cbcc2c.chunk.css"},{"revision":"e6835cfadcbbf2e5614e4841450699a4","url":"static/css/48.96ed091f.chunk.css"},{"revision":"ea386c6e0cf1420e9fc3eb9329f28386","url":"static/css/5.20b9ac78.chunk.css"},{"revision":"7f275ef54245a966efe03fbb649f2762","url":"static/css/51.26a191ea.chunk.css"},{"revision":"bfef25c072e61e31941173f56953077e","url":"static/css/55.1f193940.chunk.css"},{"revision":"60d870653d6f5bdc65bc26fe197a6fd2","url":"static/css/67.f1889954.chunk.css"},{"revision":"7f73edc02126a7653968c0b26b596926","url":"static/css/68.31cbcc2c.chunk.css"},{"revision":"f8411398db0fa6d37b2c35cc5d20bf80","url":"static/css/7.537a9563.chunk.css"},{"revision":"098061ca08024d47ec8424e129fc1a46","url":"static/css/main.08a6b264.chunk.css"},{"revision":"465838bfb2b459ce490718c1acc7f267","url":"static/media/hand.e4b8a38a.png"},{"revision":"6d534ac9ea6eb6a2d7f2e9e17d71c730","url":"static/media/isoType.64ae383b.png"}]);

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

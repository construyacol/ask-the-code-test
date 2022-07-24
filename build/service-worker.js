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
    workbox.precaching.precacheAndRoute([{"revision":"aa01e5c3f5b105d6ab97ad6815341833","url":"maskable_icon.png"},{"revision":"c222bd3fdd7e85e2a970ec5e4c20606a","url":"static/css/10.48a0f462.chunk.css"},{"revision":"085968854cb90872c88ac97ea29bd5cc","url":"static/css/128.4b16a441.chunk.css"},{"revision":"eefc53b4f071b6cea54c57348217146a","url":"static/css/129.8b079173.chunk.css"},{"revision":"c7ccb7673352fc6edcca16121ffa908c","url":"static/css/130.cd5edd64.chunk.css"},{"revision":"b4b7ced0c42e49d87ff6342c078501f9","url":"static/css/131.441b5621.chunk.css"},{"revision":"3e112497c605c7c5a01dea5c6a400f90","url":"static/css/133.0832319b.chunk.css"},{"revision":"d17196e1e8c9a2666d8979647c8acd4d","url":"static/css/136.e1dc00b2.chunk.css"},{"revision":"eabeb56fef7d6dacd4c782d200bae282","url":"static/css/137.6e6ae917.chunk.css"},{"revision":"9ccef89b83756ea67321c54a463a9e4b","url":"static/css/138.99f921c4.chunk.css"},{"revision":"87b7da6c4415fe6ef6ec2b56ec8543ba","url":"static/css/139.ae42ce75.chunk.css"},{"revision":"b934e7af7823f9eb0c3c944e88e872b7","url":"static/css/145.6e6ae917.chunk.css"},{"revision":"37d65b704ff5de1437514b7d7276f134","url":"static/css/148.1f193940.chunk.css"},{"revision":"b197b43be569812b714d12e27de60bf5","url":"static/css/149.7d168463.chunk.css"},{"revision":"166623acb0124cd195f3fb8447f7ff13","url":"static/css/151.7ade23d3.chunk.css"},{"revision":"1c60623e1ca6d88d315e41ab4cf55435","url":"static/css/152.83b16277.chunk.css"},{"revision":"da66425286b12cd8e4b2107a3d6ab8ad","url":"static/css/157.6e6ae917.chunk.css"},{"revision":"312e996b645caddb62be59e393cb1e4c","url":"static/css/17.ae42ce75.chunk.css"},{"revision":"83eeb0f4f0a5a2f6abf799b10f5cd6e9","url":"static/css/36.f94acc0d.chunk.css"},{"revision":"915eece5d1bf313735941baa03ea86c3","url":"static/css/37.48a0f462.chunk.css"},{"revision":"0c7aa8206d2eeeeafe0c8df0ab431160","url":"static/css/38.909f83ef.chunk.css"},{"revision":"6c323bbdbe15b180473ff1cb87da9e69","url":"static/css/39.26a191ea.chunk.css"},{"revision":"10b36ca313a056741fc65d8b893ffd8c","url":"static/css/40.26a191ea.chunk.css"},{"revision":"395ed2f496eb05e191710a60666c0320","url":"static/css/41.26a191ea.chunk.css"},{"revision":"419d0f20592b48b0eb564f1160ef7068","url":"static/css/43.96ed091f.chunk.css"},{"revision":"e594a34770fd6142d52e9aaefc2a5e2f","url":"static/css/46.26a191ea.chunk.css"},{"revision":"ea386c6e0cf1420e9fc3eb9329f28386","url":"static/css/5.20b9ac78.chunk.css"},{"revision":"ed5d4b0f729aa01be2eef7e822a4b46c","url":"static/css/50.1f193940.chunk.css"},{"revision":"cd881dd171b0c15b9b8307cc06c4823b","url":"static/css/62.f1889954.chunk.css"},{"revision":"2fc97962114f5f9b4c5d9f2565483cef","url":"static/css/63.6e6ae917.chunk.css"},{"revision":"f8411398db0fa6d37b2c35cc5d20bf80","url":"static/css/7.537a9563.chunk.css"},{"revision":"156ab62172ec50d6bfe689fa5c796cfe","url":"static/css/9.5e75c695.chunk.css"},{"revision":"098061ca08024d47ec8424e129fc1a46","url":"static/css/main.08a6b264.chunk.css"},{"revision":"465838bfb2b459ce490718c1acc7f267","url":"static/media/hand.e4b8a38a.png"},{"revision":"6d534ac9ea6eb6a2d7f2e9e17d71c730","url":"static/media/isoType.64ae383b.png"}]);

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

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
    workbox.precaching.precacheAndRoute([{"revision":"aa01e5c3f5b105d6ab97ad6815341833","url":"maskable_icon.png"},{"revision":"2e93edcd00c69b7092024940a77a721c","url":"static/css/119.4b16a441.chunk.css"},{"revision":"116d54977ecfde3b737afa5038d3c1e8","url":"static/css/122.445f7abb.chunk.css"},{"revision":"546024566969afdb4e0404106b80fd7d","url":"static/css/125.6e6ae917.chunk.css"},{"revision":"56b2acd7148a2c2d47bca8fb955b4b28","url":"static/css/126.5a818e92.chunk.css"},{"revision":"557c9d998ed3d6ca64732cbf121da9c7","url":"static/css/131.6e6ae917.chunk.css"},{"revision":"2ee0294a3a76d616c58e1294570cb2ec","url":"static/css/132.ae42ce75.chunk.css"},{"revision":"fe4d2f8324457489f98e78ec2a77c7b7","url":"static/css/141.6e6ae917.chunk.css"},{"revision":"1328d9df029c824c76b1892dc90105f0","url":"static/css/19.ae42ce75.chunk.css"},{"revision":"0c7aa8206d2eeeeafe0c8df0ab431160","url":"static/css/38.909f83ef.chunk.css"},{"revision":"6c323bbdbe15b180473ff1cb87da9e69","url":"static/css/39.26a191ea.chunk.css"},{"revision":"395ed2f496eb05e191710a60666c0320","url":"static/css/41.26a191ea.chunk.css"},{"revision":"65da046b055936009b49ff7deeae727f","url":"static/css/45.26a191ea.chunk.css"},{"revision":"42c15806f34e76e01bce1fb75a11d182","url":"static/css/56.f1889954.chunk.css"},{"revision":"e4020fca92ab9ee5c8d4654353cb8d44","url":"static/css/57.6e6ae917.chunk.css"},{"revision":"6824a64282453a3c55db8c1197734edb","url":"static/css/7.fc71c765.chunk.css"},{"revision":"f927ee62070d85b0a0dc06c4b9dd1744","url":"static/css/9.20b9ac78.chunk.css"},{"revision":"6a3c1b222a31e0d270c8a305894d7a70","url":"static/css/main.1c6bdffb.chunk.css"},{"revision":"465838bfb2b459ce490718c1acc7f267","url":"static/media/hand.e4b8a38a.png"},{"revision":"6d534ac9ea6eb6a2d7f2e9e17d71c730","url":"static/media/isoType.64ae383b.png"}]);

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

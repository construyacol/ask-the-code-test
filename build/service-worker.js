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
    workbox.precaching.precacheAndRoute([{"revision":"aa01e5c3f5b105d6ab97ad6815341833","url":"maskable_icon.png"},{"revision":"370d5d3a7bffb12d68d12f061507e088","url":"static/css/15.20b9ac78.chunk.css"},{"revision":"b58cdda0d1c931881e1260d2d36e5140","url":"static/css/16.937c6f9f.chunk.css"},{"revision":"f59a41037a0ed22f364b4868ecb8636f","url":"static/css/24.909f83ef.chunk.css"},{"revision":"50d30f426bbe5763bfb41c95f11e7b07","url":"static/css/27.96d386a0.chunk.css"},{"revision":"42afd6014c0a340a242239093aba2003","url":"static/css/29.2b81247e.chunk.css"},{"revision":"9e3e6a744690940625037e4f61868578","url":"static/css/64.d94f0fcf.chunk.css"},{"revision":"36916177042d2bcef7774f57022d9aaa","url":"static/css/65.97ed4ac4.chunk.css"},{"revision":"0f79f7c777fff5a4fbf24bd75508fbdb","url":"static/css/66.7ff24d1e.chunk.css"},{"revision":"4ac36cc8ee5e28e205256f3b72fcdd5a","url":"static/css/67.b7ac3724.chunk.css"},{"revision":"4a282a2dde82860d4cbdc639c31391a8","url":"static/css/68.1b8155c0.chunk.css"},{"revision":"1c21a3db3ba428e1fa16f1991d0b9a24","url":"static/css/7.38c941b1.chunk.css"},{"revision":"412bb822f3f86b9f803b552fcc53a971","url":"static/css/70.537a9563.chunk.css"},{"revision":"5e53aeb0e61fd3f3f1b50713e82e5b0f","url":"static/css/71.1b8155c0.chunk.css"},{"revision":"e8ae4fefb322ef79295e353591c6b806","url":"static/css/72.1b8155c0.chunk.css"},{"revision":"b61666c0a677147b35ba316632067455","url":"static/css/73.7fdb4521.chunk.css"},{"revision":"d75157c32e48be464ab557359f08c38a","url":"static/css/76.cdca1631.chunk.css"},{"revision":"7db815fb4bcbc40beebe1d99d0df1ac8","url":"static/css/78.c8358670.chunk.css"},{"revision":"c2220aaebe09844f99376a7bb07c9d5e","url":"static/css/79.df1615d0.chunk.css"},{"revision":"00b9ad895951f32186a7dd18dc7bf6c6","url":"static/css/80.348fe525.chunk.css"},{"revision":"a56a386c27489567db44ac12eebe4c69","url":"static/css/81.646cdb8f.chunk.css"},{"revision":"23ba3dab5d485e65ac97ce5a49bde6b9","url":"static/css/82.1fc4ce24.chunk.css"},{"revision":"71f191c29493472028553e4fbc5570a8","url":"static/css/83.c8358670.chunk.css"},{"revision":"b9735043f1792e0976d8d6727077ff68","url":"static/css/84.4126e69b.chunk.css"},{"revision":"f50c2491c1e7377b7d903d4150110cc3","url":"static/css/85.84ebb5f4.chunk.css"},{"revision":"c1c4fd78315d25a2b08c97b54dfb8e37","url":"static/css/87.c8358670.chunk.css"},{"revision":"2cea1a766a7d2d6c997c18daa6829672","url":"static/css/88.c5210ab2.chunk.css"},{"revision":"9de5b2d00a7476fb7d1838049bc32fa1","url":"static/css/89.b84d8382.chunk.css"},{"revision":"86f5bc2a6c1fad03e004315ea6c162d6","url":"static/css/91.38c941b1.chunk.css"},{"revision":"f8e9e5e13528434861a187b750af9417","url":"static/css/main.6e171416.chunk.css"},{"revision":"465838bfb2b459ce490718c1acc7f267","url":"static/media/hand.e4b8a38a.png"},{"revision":"6d534ac9ea6eb6a2d7f2e9e17d71c730","url":"static/media/isoType.64ae383b.png"}]);

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

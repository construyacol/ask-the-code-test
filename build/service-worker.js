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
    workbox.precaching.precacheAndRoute([{"revision":"aa01e5c3f5b105d6ab97ad6815341833","url":"maskable_icon.png"},{"revision":"721564e8984bbd688fbd30c68b64867f","url":"static/css/123.4b16a441.chunk.css"},{"revision":"fd9aacdbaf8e469f60086e9cfa08b8eb","url":"static/css/126.fc71c765.chunk.css"},{"revision":"1be3c3dc54748a9a7b61e34a55b7436c","url":"static/css/127.fc71c765.chunk.css"},{"revision":"436217948328548505ad6c6bea4fc60e","url":"static/css/128.fc71c765.chunk.css"},{"revision":"24ccdb5aeef78185bcd04207d2a13ac9","url":"static/css/129.92933c9f.chunk.css"},{"revision":"8f939cceb0ac13dfb90ad84fc0ca5b70","url":"static/css/130.92933c9f.chunk.css"},{"revision":"5208ce13ea1cb9402c9107e91a054d2a","url":"static/css/131.fc71c765.chunk.css"},{"revision":"cf622ab4ea3f746289491d98f96fcc5d","url":"static/css/132.fc71c765.chunk.css"},{"revision":"077d8417a2ce5b9a0d2ae2a69e997c0e","url":"static/css/133.fc71c765.chunk.css"},{"revision":"400398e023808871012a2b35ba0fb9e3","url":"static/css/134.fc71c765.chunk.css"},{"revision":"0b90437866da62399567a428cf6392a7","url":"static/css/135.445f7abb.chunk.css"},{"revision":"f9ace7a21c1805e6458dace1d9c41078","url":"static/css/137.fc71c765.chunk.css"},{"revision":"87b7da6c4415fe6ef6ec2b56ec8543ba","url":"static/css/139.ae42ce75.chunk.css"},{"revision":"638dd1df8970cf5c724829f5d90248a9","url":"static/css/147.047fd448.chunk.css"},{"revision":"1328d9df029c824c76b1892dc90105f0","url":"static/css/19.ae42ce75.chunk.css"},{"revision":"e832e49f659537adb40429d70a0cd5f7","url":"static/css/34.26a191ea.chunk.css"},{"revision":"84660872e84aed2ea0adf1a15f8b1ed1","url":"static/css/35.26a191ea.chunk.css"},{"revision":"2b4b0126a0132db86999f4dc7a61c1d3","url":"static/css/37.fc71c765.chunk.css"},{"revision":"fccf0802f11a1cdc848820f136a73e86","url":"static/css/38.fc71c765.chunk.css"},{"revision":"91f04e580dca435c7dfb60129ba77e88","url":"static/css/39.fc71c765.chunk.css"},{"revision":"10b36ca313a056741fc65d8b893ffd8c","url":"static/css/40.26a191ea.chunk.css"},{"revision":"dc1876c0a1b2336c4a43c95956ec5416","url":"static/css/42.92933c9f.chunk.css"},{"revision":"3e93fa3c6e9f87319ff49f7b9e947ea6","url":"static/css/43.fc71c765.chunk.css"},{"revision":"2c22cd397caa76a03454166c42934bcd","url":"static/css/44.fc71c765.chunk.css"},{"revision":"5ec37d35dac067b47482d6832a2936ec","url":"static/css/45.fc71c765.chunk.css"},{"revision":"d7064a679b19a48f598a420d2fb1512f","url":"static/css/46.fc71c765.chunk.css"},{"revision":"1483a7f9487f55280d43e1bbe651088c","url":"static/css/47.fc71c765.chunk.css"},{"revision":"b2d2680f331b3cedbb8880c90217e46e","url":"static/css/48.26a191ea.chunk.css"},{"revision":"42c15806f34e76e01bce1fb75a11d182","url":"static/css/56.f1889954.chunk.css"},{"revision":"caf852cbab486b3d0a7ea341f112082b","url":"static/css/7.20b9ac78.chunk.css"},{"revision":"040a06c83bc6be85dc46564ee93e40b6","url":"static/css/main.0d66cf95.chunk.css"},{"revision":"465838bfb2b459ce490718c1acc7f267","url":"static/media/hand.e4b8a38a.png"},{"revision":"6d534ac9ea6eb6a2d7f2e9e17d71c730","url":"static/media/isoType.64ae383b.png"}]);

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

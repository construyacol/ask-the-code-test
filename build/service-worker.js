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
    workbox.precaching.precacheAndRoute([{"revision":"aa01e5c3f5b105d6ab97ad6815341833","url":"maskable_icon.png"},{"revision":"882622cd658dac16f5a381e6965021a8","url":"static/css/15.ad69ffaf.chunk.css"},{"revision":"df1030fce79ed89896b8a7edfac37ac5","url":"static/css/17.f0cd96f5.chunk.css"},{"revision":"c6dd5cd85f7460f82c819f79b952f158","url":"static/css/19.31c79469.chunk.css"},{"revision":"67d72b8d724f76e0051a5559c1348fba","url":"static/css/20.b68bd476.chunk.css"},{"revision":"21589ec1d205601892e52a487bb9f0c2","url":"static/css/21.751db45f.chunk.css"},{"revision":"340d24ef93a9048816b49ef3982620a4","url":"static/css/22.677ce046.chunk.css"},{"revision":"df0f341e2575b578c40c4b8385542d35","url":"static/css/24.92200c02.chunk.css"},{"revision":"29b6753c3e9c441f31b5c8cd5e7e7f3b","url":"static/css/25.7fdb4521.chunk.css"},{"revision":"9c75bbca9c4ccb1823802cdbcb5671ee","url":"static/css/26.36778030.chunk.css"},{"revision":"4287a50306ecb75ac641f8fe5e45d0f8","url":"static/css/27.32391a8b.chunk.css"},{"revision":"cee435c148f4f5261d7f4365679946bf","url":"static/css/29.783939f0.chunk.css"},{"revision":"b95b3d45a0a893da35877a3db40ca5eb","url":"static/css/31.df1615d0.chunk.css"},{"revision":"781a3c6dbdb6e5ab6d02fa5b950a26c2","url":"static/css/32.331ea72d.chunk.css"},{"revision":"da86a5a7bd587f05bee1955cf7ae0a0d","url":"static/css/33.348fe525.chunk.css"},{"revision":"913f3decec937cc989210ec8fef817ab","url":"static/css/34.30f6919d.chunk.css"},{"revision":"2f025826f03d24c157f069a08ebbbfa9","url":"static/css/35.e365f5c3.chunk.css"},{"revision":"50f6f883d2ffd4eb787a5afb5b5aa5d1","url":"static/css/36.0eb489b3.chunk.css"},{"revision":"e9c40bf5c21048ba67f1f94fd59ef20b","url":"static/css/37.dbec6b08.chunk.css"},{"revision":"2e0534a7795cb426f8f112c36d838477","url":"static/css/38.84ebb5f4.chunk.css"},{"revision":"f28298e85873c46bc2e6d3e4fbe107ca","url":"static/css/40.d4cd6500.chunk.css"},{"revision":"2f36c32d2e24b0df664f37d6ade89741","url":"static/css/41.c5210ab2.chunk.css"},{"revision":"d16741bc203456f8edaec50b23439dda","url":"static/css/42.b84d8382.chunk.css"},{"revision":"ea386c6e0cf1420e9fc3eb9329f28386","url":"static/css/5.20b9ac78.chunk.css"},{"revision":"8f2d06134e781f11b6048b244497d9c0","url":"static/css/8.bfefabdf.chunk.css"},{"revision":"2b08bd8500c665893fd11e699d5eb215","url":"static/css/9.c56c22dd.chunk.css"},{"revision":"c4dba699649035ba58290353c89aee69","url":"static/css/main.9a8ac94a.chunk.css"},{"revision":"2f2918f8c61b4d8bbadcd664bc0b59a4","url":"static/media/canceled.5bc5b1e1.mp3"},{"revision":"95254b0b188b9167b5fd63c018a8e191","url":"static/media/coin.b86e8254.mp3"},{"revision":"283623c4e38459a5fbe90ce804830b22","url":"static/media/exit.f7477658.mp3"},{"revision":"1a487cb786eba76b0e334546b60a5e97","url":"static/media/good.d6dee334.mp3"},{"revision":"dacff3d739421e043fa3761cdd2ae26a","url":"static/media/notification.85199c4f.mp3"},{"revision":"98161fee4636b312bce1121fdbff8c12","url":"static/media/rejected.3e0aea9b.mp3"},{"revision":"d29c0fd9c0d4e7e7d79eca7dcc79cb10","url":"static/media/success.cb56b9e8.mp3"},{"revision":"1dc828765e368dd618db018d5d9ad925","url":"static/media/success2.d56e7bf6.mp3"},{"revision":"14804fce9bc89b9bd5f10fa8eb743a3e","url":"static/media/toast.927e6e79.mp3"}]);

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

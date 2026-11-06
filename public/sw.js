/* 离线缓存：有网络时取最新页面，没网络时用上次打开时保存的页面 */
var CACHE = "home-back-cache";
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(["/", "/manifest.webmanifest", "/icon-192.png", "/apple-touch-icon.png"]); }).then(function () { return self.skipWaiting(); })
  );
});
self.addEventListener("activate", function (e) {
  e.waitUntil(self.clients.claim());
});
self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  e.respondWith(
    fetch(req)
      .then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
        return res;
      })
      .catch(function () {
        return caches.match(req).then(function (m) { return m || caches.match("/"); });
      })
  );
});

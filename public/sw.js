// 설치 가능 조건 충족용 최소 서비스 워커. 오프라인 캐시는 하지 않고 네트워크로 그대로 전달한다.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});

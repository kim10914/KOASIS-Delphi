// 설치 가능 조건 충족용 최소 서비스 워커. 오프라인 캐시나 no-op fetch 가로채기를 하지 않는다.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
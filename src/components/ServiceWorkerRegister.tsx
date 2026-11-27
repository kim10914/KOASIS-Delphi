"use client";

import { useEffect } from "react";
import { pwaConfig } from "@/constants/pwaInstall";

// PWA 설치 조건 충족을 위해 서비스 워커를 등록한다. 개발 중에는 캐시 혼선을 막기 위해 건너뛴다.
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" ||
      !("serviceWorker" in navigator)
    ) {
      return;
    }
    navigator.serviceWorker
      .register(pwaConfig.serviceWorkerPath, {
        scope: pwaConfig.serviceWorkerScope,
      })
      .catch(() => {});
  }, []);

  return null;
}

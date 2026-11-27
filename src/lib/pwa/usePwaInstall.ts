"use client";

import { useCallback, useEffect, useState } from "react";
import { isIos, isMobileDevice, isStandalone } from "./environment";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export type PwaInstallState = {
  // 모바일 웹 브라우저이면서 아직 설치되지 않은 경우에만 true
  canPrompt: boolean;
  isIosDevice: boolean;
  // 네이티브 설치 프롬프트(beforeinstallprompt)를 쓸 수 있는지
  hasNativePrompt: boolean;
  promptInstall: () => Promise<void>;
};

/**
 * 설치 유도 노출 조건과 플랫폼별 설치 동작을 제공한다.
 * beforeinstallprompt는 스플래시 중에 발생할 수 있으므로 스플래시 최상단에서 호출한다.
 * 닫기 선택은 저장하지 않으므로 재방문 시 다시 노출된다.
 */
export function usePwaInstall(): PwaInstallState {
  const [canPrompt, setCanPrompt] = useState(false);
  const [isIosDevice, setIsIosDevice] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // 브라우저 환경은 마운트 후에만 알 수 있으므로 effect에서 한 번 동기화한다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCanPrompt(isMobileDevice() && !isStandalone());
    setIsIosDevice(isIos());

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => {
      setDeferredPrompt(null);
      setCanPrompt(false);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) {
      return;
    }
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    // 프롬프트 이벤트는 한 번만 사용할 수 있다.
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  return {
    canPrompt,
    isIosDevice,
    hasNativePrompt: deferredPrompt !== null,
    promptInstall,
  };
}

"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { pwaConfig } from "@/constants/pwaInstall";
import { isIos, isMobileDevice, isStandalone } from "./environment";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export type PwaInstallState = {
  // 모바일 웹 브라우저이면서 아직 설치되지 않았고, 현재 탭에서 닫지 않은 경우에만 true
  canPrompt: boolean;
  isIosDevice: boolean;
  // 네이티브 설치 프롬프트(beforeinstallprompt)를 쓸 수 있는지
  hasNativePrompt: boolean;
  promptInstall: () => Promise<void>;
  dismissPrompt: () => void;
};

const subscribeNoop = () => () => {};

function getInitialPromptEligibility(): boolean {
  return isMobileDevice() && !isStandalone();
}

function getSessionDismissed(): boolean {
  try {
    return window.sessionStorage.getItem(pwaConfig.dismissedSessionKey) === "1";
  } catch {
    return false;
  }
}

/**
 * 설치 유도 노출 조건과 플랫폼별 설치 동작을 제공한다.
 * beforeinstallprompt는 스플래시 중에 발생할 수 있으므로 스플래시 최상단에서 호출한다.
 * 같은 탭 내 재노출을 막기 위해 닫기 여부는 sessionStorage에만 기록한다.
 */
export function usePwaInstall(): PwaInstallState {
  const isEligibleDevice = useSyncExternalStore(
    subscribeNoop,
    getInitialPromptEligibility,
    () => false,
  );
  const isIosDevice = useSyncExternalStore(subscribeNoop, isIos, () => false);
  const initialDismissed = useSyncExternalStore(
    subscribeNoop,
    getSessionDismissed,
    () => false,
  );

  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => {
      setDeferredPrompt(null);
      setIsInstalled(true);
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

  const dismissPrompt = useCallback(() => {
    setIsDismissed(true);
    try {
      window.sessionStorage.setItem(pwaConfig.dismissedSessionKey, "1");
    } catch {
      // sessionStorage가 차단된 환경에서도 닫기 동작은 유지한다.
    }
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) {
      return;
    }
    try {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
    } finally {
      // 프롬프트 이벤트는 한 번만 사용할 수 있다.
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  return {
    canPrompt:
      isEligibleDevice && !isInstalled && !initialDismissed && !isDismissed,
    isIosDevice,
    hasNativePrompt: deferredPrompt !== null,
    promptInstall,
    dismissPrompt,
  };
}

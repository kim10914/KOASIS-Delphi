import { pwaConfig } from "@/constants/pwaInstall";

type StandaloneNavigator = Navigator & { standalone?: boolean };

// iPadOS는 데스크톱 Safari로 위장하므로 터치 지원 여부로 함께 판별한다.
export function isIos(): boolean {
  const { userAgent, platform, maxTouchPoints } = navigator;
  if (pwaConfig.iosUserAgentPattern.test(userAgent)) {
    return true;
  }
  return platform === "MacIntel" && maxTouchPoints > 1;
}

export function isMobileDevice(): boolean {
  return isIos() || pwaConfig.mobileUserAgentPattern.test(navigator.userAgent);
}

export function isStandalone(): boolean {
  return (
    window.matchMedia(pwaConfig.standaloneMediaQuery).matches ||
    (navigator as StandaloneNavigator).standalone === true
  );
}

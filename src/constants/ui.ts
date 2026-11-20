import { brandAssets } from "./assets";

export const appHeaderText = {
  logoSrc: brandAssets.logoPath,
  wordmark: "Mind Mirror",
  logoAlt: brandAssets.logoAlt,
  menuLabel: "메뉴 (준비 중)",
} as const;

export const buttonText = {
  loadingLabel: "처리 중",
} as const;

export const stepIndicatorText = {
  defaultTotalSteps: 3,
  label: "진행 단계",
  stepLabel: (step: number, total: number) => `${total}단계 중 ${step}단계`,
} as const;

export const appHeaderText = {
  wordmark: "Mind Mirror",
  logoAlt: "Mind Mirror 로고",
  menuLabel: "메뉴 (준비 중)",
} as const;

export const buttonText = {
  loadingLabel: "처리 중",
} as const;

export const stepIndicatorText = {
  label: "진행 단계",
  stepLabel: (step: number, total: number) => `${total}단계 중 ${step}단계`,
} as const;

export const splashText = {
  brandName: "Mind Mirror",
  subtitle: "by K-OASIS Image Pool",
  copyright: "©강원대학교 원주산학협력단",
  introTitleLines: ["마음을 보는 거울", "마인드 미러"],
  introDescription: "지금 내 마음을 알아볼까요?",
  startLabel: "시작하기",
} as const;

export const splashSteps = {
  logo: 1,
  subtitle: 2,
  intro: 3,
} as const;

export type SplashStep = (typeof splashSteps)[keyof typeof splashSteps];

export const splashBackgroundGradients = [
  "radial-gradient(70% 40% at 0% 85%, var(--color-splash-glow-blue) 0%, transparent 100%)",
  "radial-gradient(60% 40% at 100% 50%, var(--color-splash-glow-purple) 0%, transparent 100%)",
  "radial-gradient(60% 35% at 60% 65%, var(--color-splash-glow-navy) 0%, transparent 100%)",
] as const;

import type { ScaleValue } from "@/types/survey";

export const testText = {
  progressLabel: "테스트 진행률",
  guide: "다음 사진을 보고 처음 느껴지는 기분을 선택해주세요.",
  imageLoading: "사진을 불러오는 중이에요.",
  imageError: "사진을 불러오지 못했어요.",
  imageRetry: "다시 불러오기",
  imageAlt: "기분을 선택할 사진",
  next: "다음 사진",
} as const;

export type ScaleKind = "valence" | "arousal";

export const scaleQuestions: Record<
  ScaleKind,
  { title: string; low: string; high: string }
> = {
  valence: { title: "어떤 기분이 드나요?", low: "불쾌함", high: "유쾌함" },
  arousal: {
    title: "얼마나 자극적으로 느껴지시나요?",
    low: "자극적",
    high: "평온한",
  },
};

export const scaleStepLabel = (low: string, high: string, step: number) =>
  `${low}에서 ${high} 사이 ${step}단계`;

// 7단계 얼굴 아이콘 색상 (좌에서 우, 1~7). docs/design-tokens.md 참고.
export const scaleColors = [
  "#dd191c",
  "#f87f28",
  "#feb330",
  "#e4e023",
  "#9de423",
  "#52d20e",
  "#00d660",
] as const;

export const scaleValues: readonly ScaleValue[] = [1, 2, 3, 4, 5, 6, 7];

// 얼굴 이미지(60x60 viewBox) 이목구비 경로. 키는 척도 종류, 인덱스는 단계(1~7)-1.
type FaceFeature = { d: string; fill?: boolean };

const eyeDots = "M20 24h.01M40 24h.01";
const eyeArcs = "M16 25q4-5 8 0M36 25q4-5 8 0";
const eyeRound =
  "M20 24m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0M40 24m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0";
const eyeAngry = "M15 19l10 5M45 19l-10 5";
const eyeSad = "M15 22l10-4M45 22l-10-4";
const eyeSquintIn = "M15 20l9 4-9 4M45 20l-9 4 9 4";
const eyeDash = "M16 24h8M36 24h8";

export const faceFeatures: Record<ScaleKind, FaceFeature[][]> = {
  valence: [
    [{ d: eyeAngry }, { d: "M18 44q12-12 24 0z", fill: true }],
    [{ d: eyeSad }, { d: "M19 43q11-10 22 0" }],
    [{ d: eyeDots }, { d: "M20 42q10-8 20 0" }],
    [{ d: eyeDots }, { d: "M20 40h20" }],
    [{ d: eyeDots }, { d: "M20 38q10 8 20 0" }],
    [{ d: eyeArcs }, { d: "M19 37q11 11 22 0" }],
    [{ d: eyeArcs }, { d: "M17 36h26q-2 14-13 14t-13-14z", fill: true }],
  ],
  arousal: [
    [{ d: eyeSquintIn }, { d: "M19 44q11-11 22 0z", fill: true }],
    [{ d: eyeSquintIn }, { d: "M19 43q11-9 22 0" }],
    [{ d: eyeRound }, { d: "M20 42q10-8 20 0" }],
    [{ d: eyeRound }, { d: "M20 40h20" }],
    [{ d: eyeDash }, { d: "M20 40h20" }],
    [{ d: eyeDots }, { d: "M19 37q11 9 22 0" }],
    [{ d: eyeArcs }, { d: "M19 37q11 9 22 0" }],
  ],
};

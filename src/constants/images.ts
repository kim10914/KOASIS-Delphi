import type { ImageQuadrant, SurveyImageItem } from "@/types/survey";

// 사분면 목록. 이미지 라벨과 균등 추출이 이 순서와 이름을 기준으로 한다.
// scripts/check-survey-images.mjs의 quadrants와 같은 값을 유지한다.
export const imageQuadrants: readonly ImageQuadrant[] = [
  "highEnergyPositive",
  "highEnergyNegative",
  "lowEnergyPositive",
  "lowEnergyNegative",
];

// 실제 이미지 파일 위치와 확장자. 최종 이미지 파일이 확정되면 여기만 맞춘다.
export const surveyImageDir = "/survey-images";
export const surveyImageExtension = "jpg";

// 임시 이미지 ID 접두사. 이 접두사의 ID는 파일 없이 SVG 데이터 URL로 표시한다.
const placeholderPrefix = "placeholder-";

// K-OASIS 이미지 정보 중 임시 이미지 40장. 실제 파일명(원본 OASIS와 동일)과 사분면 라벨이 확정되면 교체한다.
// 지금은 사분면 4곳에 10장씩 번갈아 배정한 가짜 라벨이다.
export const imagePoolSize = 40;

export const imagePool: readonly SurveyImageItem[] = Array.from(
  { length: imagePoolSize },
  (_, index) => ({
    id: `${placeholderPrefix}${String(index + 1).padStart(3, "0")}`,
    quadrant: imageQuadrants[index % imageQuadrants.length],
  }),
);

function getPlaceholderSrc(imageId: string): string {
  const seed = imageId
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const hue = (seed * 37) % 360;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="800" viewBox="0 0 1000 800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue} 60% 55%)"/><stop offset="1" stop-color="hsl(${(hue + 60) % 360} 60% 35%)"/></linearGradient></defs><rect width="1000" height="800" fill="url(#g)"/><text x="500" y="420" font-size="56" font-family="sans-serif" fill="white" text-anchor="middle">${imageId}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// 이미지 ID를 화면에 표시할 주소로 바꾼다.
// placeholder-* ID는 파일 없이 SVG로, 실제 ID는 /survey-images/<id>.<확장자>로 매핑한다.
export function getImageSrc(imageId: string): string {
  if (imageId.startsWith(placeholderPrefix)) {
    return getPlaceholderSrc(imageId);
  }
  return `${surveyImageDir}/${encodeURIComponent(imageId)}.${surveyImageExtension}`;
}

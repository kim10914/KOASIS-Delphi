import surveyConfigJson from "@/config/survey.json";
import rawSurveyImages from "@/constants/surveyImages.json";
import type { ImageQuadrant, SurveyImageItem } from "@/types/survey";

// 사분면 목록. src/config/survey.json에서 읽어 검사 스크립트와 같은 기준을 공유한다.
export const imageQuadrants: readonly ImageQuadrant[] =
  surveyConfigJson.quadrants as readonly ImageQuadrant[];

// 실제 이미지 파일 위치와 기본 확장자. item.file이 없을 때 <id>.<기본확장자>로 매핑한다.
export const surveyImageDir = "/survey-images";
export const surveyImageExtension = "jpg";

// 임시 이미지 ID 접두사. 이 접두사의 ID는 파일 없이 SVG 데이터 URL로 표시한다.
const placeholderPrefix = "placeholder-";

// K-OASIS 이미지 풀. 앱과 검사 스크립트가 동일한 src/constants/surveyImages.json을 사용한다.
export const imagePool: readonly SurveyImageItem[] =
  rawSurveyImages as readonly SurveyImageItem[];

export const imagePoolSize = imagePool.length;

const imageMap = new Map<string, SurveyImageItem>(
  imagePool.map((item) => [item.id, item]),
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
// placeholder-* ID는 SVG로, 실제 ID는 item.file(또는 <id>.jpg)을 /survey-images/ 아래에 매핑한다.
export function getImageSrc(imageId: string): string {
  if (imageId.startsWith(placeholderPrefix)) {
    return getPlaceholderSrc(imageId);
  }
  const fileName =
    imageMap.get(imageId)?.file ?? `${imageId}.${surveyImageExtension}`;
  return `${surveyImageDir}/${encodeURIComponent(fileName)}`;
}

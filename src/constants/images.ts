// K-OASIS 이미지 확보 전 임시 이미지 풀. 실제 파일명(원본 OASIS와 동일)이 확정되면 교체한다.
export const imagePoolSize = 40;

export const imagePool: readonly string[] = Array.from(
  { length: imagePoolSize },
  (_, index) => `placeholder-${String(index + 1).padStart(3, "0")}`,
);

// 이미지 파일 경로 규칙. #18 최종 이미지 목록을 받으면 이 함수만 실제 경로로 교체한다.
// 지금은 파일이 없으므로 이미지 ID마다 색이 다른 SVG 데이터 URL을 돌려준다.
export function getImageSrc(imageId: string): string {
  const seed = imageId
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const hue = (seed * 37) % 360;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="800" viewBox="0 0 1000 800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue} 60% 55%)"/><stop offset="1" stop-color="hsl(${(hue + 60) % 360} 60% 35%)"/></linearGradient></defs><rect width="1000" height="800" fill="url(#g)"/><text x="500" y="420" font-size="56" font-family="sans-serif" fill="white" text-anchor="middle">${imageId}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

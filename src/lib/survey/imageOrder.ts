import { surveyConfig } from "@/config/survey";
import { imagePool, imageQuadrants } from "@/constants/images";

function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function createRandomOrder(): string[] {
  if (imagePool.length < surveyConfig.imageCount) {
    throw new Error(
      `이미지 풀이 부족합니다. (필요 ${surveyConfig.imageCount}, 보유 ${imagePool.length})`,
    );
  }
  return shuffle(imagePool)
    .slice(0, surveyConfig.imageCount)
    .map((item) => item.id);
}

// 사분면별로 같은 수를 뽑은 뒤 전체를 다시 섞어 표시 순서를 무작위로 만든다.
function createBalancedOrder(): string[] {
  const perQuadrant = Math.floor(
    surveyConfig.imageCount / imageQuadrants.length,
  );
  if (
    surveyConfig.imageCount <= 0 ||
    perQuadrant * imageQuadrants.length !== surveyConfig.imageCount
  ) {
    throw new Error(
      `imageCount(${surveyConfig.imageCount})는 사분면 수(${imageQuadrants.length})로 나누어떨어지는 양수여야 합니다.`,
    );
  }
  const picked = imageQuadrants.flatMap((quadrant) => {
    const items = imagePool.filter((item) => item.quadrant === quadrant);
    if (items.length < perQuadrant) {
      throw new Error(
        `사분면 ${quadrant}의 이미지가 부족합니다. (필요 ${perQuadrant}, 보유 ${items.length})`,
      );
    }
    return shuffle(items).slice(0, perQuadrant);
  });
  return shuffle(picked).map((item) => item.id);
}

// 이미지 선택 방식은 surveyConfig.imageSelection에서만 바꾼다.
export function createImageOrder(): string[] {
  if (surveyConfig.imageSelection === "random") {
    return createRandomOrder();
  }
  return createBalancedOrder();
}

import { surveyConfig } from "@/config/survey";
import { imagePool } from "@/constants/images";

// 이미지 선택 방식은 surveyConfig에서만 바꾼다. 현재는 풀에서 무작위로 imageCount장을 뽑는다.
export function createImageOrder(): string[] {
  const pool = [...imagePool];
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
  }
  return pool.slice(0, surveyConfig.imageCount);
}

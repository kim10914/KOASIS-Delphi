// 앱 설정(src/config/survey.json)과 이미지 목록(src/constants/surveyImages.json)의 정합성을 검사한다.
// prebuild 및 CI에서 실행해 잘못된 설정·목록이 배포되지 않게 막는다.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const surveyConfig = JSON.parse(
  readFileSync(resolve("src/config/survey.json"), "utf8"),
);
const imagePool = JSON.parse(
  readFileSync(resolve("src/constants/surveyImages.json"), "utf8"),
);

const quadrants = surveyConfig.quadrants;
const errors = [];

if (!Array.isArray(quadrants) || quadrants.length === 0) {
  errors.push("survey.json의 quadrants가 비어 있습니다.");
}
if (!Number.isInteger(surveyConfig.imageCount) || surveyConfig.imageCount <= 0) {
  errors.push(`imageCount(${surveyConfig.imageCount})는 양의 정수여야 합니다.`);
}
if (!["random", "balanced"].includes(surveyConfig.imageSelection)) {
  errors.push(
    `imageSelection(${surveyConfig.imageSelection})은 random 또는 balanced여야 합니다.`,
  );
}
if (!Array.isArray(imagePool)) {
  errors.push("surveyImages.json은 배열이어야 합니다.");
}

if (errors.length === 0) {
  const seen = new Set();
  const counts = Object.fromEntries(quadrants.map((q) => [q, 0]));

  imagePool.forEach((item, index) => {
    const id = typeof item?.id === "string" ? item.id.trim() : "";
    if (!id) {
      errors.push(`#${index + 1}: id가 비어 있습니다.`);
      return;
    }
    if (seen.has(id)) {
      errors.push(`중복 ID: ${id}`);
      return;
    }
    seen.add(id);
    if (!quadrants.includes(item.quadrant)) {
      errors.push(`${id}: 올바르지 않은 quadrant (${item.quadrant ?? "없음"})`);
    } else {
      counts[item.quadrant] += 1;
    }
  });

  if (surveyConfig.imageSelection === "random") {
    if (seen.size < surveyConfig.imageCount) {
      errors.push(
        `이미지 풀이 부족합니다. (필요 ${surveyConfig.imageCount}, 보유 ${seen.size})`,
      );
    }
  } else if (surveyConfig.imageSelection === "balanced") {
    if (surveyConfig.imageCount % quadrants.length !== 0) {
      errors.push(
        `imageCount(${surveyConfig.imageCount})는 사분면 수(${quadrants.length})로 나누어떨어져야 합니다.`,
      );
    } else {
      const perQuadrant = surveyConfig.imageCount / quadrants.length;
      for (const quadrant of quadrants) {
        if (counts[quadrant] < perQuadrant) {
          errors.push(
            `${quadrant}: 이미지가 부족합니다. (필요 ${perQuadrant}, 보유 ${counts[quadrant]})`,
          );
        }
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`설문 설정·이미지 목록 검증 실패 (${errors.length}건):`);
  errors.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(
  `설문 설정·이미지 목록 검증 통과 (${surveyConfig.imageSelection}, ${surveyConfig.imageCount}장, 풀 ${imagePool.length}장)`,
);

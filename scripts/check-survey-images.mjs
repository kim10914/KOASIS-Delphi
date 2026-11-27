// 이미지 라벨 목록과 이미지 폴더를 대조해 검증한다. (#36 이미지·라벨 확정 시 사용)
// 사용법: node scripts/check-survey-images.mjs [라벨파일] [이미지폴더] [세션당이미지수]
//   라벨파일: JSON([{ "id": "...", "quadrant": "..." }]) 또는 CSV(헤더 id,quadrant)
//   기본값: scripts/survey-image-labels.json, public/survey-images, 20
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, basename, resolve } from "node:path";

// src/constants/images.ts의 imageQuadrants와 같은 값을 유지한다.
const quadrants = [
  "highEnergyPositive",
  "highEnergyNegative",
  "lowEnergyPositive",
  "lowEnergyNegative",
];
const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".avif"];

const labelPath = resolve(process.argv[2] ?? "scripts/survey-image-labels.json");
const imageDir = resolve(process.argv[3] ?? "public/survey-images");
const imageCount = Number(process.argv[4] ?? 20);

const errors = [];

function parseCsvLine(line) {
  const cells = [];
  let current = "";
  let inQuotes = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (inQuotes) {
      if (char === "\"" && line[index + 1] === "\"") {
        current += "\"";
        index += 1;
      } else if (char === "\"") {
        inQuotes = false;
      } else {
        current += char;
      }
    } else if (char === "\"") {
      inQuotes = true;
    } else if (char === ",") {
      cells.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current.trim());
  return cells;
}

function parseLabels(path) {
  const text = readFileSync(path, "utf8").replace(/^\uFEFF/, "");
  if (extname(path).toLowerCase() === ".csv") {
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    if (lines.length === 0) {
      throw new Error("CSV 라벨 파일이 비어 있습니다.");
    }
    const [header, ...rows] = lines;
    const columns = parseCsvLine(header);
    if (!columns.includes("id") || !columns.includes("quadrant")) {
      throw new Error(
        "CSV 헤더에 id와 quadrant 컬럼이 필요합니다.",
      );
    }
    return rows.map((row) => {
      const cells = parseCsvLine(row);
      return Object.fromEntries(columns.map((c, i) => [c, cells[i]]));
    });
  }
  const data = JSON.parse(text);
  if (!Array.isArray(data)) {
    throw new Error("JSON 라벨 파일은 배열이어야 합니다.");
  }
  return data;
}

if (!existsSync(labelPath)) {
  console.error(`라벨 파일을 찾을 수 없습니다: ${labelPath}`);
  process.exit(1);
}
if (!existsSync(imageDir)) {
  console.error(`이미지 폴더를 찾을 수 없습니다: ${imageDir}`);
  process.exit(1);
}
if (!Number.isInteger(imageCount) || imageCount <= 0 || imageCount % 4 !== 0) {
  console.error(`세션당 이미지 수는 4의 배수인 양의 정수여야 합니다: ${imageCount}`);
  process.exit(1);
}

let labels;
try {
  labels = parseLabels(labelPath);
} catch (error) {
  console.error(`라벨 파일을 읽을 수 없습니다: ${error.message}`);
  process.exit(1);
}

const files = readdirSync(imageDir, { withFileTypes: true })
  .filter(
    (entry) =>
      entry.isFile() &&
      imageExtensions.includes(extname(entry.name).toLowerCase()),
  )
  .map((entry) => entry.name);
const fileIds = new Map();
for (const name of files) {
  const id = basename(name, extname(name));
  if (fileIds.has(id)) {
    errors.push(`이미지 파일 ID 중복: ${id} (${fileIds.get(id)}, ${name})`);
  }
  fileIds.set(id, name);
}

const seen = new Set();
const counts = Object.fromEntries(quadrants.map((quadrant) => [quadrant, 0]));
labels.forEach((item, index) => {
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
    errors.push(
      `${id}: 사분면 라벨이 올바르지 않습니다. (${item.quadrant ?? "없음"}) 허용값: ${quadrants.join(", ")}`,
    );
  } else {
    counts[item.quadrant] += 1;
  }
  if (!fileIds.has(id)) {
    errors.push(`${id}: 이미지 파일이 없습니다. (${imageDir})`);
  }
});

for (const [id, name] of fileIds) {
  if (!seen.has(id)) {
    errors.push(`${name}: 라벨이 없는 이미지 파일입니다.`);
  }
}

const perQuadrant = imageCount / quadrants.length;
for (const quadrant of quadrants) {
  if (counts[quadrant] < perQuadrant) {
    errors.push(
      `${quadrant}: 이미지가 부족합니다. (필요 ${perQuadrant}, 보유 ${counts[quadrant]})`,
    );
  }
}

console.log(`라벨 ${labels.length}개, 이미지 파일 ${files.length}개`);
console.log(
  `사분면별 개수: ${quadrants.map((q) => `${q}=${counts[q]}`).join(", ")}`,
);
if (errors.length > 0) {
  console.error(`\n검증 실패 (${errors.length}건):`);
  errors.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}
console.log("검증 통과");

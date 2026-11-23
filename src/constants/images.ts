// K-OASIS 이미지 확보 전 임시 이미지 풀. 실제 파일명(원본 OASIS와 동일)이 확정되면 교체한다.
export const imagePoolSize = 40;

export const imagePool: readonly string[] = Array.from(
  { length: imagePoolSize },
  (_, index) => `placeholder-${String(index + 1).padStart(3, "0")}`,
);

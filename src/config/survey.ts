// 발주처 확인 전 임시값. 확정되면 이 파일만 수정한다.
export const surveyConfig = {
  // 한 세션에서 보여줄 이미지 수
  imageCount: 20,
  // 이미지 선택 방식
  imageSelection: "random",
  // 본조사 UI 타입 (Type 2: 캐릭터 아이콘 척도)
  testUiType: "type2",
  // 표정 녹화 범위 ("preparing": 준비 중 토스트 안내, "consent-only": 동의 여부만 저장)
  faceRecording: "preparing" as "preparing" | "consent-only",
  // 척도 단계 수
  scaleSteps: 7,
} as const;

// 동의 화면 토스트 노출 시간(ms). 설정값 분리.
export const consentConfig = {
  toastDurationMs: 3000,
} as const;

// 스플래시 자동 전환 시간(ms). 임의 설정값이며 확정되면 이 값만 수정한다.
export const splashConfig = {
  // 1단계(로고)에서 2단계로 넘어가기까지 시간
  logoDurationMs: 1000,
  // 2단계(서브 문구)에서 3단계로 넘어가기까지 시간
  subtitleDurationMs: 1000,
} as const;

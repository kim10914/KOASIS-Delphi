// 발주처 확인 전 임시값. 확정되면 이 파일만 수정한다.
export const surveyConfig = {
  // 한 세션에서 보여줄 이미지 수
  imageCount: 20,
  // 이미지 선택 방식
  imageSelection: "random",
  // 본조사 UI 타입 (Type 2: 캐릭터 아이콘 척도)
  testUiType: "type2",
  // 표정 녹화 범위 (a안: 동의 여부만 저장, 카메라는 켜지 않음)
  faceRecording: "consent-only",
  // 척도 단계 수
  scaleSteps: 7,
} as const;

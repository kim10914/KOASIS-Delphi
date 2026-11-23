// 아래 설명 문구와 agreeButton 라벨은 surveyConfig.faceRecording("consent-only")에 맞춰 작성되었다.
// 실제 카메라 녹화를 켜게 되면 문구와 라벨을 함께 검토해야 한다.
export const consentStep = 2;

export const consentTextVersion = "v1-temp";

export const consentText = {
  title: "참여 화면도 기록해볼까요?",
  description:
    "표정 분석 참여에 동의하면 그 동의 여부가 이번 조사에 기록됩니다. 현재 단계에서는 카메라를 켜거나 사진·영상을 촬영하지 않습니다.",
  termsLabel: "이용약관에 동의합니다",
  termsToggleOpen: "약관 내용 보기",
  termsToggleClose: "약관 내용 닫기",
  termsTitle: "표정 분석 참여 동의 안내 (임시)",
  termsItems: [
    "이 안내는 최종 연구 약관이 확정되기 전에 사용하는 임시 안내입니다.",
    "현재 단계에서는 카메라를 켜거나 사진·영상을 촬영하지 않고, 동의 여부와 동의 시각, 안내문 버전만 기록합니다.",
    "동의하지 않아도 조사에는 처음부터 끝까지 참여할 수 있습니다.",
  ] as readonly string[],
  agreeButton: "표정 분석에 동의하고 계속하기",
  optionalTitle: "꼭 기록하지 않아도 괜찮아요.",
  optionalDescription: "표정 분석에 동의하지 않아도 조사를 진행할 수 있습니다.",
  surveyOnlyButton: "오늘은 조사만 하기",
} as const;

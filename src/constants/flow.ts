export const flowText = {
  guardLoading: "불러오는 중이에요.",
  guardRedirecting: "알맞은 단계로 이동하고 있어요.",
  saving: "결과를 저장하고 있어요.",
  saveFailed:
    "저장하지 못했어요. 응답은 그대로 남아 있으니 다시 시도해 주세요.",
  retry: "다시 시도",
  progress: "진행",
  resultTitleSuffix: "님의 테스트 결과",
  restart: "처음으로",
} as const;

// 본조사 화면 구현 전까지 임시 화면이 기록하는 응답값.
export const stubScale = 4;

// 감정 격자 한 변의 칸 수(6x6)
export const moodGridSize = 6;

// 임시 화면 단계별 문구. 각 화면을 실제로 구현할 때 해당 항목을 제거한다.
export const stubScreens = {
  ready: {
    title: "자 그럼 마음을 보는 거울 마인드 미러를 시작합니다!",
    description:
      "화면에 나오는 사진을 보고, 처음 느껴지는 기분을 7단계 중에서 선택해 주세요.",
    nextLabel: "시작하기",
  },
  test: {
    title: "본조사",
    description: "이미지 응답: 쾌-불쾌, 자극-평온 (Type 2)",
    nextLabel: "다음 사진",
  },
  done: {
    title: "수고하셨습니다. 모든 조사를 마쳤습니다.",
    description: "작성해 주신 내용으로 마음의 거울을 준비해 볼게요.",
    nextLabel: "계속하기",
  },
  loading: {
    title: "테스트 결과 도출 중...",
    description: "테스트 결과를 준비 중이에요. 조금만 기다려주세요.",
    nextLabel: "결과 보기",
  },
  result: {
    title: "테스트 결과",
    description: "마인드미러로 들여다본 오늘 내 마음의 상태",
    nextLabel: "처음으로",
  },
} as const;

export type StubStage = keyof typeof stubScreens;

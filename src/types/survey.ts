export type ScaleValue = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Participant = {
  name: string;
  birthDate: string;
  gender: string;
  job: string;
  region: string;
};

export type PrivacyConsent = {
  agreed: true;
  at: string;
  textVersion: string;
};

export type ImageResponse = {
  imageId: string;
  // 이미지 표시 순서(0부터)
  orderIndex: number;
  // 이미지 로딩 실패로 건너뛴 응답은 null이다.
  valence: ScaleValue | null;
  arousal: ScaleValue | null;
  // 이미지가 화면에 표시된 누적 시간(ms). 새로고침 전후 구간을 합산한다.
  responseMs: number;
  respondedAt: string;
  // 이미지를 불러오지 못해 건너뛴 경우 true
  skipped?: boolean;
};

export type MoodQuadrant =
  | "highEnergyNegative"
  | "highEnergyPositive"
  | "lowEnergyNegative"
  | "lowEnergyPositive";

export type MoodMeter = {
  quadrant: MoodQuadrant;
  emotion: string;
};

export type MoodPhase = "pre" | "post";

// 6x6 격자에서 선택한 한 칸(row, col은 1부터).
export type MoodCheck = MoodMeter & {
  row: number;
  col: number;
  checkedAt: string;
};

// 같은 탭에서 조사를 이어가기 위해 sessionStorage에 보관하는 진행 상태.
export type SurveySession = {
  sessionId: string;
  startedAt: string;
  participant: Participant;
  privacyConsent: PrivacyConsent | null;
  preMood: MoodCheck | null;
  // 세션 시작 시 한 번 확정한 이미지 표시 순서. 새로고침해도 바뀌지 않는다.
  imageOrder: string[] | null;
  responses: ImageResponse[];
  // 아직 응답하지 않은 현재 이미지의 누적 표시 시간(ms)
  currentImageElapsedMs: number;
  postMood: MoodCheck | null;
};

// 저장소(Supabase 등)로 보내는 최종 제출 데이터. 모든 항목이 같은 sessionId에 묶인다.
export type SurveySubmission = {
  sessionId: string;
  startedAt: string;
  completedAt: string;
  uiType: string;
  participant: Participant;
  privacyConsent: PrivacyConsent;
  preMood: MoodCheck;
  imageOrder: string[];
  responses: ImageResponse[];
  postMood: MoodCheck;
};

// 결과 화면 표시용 최소 요약. 저장 성공 후 진행 상태를 지워도 결과 화면이 쓸 수 있게 남긴다.
export type SurveyResultSummary = {
  sessionId: string;
  participantName: string;
  postMood: MoodCheck;
};

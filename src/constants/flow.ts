export const flowText = {
  guardLoading: "불러오는 중이에요.",
  guardRedirecting: "알맞은 단계로 이동하고 있어요.",
} as const;

export { moodGridSize } from "@/constants/mood";

// 조사 시작 안내(/ready)
export const readyText = {
  title: "자 그럼 마음을 보는 거울\n마인드 미러를 시작합니다!",
  description:
    "화면에 나오는 사진을 보고,\n처음 느껴지는 기분을 7단계 중에서 선택해 주세요.",
  startLabel: "시작하기",
} as const;

// 본조사 완료 안내(/done)
export const doneText = {
  title: "수고하셨습니다.\n모든 조사를 마쳤습니다.",
  description: "작성해 주신 내용으로\n마음의 거울을 준비해 볼게요.",
  continueLabel: "계속하기",
} as const;

// 최종 저장 흐름(/loading): 저장 중, 실패, 진행 정보 누락, 성공(조사 완료 안내)
export const saveText = {
  savingTitle: "응답을 저장하고 있어요...",
  savingDescription: "응답을 안전하게 저장 중이에요.\n조금만 기다려주세요.",
  failedTitle: "저장하지 못했어요.",
  failedDescription:
    "응답은 그대로 남아 있어요.\n네트워크를 확인한 뒤 다시 시도해 주세요.",
  invalidTitle: "저장할 응답을 찾지 못했어요.",
  invalidDescription:
    "진행 정보가 비어 있어 저장할 수 없어요.\n처음부터 다시 진행해 주세요.",
  rejectedTitle: "응답을 저장할 수 없어요.",
  rejectedDescription:
    "응답 형식이나 권한 확인에 실패했어요.\n처음부터 다시 진행해 주세요.",
  retryLabel: "다시 시도",
  savedTitle: "조사가 모두 완료되었어요.",
  savedDescription: "응답이 저장되었어요.\n참여해 주셔서 감사합니다.",
  restartLabel: "처음으로",
} as const;

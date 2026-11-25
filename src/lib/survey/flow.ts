import { routes } from "@/constants/routes";
import { validateParticipant } from "@/lib/validation/participant";
import type { SurveyResultSummary, SurveySession } from "@/types/survey";

export type SurveyRouteKey = keyof typeof routes;

// 화면 흐름 순서. 앞 단계의 필수 상태가 없으면 뒤 단계로 들어갈 수 없다.
const flowOrder: SurveyRouteKey[] = [
  "info",
  "moodPre",
  "ready",
  "test",
  "done",
  "moodPost",
  "loading",
  "result",
];

export function isParticipantComplete(session: SurveySession | null) {
  return (
    session !== null &&
    session.privacyConsent?.agreed === true &&
    Object.keys(validateParticipant(session.participant)).length === 0
  );
}

export function isTestComplete(session: SurveySession) {
  return (
    session.imageOrder !== null &&
    session.responses.length >= session.imageOrder.length
  );
}

// 현재 상태에서 들어갈 수 있는 가장 뒤쪽 단계의 흐름 순서 인덱스.
function reachableIndex(
  session: SurveySession | null,
  result: SurveyResultSummary | null,
) {
  if (result) {
    return flowOrder.indexOf("result");
  }
  if (!session || !isParticipantComplete(session)) {
    return flowOrder.indexOf("info");
  }
  if (!session.preMood) {
    return flowOrder.indexOf("moodPre");
  }
  if (!session.imageOrder) {
    return flowOrder.indexOf("ready");
  }
  if (!isTestComplete(session)) {
    return flowOrder.indexOf("test");
  }
  if (!session.postMood) {
    return flowOrder.indexOf("moodPost");
  }
  return flowOrder.indexOf("loading");
}

/**
 * 직접 진입한 라우트를 허용할지 판단한다. 허용하면 null, 아니면 이동할 경로를 반환한다.
 * - 필수 상태가 없는 단계로 들어오면 현재 진행 가능한 가장 뒤 단계로 보낸다.
 * - 본조사를 이미 끝냈다면 `/test`는 완료 안내(`/done`)로 보낸다.
 * - 결과가 만들어진 뒤 이전 단계로 들어오면 결과 화면으로 보낸다(세션은 정리된 상태).
 */
export function resolveRedirect(
  route: SurveyRouteKey,
  session: SurveySession | null,
  result: SurveyResultSummary | null,
): string | null {
  // 결과가 만들어진 뒤에는 /info(새 조사 시작)만 허용하고, 나머지 이전 단계는 결과 화면으로 보낸다.
  if (result && route !== "result" && route !== "info") {
    return routes.result;
  }
  const reachable = reachableIndex(session, result);
  const target = flowOrder.indexOf(route);
  if (target > reachable) {
    return routes[flowOrder[reachable]];
  }
  if (route === "test" && session && isTestComplete(session)) {
    return routes.done;
  }
  return null;
}

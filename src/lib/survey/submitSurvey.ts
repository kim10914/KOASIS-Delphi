import { surveyConfig } from "@/config/survey";
import { surveyRepository } from "@/lib/storage";
import {
  clearSession,
  loadSession,
  saveResult,
} from "@/lib/storage/surveySession";
import { isParticipantComplete, isTestComplete } from "@/lib/survey/flow";
import type { SurveySession, SurveySubmission } from "@/types/survey";

export function buildSubmission(
  session: SurveySession,
): SurveySubmission | null {
  if (
    !isParticipantComplete(session) ||
    !session.faceConsent ||
    !session.preMood ||
    !session.imageOrder ||
    !isTestComplete(session) ||
    !session.postMood
  ) {
    return null;
  }
  return {
    sessionId: session.sessionId,
    startedAt: session.startedAt,
    completedAt: new Date().toISOString(),
    uiType: surveyConfig.testUiType,
    participant: session.participant,
    faceConsent: session.faceConsent,
    preMood: session.preMood,
    imageOrder: session.imageOrder,
    responses: session.responses,
    postMood: session.postMood,
  };
}

export type SubmitSurveyOutcome = "saved" | "network-error" | "invalid";

let inFlight: Promise<SubmitSurveyOutcome> | null = null;

/**
 * 같은 세션의 모든 응답을 한 번에 저장한다.
 * 성공하면 결과 요약만 남기고 진행 상태(개인정보·응답)를 지운다.
 * 실패하면 아무것도 지우지 않으므로 같은 응답으로 다시 시도할 수 있다.
 * 동시에 여러 번 호출돼도(예: 개발 모드 이중 실행) 저장은 한 번만 진행한다.
 */
export function submitSurvey(): Promise<SubmitSurveyOutcome> {
  if (inFlight) {
    return inFlight;
  }
  const session = loadSession();
  const submission = session ? buildSubmission(session) : null;
  if (!session || !submission) {
    return Promise.resolve("invalid");
  }
  inFlight = surveyRepository
    .saveSubmission(submission)
    .then((): SubmitSurveyOutcome => {
      saveResult({
        sessionId: session.sessionId,
        participantName: session.participant.name,
        postMood: submission.postMood,
      });
      clearSession();
      return "saved";
    })
    .catch((): SubmitSurveyOutcome => "network-error")
    .finally(() => {
      inFlight = null;
    });
  return inFlight;
}

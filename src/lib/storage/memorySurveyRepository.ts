import type { SurveyRepository } from "@/lib/storage/surveyRepository";
import type { SurveySubmission } from "@/types/survey";

/**
 * 개발용 메모리 구현. 페이지를 새로고침하면 사라진다.
 * sessionId를 키로 덮어써서 재시도해도 중복 저장되지 않는다.
 */
export class MemorySurveyRepository implements SurveyRepository {
  private readonly submissions = new Map<string, SurveySubmission>();

  async saveSubmission(submission: SurveySubmission): Promise<void> {
    this.submissions.set(submission.sessionId, structuredClone(submission));
  }

  listSubmissions(): SurveySubmission[] {
    return [...this.submissions.values()];
  }
}

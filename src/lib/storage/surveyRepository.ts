import type { SurveySubmission } from "@/types/survey";

/**
 * 조사 결과 저장 인터페이스. Supabase 연동 시 이 인터페이스의 구현체만 교체한다.
 * 같은 sessionId로 여러 번 호출해도 결과가 중복되지 않아야 한다(재시도 허용).
 */
export interface SurveyRepository {
  saveSubmission(submission: SurveySubmission): Promise<void>;
}

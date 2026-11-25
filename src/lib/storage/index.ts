import { isSupabaseConfigured } from "@/config/supabase";
import { MemorySurveyRepository } from "@/lib/storage/memorySurveyRepository";
import { SupabaseSurveyRepository } from "@/lib/storage/supabaseSurveyRepository";
import type { SurveyRepository } from "@/lib/storage/surveyRepository";

// 환경변수가 없으면 개발 중에만 메모리 구현을 쓴다.
// 운영 빌드에서는 Supabase 구현을 그대로 써서 저장이 실패하면 오류로 안내되게 한다(거짓 성공 방지).
const useMemory =
  !isSupabaseConfigured && process.env.NODE_ENV !== "production";

export const surveyRepository: SurveyRepository = useMemory
  ? new MemorySurveyRepository()
  : new SupabaseSurveyRepository();

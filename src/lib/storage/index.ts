import { MemorySurveyRepository } from "@/lib/storage/memorySurveyRepository";
import type { SurveyRepository } from "@/lib/storage/surveyRepository";

// 백엔드 확정 전까지 메모리 구현을 사용한다.
export const surveyRepository: SurveyRepository = new MemorySurveyRepository();

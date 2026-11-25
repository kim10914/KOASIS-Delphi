// 클라이언트 번들에 포함되는 공개 값만 쓴다. service_role 키는 절대 넣지 않는다.
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  // 설문 전체를 한 트랜잭션으로 저장하는 RPC 함수 이름
  saveSubmissionRpc: "save_survey_submission",
} as const;

export const isSupabaseConfigured =
  supabaseConfig.url !== "" && supabaseConfig.anonKey !== "";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseConfig } from "@/config/supabase";
import type { SurveyRepository } from "@/lib/storage/surveyRepository";
import type { SurveySubmission } from "@/types/survey";

/**
 * Supabase 구현. 익명 인증 후 RPC 한 번으로 세션과 응답을 일괄 INSERT한다.
 * RPC가 ON CONFLICT DO NOTHING으로 멱등하므로 같은 sessionId 재시도가 안전하다.
 * 어느 단계든 실패하면 예외를 그대로 던진다(실패를 성공으로 처리하지 않는다).
 */
export class SupabaseSurveyRepository implements SurveyRepository {
  private client: SupabaseClient | null = null;

  // 클라이언트는 저장 시점에 만든다. 정적 export 빌드 중에는 생성되지 않는다.
  private getClient(): SupabaseClient {
    if (!this.client) {
      this.client = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
        auth: {
          // 인증 토큰도 탭 단위(sessionStorage)로만 보관한다.
          storage: window.sessionStorage,
          autoRefreshToken: true,
          persistSession: true,
        },
      });
    }
    return this.client;
  }

  private async ensureAnonymousSession(client: SupabaseClient) {
    const { data, error } = await client.auth.getSession();
    if (error) {
      throw error;
    }
    if (data.session) {
      return;
    }
    const result = await client.auth.signInAnonymously();
    if (result.error) {
      throw result.error;
    }
  }

  async saveSubmission(submission: SurveySubmission): Promise<void> {
    const client = this.getClient();
    await this.ensureAnonymousSession(client);
    const { error } = await client.rpc(supabaseConfig.saveSubmissionRpc, {
      p_submission: submission,
    });
    if (error) {
      throw error;
    }
  }
}

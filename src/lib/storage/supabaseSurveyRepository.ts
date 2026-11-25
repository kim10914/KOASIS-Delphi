import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabaseConfig } from "@/config/supabase";
import type { SurveyRepository } from "@/lib/storage/surveyRepository";
import type { SurveySubmission } from "@/types/survey";

const nonRetryableSqlPrefixes = ["22", "23", "42"] as const;

export class SurveySubmissionRejectedError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "SurveySubmissionRejectedError";
    this.code = code;
  }
}

function isNonRetryableCode(code: string | undefined): code is string {
  if (!code) {
    return false;
  }
  return nonRetryableSqlPrefixes.some((prefix) => code.startsWith(prefix));
}

function createSafeSessionStorage() {
  return {
    getItem(key: string) {
      try {
        return window.sessionStorage.getItem(key);
      } catch {
        return null;
      }
    },
    setItem(key: string, value: string) {
      try {
        window.sessionStorage.setItem(key, value);
      } catch {
        // 스토리지 접근이 막힌 환경에서도 저장 흐름은 이어간다.
      }
    },
    removeItem(key: string) {
      try {
        window.sessionStorage.removeItem(key);
      } catch {
        // 무시
      }
    },
  };
}

/**
 * Supabase 구현. 익명 인증 후 RPC 한 번으로 세션과 응답을 일괄 INSERT한다.
 * RPC가 ON CONFLICT DO NOTHING으로 멱등하므로 같은 sessionId 재시도가 안전하다.
 * 저장 성공 후에는 공용 기기에서 다음 참여자와 auth.uid()가 섞이지 않도록 로컬 세션을 정리한다.
 */
export class SupabaseSurveyRepository implements SurveyRepository {
  private client: SupabaseClient | null = null;

  // 클라이언트는 저장 시점에 만든다. 정적 export 빌드 중에는 생성되지 않는다.
  private getClient(): SupabaseClient {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
    }
    if (!this.client) {
      this.client = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
        auth: {
          // 인증 토큰도 탭 단위(sessionStorage)로만 보관한다.
          storage: createSafeSessionStorage(),
          autoRefreshToken: true,
          persistSession: true,
        },
      });
    }
    return this.client;
  }

  private async ensureAnonymousSession(client: SupabaseClient) {
    const { data, error } = await client.auth.getSession();
    if (!error && data.session) {
      return;
    }
    if (error) {
      await client.auth.signOut({ scope: "local" }).catch(() => {});
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
      if (isNonRetryableCode(error.code)) {
        throw new SurveySubmissionRejectedError(error.code, error.message);
      }
      throw error;
    }
    // 저장 성공 후에만 로컬 익명 세션을 비워 공용 기기에서 다음 참여자와 세션을 분리한다.
    await client.auth.signOut({ scope: "local" }).catch(() => {});
  }
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { flowText } from "@/constants/flow";
import { loadResult, loadSession } from "@/lib/storage/surveySession";
import { resolveRedirect } from "@/lib/survey/flow";
import type { SurveyRouteKey } from "@/lib/survey/flow";

type SurveyGuardProps = {
  route: SurveyRouteKey;
  children: ReactNode;
};

/**
 * 필수 상태 없이 직접 진입한 화면을 막는다. 진입 시점에 한 번만 검사한다.
 * (화면 안에서 응답을 저장하거나 세션을 정리하는 동작이 다시 리다이렉트를 일으키지 않도록)
 * 정적 export라 서버에서 검사할 수 없으므로 마운트 후 sessionStorage를 읽어 판단한다.
 */
const subscribeNoop = () => () => {};

export default function SurveyGuard({ route, children }: SurveyGuardProps) {
  const router = useRouter();
  // 정적 HTML에는 세션이 없으므로, 하이드레이션이 끝난 뒤에만 저장소를 읽어 판단한다.
  const hydrated = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
  const [decision, setDecision] = useState<{ redirectTo: string | null }>();

  if (hydrated && decision === undefined) {
    setDecision({
      redirectTo: resolveRedirect(route, loadSession(), loadResult()),
    });
  }

  const redirectTo = decision?.redirectTo ?? null;

  useEffect(() => {
    if (redirectTo) {
      router.replace(redirectTo);
    }
  }, [redirectTo, router]);

  if (decision && !redirectTo) {
    return children;
  }
  return (
    <main className="pageContainer items-center justify-center">
      <p role="status" className="text-base text-text-muted">
        {redirectTo ? flowText.guardRedirecting : flowText.guardLoading}
      </p>
    </main>
  );
}

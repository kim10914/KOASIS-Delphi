"use client";

import { useSyncExternalStore } from "react";
import {
  getResultServerSnapshot,
  loadResult,
  subscribeResult,
} from "@/lib/storage/surveySession";
import CompletionNotice from "@/views/flow/components/CompletionNotice";

/**
 * 결과지(/result)가 구현되기 전까지 저장 완료 안내만 보여주는 임시 화면.
 * 결과 산출 규칙이 미확정이므로 결과를 확정처럼 노출하지 않는다.
 */
export default function ResultStubScreen() {
  const result = useSyncExternalStore(
    subscribeResult,
    loadResult,
    getResultServerSnapshot,
  );

  return <CompletionNotice participantName={result?.participantName} />;
}

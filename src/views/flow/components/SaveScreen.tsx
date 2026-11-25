"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/Button";
import { saveText } from "@/constants/flow";
import { loadResult } from "@/lib/storage/surveySession";
import { submitSurvey } from "@/lib/survey/submitSurvey";
import CompletionNotice from "@/views/flow/components/CompletionNotice";
import FlowNotice from "@/views/flow/components/FlowNotice";

type SaveStatus = "saving" | "failed" | "saved";

/**
 * 사후 응답 제출 뒤 최종 저장을 진행한다.
 * - 저장 성공 응답을 받기 전에는 완료로 안내하지 않는다.
 * - 실패하면 세션을 지우지 않으므로 같은 응답으로 다시 시도할 수 있다.
 * - 저장 중에는 재시도 버튼이 없고, 호출 잠금과 submitSurvey의 진행 중 공유로 중복 제출을 막는다.
 */
export default function SaveScreen() {
  const [status, setStatus] = useState<SaveStatus>("saving");
  const savingRef = useRef(false);

  function save() {
    if (savingRef.current) {
      return;
    }
    savingRef.current = true;
    setStatus("saving");
    submitSurvey()
      .then((saved) => {
        setStatus(saved ? "saved" : "failed");
      })
      .finally(() => {
        savingRef.current = false;
      });
  }

  useEffect(() => {
    // 개발 모드에서 효과가 두 번 실행돼도 savingRef와 submitSurvey 공유로 저장은 한 번만 일어난다.
    save();
  }, []);

  if (status === "saved") {
    return <CompletionNotice participantName={loadResult()?.participantName} />;
  }

  if (status === "failed") {
    return (
      <FlowNotice
        role="alert"
        title={saveText.failedTitle}
        description={saveText.failedDescription}
      >
        <Button onClick={save}>{saveText.retryLabel}</Button>
      </FlowNotice>
    );
  }

  return (
    <FlowNotice
      role="status"
      title={saveText.savingTitle}
      description={saveText.savingDescription}
      icon={
        <span
          className="size-9 animate-spin rounded-full border-[3px] border-border border-t-text-strong"
          aria-hidden="true"
        />
      }
    />
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/Button";
import { saveText } from "@/constants/flow";
import { routes } from "@/constants/routes";
import { clearResult, clearSession } from "@/lib/storage/surveySession";
import { submitSurvey } from "@/lib/survey/submitSurvey";
import FlowNotice from "@/views/flow/components/FlowNotice";

type SaveStatus = "saving" | "network-error" | "rejected" | "invalid";

/**
 * 사후 응답 제출 뒤 최종 저장을 진행한다.
 * - 저장 성공 응답을 받기 전에는 완료로 안내하지 않으며, 성공 시 /result로 이동한다.
 * - 네트워크 오류 시 세션을 지우지 않으므로 같은 응답으로 다시 시도할 수 있다.
 * - 저장 중에는 재시도 버튼이 없고, 호출 잠금과 submitSurvey의 진행 중 공유로 중복 제출을 막는다.
 */
export default function SaveScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<SaveStatus>("saving");
  const savingRef = useRef(false);

  function save() {
    if (savingRef.current) {
      return;
    }
    savingRef.current = true;
    setStatus("saving");
    submitSurvey()
      .then((outcome) => {
        if (outcome === "saved") {
          router.replace(routes.result);
          return;
        }
        setStatus(outcome);
      })
      .finally(() => {
        savingRef.current = false;
      });
  }

  function handleRestart() {
    clearResult();
    clearSession();
    router.replace(routes.splash);
  }

  useEffect(() => {
    // 마운트 시 한 번만 저장을 시작한다(재시도는 버튼 클릭으로만 호출).
    // 개발 모드에서 효과가 두 번 실행돼도 savingRef와 submitSurvey 공유로 저장은 한 번만 일어난다.
    save();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "network-error") {
    return (
      <FlowNotice
        key="network-error"
        role="alert"
        focusOnMount
        title={saveText.failedTitle}
        description={saveText.failedDescription}
      >
        <Button onClick={save}>{saveText.retryLabel}</Button>
      </FlowNotice>
    );
  }

  if (status === "rejected") {
    return (
      <FlowNotice
        key="rejected"
        role="alert"
        focusOnMount
        title={saveText.rejectedTitle}
        description={saveText.rejectedDescription}
      >
        <Button onClick={handleRestart}>{saveText.restartLabel}</Button>
      </FlowNotice>
    );
  }

  if (status === "invalid") {
    return (
      <FlowNotice
        key="invalid"
        role="alert"
        focusOnMount
        title={saveText.invalidTitle}
        description={saveText.invalidDescription}
      >
        <Button onClick={handleRestart}>{saveText.restartLabel}</Button>
      </FlowNotice>
    );
  }

  return (
    <FlowNotice
      key="saving"
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

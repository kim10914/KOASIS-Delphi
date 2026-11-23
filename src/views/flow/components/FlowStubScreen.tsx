"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import Button from "@/components/Button";
import { flowText, stubScale, stubScreens } from "@/constants/flow";
import type { StubStage } from "@/constants/flow";
import { routes } from "@/constants/routes";
import {
  getResultServerSnapshot,
  getSessionServerSnapshot,
  loadResult,
  loadSession,
  startTest,
  submitImageResponse,
  subscribeResult,
  subscribeSession,
} from "@/lib/storage/surveySession";
import { createImageOrder } from "@/lib/survey/imageOrder";
import { submitSurvey } from "@/lib/survey/submitSurvey";
import { useImageTimer } from "@/lib/survey/useImageTimer";

type FlowStubScreenProps = {
  stage: StubStage;
};

function useSession() {
  return useSyncExternalStore(
    subscribeSession,
    loadSession,
    getSessionServerSnapshot,
  );
}

/**
 * 본조사, 결과지 화면이 구현되기 전까지 단계 이동과 세션 연결을 확인하기 위한 임시 화면.
 * 각 화면을 구현할 때 이 파일의 해당 단계를 실제 화면으로 교체한다.
 */
export default function FlowStubScreen({ stage }: FlowStubScreenProps) {
  const { title, description, nextLabel } = stubScreens[stage];
  const router = useRouter();
  const session = useSession();
  const result = useSyncExternalStore(
    subscribeResult,
    loadResult,
    getResultServerSnapshot,
  );
  const [saveFailed, setSaveFailed] = useState(false);
  const [saving, setSaving] = useState(stage === "loading");

  const order = session?.imageOrder ?? null;
  const index = session?.responses.length ?? 0;
  const currentImageId =
    stage === "test" && order ? (order[index] ?? null) : null;
  const { finish } = useImageTimer(currentImageId);

  useEffect(() => {
    if (stage !== "loading") {
      return;
    }
    let cancelled = false;
    submitSurvey().then((saved) => {
      if (cancelled) {
        return;
      }
      if (saved) {
        router.replace(routes.result);
        return;
      }
      setSaving(false);
      setSaveFailed(true);
    });
    return () => {
      cancelled = true;
    };
  }, [stage, router]);

  function retrySave() {
    setSaveFailed(false);
    setSaving(true);
    submitSurvey().then((saved) => {
      if (saved) {
        router.replace(routes.result);
        return;
      }
      setSaving(false);
      setSaveFailed(true);
    });
  }

  function handleNext() {
    switch (stage) {
      case "ready":
        startTest(createImageOrder());
        router.push(routes.test);
        return;
      case "test": {
        if (!order) {
          return;
        }
        submitImageResponse({
          valence: stubScale,
          arousal: stubScale,
          responseMs: finish(),
        });
        if (index + 1 >= order.length) {
          router.push(routes.done);
        }
        return;
      }
      case "done":
        router.push(routes.moodPost);
        return;
      case "result":
        router.replace(routes.splash);
        return;
      default:
        return;
    }
  }

  const heading =
    stage === "result" && result
      ? `${result.participantName} ${flowText.resultTitleSuffix}`
      : title;
  const detail =
    stage === "test" && order
      ? `${flowText.progress} ${index + 1} / ${order.length} (${currentImageId ?? ""})`
      : description;

  return (
    <main className="pageContainer justify-center gap-4">
      <h1 className="text-2xl font-bold break-keep">{heading}</h1>
      {detail ? <p className="text-text-muted break-keep">{detail}</p> : null}
      {stage === "loading" ? (
        <>
          {saving ? (
            <p role="status" className="text-text-muted">
              {flowText.saving}
            </p>
          ) : null}
          {saveFailed ? (
            <>
              <p role="alert" className="text-text-muted break-keep">
                {flowText.saveFailed}
              </p>
              <Button onClick={retrySave}>{flowText.retry}</Button>
            </>
          ) : null}
        </>
      ) : (
        <Button onClick={handleNext}>{nextLabel}</Button>
      )}
    </main>
  );
}

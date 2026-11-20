"use client";

import { useSyncExternalStore } from "react";
import AppHeader from "@/components/AppHeader";
import StepIndicator from "@/components/StepIndicator";
import { infoText } from "@/constants/info";
import { loadParticipant } from "@/lib/storage/surveySession";
import InfoForm from "@/views/info/components/InfoForm";
import type { Participant } from "@/types/survey";

const emptyParticipant: Participant = {
  name: "",
  birthDate: "",
  gender: "",
  job: "",
  region: "",
};

function subscribe() {
  return () => {};
}

export default function InfoScreen() {
  // 정적 export 하이드레이션 불일치를 피하려고 클라이언트 마운트 후에만 세션 값을 복원한다.
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  return (
    <main className="pageContainer">
      <AppHeader />
      <div className="mt-4 flex flex-col gap-6">
        <StepIndicator currentStep={1} />
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl leading-tight font-bold break-keep text-text-strong">
            {infoText.title}
          </h1>
          <p className="text-base break-keep text-text-muted">
            {infoText.privacyNotice}
          </p>
        </div>
        {isClient ? (
          <InfoForm initialValues={loadParticipant() ?? emptyParticipant} />
        ) : null}
      </div>
    </main>
  );
}

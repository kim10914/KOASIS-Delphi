"use client";

import { useSyncExternalStore } from "react";
import AppHeader from "@/components/AppHeader";
import StepIndicator from "@/components/StepIndicator";
import { infoText } from "@/constants/info";
import {
  clearParticipant,
  getParticipantServerSnapshot,
  loadParticipant,
  subscribeParticipant,
} from "@/lib/storage/surveySession";
import InfoForm from "@/views/info/components/InfoForm";
import type { Participant } from "@/types/survey";

const emptyParticipant: Participant = {
  name: "",
  birthDate: "",
  gender: "",
  job: "",
  region: "",
};

export default function InfoScreen() {
  // 정적 HTML에서도 폼이 바로 렌더링되도록 서버 스냅샷은 빈 값으로 두고, 마운트 후에만 저장 값을 반영한다.
  const savedParticipant = useSyncExternalStore(
    subscribeParticipant,
    loadParticipant,
    getParticipantServerSnapshot,
  );
  const initialValues = savedParticipant ?? emptyParticipant;
  const formKey = savedParticipant ? "restored" : "empty";

  return (
    <main className="pageContainer pt-[env(safe-area-inset-top)]">
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
        {savedParticipant ? (
          <div className="flex items-center justify-between gap-3 rounded-[var(--radius-input)] bg-surface-muted px-4 py-2 text-sm text-text-strong">
            <span className="break-keep">{infoText.restoredNotice}</span>
            <button
              type="button"
              onClick={clearParticipant}
              className="min-h-11 shrink-0 px-1 font-semibold text-text-strong underline underline-offset-4"
            >
              {infoText.clearSaved}
            </button>
          </div>
        ) : null}
        <InfoForm key={formKey} initialValues={initialValues} />
      </div>
    </main>
  );
}

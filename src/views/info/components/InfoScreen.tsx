"use client";

import { useSyncExternalStore } from "react";
import AppHeader from "@/components/AppHeader";
import StepIndicator from "@/components/StepIndicator";
import { infoStep } from "@/constants/info";
import { loadParticipant } from "@/lib/storage/participant";
import type { Participant } from "@/types/survey";
import InfoForm from "./InfoForm";

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

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export default function InfoScreen() {
  const isClient = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  return (
    <main className="pageContainer pt-[env(safe-area-inset-top)]">
      <AppHeader />
      <div className="mt-6">
        <StepIndicator currentStep={infoStep} />
      </div>
      <div className="mt-8 flex flex-1 flex-col">
        {isClient ? (
          <InfoForm
            initialParticipant={loadParticipant() ?? emptyParticipant}
          />
        ) : null}
      </div>
    </main>
  );
}

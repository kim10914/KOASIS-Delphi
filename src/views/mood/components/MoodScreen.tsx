"use client";

import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import AppHeader from "@/components/AppHeader";
import Button from "@/components/Button";
import MoodGrid from "@/components/MoodGrid";
import StepIndicator from "@/components/StepIndicator";
import { findMoodCell, moodScreenText, moodStep } from "@/constants/mood";
import type { MoodCell } from "@/constants/mood";
import { routes } from "@/constants/routes";
import {
  getSessionServerSnapshot,
  loadSession,
  saveMood,
  subscribeSession,
} from "@/lib/storage/surveySession";
import type { MoodPhase } from "@/types/survey";

type MoodScreenProps = {
  phase: MoodPhase;
};

const nextRoute: Record<MoodPhase, string> = {
  pre: routes.ready,
  post: routes.loading,
};

export default function MoodScreen({ phase }: MoodScreenProps) {
  const session = useSyncExternalStore(
    subscribeSession,
    loadSession,
    getSessionServerSnapshot,
  );
  const stored = phase === "pre" ? session?.preMood : session?.postMood;
  const storedKey = stored ? `${stored.row}-${stored.col}` : "none";
  const initialCell = stored ? findMoodCell(stored.row, stored.col) : undefined;

  // 저장된 선택이 클라이언트에서 확인되면 key가 바뀌어 선택 상태가 그 값으로 다시 시작된다.
  return (
    <MoodForm key={storedKey} phase={phase} initialCell={initialCell ?? null} />
  );
}

type MoodFormProps = {
  phase: MoodPhase;
  initialCell: MoodCell | null;
};

function MoodForm({ phase, initialCell }: MoodFormProps) {
  const router = useRouter();
  const [cell, setCell] = useState<MoodCell | null>(initialCell);
  const [submitted, setSubmitted] = useState(false);
  const text = moodScreenText[phase];

  function handleSubmit() {
    if (!cell || submitted) {
      return;
    }
    setSubmitted(true);
    saveMood(phase, {
      row: cell.row,
      col: cell.col,
      emotion: cell.emotion,
      quadrant: cell.quadrant,
      checkedAt: new Date().toISOString(),
    });
    router.push(nextRoute[phase]);
  }

  return (
    <main className="pageContainer pt-[env(safe-area-inset-top)]">
      <AppHeader />
      <div className="mt-4 flex flex-col gap-6 pb-8">
        {text.showStepIndicator ? (
          <StepIndicator currentStep={moodStep} />
        ) : null}
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl leading-tight font-bold break-keep text-text-strong">
            {text.title}
          </h1>
          <p className="text-base leading-relaxed break-keep whitespace-pre-line text-text-muted">
            {text.description}
          </p>
        </div>
        <MoodGrid selected={cell} onSelect={setCell} disabled={submitted} />
        {text.selectedSummary ? (
          <p
            aria-live="polite"
            className="min-h-14 text-xl leading-snug font-bold break-keep text-text-strong"
          >
            {cell ? text.selectedSummary(cell.emotion) : null}
          </p>
        ) : null}
        <Button disabled={!cell || submitted} onClick={handleSubmit}>
          {text.submitLabel}
        </Button>
      </div>
    </main>
  );
}

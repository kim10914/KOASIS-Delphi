"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import Button from "@/components/Button";
import StepIndicator from "@/components/StepIndicator";
import { routes } from "@/constants/routes";
import { saveConsent } from "@/lib/surveySession";

export default function ConsentForm() {
  const router = useRouter();
  const [agreedTerms, setAgreedTerms] = useState(false);

  // faceRecording: true  → 동의하고 시작하기
  // faceRecording: false → 오늘은 조사만 하기
  const submitConsent = (faceRecording: boolean) => {
    if (!agreedTerms) {
      return;
    }

    saveConsent({ terms: true, faceRecording });
    router.push(routes.moodPre);
  };

  return (
    <main className="pageContainer gap-6 pb-6">
      <AppHeader title="동의" />
      <StepIndicator current={2} total={2} />

      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">참여 화면도 기록해볼까요?</h2>
        <p className="text-text-muted">
          표정 기록에 동의하시면 조사 중 참여 화면이 함께 기록됩니다. 원하지
          않으시면 조사만 진행할 수 있어요.
        </p>
      </div>

      <label className="flex items-start gap-3 rounded-[var(--radius-button)] border border-border p-4">
        <input
          type="checkbox"
          checked={agreedTerms}
          onChange={(event) => setAgreedTerms(event.target.checked)}
          className="mt-0.5 h-5 w-5 accent-[var(--color-primary)]"
        />
        <span className="text-sm">
          <strong className="font-semibold">[필수]</strong> 이용약관 및 개인정보
          수집·이용에 동의합니다.
        </span>
      </label>

      <div className="mt-auto flex flex-col gap-3 pt-6">
        <Button disabled={!agreedTerms} onClick={() => submitConsent(true)}>
          동의하고 시작하기
        </Button>
        <Button
          variant="secondary"
          disabled={!agreedTerms}
          onClick={() => submitConsent(false)}
        >
          오늘은 조사만 하기
        </Button>
      </div>
    </main>
  );
}

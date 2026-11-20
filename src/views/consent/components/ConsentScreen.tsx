"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import Button from "@/components/Button";
import StepIndicator from "@/components/StepIndicator";
import { consentStep, consentText } from "@/constants/consent";
import { routes } from "@/constants/routes";
import { saveFaceConsent } from "@/lib/storage/surveySession";

export default function ConsentScreen() {
  const router = useRouter();
  const [termsAgreed, setTermsAgreed] = useState(false);

  function handleAgree() {
    saveFaceConsent(true);
    router.push(routes.moodPre);
  }

  function handleSurveyOnly() {
    saveFaceConsent(false);
    router.push(routes.moodPre);
  }

  return (
    <main className="pageContainer pt-[env(safe-area-inset-top)]">
      <AppHeader />
      <div className="mt-4 flex flex-col gap-6">
        <StepIndicator currentStep={consentStep} />
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl leading-tight font-bold break-keep text-text-strong">
            {consentText.title}
          </h1>
          <p className="text-base leading-relaxed break-keep text-text-muted">
            {consentText.description}
          </p>
        </div>
        <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-text-strong">
          <input
            type="checkbox"
            checked={termsAgreed}
            onChange={(event) => setTermsAgreed(event.target.checked)}
            className="size-5 shrink-0 cursor-pointer rounded-[4px] accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          />
          <span>{consentText.termsLabel}</span>
        </label>
        <Button disabled={!termsAgreed} onClick={handleAgree}>
          {consentText.agreeButton}
        </Button>
        <section className="mt-10 flex flex-col gap-5 pb-8">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl leading-tight font-bold break-keep text-text-strong">
              {consentText.optionalTitle}
            </h2>
            <p className="text-base leading-relaxed break-keep text-text-muted">
              {consentText.optionalDescription}
            </p>
          </div>
          <Button onClick={handleSurveyOnly}>
            {consentText.surveyOnlyButton}
          </Button>
        </section>
      </div>
    </main>
  );
}

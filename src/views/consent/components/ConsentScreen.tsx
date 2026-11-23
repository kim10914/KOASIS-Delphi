"use client";

import { useRouter } from "next/navigation";
import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import AppHeader from "@/components/AppHeader";
import Button from "@/components/Button";
import StepIndicator from "@/components/StepIndicator";
import { consentStep, consentText } from "@/constants/consent";
import { routes } from "@/constants/routes";
import {
  getFaceConsentServerSnapshot,
  loadFaceConsent,
  saveFaceConsent,
  subscribeFaceConsent,
} from "@/lib/storage/surveySession";

export default function ConsentScreen() {
  const faceConsent = useSyncExternalStore(
    subscribeFaceConsent,
    loadFaceConsent,
    getFaceConsentServerSnapshot,
  );
  const storedAgreed = faceConsent?.agreed === true;

  // 저장된 동의가 클라이언트에서 확인되면 key가 바뀌어 폼 상태가 그 값으로 다시 시작된다.
  return (
    <ConsentForm key={String(storedAgreed)} initialAgreed={storedAgreed} />
  );
}

type ConsentFormProps = {
  initialAgreed: boolean;
};

function ConsentForm({ initialAgreed }: ConsentFormProps) {
  const router = useRouter();
  const termsId = useId();
  const [termsAgreed, setTermsAgreed] = useState(initialAgreed);
  const [showTerms, setShowTerms] = useState(false);
  const [showPreparingToast, setShowPreparingToast] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  function handleAgree() {
    setShowPreparingToast(true);
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setShowPreparingToast(false);
    }, 3000);
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
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-text-strong">
              <input
                type="checkbox"
                checked={termsAgreed}
                onChange={(event) => setTermsAgreed(event.target.checked)}
                className="size-5 shrink-0 cursor-pointer accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              />
              <span>{consentText.termsLabel}</span>
            </label>
            <button
              type="button"
              aria-expanded={showTerms}
              aria-controls={termsId}
              onClick={() => setShowTerms((prev) => !prev)}
              className="min-h-11 shrink-0 cursor-pointer px-2 text-sm text-text-muted underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {showTerms
                ? consentText.termsToggleClose
                : consentText.termsToggleOpen}
            </button>
          </div>
          <div
            id={termsId}
            hidden={!showTerms}
            className="flex flex-col gap-2 rounded-lg bg-black/5 p-4 text-sm leading-relaxed break-keep text-text-muted"
          >
            <h2 className="font-bold text-text-strong">
              {consentText.termsTitle}
            </h2>
            <ul className="list-disc pl-5">
              {consentText.termsItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
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
      {showPreparingToast ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-[398px] -translate-x-1/2 rounded-xl bg-text-strong px-4 py-3 text-center text-sm font-medium break-keep text-white shadow-lg"
        >
          {consentText.preparingToast}
        </div>
      ) : null}
    </main>
  );
}

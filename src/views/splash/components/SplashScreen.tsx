"use client";

import { useEffect, useState } from "react";
import { splashConfig } from "@/config/survey";
import { splashSteps, splashText, type SplashStep } from "@/constants/splash";
import SplashBackground from "./SplashBackground";
import SplashBrand from "./SplashBrand";
import SplashIntro from "./SplashIntro";

export default function SplashScreen() {
  const [step, setStep] = useState<SplashStep>(splashSteps.logo);

  useEffect(() => {
    if (step === splashSteps.intro) {
      return;
    }
    const duration =
      step === splashSteps.logo
        ? splashConfig.logoDurationMs
        : splashConfig.subtitleDurationMs;
    const nextStep =
      step === splashSteps.logo ? splashSteps.subtitle : splashSteps.intro;
    const timerId = setTimeout(() => setStep(nextStep), duration);
    return () => clearTimeout(timerId);
  }, [step]);

  const isIntro = step === splashSteps.intro;

  return (
    <main className="pageContainer relative overflow-hidden bg-black! pt-[env(safe-area-inset-top)]">
      <SplashBackground />
      <div
        className={`relative flex flex-1 flex-col items-center ${
          isIntro ? "justify-start pt-[22dvh]" : "justify-center"
        }`}
      >
        <SplashBrand showSubtitle={step !== splashSteps.logo} />
        {isIntro ? (
          <div className="mt-auto w-full pt-10">
            <SplashIntro />
          </div>
        ) : null}
      </div>
      <p className="relative py-6 text-center text-sm text-white/70">
        {step === splashSteps.logo ? " " : splashText.copyright}
      </p>
    </main>
  );
}

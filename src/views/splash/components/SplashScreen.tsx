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
  const showMeta = step !== splashSteps.logo;

  return (
    <main className="pageContainer relative overflow-hidden bg-black! pt-[env(safe-area-inset-top)]">
      <SplashBackground isIntro={isIntro} />
      <div className="relative flex flex-1 flex-col items-center pt-[clamp(48px,18dvh,160px)]">
        <div
          className={`transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
            isIntro ? "translate-y-0" : "translate-y-[14dvh]"
          }`}
        >
          <SplashBrand showSubtitle={showMeta} />
        </div>
        <div
          aria-hidden={!isIntro}
          className={`mt-auto w-full pt-8 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
            isIntro
              ? "translate-y-0 opacity-100 delay-150"
              : "pointer-events-none translate-y-6 opacity-0"
          }`}
        >
          <SplashIntro isActive={isIntro} />
        </div>
      </div>
      <p
        aria-hidden={!showMeta}
        className={`relative py-6 text-center text-sm text-white/70 transition-opacity duration-500 ease-out motion-reduce:transition-none ${
          showMeta ? "opacity-100" : "opacity-0"
        }`}
      >
        {splashText.copyright}
      </p>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { routes } from "@/constants/routes";

// 0: 로고, 1: 서브 문구, 2: 시작하기
type SplashStage = 0 | 1 | 2;

const STAGE_DELAY_MS = 1500;

export default function SplashSequence() {
  const [stage, setStage] = useState<SplashStage>(0);

  useEffect(() => {
    if (stage >= 2) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setStage((prev) => (prev === 0 ? 1 : 2));
    }, STAGE_DELAY_MS);

    return () => window.clearTimeout(timerId);
  }, [stage]);

  const handleSkip = () => {
    setStage(2);
  };

  return (
    <main
      className="pageContainer items-center justify-center gap-6 text-center"
      onClick={stage < 2 ? handleSkip : undefined}
    >
      <div className="flex flex-col items-center gap-3">
        {/* 로고 에셋 확정 전 텍스트 로고 */}
        <h1 className="bg-gradient-to-r from-[var(--color-primary-gradient-from)] to-[var(--color-primary-gradient-to)] bg-clip-text text-4xl font-extrabold text-transparent">
          Mind Mirror
        </h1>
        <p className="text-sm text-text-muted">마음을 보는 거울, 마인드 미러</p>
      </div>

      <p
        aria-hidden={stage < 1}
        className={`text-lg font-medium transition-opacity duration-700 ${
          stage >= 1 ? "opacity-100" : "opacity-0"
        }`}
      >
        지금 내 마음을 알아볼까요?
      </p>

      <div
        aria-hidden={stage < 2}
        className={`w-full transition-opacity duration-700 ${
          stage >= 2 ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <Link
          href={routes.info}
          tabIndex={stage >= 2 ? 0 : -1}
          className="flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] bg-primary text-base font-semibold text-white"
        >
          시작하기
        </Link>
      </div>
    </main>
  );
}

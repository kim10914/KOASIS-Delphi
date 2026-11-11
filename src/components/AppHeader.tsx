"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

type AppHeaderProps = {
  title?: string;
  // 지정하지 않으면 router.back()으로 동작한다.
  onBack?: () => void;
  showBack?: boolean;
  right?: ReactNode;
};

export default function AppHeader({
  title,
  onBack,
  showBack = true,
  right,
}: AppHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    router.back();
  };

  return (
    <header className="grid h-14 grid-cols-[48px_1fr_48px] items-center">
      {showBack ? (
        <button
          type="button"
          aria-label="뒤로 가기"
          onClick={handleBack}
          className="flex h-12 w-12 items-center justify-center text-2xl"
        >
          ‹
        </button>
      ) : (
        <span />
      )}
      <h1 className="truncate text-center text-base font-semibold">{title}</h1>
      <div className="flex justify-end">{right}</div>
    </header>
  );
}

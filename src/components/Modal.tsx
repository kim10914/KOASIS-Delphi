"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

/**
 * 하단 시트형 공통 모달. 최대 폭 430px, 배경 클릭·Esc로 닫는다.
 */
export default function Modal({ open, title, onClose, children }: ModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    panelRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
      <div aria-hidden="true" className="absolute inset-0" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="bg-surface text-text-strong relative w-full max-w-[430px] rounded-t-[var(--radius-card)] px-5 pt-7 pb-[max(24px,env(safe-area-inset-bottom))] shadow-[var(--shadow-card)] outline-none"
      >
        <h2 id={titleId} className="text-xl leading-snug font-semibold">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}

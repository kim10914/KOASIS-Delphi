"use client";

import {
  useEffect,
  useId,
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

/**
 * 하단 시트형 공통 모달. 네이티브 dialog(showModal)로 포커스 트랩·Esc·배경 비활성을 처리한다.
 */
export default function Modal({ open, title, onClose, children }: ModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }
    if (open) {
      if (!dialog.open) {
        dialog.showModal();
      }
      return;
    }
    if (dialog.open) {
      dialog.close();
    }
  }, [open]);

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) {
      onCloseRef.current();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onCloseRef.current();
      }}
      onClick={handleBackdropClick}
      className="bg-surface text-text-strong fixed inset-0 mx-auto mt-auto mb-0 w-full max-w-[430px] rounded-t-[var(--radius-card)] border-0 p-0 shadow-[var(--shadow-card)] outline-none backdrop:bg-black/50"
    >
      <div className="px-5 pt-7 pb-[max(24px,env(safe-area-inset-bottom))]">
        <h2 id={titleId} className="text-xl leading-snug font-semibold">
          {title}
        </h2>
        {children}
      </div>
    </dialog>
  );
}

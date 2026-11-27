import type { ReactNode } from "react";

type FormFieldProps = {
  id: string;
  label: string;
  messageId: string;
  error?: string;
  helperText?: string;
  children: ReactNode;
};

const messageClassName =
  "animate-message-in text-sm motion-reduce:animate-none";

/**
 * Input, Select 등 폼 컨트롤의 라벨과 오류·안내 문구 마크업을 공통으로 제공한다.
 */
export default function FormField({
  id,
  label,
  messageId,
  error,
  helperText,
  children,
}: FormFieldProps) {
  const hasError = Boolean(error);
  const message = error || helperText;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-bold text-text-strong">
        {label}
      </label>
      {children}
      {message ? (
        hasError ? (
          <p
            key="error"
            id={messageId}
            role="alert"
            className={`${messageClassName} text-error`}
          >
            {message}
          </p>
        ) : (
          <p
            key="helper"
            id={messageId}
            className={`${messageClassName} text-text-muted`}
          >
            {message}
          </p>
        )
      ) : null}
    </div>
  );
}

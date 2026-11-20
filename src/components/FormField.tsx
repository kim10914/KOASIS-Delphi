import type { ReactNode } from "react";

type FormFieldProps = {
  id: string;
  label: string;
  messageId: string;
  error?: string;
  helperText?: string;
  children: ReactNode;
};

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
          <p id={messageId} role="alert" className="text-sm text-error">
            {message}
          </p>
        ) : (
          <p id={messageId} className="text-sm text-text-muted">
            {message}
          </p>
        )
      ) : null}
    </div>
  );
}

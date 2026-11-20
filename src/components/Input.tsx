import { useId } from "react";
import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  helperText?: string;
};

export default function Input({
  label,
  error,
  helperText,
  id,
  className = "",
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  const message = error ?? helperText;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-sm font-bold text-text-strong">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        className={`h-14 w-full rounded-xl border bg-surface px-5 text-base text-text-strong outline-none placeholder:text-text-muted/70 focus:border-text-strong disabled:bg-surface-muted ${
          error ? "border-error" : "border-border"
        } ${className}`}
        {...props}
      />
      {message ? (
        <p
          id={messageId}
          className={`text-sm ${error ? "text-error" : "text-text-muted"}`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}

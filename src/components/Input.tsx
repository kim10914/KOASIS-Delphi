import { useId } from "react";
import type { InputHTMLAttributes } from "react";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  label: string;
  error?: string;
  helperText?: string;
};

export default function Input({
  label,
  error,
  helperText,
  className = "",
  ...props
}: InputProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const hasMessage = Boolean(error || helperText);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={hasMessage ? messageId : undefined}
        className={`h-14 rounded-[var(--radius-button)] border bg-surface px-4 text-base outline-none focus:border-primary ${
          error ? "border-red-500" : "border-border"
        } ${className}`}
        {...props}
      />
      {error ? (
        <p id={messageId} role="alert" className="text-sm text-red-500">
          {error}
        </p>
      ) : null}
      {!error && helperText ? (
        <p id={messageId} className="text-sm text-text-muted">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

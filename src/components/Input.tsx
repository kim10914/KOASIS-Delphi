import { useId } from "react";
import type { InputHTMLAttributes } from "react";
import FormField from "@/components/FormField";

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
  "aria-describedby": ariaDescribedBy,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  const hasMessage = Boolean(error || helperText);
  const describedBy =
    [hasMessage ? messageId : undefined, ariaDescribedBy]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <FormField
      id={inputId}
      label={label}
      messageId={messageId}
      error={error}
      helperText={helperText}
    >
      <input
        id={inputId}
        className={`h-14 w-full rounded-[var(--radius-input)] border bg-surface px-5 text-base text-text-strong outline-none transition-[border-color,box-shadow,background-color] duration-[var(--duration-fast)] ease-out placeholder:text-text-muted focus:ring-1 disabled:bg-surface-muted ${
          error
            ? "border-error ring-error focus:border-error"
            : "border-border ring-text-strong focus:border-text-strong"
        } ${className}`}
        {...props}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
      />
    </FormField>
  );
}

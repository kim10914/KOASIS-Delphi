"use client";

import { useId, useState } from "react";
import type { ChangeEvent, SelectHTMLAttributes } from "react";
import FormField from "@/components/FormField";

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  helperText?: string;
};

export default function Select({
  label,
  options,
  placeholder,
  error,
  helperText,
  id,
  className = "",
  value,
  defaultValue,
  onChange,
  "aria-describedby": ariaDescribedBy,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const messageId = `${selectId}-message`;
  const [hasUncontrolledValue, setHasUncontrolledValue] = useState(
    Boolean(defaultValue),
  );
  const isControlled = value !== undefined;
  const isEmpty = isControlled ? value === "" : !hasUncontrolledValue;
  const showPlaceholderColor = Boolean(placeholder) && isEmpty;
  const hasMessage = Boolean(error || helperText);
  const describedBy =
    [hasMessage ? messageId : undefined, ariaDescribedBy]
      .filter(Boolean)
      .join(" ") || undefined;
  const valueProps = isControlled
    ? { value }
    : { defaultValue: defaultValue ?? (placeholder ? "" : undefined) };

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    if (!isControlled) {
      setHasUncontrolledValue(event.target.value !== "");
    }
    onChange?.(event);
  }

  return (
    <FormField
      id={selectId}
      label={label}
      messageId={messageId}
      error={error}
      helperText={helperText}
    >
      <div className="relative">
        <select
          id={selectId}
          className={`h-14 w-full appearance-none rounded-[var(--radius-input)] border bg-surface pr-12 pl-5 text-base outline-none disabled:bg-surface-muted ${
            showPlaceholderColor ? "text-text-muted/70" : "text-text-strong"
          } ${
            error
              ? "border-error focus:border-error"
              : "border-border focus:border-text-strong"
          } ${className}`}
          {...valueProps}
          {...props}
          onChange={handleChange}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute top-1/2 right-5 -translate-y-1/2 text-text-muted"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </FormField>
  );
}

import { useId } from "react";
import type { SelectHTMLAttributes } from "react";

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
  ...props
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const messageId = `${selectId}-message`;
  const message = error ?? helperText;
  const isEmpty = value !== undefined ? value === "" : !defaultValue;
  const valueProps =
    value !== undefined ? { value } : { defaultValue: defaultValue ?? "" };
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={selectId} className="text-sm font-bold text-text-strong">
        {label}
      </label>
      <div className="relative">
        <select
          id={selectId}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className={`h-14 w-full appearance-none rounded-xl border bg-surface pr-12 pl-5 text-base outline-none focus:border-text-strong disabled:bg-surface-muted ${
            isEmpty ? "text-text-muted/70" : "text-text-strong"
          } ${error ? "border-error" : "border-border"} ${className}`}
          {...valueProps}
          {...props}
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

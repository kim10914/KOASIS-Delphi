import type { ButtonHTMLAttributes } from "react";
import { buttonText } from "@/constants/ui";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
};

const buttonBaseClassName =
  "flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] text-base font-semibold transition-[color,background-color,border-color,box-shadow,transform,scale] duration-150 ease-out not-disabled:active:scale-[0.98] motion-reduce:transition-none motion-reduce:not-disabled:active:scale-100";

export const primaryButtonClassName = `${buttonBaseClassName} bg-primary text-white`;

const variantClassName: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white disabled:bg-disabled disabled:text-white",
  secondary:
    "border border-border bg-surface text-text-strong shadow-[var(--shadow-button)] disabled:border-border disabled:bg-surface-muted disabled:text-text-muted",
};

/**
 * 공통 버튼 컴포넌트.
 * 기본 `type`은 `"button"`이므로 `<form>` 제출 버튼으로 쓸 때는 `type="submit"`을 명시한다.
 */
export default function Button({
  variant = "primary",
  loading = false,
  disabled,
  type = "button",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${buttonBaseClassName} ${variantClassName[variant]} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <>
          <span
            className="size-5 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
          <span className="sr-only">{buttonText.loadingLabel}</span>
        </>
      ) : null}
      {children}
    </button>
  );
}

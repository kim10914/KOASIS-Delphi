import type { ButtonHTMLAttributes } from "react";
import { buttonText } from "@/constants/ui";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
};

const variantClassName: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white disabled:bg-disabled disabled:text-white",
  secondary:
    "border border-border bg-surface text-text-strong shadow-[0_1px_2px_rgb(0_0_0/0.04)] disabled:text-text-muted",
};

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
      className={`flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] text-base font-semibold ${variantClassName[variant]} ${className}`}
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

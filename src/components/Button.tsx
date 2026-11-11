import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
};

const variantClassName: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white disabled:bg-disabled disabled:text-white",
  secondary:
    "border border-border bg-surface text-text-strong disabled:text-text-muted",
  ghost: "bg-transparent text-text-muted disabled:opacity-50",
};

export default function Button({
  variant = "primary",
  loading = false,
  type = "button",
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] text-base font-semibold transition-opacity active:opacity-80 disabled:cursor-not-allowed ${variantClassName[variant]} ${className}`}
      {...props}
    >
      {loading ? "잠시만 기다려주세요..." : children}
    </button>
  );
}

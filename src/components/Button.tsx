import type { ButtonHTMLAttributes } from "react";

export const primaryButtonClassName =
  "flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] bg-primary text-base font-semibold text-white";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`${primaryButtonClassName} disabled:bg-disabled ${className}`}
      {...props}
    />
  );
}

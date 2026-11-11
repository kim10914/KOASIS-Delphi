import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`h-14 w-full rounded-[var(--radius-button)] bg-primary text-base font-semibold text-white disabled:bg-disabled ${className}`}
      {...props}
    />
  );
}

import Link from "next/link";
import { routes } from "@/constants/routes";
import { splashText } from "@/constants/splash";

export default function SplashIntro() {
  return (
    <div className="flex flex-col items-center text-center text-white">
      <h1 className="text-[28px] leading-snug font-semibold">
        {splashText.introTitleLines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h1>
      <p className="mt-3 text-base">{splashText.introDescription}</p>
      <Link
        href={routes.info}
        className="mt-8 flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] bg-primary text-base font-semibold text-white"
      >
        {splashText.startLabel}
      </Link>
    </div>
  );
}

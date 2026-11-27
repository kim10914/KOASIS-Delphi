import Link from "next/link";
import { primaryButtonClassName } from "@/components/Button";
import { routes } from "@/constants/routes";
import { splashText } from "@/constants/splash";

export default function SplashIntro() {
  return (
    <div className="flex flex-col items-center px-3 text-center text-white">
      <h1 className="text-[28px] leading-snug font-semibold">
        {splashText.introTitleLines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h1>
      <p className="mt-3 text-base">{splashText.introDescription}</p>
      <Link href={routes.info} className={`${primaryButtonClassName} mt-8`}>
        {splashText.startLabel}
      </Link>
    </div>
  );
}

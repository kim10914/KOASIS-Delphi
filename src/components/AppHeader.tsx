import Image from "next/image";
import { appHeaderText } from "@/constants/ui";

export default function AppHeader() {
  return (
    <header className="flex h-14 items-center justify-between">
      <div className="flex items-center gap-2">
        <Image
          src={appHeaderText.logoSrc}
          alt={appHeaderText.logoAlt}
          width={28}
          height={19}
          preload
        />
        <span className="text-xl font-bold text-text-strong">
          {appHeaderText.wordmark}
        </span>
      </div>
      <button
        type="button"
        disabled
        aria-disabled="true"
        aria-label={appHeaderText.menuLabel}
        className="flex size-11 items-center justify-center text-text-strong"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>
    </header>
  );
}

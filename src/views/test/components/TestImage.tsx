import Image from "next/image";
import { useState } from "react";
import Button from "@/components/Button";
import { getImageSrc } from "@/constants/images";
import { testText } from "@/constants/test";

type TestImageProps = {
  imageId: string;
  // 이미지가 화면에 완전히 표시된 시점에 호출한다. 응답 시간 측정 시작점으로 쓴다.
  onDisplayed: () => void;
};

type LoadState = "loading" | "loaded" | "error";

/**
 * 이미지 카드. imageId가 바뀌면 부모가 key로 다시 마운트하므로 상태가 초기화된다.
 * 오류 시 attempt를 올려 <Image>를 새로 마운트해 재시도한다.
 */
export default function TestImage({ imageId, onDisplayed }: TestImageProps) {
  const [state, setState] = useState<LoadState>("loading");
  const [attempt, setAttempt] = useState(0);

  function handleRetry() {
    setState("loading");
    setAttempt((value) => value + 1);
  }

  return (
    <div className="relative aspect-[5/4] w-full overflow-hidden rounded-2xl bg-surface-muted">
      {state !== "error" ? (
        <Image
          key={attempt}
          src={getImageSrc(imageId)}
          alt={testText.imageAlt}
          fill
          unoptimized
          sizes="430px"
          className={`object-cover transition-opacity ${state === "loaded" ? "opacity-100" : "opacity-0"}`}
          onLoad={() => {
            setState("loaded");
            onDisplayed();
          }}
          onError={() => setState("error")}
        />
      ) : null}
      {state === "loading" ? (
        <p
          role="status"
          className="absolute inset-0 flex animate-pulse items-center justify-center text-sm text-text-muted"
        >
          {testText.imageLoading}
        </p>
      ) : null}
      {state === "error" ? (
        <div
          role="alert"
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center"
        >
          <p className="text-sm text-text-muted">{testText.imageError}</p>
          <Button
            variant="secondary"
            onClick={handleRetry}
            className="h-11 w-auto px-5"
          >
            {testText.imageRetry}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/Button";
import { getImageSrc } from "@/constants/images";
import { imageMaxRetries, testText } from "@/constants/test";

type TestImageProps = {
  imageId: string;
  // 이미지가 화면에 그려진 시점에 호출한다. 응답 시간 측정 시작점으로 쓴다.
  onDisplayed: () => void;
  // 재시도 허용 횟수를 넘겨도 실패할 때 사용자가 선택하는 건너뛰기
  onSkip: () => void;
};

type LoadState = "loading" | "loaded" | "error";

/**
 * 이미지 카드. imageId가 바뀌면 부모가 key로 다시 마운트하므로 상태가 초기화된다.
 * 오류 시 attempt를 올려 <Image>를 새로 마운트해 재시도한다.
 */
export default function TestImage({
  imageId,
  onDisplayed,
  onSkip,
}: TestImageProps) {
  const [state, setState] = useState<LoadState>("loading");
  const [attempt, setAttempt] = useState(0);
  const onDisplayedRef = useRef(onDisplayed);

  useEffect(() => {
    onDisplayedRef.current = onDisplayed;
  }, [onDisplayed]);

  // StrictMode 재마운트에서도 누락되지 않도록 loaded 상태 진입 시 2프레임 뒤 표시 완료를 알린다.
  useEffect(() => {
    if (state !== "loaded") {
      return;
    }
    let secondFrameId = 0;
    const firstFrameId = requestAnimationFrame(() => {
      secondFrameId = requestAnimationFrame(() => {
        onDisplayedRef.current();
      });
    });
    return () => {
      cancelAnimationFrame(firstFrameId);
      cancelAnimationFrame(secondFrameId);
    };
  }, [state]);

  function handleRetry() {
    setState("loading");
    setAttempt((value) => value + 1);
  }

  function handleLoad() {
    setState("loaded");
  }

  const canRetry = attempt < imageMaxRetries;

  return (
    <div
      aria-busy={state === "loading"}
      className="relative aspect-[5/4] w-full overflow-hidden rounded-2xl bg-surface-muted"
    >
      {state !== "error" ? (
        <Image
          key={attempt}
          src={getImageSrc(imageId)}
          alt={testText.imageAlt}
          fill
          unoptimized
          sizes="430px"
          className={`object-cover ${state === "loaded" ? "opacity-100" : "opacity-0"}`}
          onLoad={handleLoad}
          onError={() => setState("error")}
        />
      ) : null}
      {state === "loading" ? (
        <p className="absolute inset-0 flex animate-pulse items-center justify-center text-sm text-text-muted motion-reduce:animate-none">
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
            onClick={canRetry ? handleRetry : onSkip}
            className="h-11 w-auto px-5"
          >
            {canRetry ? testText.imageRetry : testText.skip}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

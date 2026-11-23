import { useCallback, useEffect, useRef } from "react";
import {
  addCurrentImageElapsedMs,
  loadSession,
} from "@/lib/storage/surveySession";

/**
 * 이미지 응답 시간을 "화면에 보인 누적 시간"으로 잰다.
 * - 이미지가 보이는 동안만 센다. 탭이 숨겨지거나 페이지를 떠날 때(pagehide) 지금까지의 구간을
 *   sessionStorage의 currentImageElapsedMs에 더해 둔다.
 * - 새로고침 후에는 저장된 누적값에서 이어서 센다. 새로고침 중 비어 있던 시간은 포함하지 않는다.
 * - finish()는 (저장된 누적값 + 현재 구간)을 반환한다. 이 값을 submitImageResponse의 responseMs로 쓴다.
 * imageId가 바뀌면(다음 이미지) 구간을 새로 시작한다.
 */
export function useImageTimer(imageId: string | null) {
  const startedAtRef = useRef<number | null>(null);
  const settledRef = useRef(false);

  const flush = useCallback(() => {
    if (startedAtRef.current === null || settledRef.current) {
      return;
    }
    addCurrentImageElapsedMs(Date.now() - startedAtRef.current);
    startedAtRef.current = null;
  }, []);

  useEffect(() => {
    if (imageId === null) {
      return;
    }
    settledRef.current = false;
    startedAtRef.current = document.hidden ? null : Date.now();

    function handleVisibilityChange() {
      if (document.hidden) {
        flush();
      } else if (startedAtRef.current === null && !settledRef.current) {
        startedAtRef.current = Date.now();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", flush);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, [imageId, flush]);

  const finish = useCallback(() => {
    const stored = loadSession()?.currentImageElapsedMs ?? 0;
    const running =
      startedAtRef.current === null ? 0 : Date.now() - startedAtRef.current;
    // 제출 직후 정리 단계에서 같은 구간이 다음 이미지에 더해지지 않게 막는다.
    settledRef.current = true;
    startedAtRef.current = null;
    return stored + running;
  }, []);

  return { finish };
}

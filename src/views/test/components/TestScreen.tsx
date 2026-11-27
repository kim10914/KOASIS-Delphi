"use client";

import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import AppHeader from "@/components/AppHeader";
import { getImageSrc } from "@/constants/images";
import { routes } from "@/constants/routes";
import {
  getSessionServerSnapshot,
  loadSession,
  submitImageResponse,
  subscribeSession,
} from "@/lib/storage/surveySession";
import type { ImageResponseInput } from "@/lib/storage/surveySession";
import TestProgress from "./TestProgress";
import TestQuestion from "./TestQuestion";

export default function TestScreen() {
  const router = useRouter();
  const session = useSyncExternalStore(
    subscribeSession,
    loadSession,
    getSessionServerSnapshot,
  );
  const order = session?.imageOrder ?? [];
  const index = session?.responses.length ?? 0;
  const currentImageId = order[index] ?? null;
  const nextImageId = order[index + 1] ?? null;
  const percent =
    order.length === 0 ? 0 : Math.round((index / order.length) * 100);

  // 다음 이미지를 미리 받아 두어 전환 시 로딩 대기를 줄인다.
  useEffect(() => {
    if (nextImageId) {
      new window.Image().src = getImageSrc(nextImageId);
    }
  }, [nextImageId]);

  function handleSubmit(input: ImageResponseInput) {
    submitImageResponse(input);
    if (index + 1 >= order.length) {
      // 이전 이미지로 돌아갈 수 없도록 히스토리를 남기지 않는다.
      router.replace(routes.done);
    }
  }

  return (
    <div className="min-h-dvh bg-surface-muted">
      <main className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col gap-3">
        <div className="rounded-b-3xl bg-surface pagePaddingX pt-[env(safe-area-inset-top)]">
          <AppHeader />
          <div className="pt-3">
            <TestProgress percent={percent} />
          </div>
        </div>
        <div className="flex-1 rounded-t-3xl bg-surface pagePaddingX pt-6 pb-[env(safe-area-inset-bottom)]">
          {currentImageId ? (
            <TestQuestion
              key={currentImageId}
              imageId={currentImageId}
              onSubmit={handleSubmit}
            />
          ) : null}
        </div>
      </main>
    </div>
  );
}

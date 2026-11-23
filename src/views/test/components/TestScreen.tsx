"use client";

import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import AppHeader from "@/components/AppHeader";
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
  const percent =
    order.length === 0 ? 0 : Math.round((index / order.length) * 100);

  function handleSubmit(input: ImageResponseInput) {
    submitImageResponse(input);
    if (index + 1 >= order.length) {
      // 이전 이미지로 돌아갈 수 없도록 히스토리를 남기지 않는다.
      router.replace(routes.done);
    }
  }

  return (
    <main className="pageContainer">
      <AppHeader />
      <TestProgress percent={percent} />
      {currentImageId ? (
        <TestQuestion
          key={currentImageId}
          imageId={currentImageId}
          onSubmit={handleSubmit}
        />
      ) : null}
    </main>
  );
}

"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { readyText } from "@/constants/flow";
import { routes } from "@/constants/routes";
import { startTest } from "@/lib/storage/surveySession";
import { createImageOrder } from "@/lib/survey/imageOrder";
import FlowNotice from "@/views/flow/components/FlowNotice";

export default function ReadyScreen() {
  const router = useRouter();

  function handleStart() {
    // 이미지 순서는 한 번만 확정된다. 이미 있으면(뒤로가기 등) 기존 순서를 유지한다.
    startTest(createImageOrder());
    router.push(routes.test);
  }

  return (
    <FlowNotice title={readyText.title} description={readyText.description}>
      <Button onClick={handleStart}>{readyText.startLabel}</Button>
    </FlowNotice>
  );
}

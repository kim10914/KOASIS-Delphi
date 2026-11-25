"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { saveText } from "@/constants/flow";
import { routes } from "@/constants/routes";
import { clearResult } from "@/lib/storage/surveySession";
import FlowNotice from "@/views/flow/components/FlowNotice";

// 저장 성공 뒤 조사 종료 안내. 결과 내용은 보여주지 않는다(산출 규칙 미확정).
export default function CompletionNotice() {
  const router = useRouter();

  function handleRestart() {
    // 공용 기기에서 다음 참여자에게 이전 완료 상태가 남지 않도록 결과 요약을 비운다.
    clearResult();
    router.replace(routes.splash);
  }

  return (
    <FlowNotice
      role="status"
      focusOnMount
      title={saveText.savedTitle}
      description={saveText.savedDescription}
    >
      <Button onClick={handleRestart}>{saveText.restartLabel}</Button>
    </FlowNotice>
  );
}

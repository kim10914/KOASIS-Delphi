"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { saveText } from "@/constants/flow";
import { routes } from "@/constants/routes";
import FlowNotice from "@/views/flow/components/FlowNotice";

type CompletionNoticeProps = {
  participantName?: string;
};

// 저장 성공 뒤 조사 종료 안내. 결과 내용은 보여주지 않는다(산출 규칙 미확정).
export default function CompletionNotice({
  participantName,
}: CompletionNoticeProps) {
  const router = useRouter();

  return (
    <FlowNotice
      role="status"
      title={saveText.savedTitle}
      description={
        participantName
          ? saveText.savedDescriptionWithName(participantName)
          : saveText.savedDescription
      }
    >
      <Button onClick={() => router.replace(routes.splash)}>
        {saveText.restartLabel}
      </Button>
    </FlowNotice>
  );
}

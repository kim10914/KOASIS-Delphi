"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { doneText } from "@/constants/flow";
import { routes } from "@/constants/routes";
import FlowNotice from "@/views/flow/components/FlowNotice";

export default function DoneScreen() {
  const router = useRouter();

  return (
    <FlowNotice title={doneText.title} description={doneText.description}>
      <Button onClick={() => router.push(routes.moodPost)}>
        {doneText.continueLabel}
      </Button>
    </FlowNotice>
  );
}

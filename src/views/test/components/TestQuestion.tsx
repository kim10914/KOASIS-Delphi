import { useRef, useState } from "react";
import Button from "@/components/Button";
import { testText } from "@/constants/test";
import { useImageTimer } from "@/lib/survey/useImageTimer";
import type { ScaleValue } from "@/types/survey";
import ScaleQuestion from "./ScaleQuestion";
import TestImage from "./TestImage";

type TestQuestionProps = {
  imageId: string;
  onSubmit: (input: {
    valence: ScaleValue;
    arousal: ScaleValue;
    responseMs: number;
  }) => void;
};

/**
 * 이미지 한 장에 대한 응답 화면. 부모가 imageId를 key로 주므로 이미지마다 새로 마운트되어
 * 선택값과 제출 잠금이 초기화된다.
 */
export default function TestQuestion({ imageId, onSubmit }: TestQuestionProps) {
  const [displayed, setDisplayed] = useState(false);
  const [valence, setValence] = useState<ScaleValue | null>(null);
  const [arousal, setArousal] = useState<ScaleValue | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const lockRef = useRef(false);
  // 이미지가 실제로 표시된 뒤부터 시간을 센다.
  const { finish } = useImageTimer(displayed ? imageId : null);

  const canSubmit = displayed && valence !== null && arousal !== null;

  function handleSubmit() {
    if (!canSubmit || lockRef.current) {
      return;
    }
    // 빠른 중복 클릭으로 다음 이미지가 건너뛰어지지 않게 동기 잠금을 건다.
    lockRef.current = true;
    setSubmitted(true);
    onSubmit({ valence, arousal, responseMs: finish() });
  }

  return (
    <div className="flex flex-col gap-6 pb-6">
      <p className="text-xl font-semibold break-keep">{testText.guide}</p>
      <TestImage imageId={imageId} onDisplayed={() => setDisplayed(true)} />
      <ScaleQuestion
        kind="valence"
        value={valence}
        disabled={submitted}
        onChange={setValence}
      />
      <ScaleQuestion
        kind="arousal"
        value={arousal}
        disabled={submitted}
        onChange={setArousal}
      />
      <Button disabled={!canSubmit || submitted} onClick={handleSubmit}>
        {testText.next}
      </Button>
    </div>
  );
}

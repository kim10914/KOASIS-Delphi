import {
  scaleDirectionGradient,
  scaleQuestions,
  scaleStepLabel,
  scaleValues,
} from "@/constants/test";
import type { ScaleKind } from "@/constants/test";
import type { ScaleValue } from "@/types/survey";
import FaceIcon from "./FaceIcon";

type ScaleQuestionProps = {
  kind: ScaleKind;
  value: ScaleValue | null;
  disabled?: boolean;
  onChange: (value: ScaleValue) => void;
};

// 양 끝에서 중앙으로 가늘어지는 방향 표시 막대
const wedgeStyle = {
  background: scaleDirectionGradient,
  clipPath: "polygon(0 0, 50% 42%, 100% 0, 100% 100%, 50% 58%, 0 100%)",
} as const;

function getEndLabel(step: number, low: string, high: string) {
  if (step === scaleValues[0]) {
    return low;
  }
  if (step === scaleValues[scaleValues.length - 1]) {
    return high;
  }
  return undefined;
}

export default function ScaleQuestion({
  kind,
  value,
  disabled = false,
  onChange,
}: ScaleQuestionProps) {
  const { title, low, high } = scaleQuestions[kind];
  const titleId = `scale-${kind}`;
  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-4">
      <h2 id={titleId} className="text-2xl font-bold break-keep">
        {title}
      </h2>
      <div
        role="radiogroup"
        aria-labelledby={titleId}
        className="flex justify-between"
      >
        {scaleValues.map((step) => {
          const selected = value === step;
          return (
            <label
              key={step}
              className={`flex size-11 items-center justify-center rounded-full transition has-focus-visible:ring-2 has-focus-visible:ring-text-strong has-focus-visible:ring-offset-2 ${
                selected
                  ? "scale-110 ring-2 ring-text-strong ring-offset-2"
                  : value === null
                    ? ""
                    : "opacity-40"
              }`}
            >
              <input
                type="radio"
                name={kind}
                value={step}
                checked={selected}
                disabled={disabled}
                aria-label={scaleStepLabel(step, getEndLabel(step, low, high))}
                onChange={() => onChange(step)}
                className="sr-only"
              />
              <FaceIcon kind={kind} step={step} />
            </label>
          );
        })}
      </div>
      <div className="flex items-center gap-2 text-xs text-text-strong">
        <span className="shrink-0">{low}</span>
        <span className="h-2 flex-1" style={wedgeStyle} aria-hidden="true" />
        <span className="shrink-0">{high}</span>
      </div>
    </section>
  );
}

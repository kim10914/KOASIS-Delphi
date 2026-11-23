import { scaleQuestions, scaleStepLabel, scaleValues } from "@/constants/test";
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
  background:
    "linear-gradient(90deg, #dd191c, #feb330 45%, #ffffff 50%, #9de423 55%, #00d660)",
  clipPath: "polygon(0 0, 50% 42%, 100% 0, 100% 100%, 50% 58%, 0 100%)",
} as const;

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
            <button
              key={step}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={scaleStepLabel(low, high, step)}
              disabled={disabled}
              onClick={() => onChange(step)}
              className={`flex size-11 items-center justify-center rounded-full transition ${
                selected
                  ? "scale-110 ring-2 ring-text-strong ring-offset-2"
                  : value === null
                    ? ""
                    : "opacity-40"
              }`}
            >
              <FaceIcon kind={kind} step={step} />
            </button>
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

import { testText } from "@/constants/test";

type TestProgressProps = {
  percent: number;
};

export default function TestProgress({ percent }: TestProgressProps) {
  return (
    <div className="flex flex-col gap-3 pb-5">
      <div className="flex items-baseline justify-between text-lg font-semibold">
        <span id="test-progress-label">{testText.progressLabel}</span>
        <span>{percent}%</span>
      </div>
      <div
        role="progressbar"
        aria-labelledby="test-progress-label"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="h-3 w-full overflow-hidden rounded-full bg-surface-muted"
      >
        <div
          className="h-full rounded-full transition-[width]"
          style={{
            width: `${percent}%`,
            background:
              "linear-gradient(90deg, var(--color-primary-gradient-from), var(--color-primary-gradient-to))",
          }}
        />
      </div>
    </div>
  );
}

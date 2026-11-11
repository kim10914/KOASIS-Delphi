type StepIndicatorProps = {
  current: number;
  total: number;
  className?: string;
};

export default function StepIndicator({
  current,
  total,
  className = "",
}: StepIndicatorProps) {
  const steps = Array.from({ length: total }, (_, index) => index + 1);

  return (
    <div
      role="progressbar"
      aria-label="진행 단계"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-valuetext={`${total}단계 중 ${current}단계`}
      className={`flex items-center gap-2 ${className}`}
    >
      {steps.map((step) => (
        <span
          key={step}
          className={`h-1.5 flex-1 rounded-full ${
            step <= current ? "bg-primary" : "bg-border"
          }`}
        />
      ))}
    </div>
  );
}

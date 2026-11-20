import { stepIndicatorText } from "@/constants/ui";

type StepIndicatorProps = {
  currentStep: number;
  totalSteps?: number;
};

export default function StepIndicator({
  currentStep,
  totalSteps = 3,
}: StepIndicatorProps) {
  const steps = Array.from({ length: totalSteps }, (_, index) => index + 1);
  return (
    <ol className="flex items-center" aria-label={stepIndicatorText.label}>
      {steps.map((step) => {
        const reached = step <= currentStep;
        return (
          <li key={step} className="flex items-center">
            {step > 1 ? (
              <span className="mx-1.5 h-px w-5 bg-border" aria-hidden="true" />
            ) : null}
            <span
              aria-current={step === currentStep ? "step" : undefined}
              aria-label={stepIndicatorText.stepLabel(step, totalSteps)}
              className={`flex size-12 items-center justify-center rounded-full border text-base font-semibold ${
                reached
                  ? "border-text-strong bg-text-strong text-white"
                  : "border-border bg-surface text-text-muted"
              }`}
            >
              {step}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

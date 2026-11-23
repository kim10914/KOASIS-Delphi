import { faceFeatures, scaleColors } from "@/constants/test";
import type { ScaleKind } from "@/constants/test";

type FaceIconProps = {
  kind: ScaleKind;
  // 1~7
  step: number;
};

export default function FaceIcon({ kind, step }: FaceIconProps) {
  const features = faceFeatures[kind][step - 1];
  return (
    <svg viewBox="0 0 60 60" className="size-full" aria-hidden="true">
      <circle cx="30" cy="30" r="30" fill={scaleColors[step - 1]} />
      <g
        stroke="#111111"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {features.map((feature) => (
          <path
            key={feature.d}
            d={feature.d}
            fill={feature.fill ? "#111111" : "none"}
          />
        ))}
      </g>
    </svg>
  );
}

import { splashBackgroundGradients } from "@/constants/splash";

type SplashBackgroundProps = {
  isIntro: boolean;
};

export default function SplashBackground({ isIntro }: SplashBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 transition-all duration-1000 ease-out motion-reduce:transition-none ${
        isIntro ? "scale-105 opacity-100" : "scale-100 opacity-85"
      }`}
      style={{
        background: splashBackgroundGradients.join(", "),
      }}
    />
  );
}

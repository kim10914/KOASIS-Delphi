export default function SplashBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-0"
      style={{
        background: [
          "radial-gradient(70% 40% at 0% 85%, rgb(0 90 130 / 0.75) 0%, transparent 100%)",
          "radial-gradient(60% 40% at 100% 50%, rgb(60 10 130 / 0.7) 0%, transparent 100%)",
          "radial-gradient(60% 35% at 60% 65%, rgb(10 20 90 / 0.5) 0%, transparent 100%)",
        ].join(", "),
      }}
    />
  );
}

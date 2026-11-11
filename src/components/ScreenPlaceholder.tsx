import Link from "next/link";

type ScreenPlaceholderProps = {
  title: string;
  description?: string;
  nextHref?: string;
  nextLabel?: string;
};

// 화면 구현 전 임시 골격. 각 화면 구현 시 페이지 전용 컴포넌트로 교체한다.
export default function ScreenPlaceholder({
  title,
  description,
  nextHref,
  nextLabel = "다음",
}: ScreenPlaceholderProps) {
  return (
    <main className="pageContainer justify-center gap-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      {description ? <p className="text-text-muted">{description}</p> : null}
      {nextHref ? (
        <Link
          href={nextHref}
          className="flex h-14 items-center justify-center rounded-[var(--radius-button)] bg-primary font-semibold text-white"
        >
          {nextLabel}
        </Link>
      ) : null}
    </main>
  );
}

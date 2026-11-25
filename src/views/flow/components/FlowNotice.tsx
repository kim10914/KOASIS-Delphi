import type { ReactNode } from "react";
import AppHeader from "@/components/AppHeader";

type FlowNoticeProps = {
  title: string;
  description: string;
  // 제목 위에 놓는 요소(스피너 등)
  icon?: ReactNode;
  // 제목·설명 아래 영역(버튼 등)
  children?: ReactNode;
  // 상태 변화를 스크린리더에 알릴 때 쓰는 role
  role?: "status" | "alert";
};

// 준비·완료·저장 상태 화면이 함께 쓰는 중앙 정렬 안내 레이아웃.
export default function FlowNotice({
  title,
  description,
  icon,
  children,
  role,
}: FlowNoticeProps) {
  return (
    <main className="pageContainer pt-[env(safe-area-inset-top)]">
      <AppHeader />
      <div className="flex flex-1 flex-col items-center justify-center gap-6 pb-24 text-center">
        <div role={role} className="flex flex-col items-center gap-3">
          {icon}
          <h1 className="text-2xl leading-snug font-bold break-keep whitespace-pre-line text-text-strong">
            {title}
          </h1>
          <p className="text-base leading-relaxed break-keep whitespace-pre-line text-text-muted">
            {description}
          </p>
        </div>
        {children ? <div className="w-full">{children}</div> : null}
      </div>
    </main>
  );
}

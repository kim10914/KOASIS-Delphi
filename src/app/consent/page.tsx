import ScreenPlaceholder from "@/components/ScreenPlaceholder";
import { routes } from "@/constants/routes";

export default function Page() {
  return (
    <ScreenPlaceholder
      title="참여 화면도 기록해볼까요?"
      description="2단계: 카메라 동의 (선택)"
      nextHref={routes.moodPre}
      nextLabel="다음"
    />
  );
}

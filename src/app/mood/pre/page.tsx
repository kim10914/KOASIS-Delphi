import ScreenPlaceholder from "@/components/ScreenPlaceholder";
import { routes } from "@/constants/routes";

export default function Page() {
  return (
    <ScreenPlaceholder
      title="내 기분 체크하기"
      description="3단계: 사전 무드미터 (6x6 감정 격자)"
      nextHref={routes.ready}
      nextLabel="제출하기"
    />
  );
}

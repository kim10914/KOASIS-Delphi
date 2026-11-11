import ScreenPlaceholder from "@/components/ScreenPlaceholder";
import { routes } from "@/constants/routes";

export default function Page() {
  return (
    <ScreenPlaceholder
      title="테스트를 마친 지금, 기분이 어떤가요?"
      description="사후 무드미터: 에너지·기분 사분면과 세부 감정"
      nextHref={routes.loading}
      nextLabel="결과 제출하기"
    />
  );
}

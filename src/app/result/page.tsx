import ScreenPlaceholder from "@/components/ScreenPlaceholder";
import { routes } from "@/constants/routes";

export default function ResultPage() {
  return (
    <ScreenPlaceholder
      title="테스트 결과"
      description="마인드미러로 들여다본 오늘 내 마음의 상태"
      nextHref={routes.splash}
      nextLabel="처음으로"
    />
  );
}

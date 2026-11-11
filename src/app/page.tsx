import ScreenPlaceholder from "@/components/ScreenPlaceholder";
import { routes } from "@/constants/routes";

export default function SplashPage() {
  return (
    <ScreenPlaceholder
      title="마음을 보는 거울 마인드 미러"
      description="지금 내 마음을 알아볼까요?"
      nextHref={routes.info}
      nextLabel="시작하기"
    />
  );
}

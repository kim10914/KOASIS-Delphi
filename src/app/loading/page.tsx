import ScreenPlaceholder from "@/components/ScreenPlaceholder";
import { routes } from "@/constants/routes";

export default function Page() {
  return (
    <ScreenPlaceholder
      title="테스트 결과 도출 중..."
      description="테스트 결과를 준비 중이에요. 조금만 기다려주세요."
      nextHref={routes.result}
      nextLabel="결과 보기"
    />
  );
}

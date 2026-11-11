import ScreenPlaceholder from "@/components/ScreenPlaceholder";
import { routes } from "@/constants/routes";

export default function Page() {
  return (
    <ScreenPlaceholder
      title="자 그럼 마음을 보는 거울 마인드 미러를 시작합니다!"
      description="화면에 나오는 사진을 보고, 처음 느껴지는 기분을 7단계 중에서 선택해 주세요."
      nextHref={routes.test}
      nextLabel="시작하기"
    />
  );
}

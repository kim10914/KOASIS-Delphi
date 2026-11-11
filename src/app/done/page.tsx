import ScreenPlaceholder from "@/components/ScreenPlaceholder";
import { routes } from "@/constants/routes";

export default function Page() {
  return (
    <ScreenPlaceholder
      title="수고하셨습니다. 모든 조사를 마쳤습니다."
      description="작성해 주신 내용으로 마음의 거울을 준비해 볼게요."
      nextHref={routes.moodPost}
      nextLabel="계속하기"
    />
  );
}

import ScreenPlaceholder from "@/components/ScreenPlaceholder";
import { routes } from "@/constants/routes";

export default function Page() {
  return (
    <ScreenPlaceholder
      title="참여자의 간단한 정보를 입력해주세요."
      description="1단계: 이름, 생년월일, 성별, 직업, 지역"
      nextHref={routes.consent}
      nextLabel="제출하기"
    />
  );
}

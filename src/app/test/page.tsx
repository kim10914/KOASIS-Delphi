import ScreenPlaceholder from "@/components/ScreenPlaceholder";
import { routes } from "@/constants/routes";

export default function Page() {
  return (
    <ScreenPlaceholder
      title="본조사"
      description="이미지 응답: 쾌-불쾌, 자극-평온 (Type 2)"
      nextHref={routes.done}
      nextLabel="다음 사진"
    />
  );
}

import Image from "next/image";
import { splashLogoPath, splashText } from "@/constants/splash";

type SplashBrandProps = {
  showSubtitle: boolean;
};

export default function SplashBrand({ showSubtitle }: SplashBrandProps) {
  return (
    <div className="flex flex-col items-center text-white">
      <Image
        src={splashLogoPath}
        alt={splashText.logoAlt}
        width={498}
        height={342}
        className="h-auto w-[130px]"
        priority
      />
      <p className="mt-3 text-[40px] leading-tight font-bold tracking-tight">
        {splashText.brandName}
      </p>
      {showSubtitle ? (
        <p className="mt-2 text-base text-white/80">{splashText.subtitle}</p>
      ) : null}
    </div>
  );
}

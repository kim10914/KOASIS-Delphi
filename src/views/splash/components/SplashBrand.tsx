import Image from "next/image";
import { brandAssets } from "@/constants/assets";
import { splashText } from "@/constants/splash";

type SplashBrandProps = {
  showSubtitle: boolean;
};

export default function SplashBrand({ showSubtitle }: SplashBrandProps) {
  return (
    <div className="flex flex-col items-center text-white">
      <Image
        src={brandAssets.logoPath}
        alt={brandAssets.logoAlt}
        width={498}
        height={342}
        className="h-auto w-[74px]"
        preload
      />
      <p className="mt-2.5 font-brand text-[32px] leading-tight font-semibold tracking-tight">
        {splashText.brandName}
      </p>
      <p
        aria-hidden={!showSubtitle}
        className={`mt-1.5 font-brand text-sm text-white/80 transition-all duration-500 ease-out motion-reduce:transition-none ${
          showSubtitle ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        {splashText.subtitle}
      </p>
    </div>
  );
}

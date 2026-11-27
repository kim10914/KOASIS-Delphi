import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "@/styles/index.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-outfit",
  display: "block",
});

export const metadata: Metadata = {
  title: "Mind Mirror",
  description: "마음을 보는 거울, 마인드 미러",
  appleWebApp: {
    capable: true,
    title: "Mind Mirror",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={outfit.variable}>
      <body>{children}</body>
    </html>
  );
}

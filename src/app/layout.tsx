import type { Metadata, Viewport } from "next";
import "@/styles/index.css";

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
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

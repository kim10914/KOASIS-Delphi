export const pwaInstallText = {
  title: "앱으로 설치하고 더 편하게 이용하세요",
  description: "홈 화면에 추가하면 앱처럼 바로 열 수 있어요.",
  installLabel: "설치하기",
  dismissLabel: "웹으로 이용할게요",
  confirmLabel: "확인했어요",
  guideTitle: "홈 화면에 추가하는 방법",
  iosSteps: [
    "브라우저 하단(또는 상단)의 공유 버튼을 누르세요.",
    '메뉴에서 "홈 화면에 추가"를 선택하세요.',
    '오른쪽 위의 "추가"를 누르면 설치가 끝나요.',
  ],
  fallbackSteps: [
    "브라우저 오른쪽 위의 메뉴 버튼을 누르세요.",
    '"앱 설치" 또는 "홈 화면에 추가"를 선택하세요.',
  ],
} as const;

export const pwaConfig = {
  serviceWorkerPath: "/sw.js",
  serviceWorkerScope: "/",
  mobileUserAgentPattern: /Android|iPhone|iPad|iPod|Mobile/i,
  iosUserAgentPattern: /iPhone|iPad|iPod/i,
  standaloneMediaQuery: "(display-mode: standalone)",
} as const;

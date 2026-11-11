# KOASIS-Delphi (Mind Mirror)

K-OASIS 이미지 풀 기반 심리테스트 앱 **Mind Mirror**의 참여자용 모바일 웹앱(PWA).

## 스택

- Next.js (App Router, 정적 export) + TypeScript
- TailwindCSS v4
- Supabase (예정)

## 시작하기

```bash
npm install
npm run dev      # 개발 서버
npm run build    # 정적 빌드 (out/)
npm run lint
npm run format
```

## 화면 흐름

`/` 스플래시 → `/info` → `/consent` → `/mood/pre` → `/ready` → `/test` → `/done` → `/mood/post` → `/loading` → `/result`

## 구조

```
src/
  app/          라우트 (page.tsx는 화면 조립만)
  components/   공통 컴포넌트
  config/       설문 설정값 (survey.ts)
  constants/    상수 (routes.ts)
  styles/       fonts / theme / base / utilities
  types/        타입
```

## 설정값 (임시, 발주처 확인 후 확정)

`src/config/survey.ts` 에서 관리한다.

- 세션당 이미지 수: 20장, 랜덤
- 본조사 UI: Type 2 (캐릭터 아이콘)
- 표정 녹화: 동의 여부만 저장 (카메라 미사용)

## 코드 컨벤션

- 쌍따옴표, 세미콜론 필수 (ESLint/Prettier로 검사)
- 변수·함수 camelCase, 컴포넌트 PascalCase
- 정적 export 유지: SSR, API route, 서버 액션 사용 금지. 데이터는 Supabase 클라이언트로 직접 호출

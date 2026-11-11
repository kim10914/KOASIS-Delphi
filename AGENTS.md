<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

Mind Mirror(K-OASIS 이미지 기반 심리테스트) 참여자용 모바일 웹앱(PWA).
상세 요구사항은 `docs/SPEC.md`, 디자인 토큰은 `docs/design-tokens.md`를 먼저 읽는다.

## 스택과 제약

- Next.js(App Router) + TypeScript + TailwindCSS v4, **정적 export** (`output: "export"`)
- 정적 export 유지: SSR, Route Handler, Server Action, 미들웨어 사용 금지
- 데이터는 클라이언트에서 Supabase SDK로 직접 호출 (RLS 필수)
- 모바일 퍼스트, 최대 폭 430px, `pageContainer` 유틸리티 사용
- Next.js 16 기준이다. 코드 작성 전 `node_modules/next/dist/docs/`의 관련 가이드를 확인한다

## 코드 컨벤션

- 문자열은 쌍따옴표, 모든 문장 끝에 세미콜론 (ESLint, Prettier로 강제)
- 한 줄에 한 문장
- 변수·함수 camelCase, 컴포넌트·생성자 PascalCase
- 주석은 설명하는 구문의 들여쓰기에 맞춘다
- 문자열 상수와 설정값은 `src/config`, `src/constants`에 둔다 (화면 코드에 하드코딩 금지)

## 폴더 구조

```
src/app/          라우트. page.tsx는 화면 조립만 한다
src/components/   공통 컴포넌트
src/views/[page]/components/   페이지 전용 컴포넌트
src/config/       설문 설정값 (survey.ts)
src/constants/    상수 (routes.ts, 감정 격자 데이터 등)
src/styles/       fonts.css, theme.css(CSS 변수 토큰), base.css(@layer base), utilities.css
src/types/        타입
docs/             SPEC, 디자인 토큰, 시안에서 추출한 임시 에셋
```

`src/pages`는 Next.js Pages Router 경로로 인식되므로 사용하지 않는다. 페이지 전용 컴포넌트는 `src/views`에 둔다.

## 협업 워크플로우

1. 작업 전 이슈 생성 (Tag, Assignees 필수). 이슈 단위로 브랜치 생성
2. 커밋 메시지: `Type: 내용` 형식, 이모지는 쓰지 않는다 (예: `Feat: 정보 입력 화면 구현`)
   - 타입: `Feat`, `Fix`, `Refactor`, `Style`, `Docs`, `Chore`
3. PR: 본문에 작업 설명, UI 변경 시 스크린샷 첨부. Label, Assignees, Reviewer 지정
4. 최소 1명 Approve 후 머지. 머지 전 Deploy Preview에서 라우팅과 화면 동작 확인

## 검증 체크리스트

작업 종료 전 실행한다: `npm run lint`, `npm run format:check`, `npm run build`

- [ ] 모든 문자열이 쌍따옴표인가
- [ ] 세미콜론 누락이 없는가
- [ ] 컴포넌트가 올바른 위치(공통 / 페이지 전용)에 있는가
- [ ] 정적 export 빌드가 통과하는가

## 미확정 사항 (임의로 확정하지 말 것)

설정값은 `src/config/survey.ts` 한 곳에서만 바꾼다. 상세는 `docs/SPEC.md`의 "미확정 항목" 참고.

- 세션당 이미지 수와 선택 방식 (임시: 20장 랜덤)
- 결과지 산출 규칙과 문구
- 표정 녹화 범위 (현재: 동의 여부만 저장, 카메라 미사용)
- 개인정보 비식별 처리 방식과 보관 정책

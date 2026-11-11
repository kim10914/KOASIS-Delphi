---
name: issue-to-pr
description: Mind Mirror 저장소에서 기능 작업을 이슈 생성부터 브랜치, 커밋, PR까지 팀 규칙대로 진행합니다. 새 기능, 버그 수정, 문서 변경을 시작하거나 커밋 또는 PR을 만들 때 사용합니다.
---

# 이슈에서 PR까지

코드 규칙과 폴더 구조는 루트 AGENTS.md를 따릅니다. 이 스킬은 GitHub 협업 절차만 다룹니다.

## 1. 이슈

- 작업 전에 관련 이슈가 있는지 `gh issue list`로 확인합니다.
- 없으면 `.github/ISSUE_TEMPLATE/issue.md` 형식으로 `gh issue create`를 실행합니다.
- 제목은 `[fe] 요약`처럼 범위를 앞에 붙입니다.
- 라벨(`--label`)과 담당자(`--assignee`)를 반드시 지정합니다. 값을 모르면 사용자에게 묻습니다.

## 2. 브랜치

- main에서 이슈 번호를 포함한 브랜치를 만듭니다.
- 형식: `feat/123-short-name`, `fix/123-short-name`, `docs/123-short-name`, `chore/123-short-name`.
- 아직 병합되지 않은 다른 브랜치의 코드가 필요하면 그 브랜치에서 새 브랜치를 만듭니다. 이때 PR의 base는 바로 앞 선행 브랜치로 지정하고, 선행 PR이 병합되면 base를 main으로 바꿉니다.

## 3. 커밋

- `깃모지 Type: 내용` 형식으로 작성합니다. 예: `✨ Feat: 정보 입력 화면 구현`.
- 타입: `✨ Feat`, `🐛 Fix`, `♻️ Refactor`, `💄 Style`, `📝 Docs`, `🎉 Chore`.
- 커밋 전에 `npm run lint`, `npm run format:check`, `npm run build`를 실행하고 모두 통과해야 합니다.
- `.env*`, 개인 설정 파일은 커밋하지 않습니다. `.env.example`만 커밋합니다.

## 4. PR

- `.github/pull_request_template.md` 형식으로 본문을 채워 `gh pr create`를 실행합니다.
- 제목은 커밋 규칙과 같은 형식을 사용합니다.
- 이슈를 모두 끝내면 `Closes #이슈번호`, 부분 구현이면 `Refs #이슈번호`로 연결합니다. base가 main이 아닌 PR은 `Closes`가 동작하지 않으므로 병합 순서와 base 변경 계획을 본문에 적습니다.
- 라벨, 담당자, 리뷰어를 지정합니다. 리뷰어를 모르면 사용자에게 묻습니다. 협업자가 본인뿐이면 리뷰어를 지정할 수 없다고 알립니다.
- UI 변경이 있으면 스크린샷을 첨부해야 한다고 사용자에게 알립니다.
- 새 환경 변수가 필요하면 이름과 등록 위치(`.env`, GitHub Secrets, Netlify)를 PR에 적습니다.
- 머지 전에 최소 1명의 승인이 필요하고, Netlify Deploy Preview에서 화면과 라우팅을 확인해야 한다고 안내합니다.

## 5. 마무리 점검

- [ ] 이슈에 라벨과 담당자가 있는가?
- [ ] 브랜치 이름에 이슈 번호가 있는가?
- [ ] 커밋 메시지에 깃모지와 타입이 있는가?
- [ ] 새 컴포넌트가 공용(`src/components`)과 페이지 전용(`src/views/[page]/components`) 중 올바른 위치에 있는가?
- [ ] 이슈 범위 밖의 공통 파일을 수정했다면 PR에 이유를 적었는가?
- [ ] PR에 라벨, 담당자, 리뷰어가 지정됐는가?

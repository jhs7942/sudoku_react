# GitHub Pages 배포 문제 해결 가이드

## 증상별 진단

### 증상 1: 완전한 흰 화면 (HTML은 로드, JS/CSS는 안 로드됨)

**원인**: 자산 경로 오류 (base URL 경로 문제)

**확인 방법**:
1. F12 → Network 탭 열기
2. 새로고침 (Ctrl+R)
3. index-*.js 또는 index-*.css 클릭
4. Response Status: **404** 보임?

**해결책**:
```bash
# vite.config.ts에서 base 경로 재확인
base: '/sudoku_react/'  # ← 중요: 끝에 슬래시 필수!

# 빌드 재실행
npm run build

# GitHub에 커밋 후 push
git add vite.config.ts dist/
git commit -m "수정: base 경로 슬래시 확인"
git push
```

---

### 증상 2: 404 Not Found 페이지 (GitHub 기본 404)

**원인**: GitHub Pages 배포가 되지 않음 (gh-pages 브랜치 없음)

**확인 방법**:
1. https://github.com/jhs7942/sudoku_react/branches 이동
2. gh-pages 브랜치 존재?

**해결책**:
```bash
# GitHub Actions 워크플로우가 실행되었는지 확인
# https://github.com/jhs7942/sudoku_react/actions

# 수동으로 gh-pages 브랜치 생성
git subtree push --prefix dist origin gh-pages

# 또는: GitHub Pages 설정 재확인
# Settings → Pages → Source: "Deploy from a branch" → Branch: "gh-pages"
```

---

### 증상 3: Console 에러 (빨간 에러 메시지)

**예시 1: "Cannot find module '@/...'"**
```
Module not found: Error: Can't resolve '@/types/sudoku'
```
- 원인: 경로 별칭이 빌드에 제대로 반영되지 않음
- 해결: `npm run build` 재실행, dist/ 재배포

**예시 2: "Cannot GET /sudoku_react/..."`**
```
Uncaught SyntaxError: Unexpected token '<' in JSON at position 0
```
- 원인: 자산 파일이 HTML을 받고 있음 (404)
- 해결: vite.config.ts의 base 경로 확인

**예시 3: "Unexpected token"이나 "Syntax error"**
```
Uncaught SyntaxError: Unexpected identifier
```
- 원인: JS 파일 로드 실패 또는 손상된 빌드
- 해결:
  ```bash
  rm -rf dist/ node_modules/
  npm install
  npm run build
  ```

---

## 수동 배포 (자동 배포 실패 시)

```bash
# 1. 로컬 빌드
npm run build

# 2. dist/ 폴더를 gh-pages 브랜치에 배포 (직접 푸시)
git subtree push --prefix dist origin gh-pages

# 3. GitHub Pages 설정 확인
# Settings → Pages → Source: "Deploy from a branch"
# Branch: gh-pages, Folder: / (root)

# 4. 5분 후 https://jhs7942.github.io/sudoku_react/ 접속
```

---

## .nojekyll 파일 추가 (선택사항)

GitHub Pages는 기본적으로 Jekyll을 실행합니다.
React SPA는 Jekyll이 필요 없으므로 `.nojekyll` 파일을 추가하면 빌드 시간이 단축됩니다:

```bash
# dist/ 폴더에 .nojekyll 파일 생성
touch dist/.nojekyll

# 또는 배포할 때 함께 커밋
git add dist/.nojekyll
git commit -m "add .nojekyll for GitHub Pages"
git subtree push --prefix dist origin gh-pages
```

---

## 완전 재설정 (마지막 수단)

```bash
# 1. GitHub에서 Settings → Pages 확인
#    Danger Zone에서 "Remove" (옵션)

# 2. 로컬에서 완전 재빌드
rm -rf dist/ node_modules/ package-lock.json
npm install
npm run build

# 3. 새로 배포
git subtree push --prefix dist origin gh-pages

# 4. GitHub Pages 재설정
# Settings → Pages
# Source: Deploy from a branch
# Branch: gh-pages
# Folder: / (root)
# Save

# 5. 3-5분 대기 후 접속
```

---

## 최종 체크리스트

- [ ] vite.config.ts: `base: '/sudoku_react/'` 확인
- [ ] `npm run build` 실행 후 dist/ 생성 확인
- [ ] dist/index.html 존재 확인
- [ ] dist/assets/index-*.js 존재 확인
- [ ] GitHub Actions: "Deploy to GitHub Pages" 초록색 ✅
- [ ] GitHub Pages 설정: gh-pages 브랜치 선택
- [ ] 브라우저 F12 → Console: 에러 메시지 확인
- [ ] https://jhs7942.github.io/sudoku_react/ 접속 테스트

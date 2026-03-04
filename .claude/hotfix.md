# GitHub Pages 404 에러 핫픽스

## 문제 분석

### 증상
개발자도구 Network 탭에서 다음 404 에러 발생:
```
Failed to load resource: the server responded with a status of 404
```

### 원인
`index.html`의 favicon 경로가 절대경로로 설정되어 있음:
```html
<!-- ❌ 잘못된 경로 -->
<link rel="icon" type="image/svg+xml" href="/vite.svg" />
```

**경로 분석**:
- 배포 URL: `https://jhs7942.github.io/sudoku_react/`
- 현재 시도: `/vite.svg` → `https://jhs7942.github.io/vite.svg` (404!)
- 필요한 경로: `vite.svg` → `https://jhs7942.github.io/sudoku_react/vite.svg` (✓)

### Vite 자산 경로 처리
Vite는 빌드 시 `vite.config.ts`의 `base` 경로를 참고하여 경로를 자동 변환:
- JS/CSS: `/sudoku_react/assets/...` ✓ (자동 변환됨)
- Favicon: `/vite.svg` (Vite가 변환하지 않음 - 절대경로이므로)

절대경로(`/`로 시작)는 도메인 루트를 의미하므로, base 경로와 무관하게 루트에서 찾음.

---

## 해결책

### 수정 1: Favicon 상대경로로 변경
```html
<!-- ✓ 수정된 경로 -->
<link rel="icon" type="image/svg+xml" href="vite.svg" />
```

**효과**:
- 상대경로는 Vite의 base 경로 자동 변환 대상
- 빌드 시 `/sudoku_react/vite.svg`로 자동 변환
- GitHub Pages에서 올바른 경로로 로드

### 수정 2: .nojekyll 파일 추가 (권장)
GitHub Pages는 기본적으로 Jekyll 빌드를 수행함. React SPA는 Jekyll이 필요 없으므로:

```bash
# dist/.nojekyll 생성
touch dist/.nojekyll
```

**효과**:
- Jekyll 빌드 스킵 → 배포 시간 단축 (10-30초)
- 밑줄(`_`)로 시작하는 폴더 처리 이슈 방지
- 정적 파일 그대로 배포

---

## 적용된 수정사항

### 파일 변경
| 파일 | 변경 사항 |
|------|----------|
| `index.html` | `/vite.svg` → `vite.svg` |
| `dist/.nojekyll` | (신규 생성) |

### 빌드 후 dist/index.html 결과
```html
<!-- 빌드 전 -->
<link rel="icon" type="image/svg+xml" href="vite.svg" />

<!-- 빌드 후 (Vite 자동 변환) -->
<!-- 상대경로를 base와 결합 -->
<!-- 실제 로드: /sudoku_react/vite.svg ✓ -->
```

---

## 배포 절차

```bash
# 1. 빌드
npm run build

# 2. dist에 .nojekyll 추가
touch dist/.nojekyll

# 3. GitHub 푸시
git add index.html dist/
git commit -m "hotfix: 404 에러 - favicon 상대경로 변경"
git push

# 4. GitHub Actions 자동 배포 완료 대기
# https://github.com/jhs7942/sudoku_react/actions

# 5. 검증
curl https://jhs7942.github.io/sudoku_react/vite.svg
# → SVG 내용 반환 (404 아님)
```

---

## 테스트 확인

### 배포 후 확인 항목
- [ ] 브라우저 F12 → Network 탭 새로고침
- [ ] 404 에러 없음
- [ ] index-*.js: 200 OK
- [ ] index-*.css: 200 OK
- [ ] vite.svg: 200 OK
- [ ] 스도쿠 게임 화면 표시됨

### Console 에러 확인
```javascript
// ❌ 없어야 함:
// - Failed to load resource: ... 404
// - Cannot find module
// - Unexpected token '<'

// ✓ 있으면 정상:
// - (에러 없음)
```

---

## 근본 원인: Vite 상대경로 vs 절대경로

### Vite 자동 변환 규칙

| 경로 형식 | 예시 | Vite 변환 | 결과 |
|-----------|------|----------|------|
| 상대경로 | `href="vite.svg"` | ✓ | `/sudoku_react/vite.svg` |
| 상대경로 | `href="./img.png"` | ✓ | `/sudoku_react/img.png` |
| 절대경로 | `href="/vite.svg"` | ✗ | `/vite.svg` (변환 안 함) |
| 절대경로 | `href="/assets/icon.png"` | ✗ | `/assets/icon.png` (변환 안 함) |
| 외부 URL | `href="https://..."` | - | `https://...` (그대로) |

**핵심**: 절대경로(`/`로 시작)는 도메인 루트를 의미하므로 Vite가 base 경로를 적용하지 않음.

---

## 추가 팁

### 1. 큰 프로젝트의 asset 최적화
```html
<!-- public/폴더의 정적 파일은 상대경로 사용 -->
<img src="logo.png" /> <!-- public/logo.png -->
<link href="style.css" /> <!-- public/style.css -->
```

### 2. GitHub Pages 캐시 무효화
새로운 배포가 반영되지 않으면:
```bash
# 캐시 초기화 (Ctrl+Shift+Delete 또는)
# Incognito/Private 모드에서 재접속
```

### 3. 다른 base URL로 배포할 때
```javascript
// vite.config.ts
export default defineConfig({
  base: '/my-new-path/',  // ← 변경
  // ...
});
```
그러면 자동으로:
- 상대경로 → `/my-new-path/assets/...`
- 절대경로 → `/assets/...` (주의 필요!)

---

## 마지막 확인

```bash
# 최종 배포 전 로컬 미리보기
npm run build
npm run preview

# http://localhost:5173/sudoku_react/ 에서 테스트
# (미리보기는 base 경로를 존중함)
```

# GitHub Pages 배포 이슈 및 설정 가이드

## 📋 개요
이 문서는 GitHub Pages 배포 과정에서 발생한 이슈사항과 해결 방법, 관련 설정을 정리한 가이드입니다.

---

## 🔧 배포 관련 주요 설정

### 1. Vite 설정 (vite.config.ts)
```typescript
export default defineConfig({
  base: '/sudoku_react/',  // GitHub Pages 저장소 이름과 일치해야 함
  plugins: [react()],
  // ...
});
```
**목적**: 브라우저에서 정적 파일을 올바른 경로에서 찾도록 설정

**주의사항**:
- base 경로는 `/저장소이름/` 형식
- base 경로 누락 시 index.html 파일을 찾지 못해 404 에러 발생

---

### 2. package.json 설정
```json
{
  "homepage": "https://jhs7942.github.io/sudoku_react/",
  "scripts": {
    "build": "tsc && vite build"
  }
}
```
**목적**:
- npm 패키지 생태계에서 배포 경로 인식
- 빌드 스크립트 정의

**주의사항**:
- homepage는 사용자명에 맞게 수정 필요
- 잘못된 사용자명 입력 시 배포 URL이 잘못됨

---

### 3. GitHub Actions 워크플로우 (deploy.yml)
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]      # main 브랜치에 push할 때 자동 실행
  workflow_dispatch:      # 수동 실행 가능

permissions:
  contents: write         # 저장소에 쓰기 권한
  pages: write           # GitHub Pages 설정 권한
  id-token: write        # OIDC 토큰 권한

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      # 1. 저장소 코드 체크아웃
      - uses: actions/checkout@v4

      # 2. Node.js 설정
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'    # npm 캐싱으로 빌드 속도 향상

      # 3. 의존성 설치
      - name: Install dependencies
        run: npm install

      # 4. 프로젝트 빌드
      - name: Build
        run: npm run build     # dist 폴더 생성

      # 5. GitHub Pages 배포
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist   # 배포할 폴더 지정
```

**목적**: main 브랜치의 변경사항을 자동으로 빌드하고 gh-pages 브랜치에 배포

---

### 4. .gitignore 설정
```
# 의존성
node_modules/
package-lock.json

# 빌드 결과
dist/
dist-ssr/

# IDE
.vscode/
.idea/

# OS
.DS_Store
```

**목적**: git이 추적하면 안 되는 파일/폴더 제외

---

## ⚠️ 발생했던 이슈 및 해결 방법

### 이슈 1: GitHub Actions 권한 부족 (403 Forbidden)
**에러 메시지**:
```
remote: Permission to jhs7942/sudoku_react.git denied to github-actions[bot].
fatal: unable to access '...': The requested URL returned error: 403
```

**원인**:
- GitHub Actions가 gh-pages 브랜치에 쓰기 권한이 없음
- `permissions` 설정이 잘못되었거나 누락됨

**해결 방법**:
```yaml
permissions:
  contents: write   # ← 반드시 필요! (read가 아니라 write)
  pages: write
  id-token: write
```

**학습 포인트**:
- peaceiris/actions-gh-pages는 gh-pages 브랜치에 직접 push하므로 **write 권한 필수**

---

### 이슈 2: node_modules가 git에 추적됨
**에러 메시지**:
```
Error: fatal: No url found for submodule path 'node_modules/.cache/gh-pages/...' in .gitmodules
```

**원인**:
- .gitignore 파일이 없어서 node_modules 폴더가 git에 추적됨
- gh-pages 캐시 폴더가 git submodule로 인식됨

**해결 방법**:
1. `.gitignore` 파일 생성
2. node_modules/ 및 dist/ 추가
3. git 캐시에서 제거: `git rm -r --cached node_modules/`

**학습 포인트**:
- 대용량 의존성 폴더는 git에서 제외 필수
- .gitignore는 프로젝트 시작 시 필수 설정

---

### 이슈 3: homepage 필드의 잘못된 사용자명
**에러**:
- package.json의 homepage가 잘못된 사용자명으로 설정됨

**해결 방법**:
```json
// ❌ 잘못된 설정
"homepage": "https://jeonghyeonseung.github.io/sudoku_react/"

// ✅ 올바른 설정
"homepage": "https://jhs7942.github.io/sudoku_react/"
```

**확인 방법**: `git remote -v`에서 저장소 URL의 사용자명 확인

---

## 🚀 배포 워크플로우 (전체 흐름)

```
main 브랜치에 commit/push
        ↓
GitHub Actions 자동 실행
        ↓
1. 코드 체크아웃
2. Node.js 설정
3. npm install (의존성 설치)
4. npm run build (dist 폴더 생성)
        ↓
5. peaceiris/actions-gh-pages
   └─ dist 폴더를 gh-pages 브랜치에 배포
        ↓
GitHub Pages에서 gh-pages 브랜치 콘텐츠 서빙
        ↓
배포 완료: https://jhs7942.github.io/sudoku_react/
```

---

## 📊 gh-pages 브랜치 이해하기

### main 브랜치
- **목적**: 소스 코드 저장
- **내용**: src/, vite.config.ts, package.json 등
- **관리**: 개발자가 직접 관리

### gh-pages 브랜치
- **목적**: 배포된 정적 파일 저장
- **내용**: index.html, assets/ (JS, CSS 번들)
- **관리**: GitHub Actions가 자동 생성 및 관리
- **주의사항**: 수동으로 건드릴 필요 없음

---

## ✅ 배포 전 체크리스트

- [ ] vite.config.ts의 base 경로 확인
- [ ] package.json의 homepage가 올바른 사용자명인지 확인
- [ ] .gitignore 파일이 존재하고 node_modules, dist 포함 확인
- [ ] deploy.yml의 permissions에 contents: write 포함 확인
- [ ] main 브랜치에 커밋/push
- [ ] GitHub Actions 탭에서 워크플로우 실행 확인
- [ ] 배포 완료 후 https://사용자명.github.io/저장소명/ 에서 확인

---

## 🔗 참고 자료

- [GitHub Pages 공식 문서](https://docs.github.com/en/pages)
- [GitHub Actions 워크플로우 문법](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages)
- [Vite 배포 가이드](https://vitejs.dev/guide/static-deploy.html#github-pages)

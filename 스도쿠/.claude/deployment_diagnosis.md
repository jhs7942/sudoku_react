# GitHub Pages 배포 진단 가이드

## 🔍 **1단계: 배포 상태 확인**

### Actions 워크플로우 확인
```
https://github.com/jhs7942/sudoku_react/actions
```

**확인 항목:**
- [ ] "Deploy to GitHub Pages" 워크플로우 존재?
- [ ] 가장 최신 실행이 **초록색 ✅** (성공)?
  - ❌ 빨간색 (실패) → "Deploy to GitHub Pages" 클릭 후 에러 로그 확인
  - ⏳ 노란색 (진행 중) → 3-5분 대기 후 새로고침
- [ ] gh-pages 브랜치가 생성되어 있음?

---

## 🖥️ **2단계: 브라우저 개발자 도구 진단**

https://jhs7942.github.io/sudoku_react/ 접속 후:

### 2-1. Console 탭 (F12 → Console)

**에러 메시지 확인:**
```javascript
// ❌ 이런 에러가 있으면 문제:

// 유형 1: 자산 로드 실패
Failed to load resource: the server responded with a status of 404
  /sudoku_react/assets/index-*.js
  /sudoku_react/assets/index-*.css

// 유형 2: 모듈 에러
Uncaught SyntaxError: Unexpected token '<' in JSON at position 0
Uncaught ReferenceError: React is not defined

// 유형 3: 앱 초기화 에러
Uncaught TypeError: Cannot read property 'getElementById' of null
```

**해결책 정보:**
- `404 에러`: 경로 문제 (base URL) → 가이드 아래 참고
- `Unexpected token '<'`: 자산 파일이 HTML 응답 받음 (경로 잘못됨)
- `Cannot read property`: React 앱이 `<div id="root"></div>`를 찾지 못함

### 2-2. Network 탭 (F12 → Network)

**상태 코드 확인:**
```
┌─────────────────────────────┬────────┬──────────────────┐
│ 파일                         │ 상태   │ 예상              │
├─────────────────────────────┼────────┼──────────────────┤
│ https://jhs7942.github.io    │ 200    │ ✓ HTML 로드됨    │
│ /sudoku_react/              │ 200    │ ✓ 리디렉트       │
│ index.html                  │ 200    │ ✓ 로드됨         │
│ index-*.js                  │ 200    │ ✓ JavaScript     │
│ index-*.css                 │ 200    │ ✓ Stylesheet     │
│ vite.svg                    │ 200    │ ✓ Favicon        │
└─────────────────────────────┴────────┴──────────────────┘

만약 404가 있으면:
- 404 파일명 클릭
- Request URL 확인
- 실제 저장소의 파일 위치와 비교
```

### 2-3. Application 탭 (F12 → Application)

**로컬 스토리지 / 캐시 확인:**
```
☐ Local Storage: 스도쿠 게임 상태 저장되는지 확인
☐ Session Storage: 임시 데이터
☐ Cache Storage: 서비스 워커 캐시 (아직 구현 안 함)
```

---

## 🚨 **3단계: 문제별 해결책**

### 증상 A: 완전히 흰 화면 (아무것도 안 보임)

**원인 1: JS 파일을 받지 못함 (404)**
```bash
# 확인: Network 탭에서 index-*.js 상태 확인
# 상태: 404? → base 경로 문제

# 해결:
# vite.config.ts 재확인
base: '/sudoku_react/'  # ← 끝에 슬래시 필수!

npm run build
git add dist/ vite.config.ts
git commit -m "fix: base 경로 재확인"
git push
```

**원인 2: React 앱이 #root 엘리먼트를 찾지 못함**
```html
<!-- index.html에 반드시 있어야 함 -->
<body>
  <div id="root"></div>  <!-- ← 필수! -->
</body>
```

**원인 3: GitHub Pages 배포 미완료**
```
https://github.com/jhs7942/sudoku_react/actions 에서
"Deploy to GitHub Pages" 워크플로우가 ✅ (성공)일 때까지 대기
```

---

### 증상 B: "Cannot find module" 에러

```javascript
Uncaught Error: Cannot find module '@/...'
```

**해결:**
```bash
# vite.config.ts 경로 별칭 재확인
# tsconfig.json 경로 별칭 동기화 확인

npm run build  # 재빌드
git push       # 푸시
```

---

### 증상 C: favicon 404 (약간 불편하지만 앱은 작동)

```
Failed to load resource: vite.svg (404)
```

**이미 수정됨!**
- 최신 코드: `href="vite.svg"` (상대경로)
- GitHub에 푸시된 상태 확인

---

## 📋 **4단계: 완전 진단 체크리스트**

```
배포 관련
☐ Actions: "Deploy to GitHub Pages" ✅ 성공 상태
☐ Branches: gh-pages 브랜치 존재
☐ Settings → Pages: Source = "gh-pages" branch, Folder = "/" (root)

코드 확인
☐ index.html: <div id="root"></div> 존재
☐ vite.config.ts: base: '/sudoku_react/'
☐ src/main.tsx: ReactDOM.createRoot 올바르게 설정

브라우저 확인
☐ Console 탭: 빨간 에러 없음
☐ Network 탭: 모든 자산 200 OK
☐ Application 탭: localStorage 접근 가능
☐ 게임 화면: 완전히 로드됨, 상호작용 가능

성능 확인
☐ JS 파일: ~160KB (정상 크기)
☐ CSS 파일: ~12KB (정상 크기)
☐ 로딩 시간: 1-3초 이내
```

---

## 🔧 **5단계: 강제 새로고침**

브라우저 캐시가 오래된 버전을 표시할 수 있습니다:

```
Windows/Linux: Ctrl + Shift + Delete (캐시 삭제)
Mac: Cmd + Shift + Delete (캐시 삭제)
또는: Incognito/Private 모드에서 재접속
```

---

## 📞 **6단계: 최후의 수단 - 수동 배포**

GitHub Actions가 작동하지 않으면:

```bash
# 로컬에서 수동 배포
npm run build

# dist 폴더를 gh-pages 브랜치에 배포
git subtree push --prefix dist origin gh-pages

# 3-5분 후 https://jhs7942.github.io/sudoku_react/ 접속
```

---

## 💡 **특수 상황 해결**

### 상황 1: 최신 푸시 후에도 구버전이 표시됨

```bash
# GitHub Pages 캐시 초기화
# → 아래 링크를 몇 번 방문해서 캐시 초기화
# https://github.com/jhs7942/sudoku_react/actions

# 로컬에서 강제 새로고침
# Windows: Ctrl + F5
# Mac: Cmd + Shift + R
```

### 상황 2: gh-pages 브랜치가 없음

```bash
# GitHub Actions가 처음 실행되어야 자동 생성됨
# Actions 탭에서 "Deploy to GitHub Pages" 완료 대기

# 또는 수동으로:
npm run build
git subtree push --prefix dist origin gh-pages
```

### 상황 3: Pages 설정을 수동으로 지정해야 함

```
GitHub Repository Settings → Pages
┌─────────────────────────────────────────┐
│ Build and deployment                    │
│ Source: Deploy from a branch            │
│ Branch: gh-pages ▼ / (root) ▼           │
│ [Save]                                  │
└─────────────────────────────────────────┘
```

---

## 📝 **마지막 팁**

**배포 후 확인 순서:**
1. GitHub Actions ✅ 완료 확인 (2-3분 대기)
2. https://github.com/jhs7942/sudoku_react/branches 에서 gh-pages 생성 확인
3. 브라우저 새로고침 (Ctrl+Shift+Delete 캐시 삭제)
4. https://jhs7942.github.io/sudoku_react/ 접속
5. F12 Console에서 에러 확인

**문제 발생 시:**
- 어떤 화면이 보이는가? (흰 화면 / 404 / 에러 메시지)
- F12 Console 에러 메시지 전체 캡처
- F12 Network 탭에서 404 파일명 확인
→ 이 정보들을 알려주면 정확한 해결책을 제시할 수 있습니다!

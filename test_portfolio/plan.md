# 포트폴리오 웹사이트 구현 계획

## 📋 프로젝트 개요

정현승 님의 개인 포트폴리오 웹사이트를 구축합니다.
- **기술**: HTML, CSS, JavaScript + Tailwind CSS CDN
- **배포**: 단일 HTML 파일 (`index.html`)
- **디자인**: 모던하고 깔끔한 라이트 테마 (밝고 세련됨)

---

## 🎨 디자인 시스템

### 색상 팔레트
| 용도 | 색상 | Tailwind |
|------|------|---------|
| 배경 | #ffffff | white |
| 카드/서피스 | #f8fafc | slate-50 |
| 텍스트 주요 | #0f172a | slate-900 |
| 텍스트 보조 | #64748b | slate-500 |
| 강조색 | #6366f1 | indigo-500 |
| 보조 강조 | #3b82f6 | blue-500 |
| 그라디언트 | indigo → blue | - |

### 폰트
- **주 폰트**: Inter (Google Fonts, 300~800 weight)
- **코드**: monospace (기술 배지)

---

## 📄 파일 구조

```
test_portfolio/
├── index.html          ← 메인 파일 (HTML + CSS + JS)
├── plan.md             ← 이 파일
└── README.md           (선택사항)
```

---

## 🏗️ HTML 섹션 구성

### 1️⃣ Navbar (고정 상단)
```
[정현승.] [About] [Skills] [Projects] [Contact] [연락하기]
```
- 배경: white + 살짝 투명한 그라스모르피즘
- 스크롤 시 그림자 추가
- 모바일: 햄버거 메뉴 → 드롭다운 패널

### 2️⃣ Hero (min-h-screen)
```
배경 블롭 (indigo + blue 밝은 톤, 투명도)
┌─────────────────────────┐
│  Frontend Developer     │
│  안녕하세요, 정현승입니다 │  (인디고→블루 그라디언트)
│  새로움을 찾아나서는...  │
│ [프로젝트 보기] [연락하기] │
└─────────────────────────┘
```

### 3️⃣ About (2-column)
```
[아바타: 정]  [소개글 + 정보 칩]
```
- 아바타: 인디고→블루 그라디언트 사각형 (w-64 h-64)
- 칩: 밝은 배경 (slate-100) + 다크 텍스트 (slate-700)
- 📍 대한민국 | 💼 프론트엔드 개발자 | 🎓 지속 학습 중

### 4️⃣ Skills (4-column grid)
| 스킬 | 설명 | 레벨 |
|------|------|------|
| HTML5 | 시맨틱 마크업 | 90% |
| CSS3 | 레이아웃, 애니메이션 | 85% |
| JavaScript | ES6+, DOM 조작 | 80% |
| React | 컴포넌트, Hooks | 75% |

- 카드 배경: white + 가는 보더 (slate-200)
- 카드 호버: 보더 색상 변경(indigo) + 그림자 추가
- 프로그레스 바: 인디고 그라디언트, 스크롤 진입 시 애니메이션
- 하단: 밝은 배경 배지 (Git, Tailwind CSS, Responsive, REST API)

### 5️⃣ Projects (3-column grid)
```
[TodoList App]      [Weather Dashboard]     [Portfolio Website]
React, Hooks        JavaScript, API         HTML, Tailwind, JS
indigo→blue         blue→cyan               purple→indigo
```
- 카드 배경: white + 가는 보더 (slate-200)
- 카드 호버: 보더 색상 변경 + 그림자 + Y축 -2px 이동
- 이미지 오버레이: 스크롤 진입 시 어두운 배경 표시
- 각 프로젝트: 이미지 영역 + 태그 + 제목 + 설명

### 6️⃣ Contact (2-column)
```
[연락처]              [문의 폼]
- 📧 email           - 이름
- 🔗 social links    - 이메일
                    - 메시지
                    - [메시지 보내기]
```

### 7️⃣ Footer
```
정현승. © 2026. All rights reserved.        [맨 위로 ↑]
```

---

## 🎬 JavaScript 인터랙션

### 1. 모바일 메뉴 토글
```javascript
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

// 메뉴 링크 클릭 시 닫기
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
});
```

### 2. Navbar 스크롤 효과
```javascript
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('shadow-xl', 'shadow-black/20');
  } else {
    navbar.classList.remove('shadow-xl', 'shadow-black/20');
  }
});
```

### 3. 활성 nav 링크 하이라이트 (IntersectionObserver)
```javascript
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        const isActive = link.getAttribute('href') === '#' + entry.target.id;
        link.classList.toggle('text-white', isActive);
        link.classList.toggle('text-slate-400', !isActive);
      });
    }
  });
}, { threshold: 0.5 });

sections.forEach(section => observer.observe(section));
```

### 4. 스크롤 진입 애니메이션
```css
/* CSS */
.fade-up {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}
```

```javascript
/* JS */
const fadeEls = document.querySelectorAll('.fade-up');

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

fadeEls.forEach(el => fadeObserver.observe(el));
```

### 5. 스킬 바 애니메이션
```javascript
const skillBars = document.querySelectorAll('.skill-bar');

const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target;
      target.style.width = target.dataset.width; // e.g. "90%"
      barObserver.unobserve(target);
    }
  });
}, { threshold: 0.5 });

skillBars.forEach(bar => barObserver.observe(bar));
```

### 6. 연도 자동 업데이트
```javascript
document.getElementById('year').textContent = new Date().getFullYear();
```

---

## 🎯 Tailwind CSS 유틸리티 패턴

### 공통 패턴
```html
<!-- 섹션 -->
<section class="py-24 px-4 bg-white">
  <div class="max-w-6xl mx-auto">...</div>
</section>

<!-- 카드 -->
<div class="bg-white border border-slate-200 rounded-2xl p-6
            hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-100
            transition-all duration-300 hover:-translate-y-1">
  ...
</div>

<!-- 버튼 -->
<button class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700
               text-white font-semibold rounded-xl
               transition-all hover:scale-105 active:scale-95">
  버튼
</button>

<!-- 그라디언트 텍스트 -->
<span class="bg-gradient-to-r from-indigo-600 via-blue-600 to-blue-500
            bg-clip-text text-transparent font-bold">
  그라디언트 텍스트
</span>
```

### 반응형 breakpoint
| 화면 | 설정 |
|------|------|
| 모바일 | 기본 (sm: 640px) |
| 태블릿 | md: 768px |
| 데스크톱 | lg: 1024px |

```html
<!-- 예시 -->
<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">...</div>
```

---

## 📱 반응형 디자인

| 요소 | 모바일 | md (768px) | lg (1024px) |
|------|--------|-----------|-----------|
| Navbar 링크 | 숨김 (햄버거) | flex row | flex row |
| Hero 텍스트 | text-5xl | text-6xl | text-7xl |
| About | 1단 | 2단 | 2단 |
| Skills | 1열 | 2열 | 4열 |
| Projects | 1열 | 2열 | 3열 |
| Contact | 1단 | 2단 | 2단 |
| Padding | px-4 py-16 | py-24 | py-24 |

---

## ✨ 커스텀 CSS (`<style>` 블록)

```css
/* 본문 배경 */
body {
  background-color: #ffffff;
  color: #0f172a;
}

/* 스크롤바 */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #f8fafc;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #6366f1;
}

/* 선택 색상 */
::selection {
  background: #6366f1;
  color: white;
}

/* 포커스 링 (접근성) */
a:focus-visible,
button:focus-visible {
  outline: 2px solid #6366f1;
  outline-offset: 3px;
}

/* 스킬 바 초기 상태 */
.skill-bar {
  width: 0;
  transition: width 1s ease;
}
```

---

## 🚀 구현 순서

1. **HTML 셸** — 기본 구조 + Tailwind CDN + Google Fonts
2. **Navbar** — 고정 상단바 + 햄버거 메뉴
3. **Hero** — 타이틀 + 블롭 배경 + CTA
4. **About** — 2단 레이아웃 + 아바타
5. **Skills** — 4열 그리드 + 프로그레스 바
6. **Projects** — 3열 그리드 + 카드
7. **Contact** — 폼 + 연락처
8. **Footer** — 저작권
9. **`<style>` 블록** — 커스텀 CSS
10. **`<script>` 블록** — 6가지 JS 인터랙션

---

## ✅ 검증 체크리스트

- [ ] 브라우저에서 `index.html` 직접 열기 (file:// 프로토콜)
- [ ] 모바일 뷰 (DevTools): 햄버거 메뉴 열기/닫기 동작
- [ ] 스크롤: Navbar 배경 변화 확인
- [ ] Skills 섹션: 스크롤 진입 → 프로그레스 바 애니메이션
- [ ] Projects 카드 호버: 오버레이 + 링크 표시
- [ ] 앵커 링크: 부드러운 스크롤
- [ ] 반응형: 모바일(375px) / 태블릿(768px) / 데스크톱(1024px) 테스트
- [ ] 접근성: 포커스 링 확인 (Tab 키로 네비게이션)

---

## 📝 노트

- **Tailwind CDN JIT**: 모든 클래스가 자동으로 사용 가능 (purge 불필요)
- **부드러운 스크롤**: `<html class="scroll-smooth">` (CSS만 사용)
- **그라디언트 텍스트**: `bg-clip-text text-transparent` 조합 필수
- **IntersectionObserver**: 모던 브라우저 95%+ 지원 (IE 제외)
- **폼 제출**: Formspree 또는 JS alert으로 시뮬레이션 (백엔드 없음)

---

## 🌟 라이트 테마 특징

- ✨ **밝고 세련됨**: 흰색 배경으로 깔끔한 느낌
- 🎨 **인디고 + 블루 강조**: 현대적이고 신뢰감 있는 색상
- 📱 **높은 가독성**: 어두운 텍스트(slate-900) + 밝은 배경
- 💼 **프로페셔널**: 기술 업계 표준 색상 조합
- ♿ **접근성**: 충분한 명도 대비(contrast ratio)

---

**작성 날짜**: 2026-03-01
**상태**: 라이트 테마 적용 완료 ✨
**버전**: v1.1 (라이트 테마)

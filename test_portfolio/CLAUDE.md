# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**정현승's Personal Portfolio Website** — A modern, single-page portfolio built with vanilla HTML, CSS, and JavaScript using Tailwind CSS CDN for styling.

- **Owner**: 정현승 (Hyun Seung Jung)
- **Role**: Frontend Developer
- **Tech Stack**: HTML5, CSS3 (Tailwind), Vanilla JavaScript
- **Build System**: None (no build tools; pure static HTML)
- **Deployment**: Single `index.html` file (can be deployed to GitHub Pages, Netlify, any static hosting)
- **Language**: Korean (한국어)

---

## Architecture & Structure

### Single-File Design
The entire website is contained in a single `index.html` file:
- **HTML Structure**: 7 main sections (Navbar, Hero, About, Skills, Projects, Contact, Footer)
- **Styling**: Combination of Tailwind CSS CDN utilities + custom `<style>` block
- **JavaScript**: Vanilla JS in `<script>` block before `</body>`

**Why single file?**
- Easy deployment (no build process, no configuration)
- No external dependencies beyond CDN
- Fast to load and cached efficiently
- Portable (works anywhere HTML files are served)

### Key Technical Decisions
1. **Tailwind CSS CDN v3** (JIT mode) — All utility classes are dynamically available
2. **Google Fonts (Inter)** — Downloaded via `<link>` tag for typography
3. **IntersectionObserver API** — For scroll-triggered animations and active nav highlighting
4. **LocalStorage** — Not used; form submission shows alert (demo only)

---

## Design System

### Color Palette (Light Theme)
| Purpose | Hex | Tailwind | Usage |
|---------|-----|----------|-------|
| Background | #ffffff | white | Page base |
| Card/Surface | #f8fafc | slate-50 | Section backgrounds |
| Text Primary | #0f172a | slate-900 | Headings, main text |
| Text Secondary | #64748b | slate-500 | Body text, captions |
| Accent | #6366f1 | indigo-600 | Buttons, highlights |
| Accent Hover | #3b82f6 | blue-500 | Hover states |
| Gradient | indigo→blue | - | Hero title, bars |
| Border | #e2e8f0 | slate-200 | Card borders |

### Typography
- **Font Family**: Inter (300, 400, 500, 600, 700, 800 weights from Google Fonts)
- **Headings**: font-bold, tracking-tight, text-slate-900
- **Body**: font-normal, leading-relaxed, text-slate-600
- **Badges**: text-xs, font-medium, px-2 py-1

### Spacing System
- Section padding: `py-24 px-4`
- Container max-width: `max-w-6xl`
- Gap between grid items: `gap-6` (cards), `gap-8` (projects)
- Responsive: `px-4` on mobile, `px-6 lg:px-8` on larger screens

---

## File Breakdown

### `index.html` (Main File)

#### `<head>` Section
- Tailwind CSS v3 CDN script
- Google Fonts link (Inter, weights 300–800)
- Custom `<style>` block with:
  - Font family declaration
  - Scrollbar styling
  - Selection and focus-ring styles
  - Animation keyframes (`.fade-up`, `.skill-bar`)

#### `<body>` Structure
1. **Navbar** (`<nav id="navbar">`)
   - Fixed positioning (`fixed top-0 z-50`)
   - Desktop menu: horizontal links + CTA button
   - Mobile menu: hamburger toggle → dropdown panel
   - Classes: `.nav-link` for active highlighting

2. **Hero Section** (`<section id="home">`)
   - Min-height screen, centered content
   - Decorative background blobs (indigo + blue, with `animate-pulse`)
   - Main heading with gradient text
   - Two CTA buttons: primary (filled) + secondary (outlined)
   - Scroll indicator at bottom

3. **About Section** (`<section id="about">`)
   - Two-column grid (avatar + bio text)
   - Avatar: gradient square (w-64 h-64) with initials "정"
   - Bio with 3 info chips (location, role, status)
   - CTA button

4. **Skills Section** (`<section id="skills">`)
   - 4-column card grid (responsive: 1 col mobile → 2 col tablet → 4 col desktop)
   - Each skill card: emoji icon, title, description, progress bar
   - Progress bars use `.skill-bar` class (animated on scroll)
   - Skill levels: HTML 90%, CSS 85%, JS 80%, React 75%
   - "Also familiar with" badges at bottom

5. **Projects Section** (`<section id="projects">`)
   - 3-column card grid (responsive: 1 col mobile → 2 col tablet → 3 col desktop)
   - 3 sample projects: TodoList, Weather Dashboard, Portfolio
   - Each card: gradient mockup image, tags, title, description, links (Live/GitHub)
   - Hover overlay shows action buttons

6. **Contact Section** (`<section id="contact">`)
   - Two-column layout: left (email, location, social) + right (contact form)
   - Form fields: name, email, message textarea
   - Form submission shows alert (no backend)
   - Social links: GitHub, LinkedIn, Twitter

7. **Footer** (`<footer>`)
   - Copyright info with dynamic year
   - "Back to top" link

#### `<script>` Block (6 JS Functions)

All JavaScript is vanilla (no libraries). Key functions:

1. **Mobile Menu Toggle** — `click` listener on `#menu-btn`, toggles `.hidden` on `#mobile-menu`
2. **Navbar Scroll Effect** — Adds shadow + changes opacity on scroll >50px
3. **Active Nav Link** — IntersectionObserver tracks current section, highlights matching nav link
4. **Fade-Up Animation** — IntersectionObserver adds `.visible` class to `.fade-up` elements on scroll
5. **Skill Bar Animation** — IntersectionObserver fills `.skill-bar` from width 0 to `data-width` value
6. **Year Auto-Update** — Sets `#year` text to `new Date().getFullYear()`

---

## How to Customize

### Change Personal Info
Replace in `index.html`:
- **Name**: Line 6 (title tag), line 69 (navbar logo), line 70 (hero heading), etc.
- **Email**: `hyunseung@email.com` → your email (line 483)
- **Social Links**: GitHub, LinkedIn, Twitter URLs (lines 524–536)
- **Bio Text**: Hero subtitle (line 322), About section (lines 354–359)

### Update Projects
In the Projects section, modify each project card:
- **Image placeholder**: Change gradient class (e.g., `from-indigo-600 to-blue-500`)
- **Emoji icon**: Update emoji in mockup area
- **Tags**: Modify `<span>` badges with tech tags
- **Title & Description**: Swap project name and details
- **Links**: Update Live Demo and GitHub URLs (placeholders use `href="#"`)

### Change Color Scheme
The light theme uses indigo (#6366f1) and blue (#3b82f6) as accent colors.

To switch colors:
1. Find-replace in `<style>` block: `#6366f1` → your primary color hex
2. Find-replace Tailwind classes: `indigo-600` → your color (e.g., `blue-600`, `purple-600`)
3. Update gradient: `from-indigo-600 via-blue-600 to-blue-500` → your color sequence
4. Adjust complementary Tailwind classes (shadows: `shadow-indigo-100` → `shadow-blue-100`, etc.)

### Add New Sections
1. Add a new `<section id="your-id">` before the footer
2. Add navigation link in navbar: `<a href="#your-id" class="nav-link">Your Section</a>`
3. Wrap content in `.fade-up` class for scroll animation
4. Navbar will auto-highlight the active section via IntersectionObserver

### Modify Skills or Tech Stack
In the Skills section, update:
- Card emoji (line ~403)
- Skill name (h3 tag)
- Skill description (p tag)
- Progress bar `data-width` attribute (e.g., `data-width="85%"`)
- "Also familiar with" badges (line ~450)

### Enable Form Submission (Backend Integration)
Currently, the form shows an alert on submit. To integrate with a backend:
1. **Option A (Formspree)**: Replace `onsubmit="handleFormSubmit(event)"` with `action="https://formspree.io/f/{YOUR_ID}"` and `method="POST"`
2. **Option B (Custom API)**: Modify `handleFormSubmit()` function to fetch to your endpoint

---

## Common Tasks

### Preview Locally
1. Open `index.html` in a browser (File → Open or drag into browser)
2. Or use any local HTTP server: `python -m http.server 8000` then navigate to `http://localhost:8000`

### Deploy
Since there's no build step:
- **GitHub Pages**: Push to repo, enable Pages in settings → serves `index.html` automatically
- **Netlify**: Drag-and-drop `index.html` into Netlify
- **Vercel**: Deploy single HTML file
- **Any Static Host**: Upload `index.html` file

### Mobile Testing
- Use Chrome DevTools Device Toolbar (F12 → toggle device mode)
- Test hamburger menu, responsive grids, touch interactions

### Add/Remove Sections
- Add new `<section id="...">` with `.fade-up` wrapper
- Add nav link in navbar
- NavBar's IntersectionObserver will auto-detect and highlight

---

## JavaScript Patterns & IntersectionObserver Notes

### IntersectionObserver Setup
Three observers are used:
1. **Nav link active state** — threshold: 0.5 (section is 50% visible)
2. **Fade-up animations** — threshold: 0.15 (element enters 15% from bottom)
3. **Skill bar fills** — threshold: 0.5 (section is 50% visible)

Threshold value determines when the intersection callback fires. Lower threshold (0.15) triggers animations sooner when scrolling.

### CSS Animations
- **fade-up**: Starts with `opacity: 0; transform: translateY(30px)` → `.visible` class sets `opacity: 1; transform: translateY(0)`
- **skill-bar**: Starts with `width: 0` → animated to `data-width` value (e.g., "90%") via inline style

### Scroll Behavior
- `<html class="scroll-smooth">` — CSS scroll-behavior smooth (no JS needed)
- Anchor links (e.g., `href="#about"`) automatically scroll smoothly to target

---

## Notes on Dependencies

- **Tailwind CSS CDN**: v3+ with JIT mode — all utility classes in HTML are available without configuration
- **Google Fonts**: Inter loaded via `<link>` — internet required for first load; font will cache
- **No npm/package.json**: This is intentional; no build tools reduce complexity

---

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IntersectionObserver API: 95%+ support (all modern browsers; IE not supported)
- CSS Grid/Flexbox: Full support
- CSS smooth scroll: Full support

---

## Performance Considerations

- **Single HTML file**: Fast initial load (no additional requests for HTML/CSS/JS)
- **Tailwind CDN**: ~50KB compressed; cached by browser on repeat visits
- **Google Fonts**: ~30–40KB; cached by Google
- **No images**: Only SVG icons and emoji → lightweight
- **No animations on mobile**: Consider disabling `animate-pulse` on mobile if performance is a concern

---

## Known Limitations & TODOs

1. **Form submission**: Currently shows alert only; no backend integration
2. **Project links**: Placeholder `href="#"` — update with real URLs
3. **Social media links**: Placeholder URLs — update with real profiles
4. **Accessibility**: Focus states are styled; add `aria-label` tags to icon buttons if needed
5. **Dark mode**: Not implemented; light theme only

---

## Future Enhancements

- Add dark mode toggle (localStorage to persist preference)
- Backend form submission (Formspree, SendGrid, or custom)
- Blog section with markdown support
- Dynamic project data (fetch from JSON or API)
- Multi-language support (currently Korean)
- PWA features (service worker, offline support)

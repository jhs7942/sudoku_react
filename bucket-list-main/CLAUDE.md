# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A lightweight, framework-free bucket list web application. Features: item CRUD, completion tracking, real-time stats, filtering, and LocalStorage persistence. Single-page application with no build process or dependencies (uses Tailwind CSS CDN).

## Running the Project

**Option 1: Direct file (simplest)**
```bash
# Open index.html in a browser
open index.html  # macOS
explorer index.html  # Windows
```

**Option 2: Local development server**
```bash
# Python 3.x
python -m http.server 8000
# Then visit http://localhost:8000

# Or use Node http-server
npx http-server
```

**Option 3: VS Code Live Server**
- Install "Live Server" extension
- Right-click index.html → "Open with Live Server"

## Code Architecture

### Two-Layer Design

**Data Layer** (`js/storage.js`) - BucketStorage Object
- Manages all LocalStorage operations
- Pure data functions with no UI coupling
- Methods: `load()`, `save()`, `addItem()`, `updateItem()`, `deleteItem()`, `toggleComplete()`, `getStats()`, `getFilteredList()`
- Error handling: wraps localStorage calls in try-catch

**Presentation Layer** (`js/app.js`) - BucketListApp Class
- Manages DOM manipulation and user interactions
- Reads data via BucketStorage calls, re-renders after mutations
- Caches DOM elements in `cacheElements()` for performance
- Exports global `app` instance for inline event handlers (e.g., `onclick="app.handleToggle(id)"`)
- Key pattern: `bindEvents()` → state change → `render()` (full re-render)

### Data Model

Bucket items stored as objects in LocalStorage under key `bucketList`:
```javascript
{
  id: "1730880000000",              // timestamp-based unique ID
  title: "Goal text",               // user input
  completed: false,                 // boolean
  createdAt: "2025-11-06T...",     // ISO 8601 string
  completedAt: null                 // null or ISO 8601 string
}
```

Items stored as JSON array, newest first (unshift on add).

## Key Implementation Details

### Security
- **HTML escaping**: `app.escapeHtml()` prevents XSS on user-entered text
- Applied to item titles in both modal and display

### UI Patterns
- **Modal toggle**: uses `classList.add/remove('hidden'/'flex')` for visibility
- **Filter state**: `currentFilter` property tracks active filter, re-render shows filtered list
- **Empty state**: manually show/hide based on filtered list length
- **Inline handlers**: event listeners use inline `onclick` with arrow functions (e.g., `onclick="app.handleToggle('${item.id}')"`), requires proper escaping

### Styling
- **Framework**: Tailwind CSS (CDN) for utilities
- **Custom CSS** (`css/styles.css`): filter button states, animations (slideIn/fadeIn/scaleIn), responsive breakpoints (640px mobile), dark mode media query
- **No build step**: all CSS is loaded via CDN or inline file

### Browser Storage
- LocalStorage capacity: ~5-10MB per domain (sufficient for typical bucket list)
- No indexing/querying—loads entire list into memory each operation
- Scalability: acceptable for <1000 items; if more, consider refactoring to minimize load calls

## Development Notes

### Common Tasks

**Adding a new field to items**
1. Update data structure in `storage.js` `addItem()`
2. Update `createBucketItemHTML()` in `app.js` to display it
3. Test that storage/retrieval works across page reload

**Filtering implementation**
- No separate state array—`getFilteredList()` filters on demand
- `handleFilter()` updates `currentFilter` and calls `render()`
- Full re-render re-builds all DOM (acceptable performance for typical list size)

**Modal behavior**
- `editModal` div toggles visibility with flex/hidden classes
- Backdrop click closes modal (event delegation on editModal itself)
- No separate state needed—id stored in `editingId`

### Testing
No automated tests present. Manual testing:
- Add/edit/delete items, verify persistence across reload
- Try all filters
- Test responsive layout at 640px breakpoint
- Check HTML escaping with special characters (quotes, <, >, etc.)

### Browser Compatibility
LocalStorage available in all modern browsers (IE10+). No polyfills needed for ES6 features used (arrow functions, template literals, `const/let`).

## Code Quality

**Strengths**
- Clear separation of data (storage.js) and presentation (app.js)
- Comprehensive comments in both modules
- Korean comments aid maintainability for target users
- DOM caching prevents repeated `getElementById()` calls
- Error handling on storage operations

**Potential Improvements**
- No input validation beyond `.trim()` and required attribute
- No duplication-check (allows identical items)
- Stats recalculated on every render (load → calculate instead of caching)
- No undo/redo functionality

# Research: Intelligent Inventory Dashboard

**Feature**: 001-inventory-dashboard  
**Date**: 2026-05-01  
**Purpose**: Consolidate technology decisions, best practices, and patterns for the chosen stack.

---

## 1. React + TypeScript + Vite Project Setup

**Decision**: Use Vite 5 with React 18 and TypeScript strict mode.

**Rationale**: Vite provides instant HMR, fast builds, and first-class TypeScript/React support. It is the modern standard for React SPAs, replacing CRA. TypeScript strict mode enforces null safety, no implicit any, and strict function types—aligned with Constitution Principle IV.

**Alternatives considered**:
- Create React App (CRA): Deprecated, slow builds, no longer maintained.
- Next.js: Server-side features unnecessary for a frontend-only SPA.
- Parcel: Viable but less ecosystem support and plugin availability.

**Best practices**:
- Use `@vitejs/plugin-react-swc` for fastest dev server refresh.
- Configure `tsconfig.json` with `strict: true`, `noUncheckedIndexedAccess: true`.
- Use path aliases (`@/components`, `@/stores`) to avoid deep relative imports.

---

## 2. Tailwind CSS + shadcn/ui Design System

**Decision**: Tailwind CSS v44 for utility-first styling; shadcn/ui as the component library.

**Rationale**: Tailwind eliminates CSS naming conflicts and enables rapid UI iteration. shadcn/ui provides accessible, composable primitives (Dialog, Drawer, Table, Badge, Card) that are copy-pasted into the project—not installed as a dependency—giving full control over styling and behavior.

**Alternatives considered**:
- Material UI (MUI): Heavy bundle, opinionated styling, harder to customize.
- Chakra UI: Good accessibility but larger runtime footprint.
- Radix + custom CSS: shadcn/ui is essentially this, pre-styled with Tailwind.

**Best practices**:
- Install only needed shadcn/ui components (Button, Badge, Card, Table, Dialog, Drawer, Select, Input).
- Use CSS variables for theme colors so the palette is centrally managed.
- Avoid inline `style` attributes; use Tailwind classes exclusively.
- Configure `tailwind.config.ts` with custom colors for aging severity levels.

---

## 3. State Management with Zustand

**Decision**: Zustand 5 with separate store slices per domain (inventory, action

**Rationale**: Zustand is lightweight (~1KB), requires no providers/context wrappers, supports TypeScript natively, and enables fine-grained subscriptions to prevent unnecessary re-renders. Store slices keep concerns separated while sharing a single store instance.

**Alternatives considered**:
- React Context + useReducer: Works for small state but causes re-render cascades without memoization gymnastics.
- Redux Toolkit: More boilerplate; overkill for a single-page app with 3 store slices.
- Jotai/Recoil: Atom-based model is powerful but less intuitive for action-log style CRUD.

**Best practices**:
- One file per store slice: `inventoryStore.ts`, `actionStore.ts`, `filterStore.ts`.
- Use `immer` middleware for immutable updates without spread noise.
- Derive computed values (KPIs, filtered lists) via selectors, not stored state.
- Persist action store to localStorage using Zustand `persist` middleware.

---

## 4. Mock Service Worker (MSW) for API Mocking

**Decision**: MSW 2 with request handlers in `src/mocks/handlers.ts`.

**Rationale**: MSW intercepts network requests at the service worker level, making mocks transparent to application code. The same handlers work in browser (dev mode) and test (node mode via `msw/node`), ensuring consistency between dev experience and test assertions.

**Alternatives considered**:
- JSON Server: Requires a running process; harder to integrate with tests.
- Inline mock data: No network delay simulation; doesn't test loading/error states.
- Mirage.js: Heavier; MSW has better TypeScript support and is more actively maintained.

**Best practices**:
- Define handlers for `GET /api/vehicles` and `GET /api/vehicles/:id/actions`.
- Use `delay()` in handlers to simulate realistic latency (200–500ms).
- Include error scenarios in handlers for testing error boundaries.
- Conditionally start MSW only in development/test (not production builds).
- Store vehicle fixture data in `src/mocks/data/vehicles.json` for easy editing.

---

## 5. Recharts for Data Visualization

**Decision**: Recharts 3 for KPI charts (bar chart for age distribu

**Rationale**: Recharts is React-native (uses React components, not DOM manipulation), supports responsive containers, and handles the chart types needed (Bar, Pie, Tooltip, Legend) with minimal configuration. It integrates naturally with React state and is well-typed.

**Alternatives considered**:
- Chart.js + react-chartjs-2: Canvas-based; less React-idiomatic; harder to style with Tailwind.
- Nivo: Beautiful but heavier; more features than needed.
- D3 directly: Too low-level for a demo-focused project.

**Best practices**:
- Wrap charts in `ResponsiveContainer` for automatic sizing.
- Compute chart data in utility functions, not inside components.
- Use memoization (`useMemo`) for chart data derivation to avoid recalculation on every render.
- Keep chart components under 100 lines each.

---

## 6. Testing Strategy (Vitest + React Testing Library)

**Decision**: Vitest as test runner; React Testing Library for component tests; MSW for network mocking in tests.

**Rationale**: Vitest is Vite-native (shares config, instant startup, ESM support). RTL enforces testing user-visible behavior rather than implementation details—aligned with Constitution Principle I. MSW integration via `msw/node` ensures tests hit the same mock handlers as dev mode.

**Alternatives considered**:
- Jest: Works but requires separate config from Vite; slower startup.
- Cypress Component Testing: Heavier; better for E2E than unit tests.
- Testing Library + Jest: Viable but Vitest is faster with Vite projects.

**Best practices**:
- Co-locate test files: `FilterBar.test.tsx` next to `FilterBar.tsx`.
- Test user interactions: click, type, select—not internal state.
- Use `screen.getByRole()` and accessible queries as primary selectors.
- Mock only external boundaries (MSW handlers, localStorage).
- Target: every component, every store action, every utility function has at least one test.
- Use `vi.useFakeTimers()` for testing time-dependent logic (days in stock).

---

## 7. Pagination Strategy for Large Lists

**Decision**: Client-side pagination with 25 items per page (configurable).

**Rationale**: With 100–200 vehicles and a max test scenario of 500, client-side pagination is simpler and faster than virtualization. The full dataset is already in memory (mocked), so no network overhead. Pagination provides clear navigation affordances for the demo video.

**Alternatives considered**:
- Virtual scrolling (react-window/react-virtual): More complex; harder to test; less visible in a demo.
- Infinite scroll: Less predictable UX; harder to "show the last page" in a demo.
- No pagination with full render: Violates Constitution Principle V for >50 items.

**Best practices**:
- Show page controls (Previous / Next / page numbers) below the table.
- Reset to page 1 when filters change.
- Display total count and current range ("Showing 26–50 of 142 vehicles").
- Keep pagination logic in a custom hook (`usePagination`) for reuse and testability.

---

## 8. localStorage Persistence Pattern

**Decision**: Use a dedicated `actionService.ts` with try/catch-guarded read/write functions to sync actions to localStorage, accessed by the Zustand `actionStore`.

**Rationale**: A service-backed approach provides explicit error handling for write failures (QuotaExceededError, private browsing), avoids coupling the store to a middleware, and gives full control over the serialization format. Actions are the only user-generated data that must survive refresh; vehicle data is re-fetched from mocks on load.

**Alternatives considered**:
- Zustand `persist` middleware: Simpler setup but hides error handling; write failures crash silently.
- IndexedDB: Overkill for simple JSON action logs.
- Session storage: Lost on tab close; doesn't meet persistence requirement.

**Best practices**:
- Namespace the storage key: `smart-inventory-actions`.
- Include a version number in persisted data for future migration.
- Gracefully handle `localStorage` being unavailable (private mode, quota exceeded).
- Clear stale data only on explicit user action, never automatically.

---

## Summary of Resolved Decisions

| Topic | Decision | Key Rationale |
|-------|----------|---------------|
| Build tool | Vite 5 + SWC | Fastest DX, native ESM |
| UI framework | React 18 + TypeScript strict | Type safety, component model |
| Styling | Tailwind CSS + shadcn/ui | Rapid iteration, accessible primitives |
| State | Zustand (sliced stores) | Lightweight, fine-grained subscriptions |
| API mocking | MSW 2 | Transparent to app code, reusable in tests |
| Charts | Recharts 3 | React-native, responsive, well-typed |
| Testing | Vitest + RTL + MSW | Fast, behavior-focused, Vite-native |
| Pagination | Client-side, 25/page | Simple for demo, meets perf threshold |
| Persistence | actionService → localStorage | Explicit error handling, versioned schema |

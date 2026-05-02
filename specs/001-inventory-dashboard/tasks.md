# Tasks: Intelligent Inventory Dashboard

**Input**: Design documents from `/specs/001-inventory-dashboard/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: REQUIRED — Constitution Principle I (Unit-Tested Frontend) is NON-NEGOTIABLE; SC-006 mandates ≥85% statement coverage with critical paths fully tested.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/` at repository root
- Test files co-located: `Component.test.tsx` next to `Component.tsx`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, tooling, and configuration

- [x] T001 Initialize Vite React TypeScript project with `npm create vite@latest . -- --template react-ts` and configure `vite.config.ts` with path aliases
- [x] T002 Install core dependencies: tailwindcss, postcss, autoprefixer, zustand, recharts, msw, uuid
- [x] T003 [P] Configure Tailwind CSS with `tailwind.config.ts` and custom theme colors for aging severity in `src/index.css`
- [x] T004 [P] Configure TypeScript strict mode in `tsconfig.json` with `strict: true`, `noUncheckedIndexedAccess: true`, and path aliases (`@/*`)
- [x] T005 [P] Configure ESLint + Prettier with `eslint.config.js` and `.prettierrc`
- [x] T006 [P] Configure Vitest with `vitest.config.ts` including path aliases, jsdom environment, and setup file
- [x] T007 Install and initialize shadcn/ui with `components.json`; add base primitives (Button, Badge, Card, Table, Input, Select, Dialog, Drawer) in `src/components/ui/`
- [x] T008 Create TypeScript type definitions for Vehicle in `src/types/vehicle.ts` and Action in `src/types/action.ts`
- [x] T009 Create mock vehicle dataset (150 vehicles, realistic makes/models/ages/prices across 4 locations) in `src/mocks/data/vehicles.json`
- [x] T010 Configure MSW browser worker in `src/mocks/browser.ts` and handlers in `src/mocks/handlers.ts` for GET /api/vehicles, GET /api/vehicles/:id, GET /api/locations
- [x] T011 Create application entry point `src/main.tsx` with conditional MSW initialization and React mount
- [x] T012 Create root layout shell in `src/App.tsx` with header area, KPI section, filter bar, table area, and chart area placeholders

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core service layer, state management, and utility functions that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T013 Implement vehicle service layer in `src/services/vehicleService.ts` with fetchVehicles() and fetchLocations() functions calling /api endpoints
- [x] T014 [P] Implement action service layer in `src/services/actionService.ts` with getActions(), addAction(), getActionsForVehicle() functions
- [x] T015 Implement inventory Zustand store in `src/stores/inventoryStore.ts` with vehicles state, loading/error states, and fetch action
- [x] T016 [P] Implement action Zustand store in `src/stores/actionStore.ts` with service-backed localStorage persistence via actionService, add/get actions
- [x] T017 [P] Implement aging utility functions in `src/utils/aging.ts`: computeDaysInStock(), isAgingVehicle(), getAgingSeverity()
- [x] T018 [P] Implement filter utility functions in `src/utils/filters.ts`: filterBySearch(), filterByLocation(), filterByAgingStatus(), applyAllFilters()
- [x] T019 [P] Implement metrics utility functions in `src/utils/metrics.ts`: computeKpis(), computeAgeDistribution(), computeLocationBreakdown()
- [x] T020 [P] Write unit tests for aging utilities in `src/utils/aging.test.ts`
- [x] T021 [P] Write unit tests for filter utilities in `src/utils/filters.test.ts`
- [x] T022 [P] Write unit tests for metrics utilities in `src/utils/metrics.test.ts`
- [x] T023 Write unit tests for inventory store in `src/stores/inventoryStore.test.ts` (uses MSW node handlers)
- [x] T024 [P] Write unit tests for action store in `src/stores/actionStore.test.ts` (tests localStorage persistence)
- [x] T025 Write unit tests for vehicle service in `src/services/vehicleService.test.ts` (uses MSW node handlers)
- [x] T026 [P] Write unit tests for action service in `src/services/actionService.test.ts`

**Checkpoint**: Foundation ready — all services, stores, types, mocks, and utilities are implemented and tested. User story implementation can now begin in parallel.

---

## Phase 3: User Story 1 — Browse and Filter Vehicle Inventory (Priority: P1) 🎯 MVP

**Goal**: Display all vehicles in a searchable, filterable, sortable, paginated table

**Independent Test**: Load dashboard → see vehicle table with data → search "Toyota" → results filter → sort by column → paginate through pages

### Tests for User Story 1

- [x] T027 [P] [US1] Write component test for FilterBar in `src/components/FilterBar.test.tsx` covering search input, location select, and aging toggle
- [x] T028 [P] [US1] Write component test for InventoryTable in `src/components/InventoryTable.test.tsx` covering rendering rows, column sorting, and pagination
- [x] T029 [P] [US1] Write component test for EmptyState in `src/components/EmptyState.test.tsx`
- [x] T030 [P] [US1] Write component test for Header in `src/components/Header.test.tsx`

### Implementation for User Story 1

- [x] T031 [P] [US1] Implement Header component in `src/components/Header.tsx` with dashboard branding and manager info
- [x] T032 [US1] Implement FilterBar component in `src/components/FilterBar.tsx` with search input, location dropdown, and stock age filter controls
- [x] T033 [US1] Implement InventoryTable component in `src/components/InventoryTable.tsx` with sortable columns, pagination (25/page), and vehicle row rendering
- [x] T034 [P] [US1] Implement EmptyState component in `src/components/EmptyState.tsx` with "No vehicles match" message and clear-filters button
- [x] T035 [US1] Implement usePagination custom hook in `src/hooks/usePagination.ts` for page state and computed page slice
- [x] T036 [P] [US1] Write unit test for usePagination hook in `src/hooks/usePagination.test.ts`
- [x] T037 [US1] Integrate FilterBar + InventoryTable + EmptyState into App.tsx with store connections and loading/error states

**Checkpoint**: User Story 1 complete — a manager can browse, search, filter, sort, and paginate the full vehicle inventory

---

## Phase 4: User Story 2 — Identify Aging Stock (Priority: P1)

**Goal**: Visually highlight vehicles >90 days in stock with severity badges and provide an aging-only filter view

**Independent Test**: View table → vehicles >90 days have red/amber badges → toggle "Aging Stock" filter → only aging vehicles shown → sorted by severity

### Tests for User Story 2

- [x] T038 [P] [US2] Write component test for AgingBadge in `src/components/AgingBadge.test.tsx` covering threshold logic and severity colors
- [x] T039 [P] [US2] Write integration test verifying aging row highlighting in `src/components/InventoryTable.test.tsx` (extend existing)

### Implementation for User Story 2

- [x] T040 [US2] Implement AgingBadge component in `src/components/AgingBadge.tsx` with severity levels (warning 91-120 days, critical >120 days) and color-coded visual
- [x] T041 [US2] Integrate AgingBadge into InventoryTable row rendering — display badge in Days In Stock column for vehicles >90 days
- [x] T042 [US2] Add "Aging Stock Only" toggle to FilterBar component (extend `src/components/FilterBar.tsx`) and wire to filter utilities
- [x] T043 [US2] Add row-level highlighting (background tint) for aging vehicles in InventoryTable using Tailwind conditional classes

**Checkpoint**: User Story 2 complete — aging vehicles are unmistakably visible, filterable, and sorted by severity

---

## Phase 5: User Story 3 — Record Actions for Aging Vehicles (Priority: P2)

**Goal**: Enable managers to record and view action history (price reduction, transfer, marketing push) for aging vehicles, persisted across sessions

**Independent Test**: Click action button on aging row → drawer opens → select type + add notes → submit → action visible on row → refresh page → action persists

### Tests for User Story 3

- [x] T044 [P] [US3] Write component test for ActionDrawer in `src/components/ActionDrawer.test.tsx` covering form rendering, validation, and submission
- [x] T045 [P] [US3] Write component test for ActionHistory in `src/components/ActionHistory.test.tsx` covering action log display and empty state

### Implementation for User Story 3

- [x] T046 [US3] Implement ActionDrawer component in `src/components/ActionDrawer.tsx` with action type select, notes textarea, submit button, and form validation
- [x] T047 [US3] Implement ActionHistory component in `src/components/ActionHistory.tsx` displaying chronological action log with timestamps and type badges
- [x] T048 [US3] Add "Record Action" button to aging vehicle rows in InventoryTable (extend `src/components/InventoryTable.tsx`)
- [x] T049 [US3] Wire ActionDrawer open/close state and form submission to actionStore in App.tsx
- [x] T050 [US3] Display last action indicator (type + date) on vehicle rows that have recorded actions in InventoryTable

**Checkpoint**: User Story 3 complete — managers can record, view, and persist actions for aging vehicles

---

## Phase 6: User Story 4 — View Summary Metrics and Visual Insights (Priority: P3)

**Goal**: Display KPI cards with computed metrics and a bar chart showing age distribution

**Independent Test**: Load dashboard → see 4 KPI cards with correct numbers → see bar chart with age buckets → apply filter → KPIs update

### Tests for User Story 4

- [x] T051 [P] [US4] Write component test for KpiCards in `src/components/KpiCards.test.tsx` covering all 4 metric cards with computed values
- [x] T052 [P] [US4] Write component test for AgeDistributionChart in `src/components/AgeDistributionChart.test.tsx` covering chart rendering with data

### Implementation for User Story 4

- [x] T053 [US4] Implement KpiCards component in `src/components/KpiCards.tsx` displaying total vehicles, aging count, average days in stock, and total inventory value
- [x] T054 [US4] Implement AgeDistributionChart component in `src/components/AgeDistributionChart.tsx` with Recharts BarChart showing 0-30, 31-60, 61-90, 90+ day buckets
- [x] T055 [US4] Integrate KpiCards and AgeDistributionChart into App.tsx layout, wired to filtered vehicle data from store
- [x] T056 [US4] Add responsive grid layout for KPI cards (4-column on desktop) and chart section below filter bar in App.tsx

**Checkpoint**: User Story 4 complete — dashboard shows live metrics and charts reflecting current inventory/filter state

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final quality pass, accessibility, error handling, and demo readiness

- [x] T057 [P] Implement ErrorBoundary component in `src/components/ErrorBoundary.tsx` with retry button and user-friendly message
- [x] T058 [P] Write component test for ErrorBoundary in `src/components/ErrorBoundary.test.tsx`
- [x] T059 [P] Implement LoadingSkeleton component in `src/components/LoadingSkeleton.tsx` for table and KPI loading states
- [x] T060 [P] Write component test for LoadingSkeleton in `src/components/LoadingSkeleton.test.tsx`
- [x] T061 Add ARIA labels, roles, and keyboard navigation to all interactive elements across components
- [x] T062 Verify WCAG 2.1 AA color contrast for all text, badges, and interactive elements
- [x] T063 Run full test suite (`npm run test:ci`) and ensure 100% pass rate with coverage report
- [x] T064 Run typecheck (`npm run typecheck`), lint (`npm run lint`), and format (`npm run format`) — fix all issues
- [x] T065 Validate quickstart.md flow: clone → install → dev → verify all 5 visual checkpoints render correctly
- [x] T066 Final visual polish: verify no layout glitches, broken styles, or placeholder content at 1280px+ viewport

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Phase 2 — provides the base table that US2/US3/US4 extend
- **US2 (Phase 4)**: Depends on Phase 3 (extends InventoryTable with badges/highlighting)
- **US3 (Phase 5)**: Depends on Phase 3 (adds action button to table rows); can run parallel with US2
- **US4 (Phase 6)**: Depends on Phase 2 only (KPIs use store data, not table component); can run parallel with US1/US2/US3
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: First story — establishes the table component all others extend
- **US2 (P1)**: Extends US1's table with visual indicators; can start after T033 is complete
- **US3 (P2)**: Extends US1's table with action buttons; can start after T033 is complete; independent of US2
- **US4 (P3)**: Independent of table component; only needs stores/utils from Phase 2

### Within Each User Story

- Tests MUST be written FIRST and FAIL before implementation (TDD per Constitution Principle I)
- Types → Services → Stores → Components → Integration
- Story complete = all tests pass + visual verification

### Parallel Opportunities

**Phase 1**: T003, T004, T005, T006 can all run in parallel (independent config files)
**Phase 2**: T014, T016, T017, T018, T19 can run in parallel; T020–T022 can run in parallel; T023–T026 can run in parallel
**Phase 3**: T027–T030 (tests) can run in parallel; T031, T034 can run in parallel with T032
**Phase 4**: T038, T039 can run in parallel
**Phase 5**: T044, T045 can run in parallel
**Phase 6**: T051, T052 can run in parallel
**Phase 7**: T057–T060 can run in parallel

---

## Parallel Example: User Story 1

```text
Thread A: T027 (FilterBar test) → T032 (FilterBar impl) → T037 (integration)
Thread B: T028 (Table test)     → T033 (Table impl)     → T037 (integration)
Thread C: T029 (Empty test)     → T034 (Empty impl)
Thread D: T030 (Header test)    → T031 (Header impl)
Thread E: T036 (hook test)      → T035 (usePagination)
```

All threads converge at T037 (App.tsx integration).

---

## Implementation Strategy

### MVP Scope

**Minimum viable demo** = Phase 1 + Phase 2 + Phase 3 (User Story 1)

This delivers a fully functional, searchable, filterable inventory table with mock data, tests, and professional styling — enough for a basic demo.

### Incremental Delivery

1. **MVP**: US1 alone = usable inventory viewer
2. **+US2**: Aging stock visible = core business value
3. **+US3**: Action tracking = operational decision tool
4. **+US4**: Metrics/charts = executive-level insights + demo polish
5. **+Polish**: Production-quality accessibility, error handling, final visual pass

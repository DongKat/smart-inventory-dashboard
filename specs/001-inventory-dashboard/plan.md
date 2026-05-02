# Implementation Plan: Intelligent Inventory Dashboard

**Branch**: `001-inventory-dashboard` | **Date**: 2026-05-01 | **Spec**: [spec.md](specs/001-inventory-dashboard/spec.md)
**Input**: Feature specification from `/specs/001-inventory-dashboard/spec.md`

## Summary

Build a single-page React + TypeScript dashboard for dealership managers providing searchable/filterable vehicle inventory with aging stock highlighting (>90 days), action tracking per vehicle (persisted in localStorage), and summary KPI metrics with Recharts visualizations. The backend is fully mocked via MSW. State is managed through Zustand store slices. The UI uses Tailwind CSS + shadcn/ui for a professional, demo-ready appearance.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode) on Node.js 20+  
**Primary Dependencies**: React 18, Vite 5, Tailwind CSS v4, shadcn/ui, Zustand 5, Recharts 3, MSW 2  
**Storage**: localStorage (action logs persistence); no database  
**Testing**: Vitest + React Testing Library + MSW (test mocks)  
**Target Platform**: Modern desktop browsers (Chrome, Firefox, Edge latest) at 1280px+ viewports  
**Project Type**: Single-page web application (frontend only, mocked backend)  
**Performance Goals**: Full render < 2s with 500 vehicles; filter response < 100ms; 60fps scrolling  
**Constraints**: No routing; single HTML page; no server dependencies; offline-capable via mocks  
**Scale/Scope**: 100–200 mock vehicles; single user; 1 page; ~15 components; ~20 source files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Status | Evidence |
|---|-----------|--------|----------|
| I | Unit-Tested Frontend | ✅ PASS | SC-006 requires 100% component/state test coverage; Vitest + RTL selected |
| II | Modular Architecture | ✅ PASS | Decoupled layers: services → stores → components; MSW behind service abstraction |
| III | Single-Page Professional UI | ✅ PASS | FR-015 mandates SPA; shadcn/ui + Tailwind for consistent styling |
| IV | Typed & Readable Code | ✅ PASS | TypeScript strict mode; ESLint + Prettier enforced; <200 LOC per file |
| V | Performance & Accessibility | ✅ PASS | Pagination at 50 items (FR-012); ARIA attributes; WCAG AA contrast |
| VI | AI-Assisted Ownership | ✅ PASS | All code reviewed and owned by developer; quality gates apply equally |
| VII | Demo-Impact Tradeoffs | ✅ PASS | P1 features (visible) prioritized; scope cuts remove P3 before degrading P1 |

**Gate Result**: ALL PASS — proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-inventory-dashboard/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (MSW handler contracts)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── ui/              # shadcn/ui primitives (Button, Badge, Card, etc.)
│   ├── Header.tsx
│   ├── KpiCards.tsx
│   ├── FilterBar.tsx
│   ├── InventoryTable.tsx
│   ├── AgingBadge.tsx
│   ├── ActionDrawer.tsx
│   ├── ActionHistory.tsx
│   ├── AgeDistributionChart.tsx
│   └── EmptyState.tsx
├── stores/
│   ├── inventoryStore.ts
│   └── actionStore.ts
├── services/
│   ├── vehicleService.ts
│   └── actionService.ts
├── types/
│   ├── vehicle.ts
│   └── action.ts
├── utils/
│   ├── filters.ts
│   ├── aging.ts
│   └── metrics.ts
├── mocks/
│   ├── handlers.ts
│   ├── browser.ts
│   └── data/
│       └── vehicles.json
├── App.tsx
├── main.tsx
└── index.css

tests/                    # Co-located test files use *.test.ts(x) next to source
```

**Structure Decision**: Single-project layout at repository root. Since there is no real backend, all code lives under `src/` with co-located test files (`*.test.tsx` alongside each module). The `mocks/` directory isolates MSW handlers and fixture data, ensuring the service layer can swap to a real API by changing only the service imports.

## Complexity Tracking

> No constitution violations. No complexity justification required.

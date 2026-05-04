# Smart Inventory Dashboard

A frontend-only **Intelligent Inventory Dashboard** for dealership managers — providing real-time vehicle stock visibility, aging stock identification, and a manager action workflow, all driven by a mocked backend.

> Built as **Scenario B** of the Keyloop Technical Assessment.

---

## Features

- **Inventory table** — sortable, paginated, searchable across make, model, and VIN
- **Aging stock detection** — vehicles held longer than 90 days are flagged with severity badges and row highlights
- **Manager actions** — log price reductions, branch transfers, marketing pushes, and more against any vehicle; history persists across page refreshes
- **KPI cards** — total stock, aging count, average days in stock, and total inventory value
- **Age distribution chart** — visualise stock spread across 0–30 / 31–60 / 61–90 / 90+ day buckets
- **Filtering** — by location, make, age range, and an "aging only" toggle
- **Error & empty states** — friendly recovery UI for failed fetches and empty filter results

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS 4 |
| UI Primitives | Radix UI / shadcn-style components |
| Charts | Recharts |
| State | Zustand 5 |
| API Mocking | MSW 2 (Mock Service Worker) |
| Persistence | `localStorage` |
| Testing | Vitest + React Testing Library |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Install & Run

```bash
git clone <repository-url>
cd smart-inventory-dashboard
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Production Build

```bash
npm run build
npm run preview
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check and bundle for production |
| `npm run preview` | Serve the production build locally |
| `npm run test` | Run tests in watch mode |
| `npm run test:ci` | Run tests once and generate coverage report |
| `npm run typecheck` | Strict TypeScript check (no emit) |
| `npm run lint` | ESLint across the project |
| `npm run format` | Prettier format all files |

---

## Testing

```bash
# Single run with coverage
npm run test:ci

# Watch mode during development
npm run test
```

Coverage spans:

- **Utils** — `aging`, `filters`, `metrics`
- **Stores** — `inventoryStore`, `actionStore`
- **Services** — `vehicleService`, `actionService`
- **Components** — `FilterBar`, `InventoryTable`, `KpiCards`, `ActionDrawer`, `ActionHistory`, `AgingBadge`, `LoadingSkeleton`, `EmptyState`, `ErrorBoundary`, `Header`
- **Hooks** — `usePagination`

API calls in tests are intercepted by MSW's Node server (`src/mocks/server.ts`), keeping tests fast and deterministic.

---

## Project Structure

```
src/
├── components/             # UI components, each with a co-located *.test.tsx
│   ├── ui/                 # Reusable primitives — Button, Card, Badge, Dialog, Input, Select
│   ├── Header.tsx          # App header with title and branding
│   ├── KpiCards.tsx        # Summary metric cards
│   ├── FilterBar.tsx       # Search, location, make, age-range, and aging-toggle filters
│   ├── InventoryTable.tsx  # Sortable, paginated vehicle table
│   ├── AgingBadge.tsx      # Severity indicator for aging vehicles
│   ├── AgeDistributionChart.tsx  # Recharts bar chart for age buckets
│   ├── ActionDrawer.tsx    # Slide-over dialog to record a manager action
│   ├── ActionHistory.tsx   # Chronological log of past actions on a vehicle
│   ├── EmptyState.tsx      # No-results placeholder with clear-filters CTA
│   ├── ErrorBoundary.tsx   # Top-level error recovery with retry
│   └── LoadingSkeleton.tsx # Shimmer placeholder during data fetch
├── stores/                 # Zustand global state
│   ├── inventoryStore.ts   # Vehicles, locations, filters, sort, pagination
│   └── actionStore.ts      # Manager actions with localStorage persistence
├── services/               # Data access
│   ├── vehicleService.ts   # GET /api/vehicles, GET /api/locations
│   └── actionService.ts    # localStorage CRUD for Action records
├── utils/                  # Pure, testable functions
│   ├── aging.ts            # daysInStock calculation, severity thresholds
│   ├── filters.ts          # Composable filter predicates
│   └── metrics.ts          # KPI aggregation, age-bucket distribution
├── mocks/                  # MSW setup
│   ├── browser.ts          # MSW service worker (dev)
│   ├── server.ts           # MSW Node server (tests)
│   ├── handlers.ts         # GET /api/vehicles, /api/vehicles/:id, /api/locations
│   └── data/vehicles.json  # Static seed dataset (~150 vehicles)
├── types/                  # Shared TypeScript types
│   ├── vehicle.ts          # Vehicle, VehicleWithAge, Location
│   └── action.ts           # Action, ActionType
├── hooks/
│   └── usePagination.ts    # Slice + page-count helper
└── lib/
    └── utils.ts            # cn() class-merge helper
```

---

## Architecture Overview

See [docs/system-design.md](docs/system-design.md) for the full system design, data model, state management strategy, and key technical decisions.
├── hooks/               # Custom hooks
│   └── usePagination.ts # Pagination logic
├── types/               # TypeScript interfaces
│   ├── vehicle.ts       # Vehicle, Location types
│   └── action.ts        # Action, ActionType types
├── mocks/               # MSW mock API layer
│   ├── handlers.ts      # API route handlers
│   ├── browser.ts       # Browser service worker setup
│   ├── server.ts        # Node server for tests
│   └── data/vehicles.json # 150 realistic mock vehicles
├── lib/utils.ts         # Tailwind cn() helper
├── App.tsx              # Root application component
└── main.tsx             # Entry point with MSW initialization
```

---

## Technology Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI library (functional components, hooks) |
| TypeScript 5 (strict) | Type safety with `noUncheckedIndexedAccess` |
| Vite 5 | Build tool and dev server |
| Tailwind CSS v4 | Utility-first styling |
| shadcn/ui + Radix UI | Accessible component primitives |
| Zustand 5 | Lightweight state management |
| Recharts 3 | Data visualization (bar charts) |
| MSW 2 | Mock Service Worker for API simulation |
| Vitest | Unit and component testing |
| React Testing Library | Component testing with user-centric queries |
| ESLint + Prettier | Code quality and formatting |

---

## Features

1. **Inventory Visualization** — Filterable, sortable, paginated table of 150 vehicles searchable by make, model, VIN, or year with location filtering.

2. **Aging Stock Identification** — Vehicles >90 days automatically flagged with severity badges (Warning: 91–180 days, Critical: 180+ days), amber row highlighting, and a one-click "Aging Only" filter toggle.

3. **Actionable Insights** — Managers can record actions (Price Reduction, Transfer, Marketing Push, Other) for aging vehicles via a dialog with notes. Actions persist across sessions via localStorage. Last action indicator shown on table rows.

4. **Summary Metrics** — Four KPI cards (total vehicles, aging count, average days in stock, total inventory value) that update reactively with filters.

5. **Age Distribution Chart** — Color-coded bar chart showing vehicle count across age buckets (0–30, 31–60, 61–90, 90+ days).

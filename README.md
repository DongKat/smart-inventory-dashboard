# Smart Inventory Dashboard

A frontend-only **Intelligent Inventory Dashboard** for dealership managers — providing real-time vehicle stock visibility, aging stock identification, and a manager action workflow, all driven by a mocked backend.

---

## Features

- **Inventory table** — sortable, paginated, searchable across make, model, and VIN
- **Aging stock detection** — vehicles held longer than 90 days are flagged with severity badges and row highlights
- **Manager actions** — log price reductions, branch transfers, marketing pushes, and more against any vehicle; history persists across page refreshes
- **Inventory dashboard** — total stock, aging count, average days in stock, and total inventory value

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS 4 |
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
git clone https://github.com/DongKat/smart-inventory-dashboard.git
cd smart-inventory-dashboard
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

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
```
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

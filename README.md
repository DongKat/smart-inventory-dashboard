# Smart Inventory Dashboard

An Intelligent Inventory Dashboard that gives dealership managers a real-time overview of their vehicle stock, with aging stock identification and actionable insights.

**Scenario B — The Intelligent Inventory Dashboard** (Keyloop Technical Assessment)

---

## Quick Start

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### Installation

```bash
git clone <repository-url>
cd smart-inventory-dashboard
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run test` | Run tests in watch mode |
| `npm run test:ci` | Run tests once with coverage report |
| `npm run typecheck` | TypeScript strict type checking |
| `npm run lint` | Run ESLint across the project |
| `npm run format` | Format all files with Prettier |

---

## Testing

The project uses **Vitest** + **React Testing Library** for unit and component tests, and **MSW (Mock Service Worker)** for API mocking in tests.

```bash
# Run all tests
npm run test:ci

# Run in watch mode during development
npm run test
```

**Test coverage includes:**
- Utility functions (aging, filters, metrics)
- Zustand stores (inventory, actions)
- Service layer (vehicle API, action persistence)
- All UI components (FilterBar, InventoryTable, KpiCards, ActionDrawer, etc.)

---

## Project Structure

```
src/
├── components/          # React components with co-located tests
│   ├── ui/              # Reusable primitives (Button, Card, Badge, etc.)
│   ├── FilterBar.tsx    # Search, location, aging toggle filters
│   ├── InventoryTable.tsx # Sortable, paginated vehicle table
│   ├── KpiCards.tsx     # Summary metric cards
│   ├── AgeDistributionChart.tsx # Recharts bar chart
│   ├── AgingBadge.tsx   # Severity badge for aging vehicles
│   ├── ActionDrawer.tsx # Dialog to record actions
│   ├── ActionHistory.tsx # Action log display
│   ├── ErrorBoundary.tsx # Error recovery wrapper
│   └── LoadingSkeleton.tsx # Loading state placeholder
├── stores/              # Zustand state management
│   ├── inventoryStore.ts # Vehicle state, filters, sorting, pagination
│   └── actionStore.ts    # Action state with localStorage persistence
├── services/            # Data access layer
│   ├── vehicleService.ts # Fetch vehicles/locations from API
│   └── actionService.ts  # localStorage CRUD for actions
├── utils/               # Pure utility functions
│   ├── aging.ts         # Days calculation, severity logic
│   ├── filters.ts       # Search, location, aging filters
│   └── metrics.ts       # KPI computation, age distribution
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

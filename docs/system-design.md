# System Design: Smart Inventory Dashboard

**Version**: 1.0  
**Date**: 2026-05-04

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture](#2-architecture)
3. [Data Model](#3-data-model)
4. [State Management](#4-state-management)
5. [Data Flow](#5-data-flow)
6. [API & Mocking Layer](#6-api--mocking-layer)
7. [Persistence](#7-persistence)
8. [Component Architecture](#8-component-architecture)
9. [Key Design Decisions](#9-key-design-decisions)
10. [Testing Strategy](#10-testing-strategy)

---

## 1. Overview

Smart Inventory Dashboard is a **frontend-only single-page application** that gives dealership managers a real-time view of vehicle stock. There is no backend server — all data is served by MSW (Mock Service Worker) intercepting fetch requests in the browser, and manager actions are persisted to `localStorage`.

### Primary User Goals

| Goal | Mechanism |
|---|---|
| Browse and locate vehicles | Sortable, searchable, paginated inventory table |
| Identify aging stock | Automatic severity classification at >90 days; visual badges and row highlights |
| Act on aging vehicles | Slide-over action drawer; action log persisted to localStorage |
| Assess lot health | KPI cards + age distribution chart derived from live filtered state |

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   React SPA (Vite)                    │  │
│  │                                                       │  │
│  │  ┌─────────────┐   ┌──────────────────────────────┐  │  │
│  │  │   Zustand   │   │       React Components        │  │  │
│  │  │   Stores    │◄──│  (render + dispatch actions)  │  │  │
│  │  └──────┬──────┘   └──────────────────────────────┘  │  │
│  │         │                                             │  │
│  │  ┌──────▼──────┐   ┌──────────────────────────────┐  │  │
│  │  │  Services   │   │         Utils / Hooks         │  │  │
│  │  │  (fetch)    │   │  (aging, filters, metrics)    │  │  │
│  │  └──────┬──────┘   └──────────────────────────────┘  │  │
│  └─────────┼──────────────────────────────────────────┘  │
│            │ fetch()                                       │
│  ┌─────────▼──────────────────────────────────────────┐  │
│  │          MSW Service Worker                         │  │
│  │   intercepts /api/* — returns static JSON + delay   │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  localStorage ──► actionService ──► actionStore            │
└─────────────────────────────────────────────────────────────┘
```

**Technology choices:**

| Concern | Choice | Rationale |
|---|---|---|
| Framework | React 18 + TypeScript | Strong ecosystem, strict typing |
| Build | Vite 6 | Fast HMR, native ESM |
| Styling | Tailwind CSS 4 | Utility-first; no runtime overhead |
| UI Primitives | Radix UI (unstyled) | Accessible, headless; styled with Tailwind |
| Charts | Recharts | Composable, React-native chart library |
| State | Zustand 5 | Minimal boilerplate; no context drilling |
| API Mocking | MSW 2 | Intercepts at the network level; same handlers work in dev and tests |
| Persistence | `localStorage` | Zero-dependency; sufficient for single-user action tracking |

---

## 3. Data Model

### Vehicle

Fetched from the mock API. Fields are stored as-is; derived fields are computed at enrichment time.

| Field | Type | Notes |
|---|---|---|
| `id` | `string` (UUID) | Immutable primary key |
| `vin` | `string` | 17-char alphanumeric |
| `make` | `string` | e.g. `"Toyota"` |
| `model` | `string` | e.g. `"Camry"` |
| `year` | `number` | 4-digit model year |
| `trim` | `string` | e.g. `"SE"`, `"Limited"` |
| `price` | `number` | Listed price in USD |
| `location` | `string` | References a `Location.id` |
| `dateAcquired` | `string` (ISO 8601) | Date vehicle entered stock |
| `status` | `"available" \| "reserved" \| "sold"` | Current vehicle state |
| `mileage` | `number` | Odometer reading |
| `exteriorColor` | `string` | — |

**Derived (computed, not stored):**

| Field | Formula |
|---|---|
| `daysInStock` | `⌊(now − dateAcquired) / 86_400_000⌋` |
| `isAging` | `daysInStock > 90` |
| `agingSeverity` | `"normal"` / `"warning"` (>90d) / `"critical"` (>180d) |

### Action

Persisted to `localStorage` under the key `inventory_actions`.

| Field | Type | Notes |
|---|---|---|
| `id` | `string` (UUID) | Auto-generated at creation |
| `vehicleId` | `string` | Foreign key → Vehicle.id |
| `type` | `ActionType` | See enum below |
| `notes` | `string` | Optional, ≤ 500 chars |
| `createdAt` | `string` (ISO 8601) | Set automatically |
| `managerName` | `string` | Defaults to `"Manager"` |

```ts
type ActionType =
  | 'price_reduction'
  | 'transfer'
  | 'marketing_push'
  | 'auction_candidate'
  | 'hold'
  | 'other';
```

### Location

Static reference data returned by `GET /api/locations`.

| id | name |
|---|---|
| `main-lot` | Main Lot |
| `downtown` | Downtown Branch |
| `westside` | Westside Annex |
| `airport` | Airport Location |

---

## 4. State Management

Two Zustand stores manage all global state. Neither store communicates with the other; both are consumed directly by components.

### `inventoryStore`

Owns all vehicle data and UI state for the inventory table.

```
vehicles[]         ← raw enriched VehicleWithAge array (from API)
locations[]        ← Location array (from API)
isLoading          ← fetch in flight
error              ← fetch error message or null
─── filter state ───────────────────────
searchQuery        ← free-text search (make / model / VIN)
locationFilter     ← Location.id or ""
makeFilter         ← make string or ""
ageRange           ← "" | "0-30" | "31-60" | "61-90" | "91-180" | "180+"
agingOnly          ← boolean toggle
─── sort state ─────────────────────────
sortField          ← "make" | "year" | "price" | "daysInStock" | "location" | "status"
sortDirection      ← "asc" | "desc"
─── pagination ─────────────────────────
currentPage        ← 1-indexed
pageSize           ← 25 (fixed)
```

Filtering and sorting are computed **outside the store** in `utils/filters.ts` and `utils/metrics.ts`, keeping the store lean and the derivations independently testable.

### `actionStore`

Owns the manager action log. Reads from and writes to `localStorage` via `actionService`.

```
actions[]          ← all Action records loaded from localStorage
loadActions()      ← hydrate from localStorage on mount
addAction(action)  ← persist + append to in-memory array
getActionsForVehicle(id) ← selector for per-vehicle history
```

---

## 5. Data Flow

### Initial Load

```
App mounts
  └─► inventoryStore.loadVehicles()
        └─► vehicleService.fetchVehicles()
              └─► fetch('/api/vehicles')  ──► MSW handler
                    └─► vehicles[] returned, enriched with daysInStock / isAging
  └─► inventoryStore.loadLocations()
  └─► actionStore.loadActions()  ──► localStorage
```

### Filter / Sort

```
User interacts with FilterBar
  └─► inventoryStore.setSearchQuery() / setLocationFilter() / etc.
        └─► store state updated (synchronous)
              └─► InventoryTable re-renders
                    └─► applyFilters(vehicles, filters)  ← utils/filters.ts
                          └─► applySort(filtered, sort)
                                └─► usePagination(sorted, page, pageSize)
                                      └─► slice rendered to table
```

### Record Action

```
User clicks row → ActionDrawer opens
  └─► user selects ActionType + optional notes → submits
        └─► actionStore.addAction({ id: uuid(), vehicleId, type, notes, createdAt })
              └─► actionService.addAction(action)  ──► localStorage.setItem(...)
                    └─► store re-renders ActionHistory with new entry
```

### KPI & Chart Updates

KPI cards and the age distribution chart derive their values from the **filtered** vehicle list, so they respond to filter changes without any additional wiring.

```
filteredVehicles (derived in component)
  └─► computeMetrics(filteredVehicles)  ── utils/metrics.ts
        └─► { total, agingCount, avgDaysInStock, totalValue }
  └─► computeAgeDistribution(filteredVehicles)
        └─► [{ bucket: "0-30", count }, ...]  ──► Recharts BarChart
```

---

## 6. API & Mocking Layer

All network requests are intercepted by **MSW 2** via a registered service worker in development and a Node.js server in tests.

### Endpoints

| Method | Path | Response | Latency |
|---|---|---|---|
| `GET` | `/api/vehicles` | `{ vehicles: Vehicle[], total: number }` | 200–500 ms |
| `GET` | `/api/vehicles/:id` | `Vehicle` or `404` | 100–300 ms |
| `GET` | `/api/locations` | `{ locations: Location[] }` | ~100 ms |

Latency is simulated with MSW's `delay()` to exercise loading states during development and demos.

### Error Simulation

The vehicle endpoint can be configured to return a `500` response to test the `ErrorBoundary` component. This is done by adding an override handler in tests rather than modifying the default handler.

### Seed Data

`src/mocks/data/vehicles.json` contains ~150 vehicles across all four locations, spread across a date range that produces vehicles in every age bucket, ensuring all UI states are exercisable without manual setup.

---

## 7. Persistence

Manager actions are the only data that must survive page refreshes. The persistence strategy uses `localStorage` directly because:

- The dataset is small (hundreds of records at most)
- No multi-user synchronisation is required
- No server is available

### Storage Schema

```
Key:   "inventory_actions"
Value: JSON.stringify(Action[])
```

`actionService.ts` encapsulates all read/write logic. The service is the only caller of `localStorage`; components and the store never touch `localStorage` directly. This boundary makes the service trivially replaceable with a real API later.

**Graceful degradation:** if `localStorage` is unavailable or the stored JSON is corrupt, `getActions()` returns `[]` and the app continues without crashing.

---

## 8. Component Architecture

```
App
├── ErrorBoundary
│   ├── Header
│   ├── KpiCards            ← reads filteredVehicles
│   ├── AgeDistributionChart ← reads filteredVehicles
│   ├── FilterBar           ← writes to inventoryStore (filters)
│   ├── InventoryTable      ← reads paged/sorted/filtered vehicles
│   │   └── AgingBadge      ← pure display; receives daysInStock
│   └── ActionDrawer        ← reads/writes actionStore
│       └── ActionHistory   ← reads actionStore.getActionsForVehicle()
└── LoadingSkeleton         ← shown while inventoryStore.isLoading
```

**Design principles applied:**

- **Co-location**: every component has a `*.test.tsx` file in the same directory.
- **Single responsibility**: utility functions (`aging.ts`, `filters.ts`, `metrics.ts`) are pure and have no React dependencies.
- **Thin stores**: stores hold state and async triggers only; no business logic lives inside them.
- **UI primitives isolated**: `src/components/ui/` contains only unstyled/minimally-styled wrappers around Radix primitives. Application logic lives in the feature components above.

---

## 9. Key Design Decisions

### Client-side filtering vs. server-side

All filtering, sorting, and pagination happen in the browser after a single bulk fetch of the full vehicle list. This is appropriate here because:

1. The dataset is bounded (~150 vehicles) and fits comfortably in memory.
2. There is no real server to query.
3. It avoids round-trip latency for each filter interaction.

For a real dealership system with thousands of vehicles, server-side pagination and filtering would be required.

### Derived fields computed at enrichment, not stored

`daysInStock` and `isAging` are computed once when vehicles are loaded into the store and attached to each `VehicleWithAge` object. This avoids recomputing them on every render and keeps templates simple. The tradeoff is that a very long-lived session could show stale values; a real app would recompute on a daily timer or on each API refetch.

### Zustand over Context API

Zustand was chosen over React Context because:

- No provider wrapping required.
- Selective re-render: components subscribe only to the slices they use.
- Simpler async action pattern than `useReducer` + `useContext`.

### localStorage over IndexedDB

For the action log, `localStorage` is sufficient given the small data volume and single-user constraint. IndexedDB would be needed if actions included binary blobs or if the dataset could grow into tens of thousands of records.

### Aging thresholds

| Range | Severity | Visual treatment |
|---|---|---|
| 0–90 days | `normal` | No badge |
| 91–180 days | `warning` | Amber badge, subtle row tint |
| > 180 days | `critical` | Red badge, strong row highlight |

The 90-day threshold is **strictly greater than** (`> 90`), matching dealership industry convention where day 90 itself is not yet considered aged.

---

## 10. Testing Strategy

| Layer | Tool | Scope |
|---|---|---|
| Unit | Vitest | `utils/` — pure functions; no React |
| Store | Vitest | Zustand store actions and selectors |
| Service | Vitest + MSW Node | `vehicleService`, `actionService` |
| Component | Vitest + React Testing Library | All feature components |
| Integration | React Testing Library | Filter → table interaction, action submission |

**MSW in tests**: `src/test/setup.ts` starts the MSW Node server before each test file and resets handlers after each test, preventing handler pollution across test suites.

**No E2E tests** are included; the component + integration coverage at the React Testing Library level is sufficient for a frontend-only assessment scope. Playwright/Cypress would be the natural next step for a production project.

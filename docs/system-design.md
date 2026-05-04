# System Design Document

## Scenario B: The Intelligent Inventory Dashboard

**Domain:** Supply  
**Objective:** Provide dealership managers with a real-time, filterable view of vehicle stock, automatically surface aging inventory (>90 days), and enable managers to log persistent actions for those vehicles.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            Browser (SPA)                                 │
│                                                                         │
│  ┌──────────┐  ┌────────────┐  ┌────────────┐  ┌───────────────────┐  │
│  │  React   │  │  Zustand   │  │  Services  │  │  MSW Intercept    │  │
│  │  UI      │◄─┤  Stores    │◄─┤  Layer     │◄─┤  Layer            │  │
│  │  Layer   │  │            │  │            │  │  (Mock API)       │  │
│  └──────────┘  └────────────┘  └────────────┘  └───────────────────┘  │
│       │                              │                    │             │
│       │         ┌────────────┐       │         ┌─────────▼──────────┐  │
│       │         │localStorage│◄──────┘         │  Mock Vehicle Data │  │
│       │         │ (Actions)  │                 │  (150 vehicles)    │  │
│       │         └────────────┘                 └────────────────────┘  │
│       ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      User Interface                               │  │
│  │  ┌─────────┐ ┌──────────┐ ┌────────────┐ ┌───────────────────┐  │  │
│  │  │KPI Cards│ │Filter Bar│ │Inventory   │ │Age Distribution   │  │  │
│  │  │(4 metrics)│Search     │ │Table       │ │Chart (Recharts)   │  │  │
│  │  └─────────┘ │Location   │ │Sortable    │ └───────────────────┘  │  │
│  │               │Aging Only │ │Paginated   │                        │  │
│  │               └──────────┘ │Highlighted │                        │  │
│  │                            └────────────┘                        │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Component Roles

### Presentation Layer

| Component | Responsibility |
|-----------|---------------|
| **Header** | App branding, manager identity display |
| **KpiCards** | Render 4 computed metrics (total, aging, avg days, value) |
| **FilterBar** | Search input, location dropdown, aging toggle, clear filters |
| **InventoryTable** | Sortable columns, pagination (25/page), row highlighting, action button |
| **AgingBadge** | Visual severity indicator (Warning / Critical) |
| **AgeDistributionChart** | Recharts BarChart with 6 age buckets, color-coded |
| **ActionDrawer** | Modal dialog for recording actions (type + notes) |
| **ActionHistory** | Chronological list of recorded actions for a vehicle |
| **EmptyState** | User-friendly "no results" with clear-filters CTA |
| **ErrorBoundary** | Graceful error recovery with retry |
| **LoadingSkeleton** | Shimmer placeholder during data fetch |

### State Management Layer

| Store | Responsibility |
|-------|---------------|
| **inventoryStore** | Vehicle list, loading/error states, filter/sort/pagination state, fetch triggers |
| **actionStore** | Action list, add/get actions, synced with localStorage via service |

### Service Layer

| Service | Responsibility |
|---------|---------------|
| **vehicleService** | HTTP client for `GET /api/vehicles` and `GET /api/locations` |
| **actionService** | localStorage CRUD with versioned JSON schema, corruption recovery |

### Utility Layer

| Utility | Responsibility |
|---------|---------------|
| **aging.ts** | `computeDaysInStock()`, `isAgingVehicle()` (>90d), `getAgingSeverity()` |
| **filters.ts** | `filterBySearch()`, `filterByLocation()`, `filterByAgingStatus()`, `applyAllFilters()` |
| **metrics.ts** | `computeKpis()`, `computeAgeDistribution()`, `computeLocationBreakdown()` |

### Mock API Layer (MSW)

| Handler | Endpoint | Behavior |
|---------|----------|----------|
| GET /api/vehicles | Returns 150 vehicles | Simulated 200–500ms latency |
| GET /api/vehicles/:id | Returns single vehicle | 404 if not found |
| GET /api/locations | Returns 4 dealership locations | 100ms latency |

---

## Data Flow

```
1. App mounts → MSW service worker intercepts fetch calls
2. inventoryStore.loadVehicles() → vehicleService.fetchVehicles()
   → fetch('/api/vehicles') → MSW handler → returns mock JSON
3. Raw vehicles enriched with computed fields (daysInStock, isAging)
4. User interactions update store state (filters, sort, page)
5. Filtered/sorted vehicles computed via useMemo selectors
6. KPIs and chart data derived from filtered set (reactive)
7. Action recording: ActionDrawer → actionStore.addAction()
   → actionService.addAction() → localStorage.setItem()
8. On next load: actionStore.loadActions() reads from localStorage
```

**Key Design Principle:** Unidirectional data flow. UI dispatches actions to stores, stores update state, React re-renders derived views.

---

## Technology Choices & Justifications

| Decision | Choice | Justification |
|----------|--------|---------------|
| **UI Framework** | React 18 | Industry standard, vast ecosystem, hooks for composition |
| **Language** | TypeScript (strict) | Catch errors at compile time, self-documenting interfaces |
| **Build Tool** | Vite 5 | Sub-second HMR, ESM-native, optimized production builds |
| **Styling** | Tailwind CSS v4 | Utility-first reduces CSS bloat, design-system consistency |
| **Components** | shadcn/ui + Radix | Accessible primitives (Dialog, Select) without heavy runtime |
| **State** | Zustand 5 | Minimal boilerplate vs Redux, built-in selectors, tiny bundle (2KB) |
| **Charts** | Recharts 3 | React-native, declarative, good TypeScript support |
| **API Mocking** | MSW 2 | Network-level interception—same code works in browser/tests |
| **Testing** | Vitest + RTL | Vite-native test runner (shared config), user-centric assertions |
| **Persistence** | localStorage | Simple, synchronous, sufficient for client-side action log |

### Why Frontend-Only (Mock Backend)?

For this assessment, the frontend fully implements the user experience with MSW simulating a real REST API. This approach:
- Demonstrates complete UI/UX for all three core requirements
- Uses the same `fetch()` calls a real backend would consume
- Is trivially replaceable—swap MSW handlers with real API endpoints

---

## Observability Strategy

### Current Implementation (Frontend)

| Concern | Approach |
|---------|----------|
| **Error Tracking** | ErrorBoundary catches React tree errors, logs to console; service layer logs fetch failures |
| **State Debugging** | Zustand devtools-compatible; store state inspectable via React DevTools |
| **Performance** | Vite dev server reports bundle sizes; `useMemo` prevents unnecessary re-renders |
| **API Monitoring** | MSW logs unhandled requests; simulated latency exposes loading-state bugs |

### Production-Ready Extensions (Future)

| Concern | Recommended Tool | Integration Point |
|---------|-----------------|-------------------|
| **Error Monitoring** | Sentry | ErrorBoundary `componentDidCatch` → `Sentry.captureException()` |
| **Analytics** | PostHog / Mixpanel | Track filter usage, action recordings, page views |
| **Performance** | Web Vitals (LCP, FID, CLS) | `reportWebVitals()` in main.tsx |
| **Logging** | Structured JSON logs | Service layer → centralized log collector |
| **Tracing** | OpenTelemetry | Distributed tracing headers on fetch calls for backend correlation |
| **Health Check** | `/health` endpoint | Backend liveness/readiness probes |

---

## Scalability Considerations

| Concern | Current Approach | Scalable Approach |
|---------|-----------------|-------------------|
| **Large datasets** | Client-side filtering of 150 vehicles | Server-side pagination, search API with query params |
| **Concurrent users** | N/A (client-only) | Stateless API servers behind load balancer |
| **Action persistence** | localStorage (per-browser) | REST API with PostgreSQL, optimistic UI updates |
| **Real-time updates** | Manual refresh | WebSocket/SSE for inventory changes |
| **Bundle size** | ~250KB gzipped | Code-splitting, lazy loading for chart/dialog |

---

## Security Considerations

| Concern | Implementation |
|---------|---------------|
| **XSS Prevention** | React auto-escapes JSX; no `dangerouslySetInnerHTML` |
| **Input Validation** | Action form validates required fields before persistence |
| **Dependency Safety** | No known vulnerabilities (`npm audit` clean) |
| **Data Integrity** | localStorage reads wrapped in try/catch for corruption recovery |
| **CORS** | MSW operates same-origin; production would enforce CORS headers |

---

## Assumptions & Design Decisions

1. **Single dealership scope** — Dashboard shows one dealership's inventory at a time.
2. **Aging threshold fixed at 90 days** — Configurable via constant, not UI setting.
3. **Actions are client-local** — No multi-user sync; each browser has its own action history.
4. **Mock data is static** — 150 vehicles generated with realistic distribution (~30% aging).
5. **No authentication** — Assumed internal tool behind dealership VPN/SSO in production.
6. **25 vehicles per page** — Balances information density with scroll fatigue.
7. **Manager name hardcoded** — "Manager" used for actions; in production, from auth session.

---

## Backend Server Proposal

This section describes the proposed production backend to replace the current MSW mock layer.

### Technology Stack

| Layer | Choice | Justification |
|-------|--------|---------------|
| **Runtime** | Node.js 20 LTS | Same language as frontend, non-blocking I/O, LTS support until 2026 |
| **Framework** | Express 5 | Mature, minimal overhead, async/await error handling built-in |
| **Database** | PostgreSQL 16 | ACID compliance, JSON support, full-text search, proven at scale |
| **ORM** | Drizzle ORM | Type-safe queries, zero runtime overhead, push-based migrations |
| **Validation** | Zod | Runtime schema validation shared with frontend types |
| **Auth** | JWT (RS256) + refresh tokens | Stateless auth, easy to integrate with dealership SSO/OIDC |
| **Logging** | Pino | JSON structured logs, <1ms overhead, ELK/Datadog compatible |
| **Caching** | Redis 7 | KPI pre-computation cache, session store, rate limiting |

### Database Schema

```sql
-- Core tables
CREATE TABLE dealerships (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(255) NOT NULL,
  address     TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE vehicles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dealership_id   UUID NOT NULL REFERENCES dealerships(id),
  vin             VARCHAR(17) UNIQUE NOT NULL,
  make            VARCHAR(100) NOT NULL,
  model           VARCHAR(100) NOT NULL,
  trim            VARCHAR(100),
  year            INT NOT NULL,
  price           NUMERIC(12,2) NOT NULL,
  mileage         INT DEFAULT 0,
  exterior_color  VARCHAR(50),
  interior_color  VARCHAR(50),
  status          VARCHAR(20) NOT NULL DEFAULT 'available',
  acquired_date   DATE NOT NULL,
  location        VARCHAR(255) NOT NULL,
  image_url       TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE managers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dealership_id   UUID NOT NULL REFERENCES dealerships(id),
  email           VARCHAR(255) UNIQUE NOT NULL,
  name            VARCHAR(255) NOT NULL,
  password_hash   TEXT NOT NULL,
  role            VARCHAR(50) DEFAULT 'manager',
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE actions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id  UUID NOT NULL REFERENCES vehicles(id),
  manager_id  UUID NOT NULL REFERENCES managers(id),
  type        VARCHAR(50) NOT NULL,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE locations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dealership_id   UUID NOT NULL REFERENCES dealerships(id),
  name            VARCHAR(255) NOT NULL,
  address         TEXT
);

CREATE TABLE refresh_tokens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manager_id  UUID NOT NULL REFERENCES managers(id),
  token_hash  TEXT NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX idx_vehicles_dealership ON vehicles(dealership_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_acquired ON vehicles(acquired_date);
CREATE INDEX idx_vehicles_search ON vehicles USING gin(to_tsvector('english', make || ' ' || model || ' ' || vin));
CREATE INDEX idx_actions_vehicle ON actions(vehicle_id);
CREATE INDEX idx_actions_manager ON actions(manager_id);
```

### API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Email/password → JWT + refresh token | Public |
| POST | `/api/auth/refresh` | Rotate refresh token | Public |
| GET | `/api/vehicles` | Paginated, filterable vehicle list | Manager |
| GET | `/api/vehicles/:id` | Single vehicle detail with action history | Manager |
| GET | `/api/locations` | Dealership locations list | Manager |
| GET | `/api/kpis` | Pre-computed dashboard metrics (cached) | Manager |
| POST | `/api/vehicles/:id/actions` | Record an action for a vehicle | Manager |
| GET | `/api/vehicles/:id/actions` | Action history for a vehicle | Manager |

#### Query Parameters for `GET /api/vehicles`

```
?page=1&limit=25&sort=daysInStock&order=desc
&search=Toyota
&location=Downtown
&agingOnly=true
&status=available
```

### Server Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Express 5 Server                             │
│                                                                     │
│  ┌────────────┐  ┌────────────┐  ┌──────────┐  ┌──────────────┐  │
│  │ Auth       │  │ Validation │  │ Rate     │  │ Error        │  │
│  │ Middleware │──▶│ Middleware │──▶│ Limiter  │──▶│ Handler      │  │
│  └────────────┘  └────────────┘  └──────────┘  └──────────────┘  │
│        │                                                            │
│        ▼                                                            │
│  ┌────────────────────────────────────────────────────────────────┐│
│  │                      Route Handlers                             ││
│  │  /api/auth/*    /api/vehicles/*    /api/locations    /api/kpis  ││
│  └────────────────────────────────────────────────────────────────┘│
│        │                                                            │
│        ▼                                                            │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────────┐ │
│  │ Service     │  │ Drizzle ORM  │  │ Redis Cache              │ │
│  │ Layer       │──▶│ (Type-safe)  │──▶│ (KPIs, sessions)        │ │
│  └─────────────┘  └──────────────┘  └──────────────────────────┘ │
│                          │                                          │
│                          ▼                                          │
│                    ┌──────────────┐                                 │
│                    │ PostgreSQL 16│                                 │
│                    └──────────────┘                                 │
└─────────────────────────────────────────────────────────────────────┘
```

### Migration Strategy (MSW → Real Backend)

1. **Phase 1 — Parallel running:** Deploy backend; keep MSW as fallback via feature flag
2. **Phase 2 — Service layer swap:** Point `vehicleService.ts` to real endpoints (environment variable `VITE_API_URL`)
3. **Phase 3 — Auth integration:** Add login page, JWT interceptor in fetch wrapper, token refresh logic
4. **Phase 4 — Remove MSW:** Delete mock handlers/data from production bundle (keep for tests)

Frontend changes required:
- Add `VITE_API_URL` environment variable to service layer base URL
- Add auth context/store for JWT token management
- Add `Authorization: Bearer <token>` header to fetch requests
- Replace localStorage actions with `POST /api/vehicles/:id/actions`

### Deployment Architecture (Proposed)

```
                    ┌───────────────┐
                    │  CloudFlare   │
                    │  CDN / WAF    │
                    └───────┬───────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
        ┌─────▼─────┐ ┌────▼────┐ ┌─────▼─────┐
        │  Static   │ │   API   │ │   API     │
        │  Assets   │ │ Server 1│ │ Server 2  │
        │  (S3/CDN) │ └────┬────┘ └─────┬─────┘
        └───────────┘      │             │
                           └──────┬──────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
              ┌─────▼─────┐ ┌────▼────┐       │
              │ PostgreSQL│ │  Redis  │       │
              │  Primary  │ │ Cluster │       │
              └─────┬─────┘ └─────────┘       │
                    │                          │
              ┌─────▼─────┐                   │
              │ PostgreSQL│                   │
              │  Replica  │                   │
              └───────────┘                   │
```

### Key Non-Functional Requirements

| Requirement | Target | Approach |
|-------------|--------|----------|
| **Latency** | p95 < 200ms | Redis caching for KPIs, DB indexes, connection pooling |
| **Throughput** | 1000 req/s per instance | Stateless servers, horizontal scaling |
| **Availability** | 99.9% | Multi-AZ deployment, health checks, auto-restart |
| **Data Integrity** | Zero loss | PostgreSQL WAL replication, daily backups |
| **Security** | OWASP Top 10 | Input validation (Zod), parameterized queries, rate limiting, CORS |

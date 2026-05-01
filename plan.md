# Scenario B Frontend Implementation Plan

## Objective

Build a polished frontend-only Intelligent Inventory Dashboard for dealership managers that fulfills Scenario B requirements using mocked backend data.

## Success Criteria

* Filterable inventory list of vehicles
* Prominent identification of aging stock (>90 days)
* Ability to log and persist manager actions for aging vehicles
* Clean professional UI suitable for demo video
* Maintainable component structure and testable logic

## Recommended Stack

* React + TypeScript
* Vite
* Tailwind CSS
* shadcn/ui
* Recharts
* Zustand (or Context API)
* Mock Service Worker (MSW) or local JSON server
* localStorage for persistence fallback

## Delivery Phases

### Phase 1: Foundation (Day 1)

* Initialize Vite React TypeScript project
* Configure Tailwind CSS
* Install UI/chart dependencies
* Define folder structure
* Create base theme and layout shell

### Phase 2: Core Dashboard UI

* Header with brand, notifications, manager profile
* KPI summary cards
* Responsive page grid layout
* Reusable card components

### Phase 3: Data + Inventory Table

* Create mock vehicle dataset
* Build inventory table
* Add pagination
* Add sorting
* Add row status badges

### Phase 4: Filtering Experience

* Search by stock/VIN/model
* Filter by make
  n- Filter by status
* Filter by age bucket
* Reset filters
* Derived filtered counts

### Phase 5: Aging Stock Intelligence

* Highlight vehicles >90 days
* Aging KPI card
* Aging bucket chart (0-30 / 31-60 / 61-90 / 90+)
* Alerts panel with oldest vehicles
* Critical row styling

### Phase 6: Manager Action Workflow

* Row click opens right-side drawer
* Vehicle summary panel
* Action dropdown:

  * Price Reduction Planned
  * Transfer Branch
  * Prioritize Marketing
  * Auction Candidate
  * Hold
* Notes textarea
* Save action
* Persist to mock API/localStorage
* Show action history timeline

### Phase 7: Analytics Section

* Inventory by brand donut chart
* Aging distribution chart
* Action status counts

### Phase 8: Polish

* Loading states
* Empty states
* Smooth drawer transitions
* Hover states
* Responsive tablet/mobile layout
* Accessibility pass

### Phase 9: Testing

* Filter logic tests
* Aging threshold tests
* Action persistence tests
* Core render smoke tests

## Suggested Folder Structure

```text
src/
  components/
    dashboard/
    inventory/
    actions/
    charts/
    ui/
  pages/
  hooks/
  store/
  services/
  mocks/
  utils/
  types/
```

## Data Models

```ts
Vehicle {
  id
  stockNo
  vin
  make
  model
  year
  mileage
  costPrice
  askingPrice
  location
  daysInStock
  status
}

VehicleAction {
  id
  vehicleId
  type
  note
  createdAt
  user
}
```

## Mock API Contract

```text
GET /vehicles
GET /vehicles/:id
GET /vehicles/:id/actions
POST /vehicles/:id/actions
PATCH /vehicles/:id
```

## Demo Storyline

1. Open dashboard
2. Show KPI cards with aging count
3. Filter Aging 90+
4. Select vehicle row
5. Drawer opens
6. Add manager action
7. Save note
8. History updates instantly

## Timeboxed MVP Priority

1. Layout shell
2. KPI cards
3. Inventory table
4. Filters
5. Aging highlighting
6. Action drawer
7. Charts
8. Tests
9. Polish

## Notes for Submission

* Include architecture decisions in README
* Include AI collaboration narrative
* Keep commits clean and incremental
* Record concise 5-10 minute walkthrough video

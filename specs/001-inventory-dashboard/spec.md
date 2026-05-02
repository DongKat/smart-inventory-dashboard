# Feature Specification: Intelligent Inventory Dashboard

**Feature Branch**: `001-inventory-dashboard`  
**Created**: 2026-05-01  
**Status**: Draft  
**Input**: User description: "Build a frontend web application for dealership managers that provides a real-time view of vehicle stock with searchable/filterable inventory, aging stock highlighting (>90 days), action tracking for aging vehicles, and summary metrics with visual insights. Backend will be mocked."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse and Filter Vehicle Inventory (Priority: P1)

As a dealership manager, I want to view all vehicles in stock in a searchable and filterable list so I can quickly locate specific vehicles and understand current inventory composition without navigating multiple systems.

**Why this priority**: The inventory list is the foundation of the entire dashboard. Without it, no other feature (aging alerts, action tracking, metrics) can function. It delivers immediate standalone value—a manager can review stock at a glance.

**Independent Test**: Can be fully tested by loading the dashboard and verifying that vehicles display in a table with search, sort, and filter controls. Delivers value as a standalone inventory viewer.

**Acceptance Scenarios**:

1. **Given** the dashboard is loaded, **When** I view the inventory section, **Then** I see a table of all vehicles showing make, model, year, price, location, and days in stock.
2. **Given** the inventory table is displayed, **When** I type "Toyota" in the search field, **Then** only vehicles matching "Toyota" in make or model are shown.
3. **Given** the inventory table is displayed, **When** I select a filter for a specific location, **Then** only vehicles at that location are shown.
4. **Given** the inventory table is displayed, **When** I click the "Days in Stock" column header, **Then** the table sorts by days in stock in ascending or descending order.
5. **Given** the inventory has more vehicles than fit on one screen, **When** I scroll or paginate, **Then** I can access all vehicles without performance degradation.

---

### User Story 2 - Identify Aging Stock (Priority: P1)

As a dealership manager, I want vehicles held longer than 90 days to be prominently highlighted so I can immediately identify assets that are tying up capital and increasing holding costs without manually calculating days.

**Why this priority**: Aging stock identification is the core business value of this dashboard—it transforms a generic inventory list into an actionable decision tool. It shares P1 with the inventory list because it is the primary differentiator.

**Independent Test**: Can be tested by verifying that vehicles with days-in-stock > 90 are visually distinct (color, badge, or row highlight) and that a dedicated filter exists to show only aging vehicles.

**Acceptance Scenarios**:

1. **Given** the inventory table is displayed, **When** a vehicle has been in stock for more than 90 days, **Then** it is visually highlighted with a distinct color or badge indicating aging status.
2. **Given** the inventory table is displayed, **When** I activate the "Aging Stock" filter, **Then** only vehicles with more than 90 days in stock are shown.
3. **Given** a vehicle has exactly 90 days in stock, **When** the table renders, **Then** the vehicle is NOT marked as aging (threshold is strictly greater than 90).
4. **Given** vehicles at various ages exist, **When** I view the table sorted by days in stock descending, **Then** the most critical aging vehicles appear first with clear visual severity indication.

---

### User Story 3 - Record Actions for Aging Vehicles (Priority: P2)

As a dealership manager, I want to record a status and proposed action for each aging vehicle—such as price reduction, transfer to another lot, or marketing push—so that decisions are tracked, accountability is clear, and follow-up is visible to the team.

**Why this priority**: Action tracking is the second layer of value. Once a manager identifies aging stock (P1), they need to act on it. Without action recording, the dashboard is read-only and less useful for operational management.

**Independent Test**: Can be tested by selecting an aging vehicle, recording an action (e.g., "Reduce price by 10%"), and verifying the action persists and displays on subsequent views.

**Acceptance Scenarios**:

1. **Given** I am viewing an aging vehicle, **When** I click an action button, **Then** a form appears allowing me to select an action type and add notes.
2. **Given** the action form is displayed, **When** I select "Price Reduction" and enter "Reduce by $2,000" as notes and submit, **Then** the action is saved and visible on the vehicle's row.
3. **Given** a vehicle has a previously recorded action, **When** I view the inventory table, **Then** the action status and last action date are visible on the vehicle row.
4. **Given** I want to update an existing action, **When** I open the vehicle's action history, **Then** I can add a new action while previous actions remain visible as a log.
5. **Given** I record an action and refresh the page, **When** the dashboard reloads, **Then** the recorded action persists and displays correctly.

---

### User Story 4 - View Summary Metrics and Visual Insights (Priority: P3)

As a dealership manager, I want to see summary KPI cards and charts showing inventory health trends—total stock count, aging vehicle count, average days in stock, and inventory value distribution—so I can quickly assess overall lot performance and prioritize my attention.

**Why this priority**: Metrics and charts enhance the dashboard from a list tool to an analytics tool. They add demo polish and executive-level value but depend on the inventory data layer (P1) being functional first.

**Independent Test**: Can be tested by verifying that KPI cards display correct computed values from the vehicle dataset and that charts render with meaningful data points.

**Acceptance Scenarios**:

1. **Given** the dashboard is loaded, **When** I view the summary section, **Then** I see KPI cards showing: total vehicles in stock, number of aging vehicles (>90 days), average days in stock, and total inventory value.
2. **Given** vehicles exist in the dataset, **When** the charts render, **Then** I see a distribution of vehicles by days-in-stock buckets (0-30, 31-60, 61-90, 90+).
3. **Given** the inventory data changes (e.g., filter applied), **When** I look at the KPI cards, **Then** the metrics update to reflect the current filtered view.
4. **Given** the dashboard is loaded on a standard desktop viewport, **When** I view the summary section, **Then** charts are legible, well-labeled, and visually balanced with the rest of the page.

---

### Edge Cases

- What happens when no vehicles match the current search/filter criteria? → Display an empty state with a message like "No vehicles match your filters" and a clear-filters button.
- What happens when the mock backend is unavailable or returns an error? → Display a user-friendly error boundary with a retry button; do not show raw error messages.
- What happens when a vehicle has 0 days in stock (just arrived)? → Display normally with "0" in the days column and no aging indicator.
- What happens when a manager tries to submit an action with no type selected? → The submit button is disabled until a valid action type is selected; inline validation message shown.
- What happens when the inventory list is very large (500+ vehicles)? → Pagination or virtualization ensures smooth scrolling and rendering without lag.
- What happens if localStorage is cleared or unavailable? → Actions history is lost gracefully; the app continues to function with empty action logs and no crash.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a table of all vehicles with columns: make, model, year, trim, price, location, days in stock, and status.
- **FR-002**: System MUST provide a text search field that filters vehicles by make, model, or VIN in real time (as the user types).
- **FR-003**: System MUST provide filter controls for location and stock age range.
- **FR-004**: System MUST support column sorting (ascending/descending) on all data columns.
- **FR-005**: System MUST visually highlight vehicles with more than 90 days in stock using a distinct color or badge.
- **FR-006**: System MUST provide a dedicated "Aging Stock" view or filter that shows only vehicles exceeding 90 days.
- **FR-007**: System MUST allow managers to record an action for any aging vehicle, including action type (price reduction, transfer, marketing push, other) and free-text notes.
- **FR-008**: System MUST persist recorded actions in localStorage so they survive page refreshes.
- **FR-009**: System MUST display an action history log for each vehicle showing all previous actions with timestamps.
- **FR-010**: System MUST display summary KPI cards: total vehicles, aging count, average days in stock, total inventory value.
- **FR-011**: System MUST display at least one chart showing inventory age distribution.
- **FR-012**: System MUST paginate or virtualize the vehicle list when inventory exceeds 50 items.
- **FR-013**: System MUST show appropriate empty states when no data matches current filters.
- **FR-014**: System MUST show loading states during data fetching and error boundaries on failure.
- **FR-015**: System MUST be a single-page application with no page navigation or routing.
- **FR-016**: System MUST use mocked backend data that is realistic (real vehicle makes, models, varied ages and prices).

### Key Entities

- **Vehicle**: Represents a single car in dealership inventory. Key attributes: unique identifier, make, model, year, trim, price, location (lot/branch), date acquired (used to compute days in stock), current status (available, sold, reserved), VIN.
- **Action**: Represents a manager decision or proposed action for a vehicle. Key attributes: unique identifier, associated vehicle, action type (price reduction, transfer, marketing push, other), notes, timestamp of recording, manager who recorded it.
- **Location**: Represents a dealership lot or branch where vehicles are held. Key attributes: name, identifier.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Managers can locate any specific vehicle in the inventory within 10 seconds using search or filters.
- **SC-002**: All vehicles exceeding 90 days in stock are identifiable within 2 seconds of viewing the dashboard (no manual calculation required).
- **SC-003**: A manager can record an action for an aging vehicle in under 30 seconds (select vehicle → choose action type → add notes → submit).
- **SC-004**: Summary metrics are accurate to the current dataset and update within 1 second of filter changes.
- **SC-005**: The dashboard renders fully within 2 seconds on a standard desktop browser with up to 500 vehicles.
- **SC-006**: ≥85% statement coverage of frontend components and state logic, with all critical paths (filtering, aging detection, action persistence) fully tested.
- **SC-007**: The UI is professionally presentable for a recorded demo video without any layout glitches, broken styles, or placeholder content.

## Assumptions

- Target users are dealership managers with stable desktop internet connections using modern browsers (Chrome, Firefox, Edge).
- Mobile-responsive design is not required for v1; optimizing for 1280px+ desktop viewports is sufficient.
- Authentication and multi-user access are out of scope; the application assumes a single manager user.
- The backend is fully mocked—no real API server is required. Data comes from MSW handlers or local JSON fixtures.
- The 90-day aging threshold is fixed and does not need to be configurable by the user in v1.
- Vehicle data is static mock data (not live-updating from an external system).
- localStorage is the persistence mechanism for action logs; no server-side database is needed.
- The mock dataset contains 100–200 vehicles with realistic distribution across ages, locations, and price ranges.

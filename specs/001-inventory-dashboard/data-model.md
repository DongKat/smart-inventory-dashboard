# Data Model: Intelligent Inventory Dashboard

**Feature**: 001-inventory-dashboard  
**Date**: 2026-05-01  
**Source**: Feature spec entities + research decisions

---

## Entities

### Vehicle

Represents a single car in dealership inventory.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | string (UUID) | Unique identifier | Required, immutable |
| vin | string | Vehicle Identification Number | Required, 17 characters |
| make | string | Manufacturer name | Required (e.g., "Toyota", "Ford") |
| model | string | Model name | Required (e.g., "Camry", "F-150") |
| year | number | Model year | Required, 4-digit (2018–2026) |
| trim | string | Trim level | Required (e.g., "SE", "Limited") |
| price | number | Listed sale price in USD | Required, > 0 |
| location | string | Lot/branch identifier | Required, references Location.id |
| dateAcquired | string (ISO 8601) | Date vehicle entered inventory | Required, past or today |
| status | enum | Current vehicle status | Required: "available" | "reserved" | "sold" |
| mileage | number | Odometer reading | Required, >= 0 |
| exteriorColor | string | Vehicle color | Required |

**Derived fields** (computed, not stored):
- `daysInStock`: number — `Math.floor((today - dateAcquired) / MS_PER_DAY)`
- `isAging`: boolean — `daysInStock > 90`

**Validation rules**:
- `vin` must be exactly 17 alphanumeric characters.
- `price` must be a positive number.
- `dateAcquired` must not be in the future.
- `year` must be between 2018 and current year + 1.

---

### Action

Represents a manager decision or proposed action recorded against a vehicle.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | string (UUID) | Unique identifier | Required, immutable |
| vehicleId | string | Reference to Vehicle.id | Required, must exist |
| type | enum | Action category | Required: "price_reduction" | "transfer" | "marketing_push" | "other" |
| notes | string | Free-text description | Optional, 0–500 characters |
| createdAt | string (ISO 8601) | Timestamp of action creation | Required, auto-generated |
| managerName | string | Name of recording manager | Optional (default: "Manager") |

**Validation rules**:
- `vehicleId` must reference an existing vehicle.
- `type` must be one of the defined enum values.
- `notes` is optional; when provided, must be ≤ 500 characters.
- `createdAt` is auto-set at creation time, never user-edited.

---

### Location

Represents a dealership lot or branch.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | string | Unique identifier | Required |
| name | string | Display name | Required (e.g., "Main Lot", "Downtown Branch") |

**Mock data locations** (4 branches):
- `main-lot` → "Main Lot"
- `downtown` → "Downtown Branch"
- `westside` → "Westside Annex"
- `airport` → "Airport Location"

---

## Relationships

```text
Location (1) ──── (many) Vehicle
Vehicle  (1) ──── (many) Action
```

- A Vehicle belongs to exactly one Location.
- A Vehicle can have zero or more Actions (ordered by createdAt descending).
- Actions are append-only (no edit/delete in v1).

---

## State Transitions

### Vehicle Status

```text
available ──→ reserved ──→ sold
    │                        ↑
    └────────────────────────┘
```

- In v1, status is display-only from mock data. No user-initiated status changes.
- Status affects display styling but not filtering logic.

### Action Lifecycle

```text
[none] ──→ created (persisted to localStorage)
```

- Actions are immutable once created.
- No delete or edit workflow in v1.
- Action history is displayed as a chronological log.

---

## Derived Metrics (computed from Vehicle[])

| Metric | Formula | Used In |
|--------|---------|---------|
| totalVehicles | `vehicles.length` | KPI card |
| agingCount | `vehicles.filter(v => v.daysInStock > 90).length` | KPI card |
| averageDaysInStock | `sum(daysInStock) / totalVehicles` | KPI card |
| totalInventoryValue | `sum(vehicles.map(v => v.price))` | KPI card |
| ageDistribution | Group vehicles into buckets: 0–30, 31–60, 61–90, 90+ | Bar chart |
| locationBreakdown | Group vehicles by location | Optional pie chart |

---

## Storage Strategy

| Entity | Source | Persistence |
|--------|--------|-------------|
| Vehicle | MSW mock handler (`GET /api/vehicles`) | In-memory (re-fetched on load) |
| Location | Embedded in vehicle data + static list | In-memory |
| Action | User-created via UI | localStorage via actionService (guarded read/write wrapper) |

**localStorage schema**:
```json
{
  "smart-inventory-actions": {
    "version": 1,
    "actions": [
      {
        "id": "uuid",
        "vehicleId": "uuid",
        "type": "price_reduction",
        "notes": "Reduce by $2,000",
        "createdAt": "2026-04-15T10:30:00Z",
        "managerName": "Manager"
      }
    ]
  }
}
```

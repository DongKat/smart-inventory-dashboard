# API Contracts: Intelligent Inventory Dashboard

**Feature**: 001-inventory-dashboard  
**Date**: 2026-05-01  
**Type**: REST-like mock endpoints (MSW handlers)

---

## Base URL

```
/api
```

All endpoints are intercepted by MSW in the browser. No actual server exists.

---

## GET /api/vehicles

**Description**: Retrieve all vehicles in inventory.

**Request**:
- Method: `GET`
- Query Parameters: None (filtering is client-side)
- Headers: None required

**Response** (200 OK):
```json
{
  "vehicles": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "vin": "1HGBH41JXMN109186",
      "make": "Toyota",
      "model": "Camry",
      "year": 2023,
      "trim": "SE",
      "price": 28500,
      "location": "main-lot",
      "dateAcquired": "2025-12-01",
      "status": "available",
      "mileage": 12500,
      "exteriorColor": "Silver"
    }
  ],
  "total": 150
}
```

**Response fields**:
| Field | Type | Description |
|-------|------|-------------|
| vehicles | Vehicle[] | Array of all vehicle objects |
| total | number | Total count of vehicles |

**Error responses**:
- `500 Internal Server Error`: `{ "error": "Failed to fetch vehicles" }` (simulated for error boundary testing)

**Latency simulation**: 200–500ms random delay via `delay()`.

---

## GET /api/vehicles/:id

**Description**: Retrieve a single vehicle by ID.

**Request**:
- Method: `GET`
- Path Parameters: `id` (string, UUID)

**Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "vin": "1HGBH41JXMN109186",
  "make": "Toyota",
  "model": "Camry",
  "year": 2023,
  "trim": "SE",
  "price": 28500,
  "location": "main-lot",
  "dateAcquired": "2025-12-01",
  "status": "available",
  "mileage": 12500,
  "exteriorColor": "Silver"
}
```

**Error responses**:
- `404 Not Found`: `{ "error": "Vehicle not found" }`

---

## GET /api/locations

**Description**: Retrieve all dealership locations.

**Request**:
- Method: `GET`

**Response** (200 OK):
```json
{
  "locations": [
    { "id": "main-lot", "name": "Main Lot" },
    { "id": "downtown", "name": "Downtown Branch" },
    { "id": "westside", "name": "Westside Annex" },
    { "id": "airport", "name": "Airport Location" }
  ]
}
```

---

## Notes on Client-Side Persistence

Actions are NOT served by the mock API. They are managed entirely client-side:

- **Write**: Actions are created in the Zustand `actionStore` and persisted to localStorage via `actionService.ts` (a try/catch-guarded read/write wrapper).
- **Read**: Actions are loaded from localStorage on app initialization via `actionStore.loadActions()`.
- **No API endpoint** for actions — this is intentional for v1 (mocked frontend only).

If a real backend were introduced, a `POST /api/vehicles/:id/actions` and `GET /api/vehicles/:id/actions` endpoint would be added, and the service layer would switch from localStorage to HTTP calls without changing component code.

---

## Contract Summary

| Endpoint | Method | Purpose | Mock Handler |
|----------|--------|---------|--------------|
| `/api/vehicles` | GET | List all vehicles | `src/mocks/handlers.ts` |
| `/api/vehicles/:id` | GET | Get single vehicle | `src/mocks/handlers.ts` |
| `/api/locations` | GET | List locations | `src/mocks/handlers.ts` |

---

## TypeScript Types (for handler typing)

```typescript
// Response types matching the contracts above

interface VehiclesResponse {
  vehicles: Vehicle[];
  total: number;
}

interface LocationsResponse {
  locations: Location[];
}

interface ErrorResponse {
  error: string;
}
```

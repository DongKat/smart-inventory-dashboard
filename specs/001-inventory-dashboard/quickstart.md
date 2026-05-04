# Quickstart: Intelligent Inventory Dashboard

**Feature**: 001-inventory-dashboard  
**Date**: 2026-05-01

---

## Prerequisites

- Node.js 20+ (LTS)
- npm 9+ or pnpm 8+
- Modern browser (Chrome, Firefox, or Edge)

---

## Setup

```bash
# Clone and navigate to project
cd smart-inventory-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

The app opens at `http://localhost:5173`.

---

## Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run Vitest in watch mode |
| `npm run test:ci` | Run Vitest once with coverage |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier (write mode) |
| `npm run typecheck` | Run `tsc --noEmit` |

---

## Project Structure Overview

```
src/
├── components/       # React UI components
│   └── ui/           # shadcn/ui primitives
├── stores/           # Zustand state management
├── services/         # API service layer
├── types/            # TypeScript type definitions
├── utils/            # Pure utility functions
├── mocks/            # MSW handlers and fixture data
├── App.tsx           # Root component (single page)
├── main.tsx          # Entry point (MSW init + React mount)
└── index.css         # Tailwind base + custom vars
```

---

## Key Development Patterns

### Adding a new component

1. Create `src/components/MyComponent.tsx`
2. Create `src/components/MyComponent.test.tsx` alongside it
3. Export types via props interface
4. Import into `App.tsx` layout

### Modifying mock data

1. Edit `src/mocks/data/vehicles.json`
2. MSW handlers auto-serve updated data on next request

### Adding a store action

1. Add the action signature to the store type in `src/stores/`
2. Implement the action in the store slice
3. Add tests in the co-located test file

### Persisting new data to localStorage

1. Add state to a Zustand store with `persist` middleware
2. Increment the version number in persist config
3. Test hydration in the store's test file

---

## Verifying the Setup

After running `npm run dev`, you should see:

1. A header with "Smart Inventory Dashboard" branding
2. KPI cards showing inventory summary numbers
3. A filter bar with search, location dropdown, and aging toggle
4. An inventory table with vehicle rows (some highlighted as aging)
5. A chart showing age distribution

If the table is empty, verify MSW is initializing (check browser console for `[MSW] Mocking enabled`).

---

## Testing

```bash
# Run all tests
npm run test

# Run tests for a specific file
npm run test -- FilterBar

# Run with coverage report
npm run test:ci
```

Tests use:
- **Vitest** as the test runner
- **React Testing Library** for component interaction tests
- **MSW** (`msw/node`) for mocking API responses in test environment

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| MSW not intercepting | Check `src/main.tsx` calls `worker.start()` before `ReactDOM.render` |
| localStorage data stale | Clear with DevTools → Application → Local Storage → delete `smart-inventory-actions` |
| Types out of date | Run `npm run typecheck` to see TypeScript errors |
| Tests failing on import | Ensure `vitest.config.ts` has matching path aliases from `tsconfig.json` |

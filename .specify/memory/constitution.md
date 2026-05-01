<!--
  Sync Impact Report
  - Version change: 0.0.0 → 1.0.0 (initial ratification)
  - Added principles: I. Unit-Tested Frontend, II. Modular Architecture,
    III. Single-Page Professional UI, IV. Typed & Readable Code,
    V. Performance & Accessibility First, VI. AI-Assisted Ownership,
    VII. Demo-Impact Tradeoffs
  - Added sections: Technical Constraints, Development Workflow
  - Removed sections: none (initial)
  - Templates requiring updates:
    - .specify/templates/plan-template.md ✅ aligned (Constitution Check section)
    - .specify/templates/spec-template.md ✅ aligned (requirements structure)
    - .specify/templates/tasks-template.md ✅ aligned (test-first phases)
  - Follow-up TODOs: none
-->

# Smart Inventory Dashboard Constitution

## Core Principles

### I. Unit-Tested Frontend (NON-NEGOTIABLE)

All frontend features MUST have corresponding unit tests. Every
component, hook, utility, and state logic module MUST be covered by
automated tests before a feature is considered complete.

- Test files MUST live alongside the module they test (co-located).
- Tests MUST validate behavior, not implementation details.
- Mock boundaries (API calls, timers, browser APIs) MUST be isolated
  using MSW or equivalent test doubles.
- No PR or task is complete without passing unit tests for all
  changed modules.

**Rationale**: A demo-ready product requires confidence that features
work correctly. Unit tests are the fastest feedback loop and prevent
regressions during rapid iteration.

### II. Modular Architecture

Code MUST be organized into decoupled, single-responsibility modules
with explicit boundaries between layers.

- Components MUST be reusable and self-contained with props-driven APIs.
- State management MUST be predictable and centralized (Zustand store
  slices or equivalent), never scattered across unrelated components.
- Services (API calls, data transformations) MUST be separated from
  UI components.
- Mock backend MUST be isolated behind a service layer so it can be
  replaced with a real backend without modifying UI code.

**Rationale**: Decoupled modules enable parallel development, easier
testing, and straightforward replacement of mocked services with real
implementations.

### III. Single-Page Professional UI

The application MUST be a single-page dashboard—no routing, no
multi-page navigation. The UI MUST look professional, clean, and
suitable for a recorded demo video.

- Layout MUST be responsive and work on standard desktop viewports.
- Visual design MUST favor clarity and information density over
  decorative elements.
- UI patterns MUST be consistent: uniform spacing, typography,
  color palette, and component styling throughout.
- shadcn/ui components MUST be used as the baseline design system.

**Rationale**: A single-page constraint reduces complexity and keeps
the demo focused on feature value rather than navigation. Professional
appearance builds stakeholder confidence.

### IV. Typed & Readable Code

All source code MUST use TypeScript with strict mode enabled.
Code MUST be readable by a developer unfamiliar with the project.

- All exports MUST have explicit type annotations for function
  parameters, return types, and component props.
- No `any` type unless explicitly justified in a comment.
- Variable and function names MUST be descriptive and self-documenting.
- Files MUST be under 200 lines; extract logic into separate modules
  when approaching this limit.
- Consistent formatting enforced by ESLint + Prettier configuration.

**Rationale**: Typed, readable code reduces onboarding friction,
catches errors at compile time, and makes the codebase maintainable
across iterations.

### V. Performance & Accessibility First

Performance, responsiveness, and accessibility MUST be considered from
the start—even in a mocked frontend implementation.

- Components MUST avoid unnecessary re-renders (React.memo, proper
  dependency arrays, stable references).
- Lists MUST use virtualization or pagination when exceeding 50 items.
- All interactive elements MUST be keyboard-navigable and have
  appropriate ARIA attributes.
- Color contrast MUST meet WCAG 2.1 AA standards.
- Loading states and error boundaries MUST be implemented for all
  async operations.

**Rationale**: Retrofitting performance and accessibility is expensive.
Addressing them from day one ensures the demo is smooth and the
codebase is production-ready in structure.

### VI. AI-Assisted Ownership

AI tools MAY accelerate delivery, but all AI-generated outputs MUST
be reviewed, validated, refined, and fully owned by the developer.

- AI-generated code MUST pass the same quality gates as hand-written
  code (tests, types, lint, readability).
- No code is merged that the developer cannot explain line-by-line.
- AI suggestions that introduce unnecessary abstraction or violate
  other principles MUST be rejected or rewritten.

**Rationale**: AI accelerates velocity but can introduce subtle
issues, over-engineering, or inconsistent patterns. Human ownership
ensures quality and architectural coherence.

### VII. Demo-Impact Tradeoffs

When tradeoffs are required, the solution that improves user workflow,
maintainability, and demo impact MUST be chosen over alternatives.

- Features visible in the demo MUST be prioritized over internal
  tooling or infrastructure gold-plating.
- If a simpler solution achieves the same demo outcome, it MUST be
  preferred over a complex one.
- Scope cuts MUST remove low-visibility features before degrading
  high-visibility ones.

**Rationale**: This is a demo-oriented project with fixed time. Every
decision must maximize the perceived quality and utility shown in the
final recording.

## Technical Constraints

- **Language**: TypeScript (strict mode)
- **Framework**: React 18+ with functional components and hooks
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand (store slices per domain)
- **Charts**: Recharts
- **Mock Backend**: Mock Service Worker (MSW) or local JSON fixtures
- **Persistence**: localStorage as fallback for demo data
- **Testing**: Vitest + React Testing Library
- **Lint/Format**: ESLint + Prettier
- **Target**: Modern browsers (Chrome, Firefox, Edge latest)
- **Page Count**: Exactly one (single-page dashboard)

## Development Workflow

- Every task MUST produce or update unit tests for affected modules.
- Code MUST pass `tsc --noEmit`, ESLint, and Prettier checks before
  completion.
- Features MUST be developed in vertical slices: data layer → state →
  component → tests, all within one task scope.
- Mock data MUST be realistic (vehicle inventory with realistic
  makes, models, ages, prices) to support a convincing demo.
- Components MUST be developed in isolation where possible, with
  props/stories verifying standalone behavior before integration.

## Governance

This constitution supersedes all other development practices for the
Smart Inventory Dashboard project. All code contributions MUST comply
with these principles.

- Amendments require documented justification, a version bump, and
  review of all dependent templates.
- Versioning follows semantic versioning: MAJOR for principle removals
  or incompatible changes, MINOR for additions, PATCH for
  clarifications.
- Compliance is verified at task completion: no task is done unless
  it satisfies all applicable principles above.
- Complexity beyond what is specified MUST be justified in writing
  using the Complexity Tracking section of the implementation plan.

**Version**: 1.0.0 | **Ratified**: 2026-05-01 | **Last Amended**: 2026-05-01

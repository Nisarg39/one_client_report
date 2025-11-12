## Shared Artifacts Required for Agent Runs

### Core Documents
- `docs/plans/<feature>/Plan.md` — phase breakdown, deliverables, exit criteria
- `docs/contracts/<feature>-api.md` — request/response schemas, validation rules
- `docs/design/<feature>.md` — UX guidelines, mock links, accessibility notes
- `docs/status/<feature>-integration-report.md` — latest integration results
- `docs/design/01-DESIGN_PRINCIPLES.md` → `07-ACCESSIBILITY.md` — authoritative design system

### Type & Schema Assets
- `src/types/<domain>.ts` — shared TypeScript interfaces
- `src/backend/types/<domain>.ts` — backend-specific types imported by frontend
- JSON fixtures in `tests/contracts/<feature>/`

### Component Libraries & Tokens
- Prefer shadcn/ui primitives from `src/components/ui/`; extend via `npx shadcn@latest add <component>`
- Use Aceternity UI blocks in `src/components/aceternity/` for motion/hero patterns
- Adhere to color usage: primary CTA `#EA9940`, gradients teal-only (`from-[#307082] to-[#6CA3A2]`)
- Ensure 4.5:1 contrast ratio and responsive spacing from `docs/design/04-SPACING_LAYOUT.md`

### Automation Hooks
- Scripts defined in `package.json`:
  - `lint`
  - `typecheck`
  - `test:unit`
  - `test:contract`
  - `test:e2e`
- Optional: `test:a11y`, `test:visual`

### Workflow Expectations
1. **Plan Agent** creates/updates plan and contract skeletons.
2. **Backend Agent** populates API contract, exports shared types, updates fixtures.
3. **Frontend Agent** consumes shared types, updates UI, records TODOs for missing backend pieces.
4. **Integration Agent** reads latest artifacts, runs checklist, updates integration report.
5. **Documentation Agent** ensures README/CHANGELOG reference final artifacts.

### Naming Conventions
- Use kebab-case for filenames (`<feature>-api.md`, `<feature>-integration-report.md`)
- Prefix feature directories with release or Jira ticket if applicable (`docs/plans/FEAT-123-reporting-dashboard/`)
- Include version headers in contract docs (`## v1.0.0 – 2025-11-12`)

### Storage & Cleanup
- Store intermediate notes in `docs/status/` and prune after release.
- Archive superseded contracts to `docs/contracts/archive/`.
- Remove unused fixtures when feature is abandoned.


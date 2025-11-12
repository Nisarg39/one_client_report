## Tooling & Automation Guardrails

### Command Suite
Add or verify the following scripts in `package.json` so agents can rely on consistent commands:
- `lint`: ESLint + style checks (`next lint` or `eslint .`)
- `typecheck`: `tsc --noEmit`
- `test:unit`: Jest/Vitest unit suite
- `test:contract`: contract/schema validation (e.g., Pact, Zod tests)
- `test:e2e`: Playwright/Cypress smoke tests
- `test:a11y` (optional): Axe/Pa11y accessibility check
- `format`: Prettier fix
- `coverage`: Generates coverage summary (target >80% overall, 90% core utils)

> Ensure CI uses the same commands; agents should run them locally before finishing a task.

### Git Worktree Workflow
1. `cursor-agent` creates isolated worktrees automatically. For manual control:
   - `git worktree add ../<feature>-<agent> main`
   - Run agent inside that directory.
2. After review:
   - `git worktree remove ../<feature>-<agent>`
   - Delete upstream branch if unused.
3. Keep `main` clean; merge via pull request or `--squash` after integration passes.

### Continuous Integration Hooks
- Configure CI pipeline with stages mirroring scripts above.
- Require `lint`, `typecheck`, and `test:unit` on every PR.
- Run `test:contract` and `test:e2e` nightly or on demand due to runtime cost.
- Report results back to agents via comments or by updating `docs/status/<feature>-ci.md`.

### Static Analysis & Quality Gates
- Enable TypeScript strict mode; agents rely on compiler to catch mismatches.
- Use schema validation (Zod/Yup) shared between frontend and backend to enforce contracts.
- Integrate Danger or custom bots to warn when contract files change without version bumps.
- Track coverage thresholds in CI (`--coverage`). Fail builds if thresholds dip below policy.

### Secrets & Environment Management
- Store `.env.example` with required variables.
- Provide stub env values for agents; avoid granting access to production secrets.
- Document environment switching in `docs/ops/environment.md`.

### Monitoring Tools
- Maintain dashboards or log queries in `docs/ops/monitoring.md`.
- Integration Agent should append links to these dashboards in post-launch reports.

### Failure Recovery
- If agent run corrupts worktree: reset via `git worktree prune` and re-checkout.
- For flaky tests: annotate known flakes in `docs/status/<feature>-known-issues.md`.
- Encourage agents to halt and raise TODO when guardrail command fails twice.
- Use MSW or equivalent to mock third-party APIs during test runs to avoid quota issues.


## Integration Checklist

### Before Integration Agent Runs
- [ ] `Plan.md` approved and linked to latest contract docs
- [ ] Backend branch rebased, tests green, lint clean
- [ ] Frontend branch rebased, tests green, lint clean
- [ ] API mocks/fixtures committed
- [ ] Feature flags or config toggles documented

### Integration Agent Tasks
1. **Sync & Read**
   - Checkout backend & frontend worktrees
   - Read `docs/contracts/*.md`, shared type definitions, and recent changelog entries
2. **Static Verification**
   - Run `npm run lint`
   - Run `npm run typecheck`
   - Run `npm run test:unit`
3. **Contract Validation**
   - Run `npm run test:contract` (or equivalent)
   - Verify request/response payloads align with `API-CONTRACT_TEMPLATE`
   - Update `docs/contracts/CHANGELOG.md` with result summary
4. **End-to-End / Smoke Tests**
   - Execute `npm run test:e2e` or Cypress/Playwright suite
   - Record failures with links to logs or screenshots
5. **Manual QA Hooks**
   - Launch local environment, validate critical user journeys
   - Check accessibility quick scan (`npm run test:a11y` if available)
6. **Reporting**
   - Create `docs/status/<feature>-integration-report.md` summarizing:
     - Test outcomes
     - Contract mismatches
     - Required follow-ups / TODOs
   - Tag responsible agents for fixes
7. **Coverage Review**
   - Confirm `npm run coverage` meets policy thresholds (>80% overall, >90% core utilities)
   - Attach coverage summary to integration report

### Sign-off Gate
- [ ] All blocking issues resolved or ticketed with owners
- [ ] Integration report reviewed by product/tech lead
- [ ] Release checklist completed (`docs/release/<feature>.md`)


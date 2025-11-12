## Cursor Multi-Agent Execution Pipeline

### Phase 0 — Kickoff
1. Human lead gathers requirements, architectural constraints, and success metrics.
2. Create feature directory: `docs/plans/<feature>/`.
3. Initialize tracker files:
   - `Plan.md` (copy from `FEATURE-PLAN_TEMPLATE.md`)
   - `contracts/<feature>-api.md` (copy from `API-CONTRACT_TEMPLATE.md`)
   - `status/<feature>-integration-report.md` (empty scaffold)

### Phase 1 — Planning Loop
1. Run Plan Agent with kickoff materials.
2. Review generated plan, annotate clarifications.
3. Iterate until plan covers:
   - Clear phases & owners
   - Acceptance criteria & risks
   - Contract sections stubbed

### Phase 2 — Contract Finalization (Sequential)
1. Backend Agent drafts API request/response schemas, validation rules.
2. Human lead or Plan Agent reviews for completeness.
3. Frontend Agent confirms contract meets UX needs; request adjustments if not.
4. Freeze contract version (`## v1.0.0`) and notify all agents.

### Phase 3 — Parallel Implementation
1. Backend & Frontend agents run concurrently using frozen contract.
2. Each agent logs progress in `docs/status/<feature>-daily.md`.
3. Auto-run sanity commands per agent before completion (`lint`, `test:unit`, etc.).
4. Integration Agent monitors TODOs flagged in code/contract files.
5. For third-party APIs, Integration Agent coordinates credential setup and quota checks early.

### Phase 4 — Integration Checkpoint (Sequential)
1. Merge backend and frontend worktrees into integration branch.
2. Run Integration Agent following `INTEGRATION-CHECKLIST.md`.
3. Record results in `status/<feature>-integration-report.md`.
4. If failures occur:
   - Create issues/TODOs
   - Re-run responsible agent with narrowed prompt
   - Repeat checkpoint after fixes
5. Validate OAuth flows, rate limiting, and data normalization for marketing platform integrations.

### Phase 5 — Documentation & Rollout Prep
1. Documentation Agent updates README, release notes, support docs.
2. Verify feature flags/config toggles documented.
3. Conduct manual QA session; append findings to integration report.

### Phase 6 — Release & Post-Launch
1. Human lead reviews final integration report + diffs.
2. Merge to main branch, deploy to staging/production.
3. Monitor logs/metrics; Integration Agent (or human) runs post-launch checklist after 24h.
4. Archive plan/contract docs with release tag.

### Iteration Guidelines
- Keep agent runs short (<30 min) to reduce drift.
- After any contract change, rerun impacted agents sequentially.
- Use feature flags for risky changes so integration can proceed before full rollout.
- Maintain a single source of truth by updating contract docs before code.

### Checkpoint Summary
| Checkpoint | Trigger | Owner | Outputs |
|------------|---------|-------|---------|
| C0 Kickoff | Requirements ready | Human lead | Draft Plan, empty contracts |
| C1 Plan Approval | Plan Agent iteration complete | Product/Tech lead | Signed-off Plan, TODO list |
| C2 Contract Freeze | Contract validated by FE/BE | Tech lead | Versioned API contract |
| C3 Integration | Backend & Frontend complete | Integration Agent | Integration report, test results |
| C4 Release | QA pass & sign-off | Human lead | Deployment checklist |
| C5 Post-Launch | T+24h | Integration Agent | Post-launch review notes |


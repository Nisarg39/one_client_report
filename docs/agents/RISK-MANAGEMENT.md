## Risk Management & Monitoring Checklist

### Common Failure Modes
| Risk | Symptoms | Mitigation |
|------|----------|------------|
| Spec drift between agents | mismatched prop names, failing contract tests | Freeze contract versions; require reread before each run |
| Long-running agent sessions | large conflicting diffs, outdated context | Keep sessions short (<30 min), rerun with latest plan |
| Ambiguous requirements | TODO sprawl, guesses in code | Demand clarifications in plan; Plan agent logs open questions |
| Missing test coverage | regressions undetected until QA | Enforce test command guardrails; add templates for new tests |
| Environment mismatch | backend agent uses env vars frontend lacks | Maintain `.env.example`; Integration agent validates configs |
| Manual merge errors | lost changes, rework | Use integration branch + code review before merge |

### Monitoring Checklist (Per Feature)
- [ ] `docs/plans/<feature>/Plan.md` updated with latest decisions
- [ ] Contract doc version matches codebase types
- [ ] `docs/status/<feature>-integration-report.md` recent (<24h)
- [ ] All guardrail commands pass (lint, type, unit, contract, e2e)
- [ ] TODOs resolved or ticketed with owners
- [ ] Feature flags and rollout plan documented
- [ ] Post-launch monitoring configured

### Escalation Protocol
1. Agent detects blocker → adds TODO + updates `docs/status/<feature>-issues.md`
2. Human lead reviews within agreed SLA (e.g., 2h)
3. Decide to:
   - clarify spec and rerun agent
   - adjust contract and notify all agents
   - pause automation and handle manually

### Communication Cadence
- Daily async update: agents append 3 bullets (Done/Doing/Blocked) in `docs/status/<feature>-daily.md`
- Integration report posted at each checkpoint
- Weekly retrospective summarizing lessons learned

### Post-Mortem Template
After major incident:
1. Timeline of events
2. Root cause analysis
3. Corrective actions (one-time fixes)
4. Preventive actions (process/tooling updates)
5. Owners & due dates

### Continuous Improvement
- Track metrics: plan churn, integration failures, average agent run time.
- Review guardrail effectiveness quarterly; iterate on templates.
- Share prompt improvements in `docs/agents/PROMPT-TEMPLATES.md`.


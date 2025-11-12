## Feature Delivery Plan

### 1. Overview
- **Feature Name**: <!-- concise label -->
- **Problem Statement**: <!-- why this feature matters -->
- **High-Level Outcome**: <!-- user/business value -->
- **Key Risks / Assumptions**: <!-- scope, dependencies, constraints -->

### 2. Scope & Deliverables
- **Frontend Deliverables**:
  - UI components/pages
  - State management/data fetching
  - Validation, accessibility, responsiveness
- **Backend Deliverables**:
  - Routes/endpoints/actions
  - Data model updates/migrations
  - Business logic, auth/permissions
- **Shared Assets**:
  - Type definitions/interfaces
  - Analytics/telemetry hooks
  - Documentation updates

### 3. Phases & Owners
| Phase | Responsible Agent | Inputs | Outputs | Exit Criteria |
|-------|-------------------|--------|---------|---------------|
| Planning & Contract Draft | Plan Agent | product requirements, tech constraints | updated `Plan.md`, contract docs | Stakeholders sign-off |
| Backend Implementation | Backend Agent | `Plan.md`, contracts, schemas | backend diffs, tests | API contract satisfied & tests green |
| Frontend Implementation | Frontend Agent | `Plan.md`, contracts, backend mock/stub | UI diffs, stories/tests | UI passes lint/ts/test & contract snapshot |
| Integration & QA | Integration Agent | merged backend+frontend branches | integration report, fixed issues | end-to-end tests green |
| Documentation & Handover | Documentation Agent | previous outputs | README/CHANGELOG updates | docs reviewed & approved |

### 4. Timeline & Milestones
- **Start Date**: <!-- yyyy-mm-dd -->
- **Target Release**: <!-- yyyy-mm-dd -->
- **Milestones**:
  - M1: Plan & contract approved
  - M2: Backend API ready
  - M3: Frontend integration done
  - M4: Integration tests + QA pass
  - M5: Release sign-off

### 5. Acceptance Criteria
- Functional:
  - <!-- bullet list of scenarios -->
- Non-Functional:
  - Performance budgets
  - Security/authorization requirements
  - Accessibility & localization
- Operational:
  - Monitoring/alerting updated
  - Rollback strategy defined

### 6. Coordination Notes
- **Communication cadence**: daily async standup updates in `docs/status/<feature>.md`
- **Shared artifacts**: contract docs, API schema snapshots, UI mock links
- **Dependencies**: <!-- integrations, 3rd-party APIs -->
- **Escalation**: <!-- when to pause automation or involve humans -->

### 7. Review Checklist
- [ ] Contract docs current and linked
- [ ] Lint, typecheck, unit/integration tests green
- [ ] Accessibility & performance checks documented
- [ ] Deployment plan reviewed
- [ ] Risk log updated

### 8. Post-Launch Tasks
- **Monitoring dashboards**: <!-- dashboards or alerts -->
- **Analytics instrumentation**: <!-- events to verify -->
- **Post-release review date**: <!-- yyyy-mm-dd -->
- **Follow-up backlog items**: <!-- nice-to-haves -->


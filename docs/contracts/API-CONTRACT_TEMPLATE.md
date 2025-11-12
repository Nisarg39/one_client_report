## API & Data Contract

### 1. Overview
- **Feature / Capability**: <!-- e.g. "Client Reporting Form" -->
- **Primary Consumer(s)**: <!-- Frontend components / services -->
- **Upstream & Downstream Dependencies**: <!-- external services, queues -->

### 2. Endpoint Specification
| Route | Method | Description | AuthZ | Rate Limit |
|-------|--------|-------------|-------|-----------|
| `/api/...` | POST | <!-- summary --> | <!-- role/policy --> | <!-- e.g. 60/min --> |

#### Request Schema
```ts
interface RequestBody {
  // TODO: detail fields, types, optional/required, validation rules
}
```

#### Response Schema
```ts
interface SuccessResponse {
  // TODO: success payload
}

interface ErrorResponse {
  code: string; // domain-specific error code
  message: string;
  details?: unknown;
}
```

### 3. Validation & Business Rules
- **Server-side validation**: <!-- field-level rules, regex, cross-field checks -->
- **Derived fields / transformations**: <!-- default values, computed props -->
- **Failure modes**:
  - `400_INVALID_INPUT`: <!-- description -->
  - `401_UNAUTHORIZED`: <!-- description -->
  - `409_CONFLICT`: <!-- description -->

### 4. Data Model Changes
- **Database Tables/Collections**: <!-- new/updated tables with columns -->
- **Migrations Required**: <!-- yes/no, scripts location -->
- **Referential integrity**: <!-- cascade rules, indexes -->

### 5. Integration Contract Tests
- **Mock fixtures**: `tests/contracts/<feature>/request.json`, `response.json`
- **Test commands**: `npm run test:contract`, `npm run lint`
- **Acceptance criteria**:
  - contract tests pass
  - schema version bumped in `docs/contracts/CHANGELOG.md`

### 6. Observability
- **Logging**: <!-- structured log fields -->
- **Metrics**: <!-- counters, histograms -->
- **Tracing**: <!-- spans, correlation IDs -->

### 7. Security & Compliance
- **Authn/Authz**: <!-- JWT, session, RBAC, ABAC -->
- **PII / Sensitive Data Handling**: <!-- encryption, masking -->
- **Rate limiting / abuse prevention**: <!-- thresholds, burst handling -->

### 8. Sign-off
- Backend Lead: `@`
- Frontend Lead: `@`
- QA / Integration: `@`
- Date: <!-- yyyy-mm-dd -->


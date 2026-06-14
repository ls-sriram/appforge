# Tasks

## REC-INT-001
- Status: done
- Summary: Establish recordings product/docs baseline and platform-level endpoint policy.
- Notes: Completed via `product.md` and initial docs structure.

## REC-INT-002
- Status: done
- Summary: Verify backend recordings contract in `server/` and document route/auth/persistence behavior.
- Notes: Current-state documented with explicit gap around missing app-level SQL scoping.

## REC-INT-003
- Status: ready
- Summary: Add explicit app-scoped persistence enforcement for recordings.
- Dependencies: REC-INT-002
- Implementation target:
  - Introduce `app_id` column/constraint for recordings (or equivalent partition key).
  - Include `app_id` in insert/list/content queries.
  - Thread app context into SQL request context and/or repository method signatures.

## REC-INT-004
- Status: ready
- Summary: Add regression tests proving no cross-app recording visibility for same user id.
- Dependencies: REC-INT-003
- Checks:
  - Route/repository integration test with two app contexts and shared uid.
  - Ensure content/list endpoints deny cross-app access.

## REC-INT-005
- Status: backlog
- Summary: Align frontend recordings repository documentation/assumptions with enforced backend app-scoping behavior.
- Dependencies: REC-INT-004

# Finance delivery roadmap and retirement checklist

Updated 19 October 2026. One product, one canonical repository (KingSingOS/finance), one production application. v0 is an optional design/build authoring tool for this same source; no permanent dependency on a separate v0-blcbk repository or second project is intended.

## Current evidence

- [x] Consolidated UI source candidate: analysis and existing cap-table in one app; no-reload worksheet New preserves analysis state.
- [x] Native local lint/types/build and199tests/17suites pass;59transfer assertions added to CI.
- [x] Root design.md and source/provenance/transfer records prepared.
- [ ] Browser journey and accessibility verification: local CUA initialization and native Edge launch failed before assertions. These are environment failures, not passed UI checks.
- [ ] Persistent project-admin-approved cap-table and approved balance-sheet projection. Finance has an intended company_users admin schema, not authenticated runtime RBAC; v0-blcbk has no suitable enforced RBAC to reuse. Implement this on the Finance roadmap, preserving the existing model and source evidence.
- [ ] Persistent analysis save/reopen, permissions, backup/restore and migration qualification. Current candidate records are in-memory and require explicit export.

## RBAC and approved register

1. Admit verified user identity and project/company memberships; require project admin server-side for exact proposal approvals. Never treat worksheet edit links as admin identity.
2. Implement proposal/scenario separation, immutable approved versions, exact parent/content binding, replay/concurrency control and audit-failure denial in a transactional datastore.
3. Reuse Finance cap-table model without promoting example rows into an approved starting register.
4. Project only accepted effective accounting events into balance-sheet inputs; preserve accounting mapping/version and avoid duplicate postings or valuation-as-book-equity assumptions.
5. Verify allowed/denied, cross-project, stale/revoked authority and recovery cases. See approved-equity-register.md.

## v0-blcbk retirement gates

- [ ] Inventory/export real records from both origins; owner instructed treating both as real. Preserve original records and source history.
- [ ] Accept merged feature parity and formula/data differences with evidence; retain useful v0 flows and Finance cap-table.
- [ ] Qualify actual browser entry/calculate/save/reopen/compare/export/import and cap-table links/New/recovery in unified app.
- [ ] Reconcile Cloudflare runtime to source: BOS Worker exists, D1 list and Worker binding list are empty despite repo declarations. Do not overwrite or invent production data resources.
- [ ] Establish one approved production build, hosting/domain and recovery path; verify release and user outcomes.
- [ ] Inspect/rebind or stop old v0 source sync so only Finance repository is authoritative. Preserve v0 design sources and reviewed design.md; no second source lifecycle.
- [ ] Verify the old deployment is no longer a required application/data dependency. Keep rollback window and owner acceptance evidence.
- [ ] Only then archive v0-blcbk read-only with a Finance redirect and retained history; retire duplicate hosting deliberately. Archival/deletion is not performed by the current UI PR.

Current status: consolidation candidate is reviewable, retirement is NOT safe yet. Roadmap unchecked items are not supplied by a passing source build.

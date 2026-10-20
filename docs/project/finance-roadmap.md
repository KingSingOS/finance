# Finance delivery roadmap and retirement checklist

Updated 20 October 2026. One product, one canonical repository (KingSingOS/finance), one production application. v0 is an optional design/build authoring tool for this same source; no permanent dependency on a separate v0-blcbk repository or second project is intended.

## Current evidence

- [x] Consolidated UI source candidate: analysis and existing cap-table in one app; no-reload worksheet New preserves analysis state.
- [x] Native local lint/types/build and199tests/17suites pass;59transfer assertions added to CI.
- [x] Root design.md and source/provenance/transfer records prepared.
- [x] Six isolated browser checks pass: initial analysis has no external requests, last input edit uses fresh totals, JSON export retains actual inputs, retained analysis reopens, cap-table opens, and analysis survives switching modules. External services were blocked; this is synthetic browser evidence only.
- [ ] Wider import/comparison/legacy-link/New journeys, keyboard/mobile/accessibility and live-backend verification remain open.
- [ ] Persistent project-admin-approved cap-table and approved balance-sheet projection. Finance has an intended company_users admin schema, not authenticated runtime RBAC; v0-blcbk has no suitable enforced RBAC to reuse. Implement this on the Finance roadmap, preserving the existing model and source evidence.
- [ ] Persistent analysis save/reopen, permissions, backup/restore and migration qualification. Current candidate records are in-memory and require explicit export.

## RBAC and approved register

1. Admit verified user identity and project/company memberships; require project admin server-side for exact proposal approvals. Never treat worksheet edit links as admin identity.
2. Implement proposal/scenario separation, immutable approved versions, exact parent/content binding, replay/concurrency control and audit-failure denial in a transactional datastore.
3. Reuse Finance cap-table model without promoting example rows into an approved starting register.
4. Project only accepted effective accounting events into balance-sheet inputs; preserve accounting mapping/version and avoid duplicate postings or valuation-as-book-equity assumptions.
5. Verify allowed/denied, cross-project, stale/revoked authority and recovery cases. See approved-equity-register.md.

## v0-blcbk retirement gates

- [x] Owner confirms on 19 October that neither version is in use and all records are synthetic. No real-record migration is required for this prototype consolidation. Preserve source history and do not erase synthetic examples without an intentional cleanup.
- [ ] Accept merged feature parity and formula/data differences with evidence; retain useful v0 flows and Finance cap-table.
- [ ] Qualify actual browser entry/calculate/save/reopen/compare/export/import and cap-table links/New/recovery in unified app.
- [ ] Reconcile Cloudflare runtime to source: BOS Worker exists, D1 list and Worker binding list are empty despite repo declarations. Do not overwrite or invent production data resources.
- [ ] Establish one approved production build, hosting/domain and recovery path; verify release and user outcomes.
- [ ] Inspect/rebind or stop old v0 source sync so only Finance repository is authoritative. Preserve v0 design sources and reviewed design.md; no second source lifecycle.
- [ ] Verify the old deployment is no longer a required application/data dependency. Keep rollback window and owner acceptance evidence.
- [ ] Only then archive v0-blcbk read-only with a Finance redirect and retained history; retire duplicate hosting deliberately. Archival/deletion is not performed by the current UI PR.

Current status: unified prototype source is merged; retirement is NOT safe yet. Roadmap unchecked items are not supplied by a passing source build.

## Integration and release checkpoint — 19 October 2026

The owner approved one canonical Finance source integration and explicit manual production releases. The six browser checks and exact UI-head native CI passed. The separate release-control change removes automatic deployment on merge; source integration does not certify the live Worker or approve a release. Current Cloudflare resource mismatch, missing deployment credentials and Worker dependency/lock qualification remain release blockers. Persistent approved cap-table, project-admin RBAC and balance-sheet projection remain required roadmap features, not implied by the merged prototype.

## Private pilot decision and release-route containment — 20 October 2026

- [x] Owner selected a private invited-member pilot; public self-registration is outside this first access model.
- [x] Unified source, guarded manual-release control and canonical README merged (PRs 3, 4 and 5). This is source integration, not production release or durable approved records.
- [x] GitHub workflow states independently read back: legacy deploy-cloudflare-v3.yml, deploy-staging.yml, deploy.yml and staging.yml are disabled_manually. The canonical deploy-cloudflare.yml remains active and manually triggered. No deployment was triggered or existing service stopped.
- [ ] Select and qualify a supported identity provider; invite redemption must bind the verified identity, expire and resist replay. A project member cannot invite or approve as an admin merely by possessing a worksheet edit link.
- [ ] Implement server-enforced membership/admin grants, revocation and cross-project denial before storing authoritative approved records. Preserve the existing cap-table model as scenario input; example rows are not approved ownership.
- [ ] Qualify Worker frozen dependencies/types/tests, persistent transactions, backup/restore and approved balance-sheet projection; run positive and adverse synthetic journeys before any owner release decision.

Legacy workflow source/history remains for audit; repository-level disabled status is a host setting and must be rechecked after migration or workflow replacement. Re-enabling an alternate release route requires explicit owner scope and qualification. The invitation-only decision does not select a provider, create users, grant live roles or authorize deployment.

## Worker dependency baseline clarification — 20 October 2026

The root workspace lock already includes every Worker manifest requirement. The separate worker/pnpm-lock.yaml was missing lz-string, Vitest and the Workers test-pool dependency. The repaired standalone file reuses the existing workspace Worker versions and integrity records; no package manifest or requested dependency version changed. Offline frozen lock-metadata validation passed locally. The new Worker dependency baseline CI performs an actual standalone frozen install with lifecycle scripts disabled, independently of the existing application checks.

This dependency gate does not run Worker types, tests, Wrangler, migrations or a service. Native Worker type/test configuration, local resource isolation, a functioning API and release-resource qualification remain unchecked. Do not infer that the active workspace install was broken merely from the obsolete standalone file.

## Worker native checks — 20 October 2026

The unchanged Worker typecheck reproduced TS2305: the cloudflare:test declaration did not load its env export. Explicitly referencing the installed Workers test-pool types in test/env.d.ts fixes the failure without casts, generated-type edits or excluding tests. The complete existing Worker typecheck passes locally. The existing three legacy conversion tests also pass in the local Workers runtime; they test decoding, not authenticated API/storage behaviour. Local Wrangler logging/cleanup warnings are retained as environment limitations.

The Worker dependency workflow now runs source/test typechecking and the existing non-watch runtime suite after the frozen install. They are mandatory failing gates, not allowed failures. Both execute independently when install succeeds. No remote bindings, migrations, deployment or credentials are added. Hosted qualification of this revision is required; invitation/admin approval, persistent transactions and API positive/adverse proof remain open.

## Isolated worksheet API and collaboration qualification — 20 October 2026

The source now has seven synthetic Workers-runtime integration cases in addition to the three legacy decoder tests. They exercise the actual SELF handler and local D1: missing reads do not create records; capability create/read/update; missing/wrong edit-key denial without version/data mutation; malformed input and invalid method/ID refusal; preflight without creation; invalid conversion/calculation; and an actual attached WebSocket receiving the persisted version-two update notification. Outbound application fetches are blocked. No credentials or live Cloudflare resources are used.

The initial six API cases passed locally, but the handler logged a caught Durable Object broadcast error in the Windows sandbox. That result is not complete collaboration proof. The seventh case requires the actual notification and same-worksheet readback and has not been claimed passed locally; hosted Linux qualification must settle it. Full source/test typechecking passes with all seven cases present. Independent review confirms the notification promise still fails the test on timeout/error; an early rejection observer does not convert failure to success.

This suite documents the inherited prototype capability model, including anonymous read-by-ID. It does not supply invited identity, project membership or admin rights and must not be used to approve real financial records. Permission revocation, cross-project isolation, concurrency, durable process restart and backup/restore remain required before private-pilot release. No production deployment or migration is requested by these tests.

## Separate-process collaboration gate — 20 October 2026

Hosted Linux ran nine passing native cases, but the WebSocket case failed isolated-storage teardown (a Durable Object SQLite sidecar), so that run was not accepted. Cloudflare documents Durable Object WebSocket limits with Vitest per-file storage isolation: https://developers.cloudflare.com/workers/testing/vitest-integration/known-issues/#websockets . The HTTP/API and legacy suites retain their existing isolated storage; no gate is skipped or continued-on-error.

The collaboration scenario moves to a mandatory separate Node process using the already-declared Miniflare3 dependency and Wrangler's locked esbuild. It bundles the actual Worker, initializes the actual repository migration into fresh ephemeral local D1/DO storage, blocks external outbound requests, requires the real version-two notification and readback, and bounds the reciprocal close handshake and disposal. Native Vitest now contains six API cases plus three legacy cases; the separate process supplies the additional end-to-end collaboration scenario. This is a different lifecycle boundary, not removal of the failed requirement or disabling HTTP-test isolation.

The Windows standalone attempt hit a local SQLite/runtime transport failure before qualification. Hosted execution remains required. The process gate is a local simulation at the configured compatibility date, not live Cloudflare release, restart/recovery or authenticated approval proof. No new package or runtime resource is requested.

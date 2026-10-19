# Approved cap-table and balance-sheet contract

19 October 2026. Owner requirement accepted; implementation and operational qualification pending. Current worksheet modelling and in-memory analysis do not establish an approved equity register.

## Product behavior

One persistent company-scoped register has a current approved version. Users can explore funding scenarios or draft changes without changing that version. The UI clearly separates Approved, Proposed and Scenario records. Approve displays the exact before/after change, effective date, financial impact and supporting evidence; the approved version advances only when the authorized human confirms that exact proposal. Owner decision: each authenticated project admin may approve within that project, using Finance cap-table model as the model basis. Existing Finance edit-link authority is not user RBAC; identity/membership provider remains to establish. Model reuse does not approve fictional/example shareholder data.

Each approval binds authenticated actor/company, proposal digest, expected prior version, effective date and action. Changed proposal content invalidates approval. Concurrent stale proposals require review against the new approved parent. Replay cannot create another posting. Server-side enforcement, company-scoped permissions, audit-write failure denial and transactional publication are required; a browser button or editable status field does not supply authority.

Original approved versions and approval/rejection records are retained. Corrections are new authorized events, not silent edits to history. Source documents, ownership units/classes, instrument terms, currency and recorded accounting amounts remain traceable. Backup/export and tested restore are prerequisites for relying on persistence. Do not initialize a fabricated approved register from a calculator example or infer historical transactions from percentages.

## Balance-sheet linkage

The balance sheet records the exact approved register/version and accounting mapping version used. Only approved and effective accounting entries feed its equity or other applicable lines. Scenario valuations, fully diluted percentages and proposed rounds cannot automatically overwrite recorded balances. Retained earnings and other equity sources remain separately reconciled; approved ownership is not the whole balance sheet. Do not double-count an event already posted in the accounting ledger.

Accounting classification depends on actual instrument terms and applicable reporting policy. IAS32 distinguishes equity and liabilities and treats compound instruments separately; it does not make every cap-table item ordinary share capital. Primary rationale: https://www.ifrs.org/issued-standards/list-of-standards/ias-32-financial-instruments-presentation/ . The project's reporting framework, classification and posting rules must be explicitly accepted; this specification does not choose them or certify compliance.

## Implementation sequence and acceptance

1. Confirm approval authority, company identity, initial register and reporting/mapping policy.
2. Reconcile existing Cloudflare resources. BOS currently returns the expected Worker but no D1 database and empty Worker bindings; do not treat repository declarations as an existing safe datastore or overwrite unknown real records.
3. Implement authenticated persistent register/proposal/approval/audit transaction and backup/restore in an isolated nonproduction environment.
4. Prove allowed approval, unauthorized rejection, cross-company denial, stale version/content rejection, replay idempotency, concurrent proposals and audit/storage failure recovery.
5. Add balance-sheet projection from approved effective entries with source/version references and reconciliation tests; no draft/scenario influence or duplicate posting.
6. Demonstrate full browser journey, owner acceptance and a separately approved production cutover after real-record preservation rehearsal.

Current status: UI consolidation candidate built locally; authoritative persistence, approvals and balance-sheet projection remain outstanding. No live data, approval record or deployment was created.

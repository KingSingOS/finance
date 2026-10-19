# Design — unified Finance workspace

Status: Observed implementation plus proposed integration; owner acceptance pending.
Owner: product owner (user). Last reviewed: 2026-10-19. Scope: Finance Vite frontend, financial analysis and existing cap-table worksheet.
Evidence baseline: KingSingOS/finance candidate1beb6f951bbb2f0ab213ec8d0579dd102f438bf2 (merged as a428f7273ace46b714f104e9f1eed489cee35586); v0-blcbk16b0d24b1eff7d1c7e21028aec6fb362efe1e4c2 informed the journey. Local unified changes are not yet published or accepted.

## Purpose, users and authority

One application should let a business owner analyse a statement and model funding/ownership without choosing between separate implementations. Financial analysis follows v0's actually connected entry/results/saved/comparison flow; the existing Finance worksheet and calculator library remain valuable. This choice reflects observed behavior and migration cost, not demonstrated visual superiority. Users may be nontechnical; currency, period, basis, unknown data and retention must be explicit.

Brand authority is unknown. Preserve observed Finance theme and1984 Ventures source/license notices; do not imply new branding or exclusive ownership. No paid kit, component registry or new framework was installed. The new analysis component uses semantic native controls and is an integration candidate, not a visually harmonized production design.

| Authority | Current source | Qualification |
|---|---|---|
| Shared navigation and module lifecycle | app/src/app/FinanceWorkspace.tsx | Implemented; browser proof pending |
| Legacy link compatibility | app/src/app/workspaceRouting.ts and utils/__tests__/workspaceRouting.test.ts | Canonicalizes query while preserving hash; native regression tests |
| Analysis input, retention, import and comparison | app/src/app/financial-analysis/FinancialAnalysisWorkspace.tsx | Local in-memory candidate |
| Calculation/transfer contract | financial-analysis/aggregate-ratios.mjs, analysis-transfer.mjs, normalizeStatement.ts | Candidate aggregate model; not equivalent to detailed Finance toolkit |
| Existing ownership worksheet | app/src/app/cap-table/page.tsx, WorksheetContainer.tsx | Existing code preserved; live backend/security qualification remains separate |
| Native components and tokens | app/src/app/components/ui, app/src/app/index.css, app/tailwind.config.js | Existing system; no conformance certification |
| Delivery roadmap/status | This document and docs/project/pr-responses/PR-0002-ci-repair.md; programme outputs/finance-unified-ui.md | CI repair record predates this integration |

## Visual identity and reuse

Exact semantic color, surface, foreground, primary/secondary, error, border, ring, chart and radius values remain in index.css. Existing .dark theme and worksheet mode control remain intact. The analysis candidate has no separate theme switch and follows inherited styling; cross-module theme consistency is unverified. Existing Tailwind configuration and manifest/lockfile are authoritative for typography and dependency versions. No new font or icon assets were introduced. The shared shell and candidate use modest inline spacing; these are provisional layout choices, not approved portfolio tokens.

Reuse existing button/input/card primitives when visual harmonization is reviewed; do not globally replace their contracts. Native tables provide textual financial values instead of adding an unqualified chart dependency. Labels, fieldsets, legends, captions, column headers and alert/status roles are present, but keyboard, contrast, zoom/reflow, mobile and screen-reader acceptance still need actual tests.

## Journeys and states

| Journey/state | Person sees and can do | Data and recovery | Status |
|---|---|---|---|
| First use | Empty statement; missing amounts stay blank; explicit unknown currency | No fabricated records or automatic storage import | Implemented candidate |
| Enter → calculate → results | Name/period/date and financial fields; synchronous normalization; unavailable ratios explained | Invalid/nonfinite values rejected; form remains present | Source and normalization regression checks |
| Retain → reopen | Saved means retained in this tab, explicitly labelled | Export JSON before reload; no server persistence claim | Browser roundtrip pending |
| Export/import | Explicit file action, validated preview, separate acceptance | Preserve original source record; revalidate acceptance against current records, limit1000; discrepancies surfaced | Module and integration checks; browser file handling pending |
| Compare | Select at least two records | Same company, known currency and known operating-income basis required; period comparability remains user judgement | Candidate behavior, no fake benchmarks |
| Switch tools | Shared navigation preserves mounted analysis state | Worksheet loads only when selected or legacy hash opens it; once opened, existing service remains active on switch | Source/build evidence, browser/network proof pending |
| Legacy worksheet link/New | Existing hash IDs/edit keys preserved; query remembers cap-table | New remounts only the worksheet, retains cap-table selection and analysis state without document reload | Routing regression tests; actual New interaction pending |
| Refresh/leave with analyses | Browser confirmation requested and export warning shown | beforeunload is browser-dependent; cannot guarantee recovery; export remains necessary | No durable save claim |
| Worksheet loading/error/permissions | Existing worksheet loading/error controls remain | UI presence does not establish service authorization; no live service was changed | Operational proof pending |

Original v0 records may be real: do not clear them, scrape browser storage or load demo examples into their origin. Cross-origin migration needs an explicit original-site export and validated rehearsal. Source records and source-qualified identities remain separate from cap-table edit-key authority. Financial statements must not enter telemetry, screenshots or public test fixtures.

## Acceptance and roadmap

- [x] One application entry with shared navigation and lazily mounted cap-table; existing worksheet source retained.
- [x] Analysis journey candidate and truthful memory/unknown-data warnings.
- [x] Pure synchronous totals and legacy-link regression tests added.
- [ ] Complete final native CI qualification at the exact integration revision and record receipt.
- [ ] Demonstrate synthetic enter→calculate→retain→reopen→compare→export/import, including failure/recovery and module switches.
- [ ] Verify legacy hash link and worksheet New without losing analysis records unnoticed.
- [ ] Keyboard/focus, representative screen reader, contrast, target sizing, zoom/reflow and mobile checks against WCAG2.2AA baseline; record exceptions.
- [ ] Harmonize analysis layout with existing semantic tokens after actual visual review; approved branding remains unknown.
- [ ] Owner accepts financial formula/basis/migration contract; real records exported and reconciliation rehearsed before retirement.
- [ ] Establish a measured performance baseline; proposed field targets p75 LCP≤2.5s, INP≤200ms, CLS≤0.1. Bundle size is not field performance evidence.
- [ ] Release authority, backend resources, privacy, recovery and production observation qualified separately from merge.

This design record documents current evidence and intended checks. File presence, a passing build or a component-library choice does not establish usability, accessibility, safe migration or production acceptance.

Unified worksheet New uses an optional Page callback: the shell clears only the worksheet hash via history.replaceState and increments only the worksheet key. Analysis remains mounted and the document does not reload. Existing standalone Page behavior remains as fallback when no callback is supplied. Actual browser preservation still needs demonstration.

## Approved register extension

Owner requires persistent approved cap-table with project-admin RBAC and balance-sheet linkage, using Finance cap-table model. Current anonymous shared-edit-link Worker does not supply that RBAC or an authoritative equity register. Proposal/version approval, company-scoped server authorization, audit/restore and accepted accounting mapping remain outstanding; see docs/project/approved-equity-register.md. Existing example/scenario values are not an approved opening register.

## Approved register extension

Owner requires persistent approved cap-table with project-admin RBAC and balance-sheet linkage, using Finance cap-table model. Current runtime uses shared worksheet edit links; intended company_users admin schema exists in financial-toolkit migration but is not wired to authenticated runtime approval. Identity/membership verification, transactional version approval, audit/restore and accepted accounting mapping remain outstanding; see docs/project/approved-equity-register.md. Example/scenario values are not an approved opening register.

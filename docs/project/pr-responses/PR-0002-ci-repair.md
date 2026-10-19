# Finance CI and calculator repair

## Owner outcome

Real calculator results now reach the dashboard instead of silently turning into zero. Signed accumulated depreciation reduces assets. Favorable weekly revenue/spending variances no longer count as misses. Missing public calculator contracts are explicit and compiler checked.

The collections rule is unchanged: urgency band first, then largest debt. The owner confirmed this decision on 19 October 2026.

## Evidence and test corrections

The original PR revision failed lint with 34 explicit-any and 17 unused-declaration errors. Candidate `3808c145` passed hosted lint and executed the full suite: 175 passed, 14 failed. Its new integration regression passed. This exposed previously unreachable failures rather than qualifying the application.

The follow-up fixes source arithmetic and documents these test corrections:

| Test defect | Correction and preserved check |
|---|---|
| Balance-sheet fixture had assets of 4,200,000 but liabilities plus equity of 4,150,000 | Increase fixture retained earnings by 50,000; assert balanced equity of 2,150,000 and recompute its exact leverage ratio. The balance equation remains asserted. |
| Salary-positive fixture had 200,000 cash against a required 216,000 reserve | Supply 300,000 for the positive case. New boundary tests independently reject 200,000 and accept exactly 216,000. Production reserve policy is unchanged. |
| Crisis fixture never reached a crisis runway | Give that fixture opening cash of 10,000. The urgent recommendation assertion remains. |
| CAPEX wording check rejected capitalized “Budget” | Match the same word without case sensitivity. |
| Payroll division expected a truncated floating-point value exactly | Check the same expected monetary amount within half a cent; production calculation is unchanged. |
| KPI test assumed beating a benchmark meant exceeding a target | Assert no top performers for the original data, then assert one for a genuinely exceeded target. Production ranking is unchanged. |
| Tax integration used a fixed March 2026 due date with today's clock | Fix both the test clock and generated fixture dates to 1 January 2026, restoring meaningful overdue/upcoming assertions. |
| Collections test contradicted documented implementation policy | Assert the owner-confirmed largest-debt ordering within urgency bands, including all three ordered customers. |
| Weekly integration asserted cash-in growth without recording cash-in | Record cash-in alongside collections in both fixture weeks. |
| Weekly trend conflated raw revenue growth with target-attainment change | Assert positive revenue change and stable target attainment when both endpoint weeks meet their targets. Favorable variances have a separate regression. |

No tests were skipped, no lint/type rules disabled, and no failing assertion was deleted without a specific replacement and rationale above.

## Verification and limits

Local frozen pnpm 9.15.9 installation completed using a workspace-local store and hoisted layout because Windows denied dependency symlinks. Jest also uses a workspace-local cache. These are local invocation options, not repository policy changes.

The follow-up candidate passes all 192 tests in 15 suites locally, TypeScript project compilation, and Vite production bundling. Exact-revision hosted CI remains the merge gate. The workflow keeps frozen installation, lint, tests and build, removes a duplicate install, pins actions/runtime/package manager, uses read-only repository permissions and a 15-minute limit.

This qualifies tested calculator behavior and buildability. It does not certify tax-law correctness, live integrations, production deployment or user acceptance. No live financial data, secrets or deployment commands were used.

# Finance

One canonical project and application for financial-statement analysis and cap-table modelling. The useful blcbk analysis journeys now live beside Finance's existing cap-table in this repository; a separate blcbk application is not required by this source. The original source histories remain available.

Status: **integrated synthetic-data prototype**, updated 19 October 2026. The owner confirms neither prior version is in use and all existing data is synthetic. This is not yet an authenticated, durable, production-qualified financial system.

## Start here

- [Roadmap, checklist and current gaps](docs/project/finance-roadmap.md)
- [Frontend design contract](design.md)
- [Approved cap-table and balance-sheet requirements](docs/project/approved-equity-register.md)
- [Analysis provenance](app/src/app/financial-analysis/PROVENANCE.md)

The analysis screen calculates results, retains/reopens entries in the current tab, supports compatible comparisons and versioned JSON export/import, and shares navigation with the cap-table. **Export before leaving:** retained analyses are in memory, not saved to an account. Worksheet edit links are not authenticated project-admin roles.

## Frontend prototype on this computer

Use Node 22.23.3 and pnpm 9.15.9, matching the qualified CI configuration. From the repository root in PowerShell:

```powershell
cd app
pnpm install --frozen-lockfile
$env:VITE_BACKEND_URL = 'http://127.0.0.1:8787'
pnpm exec vite --host 127.0.0.1
```

Open the local address Vite prints. The explicit backend URL prevents the inherited development fallback from contacting the hosted Worker. It is a public connection setting, not a secret. No local Worker is started by these commands; cap-table collaboration and backend persistence require a separately qualified local backend. Analysis itself can be explored with synthetic inputs.

The root backend-development scripts and Worker setup remain available in source, but the Worker lockfile, runtime resources and recovery path still need qualification. Do not treat their presence as evidence of a working local or live datastore. Never use synthetic checks against real financial data.

## Verify the application

From `app/`:

```text
pnpm run lint
pnpm test
node scripts/verify-analysis-transfer.mjs
node scripts/verify-document-shell.mjs
pnpm run build
```

The unified candidate passed 199 native tests in 17 suites, 59 transfer assertions, lint and TypeScript/Vite build. Six isolated browser checks passed for initial network isolation, fresh totals, actual-input JSON export, retained-entry reopen, cap-table opening and state preservation across module switches. These are bounded synthetic checks. Full import/comparison, legacy links/New, accessibility/mobile, live authorization, backup and recovery still need evidence.

## Releases require a separate owner action

**Merging to `main` does not deploy Finance.** The `Deploy to Cloudflare Workers` workflow is manually dispatched from `main`, with explicit confirmation and the full qualified revision. It checks a successful main-push CI run and existing BOS resource bindings before frozen installs/build/deployment. It does not create a database, run migrations or repair missing resources.

No production release has been approved by the source consolidation. Missing release credentials, unreconciled BOS database/bindings and Worker dependency/lock qualification currently block release. Required-reviewer protection on the GitHub production environment has not been established. Complete the roadmap and release/recovery review before dispatching a release; do not put tokens in source or browser variables.

Persistent approved cap-table versions, server-enforced project-admin approval, audit transactions, durable analysis storage and approved accounting projection into the balance sheet remain required features. Scenarios and valuations must not masquerade as approved book equity. Old repositories and deployments have not been retired.

## Source layout

| Path | Purpose |
|---|---|
| `app/` | Unified React analysis and cap-table frontend |
| `worker/` | Existing Cloudflare API, worksheet and collaboration implementation |
| `scripts/release-preflight*` | Release source/resource guard and denial tests |
| `docs/project/` | Authoritative roadmap and approval requirements |
| `.github/workflows/` | Application checks and explicit release control |

Retain the repository's existing licence and third-party attribution when reusing code. Keep financial records, authentication material and deployment credentials out of Git and telemetry.

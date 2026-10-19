# Unified Finance feature provenance

New implementation following the inspected guided-entry, results, saved-analysis and comparison journeys of KingSingOS/v0-blcbk at 16b0d24b1eff7d1c7e21028aec6fb362efe1e4c2. No original v0 component implementation was copied. Existing Finance and third-party notices remain effective; no license reassignment is claimed.

This feature is mounted by FinanceWorkspace.tsx inside the existing Vite app. main.tsx canonicalizes legacy hash-only worksheet links to ?tool=cap-table without changing the hash. Analysis stays mounted during module switches. The worksheet loads only on explicit selection or a legacy worksheet link, then its existing service remains active.

Analysis records remain in memory. Explicit file export/import is available. The beforeunload guard requests the browser confirmation when records exist, for actual document navigation/reload; browser support and user interaction requirements mean this does not replace exporting records. Currency and missing amounts stay explicit.

Native verification uses the dependency-qualified finance-remediation scratch overlay, with exact changed paths recorded in outputs/finance-unified-ui.md. Run from its app folder: node ../node_modules/typescript/bin/tsc -b; node ../node_modules/eslint/bin/eslint.js .; node ../node_modules/vite/bin/vite.js build; node ../node_modules/jest/bin/jest.js --maxWorkers=1 --maxConcurrency=1 --cacheDirectory ./node_modules/.cache/jest. No dependencies were installed or production resources changed.

Unified worksheet New uses an optional Page callback: the shell clears only the worksheet hash via history.replaceState and increments only the worksheet key. Analysis remains mounted and the document does not reload. Existing standalone Page behavior remains as fallback when no callback is supplied. Actual browser preservation still needs demonstration.

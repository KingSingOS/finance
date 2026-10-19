# Shared project practice — staged adoption

This additive adapter supplies the common working practice. The current mapping is in adoption.json. State remains adoption-in-progress until a real project outcome, native checks and owner acceptance are recorded. The CI check verifies these adapter files only.

## Work formula

1. Establish the problem, user value, appetite, owner and smallest useful outcome.
2. Confirm source identity, existing changes, domain/data risk and current task authority. Preserve native records; resolve missing mappings before implementation.
3. Build one bounded vertical slice. Use a relevant task/stack skill; independent workers need separate scopes and a named integrator. Scope/retry/time budgets remain explicit.
4. Verify actual user behavior, failures and relevant security boundaries. Keep evidence tied to revision and environment. Do not weaken tests to get green.
5. Present an owner-readable PR: before/after, demonstration, checks and limitations, risks/cost, recommended choice and exact decision. Technical verification, acceptance, merge and release are different events.
6. Observe delivered behavior and recovery. Record recurring failures and measured improvements. Preserve checkpoints and known-good versions.

## Skills and intelligence

Use the shared solo-build skill when installed, plus task-specific disciplines. This repository does not install skills or override existing client configuration. skills.json identifies the shared route and qualification limits. Version candidate skill changes; evaluate activation, coexistence and outcomes on baseline/held-out cases, then review/canary/retain or roll back. Do not let candidates change acceptance or permissions.

Use direct source reads for exact facts. Use a current local code graph for impact/call paths when it helps. Use document graphs only for approved corpora. Confirm every important graph finding against source/tests; indexes are not authority or security proof. intelligence.json defaults external providers and indexing to disabled/unconfigured. No model API, GPU service, install, hook, daemon or semantic upload is enabled.

## Completion and gaps

Run `python -B .solo-build/verify.py` for structural integrity. It executes no project commands. Run appropriate native product checks separately. Unknown profile, owner task mapping, missing checks and unavailable environments stay explicit. Configuration files and green adapter CI do not certify a secure or working product.

Use the template repo under this repository's owner for future new repos; existing projects adopt by additive reviewed changes. Live state databases, secrets and generated indexes belong outside versioned source and synchronized state folders unless explicitly qualified. Existing production/release and domain controls remain effective.
